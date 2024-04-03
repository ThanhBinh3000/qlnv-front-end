import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { KiemSoatQuyenTruyCapComponent } from './kiem-soat-quyen-truy-cap/kiem-soat-quyen-truy-cap.component';
import { QuanLyCanBoComponent } from './quan-ly-can-bo/quan-ly-can-bo.component';
import { QuanLyQuyenComponent } from './quan-ly-quyen/quan-ly-quyen.component';
import { QuanTriHeThongNewRoutingModule } from './quan-tri-he-thong-routing.module';
import { QuanTriHeThongNewComponent } from './quan-tri-he-thong.component';
import { QuanTriThamSoComponent } from './quan-tri-tham-so/quan-tri-tham-so.component';
import { ThemMoiQtriThamSoComponent } from "./quan-tri-tham-so/them-moi-qtri-tham-so/them-moi-qtri-tham-so.component";
import { ThongKeTruyCapComponent } from './thong-ke-truy-cap/thong-ke-truy-cap.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { QuanLyChungThuSoComponent } from './quan-ly-thong-tin/quan-ly-chung-thu-so/quan-ly-chung-thu-so.component';
import { ChotDieuChinhComponent } from './chot-du-lieu/chot-dieu-chinh/chot-dieu-chinh.component';
import { KetChuyenComponent } from './chot-du-lieu/ket-chuyen/ket-chuyen.component';
import { ThemChungThuSoComponent } from './quan-ly-thong-tin/quan-ly-chung-thu-so/them-chung-thu-so/them-chung-thu-so.component';
import { QuanLyThongTinTienIchComponent } from './quan-ly-thong-tin/quan-ly-thong-tin-tien-ich/quan-ly-thong-tin-tien-ich.component';
import { ThemThongTinTienIchComponent } from './quan-ly-thong-tin/quan-ly-thong-tin-tien-ich/them-thong-tin-tien-ich/them-thong-tin-tien-ich.component';
import { CauHinhDangNhapComponent } from './cau-hinh-dang-nhap/cau-hinh-dang-nhap.component';
import { CauHinhHeThongComponent } from './kiem-soat-quyen-truy-cap/cau-hinh-he-thong/cau-hinh-he-thong.component';
import { CauHinhKetNoiKtnbComponent } from './cau-hinh-ket-noi-ktnb/cau-hinh-ket-noi-ktnb.component';
import { TmKetChuyenComponent } from './chot-du-lieu/ket-chuyen/tm-ket-chuyen/tm-ket-chuyen.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import {
  QuanLyTiepNhanBcBoNganhComponent
} from "./quan-ly-thong-tin/quan-ly-tiep-nhan-bc-bo-nganh/quan-ly-tiep-nhan-bc-bo-nganh.component";
import {
  ThemTiepNhanBcBoNganhComponent
} from "./quan-ly-thong-tin/quan-ly-tiep-nhan-bc-bo-nganh/them-chung-thu-so/them-tiep-nhan-bc-bo-nganh.component";
import { EditorModule } from '@tinymce/tinymce-angular';
@NgModule({
  declarations: [
    QuanLyCanBoComponent,
    QuanTriHeThongNewComponent,
    QuanLyQuyenComponent,
    KiemSoatQuyenTruyCapComponent,
    QuanTriThamSoComponent,
    ThemMoiQtriThamSoComponent,
    ThongKeTruyCapComponent,
    QuanLyChungThuSoComponent,
    ChotDieuChinhComponent,
    KetChuyenComponent,
    ThemChungThuSoComponent,
    QuanLyThongTinTienIchComponent,
    ThemThongTinTienIchComponent,
    CauHinhDangNhapComponent,
    CauHinhHeThongComponent,
    CauHinhKetNoiKtnbComponent,
    QuanLyTiepNhanBcBoNganhComponent,
    ThemTiepNhanBcBoNganhComponent,
    TmKetChuyenComponent
  ],
  imports: [CommonModule, QuanTriHeThongNewRoutingModule, ComponentsModule, MainModule, NzTreeViewModule, NgApexchartsModule, FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),EditorModule],

})
export class QuanTriHeThongNewModule { }
