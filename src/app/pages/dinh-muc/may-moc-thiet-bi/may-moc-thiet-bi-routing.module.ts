import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MayMocThietBiComponent } from './may-moc-thiet-bi.component';

const routes: Routes = [
    {
        path: '',
        component: MayMocThietBiComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MayMocThietBiRoutingModule { }
