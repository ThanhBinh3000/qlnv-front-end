export interface LoaiHinhBaoQuanModel extends LoaiHinhBaoQuanDataModel{
    id: number;
}

export interface LoaiHinhBaoQuanDataModel {
    maLhinh: string;
    tenLhinh: string;
    trangThai: string;
    ghiChu: string;
}