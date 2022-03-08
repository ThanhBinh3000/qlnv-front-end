import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeHoachCaiTaoVaSuaChuaLon3NamRoutingModule } from './ke-hoach-cai-tao-va-sua-chua-lon-3-nam-routing.module';
import { KeHoachCaiTaoVaSuaChuaLon3NamComponent } from './ke-hoach-cai-tao-va-sua-chua-lon-3-nam.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    KeHoachCaiTaoVaSuaChuaLon3NamComponent,
  ],
  imports: [
    CommonModule,
    KeHoachCaiTaoVaSuaChuaLon3NamRoutingModule,
    ComponentsModule,
  ],
})

export class KeHoachCaiTaoVaSuaChuaLon3NamModule {}
