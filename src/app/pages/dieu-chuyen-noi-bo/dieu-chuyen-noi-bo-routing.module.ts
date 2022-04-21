import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DieuChuyenNoiBoComponent } from './dieu-chuyen-noi-bo.component';

const routes: Routes = [
    {
        path: '',
        component: DieuChuyenNoiBoComponent,
        children: [

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DieuChuyenNoiBoRoutingModule { }
