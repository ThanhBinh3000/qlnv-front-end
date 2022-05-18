import { DanhSachDanhMucGocRoutingModule } from './danh-sach-danh-muc-goc-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DanhSachDanhMucGocComponent } from './danh-sach-danh-muc-goc.component';

@NgModule({
  declarations: [DanhSachDanhMucGocComponent],
  imports: [CommonModule, DanhSachDanhMucGocRoutingModule, ComponentsModule],
})
export class DanhSachDanhMucGocModule {}
