import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { TongHopDeNghiCapVonComponent } from './tong-hop-de-nghi-cap-von.component';
import { TongHopTaiTongCucComponent } from './tong-hop-tai-tong-cuc/tong-hop-tai-tong-cuc.component';
import { TongHopComponent } from './tong-hop/tong-hop.component';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    declarations: [
        TongHopDeNghiCapVonComponent,
        TongHopComponent,
        TongHopTaiTongCucComponent,
    ],
    exports: [
        TongHopDeNghiCapVonComponent,
        TongHopComponent,
        TongHopTaiTongCucComponent,
    ]
})
export class TongHopDeNghiCapVonModule { }
