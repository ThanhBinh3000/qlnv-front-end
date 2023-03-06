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
  listDxChiCuc : any[] = [];
  isTongHop: boolean = false;
  rowItem: BaoHiemKhoDangChuaHang = new BaoHiemKhoDangChuaHang();
  dataEdit: { [key: string]: { edit: boolean; data: BaoHiemKhoDangChuaHang } } = {};
  formDataTongHop : FormGroup
  expandSet = new Set<number>();
  maCv: string;
  tableHangDtqg: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private deXuatBaoHiemSv : DeXuatNhuCauBaoHiemService
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatBaoHiemSv)
    super.ngOnInit()
    this.formData = this.fb.group({
      id : [null],
      maDvi : [null],
      namKeHoach : [dayjs().get('year')],
      soCv : [null, Validators.required],
      trichYeu : [null, Validators.required],
      ngayKy : [null, Validators.required],
      trangThai : ['00'],
      tenTrangThai : ['Dự thảo'],
      fileDinhKems : [null],
      lyDoTuChoi : [null],
      listQlDinhMucDxBhHdtqg : [null],
      listQlDinhMucDxBhKhoChua : [null],
    });
    this.formDataTongHop = this.fb.group({
      namKeHoach : [dayjs().get('year'), Validators.required],
      ngayDx : [null],
      listSoCv : [null]
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
      let arr = []
      if (this.listDxChiCuc && this.listDxChiCuc.length > 0) {
        this.listDxChiCuc.forEach(item => {
          arr.push(item.soCv)
        })
      }
      body.listSoCv = arr.toString();
    } else {
      body.listSoCv = body.listSoCv.toString();
    }
    body.ngayDxTu = body.ngayDx ? body.ngayDx[0]: null
    body.ngayDxDen = body.ngayDx ? body.ngayDx[1]: null
    body.trangThai = STATUS.DADUYET_CB_CUC;
    body.trangThaiTh = STATUS.CHUA_TONG_HOP;
    let res = await this.deXuatBaoHiemSv.tongHop(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let detail = res.data;
      if (detail && detail.listQlDinhMucDxBhKhoChua) {
        this.formData.patchValue({
          namKeHoach : this.formDataTongHop.value.namKeHoach,
        })
        this.dataTable = detail.listQlDinhMucDxBhKhoChua
        this.dataTable.forEach(item => {
          item.id = null;
          item.ghiChu = null;
          idVirtual:uuid.v4()
        })
        this.convertListData()
      }
      if (detail && detail.listQlDinhMucDxBhHdtqg) {
        this.tableHangDtqg = detail.listQlDinhMucDxBhHdtqg
        this.tableHangDtqg.forEach(item => {
          item.id = null;
          item.ghiChu = null;
          idVirtual:uuid.v4()
        })
        this.buildDiaDiemTc()
      }

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
          this.listDxChiCuc = this.listDxChiCuc.filter(item => item.trangThai == this.STATUS.DADUYET_CB_CUC)
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

  async save() {
    this.formData.patchValue({
      namKeHoach : this.formDataTongHop.value.namKeHoach
    })
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.conVertTreToList();
    this.convertListHangDtqg();
    this.formData.value.listQlDinhMucDxBhKhoChua = this.dataTable;
    this.formData.value.listQlDinhMucDxBhHdtqg = this.tableHangDtqg;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
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
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucDxTbmmTbcdDtl;
          this.convertListData()
          this.expandAll('kho');
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
      case STATUS.DU_THAO :
      case STATUS.TU_CHOI_CBV : {
        trangThai = STATUS.DA_KY;
        break;
      }
      case STATUS.DA_KY : {
        trangThai = STATUS.DA_DUYET_CBV
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
  }

  convertListData() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable = chain(this.dataTable).groupBy('tenDonVi').map((value, key) => ({ tenDonVi: key, dataChild: value, idVirtual: uuid.v4(),})
      ).value()
    }
    this.expandAll('kho');
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

  convertListHangDtqg() {
    let arr = [];
    if (this.tableHangDtqg) {
      this.tableHangDtqg.forEach(item => {
        if (item.childData && item.childData.length > 0) {
          item.childData.forEach(data => {
            if (data.childData && data.childData.length > 0) {
              data.childData.forEach(dtl => {
                arr.push(dtl)
              })
            }
          })
        }
      })
      this.tableHangDtqg = arr
    }
  }

  buildDiaDiemTc() {
    if (this.tableHangDtqg && this.tableHangDtqg.length > 0) {
      this.tableHangDtqg = chain(this.tableHangDtqg)
        .groupBy("tenLoaiVthh")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenHangHoaCha")
            .map((v, k) => {
                return {
                  idVirtual: uuid.v4(),
                  tenHangHoaCha: k,
                  childData: v
                }
              }
            ).value();
          return {
            idVirtual: uuid.v4(),
            tenLoaiVthh: key,
            childData: rs
          };
        }).value();
    }
    this.expandAll('dtqg');
  }

  sumSoLuong(data : any) {
    let sl = 0;
    if (data && data.dataChild && data.dataChild.length > 0) {
      data.dataChild.forEach(item => {
        sl = sl + item.soLuong
      })
    }
    return sl
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



  expandAll(type: string) {
    if (type == 'kho') {
      this.dataTable.forEach(s => {
        this.expandSet.add(s.idVirtual);
      })
    } else {
        this.tableHangDtqg.forEach(s => {
          this.expandSet.add(s.idVirtual);
          if (s.childData && s.childData.length > 0) {
            s.childData.forEach(item => {
              this.expandSet.add(item.idVirtual);
            })
          }
        })
    }
  }


  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
}

