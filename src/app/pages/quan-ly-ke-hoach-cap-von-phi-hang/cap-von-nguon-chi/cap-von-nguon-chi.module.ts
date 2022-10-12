import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CapVonNguonChiRoutingModule } from './cap-von-nguon-chi-routing.module';
import { CapVonNguonChiComponent } from './cap-von-nguon-chi.component';
import { DeNghiCapVonModule } from './de-nghi-cap-von/de-nghi-cap-von.module';
@NgModule({
    declarations: [
        CapVonNguonChiComponent,
    ],
    imports: [
        CommonModule,
        CapVonNguonChiRoutingModule,
        ComponentsModule,
        DirectivesModule,
        DeNghiCapVonModule,
    ],
})
export class CapVonChiModule { }
