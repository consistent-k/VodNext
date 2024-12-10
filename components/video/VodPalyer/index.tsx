'use client';
import DPlayer from 'dplayer';
import type { DPlayerOptions } from 'dplayer';
import Hls from 'hls.js';
import { useCallback, useEffect, useRef } from 'react';

import styles from './index.module.scss';

export interface PalyerProps {
    showType?: 'dplayer' | 'iframe';
    url: string;
    style?: React.CSSProperties;
    onError?: (error: string) => void;
}

const VodPalyer: React.FC<PalyerProps> = (props) => {
    const { url, onError, style, showType = 'dplayer' } = props;

    const dpInstanceRef = useRef<DPlayer>(null);
    const dplayerRef = useRef<HTMLDivElement | null>(null);
    const video_type = url.indexOf('.m3u8') !== -1 ? 'customHls' : 'auto';

    const dplayerOptions = useCallback(
        (url: string, hls: Hls) => {
            const options: DPlayerOptions = {
                container: dplayerRef.current,
                video: {
                    url: url,
                    type: video_type,
                    customType: {
                        customHls(video: HTMLVideoElement) {
                            if (Hls.isSupported()) {
                                // Assume it's an m3u8 file
                                hls.loadSource(url);
                                hls.attachMedia(video);
                                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                                    video.play();
                                });
                                hls.on(Hls.Events.ERROR, (event, data) => {
                                    if (data.fatal) {
                                        console.error('HLS fatal error:', data.type, data.details);
                                        // HLS playback failed, try using HTML5 video player
                                        video.src = url;
                                    }
                                });
                            } else {
                                console.error('Hls is not supported');
                                onError?.('浏览器不支持 Hls，建议使用最新版本的 Chrome 浏览器');
                            }
                        }
                    }
                },
                screenshot: true,
                autoplay: false
            };
            return options;
        },
        [url]
    );

    useEffect(() => {
        if (!dplayerRef.current) {
            return;
        }

        const hls = new Hls();
        const dp = new DPlayer(dplayerOptions(url, hls));
        dpInstanceRef.current = dp;

        return () => {
            dp.destroy();
            hls.destroy();
        };
    }, [dplayerOptions, url]);

    return (
        <div className={styles['vod-next-player']} style={{...style}}>
            {showType === 'dplayer' ? (
                <div
                    id="dplayer"
                    ref={dplayerRef}
                    style={{
                        height: '100%',
                        width: '100%'
                    }}
                ></div>
            ) : (
                <iframe src={url} frameBorder="0" width="100%" height="100%" allowFullScreen={true} />
            )}
        </div>
    );
};

export default VodPalyer;
