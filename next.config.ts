import { NextConfig } from 'next';
import webpack from 'webpack';

const mode: NextConfig['output'] = process.env.BUILD_MODE as NextConfig['output'] ?? 'standalone';
console.log('[Next] build mode', mode);

const disableChunk = !!process.env.DISABLE_CHUNK || mode === 'export';
console.log('[Next] build with chunk: ', !disableChunk);

const nextConfig: NextConfig = {
    webpack(config) {
        if (disableChunk) {
            config.plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));
        }

        config.resolve.fallback = {
            child_process: false
        };

        return config;
    },
    output: mode,
    images: {
        unoptimized: mode === 'export'
    },
    experimental: {
        forceSwcTransforms: true
    },
    reactStrictMode: false,
    sassOptions: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api'],
    }
};

if (mode !== 'export') {
    nextConfig.redirects = async () => [
        {
            source: '/',
            destination: '/home',
            permanent: true,
        },
    ];

    nextConfig.rewrites = async () => [
        {
            source: '/api/vodhub/:path*',
            destination: 'http://127.0.0.1:8888/api/vodhub/:path*',
        },
        {
            source: '/jiexi/FF/:path*',
            destination: 'http://43.248.187.19:88/jiexi/FF/:path*',
        },
        {
            source: '/jiexi/LZ/:path*',
            destination: 'http://43.248.187.19:88/jiexi/LZ/:path*',
        },
    ];
}

export default nextConfig;
