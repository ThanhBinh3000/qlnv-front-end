import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { MOCK_LIST } from '../dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.constant';
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

  optionsDonViTinh: any[] = [];
  inputDonViTinh: string = '';
  optionsDonViTinhShow: any[] = [];

  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private donViService: DonviService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
  ) {}

  async ngOnInit() {
    this.formData = this.fb.group({
      maDv: [null, [Validators.required]],
      tenDv: [null],
      maHangHoa: [{ value: null, disabled: true }, [Validators.required]],
      tenHangHoa: [null],
      donViTinh: [null],
      soLuongTruoc: [null],
      soLuongGiam: [null],
      soLuongTang: [null],
      soLuongSau: [null],
      tongSo: [null],
      soLuongTheoNam1: [null],
      soLuongTheoNam2: [null],
      soLuongTheoNam3: [null],
    });
    //treeview
    this.listOfMapData.forEach((item) => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
    this.spinner.show();
    try {
      await this.loadDonVi();
      await this.loadDonViTinh();
      this.spinner.hide();
    } catch (err) {
      this.spinner.hide();
    }
  }

  async loadDonViTinh() {
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

  onInputDonViTinh(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsDonViTinhShow = [];
    } else {
      this.optionsDonViTinhShow = this.optionsDonViTinh.filter(
        (x) =>
          x.labelDonViTinh.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
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
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({
            ...node.children[i],
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
      if (data.children) {
        data.children.forEach((d) => {
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
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }
}
