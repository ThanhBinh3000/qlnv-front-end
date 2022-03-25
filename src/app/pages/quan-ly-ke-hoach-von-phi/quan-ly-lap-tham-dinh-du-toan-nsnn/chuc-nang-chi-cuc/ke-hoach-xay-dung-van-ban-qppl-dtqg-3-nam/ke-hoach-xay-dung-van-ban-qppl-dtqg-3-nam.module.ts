import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeHoachXayDungVanBanQpplDtqg3NamRoutingModule } from './ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam-routing.module';
import { KeHoachXayDungVanBanQpplDtqg3NamComponent } from './ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    KeHoachXayDungVanBanQpplDtqg3NamComponent,
  ],
  imports: [
    CommonModule,
    KeHoachXayDungVanBanQpplDtqg3NamRoutingModule,
    ComponentsModule,
  ],
})

export class KeHoachXayDungVanBanQpplDtqg3NamModule {}
