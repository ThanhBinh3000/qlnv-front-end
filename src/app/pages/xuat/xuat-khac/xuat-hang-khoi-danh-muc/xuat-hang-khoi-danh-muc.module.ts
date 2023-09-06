import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NzMenuModule} from "ng-zorro-antd/menu";
import {ComponentsModule} from "../../../../components/components.module";
import { DanhSachHangDuTruTheoChiDaoCuaCpComponent } from './danh-sach-hang-du-tru-theo-chi-dao-cua-cp/danh-sach-hang-du-tru-theo-chi-dao-cua-cp.component';
import { DanhSachHangDuTruTrongKhoNgoaiDanhMucComponent } from './danh-sach-hang-du-tru-trong-kho-ngoai-danh-muc/danh-sach-hang-du-tru-trong-kho-ngoai-danh-muc.component';
import { QuyetDinhXuatHangKhoiDanhMucComponent } from './quyet-dinh-xuat-hang-khoi-danh-muc/quyet-dinh-xuat-hang-khoi-danh-muc.component';
import { TongHopDanhSachHangDtqgThuocDienXuatKhoiDmComponent } from './tong-hop-danh-sach-hang-dtqg-thuoc-dien-xuat-khoi-dm/tong-hop-danh-sach-hang-dtqg-thuoc-dien-xuat-khoi-dm.component';
import { BaoCaoKqXuatHangDtqgNgoaiDmComponent } from './bao-cao-kq-xuat-hang-dtqg-ngoai-dm/bao-cao-kq-xuat-hang-dtqg-ngoai-dm.component';
import { CapNhatDanhSachHangDtqgTheoChiDaoCpComponent } from './danh-sach-hang-du-tru-theo-chi-dao-cua-cp/cap-nhat-danh-sach-hang-dtqg-theo-chi-dao-cp/cap-nhat-danh-sach-hang-dtqg-theo-chi-dao-cp.component';
import { CapNhapDanhSachHangTrongKhoNgoaiDmComponent } from './danh-sach-hang-du-tru-trong-kho-ngoai-danh-muc/cap-nhap-danh-sach-hang-trong-kho-ngoai-dm/cap-nhap-danh-sach-hang-trong-kho-ngoai-dm.component';
import { ThongTinQuyetDinhXuatHangKhoiDmComponent } from './quyet-dinh-xuat-hang-khoi-danh-muc/thong-tin-quyet-dinh-xuat-hang-khoi-dm/thong-tin-quyet-dinh-xuat-hang-khoi-dm.component';
import {
  VtTbCoThoihanLuukhoConSauThangModule
} from '../kiemtra-chatluong-vt-tb-truockhi-hethan-luukho/vt-tb-co-thoihan-luukho-con-sau-thang/vt-tb-co-thoihan-luukho-con-sau-thang.module';
import { ChiTietTongHopDanhSachHangDtqgXuatKhoiDmComponent } from './tong-hop-danh-sach-hang-dtqg-thuoc-dien-xuat-khoi-dm/chi-tiet-tong-hop-danh-sach-hang-dtqg-xuat-khoi-dm/chi-tiet-tong-hop-danh-sach-hang-dtqg-xuat-khoi-dm.component';
import { ThongTinBcKetQuaXuatHangKhoiDanhMucComponent } from './bao-cao-kq-xuat-hang-dtqg-ngoai-dm/thong-tin-bc-ket-qua-xuat-hang-khoi-danh-muc/thong-tin-bc-ket-qua-xuat-hang-khoi-danh-muc.component';


@NgModule({
  declarations: [
    DanhSachHangDuTruTheoChiDaoCuaCpComponent,
    DanhSachHangDuTruTrongKhoNgoaiDanhMucComponent,
    QuyetDinhXuatHangKhoiDanhMucComponent,
    TongHopDanhSachHangDtqgThuocDienXuatKhoiDmComponent,
    BaoCaoKqXuatHangDtqgNgoaiDmComponent,
    CapNhatDanhSachHangDtqgTheoChiDaoCpComponent,
    CapNhapDanhSachHangTrongKhoNgoaiDmComponent,
    ThongTinQuyetDinhXuatHangKhoiDmComponent,
    ChiTietTongHopDanhSachHangDtqgXuatKhoiDmComponent,
    ThongTinBcKetQuaXuatHangKhoiDanhMucComponent
  ],
  imports: [
    CommonModule,
    NzMenuModule,
    ComponentsModule,
    VtTbCoThoihanLuukhoConSauThangModule,
  ],
  exports: [
    DanhSachHangDuTruTrongKhoNgoaiDanhMucComponent,
    DanhSachHangDuTruTheoChiDaoCuaCpComponent,
    QuyetDinhXuatHangKhoiDanhMucComponent,
    TongHopDanhSachHangDtqgThuocDienXuatKhoiDmComponent,
    BaoCaoKqXuatHangDtqgNgoaiDmComponent
  ],
  providers: [DatePipe]
})
export class XuatHangKhoiDanhMucModule {
}
