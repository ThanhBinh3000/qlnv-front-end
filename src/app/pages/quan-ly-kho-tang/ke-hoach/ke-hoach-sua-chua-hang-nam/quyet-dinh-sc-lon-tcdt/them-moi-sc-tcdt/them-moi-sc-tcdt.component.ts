import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {FormGroup, Validators} from "@angular/forms";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {chain} from 'lodash';
import * as uuid from "uuid";
import {MESSAGE} from "../../../../../../constants/message";
import dayjs from "dayjs";
import {STATUS} from "../../../../../../constants/status";
import {
  DeXuatScLonService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/de-xuat-sc-lon.service";

@Component({
  selector: 'app-them-moi-sc-tcdt',
  templateUrl: './them-moi-sc-tcdt.component.html',
  styleUrls: ['./them-moi-sc-tcdt.component.scss']
})
export class ThemMoiScTcdtComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  dataTableTc: any[] = [];
  listDxChiCuc: any[] = [];
  isTongHop: boolean = false;
  formDataTongHop: FormGroup
  expandSet = new Set<number>();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dexuatService : DeXuatScLonService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dexuatService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      capDvi: [null],
      namKeHoach: [dayjs().get('year')],
      noiDung: [null, Validators.required],
      ngayKy: [null, Validators.required],
      maToTrinh: [null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
    });
    this.formDataTongHop = this.fb.group({
      namKeHoach: [dayjs().get('year'), Validators.required],
      ngayDx: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
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
    let body = this.formDataTongHop.value
    body.ngayDxTu = body.ngayDx ? body.ngayDx[0] : null
    body.ngayDxDen = body.ngayDx ? body.ngayDx[1] : null
    let res = await this.dexuatService.tongHop(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.isTongHop = true;
      let detail = res.data;
      this.dataTable = detail.ktKhDxSuaChuaLonCtiets
      this.spinner.hide()
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
      this.spinner.hide()
      return;
    }
    this.spinner.hide()
  }
  async save(isOther: boolean) {
    this.formData.patchValue({
      namKeHoach: this.formDataTongHop.value.namKeHoach,
    })
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    let body = this.formData.value;
    body.chiTiets = this.dataTable
    body.chiTietDms = []
    let data = await this.createUpdate(body)
    if (data) {
      if (isOther) {
        let trangThai;
        switch (this.formData.value.trangThai) {
          case STATUS.DU_THAO :
          case STATUS.TU_CHOI_TP :
          case STATUS.TU_CHOI_CBV : {
            trangThai = STATUS.CHO_DUYET_TP;
            break;
          }
          case STATUS.TU_CHOI_LDC : {
            trangThai = STATUS.CHO_DUYET_LDC;
            break;
          }
        }
        this.approve(data.id, STATUS.CHO_DUYET_LDV, "Bạn có chắc chắn muốn gửi duyệt?");
      } else {
        this.goBack()
      }
    }
  }


  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.dexuatService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.isTongHop = true;
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.listFileDinhKems;
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTableTc = data.chiTietThs
          this.dataTable = data.chiTiets
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

  convertListToTree(table : any[]) : any[] {
    if (table && table.length > 0) {
      table = chain(table).groupBy('tenTmdt').map((value, key) => ({
        tenTmdt: key,
          dataChild: value,
          idVirtual: uuid.v4(),
        })
      ).value()
    }
    return  table;
  }

  async pheDuyet() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.DU_THAO :
      case STATUS.TU_CHOI_LDV : {
        trangThai = STATUS.CHO_DUYET_LDV;
        break;
      }
      case STATUS.TU_CHOI_LDTC :
      case STATUS.CHO_DUYET_LDV : {
        trangThai = STATUS.CHO_DUYET_LDTC
        break;
      }
      case STATUS.CHO_DUYET_LDTC : {
        trangThai = STATUS.DA_DUYET_LDTC
        break;
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
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

  calcTong(type) {
    let sum;
    if (this.dataTable && this.dataTable.length > 0) {
      sum = this.dataTable.reduce((prev, cur) => {
        switch (type) {
          case '1' : {
            prev += cur.tmdtDuKien;
            break;
          }
          case '2' : {
            prev += cur.nstwDuKien;
            break;
          }
          case '3' : {
            prev += cur.tongSoLuyKe;
            break;
          }
          case '4' : {
            prev += cur.luyKeNstw;
            break;
          }
          case '5' : {
            prev += cur.tmdtDuyet;
            break;
          }
          case '6' : {
            prev += cur.nstwDuyet;
            break;
          }
        }
        return prev;
      }, 0);
    }
    return sum;
  }


  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
}
