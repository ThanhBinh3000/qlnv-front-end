import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeHoachNhapKhacComponent } from './ke-hoach-nhap-khac.component';
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { FormsModule } from "@angular/forms";
import { ThemMoiKeHoachNhapKhacComponent } from './them-moi-ke-hoach-nhap-khac/them-moi-ke-hoach-nhap-khac.component';



@NgModule({
  declarations: [
    KeHoachNhapKhacComponent,
    ThemMoiKeHoachNhapKhacComponent
  ],
  exports: [
    KeHoachNhapKhacComponent,
    ThemMoiKeHoachNhapKhacComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    FormsModule,
  ]
})
export class KeHoachNhapKhacModule { }
