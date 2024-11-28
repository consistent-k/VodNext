import { MoonOutlined, SettingOutlined, SunOutlined } from '@ant-design/icons';
import { Button, Flex, Layout } from 'antd';
import { useRouter } from 'next/navigation';
import store from 'store2';

import styles from './index.module.scss';
import VodSearch from '@/components/video/VodSearch';
import VodSites from '@/components/video/VodSites';
import useSettingStore from '@/lib/store/useSettingStore';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useVodSitesStore } from '@/lib/store/useVodSitesStore';

const { Header } = Layout;

const SiteHeader = () => {
    const { isDarkMode, toggleTheme } = useThemeStore();
    const router = useRouter();

    const currentSite = store.get('vod_next_current_site');

    const { site_name } = useSettingStore();

    const { sites } = useVodSitesStore();

    return (
        <Header className={styles['vod-header']} style={{ backgroundColor: isDarkMode ? '#16161a' : '#fff' }} data-tauri-drag-region>
            <Flex gap={8} align="center" justify="center">
                <Flex
                    style={{ cursor: 'pointer', minWidth: 60, fontSize: 18 }}
                    onClick={() => {
                        router.push('/home');
                    }}
                    align="center"
                >
                    {site_name || 'VodNext'}
                </Flex>
                <VodSites
                    options={sites}
                    value={currentSite}
                    onChange={(value) => {
                        store.set('vod_next_current_site', value);
                        window.location.href = '/home';
                    }}
                />
            </Flex>
            <Flex gap={10}>
                <VodSearch site={currentSite} />
                <Flex>
                    <Button type="text" style={{ fontSize: 14 }} icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />} onClick={toggleTheme} />
                    <Button
                        type="text"
                        icon={
                            <SettingOutlined
                                style={{ cursor: 'pointer', fontSize: 14 }}
                                onClick={() => {
                                    router.push('/setting');
                                }}
                            />
                        }
                        style={{ fontSize: 14 }}
                    />
                </Flex>
            </Flex>
        </Header>
    );
};

export default SiteHeader;
