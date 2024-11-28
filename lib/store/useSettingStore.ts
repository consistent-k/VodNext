import store from "store2";

const useSettingStore = () => {
    const { vod_hub_api, site_name } = store.get('vod_next_setting') || {};

    const updateSetting = (setting: { vod_hub_api: string; site_name: string }) => {
        store.set('vod_next_setting', setting);
    };

    return {
        vod_hub_api,
        site_name,
        updateSetting
    }
};


export default useSettingStore;