'use client';

// react
import { useCallback, useState } from 'react';
// components
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
// schemas
import {
    CreateUpdateDiagnosisSchema,
    type ICreateUpdateDiagnosisPayload,
    type IDiagnosisData,
} from 'src/core/schemas';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pkgs
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export default function useNewEditDiagnosis() {
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const methods = useForm<ICreateUpdateDiagnosisPayload>({
        resolver: zodResolver(CreateUpdateDiagnosisSchema),
        defaultValues: {
            clientId: 0,
            date: '',
            leftAxis: '',
            leftSphere: '',
            leftCylinder: '',
            rightAxis: '',
            rightSphere: '',
            rightCylinder: '',
            addition: '',
            notes: '',
            diagnoses: []
        },
    });

    const { watch, reset, control, setValue, handleSubmit, formState: { isSubmitting } } = methods;
    const { fields, append, remove, replace } = useFieldArray({ control, name: 'diagnoses' });

    const cliID = watch('clientId');

    const loadClientDiagnoses = useCallback(async (clientId: number) => {
        if (!clientId) {
            replace([]);
            return;
        }

        try {
            const resp = await ax.get<{ diagnoses: IDiagnosisData[] }>(API_ENDPOINTS.admin.diagnosis.search(clientId));

            const formattedDiagnoses = resp.data.diagnoses.map(diagnosis => ({
                diagnosisId: diagnosis.id ?? 0,
                clientId: diagnosis.clientId || 0,
                date: diagnosis.date || '',
                leftAxis: diagnosis.leftAxis || '',
                leftSphere: diagnosis.leftSphere || '',
                leftCylinder: diagnosis.leftCylinder || '',
                rightAxis: diagnosis.rightAxis || '',
                rightSphere: diagnosis.rightSphere || '',
                rightCylinder: diagnosis.rightCylinder || '',
                addition: diagnosis.addition || '',
                notes: diagnosis.notes || '',
            }));

            replace(formattedDiagnoses);
        } catch (error: any) {
            toast.error(error.message);
            replace([]);
        }
    }, [replace]);

    const handleClientChange = useCallback((clientId: number) => {
        setValue('clientId', clientId);
        if (clientId > 0) loadClientDiagnoses(clientId);
        else replace([]);
    }, [setValue, loadClientDiagnoses, replace]);

    const addToTable = useCallback(() => {
        const currentValues = watch();

        const newDiagnosis = {
            diagnosisId: editIndex !== null ? fields[editIndex]?.diagnosisId ?? 0 : 0,
            clientId: currentValues.clientId,
            date: currentValues.date,
            leftAxis: currentValues.leftAxis,
            leftSphere: currentValues.leftSphere,
            leftCylinder: currentValues.leftCylinder,
            rightAxis: currentValues.rightAxis,
            rightSphere: currentValues.rightSphere,
            rightCylinder: currentValues.rightCylinder,
            addition: currentValues.addition,
            notes: currentValues.notes,
        };

        if (editIndex !== null) {
            const updatedFields = [...fields];
            updatedFields[editIndex] = newDiagnosis as any;
            replace(updatedFields);
            setEditIndex(null);
        } else {
            append(newDiagnosis);
        }

        // Limpiar formulario
        setValue('date', '');
        setValue('leftAxis', '');
        setValue('leftSphere', '');
        setValue('leftCylinder', '');
        setValue('rightAxis', '');
        setValue('rightSphere', '');
        setValue('rightCylinder', '');
        setValue('addition', '');
        setValue('notes', '');
    }, [append, watch, setValue, fields, replace, editIndex]);

    const loadDiagnosis = useCallback((index: number) => {
        const diagnosisItem = fields[index];
        if (!diagnosisItem) return;
        setEditIndex(index);

        setValue('date', diagnosisItem.date || '');
        setValue('leftAxis', diagnosisItem.leftAxis || '');
        setValue('leftSphere', diagnosisItem.leftSphere || '');
        setValue('leftCylinder', diagnosisItem.leftCylinder || '');
        setValue('rightAxis', diagnosisItem.rightAxis || '');
        setValue('rightSphere', diagnosisItem.rightSphere || '');
        setValue('rightCylinder', diagnosisItem.rightCylinder || '');
        setValue('addition', diagnosisItem.addition || '');
        setValue('notes', diagnosisItem.notes || '');
    }, [fields, setValue]);

    const onSubmit = useCallback(async (formValues: ICreateUpdateDiagnosisPayload) => {
        try {
            if (!formValues.clientId) {
                toast.error('Debe seleccionar un cliente antes de guardar');
                return;
            }
            
            /*
            if (formValues.diagnoses.length === 0) {
                toast.info('No hay diagnósticos para guardar');
                return;
            }*/

            const resp = await ax.post(API_ENDPOINTS.admin.diagnosis.upsert, formValues);

            toast.success(resp.data?.message || 'Diagnósticos guardados exitosamente');
            await loadClientDiagnoses(formValues.clientId);
            //reset();
        } catch (error: any) {
            toast.error(error.message || 'Error guardando diagnósticos');
        }
    }, [reset, loadClientDiagnoses]);

    return {
        cliID,
        editIndex,
        control,
        methods,
        isSubmitting,
        handleSubmit,
        fields,
        append,
        remove,
        addToTable,
        loadDiagnosis,
        handleClientChange,
        onSubmit,
    }
}