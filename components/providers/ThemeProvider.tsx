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
                    colorPrimary: '#6366f1',
                    borderRadius: 10,
                    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
                },
                components: {
                    Button: {
                        colorPrimary: '#6366f1',
                        borderRadius: 8,
                        fontWeight: 500
                    },
                    Card: {
                        borderRadius: 16,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
                    },
                    Input: {
                        hoverBorderColor: '#6366f1',
                        activeBorderColor: '#6366f1'
                    },
                    Layout: {
                        bodyBg: isDarkMode ? '#1a1c1f' : 'linear-gradient(135deg, #f5f7fa 0%, #e3e8f0 100%)',
                        footerBg: isDarkMode ? '#1a1c1f' : 'linear-gradient(135deg, #f5f7fa 0%, #e3e8f0 100%)'
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
            <App style={{ height: '100%', width: '100%' }}>{children}</App>
        </ConfigProvider>
    );
}
