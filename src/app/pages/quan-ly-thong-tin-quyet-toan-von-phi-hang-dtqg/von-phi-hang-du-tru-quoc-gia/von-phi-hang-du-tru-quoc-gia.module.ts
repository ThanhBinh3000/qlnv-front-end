import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { VonPhiHangDuTruQuocGiaComponent } from './von-phi-hang-du-tru-quoc-gia.component';
import { VonPhiHangDuTruQuocGiaRoutingModule } from './von-phi-hang-du-tru-quoc-gia-routing.module';
import { BaoCaoQuyetToanModule } from './bao-cao-quyet-toan/bao-cao-quyet-toan.module';
import { DieuChinhBaoCaoSauQuyetToanModule } from './dieu-chinh-bao-cao-sau-quyet-toan/dieu-chinh-bao-cao-sau-quyet-toan.module';
import { PheDuyetTongHopModule } from './phe-duyet-tong-hop/phe-duyet-tong-hop.module';


@NgModule({
    declarations: [
        VonPhiHangDuTruQuocGiaComponent,
    ],
    imports: [
        CommonModule,
        VonPhiHangDuTruQuocGiaRoutingModule,
        ComponentsModule,
        DirectivesModule,
        BaoCaoQuyetToanModule,
        DieuChinhBaoCaoSauQuyetToanModule,
        PheDuyetTongHopModule,
    ],
    providers: [DatePipe]
})
export class VonPhiHangDuTruQuocGiaModule { }
