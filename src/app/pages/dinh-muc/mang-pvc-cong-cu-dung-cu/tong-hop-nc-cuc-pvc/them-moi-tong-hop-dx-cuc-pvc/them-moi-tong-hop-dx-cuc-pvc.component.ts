import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormGroup, Validators } from '@angular/forms';
import { Base2Component } from '../../../../../components/base2/base2.component';
import { chain } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGE } from '../../../../../constants/message';
import dayjs from 'dayjs';
import { STATUS } from '../../../../../constants/status';
import { DxChiCucPvcService } from '../../../../../services/dinh-muc-nhap-xuat-bao-quan/pvc/dx-chi-cuc-pvc.service';
import { saveAs } from 'file-saver';
import {
  PvcDxChiCucCtiet,
} from '../../de-xuat-nc-chi-cuc-pvc/them-moi-dx-chi-cuc-pvc/them-moi-dx-chi-cuc-pvc.component';
import { AMOUNT_ONE_DECIMAL } from '../../../../../Utility/utils';

@Component({
  selector: 'app-them-moi-tong-hop-dx-cuc-pvc',
  templateUrl: './them-moi-tong-hop-dx-cuc-pvc.component.html',
  styleUrls: ['./them-moi-tong-hop-dx-cuc-pvc.component.scss'],
})
export class ThemMoiTongHopDxCucPvcComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() listDxChiCuc: any[] = [];
  isTongHop: boolean = false;
  rowItem: PvcDxChiCucCtiet = new PvcDxChiCucCtiet();
  dataEdit: { [key: string]: { edit: boolean; data: PvcDxChiCucCtiet } } = {};
  formDataTongHop: FormGroup;
  expandSet = new Set<number>();
  amount = AMOUNT_ONE_DECIMAL;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxChiCucService: DxChiCucPvcService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dxChiCucService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      namKeHoach: [dayjs().get('year')],
      trichYeu: [null, Validators.required],
      ngayKy: [null, Validators.required],
      trangThai: ['00'],
      trangThaiTh: [],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      ghiChu: [null],
      lyDoTuChoi: [null],
      soQdGiaoCtieu: [null],
      listQlDinhMucPvcDxCcdcDtl: [null],
    });
    this.formDataTongHop = this.fb.group({
      namKeHoach: [dayjs().get('year'), Validators.required],
      ngayDx: [null],
      listSoCv: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.loadDsDxCc();
      await this.getCtieuKhTc(this.formData.value.namKeHoach);
      if (this.id > 0) {
        await this.detail(this.id);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async tongHop() {
    this.helperService.markFormGroupTouched(this.formDataTongHop);
    if (this.formDataTongHop.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return;
    }
    let body = this.formDataTongHop.value;
    if (!body.listSoCv || body.listSoCv.length == 0) {
      let arr = [];
      if (this.listDxChiCuc && this.listDxChiCuc.length > 0) {
        this.listDxChiCuc.forEach(item => {
          arr.push(item.soCv);
        });
      }
      body.listSoCv = arr.toString();
    } else {
      body.listSoCv = body.listSoCv.toString();
    }
    body.ngayDxTu = body.ngayDx ? body.ngayDx[0] : null;
    body.ngayDxDen = body.ngayDx ? body.ngayDx[1] : null;
    body.trangThai = STATUS.DA_DUYET_CBV;
    body.maDvi =this.userInfo.MA_DVI;
    // body.capDvi =this.userInfo.CAP_DVI;
    body.trangThaiTh = STATUS.CHUA_TONG_HOP;
    let res = await this.dxChiCucService.tongHopDxCc(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let detail = res.data;
      if (detail && detail.listQlDinhMucPvcDxCcdcDtl) {
        this.formData.patchValue({
          namKeHoach: this.formDataTongHop.value.namKeHoach,
        });
        this.dataTable = detail.listQlDinhMucPvcDxCcdcDtl;
        this.dataTable.forEach(item => {
          let arr = detail.listQlDinhMucPvcDxCcdc;
          if (arr && arr.length > 0) {
            arr.forEach(dtl => {
              if (dtl.id == item.dxPvcCcdcId) {
                item.maDvi = dtl.maDvi;
              }
            });
          }
          item.id = null;
          item.ghiChu = null;
          idVirtual: uuidv4();
        });
        this.convertListData();
      }
      this.isTongHop = true;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
  }

  async loadDsDxCc() {
    this.spinner.show();
    try {
      let body = {
        'capDvi': '2',
        'paggingReq': {
          'limit': 10,
          'page': 0,
        },
      };
      let res = await this.dxChiCucService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listDxChiCuc = data.content;
        if (this.listDxChiCuc) {
          this.listDxChiCuc = this.listDxChiCuc.filter(item => item.trangThai == this.STATUS.DA_DUYET_CBV && item.trangThaiTh == STATUS.CHUA_TONG_HOP);
        }
      } else {
        this.listDxChiCuc = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async getCtieuKhTc(event) {
    // let res = await this.dxChiCucService.getCtieuKhTc({
    //   namKeHoach: event,
    // });
    // if (res.data) {
    //   this.formData.patchValue({
    //     soQdGiaoCt: res.data.soQuyetDinh,
    //   });
    // }
  }

  async save() {
    // console.log("dataTable", this.dataTable);
    // return
    this.formData.patchValue({
      namKeHoach: this.formDataTongHop.value.namKeHoach,
    });
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.conVertTreToList();
    this.formData.value.listQlDinhMucPvcDxCcdcDtl = this.dataTable;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    let res = await this.createUpdate(this.formData.value);
    if (res) {
      this.goBack();
    } else {
      this.convertListData();
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.dxChiCucService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.isTongHop = true;
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soCv: this.formData.value.soCv ? this.formData.value.soCv.split('/')[0] : null,
          });
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucPvcDxCcdcDtl;
          this.convertListData();
          this.expandAll();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async pheDuyet() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDTC: {
        trangThai = STATUS.DA_DUYET_LDTC;
        break;
      }
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDTC;
        break;
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?');
  }

  async tuChoi() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDTC: {
        trangThai = STATUS.TU_CHOI_LDTC;
      }
    }
    await this.reject(this.id, trangThai, 'Bạn có chắc chắn muốn từ chối?');
  }

  convertListData() {
    if (this.dataTable?.length > 0) {
      this.dataTable = chain(this.dataTable)
        .groupBy('tenCcdc')
        .map((value, key) => ({
          tenCcdc: key,
          donGia: value[0].donGia,
          moTaCcdc: value?.find(item => item.tenCcdc === key)?.moTaCcdc || "",
          dataChild: value,
          idVirtual: uuidv4(),
        }))
        .value();
    }
    this.expandAll();
  }

  conVertTreToList() {
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push({ ...data, donGia: item.donGia });
        });
      }
    });
    this.dataTable = arr;
  }

  sumSoLuong(column: string, tenCcdc: string, type?) {
    let sl = 0;
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push(data);
        });
      }
    });
    arr = arr.filter(item => item.tenCcdc == tenCcdc);
    if (arr && arr.length > 0) {
      if (!type) {
        const sum = arr.reduce((prev, cur) => {
          prev += cur[column];
          return prev;
        }, 0);
        sl = sum;
      } else {
        const sum = arr.reduce((prev, cur) => {
          prev += cur.soLuong * cur.donGia;
          return prev;
        }, 0);
        sl = sum;
      }
    }
    return sl;
  }

  disableForm() {
    let check = false;
    if (this.isView) {
      check = true;
    } else {
      if (this.id > 0) {
        check = true;
      } else {
        check = false;
      }
    }
    return check;
  }


  expandAll() {
    this.dataTable.forEach(s => {
      this.expandSet.add(s.idVirtual);
    });
  }


  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  protected readonly AMOUNT_ONE_DECIMAL = AMOUNT_ONE_DECIMAL;

  exportDataDetail() {
    if (this.dataTable.length > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.paggingReq = {
          limit: this.pageSize,
          page: this.page - 1
        }
        this.dxChiCucService
          .exportDetail(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-chi-tiet-tong-hop-nhu-cau-mang-pvc-va-ccdc.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  async luuVapheDuyet() {
    this.formData.patchValue({
      namKeHoach: this.formDataTongHop.value.namKeHoach,
    });
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.conVertTreToList();
    this.formData.value.listQlDinhMucPvcDxCcdcDtl = this.dataTable;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    let res = await this.createUpdate(this.formData.value);
    if(res){
      this.formData.patchValue({
        id: res.id
      });
      this.id = res.id;
      this.convertListData();
      this.pheDuyet();
    }
  }
}
