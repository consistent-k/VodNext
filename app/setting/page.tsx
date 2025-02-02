'use client';
import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Form, Input, Button, Menu, MenuProps, Flex, Switch, Select, Space, App } from 'antd';
import { isBoolean } from 'lodash';
import React from 'react';
import store from 'store2';

import styles from './index.module.scss';
import useIsMobile from '@/lib/hooks/useIsMobile';
import useSettingStore from '@/lib/store/useSettingStore';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useVodSitesStore } from '@/lib/store/useVodSitesStore';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: '系统配置',
        label: '系统配置',
        icon: <SettingOutlined />
    }
];

const SettingPage: React.FC = () => {
    const { vod_hub_api, site_name, current_site, setting, updateSetting } = useSettingStore();
    const [form] = Form.useForm();
    const { isDarkMode, toggleTheme } = useThemeStore();
    const { isMobile } = useIsMobile();

    const { getVodTypes, sites, isInitialized, hasError } = useVodSitesStore();

    const { message, modal } = App.useApp();

    const handleSubmit = async () => {
        try {
            if (!isInitialized) {
                message.warning('请先点击测试接口后保存配置');
                return;
            }

            if (hasError) {
                message.warning('VodHub API 配置错误，请修改后重新点击接口测试');
                return;
            }

            await form.validateFields();
            const values = form.getFieldsValue();
            updateSetting(values);
            message.success('保存配置成功');
            window.location.href = '/home';
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Flex className={styles['vod-next-setting']}>
            <Menu
                inlineCollapsed={isMobile}
                style={{
                    width: isMobile ? 60 : 200
                }}
                defaultSelectedKeys={['系统配置']}
                mode="inline"
                items={items}
            />
            <Flex vertical style={{ flex: 1, padding: 20 }}>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        site_name: site_name || 'VodNext',
                        vod_hub_api: vod_hub_api || '/',
                        theme: isDarkMode,
                        current_site: current_site || ''
                    }}
                    requiredMark={false}
                    onValuesChange={(changedValues) => {
                        if ('theme' in changedValues) {
                            // 判断如果是主题修改则直接调用
                            if (isBoolean(changedValues.theme)) {
                                toggleTheme();
                            }
                        }

                        if ('current_site' in changedValues) {
                            if (changedValues.current_site) {
                                updateSetting({ ...setting, current_site: changedValues.current_site });
                            }
                        }
                    }}
                >
                    <Form.Item label="网站名称" required name="site_name" rules={[{ required: true, message: '请输入网站名称' }]}>
                        <Input placeholder="请输入网站名称" autoComplete="off" />
                    </Form.Item>

                    <Form.Item label="网站主题" name="theme" valuePropName="checked">
                        <Switch checkedChildren="日间模式" unCheckedChildren="夜间模式"></Switch>
                    </Form.Item>
                    <Form.Item
                        label="VodHub API 地址"
                        tooltip={{
                            title: (
                                <span>
                                    支持完整的 HTTP(S) URL 或以 / 开头的相对路径
                                    <Button type="link" onClick={() => window.open('https://github.com/consistent-k/VodHub', '_blank')} style={{ padding: '0 0 0 8px' }}>
                                        查看文档
                                    </Button>
                                </span>
                            ),
                            icon: <InfoCircleOutlined />
                        }}
                        required
                        name="vod_hub_api"
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (!value) {
                                        return Promise.reject('请输入 API 地址');
                                    }
                                    if (value.startsWith('/') || /^https?:\/\//.test(value)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('请输入正确的 URL 或以 / 开头的路径');
                                }
                            }
                        ]}
                    >
                        <Input
                            placeholder="请输入 VodHub API 地址"
                            autoComplete="off"
                            suffix={
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={async () => {
                                        try {
                                            await getVodTypes();
                                        } catch (error) {
                                            message.error('测试接口失败');
                                        }
                                    }}
                                >
                                    测试接口
                                </Button>
                            }
                        />
                    </Form.Item>

                    {isInitialized && (
                        <Form.Item
                            label="默认资源"
                            name="current_site"
                            required
                            rules={[{ required: true, message: '请选择默认站点' }]}
                            tooltip={{
                                title: <span>请先点击测试接口后选择</span>,
                                icon: <InfoCircleOutlined />
                            }}
                        >
                            <Select options={sites} />
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Space>
                            <Button
                                onClick={() => {
                                    modal.confirm({
                                        title: '确认清空缓存？',
                                        content: '清空缓存后需要重新配置相关设置',
                                        onOk: () => {
                                            store.each((key, value) => {
                                                if (key.startsWith('vod_next')) {
                                                    store.remove(key);
                                                }
                                            });
                                            message.success('缓存已清空');
                                        }
                                    });
                                }}
                            >
                                清空缓存
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                保存配置
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Flex>
        </Flex>
    );
};

export default SettingPage;
