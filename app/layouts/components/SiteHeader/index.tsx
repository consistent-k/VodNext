import { SettingOutlined } from '@ant-design/icons';
import { Button, Flex, Layout } from 'antd';
import { useRouter } from 'next/navigation';

import styles from './index.module.scss';
import VodSearch from '@/components/video/VodSearch';
import VodSites from '@/components/video/VodSites';
import useSettingStore from '@/lib/store/useSettingStore';
import { useVodSitesStore } from '@/lib/store/useVodSitesStore';

const { Header } = Layout;

const SiteHeader = () => {
    const router = useRouter();

    const { current_site, setting, updateSetting } = useSettingStore();

    const { site_name } = useSettingStore();

    const { sites } = useVodSitesStore();

    return (
        <Header className={styles['vod-header']} data-tauri-drag-region>
            <Flex gap={16} align="center">
                <Flex
                    className={styles['vod-header-logo']}
                    onClick={() => {
                        router.push('/home');
                    }}
                    align="center"
                    gap={8}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20V16H4V4Z" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 20H16" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 16V20" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 8L15 12L9 16V8Z" fill="#E11D48" />
                    </svg>
                    <span className={styles['vod-header-title']}>{site_name || 'VodNext'}</span>
                </Flex>
                <VodSites
                    options={sites}
                    value={current_site}
                    onChange={(value) => {
                        updateSetting({ ...setting, current_site: value });
                        window.location.href = '/home';
                    }}
                />
            </Flex>
            <Flex gap={12} align="center">
                <VodSearch site={current_site} />
                <Button
                    type="text"
                    className={styles['vod-header-btn']}
                    icon={<SettingOutlined />}
                    onClick={() => {
                        router.push('/setting');
                    }}
                />
            </Flex>
        </Header>
    );
};

export default SiteHeader;
