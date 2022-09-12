export class BienBanBanDauGia {
    ct1s: Array<ct1s>;
    cts: Array<cts>;
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
    constructor(cts: Array<cts> = [], ct1s: Array<ct1s> = []) {
        this.cts = cts;
        this.ct1s = ct1s;
    }
}

export class cts {
    bbBanDauGiaId: number;
    chucVu: string;
    hoTen: string;
    id: number;
    loaiTptg: string;
    noiCongTac: string;
    mstCmtndCccdHoChieu: string;
    diaChi: string;
    stt: number;
}

export class ct1s {
    bbBanDauGiaId: number;
    donGiaCaoNhat: number;
    id: number;
    soLanTraGia: number;
    thanhTien: number;
    traGiaCaoNhat: string;
}
