interface EmailTemplateProps {
    firstName: string;
    paymentData: {
        folio: string;
        clientName: string;
        amount: number;
        paymentMethod: string;
        paymentMethodLabel: string;
        paymentDate: string;
        reference?: string;
        saleNoteId: string;
        previousBalance: number;
        newBalance: number;
        totalAmount: number;
        paymentPercentage: string;
        status: string;
    };
    settingsData: {
        name: string;
        phone: string;
    }
}

// ----------------------------------------------------------------------

export function EmailTemplate({ firstName, paymentData, settingsData }: EmailTemplateProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', color: '#333' }}>
            {/* Header */}
            <div style={{ backgroundColor: '#4F46E5', padding: '20px', borderRadius: '8px 8px 0 0', textAlign: 'center' }}>
                <h1 style={{ color: 'white', margin: 0 }}>✅ Confirmación de Pago</h1>
                <p style={{ color: '#E0E7FF', marginTop: '10px' }}>
                    Gracias por tu pago, {firstName}
                </p>
            </div>

            {/* Main Content */}
            <div style={{ backgroundColor: '#F9FAFB', padding: '30px', borderRadius: '0 0 8px 8px', border: '1px solid #E5E7EB' }}>
                {/* Payment Summary */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#111827', marginTop: 0, borderBottom: '2px solid #4F46E5', paddingBottom: '10px' }}>
                        Resumen del Pago
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                        <div>
                            <p style={{ margin: '8px 0', fontSize: '14px', color: '#6B7280' }}>Folio/Nota:</p>
                            <p style={{ margin: '8px 0', fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>
                                #{paymentData.folio || paymentData.saleNoteId}
                            </p>
                        </div>

                        <div>
                            <p style={{ margin: '8px 0', fontSize: '14px', color: '#6B7280' }}>Estado:</p>
                            <p style={{ margin: '8px 0', fontSize: '16px', fontWeight: 'bold', color: paymentData.status === 'PAID' ? '#10B981' : '#F59E0B' }}>
                                {paymentData.status === 'PAID' ? '✅ Pagado' : '🔄 Parcial'}
                            </p>
                        </div>

                        <div>
                            <p style={{ margin: '8px 0', fontSize: '14px', color: '#6B7280' }}>Fecha de Pago:</p>
                            <p style={{ margin: '8px 0', fontSize: '16px', color: '#111827' }}>
                                {paymentData.paymentDate}
                            </p>
                        </div>

                        <div>
                            <p style={{ margin: '8px 0', fontSize: '14px', color: '#6B7280' }}>Método de Pago:</p>
                            <p style={{ margin: '8px 0', fontSize: '16px', color: '#111827' }}>
                                {paymentData.paymentMethodLabel || paymentData.paymentMethod}
                            </p>
                        </div>
                    </div>

                    {paymentData.reference && (
                        <div style={{ marginTop: '15px' }}>
                            <p style={{ margin: '8px 0', fontSize: '14px', color: '#6B7280' }}>Referencia:</p>
                            <p style={{ margin: '8px 0', fontSize: '16px', color: '#111827', backgroundColor: '#F3F4F6', padding: '10px', borderRadius: '4px' }}>
                                {paymentData.reference}
                            </p>
                        </div>
                    )}
                </div>

                {/* Financial Details */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#111827', marginTop: 0, borderBottom: '2px solid #4F46E5', paddingBottom: '10px' }}>
                        Detalles Financieros
                    </h2>

                    <div style={{ marginTop: '20px' }}>
                        {/* Payment Amount - Highlighted */}
                        <div style={{ backgroundColor: '#F0F9FF', padding: '20px', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #0EA5E9' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#0C4A6E' }}>Monto del Pago:</p>
                            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0C4A6E' }}>
                                {formatCurrency(paymentData.amount)}
                            </p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#0C4A6E' }}>
                                ({paymentData.paymentPercentage} del total)
                            </p>
                        </div>

                        {/* Balance Information */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#FEF3C7', borderRadius: '6px' }}>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#92400E' }}>Saldo Anterior:</p>
                                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#92400E' }}>
                                    {formatCurrency(paymentData.previousBalance)}
                                </p>
                            </div>

                            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#D1FAE5', borderRadius: '6px' }}>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#065F46' }}>Nuevo Saldo:</p>
                                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#065F46' }}>
                                    {formatCurrency(paymentData.newBalance)}
                                </p>
                            </div>
                        </div>

                        {/* Total Amount */}
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#F5F3FF', borderRadius: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#5B21B6' }}>
                                    Total de la Nota:
                                </p>
                                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#5B21B6' }}>
                                    {formatCurrency(paymentData.totalAmount)}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginTop: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '14px', color: '#6B7280' }}>Progreso de Pago</span>
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>
                                    {Math.round((paymentData.totalAmount - paymentData.newBalance) / paymentData.totalAmount * 100)}%
                                </span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        backgroundColor: '#10B981',
                                        width: `${(paymentData.totalAmount - paymentData.newBalance) / paymentData.totalAmount * 100}%`,
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                <span style={{ fontSize: '12px', color: '#6B7280' }}>Pagado: {formatCurrency(paymentData.totalAmount - paymentData.newBalance)}</span>
                                <span style={{ fontSize: '12px', color: '#6B7280' }}>Pendiente: {formatCurrency(paymentData.newBalance)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                {paymentData.newBalance > 0 && (
                    <div style={{ backgroundColor: '#FEF3C7', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #FBBF24' }}>
                        <h3 style={{ color: '#92400E', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>📋 Próximos Pasos</span>
                        </h3>
                        <p style={{ color: '#92400E', marginBottom: '15px' }}>
                            Todavía tienes un saldo pendiente de <strong>{formatCurrency(paymentData.newBalance)}</strong>.
                        </p>
                        <ul style={{ color: '#92400E', paddingLeft: '20px', margin: 0 }}>
                            <li>Tu próximo pago vence el: <strong>{(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('es-MX')}</strong></li>
                            <li>Puedes realizar pagos adicionales en cualquier momento</li>
                            <li>Para aclaraciones, contacta a nuestro equipo de soporte</li>
                        </ul>
                    </div>
                )}

                {/* Footer */}
                <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #E5E7EB', color: '#6B7280', fontSize: '14px' }}>
                    <p style={{ margin: '5px 0' }}>
                        Este correo es una confirmación automática de tu pago.
                    </p>
                    <p style={{ margin: '5px 0' }}>
                        Si tienes preguntas sobre este pago, contacta a nuestro equipo.
                    </p>
                    <p style={{ margin: '20px 0 10px 0' }}>
                        📞 {settingsData.phone}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '20px' }}>
                        © {new Date().getFullYear()} {settingsData.name}. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}