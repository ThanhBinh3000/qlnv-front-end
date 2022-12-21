import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaoCaoComponent } from './bao-cao.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { PhuLucIComponent } from './phu-luc-1/phu-luc-1.component';
import { PhuLucIIComponent } from './phu-luc-2/phu-luc-2.component';
import { PhuLucIIIComponent } from './phu-luc-3/phu-luc-3.component';
import { DialogChonDanhMucComponent } from './dialog-chon-danh-muc/dialog-chon-danh-muc.component';

@NgModule({
    declarations: [
        BaoCaoComponent,
        PhuLucIComponent,
        PhuLucIIComponent,
        PhuLucIIIComponent,
        DialogChonDanhMucComponent,
    ],
    imports: [CommonModule, ComponentsModule],
    exports: [BaoCaoComponent],
})
export class BaoCaoModule { }
