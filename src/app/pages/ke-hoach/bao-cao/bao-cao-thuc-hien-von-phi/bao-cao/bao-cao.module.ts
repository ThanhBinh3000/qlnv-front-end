import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { BaoCao02Component } from './bao-cao-02/bao-cao-02.component';
import { BaoCao03Component } from './bao-cao-03/bao-cao-03.component';
import { BaoCao04anComponent } from './bao-cao-04an/bao-cao-04an.component';
import { BaoCao04axComponent } from './bao-cao-04ax/bao-cao-04ax.component';
import { BaoCao04bComponent } from './bao-cao-04b/bao-cao-04b.component';
import { BaoCao05Component } from './bao-cao-05/bao-cao-05.component';
import { BaoCaoComponent } from './bao-cao.component';

@NgModule({
    declarations: [
        BaoCaoComponent,
        BaoCao02Component,
        BaoCao03Component,
        BaoCao04anComponent,
        BaoCao04axComponent,
        BaoCao04bComponent,
        BaoCao05Component,
    ],
    imports: [CommonModule, ComponentsModule],
    exports: [BaoCaoComponent],
})
export class BaoCaoModule { }
