import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachGhiNhanCapVonUngVonTuDvctRoutingModule } from './danh-sach-ghi-nhan-cap-von-ung-von-tu-dvct-routing.module';
import { DanhSachGhiNhanCapVonUngVonTuDvctComponent } from './danh-sach-ghi-nhan-cap-von-ung-von-tu-dvct.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [DanhSachGhiNhanCapVonUngVonTuDvctComponent],
  imports: [CommonModule, DanhSachGhiNhanCapVonUngVonTuDvctRoutingModule, ComponentsModule],
})
export class DanhSachGhiNhanCapVonUngVonTuDvctModule {}
