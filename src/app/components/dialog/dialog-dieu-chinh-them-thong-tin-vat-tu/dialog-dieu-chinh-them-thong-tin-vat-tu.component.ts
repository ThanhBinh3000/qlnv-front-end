import { KeHoachVatTu } from 'src/app/models/KeHoachVatTu';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { VatTu } from '../dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';

@Component({
  selector: 'dialog-dieu-chinh-them-thong-tin-vat-tu',
  templateUrl: './dialog-dieu-chinh-them-thong-tin-vat-tu.component.html',
  styleUrls: ['./dialog-dieu-chinh-them-thong-tin-vat-tu.component.scss'],
})
export class DialogDieuChinhThemThongTinVatTuComponent implements OnInit {
  formData: FormGroup;
  //treeview
  listOfMapData: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  yearNow: number = 0;

  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];
  selectedDonVi: any = {};
  errorDonVi: boolean = false;

  maDv: string = "";
  tenDv: string = "";
  maHangHoa: string = "";
  tenHangHoa: string = "";
  donViTinh: ["Tấn"];
  soLuongTruoc: number = 0;
  soLuongGiam: number = 0;
  soLuongTang: number = 0;
  soLuongSau: number = 0;
  tongSo: number = 0;
  soLuongTheoNam1: number = 0;
  soLuongTheoNam2: number = 0;
  soLuongTheoNam3: number = 0;

  data: any = null;

  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private donViService: DonviService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {
    this.yearNow = dayjs().get('year');
    //treeview
    this.listOfMapData.forEach((item) => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
    this.spinner.show();
    try {
      await this.loadDonVi();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
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

  selectDonVi(donVi) {
    this.errorDonVi = false;
    this.inputDonVi = donVi.tenDvi;
    this.selectedDonVi = donVi;
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
    hashMap: { [key: string]: boolean },
    array: VatTu[],
  ): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  collapse(array: VatTu[], data: VatTu, $event: boolean): void {
    if (!$event) {
      if (data.child) {
        data.child.forEach((d) => {
          const target = array.find((a) => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  handleOk() {
    this.errorDonVi = false;
    if (!this.selectedDonVi || !this.selectedDonVi.maDvi) {
      this.errorDonVi = true;
      return;
    }

    if (!this.data) {
      this.data = new KeHoachVatTu();
    }

    this._modalRef.close(this.data);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
