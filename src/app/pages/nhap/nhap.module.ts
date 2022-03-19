import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhapRoutingModule } from './nhap-routing.module';
import { NhapComponent } from './nhap.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { DauThauTabComponent } from './dau-thau-tab/dau-thau-tab.component';

@NgModule({
  declarations: [
    NhapComponent,
    DauThauTabComponent,
  ],
  imports: [CommonModule, NhapRoutingModule, ComponentsModule, MainModule],
})
export class NhapModule { }
