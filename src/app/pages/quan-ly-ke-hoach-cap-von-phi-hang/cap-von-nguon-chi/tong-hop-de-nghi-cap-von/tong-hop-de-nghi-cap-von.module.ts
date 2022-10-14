import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DeNghiCapVonModule } from '../de-nghi-cap-von/de-nghi-cap-von.module';
import { DeNghiTheoDonGiaMuaComponent } from '../de-nghi-cap-von/de-nghi-theo-don-gia-mua/de-nghi-theo-don-gia-mua.component';
import { DanhSachDeNghiTuCucKhuVucComponent } from './danh-sach-de-nghi-tu-cuc-khu-vuc/danh-sach-de-nghi-tu-cuc-khu-vuc.component';
import { DialogTaoMoiTongHopComponent } from './dialog-tao-moi-tong-hop/dialog-tao-moi-tong-hop.component';
import { TongHopDeNghiCapVonComponent } from './tong-hop-de-nghi-cap-von.component';
import { TongHopTaiTongCucComponent } from './tong-hop-tai-tong-cuc/tong-hop-tai-tong-cuc.component';
import { TongHopTuCucKhuVucComponent } from './tong-hop-tu-cuc-khu-vuc/tong-hop-tu-cuc-khu-vuc.component';
import { TongHopComponent } from './tong-hop/tong-hop.component';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
        DeNghiCapVonModule,
    ],
    declarations: [
        TongHopDeNghiCapVonComponent,
        TongHopComponent,
        TongHopTaiTongCucComponent,
        DialogTaoMoiTongHopComponent,
        DanhSachDeNghiTuCucKhuVucComponent,
        TongHopTuCucKhuVucComponent,
    ],
    exports: [
        TongHopDeNghiCapVonComponent,
        TongHopComponent,
        TongHopTaiTongCucComponent,
        DialogTaoMoiTongHopComponent,
        DanhSachDeNghiTuCucKhuVucComponent,
        TongHopTuCucKhuVucComponent,
    ]
})
export class TongHopDeNghiCapVonModule { }
