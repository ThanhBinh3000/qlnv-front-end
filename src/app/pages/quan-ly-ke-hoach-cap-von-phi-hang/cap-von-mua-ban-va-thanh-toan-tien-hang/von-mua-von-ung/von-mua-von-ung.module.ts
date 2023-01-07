import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DanhSachVonMuaVonUngComponent } from './danh-sach-von-mua-von-ung/danh-sach-von-mua-von-ung.component';
import { GhiNhanCapUngVonTuBtcComponent } from './ghi-nhan-cap-ung-von-tu-btc/ghi-nhan-cap-ung-von-tu-btc.component';
import { VonMuaVonUngComponent } from './von-mua-von-ung.component';

@NgModule({
    declarations: [
        VonMuaVonUngComponent,
        DanhSachVonMuaVonUngComponent,
        GhiNhanCapUngVonTuBtcComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        VonMuaVonUngComponent,
        DanhSachVonMuaVonUngComponent,
        GhiNhanCapUngVonTuBtcComponent,
    ]
})
export class VonMuaVonUngModule { }
