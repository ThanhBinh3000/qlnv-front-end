import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DanhSachHopDongComponent } from './danh-sach-hop-dong/danh-sach-hop-dong.component';
import { PhuLucComponent } from './danh-sach-hop-dong/phu-luc/phu-luc.component';
import { ThongTinComponent } from './danh-sach-hop-dong/thong-tin/thong-tin.component';
import { HopDongComponent } from './hop-dong.component';
import { MainHopDongComponent } from './main-hop-dong/main-hop-dong.component';
import { QuanlyHopdongComponent } from './danh-sach-hop-dong/quanly-hopdong/quanly-hopdong.component';
import { KeHoachBanDauGiaModule } from '../ke-hoach-ban-dau-gia/ke-hoach-ban-dau-gia.module';
import { ToChucTrienKhaiModule } from '../to-chuc-trien-khai/to-chuc-trien-khai.module';


@NgModule({
  declarations: [
    HopDongComponent,
    DanhSachHopDongComponent,
    ThongTinComponent,
    PhuLucComponent,
    MainHopDongComponent,
    QuanlyHopdongComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    KeHoachBanDauGiaModule,
    ToChucTrienKhaiModule
  ],
  exports: [
    HopDongComponent,
    ThongTinComponent

  ]
})
export class HopDongModule { }
