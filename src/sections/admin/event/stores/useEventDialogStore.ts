// pkgs
import { create } from 'zustand';
// schemas
import { type IMessageEventData } from 'src/core/schemas';

// ----------------------------------------------------------------------

interface EventDialogState {
  open: boolean;
  event: IMessageEventData | null;
  openDialog: (event?: IMessageEventData) => void;
  closeDialog: () => void;
}

// ----------------------------------------------------------------------

const useEventDialogStore = create<EventDialogState>()((set) => ({
  open: false,
  isEdit: false,
  event: null,

  openDialog: (event) =>
    set({
      open: true,
      event: event ?? null,
    }),

  closeDialog: () =>
    set({
      open: false,
      event: null,
    }),
}));

export default useEventDialogStore;
