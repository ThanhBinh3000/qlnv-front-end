import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaoCaoRoutingModule } from './bao-cao-routing.module';
import { BaoCaoComponent } from './bao-cao.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { PhuLucIComponent } from './phu-luc-1/phu-luc-1.component';
import { PhuLucIIComponent } from './phu-luc-2/phu-luc-2.component';
import { PhuLucIIIComponent } from './phu-luc-3/phu-luc-3.component';

@NgModule({
  declarations: [BaoCaoComponent, 
                PhuLucIComponent,
                PhuLucIIComponent,
                PhuLucIIIComponent],
  imports: [CommonModule, BaoCaoRoutingModule, ComponentsModule],
  exports: [BaoCaoComponent],
})
export class BaoCaoModule {}
