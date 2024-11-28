import { useKeyPress } from 'ahooks';
import { Button, Flex, Input, Modal, Spin, theme } from 'antd';
import { debounce, trim } from 'lodash';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import VodList from '../VodList';
import SearchIcon from '@/components/icons/SearchIcon';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { SearchData } from '@/lib/types';
import { searchApi } from '@/services';

export interface VodSearchProps {
    style?: React.CSSProperties;
    site: string;
}

interface SearchContentProps {
    site: string;
    onCancel: () => void;
    style?: React.CSSProperties;
}

const SearchContent: React.FC<SearchContentProps> = (props) => {
    const { site, onCancel, style } = props;
    const { token } = theme.useToken();
    const router = useRouter();
    const [value, setValue] = useState('');
    const [dataSource, setDataSource] = useState<SearchData[]>([]);
    const [loading, setLoading] = useState(false);

    const getSearchData = debounce(async (val: string) => {
        setLoading(true);
        try {
            const res = await searchApi(site, {
                keyword: val,
                page: 1
            });
            const { code, data } = res;
            if (code === 0) {
                setDataSource(data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, 800);

    return (
        <Flex
            vertical
            style={{
                ...style
            }}
        >
            <Flex
                align="center"
                justify="space-between"
                gap={10}
                style={{
                    padding: 10
                }}
            >
                <Input
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    prefix={
                        <Button
                            size="small"
                            icon={
                                <SearchIcon
                                    style={{
                                        color: token.colorTextPlaceholder
                                    }}
                                />
                            }
                            onClick={() => {
                                if (!trim(value)) {
                                    return;
                                }
                                router.push(`/search?keyword=${value}&site=${site}`);
                            }}
                            type="text"
                        ></Button>
                    }
                    placeholder="请输入关键字后搜索"
                />
                <Button
                    onClick={() => {
                        getSearchData(value);
                    }}
                    type="primary"
                >
                    搜索
                </Button>
                <Button
                    onClick={() => {
                        onCancel && onCancel();
                    }}
                >
                    取消
                </Button>
            </Flex>

            <div style={{ height: 'calc(100% - 60px)', overflowY: 'auto', padding: '0 16px 16px 16px' }}>
                {loading ? <Spin tip="搜索中" fullscreen /> : <VodList dataSource={dataSource} site={site}></VodList>}
            </div>
        </Flex>
    );
};

const VodSearch: React.FC<VodSearchProps> = (props) => {
    const { style, site } = props;

    const { token } = theme.useToken();
    const { isMobile } = useIsMobile();

    const [showSearch, setShowSearch] = useState(false);

    useKeyPress(['meta.k'], () => {
        setShowSearch(true);
    });

    useKeyPress(['ctrl.k'], () => {
        setShowSearch(true);
    });

    useKeyPress(27, () => {
        setShowSearch(false);
    });

    return (
        <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
            {isMobile ? (
                <SearchIcon
                    style={{
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        setShowSearch(true);
                    }}
                />
            ) : (
                <Input
                    onFocus={() => {
                        setShowSearch(true);
                    }}
                    prefix={
                        <Button
                            size="small"
                            icon={
                                <SearchIcon
                                    style={{
                                        color: token.colorTextPlaceholder
                                    }}
                                />
                            }
                            type="text"
                        ></Button>
                    }
                    suffix={
                        <Flex
                            style={{
                                color: token.colorTextPlaceholder,
                                border: `1px solid ${token.colorBorder}`,
                                padding: '0 4px',
                                fontSize: 12,
                                borderRadius: 4
                            }}
                            gap={2}
                        >
                            <div>⌘</div>
                            <div>K</div>
                        </Flex>
                    }
                    placeholder="搜索"
                    style={{ ...style, width: 200 }}
                />
            )}

            {showSearch && isMobile && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: '#1a1c1f',
                        zIndex: 1000
                    }}
                >
                    <SearchContent
                        site={site}
                        onCancel={() => {
                            setShowSearch(false);
                        }}
                        style={{
                            height: '100%',
                            overflowY: 'auto'
                        }}
                    ></SearchContent>
                </div>
            )}

            {showSearch && !isMobile && (
                <Modal
                    open
                    footer={null}
                    title={null}
                    closeIcon={null}
                    mask
                    width={800}
                    styles={{
                        content: {
                            padding: 10
                        }
                    }}
                >
                    <SearchContent
                        style={{
                            height: 500
                        }}
                        site={site}
                        onCancel={() => {
                            setShowSearch(false);
                        }}
                    ></SearchContent>
                </Modal>
            )}
        </div>
    );
};

export default VodSearch;
