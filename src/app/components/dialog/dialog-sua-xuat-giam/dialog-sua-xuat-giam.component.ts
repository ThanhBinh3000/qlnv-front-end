import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HelperService} from "../../../services/helper.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {HttpClient} from "@angular/common/http";
import {DanhMucService} from "../../../services/danhmuc.service";
import {UserService} from "../../../services/user.service";
import {Globals} from "../../../shared/globals";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {AMOUNT_ONE_DECIMAL} from "../../../Utility/utils";

@Component({
  selector: 'app-dialog-sua-xuat-giam',
  templateUrl: './dialog-sua-xuat-giam.component.html',
  styleUrls: ['./dialog-sua-xuat-giam.component.scss']
})
export class DialogSuaXuatGiamComponent implements OnInit {
  formItem: FormGroup;
  fb: FormBuilder = new FormBuilder();
  helperService: HelperService
  modal: NzModalService
  @Input()
  dsHangHoa = [];
  @Input()
  itemInput = [];
  @Input()
  dsChungLoaiHangHoa = [];
  amount = AMOUNT_ONE_DECIMAL;

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
    this.helperService = new HelperService(httpClient,this.userService, this.notification);
  }

  ngOnInit(): void {
    this.initFormDataDetail();
    this.formItem.patchValue(this.itemInput);
  }

  initFormDataDetail() {
    this.formItem = this.fb.group({
      id: [null],
      loaiVthh: [null, Validators.required],
      tenVthh: [null, Validators.required],
      cloaiVthh: [null],
      tenCloaiVthh: [null],
      dviTinh: [null],
      soLuong: [null],
    });
  }

  onChangeCloaiVthh(event, typeData?: any) {
    if (typeData) {
      const cloaiVthh = this.dsChungLoaiHangHoa.find(item => item.ma == event);
      if (cloaiVthh) {
        typeData.tenCloaiVthh = cloaiVthh.ten;
        typeData.dviTinh = cloaiVthh.maDviTinh;
      }
    } else {
      const cloaiVthh = this.dsChungLoaiHangHoa.find(item => item.ma == event);
      if (cloaiVthh) {
        this.formItem.patchValue({
          tenCloaiVthh: cloaiVthh.ten,
          dviTinh: cloaiVthh.maDviTinh
        });
      }
    }
  }

  onChangeLoaiVthh(event, typeData?: any) {
    this.dsChungLoaiHangHoa = [];
    this.formItem.patchValue({
      cloaiVthh: null,
      dviTinh: null
    });
    const loaiVthh = this.dsHangHoa.find(item => item.ma == event);
    if (loaiVthh) {
      this.formItem.patchValue({
        tenVthh: loaiVthh.ten,
        dviTinh: loaiVthh.maDviTinh
      });
      this.dsChungLoaiHangHoa = loaiVthh.child;
    }
  }

  onCancel() {
    this._modalRef.close();
  }

  handleOk() {
    this._modalRef.close(this.formItem.value);
    this.formItem.reset();
  }
}
