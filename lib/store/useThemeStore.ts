import store from 'store2';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            isDarkMode: false,
            toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode }))
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
