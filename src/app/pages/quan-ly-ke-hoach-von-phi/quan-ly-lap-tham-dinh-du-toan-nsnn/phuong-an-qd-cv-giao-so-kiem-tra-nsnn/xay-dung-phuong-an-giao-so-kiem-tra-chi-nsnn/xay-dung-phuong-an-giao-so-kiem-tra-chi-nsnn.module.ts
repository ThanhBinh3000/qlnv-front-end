import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XayDungPhuongAnGiaoSoKiemTraChiNsnnRoutingModule } from './xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn-routing.module';
import { XayDungPhuongAnGiaoSoKiemTraChiNsnnComponent } from './xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [XayDungPhuongAnGiaoSoKiemTraChiNsnnComponent],
  imports: [CommonModule, XayDungPhuongAnGiaoSoKiemTraChiNsnnRoutingModule, ComponentsModule],
})
export class XayDungPhuongAnGiaoSoKiemTraChiNsnnModule {}
