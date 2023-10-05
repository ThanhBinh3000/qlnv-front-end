import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { VonBanComponent } from './von-ban.component';
import { DanhSachVonBanNopDvctComponent } from './danh-sach-von-ban-nop-dvct/danh-sach-von-ban-nop-dvct.component';
import { DialogTaoMoiComponent } from './dialog-tao-moi/dialog-tao-moi.component';
import { VonBanTheoHopDongTrungThauComponent } from './von-ban-theo-hop-dong-trung-thau/von-ban-theo-hop-dong-trung-thau.component';
import { VonBanTheoDonGiaMuaComponent } from './von-ban-theo-don-gia-mua/von-ban-theo-don-gia-mua.component';
import { DanhSachVonBanTuDvcdComponent } from './danh-sach-von-ban-tu-dvcd/danh-sach-von-ban-tu-dvcd.component';
import { DialogTongHopComponent } from './dialog-tong-hop/dialog-tong-hop.component';
import { QuanLyVonBanComponent } from './quan-ly-von-ban/quan-ly-von-ban.component';

@NgModule({
    declarations: [
        VonBanComponent,
        DanhSachVonBanNopDvctComponent,
        DialogTaoMoiComponent,
        DialogTongHopComponent,
        VonBanTheoHopDongTrungThauComponent,
        VonBanTheoDonGiaMuaComponent,
        DanhSachVonBanTuDvcdComponent,
        QuanLyVonBanComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        VonBanComponent,
    ]
})
export class VonBanModule { }
