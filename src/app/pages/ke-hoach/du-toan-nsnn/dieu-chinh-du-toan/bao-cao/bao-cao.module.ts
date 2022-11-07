import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaoCaoComponent } from './bao-cao.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { PhuLuc1Component } from './phu-luc-1/phu-luc-1.component';
import { PhuLuc2Component } from './phu-luc-2/phu-luc-2.component';
import { PhuLuc3Component } from './phu-luc-3/phu-luc-3.component';
import { PhuLuc4Component } from './phu-luc-4/phu-luc-4.component';
import { PhuLuc5Component } from './phu-luc-5/phu-luc-5.component';
import { PhuLuc6Component } from './phu-luc-6/phu-luc-6.component';
import { PhuLuc7Component } from './phu-luc-7/phu-luc-7.component';
import { PhuLuc8Component } from './phu-luc-8/phu-luc-8.component';

@NgModule({
  declarations: [
    BaoCaoComponent,
    PhuLuc1Component,
    PhuLuc2Component,
    PhuLuc3Component,
    PhuLuc4Component,
    PhuLuc5Component,
    PhuLuc6Component,
    PhuLuc7Component,
    PhuLuc8Component,
  ],

  imports: [
    CommonModule,
    ComponentsModule,
  ],

  exports: [BaoCaoComponent],
})
export class BaoCaoModule { }
