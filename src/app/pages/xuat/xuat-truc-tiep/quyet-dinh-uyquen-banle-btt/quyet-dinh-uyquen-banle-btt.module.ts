import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { QuyetDinhUyquenBanleBttComponent } from './quyet-dinh-uyquen-banle-btt.component';
import { QuyetDinhUyQuenBanLeComponent } from './quyet-dinh-uy-quen-ban-le/quyet-dinh-uy-quen-ban-le.component';
import { ThongTinQuyetDinhUyQuyenBanLeComponent } from './quyet-dinh-uy-quen-ban-le/thong-tin-quyet-dinh-uy-quyen-ban-le/thong-tin-quyet-dinh-uy-quyen-ban-le.component';
import { KeHoachBanTrucTiepModule } from '../ke-hoach-ban-truc-tiep/ke-hoach-ban-truc-tiep.module';

@NgModule({
    declarations: [
        QuyetDinhUyquenBanleBttComponent,
        QuyetDinhUyQuenBanLeComponent,
        ThongTinQuyetDinhUyQuyenBanLeComponent,
    ],
    exports: [
        QuyetDinhUyquenBanleBttComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
        KeHoachBanTrucTiepModule
    ],
})
export class QuyetDinhUyquenBanleBttModule { }
