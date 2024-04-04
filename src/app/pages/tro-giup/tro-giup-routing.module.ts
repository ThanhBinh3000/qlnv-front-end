import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TroGiupComponent } from './tro-giup.component';
import { AuthGuard } from '../auth/auth.guard';
import { HuongDanSuDungComponent } from './huong-dan-su-dung/huong-dan-su-dung.component';
import { GioiThieuHeThongComponent } from './gioi-thieu-he-thong/gioi-thieu-he-thong.component';

const routes: Routes = [
    {
        path: '',
        component: TroGiupComponent,
        children: [
            {
                path: '',
                redirectTo: 'huong-dan-su-dung',
                pathMatch: 'full',
            },
            {
                path: 'huong-dan-su-dung',
                component: HuongDanSuDungComponent,
            },
            {
                path: 'gioi-thieu-he-thong',
                component: GioiThieuHeThongComponent
            }
        ]
    }]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TroGiupRoutingModule { }
