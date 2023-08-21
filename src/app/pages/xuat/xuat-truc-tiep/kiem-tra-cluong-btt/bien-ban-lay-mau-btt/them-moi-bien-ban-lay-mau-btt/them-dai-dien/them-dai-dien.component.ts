import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';

@Component({
  selector: 'app-them-dai-dien',
  templateUrl: './them-dai-dien.component.html',
  styleUrls: ['./them-dai-dien.component.scss']
})
export class ThemDaiDienComponent implements OnInit {
  @Input() loaiDaiDien: string;
  @Input() trangThaiBb: string;
  @Input() dataTable: any[] = [];
  @Output() dataTableChange = new EventEmitter<any[]>();
  STATUS = STATUS;
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    private modal: NzModalService,
  ) {
  }

  itemRow: ItemDaiDien = new ItemDaiDien();

  ngOnInit(): void {
    this.emitDataTable();
  }

  addDaiDien() {
    if (this.validateDaiDienCuc()) {
      this.itemRow.loaiDaiDien = this.loaiDaiDien;
      this.dataTable.push(this.itemRow);
      this.itemRow = new ItemDaiDien();
      this.emitDataTable();
    }
  }

  editRow(index: number) {
    this.dataTable[index].isEdit = true;
  }

  saveEdit(index: number): void {
    this.dataTable[index].isEdit = false;
  }

  cancelEdit(index: number): void {
    this.dataTable[index].isEdit = false;
  }

  validateDaiDienCuc(): boolean {
    if (this.itemRow.daiDien) {
      return true
    } else {
      this.notification.error(MESSAGE.ERROR, "Danh sách người đại diện không được để trống")
      return false;
    }
  }

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable)
  }

  clearDaiDien() {
    this.itemRow = new ItemDaiDien();
    this.itemRow.id = null;
  }


  deleteRow(index: any) {
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

// itemRow: ItemDaiDien = new ItemDaiDien();
//   itemRow2: ItemDaiDien = new ItemDaiDien();

// addDaiDien(data: any, type: string) {
//   if (this.validateDaiDienCuc()) {
//     data.loaiDaiDien = type;
//     let body = cloneDeep(data);
//     this.dataTable.push(body);
//     this.clearDiemKho(data);
//   }
// }

// validateDaiDienCuc(): boolean {
//   if (this.itemRow.daiDien) {
//     if (this.itemRow.daiDien) {
//       return true
//     } else {
//       this.notification.error(MESSAGE.ERROR, "Đại diện Cục DTNN KV không được để trống")
//       return false;
//     }
//   } else {
//     if (this.itemRow2.daiDien) {
//       return true
//     } else {
//       this.notification.error(MESSAGE.ERROR, "Đại diện Chi Cục DTNN KV không được để trống")
//       return false;
//     }
//   }
// }




