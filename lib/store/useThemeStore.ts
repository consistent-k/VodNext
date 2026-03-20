import store from 'store2';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
    isDarkMode: boolean;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        () => ({
            isDarkMode: true as boolean
        }),
        {
            name: 'vod_next_theme_storage',
            storage: {
                getItem: (name) => {
                    return store.get(name);
                },
                setItem: (name, value) => {
                    store.set(name, value);
                },
                removeItem: (name) => store.remove(name)
            }
        }
    )
);
