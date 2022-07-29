import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { ThongTinQuyetDinh } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'app-ke-hoach-mua-tang',
  templateUrl: './ke-hoach-mua-tang.component.html',
  styleUrls: ['./ke-hoach-mua-tang.component.scss'],
})
export class KeHoachMuaTangComponent implements OnInit {
  @Input()
  dataTable = [];
  @Output()
  dataTableChange = new EventEmitter<any[]>();

  rowItem: ThongTinQuyetDinh = new ThongTinQuyetDinh();

  dsChungLoaiHangHoa = [];
  dsHangHoa = [];
  dsDonViTinh = [];
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinQuyetDinh } } = {};
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  allChecked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  constructor(
    private danhMucService: DanhMucService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.initData();
    this.loadDanhMucHang();
  }

  initData() {
    this.updateEditCache();
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
    this.emitDataTable();
    this.updateEditCache();
  }


  emitDataTable() {
    console.log(this.dataTable);
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

  luuEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.id === id);
    Object.assign(this.dataTable[index], this.dataEdit[id].data);
    this.dataEdit[id].edit = false;
  }

  updateEditCache(): void {
    this.dataTable.forEach((item) => {
      this.dataEdit[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  calcTong() {
    const sum = this.dataTable.reduce((prev, cur) => {
      prev += cur.duToan;
      return prev;
    }, 0);
    return sum;
  }

  async loadDanhMucHang() {
    await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        const dataVatTu = hangHoa.data.filter(item => item.ma == "02");
        this.dsHangHoa = dataVatTu[0].child;
      }
    })
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
