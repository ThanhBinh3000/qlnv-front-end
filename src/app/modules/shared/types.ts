import { PaginateOptions } from '../types';

export const MIN_PASSWORD_LEN = 8;

export interface DataTableConfig<T> {
    data: Array<T>;
    columns: Array<DataTableConfigColumn<T>>;
    actions?: Array<DataTableConfigACtion<T>>;
    mergeActionColumns?: boolean;
    actionStyle?: { [key: string]: any };
    meta: DataTableConfigMeta;
    pageChange: (info: PaginateOptions) => void;
    tableName?: string;
    filterKeys?: string[];
    hideFilter?: boolean;
    hidePaginator?: boolean;
}

export interface DataTableConfigColumn<T> {
    text: string;
    label: string;
    fieldName: string;
    condition?: (element: T) => boolean;
    valueFunction?: (element: T) => string;
    templateFunction?: (element: T) => string;
    style?: { [key: string]: any };
    actionFunction?: ($event: Event, element: T) => void;
    styleClassFunction?: (element: T) => string;
    sortable?: boolean;
}

export interface DataTableConfigACtion<T> {
    text: string;
    label: string;
    fieldName: string;
    condition?: (element: T) => boolean;
    actionFunction?: ($event: Event, element: T) => void;
    style?: { [key: string]: any };
    valueFunction?: (element: T) => string;
    displayIcon?: boolean;
    iconValue?: string;
    iconFunction?: (element: T) => string;
}

export interface DataTableConfigMeta {
    pageSize: number;
    rowsNumber: number;
    startAtPage?: { pageIndex: number };
}

export interface FileInfo {
    id?: string;
    fileName: string;
    fileSize: number;
    fileUrl: string;
    fileSizeDisplay?: string;
}

export interface AttachmentDownloadResponse<T> {
    body: T | null;
    contentDisposition: string;
    contentType: string;
}
