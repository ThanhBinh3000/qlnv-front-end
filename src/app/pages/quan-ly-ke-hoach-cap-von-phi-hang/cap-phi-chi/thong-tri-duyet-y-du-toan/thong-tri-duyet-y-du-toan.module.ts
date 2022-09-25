import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ThongTinThongTriDuyetYDuToanComponent } from './thong-tin-thong-tri-duyet-y-du-toan/thong-tin-thong-tri-duyet-y-du-toan.component';
import { ThongTriDuyetYDuToanComponent } from './thong-tri-duyet-y-du-toan.component';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    declarations: [
        ThongTriDuyetYDuToanComponent,
        ThongTinThongTriDuyetYDuToanComponent,

    ],
    exports: [
        ThongTriDuyetYDuToanComponent
    ]
})
export class ThongTriDuyetYDuToanModule { }

