import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeHoachNhapKhacComponent } from './ke-hoach-nhap-khac.component';
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { FormsModule } from "@angular/forms";



@NgModule({
  declarations: [
    KeHoachNhapKhacComponent
  ],
  exports: [
    KeHoachNhapKhacComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    FormsModule,
  ]
})
export class KeHoachNhapKhacModule { }
