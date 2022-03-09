import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namRoutingModule } from './kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam-routing.module';
import { KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namComponent } from './kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namComponent,
  ],
  imports: [
    CommonModule,
    KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namRoutingModule,
    ComponentsModule,
  ],
})

export class KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namModule {}
