import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GhiNhanVonTaiCkvCcRoutingModule } from './ghi-nhan-von-tai-ckv-cc-routing.module';
import { GhiNhanVonTaiCkvCcComponent } from './ghi-nhan-von-tai-ckv-cc.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [GhiNhanVonTaiCkvCcComponent],
  imports: [CommonModule, GhiNhanVonTaiCkvCcRoutingModule, ComponentsModule],
})
export class GhiNhanVonTaiCkvCcModule {}
