import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { BaoCaoComponent } from './bao-cao.component';
import { HangComponent } from './phu-luc/bao-hiem/hang/hang.component';
import { KhoComponent } from './phu-luc/bao-hiem/kho/kho.component';
import { TongHopComponent } from './phu-luc/bao-hiem/tong-hop/tong-hop.component';
import { PhuLuc01Component } from './phu-luc/phu-luc-01/phu-luc-01.component';
import { PhuLuc02Component } from './phu-luc/phu-luc-02/phu-luc-02.component';
import { PhuLuc03Component } from './phu-luc/phu-luc-03/phu-luc-03.component';
import { PhuLuc04Component } from './phu-luc/phu-luc-04/phu-luc-04.component';
import { PhuLuc05Component } from './phu-luc/phu-luc-05/phu-luc-05.component';
import { PhuLuc06Component } from './phu-luc/phu-luc-06/phu-luc-06.component';
import { PhuLucDuAnComponent } from './phu-luc/phu-luc-du-an/phu-luc-du-an.component';
import { BieuMau131Component } from './thong-tu-342/bieu-mau-13-1/bieu-mau-13-1.component';
import { BieuMau1310Component } from './thong-tu-342/bieu-mau-13-10/bieu-mau-13-10.component';
import { BieuMau133Component } from './thong-tu-342/bieu-mau-13-3/bieu-mau-13-3.component';
import { BieuMau138Component } from './thong-tu-342/bieu-mau-13-8/bieu-mau-13-8.component';
import { BieuMau140Component } from './thong-tu-342/bieu-mau-14-0/bieu-mau-14-0.component';
import { BieuMau151Component } from './thong-tu-342/bieu-mau-15-1/bieu-mau-15-1.component';
import { BieuMau152Component } from './thong-tu-342/bieu-mau-15-2/bieu-mau-15-2.component';
import { BieuMau160Component } from './thong-tu-342/bieu-mau-16-0/bieu-mau-16-0.component';
import { BieuMau13Component } from './thong-tu-69/bieu-mau-13/bieu-mau-13.component';
import { BieuMau14Component } from './thong-tu-69/bieu-mau-14/bieu-mau-14.component';
import { BieuMau16Component } from './thong-tu-69/bieu-mau-16/bieu-mau-16.component';
import { BieuMau17Component } from './thong-tu-69/bieu-mau-17/bieu-mau-17.component';
import { BieuMau18Component } from './thong-tu-69/bieu-mau-18/bieu-mau-18.component';

@NgModule({
    declarations: [
        BaoCaoComponent,
        //thong tu 69
        BieuMau18Component,
        BieuMau17Component,
        BieuMau16Component,
        BieuMau14Component,
        BieuMau13Component,
        // //thong tu 342
        BieuMau131Component,
        BieuMau133Component,
        BieuMau138Component,
        BieuMau1310Component,
        BieuMau140Component,
        BieuMau151Component,
        BieuMau152Component,
        BieuMau160Component,
        // //phu luc
        PhuLuc01Component,
        PhuLuc02Component,
        PhuLuc03Component,
        PhuLuc04Component,
        PhuLuc05Component,
        PhuLuc06Component,
        PhuLucDuAnComponent,
        KhoComponent,
        HangComponent,
        TongHopComponent,
    ],
    imports: [CommonModule, ComponentsModule],
    exports: [BaoCaoComponent],
})
export class BaoCaoModule { }
