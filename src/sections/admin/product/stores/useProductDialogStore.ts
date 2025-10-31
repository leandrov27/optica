// pkgs
import { create } from 'zustand';
// schemas
import { type IProductData } from 'src/core/schemas';

// ----------------------------------------------------------------------

interface ProductDialogState {
    open: boolean;
    product: IProductData | null;
    openDialog: (product?: IProductData) => void;
    closeDialog: () => void;
}

// ----------------------------------------------------------------------

const useProductDialogStore = create<ProductDialogState>()((set) => ({
    open: false,
    isEdit: false,
    product: null,

    openDialog: (product) =>
        set({
            open: true,
            product: product ?? null,
        }),

    closeDialog: () =>
        set({
            open: false,
            product: null,
        }),
}));

export default useProductDialogStore;