import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DanhSachGhiNhanVonBanComponent } from './danh-sach-ghi-nhan-von-ban/danh-sach-ghi-nhan-von-ban.component';
import { DanhSachNopVonBanComponent } from './danh-sach-nop-von-ban/danh-sach-nop-von-ban.component';
import { VonBanComponent } from './von-ban.component';

@NgModule({
    declarations: [
        VonBanComponent,
        DanhSachNopVonBanComponent,
        DanhSachGhiNhanVonBanComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        VonBanComponent,
        DanhSachNopVonBanComponent,
        DanhSachGhiNhanVonBanComponent,
    ]
})
export class VonBanModule { }
