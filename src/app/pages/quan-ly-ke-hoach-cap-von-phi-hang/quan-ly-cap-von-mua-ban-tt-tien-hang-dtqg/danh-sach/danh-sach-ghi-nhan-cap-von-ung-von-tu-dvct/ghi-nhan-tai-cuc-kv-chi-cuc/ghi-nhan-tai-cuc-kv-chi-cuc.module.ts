import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GhiNhanTaiCucKvChiCucRoutingModule } from './ghi-nhan-tai-cuc-kv-chi-cuc-routing.module';
import { GhiNhanTaiCucKvChiCucComponent } from './ghi-nhan-tai-cuc-kv-chi-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [GhiNhanTaiCucKvChiCucComponent],
  imports: [CommonModule, GhiNhanTaiCucKvChiCucRoutingModule, ComponentsModule],
})
export class GhiNhanTaiCucKvChiCucModule {}
