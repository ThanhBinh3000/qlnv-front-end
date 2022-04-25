import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaoCaoRoutingModule } from './bao-cao-routing.module';
import { BaoCaoComponent } from './bao-cao.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [BaoCaoComponent],
  imports: [CommonModule, BaoCaoRoutingModule, ComponentsModule],
  exports: [BaoCaoComponent],
})
export class BaoCaoModule {}
