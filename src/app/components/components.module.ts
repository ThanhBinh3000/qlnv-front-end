import { CommonModule, DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DialogCopyGiaoDuToanComponent } from './dialog/dialog-copy-giao-du-toan/dialog-copy-giao-du-toan.component';
import { DialogCopyQuyetToanVonPhiHangDtqgComponent } from './dialog/dialog-copy-quyet-toan-von-phi-hang-dtqg/dialog-copy-quyet-toan-von-phi-hang-dtqg.component';
import { DialogDieuChinhCopyComponent } from './dialog/dialog-dieu-chinh-copy/dialog-dieu-chinh-copy.component';
import { DialogDieuChinhQuyetDinhPheDuyetComponent } from './dialog/dialog-dieu-chinh-quyet-dinh-phe-duyet-mtt/dialog-dieu-chinh-quyet-dinh-phe-duyet-mtt.component';
import { DialogChonPhuLucDieuChinhComponent } from './dialog/dialog-quan-ly-dieu-chinh-du-toan-chi-nsnn/dialog-chon-phu-luc-dieu-chinh/dialog-chon-phu-luc-dieu-chinh.component';
import { FileListComponent } from './file-list/file-list.component';

import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NgxPrintModule } from 'ngx-print';

import { DpDatePickerModule } from 'ng2-date-picker';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FilterPipe } from '../pipes/filter.pipe';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { DialogDieuChinhThemThongTinLuongThucComponent } from './dialog/dialog-dieu-chinh-them-thong-tin-luong-thuc/dialog-dieu-chinh-them-thong-tin-luong-thuc.component';
import { DialogQuyetDinhGiaoChiTieuComponent } from './dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DialogThemMoiGoiThauComponent } from './dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DialogThemMoiVatTuComponent } from './dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component';
import { DialogThongTinPhuLucKHLCNTChoCacCucDTNNKVComponent } from './dialog/dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv/dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv.component';
import { DialogThongTinPhuLucKHLCNTComponent } from './dialog/dialog-thong-tin-phu-luc-khlcnt/dialog-thong-tin-phu-luc-khlcnt.component';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from './dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';
import { UploadComponent } from './dialog/dialog-upload/upload.component';
import { TecaTreeSelectModule } from './tree-select/tree-select.module';

