import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { ListUsersFormComponent, NewUserDialogComponent } from './components';
import { EmployeeAdminContainer } from './containers';

@NgModule({
    declarations: [EmployeeAdminContainer, ListUsersFormComponent, NewUserDialogComponent],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule],
    exports: [EmployeeAdminContainer, ListUsersFormComponent, NewUserDialogComponent],
})
export class EmployeeLazyModule {}
