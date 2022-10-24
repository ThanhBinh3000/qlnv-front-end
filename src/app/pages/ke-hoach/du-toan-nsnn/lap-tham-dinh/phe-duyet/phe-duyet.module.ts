import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PheDuyetRoutingModule } from './phe-duyet-routing.module';
import { PheDuyetComponent } from './phe-duyet.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [PheDuyetComponent],
  imports: [CommonModule, PheDuyetRoutingModule, ComponentsModule],
})
export class PheDuyetModule {}
