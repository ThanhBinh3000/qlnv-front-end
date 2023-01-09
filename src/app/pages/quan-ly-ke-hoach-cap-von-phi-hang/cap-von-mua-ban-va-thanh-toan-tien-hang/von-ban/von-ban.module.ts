import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DanhSachVonBanComponent } from './danh-sach-von-ban/danh-sach-von-ban.component';
import { DialogTaoMoiVonBanComponent } from './dialog-tao-moi-von-ban/dialog-tao-moi-von-ban.component';
import { VonBanTheoDonGiaComponent } from './von-ban-theo-don-gia/von-ban-theo-don-gia.component';
import { VonBanTheoHopDongComponent } from './von-ban-theo-hop-dong/von-ban-theo-hop-dong.component';
import { VonBanComponent } from './von-ban.component';

@NgModule({
    declarations: [
        VonBanComponent,
        DanhSachVonBanComponent,
        VonBanTheoHopDongComponent,
        VonBanTheoDonGiaComponent,
        DialogTaoMoiVonBanComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        VonBanComponent,
        DanhSachVonBanComponent,
        VonBanTheoHopDongComponent,
        VonBanTheoDonGiaComponent,
        DialogTaoMoiVonBanComponent,
    ]
})
export class VonBanModule { }
