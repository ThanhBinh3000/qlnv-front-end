import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NzAffixModule } from 'ng-zorro-antd/affix';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { QuanLyKeHoachVonPhiHangRoutingModule } from './quan-ly-ke-hoach-von-phi-hang-routing.module';
import { QuanLyKeHoachVonPhiHangComponent } from './quan-ly-ke-hoach-von-phi-hang.component';

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
export class QuanLyKeHoachVonPhiHangModule { }
