import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VanBanGuiTcdtVeNsnnVaKhtc3NamRoutingModule } from './van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam-routing.module';
import { VanBanGuiTcdtVeNsnnVaKhtc3NamComponent } from './van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    VanBanGuiTcdtVeNsnnVaKhtc3NamComponent,
  ],
  imports: [
    CommonModule,
    VanBanGuiTcdtVeNsnnVaKhtc3NamRoutingModule,
    ComponentsModule,
  ],
})

export class VanBanGuiTcdtVeNsnnVaKhtc3NamModule {}
