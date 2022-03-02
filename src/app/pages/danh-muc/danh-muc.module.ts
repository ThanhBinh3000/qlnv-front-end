import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhMucRoutingModule } from './danh-muc-routing.module';
import { DanhMucComponent } from './danh-muc.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { NzAffixModule } from 'ng-zorro-antd/affix';

@NgModule({
  declarations: [DanhMucComponent],
  imports: [
    CommonModule,
    DanhMucRoutingModule,
    ComponentsModule,
    MainModule,
    NzAffixModule,
  ],
})
export class DanhMucModule {}
