import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { MuaTrucTiepRoutingModule } from './mua-truc-tiep-routing.module';
import { MuaTrucTiepComponent } from './mua-truc-tiep.component';
import { KehoachLuachonMuatructiepModule } from './kehoach-luachon-muatructiep/kehoach-luachon-muatructiep.module';


@NgModule({
  declarations: [
    MuaTrucTiepComponent,

  ],
  imports: [
    CommonModule,
    MuaTrucTiepRoutingModule,
    ComponentsModule,
    DirectivesModule,
    KehoachLuachonMuatructiepModule,
  ],
})
export class MuaTrucTiepModule { }
