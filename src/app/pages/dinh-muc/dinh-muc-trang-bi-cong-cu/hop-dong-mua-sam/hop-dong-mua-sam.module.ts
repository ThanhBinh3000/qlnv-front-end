import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DanhSachHopDongMuaSamComponent } from './danh-sach-hop-dong-mua-sam/danh-sach-hop-dong-mua-sam.component';
import { PhuLucHopDongMuaSamComponent } from './danh-sach-hop-dong-mua-sam/phu-luc-hop-dong-mua-sam/phu-luc-hop-dong-mua-sam.component';
import { ThongTinHopDongMuaSamComponent } from './danh-sach-hop-dong-mua-sam/thong-tin-hop-dong-mua-sam/thong-tin-hop-dong-mua-sam.component';
import { HopDongMuaSamComponent } from './hop-dong-mua-sam.component';


@NgModule({
  declarations: [
    HopDongMuaSamComponent,
    DanhSachHopDongMuaSamComponent,
    ThongTinHopDongMuaSamComponent,
    PhuLucHopDongMuaSamComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    HopDongMuaSamComponent,
    DanhSachHopDongMuaSamComponent,
  ]
})
export class HopDongMuaSamModule { }
