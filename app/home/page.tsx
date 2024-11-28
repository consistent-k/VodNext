'use client';
import { Col, Flex, Row, Spin } from 'antd';
import { uniq } from 'lodash';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import store from 'store2';

import styles from './index.module.scss';
import VodList from '@/components/video/VodList';
import { HomeVodData } from '@/lib/types';
import { homeVodApi } from '@/services';

const HomePage: React.FC = () => {
    const [homeVodData, setHomeVodData] = useState<HomeVodData[]>([]);
    const [homeVodTypes, setHomeVodTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const currentSite = store.get('vod_next_current_site');

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
        getHomeVod(currentSite);
    }, [currentSite, getHomeVod]);

    return (
        <div className={styles['vod-next-home']}>
            {loading ? (
                <Spin tip="加载中" fullscreen />
            ) : (
                <>
                    {homeVodTypes?.length > 0 ? (
                        homeVodTypes.map((item, index) => {
                            return (
                                <Fragment key={`${item}-${index.toString()}`}>
                                    <Row>
                                        <Col span={24}>
                                            <div className={styles['vod-next-home-title']}>{item}</div>
                                        </Col>
                                    </Row>
                                    <VodList site={currentSite} dataSource={homeVodData.filter((mItem) => mItem.type_name === item)}></VodList>
                                </Fragment>
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
