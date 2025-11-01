'use client';

// react
import { useCallback, useEffect, useMemo, useState } from 'react';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// components
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// schemas
import {
    CreateUpdateClientSchema,
    type ICFDIUse,
    type IClientData,
    type IPaymentForm,
    type IPaymentMethod,
    type ITaxRegime,
    type ICreateUpdateClientPayload,
    type IDiagnosisItem
} from 'src/core/schemas';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pckgs
import { toast } from 'sonner';

// ----------------------------------------------------------------------

interface useEditClientProps {
    client: IClientData;
}

// ----------------------------------------------------------------------

export default function useEditClient({ client }: useEditClientProps) {
    const router = useRouter();

    const defaultValues = useMemo<ICreateUpdateClientPayload>(() => ({
        enableTaxInfo: client.taxInfo?.rfc ? true : false,
        // CLIENT PERSONAL INFO DATA
        firstName: client.firstName || '',
        lastName: client.lastName || '',
        birthDate: client.birthDate || '',
        email: client.email || '',
        phone: client.phone || '',
        type: client.type || 'INDIVIDUAL',
        observations: client.observations || '',
        // CLIENT TAX INFO DATA
        rfc: client.taxInfo?.rfc || '',
        businessName: client.taxInfo?.businessName || '',
        billingEmail: client.taxInfo?.billingEmail || '',
        postalCode: client.taxInfo?.postalCode || '',
        cfdiUse: client.taxInfo?.cfdiUse as ICFDIUse || 'G01',
        taxRegime: client.taxInfo?.taxRegime as ITaxRegime || '601',
        paymentMethod: client.taxInfo?.paymentMethod as IPaymentMethod || 'PUE',
        paymentForm: client.taxInfo?.paymentForm as IPaymentForm || '01',
        address: client.taxInfo?.address || '',
        // CLIENT DIAGNOSES INFO DATA
        date: '',
        leftAxis: '',
        leftSphere: '',
        leftCylinder: '',
        rightAxis: '',
        rightSphere: '',
        rightCylinder: '',
        addition: '',
        notes: '',
        diagnoses: [...client.diagnoses]
    }), [client]);

    const methods = useForm({
        resolver: zodResolver(CreateUpdateClientSchema),
        defaultValues
    });

    const {
        reset,
        watch,
        control,
        setValue,
        resetField,
        handleSubmit,
        formState: { isSubmitting }
    } = methods;

    //* ----------------------------------------------------------------------
    //* CLIENT DATA HANDLERS -------------------------------------------------
    //* ----------------------------------------------------------------------
    // -- REACTIVE WATCH --
    const isTaxInfoEnabled = watch('enableTaxInfo');

    // -- EFFECT TO RESET TAX INFO FORM --
    useEffect(() => {
        if (!isTaxInfoEnabled) {
            handleResetTaxInfoData();
        }
    }, [isTaxInfoEnabled]);

    // -- RESET TAX INFO FORM --
    const handleResetTaxInfoData = () => {
        resetField("rfc");
        resetField("businessName");
        resetField("billingEmail");
        resetField("postalCode");
        resetField("cfdiUse");
        resetField("taxRegime");
        resetField("paymentMethod");
        resetField("paymentForm");
        resetField("address");
    }

    //^ ----------------------------------------------------------------------
    //^ DIAGNOSIS DATA HANDLERS ----------------------------------------------
    //^ ----------------------------------------------------------------------
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const { fields, append, remove, replace } = useFieldArray({ control, name: 'diagnoses' });

    // -- REACTIVE WATCH --
    const formFields = watch();
    const diagnosisTable = watch('diagnoses');

    // -- ADD DIAGNOSE TO TABLE --
    const addDiagnoseItem = useCallback(() => {
        const newDiagnosisItem: IDiagnosisItem = {
            date: formFields.date || '',
            //
            leftAxis: formFields.leftAxis,
            leftSphere: formFields.leftSphere,
            leftCylinder: formFields.leftCylinder,
            //
            rightAxis: formFields.rightAxis,
            rightSphere: formFields.rightSphere,
            rightCylinder: formFields.rightCylinder,
            //
            addition: formFields.addition,
            notes: formFields.notes
        }

        if (editIndex !== null) {
            const updatedFields = [...fields];
            updatedFields[editIndex] = newDiagnosisItem as any;
            replace(updatedFields);
            setEditIndex(null);
            toast.success('Diagnóstico actualizado', {
                description: "El diagnóstico seleccionado se ha actualizado",
            });

        } else {
            append(newDiagnosisItem);
            toast.success('Diagnóstico agregado', {
                description: "El diagnóstico se ha agregado a la lista",
            });
        }

        setValue('date', '');
        //
        setValue('leftAxis', '');
        setValue('leftSphere', '');
        setValue('leftCylinder', '');
        //
        setValue('rightAxis', '');
        setValue('rightSphere', '');
        setValue('rightCylinder', '');
        //
        setValue('addition', '');
        setValue('notes', '');
    }, [append, fields, setValue, replace, editIndex, formFields]);

    // -- REMOVE DIAGNOSE FROM TABLE --
    const removeDiagnoseItem = useCallback((index: number) => {
        const diagnoseToRemove = diagnosisTable[index];

        remove(index);
        setEditIndex(null);

        if (diagnoseToRemove) {
            toast.success('Diagnóstico eliminado', {
                description: `Diagnóstico eliminado de la lista`,
            });
        }

        setValue('date', '');
        //
        setValue('leftAxis', '');
        setValue('leftSphere', '');
        setValue('leftCylinder', '');
        //
        setValue('rightAxis', '');
        setValue('rightSphere', '');
        setValue('rightCylinder', '');
        //
        setValue('addition', '');
        setValue('notes', '');
    }, [diagnosisTable, setValue, remove]);

    // -- EDIT DIAGNOSE ITEM --
    const editDiagnoseItem = useCallback((index: number) => {
        const diagnoseToEdit = diagnosisTable[index];
        if (!diagnoseToEdit) return;
        setEditIndex(index);

        setValue('date', diagnoseToEdit.date);
        //
        setValue('leftAxis', diagnoseToEdit.leftAxis || '');
        setValue('leftSphere', diagnoseToEdit.leftSphere || '');
        setValue('leftCylinder', diagnoseToEdit.leftCylinder || '');
        //
        setValue('rightAxis', diagnoseToEdit.rightAxis || '');
        setValue('rightSphere', diagnoseToEdit.rightSphere || '');
        setValue('rightCylinder', diagnoseToEdit.rightCylinder || '');
        //
        setValue('addition', diagnoseToEdit.addition || '');
        setValue('notes', diagnoseToEdit.notes || '');
    }, [diagnosisTable, setValue, editIndex]);

    // ----------------------------------------------------------------------

    const sendForm = useCallback(async (formValues: ICreateUpdateClientPayload) => {
        try {
            const resp = await ax.put(API_ENDPOINTS.admin.client.update(client.id), formValues);
            toast.success(resp.data.message);

            reset();
            router.refresh();
            router.replace(paths.admin.client.list);
        } catch (error: any) {
            toast.error(error.message);
        }
    }, [reset, router]);

    return {
        //~
        isSubmitting,
        handleSubmit,
        sendForm,
        methods,
        control,
        //*
        isTaxInfoEnabled,
        handleResetTaxInfoData,
        //^
        fields,
        editIndex,
        addDiagnoseItem,
        editDiagnoseItem,
        removeDiagnoseItem,
    }
}
