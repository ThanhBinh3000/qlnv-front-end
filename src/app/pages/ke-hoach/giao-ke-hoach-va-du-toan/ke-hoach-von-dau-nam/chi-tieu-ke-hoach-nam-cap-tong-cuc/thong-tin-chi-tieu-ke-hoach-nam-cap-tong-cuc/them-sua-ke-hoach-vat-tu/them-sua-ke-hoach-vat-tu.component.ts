import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {UserService} from "../../../../../../../services/user.service";
import {Globals} from "../../../../../../../shared/globals";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {chain, cloneDeep} from 'lodash';
import * as dayjs from "dayjs";
import {HelperService} from "../../../../../../../services/helper.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AMOUNT_NO_DECIMAL, AMOUNT_ONE_DECIMAL} from "../../../../../../../Utility/utils";
import {MESSAGE} from "../../../../../../../constants/message";
import {CurrencyMaskInputMode} from "ngx-currency";

@Component({
  selector: 'app-them-sua-ke-hoach-vat-tu',
  templateUrl: './them-sua-ke-hoach-vat-tu.component.html',
  styleUrls: ['./them-sua-ke-hoach-vat-tu.component.scss']
})
export class ThemSuaKeHoachVatTuComponent implements OnInit {
  @Input()
  itemInput: any = [];
  @Input()
  dataVatTuChaShow = [];
  @Input()
  dataVatTuCha = [];
  @Input()
  dataVatTuConClone = [];
  @Input()
  dataVatTuCon = [];
  @Input()
  actionType: string;
  @Input()
  tab: string;
  @Input()
  donViId: number;
  @Input()
  isRoot: boolean;
  dataVatTuConShow = [];
  dsNam: any[] = [];

