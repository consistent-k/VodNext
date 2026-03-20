'use client';

import { App, ConfigProvider, theme } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    // 品牌色
                    colorPrimary: '#E11D48',
                    // 背景色
                    colorBgContainer: '#0F0F23',
                    colorBgElevated: '#1E1B4B',
                    colorBgLayout: '#000000',
                    // 文字色
                    colorText: '#F8FAFC',
                    colorTextSecondary: '#94A3B8',
                    colorTextTertiary: '#64748B',
                    // 边框色
                    colorBorder: '#334155',
                    colorBorderSecondary: 'rgba(51, 65, 85, 0.5)',
                    // 圆角
                    borderRadius: 12,
                    // 字体
                    fontFamily: '"Righteous", "Poppins", Inter, Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
                },
                components: {
                    Button: {
                        colorPrimary: '#E11D48',
                        borderRadius: 8,
                        fontWeight: 600,
                        primaryColor: '#F8FAFC'
                    },
                    Card: {
                        borderRadiusLG: 16
                    },
                    Input: {
                        hoverBorderColor: '#E11D48',
                        activeBorderColor: '#E11D48',
                        colorBgContainer: '#0F0F23',
                        colorBorder: '#334155',
                        colorText: '#F8FAFC',
                        colorTextPlaceholder: '#64748B',
                        activeShadow: '0 0 0 2px rgba(225, 29, 72, 0.2)'
                    },
                    Layout: {
                        bodyBg: '#000000',
                        headerBg: '#0F0F23',
                        footerBg: '#000000',
                        siderBg: '#0F0F23'
                    },
                    Collapse: {
                        headerPadding: 0,
                        contentPadding: 0
                    },
                    Tag: {
                        colorBgContainer: '#1E1B4B',
                        colorText: '#94A3B8'
                    },
                    Select: {
                        colorBgContainer: '#0F0F23',
                        colorBorder: '#334155',
                        colorText: '#F8FAFC',
                        colorTextPlaceholder: '#64748B',
                        optionSelectedBg: 'rgba(225, 29, 72, 0.1)',
                        optionSelectedColor: '#E11D48',
                        optionActiveBg: 'rgba(30, 27, 75, 0.8)',
                        selectorBg: '#0F0F23'
                    },
                    Tabs: {
                        itemColor: '#64748B',
                        itemSelectedColor: '#E11D48',
                        itemHoverColor: '#F8FAFC',
                        inkBarColor: '#E11D48',
                        itemActiveColor: '#E11D48'
                    },
                    Steps: {
                        colorPrimary: '#E11D48',
                        colorText: '#F8FAFC',
                        colorTextDescription: '#64748B',
                        colorIcon: '#64748B',
                        colorPrimaryBorder: '#E11D48'
                    },
                    Descriptions: {
                        colorText: '#F8FAFC',
                        colorTextSecondary: '#94A3B8',
                        colorTextTertiary: '#64748B',
                        labelColor: '#64748B',
                        contentColor: '#94A3B8'
                    },
                    Typography: {
                        colorText: '#94A3B8',
                        colorTextSecondary: '#64748B'
                    },
                    Form: {
                        labelColor: '#94A3B8',
                        labelRequiredMarkColor: '#E11D48'
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
