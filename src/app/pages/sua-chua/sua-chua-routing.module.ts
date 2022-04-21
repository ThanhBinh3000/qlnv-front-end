import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuaChuaComponent } from './sua-chua.component';

const routes: Routes = [
    {
        path: '',
        component: SuaChuaComponent,
        children: [

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SuaChuaRoutingModule { }
