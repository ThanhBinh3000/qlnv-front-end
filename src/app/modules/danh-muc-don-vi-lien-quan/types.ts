export interface DonViLienQuanModel extends DonViLienQuanDataModel{
    id: number;
}

export interface DonViLienQuanDataModel {
    maDvi: string;
    maHchinh: string;
    tenDvi: string;
    diaChi: string;
    trangThai: string;
}