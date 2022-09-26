import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { TongHopComponent } from './tong-hop.component';
import { ThongTinTongHopComponent } from './thong-tin-tong-hop/thong-tin-tong-hop.component';
import { DeNghiCapPhiBoNganhModule } from '../de-nghi-cap-phi-bo-nganh/de-nghi-cap-phi-bo-nganh.module';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
        DeNghiCapPhiBoNganhModule,
    ],
    declarations: [
        TongHopComponent,
        ThongTinTongHopComponent,
        // ThongTinTonghopComponent
    ],
    exports: [
        TongHopComponent,
    ]
})
export class TongHopModule { }
