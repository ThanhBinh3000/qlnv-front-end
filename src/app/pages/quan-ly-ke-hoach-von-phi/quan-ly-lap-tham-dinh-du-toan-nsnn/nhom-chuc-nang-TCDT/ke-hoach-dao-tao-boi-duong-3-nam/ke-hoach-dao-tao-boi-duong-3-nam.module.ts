import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { KeHoachDaoTaoBoiDuong3NamRoutingModule } from './ke-hoach-dao-tao-boi-duong-3-nam-routing.module';
import { KeHoachDaoTaoBoiDuong3NamComponent } from './ke-hoach-dao-tao-boi-duong-3-nam.component';

@NgModule({
  declarations: [
    KeHoachDaoTaoBoiDuong3NamComponent,
  ],
  imports: [
    CommonModule,
    KeHoachDaoTaoBoiDuong3NamRoutingModule,
    ComponentsModule,
  ],
})

export class KeHoachDaoTaoBoiDuong3NamModule {}
