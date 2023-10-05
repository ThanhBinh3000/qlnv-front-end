import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'app-dialog-table-selection',
  templateUrl: './dialog-table-selection.component.html',
  styleUrls: ['./dialog-table-selection.component.scss']
})
export class DialogTableSelectionComponent implements OnInit {
  dataHeader: any[] = [];
  dataColumn: any[] = []
  dataTable: any[] = [];
  isView: boolean = false;
  code: string;
  constructor(
    private _modalRef: NzModalRef,
  ) { }

  ngOnInit(): void {
  }


  handleOk(item: any) {
    this._modalRef.close(item);
  }

  onCancel() {
    this._modalRef.close();
  }

}
