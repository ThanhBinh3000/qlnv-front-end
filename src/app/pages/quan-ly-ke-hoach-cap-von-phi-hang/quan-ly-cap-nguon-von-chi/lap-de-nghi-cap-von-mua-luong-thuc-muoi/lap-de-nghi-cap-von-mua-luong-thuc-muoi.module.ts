import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { LapDeNghiCapVonMuaLuongThucMuoiRoutingModule } from './lap-de-nghi-cap-von-mua-luong-thuc-muoi-routing.module';
import { LapDeNghiCapVonMuaLuongThucMuoiComponent } from './lap-de-nghi-cap-von-mua-luong-thuc-muoi.component';

@NgModule({
    declarations: [LapDeNghiCapVonMuaLuongThucMuoiComponent],
    imports: [CommonModule, LapDeNghiCapVonMuaLuongThucMuoiRoutingModule, ComponentsModule],
})

export class LapDeNghiCapVonMuaLuongThucMuoiModule {}