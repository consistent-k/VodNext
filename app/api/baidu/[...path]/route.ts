import { NextRequest, NextResponse } from 'next/server';

import { ApiPath, BAIDU_BASE_URL } from '@/lib/constant/llm';

const serverConfig = {
    baiduUrl: BAIDU_BASE_URL,
    baiduApiKey: process.env.BAIDU_API_KEY,
    baiduSecretKey: process.env.BAIDU_SECRET_KEY,
    baiduAllowModels: process.env.BAIDU_ALLOW_MODELS || 'ernie-speed-128k'
};

async function handle(req: NextRequest) {
    if (req.method === 'OPTIONS') {
        return NextResponse.json({ body: 'OK' }, { status: 200 });
    }

    if (!serverConfig.baiduApiKey || !serverConfig.baiduSecretKey) {
        return NextResponse.json(
            {
                error: true,
                message: `missing BAIDU_API_KEY or BAIDU_SECRET_KEY in server env vars`
            },
            {
                status: 403
            }
        );
    }

    try {
        const response = await request(req);
        return response;
    } catch (e) {
        console.error('[Baidu] ', e);
    }
}

async function request(req: NextRequest) {
    const controller = new AbortController();

    let path = `${req.nextUrl.pathname}`.replaceAll(ApiPath.Baidu, '');

    let baseUrl = serverConfig.baiduUrl;

    console.log('[Proxy] ', path);
    console.log('[Base Url]', baseUrl);

    const timeoutId = setTimeout(
        () => {
            controller.abort();
        },
        10 * 60 * 1000
    );

    // 获取access token
    const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${serverConfig.baiduApiKey}&client_secret=${serverConfig.baiduSecretKey}`;
    const tokenResponse = await fetch(tokenUrl, { method: 'POST' });
    const { access_token } = await tokenResponse.json();

    const fetchUrl = `${baseUrl}${path}?access_token=${access_token}`;

    const fetchOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: req.method,
        body: req.body,
        redirect: 'manual',
        // @ts-ignore
        duplex: 'half',
        signal: controller.signal
    };

    if (req.body) {
        const clonedBody = await req.text();
        fetchOptions.body = clonedBody;

        const jsonBody = JSON.parse(clonedBody) as { model?: string };
        if (!jsonBody.model) {
            return NextResponse.json(
                {
                    error: true,
                    message: `missing model in request body`
                },
                {
                    status: 403
                }
            );
        }

        if (!serverConfig.baiduAllowModels.includes(jsonBody.model)) {
            return NextResponse.json(
                {
                    error: true,
                    message: `model not allowed`
                },
                {
                    status: 403
                }
            );
        }
    }

    try {
        const res = await fetch(fetchUrl, fetchOptions);

        const newHeaders = new Headers(res.headers);
        newHeaders.delete('www-authenticate');
        newHeaders.set('X-Accel-Buffering', 'no');

        return new Response(res.body, {
            status: res.status,
            statusText: res.statusText,
            headers: newHeaders
        });
    } finally {
        clearTimeout(timeoutId);
    }
}

export const GET = handle;
export const POST = handle;

export const dynamic = 'force-static';
export const runtime = 'edge';
