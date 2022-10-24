import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeHoachComponent } from './ke-hoach/ke-hoach.component';
import { MangLuoiKhoComponent } from './mang-luoi-kho/mang-luoi-kho.component';
import { QuanLyKhoTangComponent } from './quan-ly-kho-tang.component';

const routes: Routes = [
    {
        path: '',
        component: QuanLyKhoTangComponent,
        children: [
            {
                path: '',
                redirectTo: 'mang-luoi-kho',
                pathMatch: 'full',
            },
            {
                path: 'mang-luoi-kho',
                component: MangLuoiKhoComponent,
            },
            {
                path: 'ke-hoach',
                component: KeHoachComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QuanLyKhoTangRoutingModule { }
