'use client';
import { ApiPath, BAIDU_BASE_URL } from '@/lib/constant/llm';
import { SITE_NAME_PROMPT } from '@/lib/constant/prompt';
import request from '@/lib/utils/request';

let baseUrl = !!process.env.BUILD_APP ? BAIDU_BASE_URL : ApiPath.Baidu;
interface ErnieResponse {
    result: string;
}

// 电影网站起名接口
export const getAISiteNameApi = async () => {
    return await request.post<ErnieResponse>(`${baseUrl}/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-speed-128k`, {
        data: {
            messages: [
                {
                    role: 'user',
                    content: SITE_NAME_PROMPT
                }
            ],
            model: 'ernie-speed-128k'
        },
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
