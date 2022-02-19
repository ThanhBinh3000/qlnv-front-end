export interface HinhThucBaoQuanModel extends HinhThucBaoQuanDataModel{
    id: number;
}

export interface HinhThucBaoQuanDataModel {
    maTtrang: string;
    tenTtrang: string;
    trangThai: string;
    ghiChu: string;
}