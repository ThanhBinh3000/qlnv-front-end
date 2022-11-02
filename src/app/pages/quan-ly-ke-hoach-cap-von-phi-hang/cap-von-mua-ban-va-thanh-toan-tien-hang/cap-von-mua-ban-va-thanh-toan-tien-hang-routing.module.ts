import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapVonMuaBanVaThanhToanTienHangComponent } from './cap-von-mua-ban-va-thanh-toan-tien-hang.component';

const routes: Routes = [
    {
        path: '',
        component: CapVonMuaBanVaThanhToanTienHangComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CapVonMuaBanVaThanhToanTienHangRoutingModule { }
