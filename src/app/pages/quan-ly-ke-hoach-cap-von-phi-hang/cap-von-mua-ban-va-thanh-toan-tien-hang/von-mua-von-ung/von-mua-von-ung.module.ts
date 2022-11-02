import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DanhSachGhiNhanCapUngVonTaiCkvCcComponent } from './danh-sach-ghi-nhan-cap-ung-von-tai-ckv-cc/danh-sach-ghi-nhan-cap-ung-von-tai-ckv-cc.component';
import { DanhSachGhiNhanCapUngVonTaiTongCucComponent } from './danh-sach-ghi-nhan-cap-ung-von-tai-tong-cuc/danh-sach-ghi-nhan-cap-ung-von-tai-tong-cuc.component';
import { GhiNhanCapUngVonTuDvctTaiTongCucComponent } from './ghi-nhan-cap-ung-von-tu-dvct-tai-tong-cuc/ghi-nhan-cap-ung-von-tu-dvct-tai-tong-cuc.component';
import { VonMuaVonUngComponent } from './von-mua-von-ung.component';

@NgModule({
    declarations: [
        VonMuaVonUngComponent,
        DanhSachGhiNhanCapUngVonTaiTongCucComponent,
        DanhSachGhiNhanCapUngVonTaiCkvCcComponent,
        GhiNhanCapUngVonTuDvctTaiTongCucComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        VonMuaVonUngComponent,
        DanhSachGhiNhanCapUngVonTaiTongCucComponent,
        DanhSachGhiNhanCapUngVonTaiCkvCcComponent,
        GhiNhanCapUngVonTuDvctTaiTongCucComponent,
    ]
})
export class VonMuaVonUngModule { }
