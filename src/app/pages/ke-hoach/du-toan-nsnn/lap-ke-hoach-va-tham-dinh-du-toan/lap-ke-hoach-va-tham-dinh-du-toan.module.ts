import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { LapKeHoachVaThamDinhDuToanComponent } from './lap-ke-hoach-va-tham-dinh-du-toan.component';

@NgModule({
    declarations: [
        LapKeHoachVaThamDinhDuToanComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        LapKeHoachVaThamDinhDuToanComponent,
    ]
})
export class LapKeHoachVaThamDinhDuToanModule { }
