import { fetch } from '@tauri-apps/plugin-http';
import axios, { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';

const request = axios.create();

request.interceptors.request.use((config) => {
    return config;
});

request.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // 判断返回状态码如果是404 则跳转到setting页面
    if (error.response && error.response.status === 404) {
        window.location.href = '/setting';
    }
    return Promise.reject(error);
});

export interface BaseRequestConfig extends AxiosRequestConfig {
    customPreFix?: string;
}

class BaseRequest {
    async request(url: string, config: BaseRequestConfig) {
        try {
            if (window.__TAURI__) {
                const response = await fetch(`${url}`, { method: config.method, body: JSON.stringify(config.data) });
                const json = await response.json();
                return json;
            } else {
                return (await request.request({ url, ...config })).data;
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async get<T>(url: string, config?: BaseRequestConfig): Promise<T> {
        return await this.request(url, merge({}, config, { method: 'get' }));
    }

    async post<T>(url: string, config?: BaseRequestConfig): Promise<T> {
        return await this.request(url, merge({}, config, { method: 'post' }));
    }

    async put<T>(url: string, config?: BaseRequestConfig): Promise<T> {
        return await this.request(url, merge({}, config, { method: 'put' }));
    }

    async delete<T>(url: string, config?: BaseRequestConfig): Promise<T> {
        return await this.request(url, merge({}, config, { method: 'delete' }));
    }

    async patch<T>(url: string, config?: BaseRequestConfig): Promise<T> {
        return await this.request(url, merge({}, config, { method: 'patch' }));
    }
}

const baseRequest = new BaseRequest();

export default baseRequest;
