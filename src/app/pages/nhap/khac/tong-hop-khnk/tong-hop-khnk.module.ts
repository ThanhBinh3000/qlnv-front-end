import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { FormsModule } from "@angular/forms";
import { TongHopKhnkComponent } from "./tong-hop-khnk.component";
import { ThemMoiTongHopKhnkComponent } from './them-moi-tong-hop-khnk/them-moi-tong-hop-khnk.component';
import { KeHoachNhapKhacModule } from "../ke-hoach-nhap-khac/ke-hoach-nhap-khac.module";
import {QuyetDinhPdKhnkModule} from "../quyet-dinh-pd-khnk/quyet-dinh-pd-khnk.module";



@NgModule({
  declarations: [
    TongHopKhnkComponent,
    ThemMoiTongHopKhnkComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    FormsModule,
    KeHoachNhapKhacModule,
    QuyetDinhPdKhnkModule
  ],
  exports: [
    TongHopKhnkComponent,
    ThemMoiTongHopKhnkComponent,
  ]
})
export class TongHopKhnkModule { }
