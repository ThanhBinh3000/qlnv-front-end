import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DauThauRoutingModule } from './dau-thau-routing.module';
import { DauThauComponent } from './dau-thau.component';
import { DieuChinhModule } from './dieu-chinh/dieu-chinh.module';
import { HopDongModule } from './hop-dong/hop-dong.module';
import { CucComponent } from './kehoach-luachon-nhathau/cuc/cuc.component';
import { DanhsachKehoachLcntComponent } from './kehoach-luachon-nhathau/cuc/danhsach-kehoach-lcnt/danhsach-kehoach-lcnt.component';
import { ThemmoiKehoachLcntComponent } from './kehoach-luachon-nhathau/cuc/danhsach-kehoach-lcnt/themmoi-kehoach-lcnt/themmoi-kehoach-lcnt.component';
import { MainCucComponent } from './kehoach-luachon-nhathau/cuc/main-cuc/main-cuc.component';
import { KeHoachLuachonNhathauComponent } from './kehoach-luachon-nhathau/kehoach-luachon-nhathau.component';
import { KehoachLuachonNhathauModule } from './kehoach-luachon-nhathau/kehoach-luachon-nhathau.module';
import { MainTongCucComponent } from './kehoach-luachon-nhathau/tong-cuc/main-tong-cuc/main-tong-cuc.component';
import { PhuongAnKhlcntComponent } from './kehoach-luachon-nhathau/tong-cuc/phuong-an-khlcnt/phuong-an-khlcnt.component';
import { ThemmoiPhuonganKhlcntComponent } from './kehoach-luachon-nhathau/tong-cuc/phuong-an-khlcnt/themmoi-phuongan-khlcnt/themmoi-phuongan-khlcnt.component';
import { QuyetdinhPheduyetKhlcntComponent } from './kehoach-luachon-nhathau/tong-cuc/quyetdinh-pheduyet-khlcnt/quyetdinh-pheduyet-khlcnt.component';
import { ThemmoiQuyetdinhKhlcntComponent } from './kehoach-luachon-nhathau/tong-cuc/quyetdinh-pheduyet-khlcnt/themmoi-quyetdinh-khlcnt/themmoi-quyetdinh-khlcnt.component';
import { ThemmoiKehoachLcntTongCucComponent } from './kehoach-luachon-nhathau/tong-cuc/themmoi-kehoach-lcnt-tong-cuc/themmoi-kehoach-lcnt-tong-cuc.component';
import { TongCucComponent } from './kehoach-luachon-nhathau/tong-cuc/tong-cuc.component';
import { ThemmoiTonghopKhlcntComponent } from './kehoach-luachon-nhathau/tong-cuc/tong-hop-khlcnt/themmoi-tonghop-khlcnt/themmoi-tonghop-khlcnt.component';
import { TongHopKhlcntComponent } from './kehoach-luachon-nhathau/tong-cuc/tong-hop-khlcnt/tong-hop-khlcnt.component';
import { TrienkhaiLuachonNhathauModule } from './trienkhai-luachon-nhathau/trienkhai-luachon-nhathau.module';


@NgModule({
  declarations: [
    DauThauComponent,
    KeHoachLuachonNhathauComponent,
    TongCucComponent,
    CucComponent,
    QuyetdinhPheduyetKhlcntComponent,
    PhuongAnKhlcntComponent,
    TongHopKhlcntComponent,
    ThemmoiTonghopKhlcntComponent,
    ThemmoiKehoachLcntComponent,
    DanhsachKehoachLcntComponent,
    ThemmoiPhuonganKhlcntComponent,
    ThemmoiQuyetdinhKhlcntComponent,
    MainTongCucComponent,
    ThemmoiTonghopKhlcntComponent,
    MainCucComponent,
    ThemmoiKehoachLcntTongCucComponent
  ],
  imports: [
    CommonModule,
    DauThauRoutingModule,
    ComponentsModule,
    HopDongModule,
    KehoachLuachonNhathauModule,
    TrienkhaiLuachonNhathauModule,
    DieuChinhModule
  ],
  exports: [
    QuyetdinhPheduyetKhlcntComponent,
  ]
})
export class DauThauModule { }
