import { DonviService } from 'src/app/services/donvi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { VatTu } from './danh-sach-vat-tu-hang-hoa.type';
import * as dayjs from 'dayjs';
import { DanhMucService } from 'src/app/services/danhMuc.service';

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
  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
    private donViService: DonviService,
    private spinner: NgxSpinnerService,
    private danhMucService: DanhMucService,
  ) { }

  async ngOnInit() {
    this.yearNow = dayjs().get('year');
    //treeview

    this.formData = this.fb.group({
      maDonVi: [null, [Validators.required]],
      tenDonVi: [null],
      donViId: [null],
      maHangHoa: [null, [Validators.required]],
      tenHangHoa: [null],
      donViTinh: [null],
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
    });
    this.spinner.show();
    try {
      this.loadDonVi();
      this.loadDonViTinh();
      this.loadDanhMucHang();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  //modal func
  save() {
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
      console.log('error: ', e)
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
      console.log('error: ', e)
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
    this.formData.patchValue({
      donViTinh: donViTinh.tenDviTinh,
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
      tenVatTuCha: vatTu.parent.ten,
      vatTuChaId: vatTu.parent.id,
      maVatTuCha: vatTu.parent.ma,
      vatTuId: vatTu.id,
      maVatTu: vatTu.ma,
    });
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
