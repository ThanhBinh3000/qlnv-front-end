import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MuaTrucTiepRoutingModule } from './mua-truc-tiep-routing.module';
import { MuaTrucTiepComponent } from './mua-truc-tiep.component';


@NgModule({
  declarations: [
    MuaTrucTiepComponent,
  ],
  imports: [CommonModule, MuaTrucTiepRoutingModule, ComponentsModule],
})
export class MuaTrucTiepModule { }
