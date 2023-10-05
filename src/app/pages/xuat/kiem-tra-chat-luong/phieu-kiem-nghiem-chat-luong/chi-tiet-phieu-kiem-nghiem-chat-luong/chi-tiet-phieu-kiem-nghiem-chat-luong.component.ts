import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import { BBLM_LOAI_DOI_TUONG, HSKT_LOAI_DOI_TUONG, LOAI_DOI_TUONG, STATUS } from 'src/app/constants/status';
import { BaseService } from 'src/app/services/base.service';
import { saveAs } from 'file-saver';
import {
  BienBanLayMauComponent,
} from 'src/app/pages/xuat/kiem-tra-chat-luong/bien-ban-lay-mau/bien-ban-lay-mau.component';
import { KhCnQuyChuanKyThuat } from 'src/app/services/kh-cn-bao-quan/KhCnQuyChuanKyThuat';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Validators } from '@angular/forms';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {
  DialogTableSelectionComponent,
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { PREVIEW } from '../../../../../constants/fileType';
import printJS from 'print-js';

@Component({
  selector: 'app-chi-tiet-phieu-kiem-nghiem-chat-luong',
  templateUrl: './chi-tiet-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./chi-tiet-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class ChiTietPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input() loaiXuat: any;
  @Input() inputService: any;
  @Input() inputServiceGnv: BaseService;
  @Input() inputServiceBbLayMau: BaseService;
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
  dsPpKiemTra: any[] = [];
  dsCtChatLuong: any[] = [];
  dsQdGnv: any;
  dsBbLayMau: any;
  dsDiaDiem: any;
  maHauTo: any;
  public vldTrangThai: BienBanLayMauComponent;
  templateName = 'phieu_khiem_nghiem_cl';

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
      nguoiPduyetId: [],
      mapVthh: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      tenTrangThai: ['Dự thảo'],
      mapDmucDvi: [],
      tenDvi: [],
      tenCuc: [],
      tenChiCuc: [],
      tenDiemKho: [],
      tenNhaKho: [],
      tenNganKho: [],
      tenLoKho: [],
      donViTinh: [],
      maQhns: [],
      idQdGnv: [],
      soQdGnv: [, [Validators.required]],
      ngayKyQdGnv: [],
      idBbLayMau: [],
      soBbLayMau: [],
      ngayBbLayMau: [],
      soBbTinhKho: [],
      ngayBbTinhKho: [],
      ngayKiemNghiem: [],
      ktvBaoQuan: [],
      dviKiemNghiem: [],
      ketQua: [],
      ketLuan: [],
      loaiBb: [],
      type: [],
      fileDinhKem: [new Array<FileDinhKem>()],
      xhPhieuKnclDtl: [new Array()],
      ppLayMau: [new Array()],
      ctChatLuong: [new Array()],
      ngayTao: [],
    });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      super.service = this.inputService;
      this.maHauTo = '/PKNCL-' + this.userInfo.DON_VI.tenVietTat;
      await Promise.all([
        this.loadDsQdGnv(),
        this.loadDsPplm(),
      ]);
      await this.loadDetail();
    } catch (e) {
      console.log('error: ', e);
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
            if (res.data.soBbQd) {
              this.maHauTo = '/' + res.data.soBbQd?.split('/')[1];
              res.data.soBbQd = res.data.soBbQd?.split('/')[0];
            }
            this.formData.patchValue(res.data);
            /*this.formData.patchValue({
              "ngayTao": "2023-08-02T15:17:31.414",
              "nguoiTaoId": 1965,
              "ngaySua": "2023-08-02T15:17:31.414",
              "nguoiSuaId": 1965,
              "id": 21,
              "nam": null,
              "maDvi": "01010208",
              "soBbQd": null,
              "maDiaDiem": null,
              "loaiVthh": null,
              "cloaiVthh": null,
              "tenVthh": null,
              "lyDoTuChoi": null,
              "trangThai": "00",
              "nguoiKyQdId": null,
              "ngayKyQd": null,
              "ngayGduyet": null,
              "nguoiGduyetId": null,
              "ngayPduyet": null,
              "nguoiPduyetId": null,
              "tenLoaiVthh": null,
              "tenCloaiVthh": null,
              "tenTrangThai": "Dự thảo",
              "tenDvi": null,
              "tenCuc": null,
              "tenChiCuc": null,
              "tenDiemKho": null,
              "tenNhaKho": null,
              "tenNganKho": null,
              "tenLoKho": null,
              "donViTinh": null,
              "maQhns": null,
              "idQdGnv": null,
              "soQdGnv": "123/QD",
              "ngayKyQdGnv": null,
              "idBbLayMau": null,
              "soBbLayMau": null,
              "ngayBbLayMau": null,
              "ngayKiemNghiem": null,
              "ketQua": null,
              "ketLuan": null,
              "loaiBb": "LMBGM",
              "type": null,
              "fileDinhKem": [],
              "xhPhieuKnclDtl": [{ten: "Lấy mẫu ngẫu nhiên", type: "PPLM"}]
            })*/
            this.formData.value.xhPhieuKnclDtl.forEach(s => {
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
    } else {
      this.formData.patchValue({ type: this.loaiXuat })
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    this.formData.controls.soQdGnv.setValidators([Validators.required]);
    let body = {
      ...this.formData.value,
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null,
    };
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    let body = { ...this.formData.value, soBbQd: this.formData.value.soBbQd + this.maHauTo };
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  async themDaiDien() {
    if (this.daiDienRow.ten && this.daiDienRow.loai) {
      this.daiDienRow.type = HSKT_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN;
      this.daiDienRow.idVirtual = uuidv4();
      let newData = [...this.formData.value.xhPhieuKnclDtl, this.daiDienRow];
      this.formData.patchValue({ xhPhieuKnclDtl: newData });
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
    let newValue = cloneDeep(this.formData.value.xhPhieuKnclDtl);
    let index = newValue.findIndex(s => s.idVirtual == item.idVirtual);
    item.edit = false;
    newValue.splice(index, 1, item);
    this.formData.patchValue({ xhPhieuKnclDtl: newValue });
    await this.buildTableView();
  }

  async huySuaDaiDien() {
    await this.buildTableView();
    this.viewTableDaiDien.forEach(s => s.edit = false);
  }

  async xoaDaiDien(item) {
    let newValue = cloneDeep(this.formData.value.xhPhieuKnclDtl);
    let index = newValue.findIndex(s => s.idVirtual == item.idVirtual);
    newValue.splice(index, 1);
    this.formData.patchValue({ xhPhieuKnclDtl: newValue });
    await this.buildTableView();
  }

  async buildTableView() {
    this.viewTableDaiDien = cloneDeep(this.formData.value.xhPhieuKnclDtl.filter(s => s.type == BBLM_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN));

    let ppLayMau = cloneDeep(this.formData.value.xhPhieuKnclDtl.filter(s => s.type == LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU));
    let ppLayMauArr = ppLayMau.map(s => s.ten);
    this.dsPpLayMau.forEach(s => {
      if (ppLayMauArr.includes(s.giaTri)) {
        s.selected = true;
      }
    });

    this.viewCtChatLuong = this.formData.value.xhPhieuKnclDtl.filter(s => s.type == BBLM_LOAI_DOI_TUONG.CHI_TIEU_CHAT_LUONG);
  }

  async loadDsPpLayMau() {
    this.danhMucService.loadDanhMucHangChiTiet(this.formData.value.loaiVthh).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.ppLayMau && res.data.ppLayMau.length > 0) {
          res.data.ppLayMau.forEach(item => {
            let option = {
              label: item.giaTri,
              value: item.ma,
              checked: true,
            };
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

  async loadDsPplm() {
    let res = await this.danhMucService.danhMucChungGetAll('PP_LAY_MAU');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsPpLayMau = res.data;
    }
  }

  async loadDsCtChatLuong() {
    this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(this.formData.value.cloaiVthh).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          res.data.ppLayMau.forEach(item => {
            let option = {
              label: item.tenChiTieu,
              value: item.id,
              checked: true,
            };
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
        page: 0,
      },
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
        dataColumn: ['soBbQd', 'trichYeu', 'ngayKy'],
      },
    });
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
        //load ds bb lay mau
        await this.inputServiceBbLayMau.search({
          type: 'CTVT',
          paggingReq: {
            limit: this.globals.prop.MAX_INTERGER,
            page: 0,
          },
        }).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              this.dsBbLayMau = res.data.content;
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }).catch(err => {
          this.notification.error(MESSAGE.ERROR, err.msg);
        });
      }
    });
  }

  openDialogBbLayMau() {
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH BIÊN BẢN LẤY MẪU BÀN GIAO MẪU',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsBbLayMau,
        dataHeader: ['Số biên bản', 'Trích yếu', 'Ngày ký'],
        dataColumn: ['soBbQd', 'trichYeu', 'ngayKy'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          ngayLayMau: null,
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
        await this.bindingBbLayMau(data.id);
        // await this.loadDsPpLayMau();
        // await this.loadDsCtChatLuong();
      }
    });
  }


  async bindingQdGnv(idQdGnv) {
    await this.spinner.show();
    try {
      let res = await this.inputServiceGnv.getDetail(idQdGnv);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data.noiDungCuuTro) {
          this.dsDiaDiem = res.data.noiDungCuuTro;
          this.formData.patchValue({
            idQdGnv: res.data.id,
            soQdGnv: res.data.soQd,
            ngayKyQdGnv: res.data.ngayKy,
          });
        } else if (res.data.quyetDinhDtl) {
          this.dsDiaDiem = res.data.quyetDinhDtl;
          this.formData.patchValue({
            idQdGnv: res.data.id,
            soQdGnv: res.data.soBbQd,
            ngayKyQdGnv: res.data.ngayKy,
          });
        } else if (res.data.dataDtl) {
          this.dsDiaDiem = res.data.dataDtl;
          this.formData.patchValue({
            idQdGnv: res.data.id,
            soQdGnv: res.data.soBbQd,
            ngayKyQdGnv: res.data.ngayKy,
          });
        }
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async bindingBbLayMau(idBbLayMau) {
    await this.spinner.show();
    try {
      let res = await this.inputServiceBbLayMau.getDetail(idBbLayMau);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data.noiDungCuuTro) {
          this.dsDiaDiem = res.data.noiDungCuuTro;
          this.formData.patchValue({
            idQdGnv: res.data.id,
            soQdGnv: res.data.soQd,
            ngayKyQdGnv: res.data.ngayKy,
          });
        } else if (res.data) {
          let data = res.data;
          data.xhBienBanLayMauDtl.forEach(s => {
            delete s.id,
              s.danhGia = 'Đạt';
          });
          this.formData.patchValue({
            idBbLayMau: data.id,
            soBbLayMau: data.soBbQd,
            ngayBbLayMau: data.ngayTao,
            maDiaDiem: data.maDiaDiem,
            loaiVthh: data.loaiVthh,
            cloaiVthh: data.cloaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            tenDiemKho: data.tenDiemKho,
            tenNhaKho: data.tenNhaKho,
            tenNganKho: data.tenNganKho,
            tenLoKho: data.tenLoKho,
            xhPhieuKnclDtl: data.xhBienBanLayMauDtl
          });
          await this.buildTableView();

        }
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangePpLayMau($event: any) {
    let xhPhieuKnclDtl = this.formData.value.xhPhieuKnclDtl;
    xhPhieuKnclDtl = xhPhieuKnclDtl.filter(s => s.type != LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU);
    let newData = [];
    $event.forEach(s => {
      xhPhieuKnclDtl = [...xhPhieuKnclDtl, { ten: s, type: LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU }];
    });
    this.formData.patchValue({ xhPhieuKnclDtl: xhPhieuKnclDtl });
    await this.buildTableView();
  }

  async preview(id) {
    this.spinner.show();
    await this.service.preview({
      tenBaoCao: this.templateName,
      id: id,
    }).then(async res => {
      if (res.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.printSrc = res.data.pdfSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, 'Lỗi trong quá trình tải file.');
      }
    });
    this.spinner.hide();
  }

  downloadPdf() {
    saveAs(this.pdfSrc, this.templateName + '.pdf');
  }

  downloadWord() {
    saveAs(this.wordSrc, this.templateName + '.docx');
  }

  printPreview() {
    printJS({ printable: this.printSrc, type: 'pdf', base64: true });
  }
  duyet() {
    let trangThai = '';
    let msg = 'Bạn có muốn duyệt phiếu kiểm nghiệm này';
    const MSG = MESSAGE.DUYET_SUCCESS;
    switch (this.formData.value.trangThai) {
      case this.STATUS.CHO_DUYET_TP:
        trangThai = this.STATUS.CHO_DUYET_LDC
        break;
      case this.STATUS.CHO_DUYET_LDC:
        trangThai = this.STATUS.DA_DUYET_LDC
        break;
    }
    this.approve(this.idSelected, trangThai, msg, null, MSG);
  }
  tuChoi() {
    let trangThai = '';
    // let msg='Bạn có muốn từ chối phiếu kiểm nghiệm này';
    const MSG = MESSAGE.TU_CHOI_SUCCESS;
    switch (this.formData.value.trangThai) {
      case this.STATUS.CHO_DUYET_TP:
        trangThai = this.STATUS.TU_CHOI_TP
        break;
      case this.STATUS.CHO_DUYET_LDC:
        trangThai = this.STATUS.TU_CHOI_LDC
        break;
    }
    this.reject(this.idSelected, trangThai);
  }
  checkRoleDuyet(trangThai: STATUS): boolean {
    if (trangThai === this.STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson("") || trangThai === this.STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson("XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_DUYET_LDCCUC")) {
      return false
    }

    return false
  }
  checkRoleLuu(trangThai: STATUS): boolean {
    if ([this.STATUS.DU_THAO, this.STATUS.TU_CHOI_TP, this.STATUS.TU_CHOI_LDC].includes(trangThai) && this.userService.isAccessPermisson("")) {
      return true
    }
    return false
  }
}
