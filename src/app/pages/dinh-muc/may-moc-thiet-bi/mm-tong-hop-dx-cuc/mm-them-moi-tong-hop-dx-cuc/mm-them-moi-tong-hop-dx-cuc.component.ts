import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {chain} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {FormGroup, Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../../constants/message";
import {STATUS} from "../../../../../constants/status";
import {
  MmThongTinNcChiCuc
} from "../../de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc.component";
import {MmDxChiCucService} from "../../../../../services/mm-dx-chi-cuc.service";

@Component({
  selector: 'app-mm-them-moi-tong-hop-dx-cuc',
  templateUrl: './mm-them-moi-tong-hop-dx-cuc.component.html',
  styleUrls: ['./mm-them-moi-tong-hop-dx-cuc.component.scss']
})
export class MmThemMoiTongHopDxCucComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  listDxCuc: any[] = [];
  isTongHop: boolean = false;
  rowItem: MmThongTinNcChiCuc = new MmThongTinNcChiCuc();
  dataEdit: { [key: string]: { edit: boolean; data: MmThongTinNcChiCuc } } = {};
  formDataTongHop: FormGroup
  expandSet = new Set<number>();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxChiCucService: MmDxChiCucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dxChiCucService)
    super.ngOnInit()
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      namKeHoach: [null],
      klLtBaoQuan: [null],
      klLtNhap: [null],
      klLtXuat: [null],
      trichYeu: [null, Validators.required],
      ngayKy: [null, Validators.required],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucDxTbmmTbcdDtl: [null],
    });
    this.formDataTongHop = this.fb.group({
      namKeHoach: [dayjs().get('year')],
      ngayDx: [],
      listSoCv: [null]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
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
      if (this.listDxCuc && this.listDxCuc.length > 0) {
        this.listDxCuc.forEach(item => {
          arr.push(item.soCv)
        })
      }
      body.listSoCv = arr.toString();
    } else {
      body.listSoCv = body.listSoCv.toString();
    }
    body.ngayDxTu = body.ngayDx ? dayjs(body.ngayDx[0]).format('DD/MM/YYYY') : null
    body.ngayDxDen = body.ngayDx ? dayjs(body.ngayDx[1]).format('DD/MM/YYYY') : null
    body.trangThai = STATUS.DA_DUYET_CBV;
    body.trangThaiTh = STATUS.CHUA_TONG_HOP;
    let res = await this.dxChiCucService.tongHopDxCc(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let detail = res.data;
      if (detail && detail.listQlDinhMucDxTbmmTbcdDtl) {
        this.formData.patchValue({
          klLtBaoQuan: detail.klLtBaoQuan,
          klLtNhap: detail.klLtNhap,
          klLtXuat: detail.klLtXuat
        })
        this.dataTable = detail.listQlDinhMucDxTbmmTbcdDtl
        this.dataTable.forEach(item => {
          item.id = null;
          item.ghiChu = null;
          idVirtual:uuidv4();
        })
        this.convertListData()
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
        "capDvi": "2",
        "paggingReq": {
          "limit": 10,
          "page": 0
        }
      }
      let res = await this.dxChiCucService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listDxCuc = data.content;
        if (this.listDxCuc) {
          this.listDxCuc.filter(item => item.trangThai == this.STATUS.DA_DUYET_CBV)
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
      namKeHoach: this.formDataTongHop.value.namKeHoach
    })
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    if (!this.validateSlTc()) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng nhập số lượng của TC')
      this.spinner.hide();
      return;
    }
    this.conVertTreToList();
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucDxTbmmTbcdDtl = this.dataTable;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    let body = this.formData.value;
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        this.approve(data.id, STATUS.CHO_DUYET_LDV, "Bạn có chắc chắn muốn gửi duyệt?");
      } else {
        this.goBack()
      }
    }
  }

  validateSlTc(): boolean {
    let flag = true;
    if (this.dataTable && this.dataTable.length > 0)
      this.dataTable.forEach(item => {
        if (item && item.dataChild && item.dataChild.length > 0) {
          item.dataChild.forEach(data => {
            if (!data.soLuongTc || data.soLuongTc == 0) {
              flag = false;
            }
          })
        }
      })
    return flag;
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
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucDxTbmmTbcdDtl;
          this.convertListData()
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
      case STATUS.DU_THAO :
      case STATUS.TU_CHOI_LDV : {
        trangThai = STATUS.CHO_DUYET_LDV;
        break;
      }
      case STATUS.CHO_DUYET_LDV : {
        trangThai = STATUS.DA_DUYET_LDV
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
  }

  convertListData() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable = chain(this.dataTable).groupBy('tenTaiSan').map((value, key) => ({
          tenTaiSan: key,
          dataChild: value,
          idVirtual: uuidv4(),
        })
      ).value()
    }
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(item => {
        if (item && item.dataChild && item.dataChild.length > 0) {
          item.dataChild.forEach(data => {
            item.donViTinh = data.donViTinh
            item.donGiaTd = data.donGiaTd
          })
        }
      })
    }
    this.expandAll();
  }

  conVertTreToList() {
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          data.thanhTienNc = data.donGiaTd * data.soLuong
          arr.push(data)
        })
      }
    })
    this.dataTable = arr
    console.log(this.dataTable)
  }

  sumSoLuong(data: any, type: string) {
    let sl = 0;
    let slTc = 0;
    if (data && data.dataChild && data.dataChild.length > 0) {
      data.dataChild.forEach(item => {
        sl = sl + item.soLuong
        slTc = slTc + item.soLuongTc
      })
    }
    if (type == 'tong') {
      return slTc
    } else {
      return sl
    }
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

  expandAll() {
    this.dataTable.forEach(s => {
      this.expandSet.add(s.idVirtual);
    })
    console.log(this.expandSet, 128912893)
  }


  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
}
