import { saveAs } from 'file-saver';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from "ng-zorro-antd/modal";
import { cloneDeep } from 'lodash';

@Component({
    selector: 'app-edit-table',
    templateUrl: './edit-table.component.html',
    styleUrls: ['./edit-table.component.scss'],
})
export class EditTableComponent implements OnInit {
    @Input() rowInitial: any = {};
    @Input() trangThai: string;
    @Input() isEdit: boolean;
    @Input() dataHeader: any[] = [];
    @Input() dataColumn: any[] = []
    @Input() dataTable: any[] = [];

    rowItem: any = {};
    fileAdd: any = {};
    disabledAdd: boolean = false;
    rowDataClone: { [key: string]: any } = {};
    constructor(
        public globals: Globals,
        public userService: UserService,
        private modal: NzModalService,
        private uploadFileService: UploadFileService,
        private notification: NzNotificationService,
    ) {
    }

    ngOnInit(): void {
        this.rowItem = cloneDeep(this.rowInitial);
        if (this.dataTable && this.dataTable.length > 0) {
            this.dataTable.forEach((item) => {
                item.idVirtual = item.id;
            })
        }
    }

    addRow() {

        if (!this.dataTable) {
            this.dataTable = [];
        };
        this.dataTable.push(this.rowItem);
        this.clearAdd();
    }

    clearAdd() {
        this.rowItem = cloneDeep(this.rowInitial);
    }
    editRow(index) {
        this.dataTable[index].edit = true;
        this.rowDataClone = { ...this.dataTable[index] }
        this.clearAdd();
        this.disabledAdd = true;
    }
    deleteRow(index) {
        if (this.isEdit) {
            this.modal.confirm({
                nzClosable: false,
                nzTitle: 'Xác nhận',
                nzContent: 'Bạn có chắc chắn muốn xóa?',
                nzOkText: 'Đồng ý',
                nzCancelText: 'Không',
                nzOkDanger: true,
                nzWidth: 310,
                nzOnOk: async () => {
                    this.dataTable.splice(index, 1);
                }
            });
            // this.data = this.data.filter(x => x.idVirtual != item.idVirtual);
        }
    }

    saveEdit(index: number) {
        this.rowDataClone = {};
        this.dataTable[index].edit = false;
        this.disabledAdd = false;
    }
    cancleEdit(index: number) {
        this.dataTable[index] = { ...this.rowDataClone };
        this.dataTable[index].edit = false;
        this.disabledAdd = false;
    }
}
