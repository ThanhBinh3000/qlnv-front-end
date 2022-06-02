import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DinhMucComponent } from './dinh-muc.component';

const routes: Routes = [
    {
        path: '',
        component: DinhMucComponent,
        children: [

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DinhMucRoutingModule { }
