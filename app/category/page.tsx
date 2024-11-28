'use client';
import { Button, Collapse, CollapseProps, Flex, Spin, theme } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import store from 'store2';

import styles from './index.module.scss';
import VodList from '@/components/video/VodList';
import { CategoryVodData, HomeData } from '@/lib/types';
import { categoryApi, CategoryParams } from '@/services';

const CategoryPage = () => {
    const [categoryList, setCategoryList] = useState<CategoryVodData[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = theme.useToken();

    const searchParams = useSearchParams();
    const router = useRouter();

    const id = searchParams.get('id') || '';
    const name = searchParams.get('name') || '';
    const site = searchParams.get('site') || '';
    const [filters, setFilters] = useState<CategoryParams['filters']>();
    const [activeKey, setActiveKey] = useState<string[]>([]);

    const getCategory = async (id: string | number, filters?: CategoryParams['filters']) => {
        setLoading(true);
        try {
            const res = await categoryApi(site, {
                id: id,
                page: 1,
                limit: 30,
                filters
            });
            const { code, data } = res;
            if (code === 0) {
                setCategoryList(
                    data.map((item) => {
                        return {
                            ...item,
                            type_name: name,
                            type_id: id
                        };
                    })
                );
            } else {
                setCategoryList([]);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof site !== 'string' || !site) {
            router.push('/home');
        }
    }, [site]);

    useEffect(() => {
        if (typeof id === 'string' && id) {
            getCategory(id);
        }
    }, [id]);

    useEffect(() => {
        getCategory(id, filters);
    }, [filters, id]);

    const currentData: HomeData | undefined = useMemo(() => {
        const homeData: HomeData[] = store.get('vod_next_home_data') || [];
        return homeData.find((item) => String(item.type_id) === id);
    }, [id]);

    const typeMap: any = {
        class: '分类',
        area: '地区',
        lang: '语言',
        year: '年份',
        letter: '首字母',
        order: '排序'
    };

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: (
                <Flex gap={10}>
                    <Button style={{ padding: '0 2px' }} size="small" type="text">
                        筛选
                    </Button>
                    {filters && (
                        <Button size="small" type="text" onClick={() => setFilters(undefined)}>
                            重置
                        </Button>
                    )}
                </Flex>
            ),
            children: (
                <Flex vertical gap={16} style={{ marginBottom: 20 }}>
                    {currentData?.filters?.map((item) => {
                        return (
                            <Flex key={item.type} gap={10}>
                                <Button style={{ flexShrink: 0, padding: '0 2px' }} size="small" type="text">
                                    {typeMap[item.type]}:
                                </Button>
                                <Flex gap={8} wrap="wrap">
                                    {item.children.map((cItem) => {
                                        return (
                                            <Button
                                                key={cItem.label}
                                                size="small"
                                                type="text"
                                                // @ts-ignore
                                                style={{ padding: '0 2px', color: filters?.[item.type] === cItem.value ? token.colorPrimary : undefined }}
                                                onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        [item.type]: cItem.label === '全部' ? '' : cItem.value
                                                    });
                                                }}
                                            >
                                                {cItem.label}
                                            </Button>
                                        );
                                    })}
                                </Flex>
                            </Flex>
                        );
                    })}
                </Flex>
            ),
            showArrow: false
        }
    ];

    return (
        <div className={styles['vod-next-category']}>
            {loading ? (
                <Spin tip="加载中" fullscreen />
            ) : (
                <>
                    {currentData?.filters.length ? (
                        <Collapse
                            activeKey={activeKey}
                            ghost
                            items={items}
                            style={{ paddingBottom: 10 }}
                            onChange={(key) => {
                                setActiveKey(key);
                            }}
                        />
                    ) : null}

                    <VodList dataSource={categoryList} site={site}></VodList>
                </>
            )}
        </div>
    );
};

const SuspenseCategoryPage = () => {
    return (
        <Suspense fallback={<Spin fullscreen />}>
            <CategoryPage />
        </Suspense>
    );
};

export default SuspenseCategoryPage;
