export interface ThuKhoModel extends ThuKhoDataModel{
    id: number;
}

export interface ThuKhoDataModel {
    maThukho: string;
    tenThukho: string;
    trangThai: string;
    ghiChu: string;
}