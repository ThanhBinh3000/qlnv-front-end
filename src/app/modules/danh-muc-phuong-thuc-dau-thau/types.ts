export interface PhuongThucDauThauModel extends PhuongThucDauThauDataModel{
    id: number;
}

export interface PhuongThucDauThauDataModel {
    maPthuc: string;
    tenPthuc: string;
    trangThai: string;
    ghiChu: string;
}