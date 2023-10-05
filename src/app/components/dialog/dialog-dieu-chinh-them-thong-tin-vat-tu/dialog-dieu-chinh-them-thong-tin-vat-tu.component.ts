import { KeHoachVatTu, VatTuThietBi } from 'src/app/models/KeHoachVatTu';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { VatTu } from '../dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuyetDinhDieuChinhChiTieuKeHoachNamService } from 'src/app/services/quyetDinhDieuChinhChiTieuKeHoachNam.service';

@Component({
  selector: 'dialog-dieu-chinh-them-thong-tin-vat-tu',
  templateUrl: './dialog-dieu-chinh-them-thong-tin-vat-tu.component.html',
  styleUrls: ['./dialog-dieu-chinh-them-thong-tin-vat-tu.component.scss'],
})
export class DialogDieuChinhThemThongTinVatTuComponent implements OnInit {
  formData: FormGroup;
  //treeview
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  yearNow: number = 0;

  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];
  selectedDonVi: any = {};
  errorDonVi: boolean = false;
  donViTinhModel: string;

  maDv: string = "";
  tenDv: string = "";
  maHangHoa: string = "";
  tenHangHoa: string = "";
  selectedHangHoa: any = {};
  errorMaHangHoa: boolean = false;

  optionsDVT: any[] = [];
  optionsDonViTinh: any[] = [];
  listDonViTinh: any[] = [];

  donViTinh: string = "";
  soLuongTruoc: number = 0;
  soLuongGiam: number = 0;
  soLuongTang: number = 0;
  soLuongSau: number = 0;
  tongSo: number = 0;
  soLuongTheoNam1: number = 0;
  soLuongTheoNam2: number = 0;
  soLuongTheoNam3: number = 0;

  thocIdDefault: number = 2;
  gaoIdDefault: number = 6;
  muoiIdDefault: number = 78;

  data: any = null;
  qdGocId: number = 0;

  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private quyetDinhDieuChinhChiTieuKeHoachNamService: QuyetDinhDieuChinhChiTieuKeHoachNamService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {
    this.yearNow = dayjs().get('year');
    this.listDonViTinh.push({
      value: 'bộ',
      text: 'bộ',
    });
    this.listDonViTinh.push({
      value: 'chiếc',
      text: 'chiếc',
    });
    this.listDonViTinh.push({
      value: 'máy',
      text: 'máy',
    });
    this.spinner.show();
    try {
      await this.loadDonVi();
      this.loadDonViTinh();
      this.loadDanhMucHang();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  loadDanhMucHang() {
    this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        this.listOfMapData = hangHoa.data;
        this.listOfMapDataClone = [...this.listOfMapData];
        this.listOfMapData.forEach((item) => {
          this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
        });
      }
    });
  }

  async loadDonViTinh() {
    try {
      const res = await this.donViService.loadDonViTinh();
      this.optionsDonViTinh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonViTinh: res.data[i].tenDviTinh,
          };
          this.optionsDonViTinh.push(item);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  selectDonViTinh(donViTinh) {
    this.donViTinhModel = donViTinh;
  }

  setValueDonViTinh() {
    this.formData.patchValue({
      donViTinh: this.donViTinhModel,
    });
  }

  async loadDonVi() {
    const res = await this.donViService.layTatCaDonVi();
    this.optionsDonVi = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          ...res.data[i],
          labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
        };
        this.optionsDonVi.push(item);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  onInputDonVi(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsDonViShow = [];
    } else {
      this.optionsDonViShow = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async selectDonVi(donVi) {
    this.errorDonVi = false;
    this.inputDonVi = donVi.tenDvi;
    this.selectedDonVi = donVi;
    if (this.selectedHangHoa && this.selectedHangHoa.ma) {
      await this.getSoLuongTruocDieuChinh();
    }
  }

  //treeview func
  convertTreeToList(root: VatTu): VatTu[] {
    const stack: VatTu[] = [];
    const array: VatTu[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });
    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.child) {
        for (let i = node.child.length - 1; i >= 0; i--) {
          stack.push({
            ...node.child[i],
            level: node.level! + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }
    return array;
  }

  visitNode(
    node: VatTu,
    hashMap: { [id: string]: boolean },
    array: VatTu[],
  ): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  collapse(array: VatTu[], data: VatTu, $event: boolean): void {
    if (!$event) {
      if (data.child) {
        data.child.forEach((d) => {
          const target = array.find((a) => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  search(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.listOfMapData = this.listOfMapDataClone;
    } else {
      this.listOfMapData = this.listOfMapDataClone.filter(
        (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async selectHangHoa(vatTu: any) {
    this.errorMaHangHoa = false;
    this.selectedHangHoa = vatTu;
    this.maHangHoa = vatTu.ma;
    this.tenHangHoa = vatTu.ten;
    if (this.selectedDonVi && this.selectedDonVi.maDvi) {
      await this.getSoLuongTruocDieuChinh();
    }
  }

  loadChiTiet() {
    this.isEdit = false;
    if (this.data) {
      this.isEdit = true;

    }
  }

  async getSoLuongTruocDieuChinh() {
    this.spinner.show();
    try {
      let body = {
        "donViId": this.selectedDonVi.id,
        "ctkhnId": this.qdGocId,
        "vatTuIds": [this.selectedHangHoa.id]
      }
      let data = await this.quyetDinhDieuChinhChiTieuKeHoachNamService.soLuongTruocDieuChinh(body);
      if (data && data.msg == MESSAGE.SUCCESS) {
        if (data.data && data.data.keHoachVatTuNamTruoc && data.data.keHoachVatTuNamTruoc.length > 0) {
          data.data.keHoachVatTuNamTruoc.forEach((tonKho) => {
            switch (tonKho.nam) {
              case (this.yearNow - 1):
                this.soLuongTheoNam3 = tonKho.soLuong;
                break;
              case (this.yearNow - 2):
                this.soLuongTheoNam2 = tonKho.soLuong;
                break;
              case (this.yearNow - 3):
                this.soLuongTheoNam1 = tonKho.soLuong;
                break;
              default:
                break;
            }
          });
        }
        if (data.data && data.data.nhapTrongNam && data.data.nhapTrongNam.length > 0) {
          data.data.nhapTrongNam.forEach((tonKho) => {
            this.soLuongTruoc = tonKho.soLuong;
          });
        }
      }
      else {
        this.notification.error(MESSAGE.ERROR, data.msg);
      }
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  handleOk() {
    this.errorDonVi = false;
    this.errorMaHangHoa = false;
    if (!this.selectedDonVi || !this.selectedDonVi.maDvi) {
      this.errorDonVi = true;
    }
    if (!this.selectedHangHoa || !this.selectedHangHoa.ma) {
      this.errorMaHangHoa = true;
    }
    if (this.errorDonVi || this.errorMaHangHoa) {
      return;
    }

    if (!this.data) {
      this.data = new KeHoachVatTu();
    }
    let nhapTrongNam = (this.soLuongTruoc ?? 0) + (this.soLuongTang ?? 0) - (this.soLuongGiam ?? 0);

    this.data.tenDonVi = this.selectedDonVi.tenDvi;
    this.data.maDonVi = this.selectedDonVi.maDvi;
    this.data.donViId = this.selectedDonVi.donViId ?? this.selectedDonVi.id;
    this.data.donViTinh = this.donViTinhModel;

    this.data.vatTuThietBi = [];
    let cacNam = [
      {
        id: null,
        nam: this.yearNow - 3,
        soLuong: (this.soLuongTheoNam1 ?? 0),
        vatTuId: this.selectedHangHoa.id,
      },
      {
        id: null,
        nam: this.yearNow - 2,
        soLuong: (this.soLuongTheoNam2 ?? 0),
        vatTuId: this.selectedHangHoa.id,
      },
      {
        id: null,
        nam: this.yearNow - 1,
        soLuong: (this.soLuongTheoNam3 ?? 0),
        vatTuId: this.selectedHangHoa.id,
      },
    ];
    let temp = [];
    temp = this.getListVatTuThietBi(this.selectedHangHoa, temp);
    if (temp && temp.length > 0) {
      for (let i = 0; i < temp.length; i++) {
        let vatTuThietBi1 = new VatTuThietBi();
        vatTuThietBi1.cacNamTruoc = cacNam;
        vatTuThietBi1.donViTinh = this.donViTinhModel;
        vatTuThietBi1.maVatTu = temp[i].maVatTu;
        vatTuThietBi1.maVatTuCha = temp[i].maVatTuCha;
        vatTuThietBi1.nhapTrongNam = nhapTrongNam;
        vatTuThietBi1.stt = 1;
        vatTuThietBi1.tenVatTu = temp[i].tenVatTu;
        vatTuThietBi1.tenVatTuCha = temp[i].tenVatTuCha;
        vatTuThietBi1.tongCacNamTruoc = (this.soLuongTheoNam1 ?? 0) + (this.soLuongTheoNam2 ?? 0) + (this.soLuongTheoNam3 ?? 0);
        vatTuThietBi1.tongNhap = nhapTrongNam + vatTuThietBi1.tongCacNamTruoc;
        vatTuThietBi1.vatTuChaId = +temp[i].vatTuChaId;
        vatTuThietBi1.vatTuId = +temp[i].vatTuId;
        this.data.vatTuThietBi.push(vatTuThietBi1);
      }
    }

    this._modalRef.close(this.data);
  }

  getListVatTuThietBi(dataCon: any, dataReturn: any) {
    if (!dataReturn) {
      dataReturn = [];
    }
    if (dataCon) {
      let item = {
        maVatTu: dataCon.ma,
        maVatTuCha: null,
        vatTuId: dataCon.id,
        vatTuChaId: null,
        tenVatTu: dataCon.ten,
        tenVatTuCha: null,
      };
      if (dataCon.parent) {
        item.maVatTuCha = dataCon.parent.ma;
        item.vatTuChaId = dataCon.parent.id;
        item.tenVatTuCha = dataCon.parent.ten;
        dataReturn.push(item);
        this.getListVatTuThietBi(dataCon.parent, dataReturn);
      } else {
        dataReturn.push(item);
      }
    }
    return dataReturn;
  }

  handleCancel() {
    this._modalRef.close();
  }
}
