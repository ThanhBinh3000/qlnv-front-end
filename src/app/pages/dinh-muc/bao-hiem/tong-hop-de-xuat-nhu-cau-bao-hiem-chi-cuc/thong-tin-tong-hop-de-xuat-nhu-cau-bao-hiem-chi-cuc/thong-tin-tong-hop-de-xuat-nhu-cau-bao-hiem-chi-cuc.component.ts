import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {FormGroup, Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {chain} from 'lodash';
import * as uuid from "uuid";
import {MESSAGE} from "../../../../../constants/message";
import dayjs from "dayjs";
import {STATUS} from "../../../../../constants/status";
import {
  DeXuatNhuCauBaoHiemService
} from "../../../../../services/dinhmuc-maymoc-baohiem/de-xuat-nhu-cau-bao-hiem.service";
import {
  BaoHiemKhoDangChuaHang
} from "../../de-xuat-hop-dong-chi-cuc/them-moi-de-xuat-bao-hiem-cc/them-moi-de-xuat-bao-hiem-cc.component";
@Component({
  selector: 'app-thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-chi-cuc',
  templateUrl: './thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-chi-cuc.component.html',
  styleUrls: ['./thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-chi-cuc.component.scss']
})
export class ThongTinTongHopDeXuatNhuCauBaoHiemChiCucComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  listDxChiCuc: any[] = [];
  isTongHop: boolean = false;
  rowItem: BaoHiemKhoDangChuaHang = new BaoHiemKhoDangChuaHang();
  dataEdit: { [key: string]: { edit: boolean; data: BaoHiemKhoDangChuaHang } } = {};
  formDataTongHop: FormGroup
  expandSet = new Set<number>();
  maCv: string;
  tableHangDtqgView: any[] = [];
  tableHangDtqgReq: any[] = [];
  tableGtriBHiem: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private deXuatBaoHiemSv: DeXuatNhuCauBaoHiemService
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatBaoHiemSv)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      namKeHoach: [dayjs().get('year')],
      soCv: [null, Validators.required],
      trichYeu: [null, Validators.required],
      ngayKy: [null, Validators.required],
      trangThai: ['00'],
      trangThaiTh: [],
      giaTriDx: [null],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucDxBhHdtqg: [null],
      listQlDinhMucDxBhKhoChua: [null],
    });
    this.formDataTongHop = this.fb.group({
      namKeHoach: [dayjs().get('year'), Validators.required],
      ngayDxTu: [null],
      ngayDxDen: [null],
      listSoCv: [null]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maCv = '/' + this.userInfo.DON_VI.tenVietTat + '-TCKT'
      await this.loadDsDxCc();
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
      body.listSoCv = this.listDxChiCuc.toString();
    } else {
      body.listSoCv = body.listSoCv.toString();
    }
    body.trangThai = STATUS.DADUYET_CB_CUC;
    body.trangThaiTh = STATUS.CHUA_TONG_HOP;
    body.maDvi = this.userInfo.MA_DVI
    let res = await this.deXuatBaoHiemSv.tongHop(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let detail = res.data;
      if (detail && detail.listQlDinhMucDxBhKhoChua) {
        this.formData.patchValue({
          namKeHoach: this.formDataTongHop.value.namKeHoach,
        })
        this.dataTable = detail.listQlDinhMucDxBhKhoChua;
        this.dataTable.forEach(it => {
          it.id = null
        })
        this.convertListData();
      }
      if (detail && detail.listQlDinhMucDxBhHdtqg) {
        this.tableHangDtqgView = detail.listQlDinhMucDxBhHdtqgTheoDvi;
        this.tableHangDtqgReq = detail.listQlDinhMucDxBhHdtqg;
        this.tableHangDtqgReq.forEach(it => {
          it.id = null
        })
      }
      this.tableGtriBHiem = detail.listQlDinhMucThGiaTriBaoHiem;
      this.isTongHop = true;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
      return;
    }
  }

  async loadDsDxCc() {
    this.spinner.show();
    try {
      let body = {
        "capDvi": "3",
        "paggingReq": {
          "limit": 10,
          "page": 0
        }
      }
      let res = await this.deXuatBaoHiemSv.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listDxChiCuc = data.content;
        if (this.listDxChiCuc) {
          this.listDxChiCuc = this.listDxChiCuc.filter(item => item.trangThai == this.STATUS.DADUYET_CB_CUC && item.trangThaiTh == STATUS.CHUA_TONG_HOP)
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

  async saveAndSend(status: string, msg: string, msgSuccess?: string) {
    try {
      this.formData.patchValue({
        namKeHoach: this.formDataTongHop.value.namKeHoach,
        giaTriDx: this.sumslKho('giaTriBhDx', null, 'tong')
      })
      this.helperService.markFormGroupTouched(this.formData)
      if (this.formData.invalid) {
        return;
      }
      if (this.fileDinhKem && this.fileDinhKem.length > 0) {
        this.formData.value.fileDinhKems = this.fileDinhKem;
      }
      this.conVertTreToList();
      this.formData.value.listQlDinhMucDxBhKhoChua = this.dataTable;
      this.formData.value.listQlDinhMucDxBhHdtqg = this.tableHangDtqgReq;
      this.formData.value.maDvi = this.userInfo.MA_DVI;
      this.formData.value.capDvi = this.userInfo.CAP_DVI;
      this.formData.value.soCv = this.formData.value.soCv + this.maCv
      await super.saveAndSend( this.formData.value, status, msg, msgSuccess);
    } catch (error) {
      console.error("Lỗi khi lưu và gửi dữ liệu:", error);
    }
  }

  async save() {
    this.formData.patchValue({
      namKeHoach: this.formDataTongHop.value.namKeHoach,
      giaTriDx: this.sumslKho('giaTriBhDx', null, 'tong')
    })
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.conVertTreToList();
    this.formData.value.listQlDinhMucDxBhKhoChua = this.dataTable;
    this.formData.value.listQlDinhMucDxBhHdtqg = this.tableHangDtqgReq;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    this.formData.value.soCv = this.formData.value.soCv + this.maCv
    let res = await this.createUpdate(this.formData.value)
    if (res) {
      this.goBack();
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.deXuatBaoHiemSv.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.isTongHop = true;
          const data = res.data;
          this.maCv =  "/" + data.soCv?.split("/")[1];
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soCv : data.soCv ?data.soCv.split("/")[0] : '',
          })
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucDxBhKhoChua;
          this.tableHangDtqgView = data.listQlDinhMucDxBhHdtqgTheoDvi;
          this.tableHangDtqgReq = data.listQlDinhMucDxBhHdtqg;
          this.tableGtriBHiem = data.listQlDinhMucThGiaTriBaoHiem;
          this.convertListData();
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
      case STATUS.DU_THAO:
      case STATUS.TU_CHOI_CBV: {
        trangThai = STATUS.DA_KY;
        break;
      }
      case STATUS.DA_KY: {
        trangThai = STATUS.DA_DUYET_CBV
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
  }

  convertListData() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable = chain(this.dataTable).groupBy('tenDonVi').map((value, key) => ({
        tenDonVi: key,
        dataChild: value,
        idVirtual: uuid.v4(),
      })
      ).value()
    }
    this.expandAll()
  }

  conVertTreToList() {
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push(data)
        })
      }
    })
    this.dataTable = arr
  }
  sumslKho(column?: string, tenDvi?: string, type?: string): number {
    let result = 0;
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push(data)
        })
      }
    })
    if (arr && arr.length > 0) {
      if (type) {
        const sum = arr.reduce((prev, cur) => {
          prev += cur[column];
          return prev;
        }, 0);
        result = sum
      } else {
        let list = arr.filter(item => item.tenDonVi == tenDvi)
        if (list && list.length > 0) {
          const sum = list.reduce((prev, cur) => {
            prev += cur[column];
            return prev;
          }, 0);
          result = sum
        }
      }
    }
    return result;
  }

  sumSlHang(row: string, table : any[]) : number {
    let result = 0;
    let arr = table.filter(it => it.nhomCha);
    const sum = arr.reduce((prev, cur) => {
      prev += cur[row];
      return prev;
    }, 0);
    result = sum;
    return result;
  }

  disableForm() {
    let check = false;
    if (this.isView) {
      check = true
    } else {
      if (this.id > 0) {
        check = true
      } else {
        check = false;
      }
    }
    return check;
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  expandAll() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(s => {
        this.expandSet.add(s.idVirtual);
      });
    }
  }
}

