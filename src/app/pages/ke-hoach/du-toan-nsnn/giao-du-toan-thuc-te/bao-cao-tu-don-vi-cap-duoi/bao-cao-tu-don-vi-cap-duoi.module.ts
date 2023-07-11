import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaoCaoTuDonViCapDuoiComponent } from './bao-cao-tu-don-vi-cap-duoi.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
    declarations: [BaoCaoTuDonViCapDuoiComponent],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [BaoCaoTuDonViCapDuoiComponent],
})
export class BaoCaoTuDonViCapDuoiModule { }
