import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MangPvcCongCuDungCuComponent } from './mang-pvc-cong-cu-dung-cu.component';

const routes: Routes = [
    {
        path: '',
        component: MangPvcCongCuDungCuComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MangPvcCongCuDungCuRoutingModule { }
