import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  rowItem: ThongTinQuyetDinh = new ThongTinQuyetDinh();
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinQuyetDinh } } = {};
  dsChungLoaiHangHoa = [];
  dsDonViTinh = [];
  dsKeHoachNam = [];

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  tongGtri: number;

  constructor(
    private danhMucService: DanhMucService
  ) { }

  ngOnInit(): void {
  }

  async loadDanhMucHang() {
    await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      console.log(hangHoa);
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        const dataVatTu = hangHoa.data.filter(item => item.ma == "02");
        console.log(dataVatTu);
      }
    })
  }

  initData() {

  }

  editItem(id: number): void {
    this.dataEdit[id].edit = true;
  }

  xoaItem(id: number) { }

  themMoiItem() {
    console.log(this.rowItem);
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new ThongTinQuyetDinh();
    this.updateEditCache()
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
    this.dataTable.forEach((item) => {
      this.dataEdit[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  onChangeLoaiVthh(event) {
    this.dsChungLoaiHangHoa = [];
    this.rowItem.dviTinh = null;
    const loaiVthh = this.dsHangHoa.filter(item => item.ma == event);
    if (loaiVthh.length > 0) {
      console.log(loaiVthh);
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

