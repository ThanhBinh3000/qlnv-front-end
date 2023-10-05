export class BienBanBanDauGia {
    ct1s: Array<Ct1s>;
    cts: Array<Cts>;
    diaDiem: string;
    donViThongBao: string;
    id: number;
    loaiVthh: string;
    maVatTuCha: string;
    nam: number;
    ngayKy: string;
    ngayToChuc: Array<string>;
    ngayToChucTu: string;
    ngayToChucDen: string;
    soBienBan: string;
    thongBaoBdgId: number;
    trichYeu: string;
    trangThai: string = "00";
    maThongBao: string;
    tenTrangThai: string;
    constructor(cts: Array<Cts> = [], ct1s: Array<Ct1s> = []) {
        this.cts = cts;
        this.ct1s = ct1s;
    }
}

export class Cts {
    bbBanDauGiaId: number;
    chucVu: string;
    hoTen: string;
    id: number;
    loaiTptg: string;
    noiCongTac: string;
    mstCmtndCccdHoChieu: string;
    diaChi: string;
    stt: number;
    idVirtual: number;
    isEdit: boolean;
}

export class Ct1s {
    bbBanDauGiaId: number;
    donGiaCaoNhat: number;
    id: number;
    soLanTraGia: number;
    thanhTien: number;
    traGiaCaoNhat: string;
}
