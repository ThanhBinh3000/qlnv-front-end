import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapKhacComponent } from './nhap-khac.component';

const routes: Routes = [
    {
        path: '',
        component: NhapKhacComponent,
        children: [

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NhapKhacRoutingModule { }
