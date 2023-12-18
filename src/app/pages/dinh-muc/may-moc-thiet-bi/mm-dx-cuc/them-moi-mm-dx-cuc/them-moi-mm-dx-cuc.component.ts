import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {FormGroup, Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {chain} from 'lodash';
import { saveAs } from 'file-saver';
import {v4 as uuidv4} from 'uuid';
import {
  MmThongTinNcChiCuc
} from "../../de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc.component";
import {MmDxChiCucService} from "../../../../../services/mm-dx-chi-cuc.service";
import {MESSAGE} from "../../../../../constants/message";
import dayjs from "dayjs";
import {STATUS} from "../../../../../constants/status";

@Component({
  selector: 'app-them-moi-mm-dx-cuc',
  templateUrl: './them-moi-mm-dx-cuc.component.html',
  styleUrls: ['./them-moi-mm-dx-cuc.component.scss']
})
export class ThemMoiMmDxCucComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() listDxChiCuc: any[] = [];
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
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      namKeHoach: [dayjs().get('year')],
      soCv: [null, Validators.required],
      klLtBaoQuan: [null],
      klLtNhap: [null],
      klLtXuat: [null],
      slGaoDangBaoQuan: [0],
      slThocDangBaoQuan: [0],
      slGaoXuat: [0],
      slThocXuat: [0],
      slGaoNhap: [0],
      slThocNhap: [0],
      trichYeu: [null, Validators.required],
      ngayKy: [null, Validators.required],
      trangThai: ['78'],
      trangThaiTh: [],
      tenTrangThai: ['Đang nhập dữ liệu'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucDxTbmmTbcdDtl: [null],
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
      await this.loadDsDxCc(this.formDataTongHop.value.namKeHoach);
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
    body.ngayDxTu = body.ngayDx ? body.ngayDx[0] : null
    body.ngayDxDen = body.ngayDx ? body.ngayDx[1] : null
    body.trangThai = STATUS.DADUYET_CB_CUC;
    body.trangThaiTh = STATUS.CHUA_TONG_HOP;
    body.maDvi = this.userInfo.MA_DVI;
    let res = await this.dxChiCucService.tongHopDxCc(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let detail = res.data;
      if (detail && detail.listQlDinhMucDxTbmmTbcdDtl) {
        this.formData.patchValue({
          namKeHoach: this.formDataTongHop.value.namKeHoach,
          slGaoDangBaoQuan: detail.slGaoDangBaoQuan,
          slThocDangBaoQuan: detail.slThocDangBaoQuan,
          slGaoNhap: detail.slGaoNhap,
          slGaoXuat: detail.slGaoXuat,
          slThocNhap: detail.slThocNhap,
          slThocXuat: detail.slThocXuat,
        })
        this.dataTable = detail.listQlDinhMucDxTbmmTbcdDtl
        this.dataTable.forEach(item => {
          let arr = detail.listQlDinhMucDxTbmmTbcd;
          if (arr && arr.length > 0) {
            arr.forEach(dtl => {
              if (dtl.id == item.dxTbmmTbcdId) {
                item.maDvi = dtl.maDvi
              }
            })
          }
          item.id = null;
          item.ghiChu = null;
          idVirtual:uuidv4();
        })
        this.convertListData()
      }
      this.isTongHop = true;
    } else {
      this.notification.warning('',res.msg);
      return;
    }
  }

  async loadSlThuaThieu(item: MmThongTinNcChiCuc) {
    if ((item.slTieuChuan - item.slNhapThem - item.slHienCo) >= 0) {
      item.chenhLechThieu = item.slTieuChuan - item.slNhapThem - item.slHienCo
    } else {
      item.chenhLechThieu = 0
    }
    if ((item.slNhapThem + item.slHienCo - item.slTieuChuan) >= 0) {
      item.chenhLechThua = item.slNhapThem + item.slHienCo - item.slTieuChuan
    } else {
      item.chenhLechThua = 0
    }
  }

  async loadDsDxCc(namKh) {
    this.spinner.show();
    try {
      let body = {
        "capDvi": "3",
        "namKeHoach" : namKh,
        "trangThaiTh" : "24",
        "paggingReq": {
          "limit": 10,
          "page": 0
        }
      }
      let res = await this.dxChiCucService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.formDataTongHop.patchValue({
          listSoCv : []
        })
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

  async saveAndSend(status: string, msg: string, msgSuccess?: string) {
    try {
      this.formData.patchValue({
        namKeHoach: this.formDataTongHop.value.namKeHoach
      })
      this.helperService.markFormGroupTouched(this.formData)
      if (this.formData.invalid) {
        return;
      }
      if (this.fileDinhKem && this.fileDinhKem.length > 0) {
        this.formData.value.fileDinhKems = this.fileDinhKem;
      }
      this.conVertTreToList();
      this.formData.value.listQlDinhMucDxTbmmTbcdDtl = this.dataTable;
      this.formData.value.maDvi = this.userInfo.MA_DVI;
      this.formData.value.capDvi = this.userInfo.CAP_DVI;
      await super.saveAndSend(this.formData.value, status, msg, msgSuccess);
    } catch (error) {
      console.error("Lỗi khi lưu và gửi dữ liệu:", error);
    }
  }

  async save() {
    this.formData.patchValue({
      namKeHoach: this.formDataTongHop.value.namKeHoach
    })
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.conVertTreToList();
    this.formData.value.listQlDinhMucDxTbmmTbcdDtl = this.dataTable;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    let res = await this.createUpdate(this.formData.value)
    if (res) {
      this.goBack();
    } else {
      this.convertListData()
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
      case STATUS.DANG_NHAP_DU_LIEU :
      case STATUS.TU_CHOI_CBV : {
        trangThai = STATUS.DA_DUYET_LDC;
        break;
      }
      case STATUS.DA_DUYET_LDC : {
        trangThai = STATUS.DA_DUYET_CBV
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
            this.loadSlThuaThieu(data)
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

  sumSoLuong(data: any) {
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


  expandAll() {
    this.dataTable.forEach(s => {
      this.expandSet.add(s.idVirtual);
    })
  }


  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

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
          .exportDetailCc(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-chi-tiet-tong-hop-nhu-cau-mmtb-va-ccdc.xlsx'),
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

  changeNamKh(event) {
    this.loadDsDxCc(event);
  }
}
