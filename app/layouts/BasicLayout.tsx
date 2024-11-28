'use client';
import { Layout } from 'antd';
import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';
import React, { PropsWithChildren, useMemo } from 'react';
import store from 'store2';

import Disclaimer from './components/Disclaimer';
import SiteHeader from './components/SiteHeader';
import VodTypes from '@/components/video/VodTypes';
const { Content, Footer } = Layout;

const BasicLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const pathname = usePathname();

    const currentSite = store.get('vod_next_current_site');

    // 是否是配置页面
    const isSettingPage = useMemo(() => {
        return pathname === '/setting';
    }, [pathname]);

    // 是否是首页
    const isHomePage = useMemo(() => {
        return pathname === '/home';
    }, [pathname]);

    // 是否是分类页面
    const isCategoryPage = useMemo(() => {
        return pathname === '/category';
    }, [pathname]);

    // 是否展示分类
    const showVodTypes = useMemo(() => {
        return isHomePage || isCategoryPage;
    }, [isHomePage, isCategoryPage]);

    return (
        <Layout style={{ fontFamily: 'Microsoft YaHei', height: '100%' }}>
            <Disclaimer></Disclaimer>
            {!isSettingPage && <SiteHeader></SiteHeader>}
            <Content style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {showVodTypes && <VodTypes site={currentSite}></VodTypes>}
                <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
            </Content>
            <Footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 30 }}>©{dayjs().year()} VodNext 仅供学习交流使用</Footer>
        </Layout>
    );
};

export default BasicLayout;
