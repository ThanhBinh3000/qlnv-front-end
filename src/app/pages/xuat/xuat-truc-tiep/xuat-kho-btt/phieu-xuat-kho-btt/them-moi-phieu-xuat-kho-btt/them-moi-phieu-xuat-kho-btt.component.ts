import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import {
  PhieuXuatKhoBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/phieu-xuat-kho-btt.service';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import {
  PhieuKtraCluongBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/phieu-ktra-cluong-btt.service';
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import { BangKeBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/bang-ke-btt.service';
import { PREVIEW } from "../../../../../../constants/fileType";
import printJS from "print-js";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-them-moi-phieu-xuat-kho-btt',
  templateUrl: './them-moi-phieu-xuat-kho-btt.component.html',
  styleUrls: ['./them-moi-phieu-xuat-kho-btt.component.scss']
})
export class ThemMoiPhieuXuatKhoBttComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() idQdNv: number;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  maPhieu: string;
  flagInit: Boolean = false;
  dsSoQuyetDinhNv: any[] = [];
  dsPhieuXuatKho: any[] = [];
  listDiaDiemXuatHang: any[] = [];
  dsSoHopDong: any[] = [];
  dsBangkeBanLe: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongBttService: HopDongBttService,
    private phieuXuatKhoBttService: PhieuXuatKhoBttService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private phieuKtraCluongBttService: PhieuKtraCluongBttService,
    private bangKeBttService: BangKeBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year')],
      maDvi: [''],
      tenDvi: [''],
      maQhns: ['',],
      soPhieuXuat: [],
      ngayTao: [''],
      ngayXuatKho: [''],
      no: [],
      co: [],
      idQdNv: [],
      soQdNv: ['', [Validators.required]],
      ngayQdNv: [''],
      idHd: [],
      soHd: [''],
      ngayKyHd: [''],
      idDdiemXh: [''],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],
      idPhieu: [],
      soPhieu: [''],
      ngayKnghiem: [],
      loaiVthh: ['',],
      tenLoaiVthh: ['',],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      idNguoiLapPhieu: [],
      tenNguoiLapPhieu: [''],
      idKtv: [],
      tenKtv: [''],
      keToanTruong: [''],
      nguoiGiao: [''],
      cmtNguoiGiao: [''],
      ctyNguoiGiao: [''],
      diaChiNguoiGiao: [''],
      tenNguoiPduyet: [],
      tgianGiaoNhan: [''],
      maSo: [''],
      donViTinh: [''],
      soLuongChungTu: [''],
      soLuongThucXuat: [''],
      donGia: [''],
      soLuong: [''],
      ghiChu: [''],
      soBangKe: [''],
      trangThai: [''],
      tenTrangThai: [''],
      lyDoTuChoi: [],
      phanLoai: [''],
      ngayTaoBangKe: [''],
      soBangKeBanLe: [''],
      idBangKeBanLe: [],
      pthucBanTrucTiep: [''],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maPhieu = 'PXK-' + this.userInfo.DON_VI.tenVietTat;
      if (this.id > 0) {
        await this.loadChiTiet();
      } else {
        await this.initForm();
      }
      await this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
      this.flagInit = true;
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_PHIEU_XKHO_BTT_SEQ')
    this.formData.patchValue({
      soPhieuXuat: `${id}/${this.formData.get('namKh').value}/${this.maPhieu}`,
      ngayTao: dayjs().format('YYYY-MM-DD'),
      ngayXuatKho: dayjs().format('YYYY-MM-DD'),
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      phanLoai: 'HĐ',
      tenNguoiLapPhieu: this.userInfo.TEN_DAY_DU
    });
    if (this.idQdNv) {
      await this.bindingDataQdNv(this.idQdNv);
    }
  }

  async loadChiTiet() {
    let data = await this.detail(this.id);
    if (data) {
      this.fileDinhKem = data.fileDinhKem;
    }
  }

  async openDialogSoQdNv() {
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
    }
    let res = await this.quyetDinhNvXuatBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content
      if (data && data.length > 0) {
        this.dsSoQuyetDinhNv = data;
        this.dsSoQuyetDinhNv = this.dsSoQuyetDinhNv.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH SỐ QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsSoQuyetDinhNv,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQdNv', 'ngayQdNv', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQdNv(dataChose.id);
      }
    });
    await this.spinner.hide();
  }

  changeSoQd(event) {
    if (this.flagInit && event && event !== this.formData.value.soQdGiaoNvXh) {
      this.formData.patchValue({
        idHd: null,
        soHd: null,
        ngayKyHd: null,
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBangKe: null,
        maDiemKho: null,
        tenDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        idPhieu: null,
        soPhieu: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        moTaHangHoa: null,
        idKtv: null,
        tenKtv: null,
        donViTinh: null,
        donGia: null,
      });
    }
  }

  changeDd(event) {
    if (this.flagInit && event && event !== this.formData.value.maDiemKho) {
      this.formData.patchValue({
        idPhieu: null,
        soPhieu: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        moTaHangHoa: null,
        idKtv: null,
        tenKtv: null,
        donGia: null,
      });
    }
  }

  async bindingDataQdNv(idQdNv) {
    await this.spinner.show();
    if (idQdNv > 0) {
      await this.quyetDinhNvXuatBttService.getDetail(idQdNv)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataQd = res.data
            this.formData.patchValue({
              idQdNv: dataQd.id,
              soQdNv: dataQd.soQdNv,
              ngayQdNv: dataQd.ngayQdNv,
              donViTinh: dataQd.donViTinh,
              idHd: dataQd.pthucBanTrucTiep == "01" ? dataQd.idHd : '',
              soHd: dataQd.pthucBanTrucTiep == "01" ? dataQd.soHd : '',
              ngayKyHd: dataQd.pthucBanTrucTiep == "01" ? dataQd.ngayKyHd : '',
              pthucBanTrucTiep: dataQd.pthucBanTrucTiep,
              phanLoai: dataQd.pthucBanTrucTiep == "03" ? "BL" : "HĐ",
            });
            await this.listPhieuXuatKho(dataQd.soQdNv);
            if (dataQd.pthucBanTrucTiep && dataQd.pthucBanTrucTiep != "02") {
              let dataChiCuc = dataQd.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
              if (dataChiCuc) {
                this.listDiaDiemXuatHang = [];
                dataChiCuc.forEach(e => {
                  this.listDiaDiemXuatHang = [...this.listDiaDiemXuatHang, e.children];
                });
                this.listDiaDiemXuatHang = this.listDiaDiemXuatHang.flat();
                let set = new Set(this.dsPhieuXuatKho.map(item => JSON.stringify({
                  maDiemKho: item.maDiemKho,
                  maNhaKho: item.maNhaKho,
                  maNganKho: item.maNganKho,
                  maLoKho: item.maLoKho,
                  idDdiemXh: item.idDdiemXh
                })));
                this.listDiaDiemXuatHang = this.listDiaDiemXuatHang.filter(item => {
                  const key = JSON.stringify({
                    maDiemKho: item.maDiemKho,
                    maNhaKho: item.maNhaKho,
                    maNganKho: item.maNganKho,
                    maLoKho: item.maLoKho,
                    idDdiemXh: item.id
                  });
                  return !set.has(key);
                });
              }
            }
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  async searchHopDong() {
    if (this.formData.get('pthucBanTrucTiep').value != '02') {
      return
    }
    await this.spinner.show();
    let body = {
      namHd: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      soQdNv: this.formData.value.soQdNv,
      trangThai: STATUS.DA_KY,
    }
    let res = await this.hopDongBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data?.content;
      if (data && data.length > 0) {
        this.dsSoHopDong = data;
        this.dsSoHopDong = this.dsSoHopDong.filter(item => item.maDvi === this.userInfo.MA_DVI);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH SỐ HỢP ĐỒNG BÁN TRƯC TIẾP',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsSoHopDong,
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Loại hàng hóa'],
        dataColumn: ['soHd', 'tenHd', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.loadChiTietHopDong(dataChose.id);
      }
    });
  }

  async loadChiTietHopDong(idHd) {
    await this.spinner.show();
    if (idHd > 0) {
      await this.hopDongBttService.getDetail(idHd)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataHd = res.data
            this.formData.patchValue({
              idHd: dataHd.id,
              soHd: dataHd.soHd,
              ngayKyHd: dataHd.ngayPduyet,
            });
            if (dataHd.xhHopDongBttDviList && dataHd.xhHopDongBttDviList.length > 0) {
              this.listDiaDiemXuatHang = dataHd.xhHopDongBttDviList;
              this.listDiaDiemXuatHang = this.listDiaDiemXuatHang.flat();
              let set = new Set(this.dsPhieuXuatKho.map(item => JSON.stringify({
                maDiemKho: item.maDiemKho,
                maNhaKho: item.maNhaKho,
                maNganKho: item.maNganKho,
                maLoKho: item.maLoKho,
                idDdiemXh: item.idDdiemXh
              })));
              this.listDiaDiemXuatHang = this.listDiaDiemXuatHang.filter(item => {
                const key = JSON.stringify({
                  maDiemKho: item.maDiemKho,
                  maNhaKho: item.maNhaKho,
                  maNganKho: item.maNganKho,
                  maLoKho: item.maLoKho,
                  idDdiemXh: item.id
                });
                return !set.has(key);
              });
            }
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  async searchBangKeBanLe() {
    if (this.formData.get('pthucBanTrucTiep').value != '03') {
      return
    }
    await this.spinner.show();
    let body = {
      namHd: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      soQdNv: this.formData.value.soQdNv,
    }
    let res = await this.bangKeBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      if (data && data.length > 0) {
        this.dsBangkeBanLe = data;
        this.dsBangkeBanLe = this.dsBangkeBanLe.filter(item => item.maDvi === this.userInfo.MA_DVI);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH BẢNG KÊ BÁN LẺ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsBangkeBanLe,
        dataHeader: ['Số bảng kê', 'Tên người mua', 'Loại hàng hóa'],
        dataColumn: ['soBangKe', 'tenNguoiMua', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataBangKe(dataChose.id);
      }
    });
    await this.spinner.hide();
  }

  async bindingDataBangKe(id) {
    if (id > 0) {
      await this.spinner.show();
      let res = await this.bangKeBttService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.formData.patchValue({
          idBangKeBanLe: data.id,
          soBangKeBanLe: data.soBangKe,
          ngayTaoBangKe: data.ngayTao,
          donGia: data.donGia
        });
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      await this.spinner.hide();
    }
  }

  async listPhieuXuatKho(event) {
    await this.spinner.show();
    let body = {
      soQdNv: event,
      loaiVthh: this.loaiVthh,
      namKh: this.formData.value.namKh,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.phieuXuatKhoBttService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      if (data && data.content && data.content.length > 0) {
        this.dsPhieuXuatKho = data.content
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH ĐỊA ĐIỂM XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemXuatHang,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          idDdiemXh: data.id,
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
          donGia: data.donGiaDuocDuyet,
        });
        await this.loadPhieuKtraCluong(data);
      }
    });
  }


  async loadPhieuKtraCluong(data) {
    let body = {
      trangThai: STATUS.DA_DUYET_LDC,
      loaiVthh: this.loaiVthh,
      soQdNv: this.formData.value.soQdNv,
    }
    let res = await this.phieuKtraCluongBttService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      let danhSachPhieuKn = res.data.content
      if (danhSachPhieuKn && danhSachPhieuKn.length > 0) {
        let danhSach = danhSachPhieuKn.find(item => (
          item.maDiemKho == data.maDiemKho &&
          item.maNhaKho == data.maNhaKho &&
          item.maNganKho == data.maNganKho &&
          item.maLoKho == data.maLoKho));
        if (danhSach) {
          await this.spinner.show();
          await this.phieuKtraCluongBttService.getDetail(danhSach.id)
            .then((dataDtail) => {
              if (dataDtail.msg == MESSAGE.SUCCESS) {
                const dataPhieuKn = dataDtail.data
                this.formData.patchValue({
                  idPhieu: dataPhieuKn.id,
                  soPhieu: dataPhieuKn.soPhieu,
                  ngayKnghiem: dataPhieuKn.ngayTao,
                  idKtv: dataPhieuKn.idKtv,
                  tenKtv: dataPhieuKn.tenKtv,
                  loaiVthh: dataPhieuKn.loaiVthh,
                  cloaiVthh: dataPhieuKn.cloaiVthh,
                  tenLoaiVthh: dataPhieuKn.tenLoaiVthh,
                  tenCloaiVthh: dataPhieuKn.tenCloaiVthh,
                  moTaHangHoa: dataPhieuKn.moTaHangHoa,
                });
              }
            }).catch((e) => {
              console.log('error: ', e);
              this.spinner.hide();
              this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            });
          await this.spinner.hide();
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async save(isGuiDuyet?: boolean) {
    this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    body.fileDinhKem = this.fileDinhKem;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.id = data.id
        this.pheDuyet(true);
      } else {
        this.id = data.id
        await this.loadChiTiet();
      }
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }


  pheDuyet(isPheDuyet) {
    if (this.formData.value.soBangKe) {
      let trangThai = ''
      let msg = ''
      if (isPheDuyet) {
        switch (this.formData.value.trangThai) {
          case STATUS.TU_CHOI_LDCC:
          case STATUS.DU_THAO:
            trangThai = STATUS.CHO_DUYET_LDCC
            msg = 'Bạn có muốn gửi duyệt ?'
            break;
          case STATUS.CHO_DUYET_LDCC:
            trangThai = STATUS.DA_DUYET_LDCC
            msg = 'Bạn có muốn duyệt bản ghi ?'
            break;
        }
        this.approve(this.id, trangThai, msg);
      } else {
        switch (this.formData.value.trangThai) {
          case STATUS.CHO_DUYET_LDCC:
            trangThai = STATUS.TU_CHOI_LDCC
            break;
        }
        this.reject(this.id, trangThai)
      }
    } else {
      this.notification.error(MESSAGE.ERROR, "Phiếu xuất kho chưa có bảng kê cân hàng");
    }

  }

  clearItemRow(id) {
    this.formData.patchValue({
      maSo: null,
      soLuongChungTu: null,
      soLuongThucXuat: null,
    })
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.DA_DUYET_LDCC) {
      return true;
    } else {
      return false;
    }
  }

  isDisabledQD() {
    if (this.formData.value.id == null) {
      return false
    } else {
      return true;
    }
  }

  calculateSum() {
    let sum = this.formData.value.soLuongThucXuat * this.formData.value.donGia;
    return sum;
  }

  async preview(id) {
    await this.phieuXuatKhoBttService.preview({
      tenBaoCao: 'Phiếu xuất kho bán trực tiếp',
      id: id
    }).then(async res => {
      if (res.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.printSrc = res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }

  downloadPdf() {
    saveAs(this.pdfSrc, "phieu-xuat-kho-ban-truc-tiep.pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, "phieu-xuat-kho-ban-truc-tiep.docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview() {
    printJS({ printable: this.printSrc, type: 'pdf', base64: true })
  }

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["namKh"].setValidators([Validators.required]);
      this.formData.controls["maDvi"].setValidators([Validators.required]);
      this.formData.controls["tenDvi"].setValidators([Validators.required]);
      this.formData.controls["maQhns"].setValidators([Validators.required]);
      this.formData.controls["soPhieuXuat"].setValidators([Validators.required]);
      this.formData.controls["no"].setValidators([Validators.required]);
      this.formData.controls["co"].setValidators([Validators.required]);
      this.formData.controls["soPhieu"].setValidators([Validators.required]);
      this.formData.controls["loaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["keToanTruong"].setValidators([Validators.required]);
      this.formData.controls["nguoiGiao"].setValidators([Validators.required]);
      this.formData.controls["cmtNguoiGiao"].setValidators([Validators.required]);
      this.formData.controls["ctyNguoiGiao"].setValidators([Validators.required]);
      this.formData.controls["diaChiNguoiGiao"].setValidators([Validators.required]);
      this.formData.controls["tgianGiaoNhan"].setValidators([Validators.required]);
    } else {
      this.formData.controls["namKh"].clearValidators();
      this.formData.controls["maDvi"].clearValidators();
      this.formData.controls["tenDvi"].clearValidators();
      this.formData.controls["maQhns"].clearValidators();
      this.formData.controls["soPhieuXuat"].clearValidators();
      this.formData.controls["no"].clearValidators();
      this.formData.controls["co"].clearValidators();
      this.formData.controls["soPhieu"].clearValidators();
      this.formData.controls["loaiVthh"].clearValidators();
      this.formData.controls["tenLoaiVthh"].clearValidators();
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
      this.formData.controls["keToanTruong"].clearValidators();
      this.formData.controls["nguoiGiao"].clearValidators();
      this.formData.controls["cmtNguoiGiao"].clearValidators();
      this.formData.controls["ctyNguoiGiao"].clearValidators();
      this.formData.controls["diaChiNguoiGiao"].clearValidators();
      this.formData.controls["tgianGiaoNhan"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'HĐ') {
      this.formData.controls["soHd"].setValidators([Validators.required]);
      this.formData.controls["ngayKyHd"].setValidators([Validators.required]);
      this.formData.controls["soBangKeBanLe"].clearValidators();
      this.formData.controls["ngayTaoBangKe"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'BL') {
      this.formData.controls["soBangKeBanLe"].setValidators([Validators.required]);
      this.formData.controls["ngayTaoBangKe"].setValidators([Validators.required]);
      this.formData.controls["soHd"].clearValidators();
      this.formData.controls["ngayKyHd"].clearValidators();
    }
  }
}
