import {Component, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  TongHopPhuongAnGiaService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/tong-hop-phuong-an-gia.service";
import {MESSAGE} from "../../../../../../../constants/message";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {HelperService} from "../../../../../../../services/helper.service";
import {Globals} from "../../../../../../../shared/globals";

@Component({
  selector: 'app-dialog-pag-qd-btc',
  templateUrl: './dialog-pag-qd-btc.component.html',
  styleUrls: ['./dialog-pag-qd-btc.component.scss']
})
export class DialogPagQdBtcComponent implements OnInit {
  type: string;
  pagType : string;
  namKeHoach: any;
  loaiGia: any;
  dataTableToTrinh: any[] = [];
  dataTablleDxCs: any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  formData: FormGroup;
  fb: FormBuilder = new FormBuilder();
  listData : any[] = [];
  dsLoaiGia : any[] = [];
  dataResponse : {
    "data" : any,
    "listDx" : any[],
    "formData" : any,
  }
  constructor(
    private _modalRef: NzModalRef,
    private helperService: HelperService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    public globals: Globals,
    private tongHopPhuongAnGiaService: TongHopPhuongAnGiaService
  ) {
    this.formData = this.fb.group({
      loaiVthh: [null, Validators.required],
      cloaiVthh: [null, Validators.required],
      loaiGia: [null, Validators.required],
      loaiQd: ['00'],
      listDeXuat : [[]]
    });
  }

  ngOnInit(): void {
    this.loadDsToTrinh();
    this.loadDsVthh();
    this.loadDsLoaiGia();
  }

  async loadDsVthh() {
    this.listVthh = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data.filter(item => item.ma != '02');
    }
  }

  async loadDsLoaiGia() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_GIA');
    if (res.msg == MESSAGE.SUCCESS) {
        this.dsLoaiGia = res.data.filter(item =>
          item.ma == 'LG01' || item.ma == 'LG02'
        );
    }
  }

  async onChangeLoaiVthh(event) {
    if (event) {
      let body = {
        "str": event
      };
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
      this.listCloaiVthh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listCloaiVthh = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }


  handleOk(item: any) {
    this.dataResponse = {
      data : item,
      listDx : [],
      formData : this.formData.value
    }
    this._modalRef.close(this.dataResponse);
  }

  luu() {
    if ((this.formData.value.loaiQd == '01' && this.pagType == 'LT') || this.pagType == 'VT' ) {
      this.dataResponse = {
        data : null,
        listDx : this.listData,
        formData : this.formData.value,
      }
      this._modalRef.close(this.dataResponse);
    } else {
      this._modalRef.close();
    }
  }

  onCancel() {
    this._modalRef.close();
  }


  async loadDsToTrinh() {
    this.spinner.show();
    if (this.formData.value.loaiQd == '01' && this.pagType == 'LT') {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
        this.spinner.hide()
        return;
      }
    }
    try {
      let body = {
        namKh: this.namKeHoach,
        type: this.type,
        loaiVthh: this.formData.value.loaiVthh,
        cloaiVthh: this.formData.value.cloaiVthh,
        loaiDeXuat: this.formData.value.loaiQd,
        loaiGia: this.pagType == 'LT' ? this.formData.value.loaiGia : this.loaiGia,
        pagType : this.pagType
      }
      let res = await this.tongHopPhuongAnGiaService.loadToTrinhDeXuat(body);
      if (res.msg = MESSAGE.SUCCESS) {
        if (this.formData.value.loaiQd == '00' && this.pagType == 'LT') {
          this.dataTableToTrinh = res.data;
        } else {
          this.dataTablleDxCs = res.data;
        }
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  updateDataCheckbox(idx : number, data: any, event : any) {
      if (event == true ) {
        this.listData.push(data);
      } else {
        this.listData.splice(idx, 1);
      }
    }
}
