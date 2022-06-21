import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { QuanLyKeHoachVonPhiRoutingModule } from './quan-ly-ke-hoach-von-phi-routing.module';
import { QuanLyKeHoachVonPhiComponent } from './quan-ly-ke-hoach-von-phi.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';

@NgModule({
  declarations: [QuanLyKeHoachVonPhiComponent],
  imports: [
    CommonModule,
    QuanLyKeHoachVonPhiRoutingModule,
    ComponentsModule,
    MainModule,
    NzAffixModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: vi_VN },
	DatePipe,
  ],
})
export class QuanLyKeHoachVonPhiModule {}
