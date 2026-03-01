export type RawData = {
    id: string;
    title: string;
    duration: number;
    formats: {
        format_id: string;
        height: number;
        filesize: number;
    }[];
};

export type Data = {
    id: string;
    title: string;
    duration: number | null;
    audioFormat: number | null;
    videoFormats: {
        formatId: number;
        height: number;
        size: number;
    }[];
};

export type HumanizedData = {
    id: string;
    title: string;
    duration: string;
    audioFormat: string;
    videoFormats: {
        formatId: number;
        height: number;
        size: string;
    }[];
};
