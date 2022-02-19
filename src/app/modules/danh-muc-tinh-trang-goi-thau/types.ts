export interface TinhTrangGoiThauModel extends TinhTrangGoiThauDataModel{
    id: number;
}

export interface TinhTrangGoiThauDataModel {
    maTtrang: string;
    tenTtrang: string;
    trangThai: string;
    ghiChu: string;
}