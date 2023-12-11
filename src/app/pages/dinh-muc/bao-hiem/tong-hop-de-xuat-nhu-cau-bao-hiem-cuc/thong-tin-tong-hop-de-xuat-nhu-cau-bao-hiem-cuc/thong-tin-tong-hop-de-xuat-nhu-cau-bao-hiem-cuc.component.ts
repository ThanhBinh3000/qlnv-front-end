import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {FormGroup, Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {MESSAGE} from "../../../../../constants/message";
import dayjs from "dayjs";
import {STATUS} from "../../../../../constants/status";
import {
  DeXuatNhuCauBaoHiemService
} from "../../../../../services/dinhmuc-maymoc-baohiem/de-xuat-nhu-cau-bao-hiem.service";
import * as uuidv4 from "uuid";
import {chain} from "lodash";

@Component({
  selector: 'app-thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-cuc',
  templateUrl: './thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-cuc.component.html',
  styleUrls: ['./thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-cuc.component.scss']
})
export class ThongTinTongHopDeXuatNhuCauBaoHiemCucComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  listDxCuc: any[] = [];
  isTongHop: boolean = false;
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
      capDvi: [null],
      namKeHoach: [dayjs().get('year')],
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
      ngayDx: [null],
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
    this.spinner.show()
    this.helperService.markFormGroupTouched(this.formDataTongHop);
    if (this.formDataTongHop.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide()
      return;
    }
    let body = this.formDataTongHop.value;
    if (!body.listSoCv || body.listSoCv.length == 0) {
      let arr = this.listDxCuc.map(item => item.soCv);
      body.listSoCv = arr && arr.length > 0 ?  arr.toString() : [];
    } else {
      body.listSoCv = body.listSoCv.toString();
    }
    body.ngayDxTu = body.ngayDx ? body.ngayDx[0] : null
    body.ngayDxDen = body.ngayDx ? body.ngayDx[1] : null
    body.trangThai = STATUS.DA_DUYET_CBV;
    body.trangThaiTh = STATUS.CHUA_TONG_HOP;
    body.maDvi = this.userInfo.MA_DVI;
    let res = await this.deXuatBaoHiemSv.tongHop(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.isTongHop = true;
      let detail = res.data;
      this.formData.patchValue({
        namKeHoach: this.formDataTongHop.value.namKeHoach,
      })
      if (detail && detail.listQlDinhMucDxBhKhoChua) {
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
      this.spinner.hide()
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
      this.spinner.hide()
      return;
    }
    this.spinner.hide()
  }

  async loadDsDxCc() {
    this.spinner.show();
    try {
      let body = {
        "capDvi": 2,
        "paggingReq": {
          "limit": 10,
          "page": 0
        }
      }
      let res = await this.deXuatBaoHiemSv.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listDxCuc = data.content;
        if (this.listDxCuc) {
          this.listDxCuc = this.listDxCuc.filter(item => item.trangThai == this.STATUS.DA_DUYET_CBV && item.trangThaiTh == STATUS.CHUA_TONG_HOP)
        }
      } else {
        this.listDxCuc = [];
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

  async save(isOther: boolean) {
    this.formData.patchValue({
      namKeHoach: this.formDataTongHop.value.namKeHoach,
    })
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    this.conVertTreToList();
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucDxBhKhoChua = this.dataTable;
    this.formData.value.listQlDinhMucDxBhHdtqg = this.tableHangDtqgReq;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    let data = await this.createUpdate(this.formData.value)
    if (data) {
      if (isOther) {
        this.approve(data.id, STATUS.CHO_DUYET_LDTC, "Bạn có chắc chắn muốn gửi duyệt?");
      } else {
        this.goBack()
      }
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
          this.helperService.bidingDataInFormGroup(this.formData, data);
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

  async tuChoi() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDV: {
        trangThai = STATUS.CHO_DUYET_LDV;
        break;
      }
      case STATUS.CHO_DUYET_LDTC: {
        trangThai = STATUS.CHO_DUYET_LDTC
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
  }

  convertListData() {
    this.dataTable = chain(this.dataTable)
      .groupBy("tenDonViCha")
      ?.map((value1, key1) => {
        let children1 = chain(value1)
          .groupBy("tenDonVi")
          ?.map((value2, key2) => {
              return {
                idVirtual: uuidv4.v4(),
                children: value2,
                tenDonVi : key2
              }
            }
          ).value();
        return {
          idVirtual: uuidv4.v4(),
          children: children1,
          tenDonVi: key1
        };
      }).value();
    this.expandAll();
  }

  conVertTreToList() {
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.children && item.children.length > 0) {
        item.children.forEach(data => {
          if (data.children && data.children.length > 0) {
            data.children.forEach(it => {
              arr.push(it)
            })
          }
        })
      }
      this.dataTable = arr
    })
  }

  sumslKho(column?: string, tenDvi?: string, type?: string): number {
    let result = 0;
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.children && item.children.length > 0) {
        item.children.forEach(data => {
          if (data.children && data.children.length > 0) {
            data.children.forEach(it => {
              arr.push(it)
            })
          }
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
        if (s.children && s.children.length > 0) {
          s.children.forEach(it => {
            this.expandSet.add(it.idVirtual);
          })
        }
      });
    }
  }

}
