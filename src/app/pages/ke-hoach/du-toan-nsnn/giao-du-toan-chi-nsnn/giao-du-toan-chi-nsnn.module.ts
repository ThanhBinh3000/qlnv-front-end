import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiaoDuToanChiNSNNComponent } from './giao-du-toan-chi-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        GiaoDuToanChiNSNNComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
        RouterModule,
    ],
    exports: [
        GiaoDuToanChiNSNNComponent,
    ]
})
export class GiaoDuToanChiNSNNModule { }
