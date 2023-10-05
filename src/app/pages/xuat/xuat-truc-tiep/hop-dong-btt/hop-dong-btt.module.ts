import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { HopDongBttComponent } from './hop-dong-btt.component';
import { MainHopDongBttComponent } from './main-hop-dong-btt/main-hop-dong-btt.component';
import { DanhSachHopDongBttComponent } from './danh-sach-hop-dong-btt/danh-sach-hop-dong-btt.component';
import { ThongTinHopDongBttComponent } from './danh-sach-hop-dong-btt/thong-tin-hop-dong-btt/thong-tin-hop-dong-btt.component';
import { QuanLyHopDongBttComponent } from './danh-sach-hop-dong-btt/quan-ly-hop-dong-btt/quan-ly-hop-dong-btt.component';
import { PhuLucBttComponent } from './danh-sach-hop-dong-btt/phu-luc-btt/phu-luc-btt.component';
import { BangKeBanHangComponent } from './bang-ke-ban-hang/bang-ke-ban-hang.component';
import { DanhSachBanTrucTiepChiCucComponent } from './danh-sach-hop-dong-btt/danh-sach-ban-truc-tiep-chi-cuc/danh-sach-ban-truc-tiep-chi-cuc.component';


@NgModule({
  declarations: [
    HopDongBttComponent,
    MainHopDongBttComponent,
    DanhSachHopDongBttComponent,
    ThongTinHopDongBttComponent,
    QuanLyHopDongBttComponent,
    PhuLucBttComponent,
    BangKeBanHangComponent,
    DanhSachBanTrucTiepChiCucComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    HopDongBttComponent,
    ThongTinHopDongBttComponent,

  ]
})
export class HopDongBttModule { }
