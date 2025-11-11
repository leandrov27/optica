'use client';

// react
import { useCallback, useEffect } from 'react';
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// components
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pkgs
import { toast } from 'sonner';
// schemas
import { CreateNoteSchema, type INoteProduct, type INoteDetailPayload, type ICreateNotePayload } from 'src/core/schemas';
// stores
import { useSettingsStore } from 'src/core/stores';

// ----------------------------------------------------------------------

// redondeo a 2 decimales
const round2 = (num: number) => Math.round(num * 100) / 100;

// ----------------------------------------------------------------------

export default function useCreateNote() {
  const router = useRouter();
  const settings = useSettingsStore((state) => state.settings);

  const methods = useForm({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: {
      clientId: 0,
      deliveryDate: null,
      requiresInvoice: false,
      subtotal: 0,
      discount: 0,
      total: 0,
      paymentForm: '01',
      notes: '',
      noteDetails: [],
    },
  });

  const { watch, reset, control, setValue, handleSubmit, clearErrors, formState: { isSubmitting } } = methods;
  const { append, remove } = useFieldArray({ control, name: 'noteDetails' });

  // -- WATCH TODOS LOS CAMPOS REACTIVOS --
  const noteDetails = watch('noteDetails');
  const subtotal = watch('subtotal');
  const discount = watch('discount');
  const total = watch('total');

  // -- CALCULATE AMOUNT FOR A SINGLE ITEM --
  const calculateItemAmount = useCallback((
    unitPrice: unknown,
    quantity: unknown,
    discountPct: unknown
  ): number => {
    const safeUnitPrice = Math.max(0, Number(unitPrice) || 0);
    const safeQuantity = Math.max(0, Number(quantity) || 0);
    const safeDiscountPct = Math.max(0, Math.min(100, Number(discountPct) || 0));

    const subtotal = safeUnitPrice * safeQuantity;
    const discountAmount = subtotal * (safeDiscountPct / 100);
    return round2(subtotal - discountAmount);
  }, []);

  // -- CALCULATE TOTALS --
  const calculateTotals = useCallback(() => {
    if (!noteDetails || noteDetails.length === 0) {
      setValue('subtotal', 0);
      setValue('discount', 0);
      setValue('total', 0);
      return;
    }

    const calculatedSubtotal = noteDetails.reduce((sum, item) => {
      const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
      const quantity = Math.max(0, Number(item.quantity) || 0);
      return sum + (unitPrice * quantity);
    }, 0);

    const calculatedDiscount = noteDetails.reduce((sum, item) => {
      const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
      const quantity = Math.max(0, Number(item.quantity) || 0);
      const discountPct = Math.max(0, Math.min(100, Number(item.discountPct) || 0));

      const itemSubtotal = unitPrice * quantity;
      return sum + (itemSubtotal * (discountPct / 100));
    }, 0);

    const calculatedTotal = Math.max(0, calculatedSubtotal - calculatedDiscount);

    setValue('subtotal', round2(calculatedSubtotal));
    setValue('discount', round2(calculatedDiscount));
    setValue('total', round2(calculatedTotal));
  }, [noteDetails, setValue]);

  // -- EFFECT TO UPDATE TOTALS --
  useEffect(() => {
    calculateTotals();
  }, [noteDetails]);

  // -- UPDATE SINGLE ITEM --
  const handleDetailChange = useCallback((index: number, field: 'quantity' | 'discountPct', value: string) => {
    const numericValue = Number(value);

    if (isNaN(numericValue) || numericValue < 0) {
      return;
    }

    if (field === 'discountPct' && (numericValue < 0 || numericValue > 100)) {
      toast.error('El descuento debe estar entre 0% y 100%');
      return;
    }

    const currentItem = noteDetails[index];
    if (!currentItem) return;

    // Obtener los valores ACTUALES del formulario (no de noteDetails que puede estar desactualizado)
    const currentUnitPrice = Number(currentItem.unitPrice) || 0;

    // Calcular los nuevos valores basados en qué campo cambió
    const newQuantity = field === 'quantity' ? numericValue : Number(currentItem.quantity) || 0;
    const newDiscountPct = field === 'discountPct' ? numericValue : Number(currentItem.discountPct) || 0;

    // RECALCULAR EL NUEVO AMOUNT
    const newAmount = calculateItemAmount(
      currentUnitPrice,
      newQuantity,
      newDiscountPct
    );

    // ACTUALIZAR AMBOS CAMPOS
    setValue(`noteDetails.${index}.${field}`, numericValue);
    setValue(`noteDetails.${index}.amount`, newAmount);

    // Recalcular totales generales
    calculateTotals();

  }, [noteDetails, setValue, calculateItemAmount, calculateTotals]);

  // -- CLIENT CHANGE --
  const handleClientChange = useCallback((clientId: number) => {
    setValue('clientId', clientId);
    if (clientId > 0) clearErrors('clientId');
  }, [setValue, clearErrors]);

  // -- ADD PRODUCT TO TABLE --
  const addItem = useCallback((product: INoteProduct) => {
    if (!product || !product.id) {
      toast.error('Producto inválido');
      return;
    }

    if (noteDetails.some((d) => d.productId === product.id)) {
      toast.error('Producto duplicado', {
        description: `${product.description} ya está en la tabla.`,
      });
      return;
    }

    const unitPrice = Number(product.price) || 0;

    const newDetail: INoteDetailPayload = {
      productId: product.id,
      description: product.description,
      unitPrice: unitPrice,
      quantity: 1,
      discountPct: 0,
      amount: round2(unitPrice),
    };

    append(newDetail);
    toast.success('Producto agregado', {
      description: `${product.description} · ${settings?.currencySymbol} ${unitPrice.toFixed(2)}`,
    });
  }, [append, noteDetails, settings?.currencySymbol]);

  // -- REMOVE PRODUCT FROM TABLE --
  const removeItem = useCallback((index: number) => {
    const productToRemove = noteDetails[index];

    remove(index);

    if (productToRemove) {
      toast.success('Producto eliminado', {
        description: `${productToRemove.description} · ${settings?.currencySymbol} ${Number(productToRemove.unitPrice).toFixed(2)}`,
      });
    }
  }, [remove, noteDetails, settings?.currencySymbol]);

  // --- SUBMIT ---
  const onSubmit = useCallback(async (formValues: ICreateNotePayload) => {
    try {
      const resp = await ax.post(API_ENDPOINTS.admin.note.create, formValues);
      toast.success(resp.data.message);

      reset();
      router.refresh();
      router.replace(paths.admin.note.list);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [reset, router]);

  return {
    methods,
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
    noteDetails,
    subtotal,
    discount,
    total,
    handleClientChange,
    handleDetailChange,
    addItem,
    removeItem
  };
}
