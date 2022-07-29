import { Component, OnInit, Input, Output, EventEmitter, DoCheck, IterableDiffers } from '@angular/core';
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
export class KeHoachMuaTangComponent implements OnInit, DoCheck {
  @Input()
  dataTable = [];
  @Output()
  dataTableChange = new EventEmitter<any[]>();

  rowItem: KeHoachMuaXuat = new KeHoachMuaXuat();
  iterableDiffer: any
  dsNoiDung = [];
  dataEdit: { [key: string]: { edit: boolean; data: KeHoachMuaXuat } } = {};

  constructor(
    private modal: NzModalService,
    private iterableDiffers: IterableDiffers,
  ) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);
  }

  ngDoCheck(): void {
    const changes = this.iterableDiffer.diff(this.dataTable);
    if (changes) {
      this.updateEditCache();
      this.emitDataTable();
    }
  }

  ngOnInit(): void {
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

  }

  initData() {

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
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.sluongDtoan;
        return prev;
      }, 0);
      return sum;
    }
  }


}


