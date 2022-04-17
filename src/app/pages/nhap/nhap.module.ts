import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhapRoutingModule } from './nhap-routing.module';
import { NhapComponent } from './nhap.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { DauThauTabComponent } from './dau-thau-tab/dau-thau-tab.component';
import { MNhapKhacTabComponent } from './nhap-khac-tab/nhap-khac-tab.component';

@NgModule({
  declarations: [
    NhapComponent,
    DauThauTabComponent,
    MNhapKhacTabComponent,
  ],
  imports: [CommonModule, NhapRoutingModule, ComponentsModule, MainModule],
})
export class NhapModule { }
