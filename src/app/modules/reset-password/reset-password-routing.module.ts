import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BlankLayoutComponent } from "../shared/layouts";
import { ForgotPasswordFormContainer, ResetPasswordFormContainer } from "./containers";
import { ResetPasswordLazyModule } from "./reset-password-lazy.module";

const routes: Routes = [{
    path: '',
    component: BlankLayoutComponent,
    children: [
        {
            path: '',
            component: ForgotPasswordFormContainer,
        },
        {
            path: ':id/:code',
            component: ResetPasswordFormContainer,
        }
    ]
}];

@NgModule({
    imports: [ResetPasswordLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ResetPasswordRoutingModule {}
