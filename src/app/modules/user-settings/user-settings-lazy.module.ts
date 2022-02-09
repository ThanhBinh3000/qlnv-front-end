import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthModule } from "../auth";
import { SharedModule } from "../shared";
import { AdminUserComponent } from "./components/admin-user/admin-user.component";
import { ChangePasswordFormComponent } from "./components/change-password-form/change-password-form.component";
import { EmployerUserComponent } from "./components/employer-user/employer-user.component";
import { UserSettingsContainerComponent } from "./container/user-settings.container";

@NgModule({
    declarations: [
        AdminUserComponent,
        EmployerUserComponent,
        ChangePasswordFormComponent,
        UserSettingsContainerComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        AuthModule,
        ClipboardModule,
    ],
    exports: [
        AdminUserComponent,
        EmployerUserComponent,
        ChangePasswordFormComponent,
        UserSettingsContainerComponent,
    ]
})
export class UserSettingsLazyModule {}
