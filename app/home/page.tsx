'use client';
import { Flex, Spin } from 'antd';
import { uniq } from 'lodash';
import { useRouter } from 'next/navigation';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

import styles from './index.module.scss';
import VodList from '@/components/video/VodList';
import useSettingStore from '@/lib/store/useSettingStore';
import { HomeVodData } from '@/lib/types';
import { homeVodApi } from '@/services';

const HomePage: React.FC = () => {
    const [homeVodData, setHomeVodData] = useState<HomeVodData[]>([]);
    const [homeVodTypes, setHomeVodTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const { current_site } = useSettingStore();

    const router = useRouter();

    const getHomeVod = useCallback(async (site: string) => {
        try {
            const res = await homeVodApi(site);
            const { code, data } = res;
            if (code === 0) {
                setHomeVodData(data);
                setHomeVodTypes(uniq(data.map((item) => item.type_name)));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getHomeVod(current_site);
    }, [current_site, getHomeVod]);

    return (
        <div className={styles['vod-next-home']}>
            {loading ? (
                <Spin tip="加载中" fullscreen />
            ) : (
                <>
                    {homeVodTypes?.length > 0 ? (
                        homeVodTypes.map((item, index) => {
                            return (
                                <Flex key={`${item}-${index.toString()}`} vertical gap={16}>
                                    <div className={styles['vod-next-home-title']}>{item}</div>
                                    <VodList
                                        dataSource={homeVodData.filter((mItem) => mItem.type_name === item)}
                                        onItemClick={(vod) => {
                                            router.push(`/detail?id=${encodeURIComponent(vod.vod_id as string)}&site=${current_site}`);
                                        }}
                                    ></VodList>
                                </Flex>
                            );
                        })
                    ) : (
                        <Flex vertical justify="center" align="center">
                            <span>暂无数据</span>
                        </Flex>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage;
