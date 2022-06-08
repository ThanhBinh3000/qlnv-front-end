import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DauThauRoutingModule } from './dau-thau-routing.module';
import { DauThauComponent } from './dau-thau.component';
import { TrienkhaiLuachonNhathauComponent } from './trienkhai-luachon-nhathau/trienkhai-luachon-nhathau.component';
import { DieuchinhLuachonNhathauComponent } from './dieuchinh-luachon-nhathau/dieuchinh-luachon-nhathau.component';
import { KeHoachLuachonNhathauComponent } from './kehoach-luachon-nhathau/kehoach-luachon-nhathau.component';
import { ThongtinDauthauComponent } from './trienkhai-luachon-nhathau/thongtin-dauthau/thongtin-dauthau.component';
import { QuyetdinhKetquaLcntComponent } from './trienkhai-luachon-nhathau/quyetdinh-ketqua-lcnt/quyetdinh-ketqua-lcnt.component';
import { TongCucComponent } from './kehoach-luachon-nhathau/tong-cuc/tong-cuc.component';
import { CucComponent } from './kehoach-luachon-nhathau/cuc/cuc.component';
import { QuyetdinhPheduyetKhlcntComponent } from './kehoach-luachon-nhathau/tong-cuc/quyetdinh-pheduyet-khlcnt/quyetdinh-pheduyet-khlcnt.component';
import { PhuongAnKhlcntComponent } from './kehoach-luachon-nhathau/tong-cuc/phuong-an-khlcnt/phuong-an-khlcnt.component';
import { TongHopKhlcntComponent } from './kehoach-luachon-nhathau/tong-cuc/tong-hop-khlcnt/tong-hop-khlcnt.component';
import { ThemmoiTonghopKhlcntComponent } from './kehoach-luachon-nhathau/tong-cuc/tong-hop-khlcnt/themmoi-tonghop-khlcnt/themmoi-tonghop-khlcnt.component';
import { DanhsachKehoachLcntComponent } from './kehoach-luachon-nhathau/cuc/danhsach-kehoach-lcnt/danhsach-kehoach-lcnt.component';
import { ThemmoiPhuonganKhlcntComponent } from './kehoach-luachon-nhathau/tong-cuc/phuong-an-khlcnt/themmoi-phuongan-khlcnt/themmoi-phuongan-khlcnt.component';
import { ThemmoiQuyetdinhKhlcntComponent } from './kehoach-luachon-nhathau/tong-cuc/quyetdinh-pheduyet-khlcnt/themmoi-quyetdinh-khlcnt/themmoi-quyetdinh-khlcnt.component';
import { ThemmoiKehoachLcntComponent } from './kehoach-luachon-nhathau/cuc/danhsach-kehoach-lcnt/themmoi-kehoach-lcnt/themmoi-kehoach-lcnt.component';
import { MainTongCucComponent } from './kehoach-luachon-nhathau/tong-cuc/main-tong-cuc/main-tong-cuc.component';
import { HopDongModule } from './hop-dong/hop-dong.module';


@NgModule({
  declarations: [
    DauThauComponent,
    TrienkhaiLuachonNhathauComponent,
    DieuchinhLuachonNhathauComponent,
    KeHoachLuachonNhathauComponent,
    ThongtinDauthauComponent,
    QuyetdinhKetquaLcntComponent,
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
    ThemmoiTonghopKhlcntComponent
  ],
  imports: [
    CommonModule,
    DauThauRoutingModule,
    ComponentsModule,
    HopDongModule,
  ],
})
export class DauThauModule { }
