import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { BaoCaoComponent } from './bao-cao.component';
import { PhuLucIComponent } from './phu-luc-1/phu-luc-1.component';
import { PhuLucIIComponent } from './phu-luc-2/phu-luc-2.component';
import { PhuLucIIIComponent } from './phu-luc-3/phu-luc-3.component';

@NgModule({
    declarations: [
        BaoCaoComponent,
        PhuLucIComponent,
        PhuLucIIComponent,
        PhuLucIIIComponent,
    ],
    imports: [CommonModule, ComponentsModule],
    exports: [BaoCaoComponent],
})
export class BaoCaoModule { }
