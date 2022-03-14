import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { TongHopDeNghiCapVonRoutingModule } from './tong-hop-de-nghi-cap-von-routing.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, TongHopDeNghiCapVonRoutingModule, ComponentsModule],
})

export class TongHopDeNghiCapVonModule {}