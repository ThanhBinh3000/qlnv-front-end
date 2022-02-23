import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonviRoutingModule } from './donvi-routing.module';
import { DonviComponent } from './donvi.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { NewDonViComponent } from './new-don-vi/new-don-vi.component';

@NgModule({
  declarations: [DonviComponent, NewDonViComponent],
  imports: [CommonModule, DonviRoutingModule, ComponentsModule],
})
export class KeHoachModule {}
