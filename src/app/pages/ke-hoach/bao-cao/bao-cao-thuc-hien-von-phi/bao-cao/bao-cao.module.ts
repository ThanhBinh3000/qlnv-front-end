import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { BaoCao02Component } from './bao-cao-02/bao-cao-02.component';
import { BaoCao03Component } from './bao-cao-03/bao-cao-03.component';
import { BaoCao04aComponent } from './bao-cao-04a/bao-cao-04a.component';
import { BaoCaoComponent } from './bao-cao.component';

@NgModule({
    declarations: [
        BaoCaoComponent,
        BaoCao02Component,
        BaoCao03Component,
        BaoCao04aComponent,
    ],
    imports: [CommonModule, ComponentsModule],
    exports: [BaoCaoComponent],
})
export class BaoCaoModule { }
