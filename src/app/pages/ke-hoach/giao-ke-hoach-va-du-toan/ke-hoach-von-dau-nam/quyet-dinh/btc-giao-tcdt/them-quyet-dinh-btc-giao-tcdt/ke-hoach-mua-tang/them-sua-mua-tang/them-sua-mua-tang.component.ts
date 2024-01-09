import {Component, Input, OnInit} from '@angular/core';
import {DanhMucService} from "../../../../../../../../../services/danhmuc.service";
import {UserService} from "../../../../../../../../../services/user.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {Globals} from "../../../../../../../../../shared/globals";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {DanhMucKhoService} from "../../../../../../../../../services/danh-muc-kho.service";
import {MESSAGE} from "../../../../../../../../../constants/message";
import {
  DanhMucKho
} from "../../../../../../../../quan-ly-kho-tang/ke-hoach/dm-du-an-cong-trinh/danh-muc-du-an/danh-muc-du-an.component";
import {ThongTinQuyetDinh} from "../../../../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as uuid from "uuid";
import {HelperService} from "../../../../../../../../../services/helper.service";
import {HttpClient} from "@angular/common/http";
import {AMOUNT_NO_DECIMAL, AMOUNT_ONE_DECIMAL, AMOUNT_TWO_DECIMAL} from "../../../../../../../../../Utility/utils";

@Component({
  selector: 'app-them-sua-mua-tang',
  templateUrl: './them-sua-mua-tang.component.html',
  styleUrls: ['./them-sua-mua-tang.component.scss']
})
export class ThemSuaMuaTangComponent implements OnInit {
  @Input()
  itemInput: any = [];
  @Input()
  dataTable: any
  @Input()
  actionType: any = [];
  @Input()
  soLuong: number;
  @Input()
  dsHangHoa = [];
  @Input()
  dsChungLoaiHangHoa = [];
  formItem: FormGroup;
  fb: FormBuilder = new FormBuilder();
  helperService: HelperService
  modal: NzModalService
  amount = AMOUNT_TWO_DECIMAL;
  amount_no_decimal = AMOUNT_NO_DECIMAL;

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
    if (this.actionType == 'them') {
      let slDaThem = 0;
      if (this.dataTable && this.dataTable.length > 0) {
        slDaThem = this.dataTable.reduce((accumulator, object) => {
          return accumulator + object.soLuongDuToan ? object.soLuongDuToan : object.soLuong;
        }, 0);
      }
      this.formItem.patchValue({
        tenVthh: this.itemInput.tenVthh,
        soLuong: this.soLuong - slDaThem,
      })
      this.onChangeLoaiVthh(this.formItem.value.tenVthh, 'them');
    } else {
      this.formItem.patchValue(this.itemInput);
      this.onChangeLoaiVthh(this.formItem.value.tenVthh, 'sua');
    }
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
      donGia: [null],
      tongTien: [null, Validators.required],
      soLuongDuToan: [null],
    });
  }

  async onChangeLoaiVthh(event, type?) {
    this.dsChungLoaiHangHoa = [];
    const loaiVthh = this.dsHangHoa.find(item => item.ten == event);
    if (loaiVthh) {
      this.formItem.patchValue({
        dviTinh: loaiVthh.maDviTinh,
        tenVthh: loaiVthh.ten,
        loaiVthh: loaiVthh.key,
        soLuongDuToan : this.soLuong
      })
      let dsCloaiHangHoa = loaiVthh.child;
      this.dsChungLoaiHangHoa = dsCloaiHangHoa;
      //Loại những chủng loại đã được thêm cho item bố
      let uniqueList = [];
      if (type && type == 'them') {
        if (this.itemInput && this.itemInput.dataChild && this.itemInput.dataChild.length > 0) {
          uniqueList = this.itemInput.dataChild.filter(item1 => !dsCloaiHangHoa.some(item2 => item1.cloaiVthh === item2.key));
          uniqueList.push(...dsCloaiHangHoa.filter(item2 => !this.itemInput.dataChild.some(item1 => item1.cloaiVthh === item2.key)));
        } else {
          uniqueList = dsCloaiHangHoa;
        }
        this.dsChungLoaiHangHoa = uniqueList;
      }
    }
  }

  onChangeCloaiVthh(event) {
    const cloaiVthh = this.dsChungLoaiHangHoa.find(item => item.ma == event);
    if (cloaiVthh) {
      this.formItem.patchValue({
        tenCloaiVthh: cloaiVthh.ten
      })
    } else {
      this.formItem.patchValue({
        tenCloaiVthh: null
      })
    }
  }

  onCancel() {
    this._modalRef.close();
  }

  calcularTongTienDuToan() {
    if (this.formItem.value.donGia && this.formItem.value.soLuongDuToan) {
      this.formItem.patchValue({
        tongTien: this.formItem.value.donGia * this.formItem.value.soLuongDuToan
      })
    }
  }

  handleOk() {
    if (this.actionType == 'them') {
      this.formItem.controls['cloaiVthh'].setValidators([Validators.required]);
      this.formItem.controls['tenCloaiVthh'].setValidators([Validators.required])
      this.formItem.patchValue({
        soLuong: this.formItem.value.soLuongDuToan
      })
    } else {
      if (this.itemInput && !this.itemInput.dataChild && !this.itemInput.cloaiVthh) {
        this.formItem.controls['cloaiVthh'].setValidators(null);
        this.formItem.controls['tenCloaiVthh'].setValidators(null)
      }
    }
    this.helperService.markFormGroupTouched(this.formItem)
    if (this.formItem.invalid) {
      return;
    }
    let toatlSlDuToan = (this.dataTable.reduce((accumulator, object) => {
      return accumulator + object.soLuongDuToan ? object.soLuongDuToan : 0;
    }, 0));
    if (toatlSlDuToan > this.soLuong) {
      this.notification.error(MESSAGE.ERROR, "Tổng số lượng dự toán cho loại hàng hóa này vượt quá số lượng TTCP giao");
      return;
    }
    this._modalRef.close(this.formItem.value);
    this.formItem.reset();
  }


  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maDuAn == item.maDuAn) {
          rs = true;
          return;
        }
      });
    }
    return rs;
  }
}
