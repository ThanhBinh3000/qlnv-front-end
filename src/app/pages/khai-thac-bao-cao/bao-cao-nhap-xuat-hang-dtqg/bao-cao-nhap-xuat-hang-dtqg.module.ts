import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaoCaoNhapXuatHangDtqgRoutingModule } from './bao-cao-nhap-xuat-hang-dtqg-routing.module';
import { BaoCaoNhapXuatHangDtqgComponent } from './bao-cao-nhap-xuat-hang-dtqg.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ComponentsModule } from '../../../components/components.module';
import { MainModule } from '../../../layout/main/main.module';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { DirectivesModule } from '../../../directives/directives.module';
import { BcTienDoNhapGaoTheoGoiThauComponent } from './bc-tien-do-nhap-gao-theo-goi-thau/bc-tien-do-nhap-gao-theo-goi-thau.component';
import { BaoCaoChitietXuatGaoHotroDiaphuongComponent } from './bao-cao-chitiet-xuat-gao-hotro-diaphuong/bao-cao-chitiet-xuat-gao-hotro-diaphuong.component';


@NgModule({
  declarations: [
    BaoCaoNhapXuatHangDtqgComponent,
    BcTienDoNhapGaoTheoGoiThauComponent,
    BaoCaoChitietXuatGaoHotroDiaphuongComponent
  ],
  imports: [
    CommonModule,
    BaoCaoNhapXuatHangDtqgRoutingModule,
    ComponentsModule,
    MainModule,
    NzTreeViewModule,
    DirectivesModule,
    NzIconModule
  ],
})
export class BaoCaoNhapXuatHangDtqgModule { }
