import { ComponentsModule } from './../../../components/components.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DinhMucPhiBaoQuanComponent } from './dinh-muc-phi-bao-quan.component';

@NgModule({
  declarations: [DinhMucPhiBaoQuanComponent],
  imports: [
    CommonModule,
    ComponentsModule,
  ],
})
export class DinhMucPhiBaoQuanModule { }
