declare interface Window {
    __TAURI__?: {
        writeText(text: string): Promise<void>;
        invoke(command: string, payload?: Record<string, unknown>): Promise<void>;
        dialog: {
            save(options?: Record<string, unknown>): Promise<string | null>;
        };
        fs: {
            writeBinaryFile(path: string, data: Uint8Array): Promise<void>;
            writeTextFile(path: string, data: string): Promise<void>;
        };
        notification: {
            requestPermission(): Promise<Permission>;
            isPermissionGranted(): Promise<boolean>;
            sendNotification(options: string | Options): void;
        };
        updater: {
            checkUpdate(): Promise<UpdateResult>;
            installUpdate(): Promise<void>;
            onUpdaterEvent(handler: (status: UpdateStatusResult) => void): Promise<UnlistenFn>;
        };
        http: {
            fetch<T>(url: string, options?: Record<string, unknown>): Promise<Response<T>>;
        };
    };
}
