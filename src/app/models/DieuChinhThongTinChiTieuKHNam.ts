import { FileDinhKem } from "./DeXuatKeHoachuaChonNhaThau";
import { QuyetDinhChiTieuKHNam } from "./QuyetDinhChiTieuKHNam";

export class DieuChinhThongTinChiTieuKHNam {
    qd: QuyetDinhChiTieuKHNam;
    qdDc: QuyetDinhChiTieuKHNam;
    qdGocId: number;
    ghiChu: string;
    trangThai: string;
    tenTrangThai: string;
    fileDinhKemReqs: Array<FileDinhKem>;
    constructor(
        fileDinhKemReqs: Array<FileDinhKem> = [],
    ) {
        this.fileDinhKemReqs = fileDinhKemReqs;
    }
}
