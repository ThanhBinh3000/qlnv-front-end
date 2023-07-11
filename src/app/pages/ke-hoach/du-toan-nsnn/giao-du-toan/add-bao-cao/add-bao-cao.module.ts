import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBaoCaoComponent } from './add-bao-cao.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { PhuLucPhanBoComponent } from './phu-luc-phan-bo/phu-luc-phan-bo.component';
import { PhuLuc03Component } from './phu-luc-03/phu-luc-03.component';
import { PhuLuc02Component } from './phu-luc-02/phu-luc-02.component';
import { PhuLuc01XuatComponent } from './phu-luc-01-xuat/phu-luc-01-xuat.component';
import { PhuLuc01NhapComponent } from './phu-luc-01-nhap/phu-luc-01-nhap.component';
import { PhuLucDaoTaoComponent } from './phu-luc-dao-tao/phu-luc-dao-tao.component';
import { PhuLucKhoaHocCongNgheComponent } from './phu-luc-khoa-hoc-cong-nghe/phu-luc-khoa-hoc-cong-nghe.component';
import { PhuLucQuyLuongComponent } from './phu-luc-quy-luong/phu-luc-quy-luong.component';
import { PhuLucSuaChuaComponent } from './phu-luc-sua-chua/phu-luc-sua-chua.component';
import { PhuLucTaiSanComponent } from './phu-luc-tai-san/phu-luc-tai-san.component';

@NgModule({
    declarations: [
        AddBaoCaoComponent,
        PhuLucPhanBoComponent,
        PhuLuc03Component,
        PhuLuc02Component,
        PhuLuc01XuatComponent,
        PhuLuc01NhapComponent,
        PhuLucDaoTaoComponent,
        PhuLucKhoaHocCongNgheComponent,
        PhuLucQuyLuongComponent,
        PhuLucSuaChuaComponent,
        PhuLucTaiSanComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [AddBaoCaoComponent]
})
export class AddBaoCaoModule { }
