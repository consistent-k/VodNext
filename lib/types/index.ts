// 首页分类列表
export interface HomeData {
    type_id: string | number; // 类型id
    type_name: string; // 类型名称
    filters: Array<{
        type: 'area' | 'lang' | 'year' | 'class' | 'order'; // 地区、语言、年代、分类、排序
        children: Array<{
            label: string;
            value: string;
        }>;
    }>;
}

// 首页视频列表
export interface HomeVodData {
    vod_id: number | string; // 视频id
    vod_name: string; // 视频名称
    vod_pic: string; // 视频封面
    vod_pic_thumb: string; // 视频缩略图/封面
    vod_remarks: string; // 视频备注
    type_id: number | string; // 类型id
    type_name: string; // 类型名称
}

// 按分类视频列表
export interface CategoryVodData {
    vod_id: number | string; // 视频id
    vod_name: string; // 视频名称
    vod_pic: string; // 视频封面
    vod_remarks: string; // 视频备注
}

// 播放地址
export interface VodPlayList {
    name: string; // 线路名称
    urls: Array<{
        name: string; // 播放名称
        url: string; // 播放地址
    }>; // 播放地址
    parse_urls?: string[]; // 解析地址
}

// 视频详情
export interface DetailData {
    vod_id: number; // 视频id
    vod_name: string; // 视频名称
    vod_pic: string; // 视频封面
    vod_remarks: string; // 视频备注
    vod_year: string; // 年代
    vod_area: string; // 地区
    vod_actor: string; // 演员
    vod_director: string; // 导演
    vod_content: string; // 简介
    vod_play_list: VodPlayList[]; // 播放地址
}

// 播放地址
export interface PlayData {
    play_type: string; // 播放类型
    play_url: string; // 播放地址
}

// 关键词搜索
export interface SearchData {
    vod_id: number | string; // 视频id
    vod_name: string; // 视频名称
    vod_pic: string; // 视频封面
    vod_remarks: string; // 视频备注
}
