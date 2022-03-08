import { XayDungKeHoachVonDauTuComponent } from './xay-dung-ke-hoach-von-dau-tu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XayDungKeHoachVonDauTuRoutingModule } from './xay-dung-ke-hoach-von-dau-tu-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    XayDungKeHoachVonDauTuComponent,
  ],
  imports: [
    CommonModule,
    XayDungKeHoachVonDauTuRoutingModule,
    ComponentsModule,
  ],
})

export class XayDungKeHoachVonDauTuModule {}
