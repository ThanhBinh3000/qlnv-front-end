import {Component, Input, OnInit} from '@angular/core';
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
  @Input()type: string;
  @Input() pagType: string;
  @Input() namKeHoach: any;
  loaiGia: any;
  dataTableToTrinh: any[] = [];
  dataTableToTrinhView: any[] = [];
  dataTableDxVt: any[] = [];
  dataTableDxCsVt: any[] = [];
  dataTableDxVtView: any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  formData: FormGroup;
  fb: FormBuilder = new FormBuilder();
  listData: any[] = [];
  dsLoaiGia: any[] = [];
  dataResponse: {
    "data": any,
    "listDx": any[],
    "formData": any,
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
      listDeXuat: [[]]
    });
  }

  ngOnInit(): void {
    if (this.pagType && this.pagType == 'LT') {
      this.loadDsToTrinh();
    } else {
      this.loadDsDxPagVT();
    }
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
      data: item,
      listDx: [],
      formData: this.formData.value
    }
    this._modalRef.close(this.dataResponse);
  }

  luu() {
    if (this.pagType == 'VT') {
      this.dataResponse = {
        data: null,
        listDx: this.listData,
        formData: this.formData.value,
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
    try {
      let body = {
        namKh: this.namKeHoach,
        type: this.type,
        loaiVthh: this.formData.value.loaiVthh,
        cloaiVthh: this.formData.value.cloaiVthh,
        loaiDeXuat: this.pagType == 'LT' ? '00' : this.formData.value.loaiQd,
        loaiGia: this.pagType == 'LT' ? this.formData.value.loaiGia : this.loaiGia,
        pagType: this.pagType
      }
      let res = await this.tongHopPhuongAnGiaService.loadToTrinhDeXuat(body);
      if (res.msg = MESSAGE.SUCCESS) {
        this.dataTableToTrinh = res.data;
        this.dataTableToTrinhView = this.dataTableToTrinh.filter(item => item.kieuTongHop == this.formData.value.loaiQd);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async loadDsDxPagVT() {
    this.spinner.show();
    try {
      let body = {
        namKh: this.namKeHoach,
        type: this.type,
        pagType: this.pagType,
        loaiVthh: this.formData.value.loaiVthh,
        cloaiVthh: this.formData.value.cloaiVthh,
        loaiGia: this.loaiGia,
        loaiDeXuat : "00"
      }
      let res = await this.tongHopPhuongAnGiaService.loadToTrinhDeXuat(body);
      if (res.msg = MESSAGE.SUCCESS) {
        this.dataTableDxCsVt  =res.data;
        if (this.dataTableDxCsVt && this.dataTableDxCsVt.length > 0) {
          this.dataTableDxVtView = this.dataTableDxCsVt.filter(item => item.lanDeXuat == 1);
        }
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

    updateDataCheckbox(idx: number, data: any, event: any) {
    if (event == true) {
      this.listData.push(data);
    } else {
      this.listData.splice(idx, 1);
    }
  }

  changLoaiQd(event) {
    if (event && this.pagType == 'LT') {
      this.dataTableToTrinhView = this.dataTableToTrinh.filter(item => item.kieuTongHop == event);
    }
    if (event && this.pagType == 'VT') {
      if (event == '00') {
        this.dataTableDxVtView =this.dataTableDxCsVt.filter(item => item.lanDeXuat == 1);
      } else {
        this.dataTableDxVtView =this.dataTableDxCsVt.filter(item => item.lanDeXuat > 1);
      }
    }
  }
}
