import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaoCaoKetQuaThucHienVonPhiHangDTQGComponent } from './bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        BaoCaoKetQuaThucHienVonPhiHangDTQGComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
        RouterModule,
    ],
    exports: [
        BaoCaoKetQuaThucHienVonPhiHangDTQGComponent,
    ]
})
export class BaoCaoKetQuaThucHienVonPhiHangDTQGModule { }
