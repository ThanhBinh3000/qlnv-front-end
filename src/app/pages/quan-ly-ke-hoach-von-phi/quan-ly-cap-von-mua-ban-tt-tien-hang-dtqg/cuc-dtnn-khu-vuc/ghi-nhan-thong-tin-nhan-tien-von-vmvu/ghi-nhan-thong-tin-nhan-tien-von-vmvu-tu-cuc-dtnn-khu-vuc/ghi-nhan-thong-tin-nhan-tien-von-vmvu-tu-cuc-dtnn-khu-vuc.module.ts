import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucRoutingModule } from './ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-cuc-dtnn-khu-vuc-routing.module';
import { GhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucComponent } from './ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-cuc-dtnn-khu-vuc.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    GhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucComponent
  ],
  imports: [
    CommonModule,
    GhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucRoutingModule,
    ComponentsModule,
  ],
})

export class GhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucModule {}
