import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaoCaoRoutingModule } from './bao-cao-routing.module';
import { BaoCaoComponent } from './bao-cao.component';import { ComponentsModule } from 'src/app/components/components.module';
import { BaoCao05Component } from './bao-cao-05/bao-cao-05.component';

@NgModule({
  declarations: [BaoCaoComponent, BaoCao05Component],
  imports: [CommonModule, BaoCaoRoutingModule, ComponentsModule],
})
export class BaoCaoModule {}
