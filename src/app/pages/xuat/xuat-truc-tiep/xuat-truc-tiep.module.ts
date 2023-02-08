import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { XuatTrucTiepComponent } from './xuat-truc-tiep.component';
import { XuatTrucTiepRoutingModule } from './xuat-truc-tiep-routing.module';
import { KeHoachBanTrucTiepComponent } from './ke-hoach-ban-truc-tiep/ke-hoach-ban-truc-tiep.component';
import { KeHoachBanTrucTiepModule } from './ke-hoach-ban-truc-tiep/ke-hoach-ban-truc-tiep.module';

@NgModule({
  declarations: [
    XuatTrucTiepComponent,
    KeHoachBanTrucTiepComponent,
  ],
  imports: [
    CommonModule,
    XuatTrucTiepRoutingModule,
    ComponentsModule,
    DirectivesModule,
    KeHoachBanTrucTiepModule,

  ],
})
export class XuatTrucTiepModule {
}
