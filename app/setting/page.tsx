'use client';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, message, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import styles from './index.module.scss';
import AtomIcon from '@/components/icons/AtomIcon';
import useSettingStore from '@/lib/store/useSettingStore';
import { getAISiteNameApi } from '@/services/baidu';

const SettingPage: React.FC = () => {
    const { vod_hub_api, site_name, updateSetting } = useSettingStore();
    const [form] = Form.useForm();
    const router = useRouter();

    const [messageApi, contextHolder] = message.useMessage();

    const [isGenerating, setIsGenerating] = useState(false); // 是否正在生成网站名称

    const handleSubmit = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();
            updateSetting(values);
            messageApi.success('保存配置成功');
            window.location.href = '/home';
        } catch (error) {
            messageApi.error('保存配置失败');
        }
    };

    const getBaidu = async () => {
        setIsGenerating(true);
        try {
            const response = await getAISiteNameApi();
            const { result } = response;
            if (result.length < 8) {
                form.setFieldValue('site_name', result);
            } else {
                messageApi.info('获取网站名称失败');
            }
        } catch (error) {
            messageApi.info('获取网站名称失败');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className={styles['vod-next-setting']}>
            {contextHolder}
            <h1 style={{ marginBottom: '24px' }}>系统配置</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ width: '80%' }}
                initialValues={{
                    site_name: site_name || 'VodNext',
                    vod_hub_api: vod_hub_api || '/'
                }}
                requiredMark={false}
            >
                <Form.Item label="网站名称" required name="site_name" rules={[{ required: true, message: '请输入网站名称' }]}>
                    <Input
                        placeholder="请输入网站名称"
                        disabled={isGenerating}
                        suffix={
                            <Button
                                loading={isGenerating}
                                type="text"
                                style={{
                                    margin: 0
                                }}
                                icon={<AtomIcon />}
                                onClick={() => {
                                    if (isGenerating) {
                                        return;
                                    }
                                    getBaidu();
                                }}
                            >
                                {isGenerating ? '生成中' : ''}
                            </Button>
                        }
                    />
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
                    <Input placeholder="请输入 VodHub API 地址" />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            保存配置
                        </Button>
                        <Button
                            htmlType="button"
                            onClick={() => {
                                router.push('/home');
                            }}
                        >
                            返回首页
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SettingPage;
