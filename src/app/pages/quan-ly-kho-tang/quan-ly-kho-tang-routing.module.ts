import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyKhoTangComponent } from './quan-ly-kho-tang.component';

const routes: Routes = [
    {
        path: '',
        component: QuanLyKhoTangComponent,
        children: [

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QuanLyKhoTangRoutingModule { }
