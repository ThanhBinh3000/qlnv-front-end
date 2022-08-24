import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachNhapVonBanHangRoutingModule } from './danh-sach-nhap-von-ban-hang-routing.module';
import { DanhSachNhapVonBanHangComponent } from './danh-sach-nhap-von-ban-hang.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [DanhSachNhapVonBanHangComponent],
  imports: [CommonModule, DanhSachNhapVonBanHangRoutingModule, ComponentsModule],
})
export class DanhSachNhapVonBanHangModule {}
