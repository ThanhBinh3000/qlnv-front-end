import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KiemTraRoutingModule } from './kiem-tra-routing.module';
import { KiemTraComponent } from './kiem-tra.component';
import {ComponentsModule} from "../../../../../components/components.module";
import { XtlBbLmComponent } from './xtl-bb-lm/xtl-bb-lm.component';
import { XtlPhieuKtraClComponent } from './xtl-phieu-ktra-cl/xtl-phieu-ktra-cl.component';
import { XtlHsKtComponent } from './xtl-hs-kt/xtl-hs-kt.component';
import { XtlThemPhieuKtraClComponent } from './xtl-phieu-ktra-cl/xtl-them-phieu-ktra-cl/xtl-them-phieu-ktra-cl.component';
import { XtlThemBbLmComponent } from './xtl-bb-lm/xtl-them-bb-lm/xtl-them-bb-lm.component';
import { XtlThemHsKtComponent } from './xtl-hs-kt/xtl-them-hs-kt/xtl-them-hs-kt.component';


@NgModule({
  declarations: [
    KiemTraComponent,
    XtlBbLmComponent,
    XtlPhieuKtraClComponent,
    XtlHsKtComponent,
    XtlThemPhieuKtraClComponent,
    XtlThemBbLmComponent,
    XtlThemHsKtComponent
  ],
  imports: [
    CommonModule,
    KiemTraRoutingModule,
    ComponentsModule
  ]
})
export class KiemTraModule { }
