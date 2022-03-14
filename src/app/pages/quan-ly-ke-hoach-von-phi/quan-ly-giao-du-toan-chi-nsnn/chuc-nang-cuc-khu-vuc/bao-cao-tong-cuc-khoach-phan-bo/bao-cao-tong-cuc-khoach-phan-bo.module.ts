import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaoCaoTongCucKhoachPhanBoRoutingModule } from './bao-cao-tong-cuc-khoach-phan-bo-routing.module';
import { BaoCaoTongCucKhoachPhanBoComponent } from './bao-cao-tong-cuc-khoach-phan-bo.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    BaoCaoTongCucKhoachPhanBoComponent,
  ],
  imports: [
    CommonModule,
    BaoCaoTongCucKhoachPhanBoRoutingModule,
    ComponentsModule,
  ],
})

export class BaoCaoTongCucKhoachPhanBoModule {}
