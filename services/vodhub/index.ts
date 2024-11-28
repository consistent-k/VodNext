import store from 'store2';

import { HomeData, HomeVodData, CategoryVodData, DetailData, PlayData, SearchData } from '@/lib/types';
import request from '@/lib/utils/request';

let prefix = `/api/vodhub`;

const { vod_hub_api } = store.get('vod_next_setting') || {};

if (vod_hub_api && vod_hub_api !== '/') {
    prefix = `${vod_hub_api}${prefix}`;
}

interface VodHubResponse<T> {
    code: number;
    data: T;
    update_time: string;
}

// 定义接口类型
export interface CategoryParams {
    id: string | number;
    page: number;
    limit: number;
    filters?: {
        area?: string;
        lang?: string;
        year?: string;
    };
}

interface PlayParams {
    url: string;
    parse_urls: string[];
}

interface SearchParams {
    keyword: string;
    page: number;
}

// 获取namespace
export const namespaceApi = () => {
    return request.get<
        Record<
            string,
            {
                name: string;
                description: string;
            }
        >
    >(`${prefix}/namespace`);
};

// 获取首页分类
export const homeApi = (site_name: string) => {
    return request.get<VodHubResponse<HomeData[]>>(`${prefix}/${site_name}/home`);
};

// 最近更新
export const homeVodApi = (site_name: string) => {
    return request.get<VodHubResponse<HomeVodData[]>>(`${prefix}/${site_name}/homeVod`);
};

// 按分类查询
export const categoryApi = (site_name: string, data: CategoryParams) => {
    return request.post<VodHubResponse<CategoryVodData[]>>(`${prefix}/${site_name}/category`, {
        data
    });
};

// 详情
export const detailApi = (site_name: string, data: { id: string | number }) => {
    return request.post<VodHubResponse<DetailData[]>>(`${prefix}/${site_name}/detail`, {
        data
    });
};

// 获取播放地址
export const playApi = (site_name: string, data: PlayParams) => {
    return request.post<VodHubResponse<PlayData[]>>(`${prefix}/${site_name}/play`, {
        data
    });
};

// 搜索
export const searchApi = (site_name: string, data: SearchParams) => {
    return request.post<VodHubResponse<SearchData[]>>(`${prefix}/${site_name}/search`, {
        data
    });
};
