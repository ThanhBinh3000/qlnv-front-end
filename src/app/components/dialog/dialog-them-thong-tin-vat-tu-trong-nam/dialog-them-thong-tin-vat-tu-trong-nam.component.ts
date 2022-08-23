import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { VatTu } from './danh-sach-vat-tu-hang-hoa.type';
import * as dayjs from 'dayjs';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'dialog-them-thong-tin-vat-tu-trong-nam',
  templateUrl: './dialog-them-thong-tin-vat-tu-trong-nam.component.html',
  styleUrls: ['./dialog-them-thong-tin-vat-tu-trong-nam.component.scss'],
})
export class DialogThemThongTinVatTuTrongNamComponent implements OnInit {
  formData: FormGroup;
  //treeview
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  options: any[] = [];
  optionsDonVi: any[] = [];
  optionsDVT: any[] = [];
  optionsDonViTinh: any[] = [];
  yearNow: number = 0;
  listDonViTinh: any[] = [];
  donViTinhModel: string;
  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
    private donViService: DonviService,
    private spinner: NgxSpinnerService,
    private danhMucService: DanhMucService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
  ) { }

  async ngOnInit() {
    //treeview
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
    this.formData = this.fb.group({
      id: [null],
      maDonVi: [null, [Validators.required]],
      tenDonVi: [null, [Validators.required]],
      donViId: [null],
      maHangHoa: [null],
      tenHangHoa: [null, [Validators.required]],
      donViTinh: [null, [Validators.required]],
      soLuong: [null],
      tongSo: [null],
      soLuongTheoNam1: [null],
      soLuongTheoNam2: [null],
      soLuongTheoNam3: [null],
      tenVatTuCha: [null],
      vatTuChaId: [null],
      maVatTuCha: [null],
      vatTuId: [null],
      maVatTu: [null],
      vatTu: [null],
    });
    this.spinner.show();
    try {
      this.loadDonVi();
      this.loadDonViTinh();
      this.loadDanhMucHang();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  //modal func
  save() {
    this.setValueDonViTinh();
    this._modalRef.close(this.formData);
  }

  handleCancel() {
    this._modalRef.destroy();
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

  async loadDonVi() {
    try {
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
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.options = [];
    } else {
      this.options = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  selectDonVi(donVi) {
    this.formData.patchValue({
      maDonVi: donVi.maDvi,
      tenDonVi: donVi.tenDvi,
      donViId: donVi.id,
    });
    if (this.formData.get('tenHangHoa').value) {
      this.getTonKhoDauNam();
    }
  }
  getTonKhoDauNam() {
    this.chiTieuKeHoachNamService
      .tonKhoDauNam({
        maDvi: this.formData.get('maDonVi').value,
        maVthhList: [`"${this.formData.get('maVatTuCha').value}"`],
      })
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          res?.data.forEach((tonKho) => {
            switch (tonKho.nam) {
              case (this.yearNow - 1).toString():
                this.formData.patchValue({
                  soLuongTheoNam1: tonKho.slHienThoi,
                });
                break;
              case (this.yearNow - 2).toString():
                this.formData.patchValue({
                  soLuongTheoNam2: tonKho.slHienThoi,
                });
                break;
              case (this.yearNow - 3).toString():
                this.formData.patchValue({
                  soLuongTheoNam3: tonKho.slHienThoi,
                });
                break;
              default:
                break;
            }
          });
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }

  onInputDonViTinh(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsDVT = [];
    } else {
      this.optionsDVT = this.optionsDonViTinh.filter(
        (x) => x.tenDviTinh.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
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

  selectHangHoa(vatTu: any) {
    this.formData.patchValue({
      tenHangHoa: vatTu.ten,
      tenVatTuCha: vatTu?.parent?.ten,
      vatTuChaId: vatTu?.parent?.id,
      maVatTuCha: vatTu?.parent?.ma,
      vatTuId: vatTu.id,
      maVatTu: vatTu.ma,
      vatTu: vatTu,
    });
    if (this.formData.get('tenDonVi').value) {
      this.getTonKhoDauNam();
    }
  }

  calculatorTongVatTu() {
    this.formData.patchValue({
      tongSo:
        +this.formData.get('soLuongTheoNam1').value +
        +this.formData.get('soLuongTheoNam2').value +
        +this.formData.get('soLuongTheoNam3').value,
    });
  }
}
