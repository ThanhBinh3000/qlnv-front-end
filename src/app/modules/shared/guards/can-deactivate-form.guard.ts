import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonDirtyComponent } from '../../core/types';
import { UnsavedChangesDialog } from '../dialogs/unsaved-change-dialog/unsaved-changes-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class CanDeactivateFormGuard implements CanDeactivate<CommonDirtyComponent> {
    constructor(private dialog: MatDialog) {}

    canDeactivate(
        component: CommonDirtyComponent,
        _currentRoute: ActivatedRouteSnapshot,
        _currentState: RouterStateSnapshot,
        _nextState?: RouterStateSnapshot,
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (component.childComponent.isDirty && _nextState?.url !== '/login') {
            return this.dialog.open(UnsavedChangesDialog).afterClosed();
        }
        return true;
    }
}
