import { ComponentsModule } from './../../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MayMocThietBiComponent } from './may-moc-thiet-bi.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule
  ],
  declarations: [MayMocThietBiComponent]
})
export class MayMocThietBiModule { }
