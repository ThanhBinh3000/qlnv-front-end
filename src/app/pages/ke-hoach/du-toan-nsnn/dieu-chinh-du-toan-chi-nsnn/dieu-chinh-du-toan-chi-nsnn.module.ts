import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DieuChinhDuToanChiNSNNComponent } from './dieu-chinh-du-toan-chi-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        DieuChinhDuToanChiNSNNComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
        RouterModule,
    ],
    exports: [
        DieuChinhDuToanChiNSNNComponent,
    ]
})
export class DieuChinhDuToanChiNSNNModule { }
