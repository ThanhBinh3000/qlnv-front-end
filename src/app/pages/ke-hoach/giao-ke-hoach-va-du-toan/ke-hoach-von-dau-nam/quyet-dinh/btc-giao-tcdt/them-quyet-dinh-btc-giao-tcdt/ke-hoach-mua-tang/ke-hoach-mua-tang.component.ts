import { Component, OnInit, Input, Output, EventEmitter, IterableDiffers, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { ThongTinQuyetDinh } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { STATUS } from 'src/app/constants/status';
import {AMOUNT_NO_DECIMAL, AMOUNT_ONE_DECIMAL} from "../../../../../../../../Utility/utils";

@Component({
  selector: 'app-ke-hoach-mua-tang',
  templateUrl: './ke-hoach-mua-tang.component.html',
  styleUrls: ['./ke-hoach-mua-tang.component.scss'],
})
export class KeHoachMuaTangComponent implements OnInit, OnChanges {
  @Input()
  dataTable = [];
  @Input()
  trangThai :any=[];
  STATUS=STATUS;
  @Output()
  dataTableChange = new EventEmitter<any[]>();
  @Input()
  dsHangHoa = [];
  @Input()
  isView: boolean = false;
  rowItem: ThongTinQuyetDinh = new ThongTinQuyetDinh();
  dsChungLoaiHangHoa = [];
  dsChungLoaiHangHoaTable = [];
  amount = AMOUNT_ONE_DECIMAL;
  amount_no_decimal = AMOUNT_NO_DECIMAL;
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinQuyetDinh } } = {};

  constructor(
    private modal: NzModalService,
    public globals: Globals,
    private notification: NzNotificationService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateEditCache();
    this.emitDataTable();
  }

  ngOnInit(): void {

  }

  editItem(index: number): void {
    this.dataEdit[index].edit = true;
    this.onChangeLoaiVthh(this.dataEdit[index].data.loaiVthh, 'edit', index);
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
    if (this.rowItem.loaiVthh && this.rowItem.soLuong && this.rowItem.donGia != null) {
      this.rowItem.tongTien = this.rowItem.soLuong * this.rowItem.donGia
      this.dataTable = [...this.dataTable, this.rowItem]
      this.rowItem = new ThongTinQuyetDinh();
      this.updateEditCache();
      this.emitDataTable();
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")
    }
  }


  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }

  clearData() { }

  huyEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.id == id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }


  calcularTongTien(rowData) {
    rowData.tongTien = rowData.soLuong * rowData.donGia;

  }

  luuEdit(index: number): void {
    let dataSaved = this.dataEdit[index].data;
    Object.assign(this.dataTable[index], dataSaved);
    this.dataEdit[index].edit = false;
    this.emitDataTable();
  }

  updateEditCache(): void {
    if (this.dataTable) {
      let i = 0;
      this.dataTable.forEach((item) => {
        const dataNd = this.dsChungLoaiHangHoaTable.filter(d => d.ma == item.cloaiVthh)
        if (dataNd.length > 0) {
          item.tenCloaiVthh = dataNd[0].tenCloaiVthh;
        }
        this.dataEdit[i] = {
          edit: false,
          data: { ...item },
        };
        i++
      });
    }
  }


  calcTong() {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.tongTien;
        return prev;
      }, 0);
      return sum;
    }
  }

  onChangeLoaiVthh(event, typeChange, index?) {
    if (typeChange === 'add') {
      this.dsChungLoaiHangHoa = [];
      this.rowItem.dviTinh = null;
      const loaiVthh = this.dsHangHoa.filter(item => item.ma == event);
      if (loaiVthh.length > 0) {
        this.rowItem.dviTinh = loaiVthh[0].maDviTinh;
        this.rowItem.tenVthh = loaiVthh[0].ten;
        this.dsChungLoaiHangHoa = loaiVthh[0].child;
      }
    }
    if (typeChange === 'edit') {
      this.dsChungLoaiHangHoaTable = [];
      this.rowItem.dviTinh = null;
      const loaiVthh = this.dsHangHoa.filter(item => item.ma == event);
      if (loaiVthh.length > 0) {
        this.dataEdit[index].data.dviTinh = loaiVthh[0].maDviTinh;
        this.dataEdit[index].data.tenVthh = loaiVthh[0].ten;
        this.dsChungLoaiHangHoaTable = loaiVthh[0].child;
      }
    }
  }

  onChangeCloaiVthh(event) {
    const cloaiVthh = this.dsChungLoaiHangHoa.filter(item => item.ma == event);
    if (cloaiVthh.length > 0) {
      this.rowItem.tenCloaiVthh = cloaiVthh[0].ten;
    }
  }

}
