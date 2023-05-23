import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuyetDinhPdKhnkComponent } from './quyet-dinh-pd-khnk.component';
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { FormsModule } from "@angular/forms";



@NgModule({
  declarations: [
    QuyetDinhPdKhnkComponent
  ],
  exports: [
    QuyetDinhPdKhnkComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    FormsModule,
  ]
})
export class QuyetDinhPdKhnkModule { }
