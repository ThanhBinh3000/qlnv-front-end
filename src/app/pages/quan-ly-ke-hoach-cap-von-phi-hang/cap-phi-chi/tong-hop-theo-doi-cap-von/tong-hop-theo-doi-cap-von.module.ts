import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { TongHopTheoDoiCapVonComponent } from './tong-hop-theo-doi-cap-von.component';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    declarations: [
        TongHopTheoDoiCapVonComponent,

    ],
    exports: [
        TongHopTheoDoiCapVonComponent,
    ]
})
export class TongHopTheoDoiCapVonModule { }
