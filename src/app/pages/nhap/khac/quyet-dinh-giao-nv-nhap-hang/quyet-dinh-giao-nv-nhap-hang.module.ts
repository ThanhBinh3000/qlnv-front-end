import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuyetDinhGiaoNvNhapHangComponent } from "./quyet-dinh-giao-nv-nhap-hang.component";
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { FormsModule } from "@angular/forms";



@NgModule({
  declarations: [
    QuyetDinhGiaoNvNhapHangComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    FormsModule,
  ],
  exports: [
    QuyetDinhGiaoNvNhapHangComponent
  ]
})
export class QuyetDinhGiaoNvNhapHangModule { }
