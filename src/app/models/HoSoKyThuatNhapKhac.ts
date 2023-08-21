import { Validators } from "@angular/forms";
import {FileDinhKem} from "./FileDinhKem";

export class HoSoTaiLieu {
  id: number;
  hoSoKyThuatId: number;
  tenHoSo: string;
  loaiTaiLieu: string;
  soLuong: string;
  tdiemNhap: string;
  ghiChu: string;
  fileDinhKems: FileDinhKem = new FileDinhKem();
  edit: boolean = false;
}

