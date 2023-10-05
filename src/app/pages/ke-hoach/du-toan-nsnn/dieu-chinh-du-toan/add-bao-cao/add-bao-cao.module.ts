import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBaoCaoComponent } from './add-bao-cao.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { PhuLuc1Component } from './phu-luc-1/phu-luc-1.component';
import { PhuLuc2Component } from './phu-luc-2/phu-luc-2.component';
import { PhuLuc3Component } from './phu-luc-3/phu-luc-3.component';
import { PhuLuc4Component } from './phu-luc-4/phu-luc-4.component';
import { PhuLuc5Component } from './phu-luc-5/phu-luc-5.component';
import { PhuLuc6Component } from './phu-luc-6/phu-luc-6.component';
import { PhuLuc7Component } from './phu-luc-7/phu-luc-7.component';
import { PhuLuc8Component } from './phu-luc-8/phu-luc-8.component';
import { PhuLuc9Component } from './phu-luc-9/phu-luc-9.component';
import { PhuLuc10Component } from './phu-luc-10/phu-luc-10.component';
import { PhuLuc11Component } from './phu-luc-11/phu-luc-11.component';
import { PhuLucTongHopComponent } from './phu-luc-tong-hop/phu-luc-tong-hop.component';
import { PhuLuc12Component } from './phu-luc-12/phu-luc-12.component';
import { PhuLuc13Component } from './phu-luc-13/phu-luc-13.component';

@NgModule({
  declarations: [
    AddBaoCaoComponent,
    PhuLuc1Component,
    PhuLuc2Component,
    PhuLuc3Component,
    PhuLuc4Component,
    PhuLuc5Component,
    PhuLuc6Component,
    PhuLuc7Component,
    PhuLuc8Component,
    PhuLuc9Component,
    PhuLuc10Component,
    PhuLuc11Component,
    PhuLuc12Component,
    PhuLuc13Component,
    PhuLucTongHopComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [AddBaoCaoComponent]
})
export class AddBaoCaoModule { }
