import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DsQuyetDinhRoutingModule } from './ds-quyet-dinh-routing.module';
import { DsQuyetDinhComponent } from './ds-quyet-dinh.component';

@NgModule({
  declarations: [
    DsQuyetDinhComponent,
  ],
  imports: [
    CommonModule,
    DsQuyetDinhRoutingModule,
    ComponentsModule,
  ],
})

export class DsQuyetDinhModule {}
