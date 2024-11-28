import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { includes } from 'lodash';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import store from 'store2';

import styles from './index.module.scss';
import { homeApi } from '@/services';

interface VodTypesProps {
    site: string;
}

const VodTypes: React.FC<VodTypesProps> = (props) => {
    const { site } = props;
    const [items, setItems] = useState<TabsProps['items']>([]);
    const [activeKey, setActiveKey] = useState(''); // 当前激活的分类

    const router = useRouter();

    const pathname = usePathname();

    const searchParams = useSearchParams();

    useEffect(() => {
        if (includes(pathname, 'category')) {
            const id = searchParams.get('id') || '';
            setActiveKey(id as string);
        }

        if (includes(pathname, 'home')) {
            setActiveKey('all');
        }
    }, [pathname, searchParams]);

    const getHome = async (site: string) => {
        try {
            const res = await homeApi(site);
            const { code, data } = res;
            if (code === 0) {
                store.set('vod_next_home_data', data);
                const newItems = data.map((item) => {
                    return {
                        key: String(item.type_id),
                        label: item.type_name
                    };
                });
                newItems.unshift({
                    key: 'all',
                    label: '最近更新'
                } as any);
                setItems(newItems);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        store.set('vod_next_home_data', []);
        getHome(site);
    }, [site]);

    return (
        <div className={styles['vod-types']}>
            <Tabs
                items={items}
                activeKey={activeKey}
                onChange={(key) => {
                    setActiveKey(key);
                    if (key === 'all') {
                        router.push('/home');
                    } else {
                        router.push(`/category?id=${key}&name=${name}&site=${site}`);
                    }
                }}
            />
        </div>
    );
};

export default VodTypes;
