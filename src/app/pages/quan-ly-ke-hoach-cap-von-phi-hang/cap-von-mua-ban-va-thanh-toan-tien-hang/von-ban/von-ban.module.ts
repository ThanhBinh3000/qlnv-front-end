import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { VonBanComponent } from './von-ban.component';

@NgModule({
    declarations: [
        VonBanComponent,
        // DanhSachNopVonBanComponent,
        // DanhSachGhiNhanVonBanComponent,
        // VonBanHangComponent,
        // DialogTaoMoiComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        VonBanComponent,
    ]
})
export class VonBanModule { }
