import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuanLyKeHoachVonPhiHangRoutingModule } from './quan-ly-ke-hoach-von-phi-hang-routing.module';
import { QuanLyKeHoachVonPhiHangComponent } from './quan-ly-ke-hoach-von-phi-hang.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { NzAffixModule } from 'ng-zorro-antd/affix';

@NgModule({
  declarations: [QuanLyKeHoachVonPhiHangComponent],
  imports: [
    CommonModule,
    QuanLyKeHoachVonPhiHangRoutingModule,
    ComponentsModule,
    MainModule,
    NzAffixModule,
  ],
})
export class QuanLyKeHoachVonPhiHangModule {}
