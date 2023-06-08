import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuyetDinhGiaoNvNhapHangComponent } from "./quyet-dinh-giao-nv-nhap-hang.component";
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { FormsModule } from "@angular/forms";
import {
  ThemmoiQdinhNhapXuatHangKhacComponent
} from "./themmoi-qdinh-nhap-xuat-hang-khac/themmoi-qdinh-nhap-xuat-hang-khac.component";



@NgModule({
  declarations: [
    QuyetDinhGiaoNvNhapHangComponent,
    ThemmoiQdinhNhapXuatHangKhacComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    FormsModule,
  ],
  exports: [
    QuyetDinhGiaoNvNhapHangComponent,
    ThemmoiQdinhNhapXuatHangKhacComponent
  ]
})
export class QuyetDinhGiaoNvNhapHangModule { }
