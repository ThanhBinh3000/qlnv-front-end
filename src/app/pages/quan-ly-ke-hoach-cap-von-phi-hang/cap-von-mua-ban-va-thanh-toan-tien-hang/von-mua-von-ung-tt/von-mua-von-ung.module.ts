import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DanhSachCapUngVonComponent } from './cap-ung-von-cho-don-vi-cap-duoi/danh-sach-cap-ung-von/danh-sach-cap-ung-von.component';
import { DialogTaoMoiComponent } from './dialog-tao-moi/dialog-tao-moi.component';
import { DanhSachGhiNhanCapUngVonTuDvctComponent } from './ghi-nhan-cap-ung-von-tu-don-vi-cap-tren/danh-sach-ghi-nhan-cap-ung-von-tu-dvct/danh-sach-ghi-nhan-cap-ung-von-tu-dvct.component';
import { VonMuaVonUngComponent } from './von-mua-von-ung.component';

@NgModule({
    declarations: [
        VonMuaVonUngComponent,
        DialogTaoMoiComponent,
        //ghi nhan cap ung von tu don vi cap tren
        DanhSachGhiNhanCapUngVonTuDvctComponent,
        //cap ung von cho don vi cap duoi
        DanhSachCapUngVonComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        VonMuaVonUngComponent,
        DialogTaoMoiComponent,
        DanhSachGhiNhanCapUngVonTuDvctComponent,
        DanhSachCapUngVonComponent,
    ]
})
export class VonMuaVonUngModule { }
