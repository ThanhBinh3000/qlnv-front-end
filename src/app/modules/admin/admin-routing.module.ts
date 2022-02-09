import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLazyModule } from './admin-lazy.module';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [AdminLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
