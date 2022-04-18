import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TongHopDeNghiCapVonRoutingModule } from './tong-hop-de-nghi-cap-von-routing.module';

import { ComponentsModule } from 'src/app/components/components.module';
import { TongHopDeNghiCapVonComponent } from './tong-hop-de-nghi-cap-von.component';

@NgModule({
    declarations: [TongHopDeNghiCapVonComponent],
    imports: [CommonModule, TongHopDeNghiCapVonRoutingModule, ComponentsModule],
})

export class  TongHopDeNghiCapVonModule {}