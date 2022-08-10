import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DauGiaRoutingModule } from './dau-gia-routing.module';
import { DauGiaBanHangComponent } from './dau-gia.component';
import { KeHoachBanDauGiaModule } from './ke-hoach-ban-dau-gia/ke-hoach-ban-dau-gia.module';

@NgModule({
  declarations: [
    DauGiaBanHangComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DauGiaRoutingModule,
    KeHoachBanDauGiaModule,
    ComponentsModule,
    DirectivesModule
  ]
})
export class DauGiaModule { }
