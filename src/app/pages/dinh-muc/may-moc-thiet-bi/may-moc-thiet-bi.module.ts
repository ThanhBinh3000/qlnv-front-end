import { ComponentsModule } from './../../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MayMocThietBiComponent } from './may-moc-thiet-bi.component';
import { MayMocThietBiRoutingModule } from './may-moc-thiet-bi-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    MayMocThietBiRoutingModule,
  ],
  declarations: [MayMocThietBiComponent]
})
export class MayMocThietBiModule { }
