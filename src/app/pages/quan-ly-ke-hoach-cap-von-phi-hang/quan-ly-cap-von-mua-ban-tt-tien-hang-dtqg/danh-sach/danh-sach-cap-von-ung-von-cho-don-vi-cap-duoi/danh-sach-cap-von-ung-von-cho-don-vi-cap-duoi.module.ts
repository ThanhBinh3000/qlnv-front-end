import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachCapVonUngVonChoDonViCapDuoiRoutingModule } from './danh-sach-cap-von-ung-von-cho-don-vi-cap-duoi-routing.module';
import { DanhSachCapVonUngVonChoDonViCapDuoiComponent } from './danh-sach-cap-von-ung-von-cho-don-vi-cap-duoi.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [DanhSachCapVonUngVonChoDonViCapDuoiComponent],
  imports: [CommonModule, DanhSachCapVonUngVonChoDonViCapDuoiRoutingModule, ComponentsModule],
})
export class DanhSachCapVonUngVonChoDonViCapDuoiModule {}
