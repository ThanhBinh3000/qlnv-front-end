import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuanLyKeHoachVonPhiRoutingModule } from './quan-ly-ke-hoach-von-phi-routing.module';
import { QuanLyKeHoachVonPhiComponent } from './quan-ly-ke-hoach-von-phi.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { NzAffixModule } from 'ng-zorro-antd/affix';

@NgModule({
  declarations: [QuanLyKeHoachVonPhiComponent],
  imports: [
    CommonModule,
    QuanLyKeHoachVonPhiRoutingModule,
    ComponentsModule,
    MainModule,
    NzAffixModule,
  ],
})
export class QuanLyKeHoachVonPhiModule {}
