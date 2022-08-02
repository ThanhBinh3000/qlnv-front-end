import { Component, OnInit, Input, Output, EventEmitter, DoCheck, IterableDiffers, OnChanges, SimpleChanges } from '@angular/core';
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
export class KeHoachMuaTangComponent implements OnInit, OnChanges {
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateEditCache();
    this.emitDataTable();
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


  editItem(index: number): void {
    this.dataEdit[index].edit = true;
  }

  xoaItem(index: number) {
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
          this.emitDataTable();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  themMoiItem() {
    this.rowItem.idDanhMuc = +this.rowItem.idDanhMuc;
    this.dataTable = [...this.dataTable, this.rowItem]
    this.rowItem = new KeHoachMuaXuat();
    this.updateEditCache();
    this.emitDataTable();
  }

  clearData() { }

  huyEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.idVirtual == id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }

  luuEdit(index: number): void {
    let dataSaved = this.dataEdit[index].data;
    const dataNd = this.dsNoiDung.filter(d => d.id == dataSaved.idDanhMuc);
    dataSaved.noiDung = dataNd[0].noiDung;
    Object.assign(this.dataTable[index], dataSaved);
    this.dataEdit[index].edit = false;
    this.emitDataTable();
  }

  updateEditCache(): void {
    if (this.dataTable) {
      let i = 0;
      this.dataTable.forEach((item) => {
        const dataNd = this.dsNoiDung.filter(d => d.id == item.idDanhMuc)
        if (dataNd.length > 0) {
          item.noiDung = dataNd[0].noiDung;
        }
        this.dataEdit[i] = {
          edit: false,
          data: { ...item },
        };
        i++
      });
    }
  }

  onChangeNoiDung(idDanhMuc) {
    const dataNd = this.dsNoiDung.filter(d => d.id == idDanhMuc)
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


