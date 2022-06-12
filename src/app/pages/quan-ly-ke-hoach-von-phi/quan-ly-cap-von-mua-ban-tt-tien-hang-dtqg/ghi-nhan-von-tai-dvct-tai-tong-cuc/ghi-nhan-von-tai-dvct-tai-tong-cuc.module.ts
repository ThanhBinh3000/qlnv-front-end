import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GhiNhanVonTaiDvctTaiTongCucRoutingModule } from './ghi-nhan-von-tai-dvct-tai-tong-cuc-routing.module';
import { GhiNhanVonTaiDvctTaiTongCucComponent } from './ghi-nhan-von-tai-dvct-tai-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [GhiNhanVonTaiDvctTaiTongCucComponent],
  imports: [CommonModule, GhiNhanVonTaiDvctTaiTongCucRoutingModule, ComponentsModule],
})
export class GhiNhanVonTaiDvctTaiTongCucModule {}
