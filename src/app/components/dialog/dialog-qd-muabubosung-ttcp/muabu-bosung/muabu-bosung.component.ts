import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ThongTinQuyetDinh} from "../../../../models/DeXuatKeHoachuaChonNhaThau";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-muabu-bosung',
  templateUrl: './muabu-bosung.component.html',
  styleUrls: ['./muabu-bosung.component.scss']
})
export class MuabuBosungComponent implements OnInit {

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
  constructor(
    private readonly modal: NzModalService,
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

  editItem(id: number): void {
    this.dataEdit[id].edit = true;
  }

  xoaItem(index: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.dataTable.splice(index,1);
      },
    });
  }

  themMoiItem() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.dataTable = [...this.dataTable, this.rowItem]
    this.rowItem = new ThongTinQuyetDinh();
    this.updateEditCache()
    this.emitDataTable()
  }

  clearData() {

  }

  huyEdit(index: number): void {
    this.dataEdit[index] = {
      data: {...this.dataTable[index]},
      edit: false,
    };
  }

  luuEdit(idx: number): void {
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
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
    } else  {
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

  onChangeCloaiVthh(event, typeData?: any ) {
    if (typeData) {
      const cloaiVthh = this.dsChungLoaiHangHoa.filter(item => item.ma == event);
      if (cloaiVthh.length > 0) {
        typeData.tenCloaiVthh = cloaiVthh[0].ten;
      }
    } else  {
      const cloaiVthh = this.dsChungLoaiHangHoa.filter(item => item.ma == event);
      if (cloaiVthh.length > 0) {
        this.rowItem.tenCloaiVthh = cloaiVthh[0].ten;
      }
    }
  }
}
