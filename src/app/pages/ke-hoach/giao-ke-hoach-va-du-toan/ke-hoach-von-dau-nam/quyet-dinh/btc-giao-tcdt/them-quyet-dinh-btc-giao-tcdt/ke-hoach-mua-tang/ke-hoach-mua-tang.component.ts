import { Component, OnInit, Input, Output, EventEmitter, IterableDiffers, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { ThongTinQuyetDinh } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';

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
  @Input()
  dsHangHoa = [];

  rowItem: ThongTinQuyetDinh = new ThongTinQuyetDinh();
  dsChungLoaiHangHoa = [];
  dsChungLoaiHangHoaTable = [];
  dsDonViTinh = [];
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinQuyetDinh } } = {};

  constructor(
    private modal: NzModalService,
    public globals: Globals
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
          this.updateEditCache();
          this.emitDataTable();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }


  themMoiItem() {
    this.dataTable = [...this.dataTable, this.rowItem]
    this.rowItem = new ThongTinQuyetDinh();
    this.updateEditCache();
    this.emitDataTable();
  }


  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }

  clearData() { }

  huyEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.id === id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }


  calcularTongTien() {
    this.rowItem.tongTien = +this.rowItem.soLuong * +this.rowItem.donGia;
  }

  luuEdit(index: number): void {
    let dataSaved = this.dataEdit[index].data;
    const dataNd = this.dsHangHoa.filter(d => d.id == dataSaved.loaiVthh);
    dataSaved.tenVthh = dataNd[0].ten;
    Object.assign(this.dataTable[index], dataSaved);
    this.dataEdit[index].edit = false;
    this.emitDataTable();
  }

  updateEditCache(): void {
    if (this.dataTable) {
      let i = 0;
      this.dataTable.forEach((item) => {
        const dataNd = this.dsHangHoa.filter(d => d.id == item.loaiVthh)
        if (dataNd.length > 0) {
          item.ten = dataNd[0].ten;
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
    const sum = this.dataTable.reduce((prev, cur) => {
      prev += cur.duToan;
      return prev;
    }, 0);
    return sum;
  }

  onChangeLoaiVthh(event, typeChange) {
    console.log(event, typeChange);
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
        // this.rowItem.dviTinh = loaiVthh[0].maDviTinh;
        // this.rowItem.tenVthh = loaiVthh[0].ten;
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
