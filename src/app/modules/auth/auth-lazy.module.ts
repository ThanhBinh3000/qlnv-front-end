import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { AuthLoginFormComponent } from './auth-login-form/auth-login-form.component';
import { AuthLoginContainer } from './containers';

@NgModule({
    imports: [CommonModule, SharedModule, ReactiveFormsModule],
    declarations: [AuthLoginFormComponent, AuthLoginContainer],
    exports: [CommonModule, AuthLoginFormComponent, AuthLoginContainer, SharedModule],
})
export class AuthLazyModule {}
