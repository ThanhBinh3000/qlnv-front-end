import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { ThongTinQuyetDinh } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'app-ke-hoach-xuat-giam',
  templateUrl: './ke-hoach-xuat-giam.component.html',
  styleUrls: ['./ke-hoach-xuat-giam.component.scss'],
})
export class KeHoachXuatGiamComponent implements OnInit {
  @Input()
  dsHangHoa = [];
  @Input()
  dataTable = [];
  @Input()
  tabName: String;
  @Output()
  dataTableChange = new EventEmitter<any[]>();
  @Input()
  tongGtri: number
  @Output()
  tongGtriChange = new EventEmitter<number>();

  @Input()
  isView: boolean = false;

  rowItem: ThongTinQuyetDinh = new ThongTinQuyetDinh();
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinQuyetDinh } } = {};
  dsChungLoaiHangHoa = [];
  dsDonViTinh = [];
  dsKeHoachNam = [];

  constructor(
    private modal: NzModalService,
  ) { }

  ngOnInit(): void {
    this.updateEditCache()
    this.emitDataTable();
  }

  initData() {

  }

  onChangeTongGtri() {
    this.tongGtriChange.emit(this.tongGtri)
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
    if (!this.dataTable) {
      this.dataTable = [];
    }
    console.log(this.rowItem);
    this.dataTable = [...this.dataTable, this.rowItem]
    this.rowItem = new ThongTinQuyetDinh();
    this.updateEditCache()
    this.emitDataTable()
  }

  clearData() {

  }

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

  onChangeLoaiVthh(event) {
    this.dsChungLoaiHangHoa = [];
    this.rowItem.dviTinh = null;
    const loaiVthh = this.dsHangHoa.filter(item => item.ma == event);
    if (loaiVthh.length > 0) {
      this.rowItem.dviTinh = loaiVthh[0].maDviTinh;
      this.rowItem.tenVthh = loaiVthh[0].ten;
      this.dsChungLoaiHangHoa = loaiVthh[0].child;
    }
  }

  onChangeCloaiVthh(event) {
    const cloaiVthh = this.dsChungLoaiHangHoa.filter(item => item.ma == event);
    if (cloaiVthh.length > 0) {
      this.rowItem.tenCloaiVthh = cloaiVthh[0].ten;
    }
  }

}

