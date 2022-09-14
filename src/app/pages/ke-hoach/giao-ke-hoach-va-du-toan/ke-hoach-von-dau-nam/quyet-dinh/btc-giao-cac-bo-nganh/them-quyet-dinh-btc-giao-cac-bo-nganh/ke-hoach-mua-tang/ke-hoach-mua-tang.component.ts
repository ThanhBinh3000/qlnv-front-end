import { Component, OnInit, Input, Output, EventEmitter, DoCheck, IterableDiffers, OnChanges, SimpleChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { KeHoachMuaXuat } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DanhMucService } from 'src/app/services/danhmuc.service';

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
  @Input('isView') isView: boolean;
  @Input() tongGiaTri: number;
  rowItem: KeHoachMuaXuat = new KeHoachMuaXuat();
  dsNoiDung = [];
  dataEdit: { [key: string]: { edit: boolean; data: KeHoachMuaXuat } } = {};

  constructor(
    private modal: NzModalService,
    private danhMucService: DanhMucService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateEditCache();
    this.emitDataTable();
  }

  async ngOnInit() {
    this.getListDmLoaiChi();
  }

  initData() {

  }

  async getListDmLoaiChi() {
    let res = await this.danhMucService.danhMucChungGetAll("DM_ND_DT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsNoiDung = res.data;
    }
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
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
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

  onChangeNoiDung(loaiChi, typeData?) {
    const dataNd = this.dsNoiDung.filter(d => d.ma == loaiChi)
    if (typeData) {
      if (dataNd.length > 0) {
        typeData.tenLoaiChi= dataNd[0].giaTri;
      }
    }
    if (dataNd.length > 0) {
      this.rowItem.tenLoaiChi = dataNd[0].giaTri;
    }
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


