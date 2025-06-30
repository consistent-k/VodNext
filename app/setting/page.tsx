'use client';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Flex, Switch, Select, App, Steps, theme, Descriptions } from 'antd';
import { isBoolean } from 'lodash';
import React, { useState } from 'react';

import styles from './index.module.scss';
import useSettingStore from '@/lib/store/useSettingStore';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useVodSitesStore } from '@/lib/store/useVodSitesStore';

const SettingPage: React.FC = () => {
    const { vod_hub_api, site_name, setting, updateSetting } = useSettingStore();
    const [form] = Form.useForm();
    const { isDarkMode, toggleTheme } = useThemeStore();

    const { getVodTypes, sites, isInitialized, hasError, clearVodTypes } = useVodSitesStore();

    const [current, setCurrent] = useState(0);

    const { token } = theme.useToken();
    const { message } = App.useApp();

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
            const values = form.getFieldsValue(true);

            updateSetting(values);
            message.success('保存配置成功');
            window.location.href = '/home';
        } catch (error) {
            console.error(error);
        }
    };

    const steps = [
        {
            title: '基础设置',
            content: (
                <>
                    <Form.Item label="网站名称" required name="site_name" rules={[{ required: true, message: '请输入网站名称' }]}>
                        <Input
                            placeholder="请输入网站名称"
                            style={{
                                width: 300
                            }}
                        />
                    </Form.Item>

                    <Form.Item label="网站主题" name="theme" valuePropName="checked">
                        <Switch checkedChildren="亮色主题" unCheckedChildren="暗色主题"></Switch>
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
                            style={{
                                width: 300
                            }}
                        />
                    </Form.Item>
                </>
            ),
            buttons: (
                <>
                    <Button
                        type="primary"
                        onClick={() => {
                            updateSetting({ ...setting, vod_hub_api: form.getFieldValue('vod_hub_api'), current_site: '' });
                            form.setFieldValue('current_site', '');
                            clearVodTypes();
                            next();
                        }}
                    >
                        下一步
                    </Button>
                </>
            )
        },
        {
            title: '验证配置',
            content: isInitialized ? (
                <Form.Item label="选择默认资源" name="current_site" required rules={[{ required: true, message: '请选择默认站点' }]}>
                    <Select options={sites} />
                </Form.Item>
            ) : (
                <div>点击更新资源后选择</div>
            ),
            buttons: (
                <Flex gap={8}>
                    <Button onClick={() => prev()}>上一步</Button>
                    <Button
                        type="primary"
                        onClick={async () => {
                            try {
                                await getVodTypes({
                                    force: true
                                });
                            } catch (error) {
                                message.error('验证接口失败');
                                form.setFieldValue('current_site', '');
                            }
                        }}
                    >
                        更新资源
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            updateSetting({ ...setting, current_site: form.getFieldValue('current_site') });
                            next();
                        }}
                    >
                        下一步
                    </Button>
                </Flex>
            )
        },
        {
            title: '保存配置',
            content: (
                <Descriptions
                    bordered
                    title="当前配置"
                    items={[
                        {
                            label: '网站名称',
                            children: form.getFieldValue('site_name')
                        },
                        {
                            label: '网站主题',
                            children: form.getFieldValue('theme') ? '暗色主题' : '亮色主题'
                        },
                        {
                            label: 'VodHub API 地址',
                            children: form.getFieldValue('vod_hub_api')
                        },
                        {
                            label: '默认资源',
                            children: sites?.find((item) => item.value === form.getFieldValue('current_site'))?.label || ''
                        }
                    ]}
                />
            ),
            buttons: (
                <Flex gap={8}>
                    <Button onClick={() => prev()}>上一步</Button>

                    <Button type="primary" onClick={handleSubmit}>
                        保存配置
                    </Button>
                </Flex>
            )
        }
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const next = async () => {
        try {
            await form.validateFields();
            setCurrent(current + 1);
        } catch (error) {
            console.log('验证失败:', error);
        }
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
        padding: 16
    };

    return (
        <Flex className={styles['vod-next-setting']} vertical>
            <Steps current={current} items={items} />
            <Form
                form={form}
                layout="vertical"
                style={contentStyle}
                autoComplete="off"
                requiredMark={false}
                preserve
                initialValues={{
                    site_name: site_name || 'VodNext',
                    vod_hub_api: vod_hub_api || '/',
                    theme: isDarkMode,
                    current_site: ''
                }}
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
                {steps[current].content}
            </Form>

            <div style={{ marginTop: 24 }}>{steps[current].buttons}</div>
        </Flex>
    );
};

export default SettingPage;
