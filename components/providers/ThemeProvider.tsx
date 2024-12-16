'use client';

import { App, ConfigProvider, theme } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import { useThemeStore } from '@/lib/store/useThemeStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { isDarkMode } = useThemeStore();

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: 'skyblue'
                },
                components: {
                    Input: {
                        hoverBorderColor: 'skyblue',
                        activeBorderColor: 'skyblue'
                    },
                    Layout: {
                        bodyBg: isDarkMode ? '#1a1c1f' : '#fff',
                        footerBg: isDarkMode ? '#1a1c1f': '#fff'
                    },
                    Collapse: {
                        headerPadding: 0,
                        contentPadding: 0
                    }
                }
            }}
            prefixCls="vod-next"
            locale={zhCN}
        >
            <App style={{ height: '100%', width: '100%' }}>
                {children}
            </App>
        </ConfigProvider>
    );
}
