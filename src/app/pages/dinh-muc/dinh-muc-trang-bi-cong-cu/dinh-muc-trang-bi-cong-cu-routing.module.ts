import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeXuatNhuCauCuaCacCucComponent } from './de-xuat-nhu-cau-cua-cac-cuc/de-xuat-nhu-cau-cua-cac-cuc.component';
import { DinhMucTrangBiCongCuComponent } from './dinh-muc-trang-bi-cong-cu.component';

const routes: Routes = [
    {
        path: '',
        component: DinhMucTrangBiCongCuComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DinhMucTrangBiCongCuRoutingModule { }
