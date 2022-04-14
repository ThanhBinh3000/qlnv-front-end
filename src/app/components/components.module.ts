import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NgxPrintModule } from 'ngx-print';

import { FilterPipe } from '../pipes/filter.pipe';
import { DpDatePickerModule } from 'ng2-date-picker';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { NzTagModule } from 'ng-zorro-antd/tag';
import { TecaTreeSelectModule } from './tree-select/tree-select.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { UploadComponent } from './dialog/dialog-upload/upload.component';
import { DialogThemMoiVatTuComponent } from './dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component';
import { DialogThongTinPhuLucKHLCNTComponent } from './dialog/dialog-thong-tin-phu-luc-khlcnt/dialog-thong-tin-phu-luc-khlcnt.component';
import { DialogQuyetDinhGiaoChiTieuComponent } from './dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DialogThongTinPhuLucKHLCNTChoCacCucDTNNKVComponent } from './dialog/dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv/dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv.component';
import { DialogThemMoiGoiThauComponent } from './dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from './dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';
import { DialogDieuChinhThemThongTinLuongThucComponent } from './dialog/dialog-dieu-chinh-them-thong-tin-luong-thuc/dialog-dieu-chinh-them-thong-tin-luong-thuc.component';

import { DialogDieuChinhThemThongTinMuoiComponent } from './dialog/dialog-dieu-chinh-them-thong-tin-muoi/dialog-dieu-chinh-them-thong-tin-muoi.component';
import { DialogDieuChinhThemThongTinVatTuComponent } from './dialog/dialog-dieu-chinh-them-thong-tin-vat-tu/dialog-dieu-chinh-them-thong-tin-vat-tu.component';
import { DialogThongTinLuongThucComponent } from './dialog/dialog-thong-tin-luong-thuc/dialog-thong-tin-luong-thuc.component';
import { DialogThemThongTinMuoiComponent } from './dialog/dialog-them-thong-tin-muoi/dialog-them-thong-tin-muoi.component';
import { DialogLuaChonInComponent } from './dialog/dialog-lua-chon-in/dialog-lua-chon-in.component';
import { DialogThemThongTinVatTuTrongNamComponent } from './dialog/dialog-them-thong-tin-vat-tu-trong-nam/dialog-them-thong-tin-vat-tu-trong-nam.component';
import { DialogTuChoiComponent } from './dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DialogPhuongAnTrinhTongCucComponent } from './dialog/dialog-phuong-an-trinh-tong-cuc/dialog-phuong-an-trinh-tong-cuc.component';
import { DialogThongTinPhuLucHopDongMuaComponent } from './dialog/dialog-thong-tin-phu-luc-hop-dong-mua/dialog-thong-tin-phu-luc-hop-dong-mua.component';
import { DialogThemBienbanNghiemThuKeLotComponent } from './dialog/dialog-them-bien-ban-nghiem-thu-ke-lot/dialog-them-bien-ban-nghiem-thu-ke-lot.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { DialogLuaChonThemPhuLucComponent } from './dialog/dialog-lua-chon-them-phu-luc/dialog-lua-chon-them-phu-luc.component';
import { DialogChonThemKhoanMucComponent } from './dialog/dialog-chon-them-khoan-muc/dialog-chon-them-khoan-muc.component';
import { DialogChonThemBieuMauBaoCaoComponent } from './dialog/dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG/dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG.component';
import {DialogChonThemKhoanMucQlGiaoDuToanChiNSNNComponent} from './dialog/dialog-chon-them-khoan-muc-qd-giao-du-toan-chi-NSNN/dialog-chon-them-khoan-muc-qd-giao-du-toan-chi-NSNN.component'
import { DialogMuaLuongThucMuoiComponent } from './dialog/dialog-quan-ly-ke-hoach-cap-von-phi-hang/dialog-quan-ly-cap-nguon-von-chi/dialog-mua-luong-thuc-muoi/dialog-mua-luong-thuc-muoi.component';
import { DialogMuaHangDtqgComponent } from './dialog/dialog-quan-ly-ke-hoach-cap-von-phi-hang/dialog-quan-ly-cap-nguon-von-chi/dialog-mua-hang-dtqg/dialog-mua-hang-dtqg.component';
import { DialogChonKeHoachPhanBoGiaoDuToanChoChiCucVanPhongCucComponent } from './dialog/dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc/dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc.component';
import { DialogDanhSachMuaTbiVtuComponent } from './dialog/dialog-quan-ly-ke-hoach-cap-von-phi-hang/dialog-quan-ly-cap-nguon-von-chi/dialog-danh-sach-mua-tbi-vtu/dialog-danh-sach-mua-tbi-vtu.component';
@NgModule({
  declarations: [
    // components
    UploadComponent,
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
    DialogPhuongAnTrinhTongCucComponent,
    DialogThongTinPhuLucHopDongMuaComponent,
    DialogThemBienbanNghiemThuKeLotComponent,
    DialogChonKeHoachPhanBoGiaoDuToanChoChiCucVanPhongCucComponent,
    //pipes
    FilterPipe,

    //
    DialogLuaChonThemPhuLucComponent,
    DialogChonThemKhoanMucComponent,
    DialogChonThemBieuMauBaoCaoComponent,
    DialogChonThemKhoanMucQlGiaoDuToanChiNSNNComponent,
    //
    DialogMuaLuongThucMuoiComponent,
    DialogMuaHangDtqgComponent,
    DialogDanhSachMuaTbiVtuComponent,
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
  ],
  exports: [
    FormsModule,
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
    NzPopconfirmModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ComponentsModule { }
