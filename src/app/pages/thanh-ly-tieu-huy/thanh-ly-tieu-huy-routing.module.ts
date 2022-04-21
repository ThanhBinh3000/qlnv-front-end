import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThanhLyTieuHuyComponent } from './thanh-ly-tieu-huy.component';

const routes: Routes = [
    {
        path: '',
        component: ThanhLyTieuHuyComponent,
        children: [

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ThanhLyTieuHuyRoutingModule { }
