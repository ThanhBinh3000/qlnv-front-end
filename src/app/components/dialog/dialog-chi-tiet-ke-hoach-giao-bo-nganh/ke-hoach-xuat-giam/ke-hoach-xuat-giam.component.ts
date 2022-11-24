import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ThongTinQuyetDinh} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {Globals} from './../../../../shared/globals';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';

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
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")
    }
  }

  clearData() {

  }

  huyEdit(idx: number): void {
    this.dataEdit[idx] = {
      data: {...this.dataTable[idx]},
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
          data: {...item},
        }
      });
    }
  }

  onChangeLoaiVthh(event, typeData?: any) {
    if (typeData) {
      this.dsChungLoaiHangHoa = [];
      typeData.cloaiVthh = null;
      typeData.dviTinh = null;
      const loaiVthh = this.dsHangHoa.find(item => item.ma == event);
      if (loaiVthh) {
        typeData.dviTinh = loaiVthh.maDviTinh;
        typeData.tenVthh = loaiVthh.ten;
        this.dsChungLoaiHangHoa = loaiVthh.child;
      }
    } else {
      this.dsChungLoaiHangHoa = [];
      this.rowItem.cloaiVthh = null;
      this.rowItem.dviTinh = null;
      const loaiVthh = this.dsHangHoa.find(item => item.ma == event);
      if (loaiVthh) {
        this.rowItem.tenVthh = loaiVthh.ten;
        this.rowItem.dviTinh = loaiVthh.maDviTinh;
        this.dsChungLoaiHangHoa = loaiVthh.child;
      }
    }
  }

  onChangeCloaiVthh(event, typeData?: any) {
    if (typeData) {
      const cloaiVthh = this.dsChungLoaiHangHoa.find(item => item.ma == event);
      if (cloaiVthh) {
        typeData.tenCloaiVthh = cloaiVthh.ten;
        typeData.dviTinh = cloaiVthh.maDviTinh;
      }
    } else {
      const cloaiVthh = this.dsChungLoaiHangHoa.find(item => item.ma == event);
      if (cloaiVthh) {
        this.rowItem.tenCloaiVthh = cloaiVthh.ten;
        this.rowItem.dviTinh = cloaiVthh.maDviTinh;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.maBoNganh) {
      this.rowItem = new ThongTinQuyetDinh();
    }
  }
}

