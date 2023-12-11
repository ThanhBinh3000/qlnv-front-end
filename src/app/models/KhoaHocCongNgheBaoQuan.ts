import { Validators } from "@angular/forms";
import {FileDinhKem} from "./FileDinhKem";

export class QuyChunKyThuatQuocGia {
  id: number;
  idHdr: number;
  maChiTieu: string;
  tenChiTieu: string;
  thuTuHt: string;
  maDvi: string;
  mucYeuCauNhap: string;
  mucYeuCauNhapToiDa: string;
  mucYeuCauNhapToiThieu: string;
  mucYeuCauXuat: string;
  mucYeuCauXuatToiDa: string;
  mucYeuCauXuatToiThieu: string;
  phuongPhapXd: string;
  loaiVthh: string;
  cloaiVthh: string;
  tenLoaiVthh: string;
  tenCloaiVthh: string;
  ghiChu: string;
  nhomCtieu: string;
  tenNhomCtieu: string;
  toanTu: string;
  tenToanTu: string;
  fileDinhKem: FileDinhKem = new FileDinhKem();
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

export class NghiemThuThanhLy {
  id: number;
  idHdr: number;
  hoTen: string;
  donVi: string;
}
