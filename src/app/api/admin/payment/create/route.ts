// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// schemas
import { CreatePaymentSchema, type ICreatePaymentPayload } from "src/core/schemas";
// generated
import { Decimal } from "src/generated/prisma/runtime/client";

// ----------------------------------------------------------------------

const isGreaterThan = (a: number, b: number, epsilon = 0.001): boolean => {
    const roundedA = Math.round(a * 100) / 100;
    const roundedB = Math.round(b * 100) / 100;
    return roundedA > roundedB + epsilon;
};

//* CREATE PAYMENT
export async function POST(request: Request) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
        const data: ICreatePaymentPayload = await request.json();
        const validationSchema = CreatePaymentSchema.safeParse(data);

        if (!validationSchema.success) {
            const errorMessages = validationSchema.error.issues
                .map((err) => `${err.path.join('.')}: ${err.message}`)
                .join('; ');

            return NextResponse.json(
                { message: errorMessages },
                { status: 400 }
            );
        }

        const parsed = validationSchema.data;

        // 1. Validar que el monto sea positivo
        const roundedAmount = Math.round(parsed.amount * 100) / 100;
        if (roundedAmount <= 0) {
            return NextResponse.json(
                { message: 'El monto del pago debe ser mayor a 0' },
                { status: 400 }
            );
        }

        // 2. Obtener la nota de venta para validar saldo pendiente
        const saleNote = await db.saleNote.findUnique({
            where: { id: parsed.noteId },
            select: {
                id: true,
                total: true,
                creditStatus: true,
                payments: {
                    select: {
                        amount: true
                    }
                }
            }
        });

        if (!saleNote) {
            return NextResponse.json(
                { message: 'La nota de venta no existe o ha sido eliminada' },
                { status: 404 }
            );
        }

        // 3. Calcular el total pagado hasta ahora
        const totalPaid = saleNote.payments.reduce(
            (sum, payment) => sum + Number(payment.amount),
            0
        );

        // 4. Calcular saldo pendiente (redondeando a 2 decimales)
        const totalAmount = Number(saleNote.total);
        const pendingBalance = Math.round((totalAmount - totalPaid) * 100) / 100;

        // 5. Validar si ya está completamente pagado (con tolerancia)
        if (pendingBalance <= 0.001) { // Tolerancia de 0.001 centavos
            return NextResponse.json(
                {
                    message: 'Esta nota de venta ya está completamente pagada',
                    details: {
                        total: totalAmount,
                        paid: totalPaid,
                        pending: pendingBalance
                    }
                },
                { status: 400 }
            );
        }

        // 6. Validar que el pago no exceda el saldo pendiente (con tolerancia)
        if (isGreaterThan(roundedAmount, pendingBalance)) {
            return NextResponse.json(
                {
                    message: 'El monto del pago excede el saldo pendiente',
                    details: {
                        paymentAmount: roundedAmount,
                        pendingBalance: pendingBalance,
                        maximumAllowed: pendingBalance,
                        currentPaid: totalPaid,
                        total: totalAmount,
                        // Para debugging
                        comparison: {
                            paymentRounded: roundedAmount,
                            balanceRounded: pendingBalance,
                            difference: roundedAmount - pendingBalance
                        }
                    },
                    suggestion: `El monto máximo permitido es $${pendingBalance.toFixed(2)}`
                },
                { status: 400 }
            );
        }

        // 7. Calcular el nuevo estado de crédito
        const newTotalPaid = Math.round((totalPaid + roundedAmount) * 100) / 100;
        const newPendingBalance = Math.round((totalAmount - newTotalPaid) * 100) / 100;

        let newCreditStatus = saleNote.creditStatus;

        if (newPendingBalance <= 0.001) { // Si el nuevo saldo es 0 o negativo (con tolerancia)
            newCreditStatus = 'PAID';
        } else if (newTotalPaid > 0.001 && newTotalPaid < totalAmount) {
            newCreditStatus = 'PARTIAL';
        }

        // 8. Registrar el pago y actualizar la nota de venta en una transacción
        const result = await db.$transaction(async (tx) => {
            // Registrar el pago con el monto redondeado
            const payment = await tx.payment.create({
                data: {
                    ...parsed,
                    amount: new Decimal(roundedAmount),
                },
            });

            // Actualizar el estado de crédito de la nota de venta
            await tx.saleNote.update({
                where: { id: parsed.noteId },
                data: {
                    creditStatus: newCreditStatus
                }
            });

            return payment;
        });

        // 9. Preparar respuesta con montos redondeados
        const responseData = {
            paymentId: result.id,
            saleNoteId: parsed.noteId,
            amount: roundedAmount,
            paymentMethod: parsed.paymentMethod,
            reference: parsed.reference,
            newCreditStatus,
            financialSummary: {
                previousPaid: Math.round(totalPaid * 100) / 100,
                newTotalPaid,
                totalAmount: Math.round(totalAmount * 100) / 100,
                previousPending: pendingBalance,
                newPendingBalance,
                paymentPercentage: (roundedAmount / totalAmount * 100).toFixed(2) + '%'
            }
        };

        return NextResponse.json(
            {
                message: 'Pago registrado correctamente',
                data: responseData
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error al registrar pago:', error);

        // Manejar errores específicos de Prisma
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'Ya existe un pago con esta referencia' },
                { status: 400 }
            );
        }

        if (error.code === 'P2003') {
            return NextResponse.json(
                { message: 'La nota de venta no existe o el ID es inválido' },
                { status: 404 }
            );
        }

        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'La nota de venta no fue encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

// Función para enviar correo (opcional)
async function sendPaymentEmail(paymentData: any) {
    try {
        // Implementa el envío de correo aquí
        console.log('Datos para enviar correo:', {
            to: paymentData.clientInfo?.clientEmail,
            clientName: paymentData.clientInfo?.clientName,
            folio: paymentData.saleNoteInfo?.folio,
            amount: paymentData.amount,
            newBalance: paymentData.financialSummary.newPendingBalance,
            paymentMethod: paymentData.paymentMethod
        });

        // Ejemplo de implementación:
        /*
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: paymentData.clientInfo.clientEmail,
            subject: `Confirmación de Pago - Nota ${paymentData.saleNoteInfo.folio}`,
            html: `
                <h2>Confirmación de Pago</h2>
                <p>Estimado(a) ${paymentData.clientInfo.clientName},</p>
                <p>Se ha registrado un pago exitoso con los siguientes detalles:</p>
                <ul>
                    <li><strong>Nota de Venta:</strong> ${paymentData.saleNoteInfo.folio}</li>
                    <li><strong>Monto del pago:</strong> $${paymentData.amount.toFixed(2)}</li>
                    <li><strong>Método de pago:</strong> ${paymentData.paymentMethod}</li>
                    <li><strong>Nuevo saldo pendiente:</strong> $${paymentData.financialSummary.newPendingBalance.toFixed(2)}</li>
                    <li><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-MX')}</li>
                </ul>
                <p>Gracias por su pago.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        */
    } catch (emailError) {
        console.error('Error al enviar correo:', emailError);
        // No fallar el pago solo por error en el correo
    }
}