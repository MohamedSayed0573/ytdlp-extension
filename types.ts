export type Data = {
    id: string;
    title: string;
    duration: string;
    audioFormat: string;
    videoFormats: {
        format_id: string;
        height: number;
        filesize: string;
    }[];
    createdAt?: string;
};

export type StorageData = {
    response: Data;
    expiry?: number;
};

export type ApiResponse = {
    success: boolean;
    data: Data;
    cached: boolean;
    message?: string;
};
