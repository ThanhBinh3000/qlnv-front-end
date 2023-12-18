import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../../../../../../../services/helper.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { HttpClient } from '@angular/common/http';
import { DanhMucService } from '../../../../../../../../services/danhmuc.service';
import { UserService } from '../../../../../../../../services/user.service';
import { Globals } from '../../../../../../../../shared/globals';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { AMOUNT_NO_DECIMAL, AMOUNT_TWO_DECIMAL } from '../../../../../../../../Utility/utils';

@Component({
  selector: 'app-pop-them-sua-vat-tu-cac-don-vi',
  templateUrl: './pop-them-sua-vat-tu-cac-don-vi.component.html',
  styleUrls: ['./pop-them-sua-vat-tu-cac-don-vi.component.scss']
})
export class PopThemSuaVatTuCacDonViComponent implements OnInit {
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
  amount = AMOUNT_NO_DECIMAL;
  amount2De = AMOUNT_TWO_DECIMAL;

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
      donViTinh: [null],
      soLuong: [null],
      donGia: [null],
      duToan: [null],
    });
  }

  onChangeCloaiVthh(event) {
    const cloaiVthh = this.dataVatTuConShow.find(item => item.maHang == event);
    if (cloaiVthh) {
      this.formItem.patchValue({
        donViTinh: cloaiVthh.donViTinh,
        tenVatTu: cloaiVthh.ten,
        vatTuId: cloaiVthh.id,
      });
    } else {
      this.formItem.patchValue({
        maVatTu: null,
        donViTinh: null,
        tenVatTu: null,
      })
    }
  }

  onCancel() {
    this._modalRef.close();
  }

  handleOk() {
    this.helperService.markFormGroupTouched(this.formItem)
    if (this.formItem.invalid) {
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
        vatTuChaId: vatTuCha.id,
        donViTinh: vatTuCha.donViTinh,
      });
      //remove những vật tư con đã được thêm vào đơn vị (khi bấm thêm chủng loại hàng hóa)
      let uniqueList = [];
      if (type && type == 'them' && !this.isRoot) {
        if (this.itemInput && this.itemInput.dataChild && this.itemInput.dataChild.length > 0) {
          uniqueList = this.itemInput.dataChild.filter(item1 => !dsCloaiHangHoa.some(item2 => item1.maVatTu === item2.maHang));
          uniqueList.push(...dsCloaiHangHoa.filter(item2 => !this.itemInput.dataChild.some(item1 => item1.maVatTu === item2.maHang)));
        } else {
          uniqueList = dsCloaiHangHoa;
        }
        this.dataVatTuConShow = uniqueList;
      }
    } else {
      this.formItem.patchValue({
        maVatTu: null,
        tenVatTu: null,
        vatTuId: null,
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

  calcularTongTienDuToan() {
    if (this.formItem.value.donGia && this.formItem.value.soLuong) {
      this.formItem.patchValue({
        duToan: this.formItem.value.donGia * this.formItem.value.soLuong
      })
    }else{
      this.formItem.patchValue({
        duToan: 0
      });
    }
  }

}
