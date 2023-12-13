import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {QlDinhMucPhiService} from "../../../../../services/qlnv-kho/QlDinhMucPhi.service";
import {Validators} from "@angular/forms";
import {MESSAGE} from "../../../../../constants/message";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {DonviService} from "../../../../../services/donvi.service";
import {DanhMucTaiSanService} from "../../../../../services/danh-muc-tai-san.service";
import { STATUS } from '../../../../../constants/status';
import dayjs from "dayjs";
import {AMOUNT} from "../../../../../Utility/utils";

@Component({
  selector: 'app-mm-them-moi-dm-trang-bi',
  templateUrl: './mm-them-moi-dm-trang-bi.component.html',
  styleUrls: ['./mm-them-moi-dm-trang-bi.component.scss']
})
export class MmThemMoiDmTrangBiComponent extends Base2Component implements OnInit {
  @Input('isViewDetail') isViewDetail: boolean;
  @Input() idInput: number;
  rowItem: DinhMucTrangBiMm = new DinhMucTrangBiMm();
  dataTableDetail: any[] = [];
  dataEdit: { [key: string]: { edit: boolean; data: DinhMucTrangBiMm } } = {};
  dsQtNsChiTw: any[] = [];
  listDmTaiSan: any[] = [];
  amount = AMOUNT;
  constructor(
    httpClient: HttpClient,
    private donViService: DonviService,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qlDinhMucPhiService: QlDinhMucPhiService,
    private dmTaiSanService: DanhMucTaiSanService,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qlDinhMucPhiService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [''],
      soQd: ['', [Validators.required]],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ['Đang nhập dữ liệu'],
      ngayKy: ['', [Validators.required]],
      ngayHieuLuc: ['', [Validators.required]],
      ngayHetHieuLuc: [''],
      capDvi: [''],
      ghiChu: [''],
      loai: ['02'],
      trichYeu: ['', [Validators.required]],
      listQlDinhMucPhiTbMmtbCd: [null],
      fileDinhKems: [null]
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    this.dataTableDetail = [];
    this.spinner.show();
    try {
      await this.getAllDmTaiSan();
      if (this.idInput > 0) {
        this.detail(this.idInput);
      }
      this.updateEditCache();
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getAllDmTaiSan() {
    let body = {
      paggingReq: {
        limit: 10000,
        page: 0,
      }
    };
    let res = await this.dmTaiSanService.searchDsChuaSuDung(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content && res.data.content.length > 0) {
        this.listDmTaiSan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }


  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.qlDinhMucPhiService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTableDetail = data.listQlDinhMucTbMmtbCdDtl;
          if (this.dataTableDetail && this.dataTableDetail.length > 0) {
            this.dataTableDetail.forEach(item => {
              item.tenLoaiHinh = this.getStrTenLoaiHinh(item.loaiHinh)
              item.loaiHinh = item.loaiHinh ? item.loaiHinh.split(",") : [];
            })
          }
          this.updateEditCache();
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

  getStrTenLoaiHinh(strMaLoaiHinh) {
    let str = '';
    if (strMaLoaiHinh) {
      let arrLoaiHinh = strMaLoaiHinh.split(",");
      arrLoaiHinh.forEach((item) => {
        switch (item) {
          case '00' : {
            if (arrLoaiHinh.indexOf(item) == arrLoaiHinh.length - 1) {
              str = str + 'Nhập'
            } else {
              str = str + 'Nhập' + ', '
            }
            break;
          }
          case '01' : {
            if (arrLoaiHinh.indexOf(item) == arrLoaiHinh.length - 1) {
              str = str + 'Xuất'
            } else {
              str = str + 'Xuất' + ', '
            }
            break;
          }
          case '02' : {
            if (arrLoaiHinh.indexOf(item) == arrLoaiHinh.length - 1) {
              str = str + 'Bảo quản'
            } else {
              str = str + 'Bảo quản' + ', '
            }
            break;
          }
        }
      })
    }
    return str;
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    try {
      if (this.dataTableDetail.length <= 0) {
        this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập chi tiết định mức trang bị!");
        return;
      }
      this.helperService.markFormGroupTouched(this.formData)
      if (this.formData.invalid) {
        return;
      }
      if (this.fileDinhKem && this.fileDinhKem.length > 0) {
        this.formData.value.fileDinhKems = this.fileDinhKem;
      }
      if (this.dataTableDetail && this.dataTableDetail.length > 0) {
        this.dataTableDetail.forEach(item => {
          if (item.loaiHinh && item.loaiHinh.length > 0) {
            item.loaiHinh = item.loaiHinh.toString();
          }
        })
      }
      this.formData.value.listQlDinhMucPhiTbMmtbCd = this.dataTableDetail;
      this.formData.value.maDvi = this.userInfo.MA_DVI;
      await super.saveAndSend(this.formData.value, trangThai, msg, msgSuccess);
    } catch (error) {
      console.error("Lỗi khi lưu và gửi dữ liệu:", error);
    }
  }


  async save() {
    if (this.dataTableDetail.length <= 0) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập chi tiết định mức trang bị!");
      return;
    }
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    if (this.dataTableDetail && this.dataTableDetail.length > 0) {
      this.dataTableDetail.forEach(item => {
        if (item.loaiHinh && item.loaiHinh.length > 0) {
          item.loaiHinh = item.loaiHinh.toString();
        }
      })
    }
    this.formData.value.listQlDinhMucPhiTbMmtbCd = this.dataTableDetail;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    let res = await this.createUpdate(this.formData.value)
    if (res) {
      this.goBack();
    }
  }

  banHanh(id, trangThai) {
    this.approve(id, trangThai, 'Bạn có chắc chắn muốn ban hành?');
  }

  ngungHieuLuc(id, trangThai) {
    this.approve(id, trangThai, 'Bạn có chắc chắn muốn ban ngừng hiệu lực văn bản này?');
  }

  required(item: DinhMucTrangBiMm) {
    let msgRequired = '';
    //validator
    if (!item.maTaiSan) {
      msgRequired = "Loại tài sản không được để trống";
      // } else if (!item.slVpCucKv) {
      //   msgRequired = "Số lượng tối đa VP Cục DTNN KV không được để trống";
      // } else if (!item.slChiCuc || !item.klChiCuc) {
      //   msgRequired = "Số lượng tối đa Chi cục DTNN không được để trống";
    } else if (!item.donGiaTd) {
      msgRequired = "Đơn giá tối đa không được để trống";
    }
    return msgRequired;
  }


  async addDetailDinhMuc() {
    let msgRequired = this.required(this.rowItem);
    if (msgRequired) {
      this.notification.warning(MESSAGE.WARNING, msgRequired);
      this.spinner.hide();
      return;
    }
    if (this.checkExitsData(this.rowItem, this.dataTableDetail)) {
      this.notification.warning(MESSAGE.WARNING, "Dữ liệu trùng lặp, đề nghị nhập lại.");
      this.spinner.hide();
      return;
    }
    if (this.rowItem.loaiHinh && this.rowItem.loaiHinh.length > 0) {
      let listTenLh = []
      this.rowItem.loaiHinh.forEach(item => {
        switch (item) {
          case '00' : {
            listTenLh.push('Nhập');
            break;
          }
          case '01' : {
            listTenLh.push('Xuất');
            break;
          }
          case '02' : {
            listTenLh.push('Bảo quản');
            break;
          }
        }
      })
      this.rowItem.tenLoaiHinh = listTenLh.toString();
    }
    this.dataTableDetail = [...this.dataTableDetail, this.rowItem];
    this.rowItem = new DinhMucTrangBiMm();
    this.updateEditCache();
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maTaiSan == item.maTaiSan) {
          rs = true;
          return;
        }
      })
    }
    return rs;
  }

  updateEditCache(): void {
    if (this.dataTableDetail) {
      this.dataTableDetail.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: {...this.dataTableDetail[stt]},
      edit: false
    };
  }

  async saveDinhMuc(idx: number) {
    let msgRequired = this.required(this.dataEdit[idx].data)
    if (msgRequired) {
      this.notification.warning(MESSAGE.WARNING, msgRequired);
      this.spinner.hide();
      return;
    }
    let listTenLh = []
    this.dataEdit[idx].data.loaiHinh.forEach(item => {
      switch (item) {
        case '00' : {
          listTenLh.push('Nhập');
          break;
        }
        case '01' : {
          listTenLh.push('Xuất');
          break;
        }
        case '02' : {
          listTenLh.push('Bảo quản');
          break;
        }
      }
    })
    this.dataEdit[idx].data.tenLoaiHinh = listTenLh.toString();
    this.dataEdit[idx].data.loaiHinh = this.dataEdit[idx].data.loaiHinh.toString();
    Object.assign(this.dataTableDetail[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
    this.updateEditCache();
  }

  deleteItem(index: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTableDetail.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  changeDm(event, type?: any) {
    let result = this.listDmTaiSan.filter(item => item.maTaiSan == event)
    if (result && result.length > 0) {
      if (!type) {
        this.rowItem.tenTaiSan = result[0].tenTaiSan;
        this.rowItem.donViTinh = result[0].dviTinh;
      } else {
        type.donViTinh = result[0].dviTinh;
        type.tenTaiSan = result[0].tenTaiSan;
      }
    }
  }

  refresh() {
    this.rowItem = new DinhMucTrangBiMm();
  }
}

export class DinhMucTrangBiMm {
  donGiaTd: number;
  donViTinh: string;
  ghiChu: string;
  id: number;
  maTaiSan: string;
  tenTaiSan: string;
  slChiCuc: number;
  slVpCucKv: number;
  klChiCuc: number;
  loaiHinh: any;
  tenLoaiHinh: string;
  isCanCu : boolean = false;
}
