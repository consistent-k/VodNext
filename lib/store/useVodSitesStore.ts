import { SelectProps } from 'antd';
import store from 'store2';
import { create } from 'zustand';

import { namespaceApi } from '@/services';

interface VodSitesStore {
    hasError: boolean; // 是否有错误
    errorMessage?: string;
    isInitialized: boolean; // 是否初始化
    sites: SelectProps['options'];
    setSites: (sites: VodSitesStore['sites']) => void;
    getVodTypes: () => Promise<void>;
    resetError: () => void;
}

const CACHE_KEY = 'vod_next_sites';
const CACHE_DURATION = 1000 * 60 * 60; // 1小时

export const useVodSitesStore = create<VodSitesStore>((set) => ({
    hasError: false,
    errorMessage: undefined,
    isInitialized: false,
    sites: [],
    setSites: (sites) => set({ sites }),
    resetError: () => set({ hasError: false, errorMessage: undefined }),
    getVodTypes: async () => {
        // 检查缓存
        const cached = store.get(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = cached;
            if (Date.now() - timestamp < CACHE_DURATION) {
                set({ sites: data, isInitialized: true });
                return;
            }
        }
        try {
            const res = await namespaceApi();
            const newSites: SelectProps['options'] = [];
            Object.keys(res).forEach((key) => {
                newSites.push({
                    label: res[key].name || '',
                    value: key
                });
            });

            store.set(CACHE_KEY, {
                data: newSites,
                timestamp: Date.now()
            });
            set({ sites: newSites, isInitialized: true, hasError: false, errorMessage: undefined });
        } catch (error) {
            set({ isInitialized: false, hasError: true, errorMessage: error instanceof Error ? error.message : '未知错误' });
            throw error;
        }
    }
}));
