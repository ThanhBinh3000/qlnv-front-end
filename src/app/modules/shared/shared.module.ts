import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { QuicklinkModule } from 'ngx-quicklink';
import { AppBreadcrumbModule } from './app-breadcrumb';
import { AppErrorBoxModule } from './app-error-box';
import { DataTableModule } from './datatable';
import { DataTableMobileModule } from './datatable-mobile';
import { ConfirmationDialogModule } from './dialogs';
import { UnsavedChangeDialogModule } from './dialogs/unsaved-change-dialog/unsaved-change-dialog.module';
import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { MenuFilter, MenuHasChild } from './pipes';
import { MasterLayoutComponent } from './layouts/master-layout/master-layout.component';
import { CountryFlagPipe } from './pipes/country-flag.pipe';
import { CountryCodePipe } from './pipes/country-code.pipe';
import { BlankLayoutComponent } from './layouts';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        QuicklinkModule,
        MaterialModule,
        FlexLayoutModule,
    ],
    exports: [
        AppBreadcrumbModule,
        AppErrorBoxModule,
        MaterialModule,
        QuicklinkModule,
        DataTableModule,
        DataTableMobileModule,
        ConfirmationDialogModule,
        UnsavedChangeDialogModule,
        // pipes
        CountryFlagPipe,
        CountryCodePipe,
        MenuFilter,
        MenuHasChild,
        FlexLayoutModule,
    ],
    declarations: [
        CountryCodePipe,
        CountryFlagPipe,
        MenuFilter,
        MenuHasChild,
        MasterLayoutComponent,
        BlankLayoutComponent,
        SidebarComponent,
        NavbarComponent,
    ],
})
export class SharedModule {}
