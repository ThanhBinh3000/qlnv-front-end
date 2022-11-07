import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { BaoCaoComponent } from './bao-cao.component';
import { BieuMau13Component } from './bieu-mau-13/bieu-mau-13.component';
import { BieuMau14Component } from './bieu-mau-14/bieu-mau-14.component';
import { BieuMau16Component } from './bieu-mau-16/bieu-mau-16.component';
import { BieuMau17Component } from './bieu-mau-17/bieu-mau-17.component';
import { BieuMau18Component } from './bieu-mau-18/bieu-mau-18.component';

@NgModule({
    declarations: [
        BaoCaoComponent,
        BieuMau13Component,
        BieuMau14Component,
        BieuMau16Component,
        BieuMau17Component,
        BieuMau18Component,
    ],
    imports: [CommonModule, ComponentsModule],
    exports: [BaoCaoComponent],
})
export class BaoCaoModule { }
