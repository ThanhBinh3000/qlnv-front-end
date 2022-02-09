import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLazyModule } from './auth-lazy.module';
import { AuthLoginContainer } from './containers';

const routes: Routes = [
    {
        path: '',
        component: AuthLoginContainer,
    },
];

@NgModule({
    imports: [CommonModule, AuthLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
