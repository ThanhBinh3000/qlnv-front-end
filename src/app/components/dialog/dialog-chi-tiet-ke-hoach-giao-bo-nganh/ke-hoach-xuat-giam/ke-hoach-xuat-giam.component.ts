import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ThongTinQuyetDinh } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { Globals } from './../../../../shared/globals';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'app-ke-hoach-xuat-giam',
  templateUrl: './ke-hoach-xuat-giam.component.html',
  styleUrls: ['./ke-hoach-xuat-giam.component.scss'],
})
export class KeHoachXuatGiamComponent implements OnInit, OnChanges {
  @Input() maBoNganh: string;
  @Input()
  dsHangHoa = [];
  @Input()
  dataTable = [];
  @Input()
  tabName: String;
  @Input() namHienTai: number;
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
    public globals: Globals,
    private notification: NzNotificationService,
  ) {
  }

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
          this.updateEditCache()
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  themMoiItem() {
    if (this.rowItem.loaiVthh && this.rowItem.soLuong != null) {
      if (!this.dataTable) {
        this.dataTable = [];
      }
      this.dataTable = [...this.dataTable, this.rowItem]
      this.rowItem = new ThongTinQuyetDinh();
      this.updateEditCache()
      this.emitDataTable()
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")
    }
  }

  clearData() {

  }

  huyEdit(idx: number): void {
    this.dataEdit[idx] = {
      data: { ...this.dataTable[idx] },
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
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        }
      });
    }
  }

  onChangeLoaiVthh(event, typeData?: any) {
    if (typeData) {
      this.dsChungLoaiHangHoa = [];
      typeData.dviTinh = null;
      const loaiVthh = this.dsHangHoa.filter(item => item.ma == event);
      if (loaiVthh.length > 0) {
        typeData.cloaiVthh = null;
        typeData.dviTinh = loaiVthh[0].maDviTinh;
        typeData.tenVthh = loaiVthh[0].ten;
        this.dsChungLoaiHangHoa = loaiVthh[0].child;
      }
    } else {
      this.dsChungLoaiHangHoa = [];
      this.rowItem.dviTinh = null;
      const loaiVthh = this.dsHangHoa.filter(item => item.ma == event);
      if (loaiVthh.length > 0) {
        this.rowItem.dviTinh = loaiVthh[0].maDviTinh;
        this.rowItem.tenVthh = loaiVthh[0].ten;
        this.dsChungLoaiHangHoa = loaiVthh[0].child;
      }
    }
  }

  onChangeCloaiVthh(event, typeData?: any) {
    if (typeData) {
      const cloaiVthh = this.dsChungLoaiHangHoa.filter(item => item.ma == event);
      if (cloaiVthh.length > 0) {
        typeData.tenCloaiVthh = cloaiVthh[0].ten;
      }
    } else {
      const cloaiVthh = this.dsChungLoaiHangHoa.filter(item => item.ma == event);
      if (cloaiVthh.length > 0) {
        this.rowItem.tenCloaiVthh = cloaiVthh[0].ten;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.maBoNganh) {
      this.rowItem = new ThongTinQuyetDinh();
    }
  }
}