  formItem: FormGroup;
  fb: FormBuilder = new FormBuilder();
  helperService: HelperService
  modal: NzModalService
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 0,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  };

  constructor(httpClient: HttpClient,
              modal: NzModalService,
              private danhMucService: DanhMucService,
              private userService: UserService,
              private _modalRef: NzModalRef,
              public globals: Globals,
              private notification: NzNotificationService,
              private spinner: NgxSpinnerService) {
    this.notification = notification
    this.spinner = spinner;
    this.modal = modal
    this.helperService = new HelperService(httpClient, notification);
  }

  ngOnInit(): void {
    this.initFormDataDetail();
    this.loadDsNam();
    this.formItem.patchValue(this.itemInput);
    if (this.donViId) {
      this.formItem.patchValue({
        donViId: this.donViId
      })
    }
    if (this.actionType == 'them') {
      //remove những vật tư cha đã được thêm vào đơn vị (khi thêm nút gốc)
      if (this.isRoot) {
        let uniqueList = [];
        let dsHangHoa = this.dataVatTuChaShow;
        if (this.itemInput && this.itemInput.dataChild && this.itemInput.dataChild.length > 0) {
          uniqueList = this.itemInput.dataChild.filter(item1 => !dsHangHoa.some(item2 => item1.maVatTuCha === item2.maHang));
          uniqueList.push(...dsHangHoa.filter(item2 => !this.itemInput.dataChild.some(item1 => item1.maVatTuCha === item2.maHang)));
        } else {
          uniqueList = dsHangHoa;
        }
        this.dataVatTuChaShow = uniqueList;
      }
      this.onChangeLoaiVthh(this.formItem.value.maVatTuCha, 'them');
      if (this.tab == 'XUAT') {
        this.onChangeCloaiVthh(this.formItem.value.maVatTu);
      }
    } else {
      this.onChangeLoaiVthh(this.formItem.value.maVatTuCha, 'sua');
    }
  }

  initFormDataDetail() {
    this.formItem = this.fb.group({
      id: [null],
      donViId: [null, Validators.required],
      maDvi: [null, Validators.required],
      tenDvi: [null, Validators.required],
      maVatTuCha: [null, Validators.required],
      tenVatTuCha: [null, Validators.required],
      vatTuId: [null],
      maVatTu: [null],
      vatTuChaId: [null],
      tenVatTu: [null],
      maHang: [null, Validators.required],
      kyHieu: [null],
      donViTinh: [null],
      soLuongChuyenSang: [null],
      soLuongNhap: [null],
      soLuongXuat: [null],
      namNhap: [null],
    });
  }

  onChangeCloaiVthh(event) {
    const cloaiVthh = this.dataVatTuConShow.find(item => item.maHang == event);
    if (cloaiVthh) {
      this.formItem.patchValue({
        donViTinh: cloaiVthh.donViTinh,
        tenVatTu: cloaiVthh.ten,
        kyHieu: cloaiVthh.kyHieu,
        vatTuId: cloaiVthh.id,
        maHang: cloaiVthh.id,
      });
    } else {
      this.formItem.patchValue({
        maVatTu: null,
        donViTinh: null,
        tenVatTu: null,
        kyHieu: null,
      })
    }
  }

  onCancel() {
    this._modalRef.close();
  }

  handleOk() {
    if (this.tab == 'XUAT') {
      this.formItem.controls["namNhap"].setValidators([Validators.required]);
      this.formItem.controls["soLuongXuat"].setValidators([Validators.required]);
    }
    if (this.tab == 'NHAP') {
      // this.formItem.controls["soLuongNhap"].setValidators([Validators.required]);
    }
    this.helperService.markFormGroupTouched(this.formItem)
    if (this.formItem.invalid) {
      return;
    }
    if (this.tab == 'XUAT' && this.formItem.value.namNhap >= dayjs().get('year')) {
      this.notification.warning(MESSAGE.WARNING, 'Năm nhập của vật tư xuất đi phải nhỏ hơn năm hiện tại.')
      return;
    }
    this._modalRef.close(this.formItem.value);
  }

  async onChangeLoaiVthh(event, type?) {
    let vatTuCha = this.dataVatTuChaShow.find(item => item.maHang == event);
    this.dataVatTuConShow = [];
    if (vatTuCha) {
      let dsCloaiHangHoa = vatTuCha.child;
      this.dataVatTuConShow = dsCloaiHangHoa;
      this.formItem.patchValue({
        tenVatTuCha: vatTuCha.ten,
        kyHieu: vatTuCha.kyHieu,
        vatTuChaId: vatTuCha.id,
        maHang: vatTuCha.id,
        donViTinh: vatTuCha.donViTinh,
      });
      //remove những vật tư con đã được thêm vào đơn vị (khi bấm thêm chủng loại hàng hóa)
      let uniqueList = [];
      if (type && type == 'them' && !this.isRoot && this.tab == 'NHAP') {
        if (this.itemInput && this.itemInput.dataChild && this.itemInput.dataChild.length > 0) {
          uniqueList = this.itemInput.dataChild.filter(item1 => !dsCloaiHangHoa.some(item2 => item1.maVatTu === item2.maHang));
          uniqueList.push(...dsCloaiHangHoa.filter(item2 => !this.itemInput.dataChild.some(item1 => item1.maVatTu === item2.maHang)));
        } else {
          uniqueList = dsCloaiHangHoa;
        }
        this.dataVatTuConShow = uniqueList;
      }
      // if (type && type == 'them' && !this.isRoot && this.tab == 'XUAT' && this.itemInput.maVatTuCha) {
      //   if (this.itemInput && this.itemInput.dataChild && this.itemInput.dataChild.length > 0) {
      //     uniqueList = this.itemInput.dataChild.filter(item1 => !dsCloaiHangHoa.some(item2 => item1.maVatTu === item2.maHang));
      //     uniqueList.push(...dsCloaiHangHoa.filter(item2 => !this.itemInput.dataChild.some(item1 => item1.maVatTu === item2.maHang)));
      //   } else {
      //     uniqueList = dsCloaiHangHoa;
      //   }
      //   this.dataVatTuConShow = uniqueList;
      // }
    } else {
      this.formItem.patchValue({
        maVatTu: null,
        tenVatTu: null,
        kyHieu: null,
        vatTuId: null,
        maHang: null,
        donViTinh: null
      });
    }
  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = (thisYear - 10); i < thisYear; i++) {
      this.dsNam.push({
        value: i,
        text: i,
      });
    }
  }
}