import { DialogBaoCaoBienBanNghiemThuKeLotComponent } from './dialog/dialog-bao-cao-bien-ban-nghiem-thu-ke-lot/dialog-bao-cao-bien-ban-nghiem-thu-ke-lot.component';
import { DialogCanCuHopDongComponent } from './dialog/dialog-can-cu-hop-dong/dialog-can-cu-hop-dong.component';
import { DialogCanCuQDPheDuyetKHLCNTComponent } from './dialog/dialog-can-cu-qd-phe-duyet-khlcnt/dialog-can-cu-qd-phe-duyet-khlcnt.component';
import { DialogCanhBaoComponent } from './dialog/dialog-canh-bao/dialog-canh-bao.component';
import { DialogChiTietHangHoaNhapKhoComponent } from './dialog/dialog-chi-tiet-hang-hoa-nhap-kho/dialog-chi-tiet-hang-hoa-nhap-kho.component';
import { DialogChiTietQuyetDinhGiaNhapComponent } from './dialog/dialog-chi-tiet-quyet-dinh-gia-nhap/dialog-chi-tiet-quyet-dinh-gia-nhap.component';
import { DialogChiTietQuyetDinhKhMuaTrucTiepComponent } from './dialog/dialog-chi-tiet-quyet-dinh-ke-hoach-mua-truc-tiep/dialog-chi-tiet-quyet-dinh-ke-hoach-mua-truc-tiep.component';
import { DialogDanhSachChiCucComponent } from './dialog/dialog-danh-sach-chi-cuc/dialog-danh-sach-chi-cuc.component';
import { DialogDanhSachChiTietNganKhoComponent } from './dialog/dialog-danh-sach-chi-tiet-ngan-kho/dialog-danh-sach-chi-tiet-ngan-kho.component';
import { DialogDanhSachHangHoaComponent } from './dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogDieuChinhThemThongTinMuoiComponent } from './dialog/dialog-dieu-chinh-them-thong-tin-muoi/dialog-dieu-chinh-them-thong-tin-muoi.component';
import { DialogDieuChinhThemThongTinVatTuComponent } from './dialog/dialog-dieu-chinh-them-thong-tin-vat-tu/dialog-dieu-chinh-them-thong-tin-vat-tu.component';
import { DialogGuiDuyetComponent } from './dialog/dialog-gui-duyet/dialog-gui-duyet.component';
import { DialogKhongBanHanhComponent } from './dialog/dialog-khong-ban-hanh/dialog-khong-ban-hanh.component';
import { DialogLuaChonInComponent } from './dialog/dialog-lua-chon-in/dialog-lua-chon-in.component';
import { DialogPhieuKiemTraChatLuongComponent } from './dialog/dialog-phieu-kiem-tra-chat-luong/dialog-phieu-kiem-tra-chat-luong.component';
import { DialogPhieuNhapKhoComponent } from './dialog/dialog-phieu-nhap-kho/dialog-phieu-nhap-kho.component';
import { DialogPhuongAnTrinhTongCucComponent } from './dialog/dialog-phuong-an-trinh-tong-cuc/dialog-phuong-an-trinh-tong-cuc.component';
import { DialogThemBienbanNghiemThuKeLotComponent } from './dialog/dialog-them-bien-ban-nghiem-thu-ke-lot/dialog-them-bien-ban-nghiem-thu-ke-lot.component';
import { DialogThemMoiCtbbChuanBiKhoTruocKhiNhapComponent } from './dialog/dialog-them-moi-ctbb-chuan-bi-kho-truoc-khi-nhap/dialog-them-moi-ctbb-chuan-bi-kho-truoc-khi-nhap.component';
import { DialogThongTinKeLotBaoQuanBanDauComponent } from './dialog/dialog-them-thong-tin-ke-lot-bao-quan-ban-dau/dialog-them-thong-tin-ke-lot-bao-quan-ban-dau.component';
import { DialogThemThongTinMuoiComponent } from './dialog/dialog-them-thong-tin-muoi/dialog-them-thong-tin-muoi.component';
import { DialogThemThongTinVatTuTrongNamComponent } from './dialog/dialog-them-thong-tin-vat-tu-trong-nam/dialog-them-thong-tin-vat-tu-trong-nam.component';
import { DialogThongTinChiTietGoiThauComponent } from './dialog/dialog-thong-tin-chi-tiet-goi-thau-vat-tu/dialog-thong-tin-chi-tiet-goi-thau-vat-tu.component';
import { DialogThongTinDonViThucHienQuyetDinhComponent } from './dialog/dialog-thong-tin-danh-sach-don-vi-thuc-hien-quyet-dinh/dialog-thong-tin-danh-sach-don-vi-thuc-hien-quyet-dinh.component';
import { DialogThongTinLenhNhapKhoComponent } from './dialog/dialog-thong-tin-lenh-nhap-kho/dialog-thong-tin-lenh-nhap-kho.component';
import { DialogThongTinLuongThucComponent } from './dialog/dialog-thong-tin-luong-thuc/dialog-thong-tin-luong-thuc.component';
import { DialogThongTinPhuLucHopDongMuaVatTuComponent } from './dialog/dialog-thong-tin-phu-luc-hop-dong-mua-vat-tu/dialog-thong-tin-phu-luc-hop-dong-mua-vat-tu.component';
import { DialogThongTinPhuLucHopDongMuaComponent } from './dialog/dialog-thong-tin-phu-luc-hop-dong-mua/dialog-thong-tin-phu-luc-hop-dong-mua.component';
import { DialogThongTinVatTuHangHoaComponent } from './dialog/dialog-thong-tin-vat-tu-hang-hoa/dialog-thong-tin-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from './dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DialogVanBanSanSangBanHanhComponent } from './dialog/dialog-van-ban-san-sang-ban-hanh/dialog-van-ban-san-sang-ban-hanh.component';
import { MultipleTagComponent } from './multiple-tag/multiple-tag.component';

