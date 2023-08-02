import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "src/app/components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "src/app/services/donvi.service";
import {MESSAGE} from "src/app/constants/message";
import {HSKT_LOAI_DOI_TUONG} from "src/app/constants/status";
import {BaseService} from "src/app/services/base.service";
import {
  BienBanLayMauComponent
} from "src/app/pages/xuat/kiem-tra-chat-luong/bien-ban-lay-mau/bien-ban-lay-mau.component";
import {KhCnQuyChuanKyThuat} from "src/app/services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {Validators} from "@angular/forms";
import {FileDinhKem} from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import {v4 as uuidv4} from "uuid";
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-chi-tiet-phieu-kiem-nghiem-chat-luong',
  templateUrl: './chi-tiet-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./chi-tiet-phieu-kiem-nghiem-chat-luong.component.scss']
})
export class ChiTietPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input() inputService: any;
  @Input() inputServiceGnv: BaseService;
  @Input() inputData: any;
  @Input() isView: any = false;
  radioValue: any;
  listFileDinhKem: any;
  canCu: any;
  daiDienRow: any = {};
  isDisable: any = true;
  viewTableDaiDien: any[] = [];
  viewPpLayMau: any[] = [];
  viewCtChatLuong: any[] = [];
  dsPpLayMau: any[] = [];
  dsCtChatLuong: any[] = [];
  dsQdGnv: any;
  dsDiaDiem: any;
  maHauTo: any;
  public vldTrangThai: BienBanLayMauComponent;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
              private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, null);
    this.formData = this.fb.group({
      id: [],
      nam: [],
      maDvi: [],
      soBbQd: [, [Validators.required]],
      maDiaDiem: [],
      loaiVthh: [],
      cloaiVthh: [],
      tenVthh: [],
      lyDoTuChoi: [],
      trangThai: ['00'],
      nguoiKyQdId: [],
      ngayKyQd: [],
      ngayGduyet: [],
      nguoiGduyetId: [],
      ngayPduyet: [],
      ngayKyQdGnv: [],
      nguoiPduyetId: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      tenTrangThai: ['Dự thảo'],
      tenDvi: [],
      tenCuc: [],
      tenChiCuc: [],
      tenDiemKho: [],
      tenNhaKho: [],
      tenNganKho: [],
      tenLoKho: [],
      maQhns: [],
      idQdGnv: [],
      soQdGnv: [],
      idHopDong: [],
      soHopDong: [],
      idBangKe: [],
      soBangKe: [],
      ngayKy: [],
      ktvBaoQuan: [],
      dviKiemNghiem: [],
      diaDiemLayMau: [],
      soLuongMau: [],
      niemPhong: [],
      loaiBb: ['LMBGM'],
      type: [],
      fileDinhKem: [new Array<FileDinhKem>()],
      canCu: [new Array<FileDinhKem>()],
      anhChupMauNiemPhong: [new Array<FileDinhKem>()],
      xhBienBanLayMauDtl: [new Array()],
      ppLayMau: [],
      chiTieuKiemTra: [],
      ngayTao: []
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      super.service = this.inputService;
      this.maHauTo = '/BBLM-' + this.userInfo.DON_VI.tenVietTat;
      await Promise.all([
        this.loadDsQdGnv()
      ]);
      await this.loadDetail();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDetail() {
    if (this.idSelected > 0) {
      await this.service.getDetail(this.idSelected)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data.soQd) {
              this.maHauTo = '/' + res.data.soQd?.split("/")[1];
              res.data.soBbQd = res.data.soBbQd?.split("/")[0];
            }
            this.formData.patchValue(res.data);
            this.formData.value.xhBienBanLayMauDtl.forEach(s => {
              s.idVirtual = uuidv4();
            });
            await this.buildTableView();
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else if (this.inputData) {
      await this.bindingQdGnv(this.inputData.idQdGnv);
    }
  }

  async themDaiDien() {
    if (this.daiDienRow.ten && this.daiDienRow.loai) {
      this.daiDienRow.type = HSKT_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN;
      this.daiDienRow.idVirtual = uuidv4();
      let newData = [...this.formData.value.xhBienBanLayMauDtl, this.daiDienRow];
      this.formData.patchValue({xhBienBanLayMauDtl: newData});
      await this.buildTableView();
      this.daiDienRow = {};
    }
  }

  async nhapLaiDaiDien() {
    this.daiDienRow = {};
  }

  async suaDaiDien(item) {
    await this.buildTableView();
    this.viewTableDaiDien.forEach(s => s.edit = false);
    let currentRow = this.viewTableDaiDien.find(s => s.idVirtual == item.idVirtual);
    currentRow.edit = true;
  }

  async luuDaiDien(item) {
    let newValue = cloneDeep(this.formData.value.xhBienBanLayMauDtl);
    let index = newValue.findIndex(s => s.idVirtual == item.idVirtual);
    item.edit = false;
    newValue.splice(index, 1, item);
    this.formData.patchValue({xhBienBanLayMauDtl: newValue});
    await this.buildTableView();
  }

  async huySuaDaiDien() {
    await this.buildTableView();
    this.viewTableDaiDien.forEach(s => s.edit = false);
  }

  async xoaDaiDien(item) {
    let newValue = cloneDeep(this.formData.value.xhBienBanLayMauDtl);
    let index = newValue.findIndex(s => s.idVirtual == item.idVirtual);
    newValue.splice(index, 1);
    this.formData.patchValue({xhBienBanLayMauDtl: newValue});
    await this.buildTableView();
  }

  async buildTableView() {
    this.viewTableDaiDien = cloneDeep(this.formData.value.xhBienBanLayMauDtl.filter(s => s.type == HSKT_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN));
    // this.viewTableHoSo = cloneDeep(this.formData.value.xhBienBanLayMauDtl.filter(s => s.type == HSKT_LOAI_DOI_TUONG.HO_SO));
  }

  async loadDsPpLayMau() {
    this.danhMucService.loadDanhMucHangChiTiet(this.formData.value.loaiVthh).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.ppLayMau && res.data.ppLayMau.length > 0) {
          res.data.ppLayMau.forEach(item => {
            let option = {
              label: item.giaTri,
              value: item.ma,
              checked: true
            }
            this.dsPpLayMau.push(option);
          });
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    });
  }

  async loadDsCtChatLuong() {
    this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(this.formData.value.cloaiVthh).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          res.data.ppLayMau.forEach(item => {
            let option = {
              label: item.tenChiTieu,
              value: item.id,
              checked: true
            }
            this.dsCtChatLuong.push(option);
          });
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    });
  }

  async loadDsQdGnv() {
    await this.inputServiceGnv.search({
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      }
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.dsQdGnv = res.data.content;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    });
  }

  openDialogSoQdGnv() {

    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH SỐ QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsQdGnv,
        dataHeader: ['Số quyết định xuất hàng', 'Trích yếu', 'Ngày ký'],
        dataColumn: ['soBbQd', 'trichYeu', 'ngayKy']
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          maDiaDiem: null,
          loaiVthh: null,
          cloaiVthh: null,
          tenLoaiVthh: null,
          tenCloaiVthh: null,
          tenDiemKho: null,
          tenNhaKho: null,
          tenNganKho: null,
          tenLoKho: null,
        });
        await this.bindingQdGnv(data.id);
      }
    });
  }

  openDialogDiaDiem() {
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH ĐỊA ĐIỂM HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsDiaDiem,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Tên loại', 'Tên chủng loại'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          maDiaDiem: data.maLoKho ? data.maLoKho : data.maNganKho,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          tenDiemKho: data.tenDiemKho,
          tenNhaKho: data.tenNhaKho,
          tenNganKho: data.tenNganKho,
          tenLoKho: data.tenLoKho,
        });
        await this.loadDsPpLayMau();
        await this.loadDsCtChatLuong();
      }
    });
  }

  async changeValueQdGnv($event) {
    if ($event) {
      await this.inputServiceGnv.search({});

    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = {
      ...this.formData.value,
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null
    }
    console.log(body);
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    let body = {...this.formData.value, soBbQd: this.formData.value.soBbQd + this.maHauTo}
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  async bindingQdGnv(idQdGnv) {
    let res = await this.inputServiceGnv.getDetail(idQdGnv);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data.noiDungCuuTro) {
        this.dsDiaDiem = res.data.noiDungCuuTro;
        this.formData.patchValue({
          idQdGnv: res.data.id,
          soQdGnv: res.data.soQd,
          ngayKyQdGnv: res.data.ngayKy
        })
      } else if (res.data.quyetDinhDtl) {
        this.dsDiaDiem = res.data.quyetDinhDtl;
        this.formData.patchValue({
          idQdGnv: res.data.id,
          soQdGnv: res.data.soBbQd,
          ngayKyQdGnv: res.data.ngayKy
        })
      }
    }
  }
}
