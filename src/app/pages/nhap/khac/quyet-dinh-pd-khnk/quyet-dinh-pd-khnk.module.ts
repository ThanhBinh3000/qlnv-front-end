import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { FormsModule } from "@angular/forms";
import {QuyetDinhPdKhnkComponent} from "./quyet-dinh-pd-khnk.component";
import {ThemmoiQuyetDinhPdKhnkComponent} from "./themmoi-quyet-dinh-pd-khnk/themmoi-quyet-dinh-pd-khnk.component";
import {ThongtinDexuatComponent} from "./themmoi-quyet-dinh-pd-khnk/thongtin-dexuat/thongtin-dexuat.component";
import {QuyetDinhGiaoNvNhapHangModule} from "../quyet-dinh-giao-nv-nhap-hang/quyet-dinh-giao-nv-nhap-hang.module";



@NgModule({
  declarations: [
    QuyetDinhPdKhnkComponent,
    ThemmoiQuyetDinhPdKhnkComponent,
    ThongtinDexuatComponent
  ],
  exports: [
    QuyetDinhPdKhnkComponent,
    ThemmoiQuyetDinhPdKhnkComponent
  ],
    imports: [
        CommonModule,
        ComponentsModule,
        MainModule,
        FormsModule,
        QuyetDinhGiaoNvNhapHangModule,
    ]
})
export class QuyetDinhPdKhnkModule { }
