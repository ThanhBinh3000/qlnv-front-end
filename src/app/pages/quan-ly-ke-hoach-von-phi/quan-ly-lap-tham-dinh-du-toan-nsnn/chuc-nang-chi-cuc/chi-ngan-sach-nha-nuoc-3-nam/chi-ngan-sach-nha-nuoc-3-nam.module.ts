import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChiNganSachNhaNuoc3NamRoutingModule } from './chi-ngan-sach-nha-nuoc-3-nam-routing.module';
import { ChiNganSachNhaNuoc3NamComponent } from './chi-ngan-sach-nha-nuoc-3-nam.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    ChiNganSachNhaNuoc3NamComponent,
  ],
  imports: [
    CommonModule,
    ChiNganSachNhaNuoc3NamRoutingModule,
    ComponentsModule,
  ],
})

export class ChiNganSachNhaNuoc3NamModule {}
