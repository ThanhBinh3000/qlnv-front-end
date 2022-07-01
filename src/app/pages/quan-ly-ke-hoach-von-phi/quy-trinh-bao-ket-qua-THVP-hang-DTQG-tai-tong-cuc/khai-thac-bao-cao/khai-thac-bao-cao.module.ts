import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KhaiThacBaoCaoRoutingModule } from './khai-thac-bao-cao-routing.module';
import { KhaiThacBaoCaoComponent } from './khai-thac-bao-cao.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [KhaiThacBaoCaoComponent],
  imports: [CommonModule, KhaiThacBaoCaoRoutingModule, ComponentsModule],
  exports:[KhaiThacBaoCaoComponent]
})
export class KhaiThacBaoCaoModule {}
