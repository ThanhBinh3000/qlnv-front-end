import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';

@Component({
  selector: 'app-them-hang-thuoc-dien-tieu-huy',
  templateUrl: './them-hang-thuoc-dien-tieu-huy.component.html',
  styleUrls: ['./them-hang-thuoc-dien-tieu-huy.component.scss'],
})
export class ThemHangThuocDienTieuHuyComponent implements OnInit {
  formData: FormGroup;
  dataTable: IHangTieuHuy[];
  rowItem: IHangTieuHuy;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dataEdit: { [key: string]: { edit: boolean; data: IHangTieuHuy } } = {};
  @Output('close') onClose = new EventEmitter<any>();

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.formData = this.fb.group({
      idDonVi: [null],
      tenDonVi: [null],
      idDanhSach: [null],
      ngayTao: [new Date()],
    });
  }

  huy() {
    this.onClose.emit();
  }

  exportData() {}

  inDanhSach() {}

  luu() {}

  xoaItem(id: number) {}

  themMoiItem() {}

  clearData() {}

  changePageIndex(event) {}

  changePageSize(event) {}

  editItem(id: number): void {
    this.dataEdit[id].edit = true;
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
}

interface IDanhSachHangTieuHuy {
  id: number;
  maDanhSach: string;
  idDonVi: number;
  tenDonVi: string;
  ngayTao: Date;
  trangThai: string;
  danhSachHang: IHangTieuHuy[];
}

interface IHangTieuHuy {
  id: number;
  idLoaiHangHoa: number;
  loaiHangHoa: string;
  idHangHoa: number;
  tenHangHoa: string;
  idDiemKho: number;
  tenDiemKho: string;
  idNhaKho: number;
  tenNhaKho: string;
  idNganLo: number;
  tenNganLo: string;
  soLuongTon: number;
  soLuongThanhLy: number;
  donVi: string;
  lyDo: string;
}
