import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { NhapQuyetDinhCuaTongCucVaPhanBoChoCacDonViRoutingModule } from './nhap-quyet-dinh-cua-tong-cuc-va-phan-bo-cho-cac-don-vi-routing.module';
import { NhapQuyetDinhCuaTongCucVaPhanBoChoCacDonViComponent } from './nhap-quyet-dinh-cua-tong-cuc-va-phan-bo-cho-cac-don-vi.component';

@NgModule({
  declarations: [
    NhapQuyetDinhCuaTongCucVaPhanBoChoCacDonViComponent,
  ],
  imports: [
    CommonModule,
    NhapQuyetDinhCuaTongCucVaPhanBoChoCacDonViRoutingModule,
    ComponentsModule,
  ],
})

export class NhapQuyetDinhCuaTongCucVaPhanBoChoCacDonViModule {}
