import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DieuChinhKeHoachComponent } from './dieu-chinh-ke-hoach.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DeXuatDieuChinhComponent } from './de-xuat-dieu-chinh/de-xuat-dieu-chinh.component';
import { DieuChinhChiTieuKeHoachNamComponent } from './dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { DieuChinhThongTinChiTieuKeHoachNamComponent } from './dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { ThongTinDeXuatDieuChinhComponent } from './de-xuat-dieu-chinh/thong-tin-de-xuat-dieu-chinh/thong-tin-de-xuat-dieu-chinh.component';
import { PhuongAnDieuChinhCtkhComponent } from './phuong-an-dieu-chinh-ctkh/phuong-an-dieu-chinh-ctkh.component';
import { ThongTinPhuongAnDieuChinhComponent } from './phuong-an-dieu-chinh-ctkh/thong-tin-phuong-an-dieu-chinh/thong-tin-phuong-an-dieu-chinh.component';
import { KhongBanHanhComponent } from './phuong-an-dieu-chinh-ctkh/khong-ban-hanh/khong-ban-hanh.component';

@NgModule({
  declarations: [
    DieuChinhKeHoachComponent,
    DeXuatDieuChinhComponent,
    DieuChinhChiTieuKeHoachNamComponent,
    DieuChinhThongTinChiTieuKeHoachNamComponent,
    ThongTinDeXuatDieuChinhComponent,
    PhuongAnDieuChinhCtkhComponent,
    ThongTinPhuongAnDieuChinhComponent,
    KhongBanHanhComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    DieuChinhKeHoachComponent,
    DeXuatDieuChinhComponent,
    DieuChinhChiTieuKeHoachNamComponent,
    DieuChinhThongTinChiTieuKeHoachNamComponent,
    ThongTinDeXuatDieuChinhComponent,
    PhuongAnDieuChinhCtkhComponent,
    ThongTinPhuongAnDieuChinhComponent
  ]
})
export class DieuChinhKeHoachModule { }
