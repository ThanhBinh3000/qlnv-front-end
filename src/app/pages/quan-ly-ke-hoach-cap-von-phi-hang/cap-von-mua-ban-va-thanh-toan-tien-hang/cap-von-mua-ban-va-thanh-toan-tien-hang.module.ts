import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CapVonMuaBanVaThanhToanTienHangRoutingModule } from './cap-von-mua-ban-va-thanh-toan-tien-hang-routing.module';
import { CapVonMuaBanVaThanhToanTienHangComponent } from './cap-von-mua-ban-va-thanh-toan-tien-hang.component';
import { VonMuaVonUngModule } from './von-mua-von-ung/von-mua-von-ung.module';
import { VonBanModule } from './von-ban/von-ban.module';
@NgModule({
    declarations: [
        CapVonMuaBanVaThanhToanTienHangComponent,
    ],
    imports: [
        CommonModule,
        CapVonMuaBanVaThanhToanTienHangRoutingModule,
        ComponentsModule,
        DirectivesModule,
        VonBanModule,
        VonMuaVonUngModule,
    ],
})
export class CapVonMuaBanVaThanhToanTienHangModule { }
