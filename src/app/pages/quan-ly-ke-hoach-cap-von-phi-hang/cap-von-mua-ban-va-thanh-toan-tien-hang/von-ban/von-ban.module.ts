import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { VonBanComponent } from './von-ban.component';

@NgModule({
    declarations: [
        VonBanComponent,
        // DanhSachVonBanComponent,
        // VonBanTheoHopDongComponent,
        // VonBanTheoDonGiaComponent,
        // DialogTaoMoiVonBanComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        VonBanComponent,
        // DanhSachVonBanComponent,
        // VonBanTheoHopDongComponent,
        // VonBanTheoDonGiaComponent,
        // DialogTaoMoiVonBanComponent,
    ]
})
export class VonBanModule { }
