'use client';

import { Spin } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import useSettingStore from '@/lib/store/useSettingStore';
import { useVodSitesStore } from '@/lib/store/useVodSitesStore';



export function InitProvider({ children }: { children: React.ReactNode }) {
    const { getVodTypes, isInitialized } = useVodSitesStore();
    const { vod_hub_api } = useSettingStore();

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!vod_hub_api) {
            router.push('/setting');
        }
    }, [vod_hub_api, router]);


    useEffect(() => {
        if (!isInitialized && pathname !== '/setting') {
            getVodTypes()
        }
    }, [getVodTypes, isInitialized, pathname]);

    if ((!isInitialized && pathname !== '/setting')) {
        return <Spin fullscreen />;
    }

    if (!vod_hub_api && pathname !== '/setting') {
        return <Spin fullscreen />;
    }

    return <>{children}</>;
} 