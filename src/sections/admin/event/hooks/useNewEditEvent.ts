'use client';

// react
import { useCallback, useEffect, useMemo, useState } from 'react';
// components
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
// routes
import { useRouter } from 'src/routes/hook';
// schemas
import {
  CreateUpdateMessageEventSchema,
  type ICreateUpdateMessageEventPayload,
  type IMessageEventData,
} from 'src/core/schemas';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
import { dayjs } from 'src/libs/dayjs';
// pkgs
import { toast } from 'sonner';

// ----------------------------------------------------------------------

interface useNewEditEventProps {
  event?: IMessageEventData;
}

// ----------------------------------------------------------------------

export default function useNewEditEvent({ event }: useNewEditEventProps) {
  const router = useRouter();
  const isEdit = !!event;
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const defaultValues = useMemo<ICreateUpdateMessageEventPayload>(
    () => ({
      name: event?.name || '',
      type: event?.type || 'CUSTOM',
      eventDate:
        (event?.type ?? 'CUSTOM') === 'CUSTOM'
          ? event?.eventDate
            ? dayjs(event.eventDate).toDate()
            : dayjs().toDate()
          : null,
      isActive: event?.isActive || true,
      templateId: event?.template.id || 0,
    }),
    [event]
  );

  useEffect(() => {
    if (event) {
      setValue('name', event.name);
      setValue('type', event.type);
      setValue('eventDate', event.eventDate);
      setValue('isActive', event.isActive);
      setValue('templateId', event.template.id);
    } else {
      setValue('name', '');
      setValue('type', 'CUSTOM');
      setValue('eventDate', new Date());
      setValue('isActive', true);
      setValue('templateId', 0);
    }
  }, [event]);

  const methods = useForm({
    resolver: zodResolver(CreateUpdateMessageEventSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (formValues: ICreateUpdateMessageEventPayload) => {
      try {
        if (isEdit) {
          const resp = await ax.put(API_ENDPOINTS.admin.event.update(event.id), formValues);
          toast.success(resp.data.message);
        } else {
          const resp = await ax.post(API_ENDPOINTS.admin.event.create, formValues);
          toast.success(resp.data.message);
        }

        setIsSuccess(true);
        reset();
        router.refresh();
      } catch (error) {
        console.error('Error:', error);
        toast.error(error.message);
      }
    },
    [event, reset, isEdit, router]
  );

  const handleCancel = useCallback(() => {
    clearErrors();
    reset(defaultValues);
  }, [clearErrors, reset, defaultValues]);

  const resetSuccess = useCallback(() => {
    setIsSuccess(false);
  }, []);

  return {
    //^ states
    isEdit,
    isSuccess,
    //* hookform
    control,
    methods,
    isSubmitting,
    handleSubmit,
    //& methods
    handleCancel,
    resetSuccess,
    onSubmit,
  };
}
