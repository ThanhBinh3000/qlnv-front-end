import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';

@Component({
    selector: 'app-dialog-table-check-box',
    templateUrl: './dialog-table-check-box.component.html',
    styleUrls: ['./dialog-table-check-box.component.scss']
})
export class DialogTableCheckBoxComponent implements OnInit {
    dataHeader: any[] = [];
    dataColumn: any[] = []
    dataTable: any[] = [];
    isView: boolean = false;
    code: string;
    allChecked: boolean = true;
    indeterminate: boolean = false;
    actionRefresh: boolean = false;
    refreshData: () => Promise<any[]>
    constructor(
        private _modalRef: NzModalRef,
    ) { }

    ngOnInit(): void {
        this.updateCheck(this.dataTable, this.allChecked)
    }
    updateAllChecked(): void {
        this.indeterminate = false;
        if (this.allChecked) {
            this.dataTable = this.dataTable.map(item => ({
                ...item,
                checked: true
            }));
        } else {
            this.dataTable = this.dataTable.map(item => ({
                ...item,
                checked: false
            }));
        }
    }
    updateSingleChecked(): void {
        if (this.dataTable.every(item => !item.checked)) {
            this.allChecked = false;
            this.indeterminate = false;
        } else if (this.dataTable.every(item => item.checked)) {
            this.allChecked = true;
            this.indeterminate = false;
        } else {
            this.allChecked = false;
            this.indeterminate = true;
        }
    };
    updateCheck(dataTable: any[], allChecked: boolean): void {
        if (allChecked && dataTable.every(item => !item.checked)) {
            this.dataTable = dataTable.map(f => ({ ...f, checked: true }));
            this.indeterminate = false;
        }
        else if (this.dataTable.every(item => !item.checked)) {
            this.allChecked = false;
            this.indeterminate = false;
        } else if (this.dataTable.every(item => item.checked)) {
            this.allChecked = true;
            this.indeterminate = false;
        } else {
            this.allChecked = false;
            this.indeterminate = true;
        }
    }
    async handleRefreshData(): Promise<void> {
        const data = await this.refreshData();
        this.allChecked = true;
        this.updateCheck(data, this.allChecked);

    }

    handleOk(item: any) {
        this._modalRef.close({ data: item, allChecked: this.allChecked });
    }

    onCancel() {
        this._modalRef.close();
    }

}
