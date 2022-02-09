import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonLayoutData, DEFAULT_COMMON_LAYOUT_DATA } from '../types';
import * as myGlobals from '../../../../globals';
import { map, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-blank-layout',
    templateUrl: './blank-layout.component.html',
    styleUrls: ['./blank-layout.component.scss'],
})
export class BlankLayoutComponent {
    layoutData: CommonLayoutData = DEFAULT_COMMON_LAYOUT_DATA;
    
    unsubscribe$ = new Subject();
    emailAddUser = '';
    userNameAddUser = '';

    constructor(
        private route: ActivatedRoute,
    ) {
        this.layoutData = Object.assign({}, this.layoutData, {
            pageTitle:  this.route.snapshot.data['pageTitle'],
            pageDes: this.route.snapshot.data['pageDes'],
            breadcrumb: this.route.snapshot.data['breadcrumb'],
        })
    }

    ngOnInit(){
        myGlobals.emailAddUser$.pipe(
            map(result => {
                return result
            }),
        takeUntil(this.unsubscribe$)).subscribe(result => {
            this.emailAddUser = result
        });

        myGlobals.userNameAddUser$.pipe(
            map(result => {
                return result
            }),
        takeUntil(this.unsubscribe$)).subscribe(result => {
            this.userNameAddUser = result
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
