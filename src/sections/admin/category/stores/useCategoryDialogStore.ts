// pkgs
import { create } from 'zustand';
// schemas
import { type ICategoryData } from 'src/core/schemas';

// ----------------------------------------------------------------------

interface CategoryDialogState {
    open: boolean;
    category: ICategoryData | null;
    openDialog: (category?: ICategoryData) => void;
    closeDialog: () => void;
}

// ----------------------------------------------------------------------

const useCategoryDialogStore = create<CategoryDialogState>()((set) => ({
    open: false,
    isEdit: false,
    category: null,

    openDialog: (category) =>
        set({
            open: true,
            category: category ?? null,
        }),

    closeDialog: () =>
        set({
            open: false,
            category: null,
        }),
}));

export default useCategoryDialogStore;