import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { GiaoNhapHangMuattComponent } from './giao-nhap-hang-muatt.component';
import { QuyetdinhNhiemvuNhaphangComponent } from './quyetdinh-nhiemvu-nhaphang/quyetdinh-nhiemvu-nhaphang.component';
import { ThemmoiNhiemvuNhaphangComponent } from './quyetdinh-nhiemvu-nhaphang/themmoi-nhiemvu-nhaphang/themmoi-nhiemvu-nhaphang.component';
import {HopDongModule} from "../../dau-thau/hop-dong/hop-dong.module";
import {KehoachLuachonMuatructiepModule} from "../kehoach-luachon-muatructiep/kehoach-luachon-muatructiep.module";
import {HopdongBangkePhieumuahangModule} from "../hopdong-bangke-phieumuahang/hopdong-bangke-phieumuahang.module";


@NgModule({
    declarations: [
        GiaoNhapHangMuattComponent,
        QuyetdinhNhiemvuNhaphangComponent,
        ThemmoiNhiemvuNhaphangComponent
    ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    HopDongModule,
    KehoachLuachonMuatructiepModule,
    HopdongBangkePhieumuahangModule
  ],
    exports: [
        GiaoNhapHangMuattComponent,
        QuyetdinhNhiemvuNhaphangComponent
    ]
})
export class GiaoNhapHangMuattModule { }
