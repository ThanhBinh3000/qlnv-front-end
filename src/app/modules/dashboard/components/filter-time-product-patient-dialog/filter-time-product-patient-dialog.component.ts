import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';
import * as myGlobals from '../../../../globals';

@Component({
    selector: 'app-filter-time-product-patient-dialog',
    templateUrl: './filter-time-product-patient-dialog.component.html',
    styleUrls: ['./filter-time-product-patient-dialog.component.scss'],
})
export class FilterTimeProductPatientDialogComponent implements OnInit, OnDestroy {
    @ViewChild('f', { static: true })
    formDirective: NgForm;

    @Input()
    errorMessages: string[];

    // @Output()
    // getDataClicked = new EventEmitter<DataFilterProductPatient>();

    form: FormGroup;
    private unsubscribed$ = new Subject();
    lstContainer = this.service.lstContainer$;
    lstNurse = this.service.lstNurse$;
    lstTypeDate : Array<any> = [
        {
            name: 'day',
            display: 'Day'
        },
        {
            name: 'week',
            display: 'Week'
        },
        {
            name: 'month',
            display: 'Month'
        }
    ];

    smallScreen$ = this.breakpointObserver
        .observe(['(max-width: 1200px)'])
        .pipe(map(observer => (observer.matches ? 'yes' : 'no')));

    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private service: DashboardService,
        private matDialogRef: MatDialogRef<FilterTimeProductPatientDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            typeDate?: string;
            nurseId?: string;
            containerId?: string;
        },
    ) {}

    ngOnInit() {
        this.service.getNurseData().subscribe();
        this.service.getContainerData().subscribe();
        if(this.data != null){
            this.form = this.fb.group({
                typeDate: new FormControl(this.data.typeDate, {
                    validators: [Validators.required],
                }),
                containerId: new FormControl(this.data.containerId),
                nurseId: new FormControl(this.data.nurseId),
            });
        }
        else {
            this.form = this.fb.group({
                typeDate: new FormControl('', {
                    validators: [Validators.required],
                }),
                containerId: new FormControl(''),
                nurseId: new FormControl(''),
            });
        }
    }

    ngOnDestroy() {
        this.unsubscribed$.next();
        this.unsubscribed$.complete();
    }

    get typeDate() {
        return this.form.controls.typeDate as FormControl;
    }

    get containerId() {
        return this.form.controls.containerId as FormControl;
    }

    get nurseId() {
        return this.form.controls.nurseId as FormControl;
    }

    registerDataFilter() {
        if (this.form.valid) {
            let typeDate = this.lstTypeDate.filter(x=> x.name == this.form.value.typeDate);
            if(typeDate != null && typeDate.length > 0){
                myGlobals.typeDateSub$.next(typeDate[0]);
            }
            else {
                myGlobals.typeDateSub$.next({
                    name: 'day',
                    display: 'Day'
                });
            }
            myGlobals.nurseSub$.next({
                id: '',
                username: 'None'
            });
            this.lstNurse.subscribe(res => {
                let nurse = res.filter(x=>x.id == this.form.value.nurseId);
                if(nurse != null && nurse.length > 0){
                    myGlobals.nurseSub$.next(nurse[0]);
                }
                else {
                    myGlobals.nurseSub$.next({
                        id: '',
                        username: 'None'
                    });
                }
            });
            myGlobals.containerSub$.next({
                id: '',
                name: 'None'
            });
            this.lstContainer.subscribe(res => {
                let container = res.filter(x=>x.id == this.form.value.containerId);
                if(container != null && container.length > 0){
                    myGlobals.containerSub$.next(container[0]);
                }
                else {
                    myGlobals.containerSub$.next({
                        id: '',
                        name: 'None'
                    });
                }
            });
        }
    }

    closePopup() {
        this.matDialogRef.close();
        this.resetForm();
    }

    resetForm() {
        this.formDirective.resetForm();
        this.form.reset();
        Object.keys(this.form.controls).forEach(key => this.form.controls[key].setErrors(null));
    }
}
