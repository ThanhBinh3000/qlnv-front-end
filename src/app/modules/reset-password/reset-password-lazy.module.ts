import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared";
import { ForgotPasswordFormComponent, ResetPasswordFormComponent } from "./components";
import { ForgotPasswordFormContainer, ResetPasswordFormContainer } from "./containers";


@NgModule({
    declarations: [
        ForgotPasswordFormComponent,
        ForgotPasswordFormContainer,
        ResetPasswordFormComponent,
        ResetPasswordFormContainer
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    exports: [
        ForgotPasswordFormComponent,
        ForgotPasswordFormContainer,
        ResetPasswordFormComponent,
        ResetPasswordFormContainer,
    ],
})
export class ResetPasswordLazyModule {}
