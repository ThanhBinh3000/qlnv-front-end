import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { GiaoXuatHangComponent } from './giao-xuat-hang.component';
import { CreateGiaoXh } from './crup-giao-xh/create-giao-xh.component';
import { TableGiaoXh } from './table-giao-xh/table-giao-xh.component';
import { HopDongModule } from '../hop-dong/hop-dong.module';

@NgModule({
    declarations: [
        GiaoXuatHangComponent,
        CreateGiaoXh,
        TableGiaoXh
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
        HopDongModule,
    ],
    exports: [
        GiaoXuatHangComponent,
        CreateGiaoXh,
        TableGiaoXh
    ]
})
export class GiaoXuatHangModule { }
