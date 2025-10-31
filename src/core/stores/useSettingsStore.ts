// pkgs
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// schemas
import { type ISettingsData } from 'src/core/schemas';

// ----------------------------------------------------------------------

type ISettings = Omit<ISettingsData, 'id'>;

type ISettingsStore = {
    settings: ISettings | null;
    setSettings: (settings: ISettings) => void;
    clearSettings: () => void;
    refreshSettings: () => Promise<void>;
};

// ----------------------------------------------------------------------

export const useSettingsStore = create<ISettingsStore>()(
    persist(
        (set) => ({
            settings: null,
            setSettings: (settings) => set({ settings }),
            clearSettings: () => set({ settings: null }),
            refreshSettings: async () => {
                const resp = await ax.get<ISettings>(API_ENDPOINTS.admin.settings.find);
                const data = resp.data;

                set({ settings: data });
            },
        }),
        {
            name: 'astro-settings',
            version: 1,
        }
    )
);