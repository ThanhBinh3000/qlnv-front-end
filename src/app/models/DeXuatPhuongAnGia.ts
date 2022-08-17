import { FileDinhKem } from "./FileDinhKem";

export class CanCuXacDinhPag {
    id: number;
    moTa: string;
    fileDinhKem: FileDinhKem = new FileDinhKem();

}

export class ThongTinKhaoSatGia {
    id: number;
    tenDviBaoGia: string;
    cloaiVthh: string;
    tenCloaiVthh: string;
    donGia: string;
    donGiaVat: number;
    thoiHanBaoGia: number;
    ghiChu: number;
    fileDinhKem: FileDinhKem = new FileDinhKem();
}