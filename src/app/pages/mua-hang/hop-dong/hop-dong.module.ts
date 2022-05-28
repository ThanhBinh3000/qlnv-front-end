import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DanhSachHopDongComponent } from './danh-sach-hop-dong/danh-sach-hop-dong.component';
import { ThongTinComponent } from './danh-sach-hop-dong/thong-tin/thong-tin.component';
import { HopDongRoutingModule } from './hop-dong-routing.module';
import { HopDongComponent } from './hop-dong.component';


@NgModule({
  declarations: [
    HopDongComponent,
    DanhSachHopDongComponent,
    ThongTinComponent,
  ],
  imports: [CommonModule, HopDongRoutingModule, ComponentsModule],
})
export class HopDongModule { }
