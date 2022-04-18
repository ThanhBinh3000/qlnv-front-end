import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LapDeNghiCapVonMuaVatTuThietBiRoutingModule } from './lap-de-nghi-cap-von-mua-vat-tu-thiet-bi-routing.module';

import { ComponentsModule } from 'src/app/components/components.module';
import { LapDeNghiCapVonMuaVatTuThietBiComponent } from './lap-de-nghi-cap-von-mua-vat-tu-thiet-bi.component';

@NgModule({
    declarations: [LapDeNghiCapVonMuaVatTuThietBiComponent],
    imports: [CommonModule, LapDeNghiCapVonMuaVatTuThietBiRoutingModule, ComponentsModule],
})

export class LapDeNghiCapVonMuaVatTuThietBiModule {}