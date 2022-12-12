import { Validators } from "@angular/forms";
export class QuyChunKyThuatQuocGia {
    id: number;
    idHdr: number;
    tenChiTieu: string;
    chiTieuCha: boolean;
    maDvi: string;
    mucYeuCauNhap: string;
    mucYeuCauNhapToiDa: string;
    mucYeuCauNhapToiThieu: string;
    mucYeuCauXuat: string;
    mucYeuCauXuatToiDa: string;
    mucYeuCauXuatToiThieu: string;
    loaiVthh: string;
    cloaiVthh: string;
    tenLoaiVthh: string;
    tenCloaiVthh: string;
}
export class TienDoThucHien {
    id: number;
    idHdr: number;
    noiDung: string;
    sanPham: string;
    tuNgay: Date;
    denNgay: Date;
    nguoiThucHien: string;
    trangThaiTd: string;
    tenTrangThaiTd: string;
}
