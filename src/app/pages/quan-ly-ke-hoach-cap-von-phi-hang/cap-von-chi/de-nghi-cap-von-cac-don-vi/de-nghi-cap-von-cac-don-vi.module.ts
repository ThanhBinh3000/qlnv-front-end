import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DeNghiCapVonCacDonViComponent } from './de-nghi-cap-von-cac-don-vi.component';
import { DanhSachDeNghiCapVonComponent } from './danh-sach-de-nghi-cap-von/danh-sach-de-nghi-cap-von.component';

@NgModule({
    declarations: [
        DeNghiCapVonCacDonViComponent,
        DanhSachDeNghiCapVonComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        DeNghiCapVonCacDonViComponent
    ]
})
export class DeNghiCapVonCacDonViModule { }
