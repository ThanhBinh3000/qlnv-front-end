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
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep, includes } from 'lodash';
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
import { uniqBy } from 'lodash';
import { MangLuoiKhoService } from 'src/app/services/qlnv-kho/mangLuoiKho.service';
import { QuyetDinhPheDuyetPhuongAnCuuTroService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service';
import { AMOUNT_ONE_DECIMAL } from 'src/app/Utility/utils';
@Component({
  selector: 'app-chi-tiet-bien-ban-lay-mau',
  templateUrl: './chi-tiet-bien-ban-lay-mau.component.html',
  styleUrls: ['./chi-tiet-bien-ban-lay-mau.component.scss'],
})
export class ChiTietBienBanLayMauComponent extends Base2Component implements OnInit {
  @Input() loaiXuat: any;
  @Input() loaiVthh: string;
  @Input() inputService: any;
  @Input() inputServiceGnv: BaseService;
  @Input() inputData: any;
  @Input() isView: any = false;
  @Input() loaiChon: string;
  @Input() isViewOnModal: boolean;
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
  amount1 = { ...AMOUNT_ONE_DECIMAL, align: "left" }
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private danhMucService: DanhMucService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService
  ) {
    super(httpClient, storageService, notification, spinner, modal, null);
    this.formData = this.fb.group({
      id: [, [Validators.required]],
      nam: [dayjs().get("year")],
      maDvi: [],
      soBbQd: [, [Validators.required]],
      maDiaDiem: [, [Validators.required]],
      loaiVthh: [, [Validators.required]],
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
      tenLoaiVthh: [, [Validators.required]],
      tenCloaiVthh: [],
      tenTrangThai: ['Dự thảo'],
      tenDvi: [],
      tenCuc: [],
      tenChiCuc: [],
      tenDiemKho: [, [Validators.required]],
      tenNhaKho: [, [Validators.required]],
      tenNganKho: [, [Validators.required]],
      tenLoKho: [],
      maQhns: [, [Validators.required]],
      idQdGnv: [, [Validators.required]],
      soQdGnv: [, [Validators.required]],
      idHopDong: [],
      soHopDong: [],
      idBangKe: [],
      soBangKe: [],
      ngayKy: [],
      ktvBaoQuan: [],
      dviKiemNghiem: [, [Validators.required]],
      diaDiemLayMau: [, [Validators.required]],
      soLuongMau: [0, [Validators.required, Validators.min(1)]],
      niemPhong: [],
      loaiBb: ['LMBGM'],
      type: [],
      fileDinhKem: [new Array<FileDinhKem>()],
      canCu: [new Array<FileDinhKem>()],
      anhChupMauNiemPhong: [new Array<FileDinhKem>()],
      xhBienBanLayMauDtl: [new Array()],
      ppLayMau: [new Array()],
      ctChatLuong: [new Array()],
      ngayBbLayMau: [dayjs().format("YYYY-MM-DD")],
      donViTinh: [, [Validators.required]],
      thuKho: [],

      soQdPd: [],
      ngayKyQdPd: [],
      tenNganLoKho: [, [Validators.required]],
      truongBpBaoQuan: [, [Validators.required]],
      lanhDaoChiCuc: []
    });
    this.formData.controls['ppLayMau'].valueChanges.subscribe(value => {
      const ppLayMau = [{ ten: value, type: BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU }]
      const xhBienBanLayMauDtl = this.formData.value.xhBienBanLayMauDtl.filter(s => s.type !== BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU).concat(ppLayMau)
      this.formData.controls['xhBienBanLayMauDtl'].setValue(xhBienBanLayMauDtl)
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      super.service = this.inputService;
      // this.maHauTo = '/' + this.formData.value.nam + '/BBLM-' + this.userInfo.DON_VI.tenVietTat;
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
            // if (res.data.soBbQd) {
            //   this.maHauTo = '/' + res.data.soBbQd?.split('/')[1];
            //   res.data.soBbQd = res.data.soBbQd?.split('/')[0];
            // }
            this.formData.patchValue({ ...res.data, tenNganLoKho: res.data.tenLoKho ? `${res.data.tenLoKho} - ${res.data.tenNganKho}` : res.data.tenNganKho });
            this.formData.value.xhBienBanLayMauDtl.forEach(s => {
              s.idVirtual = uuidv4();
            });
            // await this.loadDsPpLayMau();
            // await this.loadDsCtChatLuong();
            await Promise.all([this.loadDsPpLayMau(), this.loadDsCtChatLuong(), this.bindingQdGnv(this.formData.value.idQdGnv)]);
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
      }
      this.formData.patchValue({ type: this.loaiXuat })
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

  async buildTableView() {
    //thanh phan lay mau
    this.viewTableDaiDien = cloneDeep(this.formData.value.xhBienBanLayMauDtl.filter(s => s.type == BBLM_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN));
    //phuong phap lay mau
    // Chi chon 1 phuong phap lay mau
    const ppLayMau = this.formData.value.xhBienBanLayMauDtl.find(s => s.type == BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU) ?
      this.formData.value.xhBienBanLayMauDtl.find(s => s.type == BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU).ten : "";
    //chi tieu can kiem tra
    const ctChatLuong = cloneDeep(this.formData.value.xhBienBanLayMauDtl.filter(s => s.type == BBLM_LOAI_DOI_TUONG.CHI_TIEU_CHAT_LUONG)).map(f => ({ ...f, checked: true, label: f.ten, value: f.ten }));
    this.formData.patchValue({ ctChatLuong, ppLayMau });
  }

  async loadDsPpLayMau() {
    this.dsPpLayMau = [];
    const res = await this.danhMucService.loadDanhMucHangChiTiet(this.formData.value.cloaiVthh || this.formData.value.loaiVthh);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.ppLayMau && res.data.ppLayMau?.length > 0) {
        this.dsPpLayMau = res.data.ppLayMau.map(item => ({ label: item.giaTri, value: item.ma, checked: false }))
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsCtChatLuong() {
    if (this.dsCtChatLuong.length <= 0) {
      const res = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(this.formData.value.cloaiVthh || this.formData.value.loaiVthh);
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
    }
  }

  async loadDsQdGnv() {
    if (['CTVT'].includes(this.loaiXuat)) {
      await this.inputServiceGnv.danhSach({
        loaiVthh: this.loaiVthh,
        trangThai: STATUS.BAN_HANH,
        listTrangThaiXh: [STATUS.DA_HOAN_THANH],
        types: ["TH", "TTr"],
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0,
        },
      }).then(res => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            this.dsQdGnv = Array.isArray(res.data) ? res.data : [];
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }).catch(err => {
        this.notification.error(MESSAGE.ERROR, err.msg);
      });
    }
    else {
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
        dataHeader: ['Số quyết định xuất hàng', 'Ngày ký', 'Mục đích xuất'],
        dataColumn: ['soBbQd', 'ngayKy', 'mucDichXuat'],
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
          tenNganLoKho: null
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
        await this.spinner.show();
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
          donViTinh: data.donViTinh,
          tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho
        });
        // await this.loadDsPpLayMau();
        // await this.loadDsCtChatLuong();
        await Promise.all([this.loadDsPpLayMau(), this.loadDsCtChatLuong()]);
        this.tenThuKho()
        if (this.loaiChon === "radio") {
          // Chi chon 1 phuong phap lay mau duy nhat
          let filter = this.formData.value.xhBienBanLayMauDtl.filter(s => s.type == BBLM_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN);
          let defaultCt = this.dsCtChatLuong.map(s => {
            return {
              ten: s.label,
              phuongPhap: s.phuongPhap,
              chiSoCl: s.chiSoCl,
              type: BBLM_LOAI_DOI_TUONG.CHI_TIEU_CHAT_LUONG
            }
          });
          filter.push(...defaultCt);
          this.formData.patchValue({ xhBienBanLayMauDtl: filter })
        } else {
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
        }
        // await this.buildTableView(true);
        await this.buildTableView();
        await this.spinner.hide();
      }
    });
  }
  async tenThuKho() {
    const maDiaDiem = this.formData.value.maDiaDiem;
    if (!maDiaDiem) return;
    let body = {
      maDvi: maDiaDiem,
      capDvi: (maDiaDiem?.length / 2 - 1),
    };
    const detail = await this.mangLuoiKhoService.getDetailByMa(body);
    if (detail.statusCode == 0) {
      const detailThuKho = detail.data.object.detailThuKho;
      if (detailThuKho) {
        this.formData.patchValue({
          tenThuKho: detailThuKho.fullName,
        });
      }
      // this.formData.patchValue({
      //   donViTinh: detail.data.object.donViTinh
      // })
    }
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
      // soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : this.maHauTo,
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd : this.maHauTo,

    };
    const data = await this.createUpdate(body);
    if (data) {
      this.formData.patchValue({ soBbQd: data.soBbQd })
    }
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    if (this.formData.value.xhBienBanLayMauDtl.filter(f => f.type === BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU).every(f => !f.ten)) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa chọn phương pháp lấy mẫu");
      return;
    }
    let body = { ...this.formData.value, soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd : this.maHauTo };
    // await super.saveAndSend(body, trangThai, msg, msgSuccess);
    await this.helperService.ignoreRequiredForm(this.formData);
    const data = await this.createUpdate(body, null, true);
    if (data) {
      this.formData.patchValue({ soBbQd: data.soBbQd });
      await this.helperService.restoreRequiredForm(this.formData);
      this.approve(data.id, trangThai, msg, null, msgSuccess)
    }
    this.formData.controls['truongBpBaoQuan'].clearValidators();
    this.formData.controls['truongBpBaoQuan'].updateValueAndValidity()
  }

  async bindingQdGnv(idQdGnv) {
    try {
      await this.spinner.show();
      //Get ds bien ban lay mau;
      let listBienBanLayMau = [];
      const bodyBblm = {
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0,
        },
        loaiVthh: this.loaiVthh,
        type: this.loaiXuat
      }
      const [resBblm, res] = await Promise.all([this.service.search(bodyBblm), this.inputServiceGnv.getDetail(idQdGnv)])
      if (resBblm.msg === MESSAGE.SUCCESS) {
        listBienBanLayMau = Array.isArray(resBblm.data?.content) ? resBblm.data.content : [];
      }
      // let res = await this.inputServiceGnv.getDetail(idQdGnv);
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
          // this.dsDiaDiem = uniqBy(res.data.dataDtl, "maDvi").filter(f => f.tenNganKho && f.maDvi && f.maDvi.startsWith(this.userInfo.MA_DVI) && listBienBanLayMau.every(b => b.maDiaDiem !== f.maDvi));
          this.dsDiaDiem = res.data.quyetDinhDtl;
          this.formData.patchValue({
            idQdGnv: res.data.id,
            soQdGnv: res.data.soBbQd,
            ngayKyQdGnv: res.data.ngayKy,
            soQdPd: res.data.soQdPd,
            ngayKyQdPd: res.data.ngayKyQdPd
          });
        }
      }
      if (this.loaiXuat === "CTVT" && res.data.idQdPd) {
        const resData = await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDetail(res.data.idQdPd);
        if (resData.msg === MESSAGE.SUCCESS) {
          this.formData.patchValue({ ngayKyQdPd: resData.data.ngayKy })
        }
      }
    } catch (error) {
      console.log("e", error)
    } finally {
      await this.spinner.hide();
    }

  }

  async onChangePpLayMau($event: any) {
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
