import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { KeHoachMuaXuat } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';

@Component({
  selector: 'app-ke-hoach-mua-tang',
  templateUrl: './ke-hoach-mua-tang.component.html',
  styleUrls: ['./ke-hoach-mua-tang.component.scss'],
})
export class KeHoachMuaTangComponent implements OnInit {
  @Input()
  dataTable = [];
  @Output()
  dataTableChange = new EventEmitter<any[]>();

  rowItem: KeHoachMuaXuat = new KeHoachMuaXuat();

  dsNoiDung = [];
  dataEdit: { [key: string]: { edit: boolean; data: KeHoachMuaXuat } } = {};

  constructor(
    private modal: NzModalService,

  ) {
    // this.dataTable.subscribe()
  }

  async ngOnInit() {
    this.dsNoiDung = [
      {
        id: 1,
        noiDung: 'Chi dự trữ quốc gia',
      },
      {
        id: 2,
        noiDung: 'Chi thường xuyên',
      },
      {
        id: 3,
        noiDung: 'Khác',
      },
    ];
    await this.updateEditCache();
    await this.emitDataTable();
  }

  initData() {

  }

  subscribeData() {
    let data = new Subject();
    data.subscribe(data => {
      console.log(data);
    })
  }

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable)
  }


  editItem(id: number): void {
    this.dataEdit[id].edit = true;
  }

  xoaItem(index: number) {
    console.log(index, this.dataTable);
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

  themMoiItem() {
    this.dataTable = [...this.dataTable, this.rowItem]
    this.rowItem = new KeHoachMuaXuat();
    this.emitDataTable();
    this.updateEditCache();
  }

  clearData() { }

  huyEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.id === id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }

  luuEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.id === id);
    Object.assign(this.dataTable[index], this.dataEdit[id].data);
    this.dataEdit[id].edit = false;
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item) => {
        this.dataEdit[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
    }
    console.log(this.dataEdit);
  }

  onChangeNoiDung(idNoiDung) {
    const dataNd = this.dsNoiDung.filter(d => d.id == idNoiDung)
    console.log(dataNd);

    this.rowItem.noiDung = dataNd[0].noiDung;
  }



  calcTong() {
    if (this.dataTable.length > 0) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.duToan;
        return prev;
      }, 0);
      return sum;
    }
  }


}


