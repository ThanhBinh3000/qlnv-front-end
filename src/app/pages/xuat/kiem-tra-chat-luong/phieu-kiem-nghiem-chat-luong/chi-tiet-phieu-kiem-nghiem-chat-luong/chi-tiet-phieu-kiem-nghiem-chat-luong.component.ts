import { MangLuoiKhoService } from './../../../../../services/qlnv-kho/mangLuoiKho.service';
import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import { BBLM_LOAI_DOI_TUONG, HSKT_LOAI_DOI_TUONG, LOAI_DOI_TUONG, STATUS, HINH_THUC_KE_LOT_BAO_QUAN } from 'src/app/constants/status';
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
import { cloneDeep, uniqBy } from 'lodash';
import { PREVIEW } from '../../../../../constants/fileType';
import printJS from 'print-js';
import { MA_QUYEN_PKNCL } from './../phieu-kiem-nghiem-chat-luong.component';
import dayjs from 'dayjs';

@Component({
  selector: 'app-chi-tiet-phieu-kiem-nghiem-chat-luong',
  templateUrl: './chi-tiet-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./chi-tiet-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class ChiTietPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input() loaiXuat: string;
  @Input() loaiVthh: string;
  @Input() inputService: any;
  @Input() inputServiceGnv: BaseService;
  @Input() inputServiceBbLayMau: BaseService;
  @Input() inputData: any;
  @Input() isView: any = false;
  @Input() maQuyen: MA_QUYEN_PKNCL = { THEM: '', XOA: '', XEM: '', DUYET_TP: '', DUYET_LDC: '', IN: '', EXPORT: '' };
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
  dsPpKiemTra: any[] = [];
  dsCtChatLuong: any[] = [];
  dsQdGnv: any;
  dsBbLayMau: any;
  dsDiaDiem: any;
  maHauTo: any;
  dsHinhThucBq: any[];
  public vldTrangThai: BienBanLayMauComponent;
  templateName = 'phieu_khiem_nghiem_cl';
  listDiaDiemNhap: any[];
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private danhMucService: DanhMucService,
    private mangLuoiKhoService: MangLuoiKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, null);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
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
      ngayKiemNghiem: [dayjs().format("YYYY-MM-DD")],
      ktvBaoQuan: [],
      dviKiemNghiem: [],
      truongPhong: [],
      lanhDaoCuc: [],
      ketQua: [],
      ketLuan: [],
      loaiBb: [],
      type: [],
      fileDinhKem: [new Array<FileDinhKem>()],
      xhPhieuKnclDtl: [new Array()],
      ppLayMau: [new Array()],
      ctChatLuong: [new Array()],
      ngayLapPhieu: [dayjs().format("YYYY-MM-DD")],
      thuKho: [],
      hinhThucBaoQuan: [new Array()],
      tenNganLoKho: [],
      ketLuanCuoi: [],
      slHangBaoQuan: []
    });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      super.service = this.inputService;
      // this.maHauTo = '/' + this.formData.value.nam + '/PKNCL-' + this.userInfo.DON_VI.tenVietTat;
      this.maHauTo = '/PKNCL-' + this.userInfo.DON_VI.tenVietTat;
      await Promise.all([
        this.loadDsQdGnv(),
        // this.loadDsPplm(),
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
            this.formData.patchValue({ ...res.data, tenNganLoKho: res.data.tenLoKho ? `${res.data.tenLoKho} - ${res.data.tenNganKho}` : res.data.tenNganKho });
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
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        tenChiCuc: this.userInfo.TEN_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        ktvBaoQuan: this.userInfo.TEN_DAY_DU,
      })
      if (this.inputData) {
        await this.bindingQdGnv(this.inputData.idQdGnv);
        this.loadDsBbLayMau();
      } else {
        this.formData.patchValue({ type: this.loaiXuat })
      }
    }
  }
  async loadDanhSachHinhThucBaoQuan(cloaiVthh: string) {
    if (!cloaiVthh) return;
    const res = await this.danhMucService.loadDanhMucHangChiTiet(cloaiVthh);
    if (res.msg === MESSAGE.SUCCESS) {
      const dsHinhThucBq = Array.isArray(res.data.hinhThucBq) ? res.data.hinhThucBq.map(item => ({ ten: item.giaTri, label: item.giaTri, value: item.ma, type: HINH_THUC_KE_LOT_BAO_QUAN.PHUONG_PHAP_BAO_QUAN })) : [];
      this.formData.patchValue({ xhPhieuKnclDtl: [...this.formData.value.xhPhieuKnclDtl.filter(f => f.type !== HINH_THUC_KE_LOT_BAO_QUAN.PHUONG_PHAP_BAO_QUAN), ...dsHinhThucBq] });
    }
  }
  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    this.formData.controls.soQdGnv.setValidators([Validators.required]);
    let body = {
      ...this.formData.value,
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd : this.maHauTo,
    };
    const data = await this.createUpdate(body);
    if (data) {
      this.formData.patchValue({ soBbQd: data.soBbQd })
    }
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    let body = { ...this.formData.value, soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd : this.maHauTo };
    // await super.saveAndSend(body, trangThai, msg, msgSuccess);
    await this.helperService.ignoreRequiredForm(this.formData);
    const data = await this.createUpdate(body, null, true);
    if (data) {
      this.formData.patchValue({ soBbQd: data.soBbQd });
      await this.helperService.restoreRequiredForm(this.formData);
      this.approve(data.id, trangThai, msg, null, msgSuccess)
    }
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

    // let ppLayMau = cloneDeep(this.formData.value.xhPhieuKnclDtl.filter(s => s.type == LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU));
    // let ppLayMauArr = ppLayMau.map(s => s.ten);
    // this.dsPpLayMau.forEach(s => {
    //   if (ppLayMauArr.includes(s.giaTri)) {
    //     s.selected = true;
    //   }
    // });
    this.viewCtChatLuong = this.formData.value.xhPhieuKnclDtl.filter(s => s.type == BBLM_LOAI_DOI_TUONG.CHI_TIEU_CHAT_LUONG);
    this.dsPpLayMau = [];
    this.dsHinhThucBq = [];
    this.formData.value.xhPhieuKnclDtl.forEach(item => {
      if (item.type === BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU) {
        this.dsPpLayMau.push({ ...item, label: item.ten, giaTri: item.ten, checked: true })
      }
      if (item.type === HINH_THUC_KE_LOT_BAO_QUAN.PHUONG_PHAP_BAO_QUAN) {
        this.dsHinhThucBq.push({ ...item, label: item.ten, giaTri: item.ten, checked: true })
      }
    });
    this.formData.patchValue({ ppLayMau: this.dsPpLayMau, hinhThucBaoQuan: this.dsHinhThucBq });
    // const hangBaoQuan = this.formData.value.xhPhieuKnclDtl.find(s => s.type === 'SO_LUONG_HANG_BAO_QUAN');
    // this.formData.patchValue({ ppLayMau: this.dsPpLayMau, hinhThucBaoQuan: this.dsHinhThucBq, slHangBaoQuan: hangBaoQuan?.soLuong ? hangBaoQuan?.soLuong : '' });
  }

  async loadDsPpLayMau() {
    const res = await this.danhMucService.loadDanhMucHangChiTiet(this.formData.value.cloaiVthh || this.formData.value.loaiVthh)
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.ppLayMau && res.data.ppLayMau.length > 0) {
        res.data.ppLayMau.forEach(item => {
          let option = {
            ten: item.giaTri,
            value: item.ma,
            checked: true,
            type: BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU
          };
          this.dsPpLayMau.push(option);
        });
        console.log("this.dsPpLayMau", this.dsPpLayMau)
        const xhPhieuKnclDtl = this.formData.value.xhPhieuKnclDtl.filter(f => f.type !== BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU).concat(this.dsPpLayMau)
        this.formData.patchValue({ xhPhieuKnclDtl })
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsPplm() {
    let res = await this.danhMucService.danhMucChungGetAll('PP_LAY_MAU');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsPpLayMau = res.data;
    }
  }

  async loadDsCtChatLuong() {
    const res = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(this.formData.value.cloaiVthh)
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        // res.data.ppLayMau.forEach(item => {
        //   let option = {
        //     label: item.tenChiTieu,
        //     value: item.id,
        //     checked: true,
        //   };
        //   this.dsCtChatLuong.push(option);
        // });
        Array.isArray(res.data) && res.data.forEach(element => {
          const option = {
            ten: element.tenChiTieu,
            chiSoCl: element.mucYeuCauXuat,
            phuongPhap: element.phuongPhapXd,
            type: BBLM_LOAI_DOI_TUONG.CHI_TIEU_CHAT_LUONG,
          }
          this.dsCtChatLuong.push(option);
        });
        const xhPhieuKnclDtl = this.formData.value.xhPhieuKnclDtl.filter(f => f.type !== BBLM_LOAI_DOI_TUONG.CHI_TIEU_CHAT_LUONG).concat(this.dsCtChatLuong)
        this.formData.patchValue({ xhPhieuKnclDtl })
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsQdGnv() {
    await this.inputServiceGnv.search({
      types: this.loaiXuat === "XC" ? ['XC'] : this.loaiXuat === "CTVT" ? ['TH', 'TTr'] : [],
      loaiVthh: this.loaiVthh,
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
  async loadDsBbLayMau() {
    try {
      if (!this.formData.value.soQdGnv && ['XC', 'CTVT'].includes(this.loaiXuat)) return;
      const [dataBBLM, dataPKNCL] = await Promise.all([this.getDSBienBanLayMau(), this.getDSPhieuKNCluong()]);
      let listPhieuKnCl = [];
      if (dataPKNCL.msg === MESSAGE.SUCCESS) {
        listPhieuKnCl = Array.isArray(dataPKNCL.data?.content) ? dataPKNCL.data.content : []
      }
      if (dataBBLM.msg === MESSAGE.SUCCESS) {
        const listBienBanLayMau = Array.isArray(dataBBLM.data?.content) ? dataBBLM.data.content : []
        this.dsBbLayMau = listBienBanLayMau.filter(item => !listPhieuKnCl.find(f => f.soBbLayMau === item) && item.soQdGnv === this.formData.value.soQdGnv);
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  async getDSPhieuKNCluong() {
    return await this.service.search({
      type: this.loaiXuat,
      soQdGiaoNvNh: this.formData.value.soQdGnv,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
    })
  }
  async getDSBienBanLayMau() {
    return await this.inputServiceBbLayMau.search({
      type: this.loaiXuat,
      soQdGiaoNvNh: this.formData.value.soQdGnv,
      trangThai: STATUS.DA_DUYET_LDCC,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
    })
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
        //load ds bb lay mau
        this.loadDsBbLayMau();
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
        dataHeader: ['Số biên bản', 'Ngày lấy mẫu'],
        dataColumn: ['soBbQd', 'ngayBbLayMau'],
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
          tenNganLoKho: null
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
        if (this.loaiXuat === 'XC') {
          this.listDiaDiemNhap = uniqBy(res.data.dataDtl, "maDvi").filter(f => f.tenNganKho && f.maDvi && f.maDvi.startsWith(this.userInfo.MA_DVI));;
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
            ngayBbLayMau: data.ngayBbLayMau,
            maDiaDiem: data.maDiaDiem,
            loaiVthh: data.loaiVthh,
            cloaiVthh: data.cloaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            tenDiemKho: data.tenDiemKho,
            tenNhaKho: data.tenNhaKho,
            tenNganKho: data.tenNganKho,
            tenLoKho: data.tenLoKho,
            tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
            xhPhieuKnclDtl: data.xhBienBanLayMauDtl,
            // donViTinh: data.donViTinh
          });
          if (data.cloaiVthh || data.loaiVthh) {
            await Promise.all([this.loadDanhSachHinhThucBaoQuan(data.cloaiVthh || data.loaiVthh), this.tenThuKho(data.maDiaDiem), this.kiemTraTonKho(data.maDiaDiem)])
          }
          this.buildTableView();

        }
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }
  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data, false);
    });
  }

  async bindingDataDdNhap(data, isChiTiet) {
    if (data) {
      const maDiaDiem = data.maDiaDiem || data.maLoKho || data.maNganKho || data.maDvi;
      this.formData.patchValue({
        maDiaDiem: maDiaDiem,
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
      await Promise.all([this.loadDsPpLayMau(), this.loadDanhSachHinhThucBaoQuan(data.cloaiVthh || data.loaiVthh), this.loadDsCtChatLuong(), this.tenThuKho(maDiaDiem), this.kiemTraTonKho(maDiaDiem)]);
      this.buildTableView();
    }
  }
  async tenThuKho(event) {
    if (!event) return;
    let body = {
      maDvi: event,
      capDvi: (event?.length / 2 - 1),
    };
    const detail = await this.mangLuoiKhoService.getDetailByMa(body);
    if (detail.statusCode == 0) {
      const detailThuKho = detail.data.object.detailThuKho;
      if (detailThuKho) {
        this.formData.patchValue({
          thuKho: detailThuKho.fullName,
        });
      }
      this.formData.patchValue({
        donViTinh: detail.data.object.dviTinh
      })
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
  async kiemTraTonKho(maDvi: string) {
    const { loaiVthh, cloaiVthh } = this.formData.value;
    const maVthh = cloaiVthh ? cloaiVthh : loaiVthh;
    if (!maDvi || !maVthh) return;
    const body = { maDvi, maVthh };
    // let tonKhoCloaiVthh: number = 0;
    const res = await this.mangLuoiKhoService.slTon(body);
    if (res.msg === MESSAGE.SUCCESS) {
      // this.formData.patchValue({ xhPhieuKnclDtl: [...this.formData.value.xhPhieuKnclDtl.filter(f => f.type !== 'SO_LUONG_HANG_BAO_QUAN'), { ten: 'Số lượng hàng bảo quản', soLuong: res.data, type: 'SO_LUONG_HANG_BAO_QUAN' }] });
      this.formData.patchValue({ slHangBaoQuan: res.data });
    }
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
    if (trangThai === this.STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson(this.maQuyen.DUYET_TP) || trangThai === this.STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson(this.maQuyen.DUYET_LDC)) {
      return true
    }

    return false
  }
  checkRoleLuu(trangThai: STATUS): boolean {
    if ([this.STATUS.DU_THAO, this.STATUS.TU_CHOI_TP, this.STATUS.TU_CHOI_LDC].includes(trangThai) && this.userService.isAccessPermisson(this.maQuyen.THEM)) {
      return true
    }
    return false
  }
  checkRoleIn(): boolean {
    if (this.userService.isAccessPermisson(this.maQuyen.IN)) {
      return true
    }
    return false
  }
}
