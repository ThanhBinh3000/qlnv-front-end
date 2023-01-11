import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from './../../../../../../../constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-thanh-phan-lay-mau',
  templateUrl: './thanh-phan-lay-mau.component.html',
  styleUrls: ['./thanh-phan-lay-mau.component.scss']
})
export class ThanhPhanLayMauComponent implements OnInit {

  @Input() loaiDaiDien: string;
  @Input() dataTable: any[] = [];
  @Output() dataTableChange = new EventEmitter<any[]>();
  hasError: boolean = false;

  constructor(
    private notification: NzNotificationService,
    private modal: NzModalService,
  ) {
  }

  itemRow: ItemDaiDien = new ItemDaiDien();
  dataEdit: { [key: string]: { edit: boolean; data: ItemDaiDien } } = {};
  ngOnInit(): void {
    this.emitDataTable();
  }

  addDaiDien() {
    if (this.itemRow.daiDien != null) {
      this.itemRow.loaiDaiDien = this.loaiDaiDien;
      this.dataTable.push(this.itemRow);
      this.itemRow = new ItemDaiDien();
      this.emitDataTable();
      this.updateEditCache();
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")

    }
  }

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable)
  }
  clearItemRow() {
    this.itemRow = new ItemDaiDien();
  }
  editRow(index: number) {
    this.dataEdit[index].edit = true;
  }
  cancelEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.idVirtual == id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }

  saveEdit(index: number): void {
    this.hasError = (false);
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
    this.dataEdit[index].edit = false;
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }
  deleteRow(index: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable.splice(index, 1);
          this.updateEditCache();
          this.dataTable;
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }


}

export class ItemDaiDien {
  id: number
  daiDien: string
  loaiDaiDien: string;
  isEdit: boolean = false;
}

