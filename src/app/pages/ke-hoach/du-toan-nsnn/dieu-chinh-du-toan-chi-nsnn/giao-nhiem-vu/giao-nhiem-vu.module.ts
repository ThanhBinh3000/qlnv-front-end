import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { GiaoNhiemVuRoutingModule } from './giao-nhiem-vu-routing.module';
import { GiaoNhiemVuComponent } from './giao-nhiem-vu.component';
import { PhuLuc1Component } from './phu-luc1/phu-luc1.component';
import { PhuLuc2Component } from './phu-luc2/phu-luc2.component';
import { PhuLuc3Component } from './phu-luc3/phu-luc3.component';
import { PhuLuc4Component } from './phu-luc4/phu-luc4.component';
import { PhuLuc5Component } from './phu-luc5/phu-luc5.component';
import { PhuLuc6Component } from './phu-luc6/phu-luc6.component';
import { PhuLuc7Component } from './phu-luc7/phu-luc7.component';
import { PhuLuc8Component } from './phu-luc8/phu-luc8.component';

@NgModule({
  declarations: [
    GiaoNhiemVuComponent,
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
    GiaoNhiemVuRoutingModule,
    ComponentsModule,
  ],
})

export class GiaoNhiemVuModule { }
