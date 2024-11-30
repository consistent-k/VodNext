'use client';
import { Button, Col, Flex, Image, Row } from 'antd';
import { useRouter } from 'next/navigation';

import styles from './index.module.scss';
import { CategoryVodData, HomeVodData, SearchData } from '@/lib/types';

export interface VodListProps {
    dataSource: HomeVodData[] | SearchData[] | CategoryVodData[];
    onItemClick?: (vod: HomeVodData | SearchData | CategoryVodData) => void;
}

const VodList: React.FC<VodListProps> = (props) => {
    const { dataSource = [], onItemClick } = props;
    const router = useRouter();

    const widthMap = {
        xs: `${100 / 3}%`,
        sm: `${100 / 3}%`,
        md: '20%',
        lg: '20%',
        xl: `${100 / 6}%`
    };
    return (
        <>
            {dataSource.length > 0 ? (
                <Row gutter={[16, 16]} className={styles['vod-list']}>
                    {dataSource.map((vod, index) => {
                        return (
                            <Col
                                key={`vod-${vod.vod_id}-${index.toString()}`}
                                xs={{ flex: widthMap.xs }}
                                sm={{ flex: widthMap.sm }}
                                md={{ flex: widthMap.md }}
                                lg={{ flex: widthMap.lg }}
                                xl={{ flex: widthMap.xl }}
                                style={{
                                    cursor: 'pointer',
                                    width: 100
                                }}
                                onClick={() => {
                                    onItemClick && onItemClick(vod);
                                }}
                                className={styles['vod-list-item']}
                            >
                                <div className={styles['vod-list-item-cover']}>
                                    {/* <div className={styles['vod-list-item-cover-new']}>new</div> */}
                                    <div className={styles['vod-list-item-cover-remarks']}>{vod.vod_remarks}</div>
                                    {/* <div className={styles['vod-list-item-cover-douban']}>豆瓣:xx分</div> */}
                                    <Image
                                        rootClassName={styles['vod-list-item-cover-pic']}
                                        src={vod.vod_pic}
                                        referrerPolicy="no-referrer"
                                        alt={vod.vod_name}
                                        preview={false}
                                        style={{
                                            objectFit: 'cover',
                                            height: '100%',
                                            width: '100%'
                                        }}
                                        fallback="data:image/png;base64,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gfPO/4TXdh8gAAjtAicrAOY8y3tFABAaAAnmP/9Z3mu6wERWAWedf6teABAQADNdAFr1v2kCERkAw89/qWu7YwKA0J8Bxpz/qtd2hwQAsV3gceb/z7WdVX9AFZDIAGid/wk/8Oc/yxMAPK4KeDz/zvKmdaKc5gDYLwBa9RloAtXziYfBV6s+GQFQT//PAKtVn40AqKe/C+zaLh1VwHpamkBvAmAb+AP/J38JAB5TBdx84OejCVRPZwAsY6x6U39AAPCILvBi1WckAArqqQIuVn1KAqCgngCw6pM6UU5bFfD5hVWf0YlyGrvAru0y0wSqp7EL7AM/MwFQT2MX2Ad+ZgKgnsYusFWfmQCo56ktAKz6zHSB62msAlr1mQmAehoDwKrPTBOonqe2LrBVn5kAKOgWAJQnAAoSAKgCFvZDACAA6rp1geFEOQIATaDCfrFzBzkEQwEURalGYmAN9r9LoSESEcpEe8/Zw7+/qaf3PwOAAPTsBQAB6BIATAHD7lNAEIAeAcASKEwAEIAyU0AEIEwAEIAwAcAUMMwUEAEIEwAsgcJsgRGAMFNABCBMADAFDBsFAAHoMgVEAMIEAEugsNESCAEIEwAEIEwAMAUM82FwBCDMFhgBCBMATAHD/BkAAQizBUYAwgQAU8AwU0AEIEwAsAQKEwAEoMwUEAEIEwAsgcIEAAEIMwVEAMIEAEugMFtgBCDMFBABCBMATAHDfBici2EYdjtPAD2mgF3DdOq3zn2YAMRcDr1Tjw+Dl7jqMQWM8YCPANRMh96px4fBM1z12ALXuOoRgBhXPVemgCGueh4JQIGrnhcEYK0sdPiYKeBKuOqZRwAWz7s8/ogAvOJdHgWmgDeueoIEwFVPmAD87OSqZ7FMAb8yXfUHp56FE4AZblf9uIF18GHw94f+6AGftTIFfOZdHhkCMPGz3Zl9OzpBIAaCAPqTpAELSP9digTBD4ULnHrJvNfDzYbdOSKFN4Hs8sgWGADOdpAWAI9dnlEPQU2g7mwHYQHgbAdpAWDUQ1gV0C4P0gLA2Q7CusB2efAiogrobAdv7BwARj38WvlrABj1MGv9KuDY5Rn1MGndAOgaOnA55YtNoPHAN+rhuk4OALs8WMkZAWCXB4uqBwLAqIdNTXaBu1EPGzkQAN0uDzb16WeAMeo98GFrzy6wsx0Eardaa2vFVw8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB39uBAAAAAAADI/7URVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWFPTgQAAAAAADyf20EVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVpDw4JAAAAAAT9f+0JIwAAAAAAAAAAAAAAwCqHm+D5RCR7XAAAAABJRU5ErkJggg=="
                                    ></Image>
                                </div>
                                <div className={styles['vod-list-item-info']}>
                                    <div className={styles['vod-list-item-info-title']}>{vod.vod_name}</div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                <Flex vertical justify="center" align="center" style={{ height: '100%' }}>
                    <span>暂无数据</span>
                    <Button
                        type="primary"
                        ghost
                        style={{ marginTop: 10 }}
                        onClick={() => {
                            router.push('/home');
                        }}
                    >
                        点击返回首页
                    </Button>
                </Flex>
            )}
        </>
    );
};

export default VodList;
