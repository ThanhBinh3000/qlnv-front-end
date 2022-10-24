import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GhiNhanTaiTongCucRoutingModule } from './ghi-nhan-tai-tong-cuc-routing.module';
import { GhiNhanTaiTongCucComponent } from './ghi-nhan-tai-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [GhiNhanTaiTongCucComponent],
  imports: [CommonModule, GhiNhanTaiTongCucRoutingModule, ComponentsModule],
})
export class GhiNhanTaiTongCucModule {}