import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzResultModule } from 'ng-zorro-antd/result';
import { DialogBaoCaoCopyComponent } from './dialog/dialog-bao-cao-copy/dialog-bao-cao-copy.component';
import { DialogCanCuKQLCNTComponent } from './dialog/dialog-can-cu-kqlcnt/dialog-can-cu-kqlcnt.component';
import { DialogCanCuQdPheDuyetKqdgComponent } from './dialog/dialog-can-cu-qd-phe-duyet-kqdg/dialog-can-cu-qd-phe-duyet-kqdg.component';
import { DialogChiTietGiaoDichHangTrongKhoComponent } from './dialog/dialog-chi-tiet-giao-dich-hang-trong-kho/dialog-chi-tiet-giao-dich-hang-trong-kho.component';
import { DialogChiTietKeHoachGiaoBoNganhUbtvqhMuaBuBoSungComponent } from './dialog/dialog-chi-tiet-ke-hoach-giao-bo-nganh-ubtvqh-mua-bu-bo-sung/dialog-chi-tiet-ke-hoach-giao-bo-nganh-ubtvqh-mua-bu-bo-sung.component';
import { MuaBoSungComponent } from './dialog/dialog-chi-tiet-ke-hoach-giao-bo-nganh-ubtvqh-mua-bu-bo-sung/mua-bo-sung/mua-bo-sung.component';
import { MuaBuComponent } from './dialog/dialog-chi-tiet-ke-hoach-giao-bo-nganh-ubtvqh-mua-bu-bo-sung/mua-bu/mua-bu.component';
import { DialogChiTietKeHoachGiaoBoNganhComponent } from './dialog/dialog-chi-tiet-ke-hoach-giao-bo-nganh/dialog-chi-tiet-ke-hoach-giao-bo-nganh.component';
import { KeHoachLuongThucComponent } from './dialog/dialog-chi-tiet-ke-hoach-giao-bo-nganh/ke-hoach-luong-thuc/ke-hoach-luong-thuc.component';
import { KeHoachXuatGiamComponent } from './dialog/dialog-chi-tiet-ke-hoach-giao-bo-nganh/ke-hoach-xuat-giam/ke-hoach-xuat-giam.component';
import { DialogChonKeHoachPhanBoGiaoDuToanChoChiCucVanPhongCucComponent } from './dialog/dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc/dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc.component';
import { DialogChonThemBieuMauComponent } from './dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import { DialogChonThemKhoanMucQlGiaoDuToanChiNSNNComponent } from './dialog/dialog-chon-them-khoan-muc-qd-giao-du-toan-chi-NSNN/dialog-chon-them-khoan-muc-qd-giao-du-toan-chi-NSNN.component';
import { DialogCopyComponent } from './dialog/dialog-copy/dialog-copy.component';
import { DialogDdiemDeHangComponent } from './dialog/dialog-ddiem-de-hang/dialog-ddiem-de-hang.component';
import { DialogDiaDiemKhoComponent } from './dialog/dialog-dia-diem-kho/dialog-dia-diem-kho.component';
import { DialogDoCopyComponent } from './dialog/dialog-do-copy/dialog-do-copy.component';
import { DanhSachQuyetDinhPhanBoComponent } from './dialog/dialog-ds-qd-phan-bo/dialog-ds-qd-phan-bo.component';
import { DialogQuyetDinhGiaCuaTcdtnnComponent } from './dialog/dialog-ke-hoach-phuong-an-gia/dialog-quyet-dinh-gia-cua-tcdtnn/dialog-quyet-dinh-gia-cua-tcdtnn.component';
import { DialogToTrinhTongHopComponent } from './dialog/dialog-ke-hoach-phuong-an-gia/dialog-to-trinh-tong-hop/dialog-to-trinh-tong-hop.component';
import { DialogLuaChonThemDonViComponent } from './dialog/dialog-lua-chon-them-don-vi/dialog-lua-chon-them-don-vi.component';
import { DialogMuabuBosungBtcComponent } from './dialog/dialog-muabu-bosung-btc/dialog-muabu-bosung-btc.component';
import { MuaBuBoSungComponent } from './dialog/dialog-muabu-bosung-btc/mua-bu-bo-sung/mua-bu-bo-sung.component';
import { DialogNhomQuyenComponent } from './dialog/dialog-nhom-quyen/dialog-nhom-quyen.component';
import { DialogPhanQuyenComponent } from './dialog/dialog-phan-quyen/dialog-phan-quyen.component';
import { DialogQdMuabubosungTtcpComponent } from './dialog/dialog-qd-muabubosung-ttcp/dialog-qd-muabubosung-ttcp.component';
import { MuabuBosungComponent } from './dialog/dialog-qd-muabubosung-ttcp/muabu-bosung/muabu-bosung.component';
import { DialogQuyenComponent } from './dialog/dialog-quyen/dialog-quyen.component';
import { DialogSoToTrinhPagComponent } from './dialog/dialog-so-to-trinh-pag/dialog-so-to-trinh-pag.component';
import { DialogThemDanhMucDungChungComponent } from './dialog/dialog-them-danh-muc-dung-chung/dialog-them-danh-muc-dung-chung.component';
import { DialogThemDiaDiemNhapKhoComponent } from './dialog/dialog-them-dia-diem-nhap-kho/dialog-them-dia-diem-nhap-kho.component';
import { DialogThemKhoanMucComponent } from './dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogThemQuyenComponent } from './dialog/dialog-them-quyen/dialog-them-quyen.component';
import { DialogThongTinCanBoComponent } from './dialog/dialog-thong-tin-can-bo/dialog-thong-tin-can-bo.component';
import { DialogThongTinPhuLucBangGiaHopDongComponent } from './dialog/dialog-thong-tin-phu-luc-bang-gia-hop-dong/dialog-thong-tin-phu-luc-bang-gia-hop-dong.component';
import { DialogTTPhuLucQDDCBanDauGiaComponent } from './dialog/dialog-thong-tin-phu-luc-qddc-ban-dau-gia/dialog-thong-tin-phu-luc-qddc-ban-dau-gia.component';
import { DialogTongHopGiaoComponent } from './dialog/dialog-tong-hop-giao/dialog-tong-hop-giao.component';
import { DialogThemVatTuComponent } from './dialog/dialog-vat-tu/dialog-vat-tu.component';

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NgxCurrencyModule } from 'ngx-currency';
import { BaseComponent } from './base/base.component';
import { Base2Component } from './base2/base2.component';
import { DialogCanCuThongTinChaoGiaComponent } from './dialog/dialog-can-cu-thong-tin-chao-gia/dialog-can-cu-thong-tin-chao-gia.component';
import { DialogChonDanhMucComponent } from './dialog/dialog-chon-danh-muc/dialog-chon-danh-muc.component';
import { DialogDanhMucKhoComponent } from './dialog/dialog-danh-muc-kho/dialog-danh-muc-kho.component';
import { DialogDanhSachVatTuHangHoaComponent } from './dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogDiaDiemNhapKhoComponent } from './dialog/dialog-dia-diem-nhap-kho/dialog-dia-diem-nhap-kho.component';
import { DialogToTrinhDeXuatComponent } from "./dialog/dialog-ke-hoach-phuong-an-gia/dialog-to-trinh-de-xuat/dialog-to-trinh-de-xuat.component";
import { DialogKtGiaoKhoComponent } from './dialog/dialog-kt-giao-kho/dialog-kt-giao-kho.component';
import { DialogMmMuaSamComponent } from './dialog/dialog-mm-mua-sam/dialog-mm-mua-sam.component';
import { DialogQdXdTrungHanComponent } from './dialog/dialog-qd-xd-trung-han/dialog-qd-xd-trung-han.component';
import { DialogSoQuyetDinhQlyKhoTangComponent } from './dialog/dialog-so-quyet-dinh-qly-kho-tang/dialog-so-quyet-dinh-qly-kho-tang.component';
import { DialogTableSelectionComponent } from './dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogThemChiCucComponent } from './dialog/dialog-them-chi-cuc/dialog-them-chi-cuc.component';
import { DialogThemDiaDiemPhanLoComponent } from './dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';
import { DialogThemMoiBangKeBanLeComponent } from './dialog/dialog-them-moi-bang-ke-ban-le/dialog-them-moi-bang-ke-ban-le.component';
import { DialogThemMoiBangKeThuMuaLeComponent } from './dialog/dialog-them-moi-bang-ke-thu-mua-le/dialog-them-moi-bang-ke-thu-mua-le.component';
import { DialogThemMoiKeHoachMuaTrucTiepComponent } from './dialog/dialog-them-moi-ke-hoach-mua-truc-tiep/dialog-them-moi-ke-hoach-mua-truc-tiep.component';
import { DialogThemMoiSoDuDauKyComponent } from './dialog/dialog-them-moi-so-du-dau-ky/dialog-them-moi-so-du-dau-ky.component';
import { DialogThemMoiXuatBanTrucTiepComponent } from './dialog/dialog-them-moi-xuat-ban-truc-tiep/dialog-them-moi-xuat-ban-truc-tiep.component';
import {
  DialogThongBaoThongTinDauThauComponent
} from "./dialog/dialog-thong-bao-thong-tin-dau-thau/dialog-thong-bao-thong-tin-dau-thau.component";
import { DialogTongHopHangSuaChuaDtqgComponent } from './dialog/dialog-tong-hop-hang-sua-chua-dtqg/dialog-tong-hop-hang-sua-chua-dtqg.component';
import {
  DialogQdPdKhlcntComponent
} from "./dialog/ql-kho-tang/dialog-qd-pd-khlcnt/dialog-qd-pd-khlcnt.component";
import { DialogQdPdKqlcntComponent } from "./dialog/ql-kho-tang/dialog-qd-pd-kqlcnt/dialog-qd-pd-kqlcnt.component";
import { FmInputNumberComponent } from './fm-input-number.component';
import { TemplateErrorComponent } from './template-error/template-error.component';
import { DialogChonDanhMucChoBieuMauComponent } from './dialog/dialog-chon-danh-muc-cho-bieu-mau/dialog-chon-danh-muc-cho-bieu-mau.component';
import { DialogCongVanComponent } from './dialog/dialog-cong-van/dialog-cong-van.component';
@NgModule({
  declarations: [
    //components
    UploadComponent,
    FmInputNumberComponent,
    DialogThemMoiVatTuComponent,
    DialogThongTinPhuLucKHLCNTComponent,
    DialogQuyetDinhGiaoChiTieuComponent,
    DialogThongTinPhuLucKHLCNTChoCacCucDTNNKVComponent,
    DialogThemMoiGoiThauComponent,
    DialogThongTinPhuLucQuyetDinhPheDuyetComponent,
    DialogDieuChinhThemThongTinLuongThucComponent,
    DialogDieuChinhThemThongTinMuoiComponent,
    DialogDieuChinhThemThongTinVatTuComponent,
    DialogThongTinLuongThucComponent,
    DialogThemThongTinMuoiComponent,
    DialogLuaChonInComponent,
    DialogThemThongTinVatTuTrongNamComponent,
    DialogTuChoiComponent,
    DialogKhongBanHanhComponent,
    DialogPhuongAnTrinhTongCucComponent,
    DialogThongTinPhuLucHopDongMuaComponent,
    DialogThemBienbanNghiemThuKeLotComponent,
    DialogThongTinChiTietGoiThauComponent,
    DialogThongTinPhuLucHopDongMuaVatTuComponent,
    DialogCanCuQDPheDuyetKHLCNTComponent,
    DialogThongTinDonViThucHienQuyetDinhComponent,
    DialogCanCuHopDongComponent,
    DialogChiTietHangHoaNhapKhoComponent,
    DialogDanhSachChiTietNganKhoComponent,
    DialogDanhSachHangHoaComponent,
    DialogThemMoiCtbbChuanBiKhoTruocKhiNhapComponent,
    DialogChiTietQuyetDinhKhMuaTrucTiepComponent,
    DialogChiTietQuyetDinhGiaNhapComponent,
    DialogPhieuKiemTraChatLuongComponent,
    DialogThongTinVatTuHangHoaComponent,
    DialogDanhSachChiCucComponent,
    DialogCanhBaoComponent,
    DialogThongTinLenhNhapKhoComponent,
    DialogThongTinKeLotBaoQuanBanDauComponent,
    DialogBaoCaoBienBanNghiemThuKeLotComponent,
    DialogPhieuNhapKhoComponent,
    DialogGuiDuyetComponent,
    DialogVanBanSanSangBanHanhComponent,
    DialogThongTinPhuLucBangGiaHopDongComponent,
    DialogCanCuKQLCNTComponent,
    MultipleTagComponent,
    DialogDiaDiemKhoComponent,
    DialogChonPhuLucDieuChinhComponent,
    DialogChonDanhMucChoBieuMauComponent,
    //pipes
    FilterPipe,

    DialogChonKeHoachPhanBoGiaoDuToanChoChiCucVanPhongCucComponent,

    DialogChonThemKhoanMucQlGiaoDuToanChiNSNNComponent,
    //
    DialogCopyComponent,
    DialogChonThemBieuMauComponent,
    DialogThemKhoanMucComponent,
    DialogLuaChonThemDonViComponent,
    DialogBaoCaoCopyComponent,
    DialogDoCopyComponent,
    DialogDieuChinhCopyComponent,
    DialogCopyGiaoDuToanComponent,
    DialogCopyQuyetToanVonPhiHangDtqgComponent,
    DialogThemVatTuComponent,
    DanhSachQuyetDinhPhanBoComponent,
    DialogThemDiaDiemNhapKhoComponent,
    DialogThemDanhMucDungChungComponent,
    FileListComponent,
    FilterPipe,
    DialogChiTietKeHoachGiaoBoNganhComponent,
    KeHoachLuongThucComponent,
    KeHoachXuatGiamComponent,
    DialogTTPhuLucQDDCBanDauGiaComponent,
    DialogChiTietKeHoachGiaoBoNganhUbtvqhMuaBuBoSungComponent,
    MuaBuComponent,
    MuaBoSungComponent,
    DialogQdMuabubosungTtcpComponent,
    MuabuBosungComponent,
    DialogMuabuBosungBtcComponent,
    MuaBuBoSungComponent,
    DialogThongTinCanBoComponent,
    DialogPhanQuyenComponent,
    DialogQuyenComponent,
    DialogNhomQuyenComponent,
    DialogThemQuyenComponent,
    DialogChiTietGiaoDichHangTrongKhoComponent,
    DialogDdiemDeHangComponent,
    DialogSoToTrinhPagComponent,
    DialogDdiemDeHangComponent,
    DialogToTrinhTongHopComponent,
    DialogToTrinhDeXuatComponent,
    DialogQuyetDinhGiaCuaTcdtnnComponent,
    DialogTongHopGiaoComponent,
    DialogCanCuQdPheDuyetKqdgComponent,
    TemplateErrorComponent,
    DialogSoQuyetDinhQlyKhoTangComponent,
    DialogTableSelectionComponent,
    DialogDiaDiemNhapKhoComponent,
    BaseComponent,
    DialogTongHopHangSuaChuaDtqgComponent,
    DialogThemMoiKeHoachMuaTrucTiepComponent,
    DialogThemChiCucComponent,
    DialogCanCuThongTinChaoGiaComponent,
    DialogDieuChinhQuyetDinhPheDuyetComponent,
    DialogThemDiaDiemPhanLoComponent,
    DialogThemMoiSoDuDauKyComponent,
    DialogDanhSachVatTuHangHoaComponent,
    DialogChonDanhMucComponent,
    Base2Component,
    DialogThemMoiBangKeThuMuaLeComponent,
    DialogQdXdTrungHanComponent,
    DialogDanhMucKhoComponent,
    DialogThemMoiXuatBanTrucTiepComponent,
    DialogMmMuaSamComponent,
    DialogThemMoiBangKeBanLeComponent,
    DialogThongBaoThongTinDauThauComponent,
    DialogKtGiaoKhoComponent,
    DialogQdPdKhlcntComponent,
    DialogQdPdKqlcntComponent,
    DialogCongVanComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NzAffixModule,
    NzNotificationModule,
    NzBreadCrumbModule,
    NzLayoutModule,
    NzMenuModule,
    NzTabsModule,
    NzDropDownModule,
    NzAvatarModule,
    NzAffixModule,
    NzSelectModule,
    NzListModule,
    NzBadgeModule,
    NzCardModule,
    NzGridModule,
    NzCarouselModule,
    NzTimelineModule,
    NzCollapseModule,
    NzRadioModule,
    NzModalModule,
    NzDatePickerModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzUploadModule,
    NzCheckboxModule,
    NzTableModule,
    NzToolTipModule,
    NzPaginationModule,
    NzDividerModule,
    NzTreeModule,
    NzDescriptionsModule,
    NzCommentModule,
    NzTimePickerModule,
    NzStepsModule,
    // NzTreeSelectModule,
    NzInputNumberModule,
    NzPopoverModule,
    NzCalendarModule,
    NzSwitchModule,
    NzSpinModule,
    DpDatePickerModule,
    PdfViewerModule,
    NzDrawerModule,
    NzTagModule,
    NzAutocompleteModule,
    NgxPrintModule,
    TecaTreeSelectModule,
    NzAlertModule,
    DragDropModule,
    NzPopconfirmModule,
    NzResultModule,
    NzStatisticModule,
    NgxCurrencyModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  exports: [
    FormsModule,
    FmInputNumberComponent,
    ReactiveFormsModule,
    NgxSpinnerModule,

    NzNotificationModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NzTabsModule,
    NzDropDownModule,
    NzAvatarModule,
    NzAffixModule,
    NzListModule,
    NzIconModule,
    NzBadgeModule,
    NzCardModule,
    NzCarouselModule,
    NzTimelineModule,
    NzCollapseModule,
    NzRadioModule,
    NzModalModule,
    NzDatePickerModule,
    NzSelectModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzGridModule,
    NzUploadModule,
    NzCheckboxModule,
    NzTableModule,
    NzToolTipModule,
    NzPaginationModule,
    NzDividerModule,
    NzTreeModule,
    NzDescriptionsModule,
    NzCommentModule,
    NzTreeSelectModule,
    NzInputNumberModule,
    NzPopoverModule,
    NzTimePickerModule,
    NzCalendarModule,
    NzSwitchModule,
    NzStepsModule,
    NzSpinModule,
    DpDatePickerModule,
    PdfViewerModule,
    NzDrawerModule,
    NzTagModule,
    NzAutocompleteModule,
    NgxPrintModule,
    TecaTreeSelectModule,
    FilterPipe,
    NzAlertModule,
    MultipleTagComponent,
    NzPopconfirmModule,
    FileListComponent,
    NzResultModule,
    TemplateErrorComponent,
    DialogTableSelectionComponent,
    DialogDiaDiemNhapKhoComponent,
    BaseComponent,
    DialogThemChiCucComponent,
    DialogCanCuThongTinChaoGiaComponent,
    NgxCurrencyModule,
    DialogDieuChinhQuyetDinhPheDuyetComponent,
    DialogThemDiaDiemPhanLoComponent,
    DialogThemMoiSoDuDauKyComponent,
    DialogDanhSachVatTuHangHoaComponent,
    DialogChonDanhMucComponent,
    Base2Component,
  ],
  providers: [
    DatePipe,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ComponentsModule { }
