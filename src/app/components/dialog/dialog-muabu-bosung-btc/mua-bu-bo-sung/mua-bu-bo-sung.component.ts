import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ThongTinQuyetDinh} from "../../../../models/DeXuatKeHoachuaChonNhaThau";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-mua-bu-bo-sung',
  templateUrl: './mua-bu-bo-sung.component.html',
  styleUrls: ['./mua-bu-bo-sung.component.scss']
})
export class MuaBuBoSungComponent implements OnInit {

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
    // this.dataTable.push(this.rowItem);
    this.dataTable = [...this.dataTable, this.rowItem]
    this.rowItem = new ThongTinQuyetDinh();
    this.updateEditCache()
    this.emitDataTable()
    console.log(this.dataTable)
  }

  clearData() {

  }

  huyEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.id === id);
    this.dataEdit[id] = {
      data: {...this.dataTable[index]},
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
          data: {...item},
        };
      });
    }
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
  onChangeLoaiVthh123(event, id) {
    this.dsChungLoaiHangHoa = [];
    this.dataEdit[id].data.dviTinh = null;
    const loaiVthh = this.dsHangHoa.filter(item => item.ma == event);
    if (loaiVthh.length > 0) {
      this.dataEdit[id].data.dviTinh = loaiVthh[0].maDviTinh;
      this.dataEdit[id].data.tenVthh = loaiVthh[0].ten;
      this.dsChungLoaiHangHoa = loaiVthh[0].child;
    }
  }

  validate() {
  }
}
