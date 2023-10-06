import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import { BBLM_LOAI_DOI_TUONG, HSKT_LOAI_DOI_TUONG, LOAI_DOI_TUONG } from 'src/app/constants/status';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { KhCnQuyChuanKyThuat } from 'src/app/services/kh-cn-bao-quan/KhCnQuyChuanKyThuat';
import { BaseService } from 'src/app/services/base.service';
import { saveAs } from 'file-saver';
import {
  DialogTableSelectionComponent,
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {
  BienBanLayMauComponent,
} from 'src/app/pages/xuat/kiem-tra-chat-luong/bien-ban-lay-mau/bien-ban-lay-mau.component';
import { Validators } from '@angular/forms';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { PREVIEW } from '../../../../../constants/fileType';
import printJS from 'print-js';
import dayjs from 'dayjs';

@Component({
  selector: 'app-chi-tiet-bien-ban-lay-mau',
  templateUrl: './chi-tiet-bien-ban-lay-mau.component.html',
  styleUrls: ['./chi-tiet-bien-ban-lay-mau.component.scss'],
})
export class ChiTietBienBanLayMauComponent extends Base2Component implements OnInit {
  @Input() loaiXuat: any;
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
  templateName = 'bien-ban-lay-mau';

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
      nam: [dayjs().get("year")],
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
      anhChupMauNiemPhong: [new Array<FileDinhKem>(), [Validators.required, Validators.minLength(1)]],
      xhBienBanLayMauDtl: [new Array()],
      ppLayMau: [new Array()],
      ctChatLuong: [new Array()],
      ngayTao: [],
    });
    this.formData.controls['ppLayMau'].valueChanges.subscribe(value => {
      const ppLayMau = Array.isArray(value) ? value.filter(f => !!f.checked).map(s => ({ ...s, ten: s.label, type: BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU })) : [];
      const xhBienBanLayMauDtl = this.formData.value.xhBienBanLayMauDtl.filter(s => s.type !== BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU).concat(ppLayMau)
      this.formData.controls['xhBienBanLayMauDtl'].setValue(xhBienBanLayMauDtl)
      // this.buildTableView();
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      super.service = this.inputService;
      this.maHauTo = '/BBLM-' + this.userInfo.DON_VI.tenVietTat;
      await Promise.all([
        this.loadDsQdGnv(),
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
            this.formData.value.xhBienBanLayMauDtl.forEach(s => {
              s.idVirtual = uuidv4();
            });
            await this.loadDsPpLayMau();
            await this.loadDsCtChatLuong();
            await this.buildTableView();
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenChiCuc: this.userInfo.TEN_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        ktvBaoQuan: this.userInfo.TEN_DAY_DU,
      })
      if (this.inputData) {
        await this.bindingQdGnv(this.inputData.idQdGnv);
      } else {
        this.formData.patchValue({ type: this.loaiXuat })
      }
    }
  }

  async themDaiDien() {
    if (this.daiDienRow.ten && this.daiDienRow.loai) {
      this.daiDienRow.type = HSKT_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN;
      this.daiDienRow.idVirtual = uuidv4();
      let newData = [...this.formData.value.xhBienBanLayMauDtl, this.daiDienRow];
      this.formData.patchValue({ xhBienBanLayMauDtl: newData });
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
    this.formData.patchValue({ xhBienBanLayMauDtl: newValue });
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
    this.formData.patchValue({ xhBienBanLayMauDtl: newValue });
    await this.buildTableView();
  }

  async buildTableView(isSelectKho?: boolean) {
    //thanh phan lay mau
    this.viewTableDaiDien = cloneDeep(this.formData.value.xhBienBanLayMauDtl.filter(s => s.type == BBLM_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN));

    //phuong phap lay mau
    let ppLayMauDtl = cloneDeep(this.formData.value.xhBienBanLayMauDtl.filter(s => s.type == BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU));
    let ppLayMauArr = ppLayMauDtl.map(s => s.ten);
    this.dsPpLayMau.forEach(s => {
      if (ppLayMauArr.includes(s.label) && !isSelectKho) {
        s.checked = true;
      } else {
        s.checked = false;
      }
    });
    this.formData.patchValue({ ppLayMau: this.dsPpLayMau })

    //chi tieu can kiem tra
    let ctChatLuongDtl = cloneDeep(this.formData.value.xhBienBanLayMauDtl.filter(s => s.type == BBLM_LOAI_DOI_TUONG.CHI_TIEU_CHAT_LUONG));
    let ctChatLuongArr = ctChatLuongDtl.map(s => s.ten);
    this.dsCtChatLuong.forEach(s => {
      if (ctChatLuongArr.includes(s.label)) {
        s.checked = true;
      } else {
        s.checked = false;
      }
    });
    this.formData.patchValue({ ctChatLuong: this.dsCtChatLuong })
  }

  async loadDsPpLayMau() {
    // if (this.dsPpLayMau.length <= 0) {
    //   await this.danhMucService.loadDanhMucHangChiTiet(this.formData.value.cloaiVthh || this.formData.value.loaiVthh).then(res => {
    //     if (res.msg == MESSAGE.SUCCESS) {
    //       if (res.data && res.data.ppLayMau && res.data.ppLayMau?.length > 0) {
    //         res.data.ppLayMau.forEach(item => {
    //           let option = {
    //             label: item.giaTri,
    //             value: item.giaTri,
    //             // checked: true,
    //             checked: false,
    //           };
    //           this.dsPpLayMau.push(option);
    //         });
    //       }
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, res.msg);
    //     }
    //   }).catch(err => {
    //     this.notification.error(MESSAGE.ERROR, err.msg);
    //   });
    // }
    this.dsPpLayMau = [];
    await this.danhMucService.loadDanhMucHangChiTiet(this.formData.value.cloaiVthh || this.formData.value.loaiVthh).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.ppLayMau && res.data.ppLayMau?.length > 0) {
          this.dsPpLayMau = res.data.ppLayMau.map(item => ({ label: item.giaTri, value: item.ma, checked: false }))
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    });
  }

  async loadDsCtChatLuong() {
    if (this.dsCtChatLuong.length <= 0) {
      await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(this.formData.value.cloaiVthh || this.formData.value.loaiVthh)
        .then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              res.data.forEach(item => {
                let option = {
                  label: item.tenChiTieu,
                  value: item.id,
                  chiSoCl: item.mucYeuCauXuat,
                  phuongPhap: item.phuongPhapXd,
                  type: item.maChiTieu,
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
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          maDiaDiem: data.maDiaDiem || data.maLoKho || data.maNganKho || data.maDvi,
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

        let filter = this.formData.value.xhBienBanLayMauDtl.filter(s => s.type == BBLM_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN);
        let defaultPp = this.dsPpLayMau.map(s => {
          return { ten: s.label, type: BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU }
        });
        let defaultCt = this.dsCtChatLuong.map(s => {
          return {
            ten: s.label,
            phuongPhap: s.phuongPhap,
            chiSoCl: s.chiSoCl,
            type: BBLM_LOAI_DOI_TUONG.CHI_TIEU_CHAT_LUONG
          }
        });
        filter.push(...defaultPp, ...defaultCt);
        this.formData.patchValue({ xhBienBanLayMauDtl: filter })
        await this.buildTableView(true);
      }
    });
  }

  async changeValueQdGnv($event) {
    if ($event) {
      await this.inputServiceGnv.search({});

    }
  }

  async save() {
    // await this.helperService.ignoreRequiredForm(this.formData);
    let body = {
      ...this.formData.value,
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null,
    };
    await this.createUpdate(body);
    // await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    let body = { ...this.formData.value, soBbQd: this.formData.value.soBbQd + this.maHauTo };
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
  }

  async onChangePpLayMau($event: any) {
    console.log($event)
    let xhBienBanLayMauDtl = this.formData.value.xhBienBanLayMauDtl;
    xhBienBanLayMauDtl = xhBienBanLayMauDtl.filter(s => s.type = LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU);
    let newData = [];
    $event.forEach(s => {
      xhBienBanLayMauDtl = [...xhBienBanLayMauDtl, { ten: s, type: LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU }];
    });
    this.formData.patchValue({ xhPhieuKnclDtl: xhBienBanLayMauDtl });
    await this.buildTableView();
  }

  async onChangeCtChatLuong($event: any) {
    console.log($event)
    let xhBienBanLayMauDtl = this.formData.value.xhBienBanLayMauDtl;
    xhBienBanLayMauDtl = xhBienBanLayMauDtl.filter(s => s.type != LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU);
    let newData = [];
    $event.forEach(s => {
      xhBienBanLayMauDtl = [...xhBienBanLayMauDtl, { ten: s, type: LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU }];
    });
    this.formData.patchValue({ xhPhieuKnclDtl: xhBienBanLayMauDtl });
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
}
