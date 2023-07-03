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
import { PhieuXuatKhoBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/phieu-xuat-kho-btt.service';
import { QuyetDinhNvXuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import { PhieuKtraCluongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/phieu-ktra-cluong-btt.service';
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import { BangKeBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/bang-ke-btt.service';
@Component({
  selector: 'app-them-moi-phieu-xuat-kho-btt',
  templateUrl: './them-moi-phieu-xuat-kho-btt.component.html',
  styleUrls: ['./them-moi-phieu-xuat-kho-btt.component.scss']
})
export class ThemMoiPhieuXuatKhoBttComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() idQdGiaoNvXh: number;
  @Input() isViewOnModal: boolean;

  @Output()
  showListEvent = new EventEmitter<any>();

  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];

  listPhieuKtraCl: any[] = [];

  taiLieuDinhKemList: any[] = [];
  dataTable: any[] = [];
  phieuXuatKho: any[] = [];
  soQdNvXh: string;

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
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      ngayXuatKho: [dayjs().format('YYYY-MM-DD')],
      no: [],
      co: [],
      idQdNv: [],
      soQdNv: ['', [Validators.required]],
      ngayQdNv: [''],
      idHd: [],
      soHd: [''],
      ngayKyHd: [null,],
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
      phanLoai: ['HĐ'],
      ngayTaoBangKe: [''],
      soBangKeBanLe: [''],
      idBangKeBanLe: [],
      pthucBanTrucTiep: [''],
    })
  }

  async ngOnInit() {
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.id) {
        await this.loadChiTiet();
      } else {
        await this.initForm();
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_PHIEU_XKHO_BTT_SEQ')
    this.formData.patchValue({
      soPhieuXuat: `${id}/${this.formData.get('namKh').value}/PNK-CCDTVP`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      tenNguoiLapPhieu: this.userInfo.TEN_DAY_DU
    });
    if (this.idQdGiaoNvXh) {
      await this.bindingDataQd(this.idQdGiaoNvXh);
    }
  }

  async openDialogSoQdNvXh() {
    let dataQdNvXh = [];
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
      maChiCuc: this.userInfo.MA_DVI
    }
    let res = await this.quyetDinhNvXuatBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataQdNvXh = res.data?.content;
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
        dataTable: dataQdNvXh,
        dataHeader: ['Số quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdNv', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
    if (id > 0) {
      await this.spinner.show();
      let dataRes = await this.quyetDinhNvXuatBttService.getDetail(id)
      if (dataRes.msg == MESSAGE.SUCCESS) {
        const data = dataRes.data;
        if (data.pthucBanTrucTiep == '01' || data.pthucBanTrucTiep == '03') {
          this.listPhieuXuatKho(data.soQdNv)
          if (data.pthucBanTrucTiep == '01') {
            this.formData.patchValue({
              idQdNv: data.id,
              soQdNv: data.soQdNv,
              ngayQdNv: data.ngayTao,
              idHd: data.idHd,
              soHd: data.soHd,
              ngayKyHd: data.ngayKyHd,
              phanLoai: 'HĐ',
              pthucBanTrucTiep: data.pthucBanTrucTiep,
            });
          } else {
            if (data.pthucBanTrucTiep == '03') {
              this.soQdNvXh = data.soQdNv
              this.formData.patchValue({
                soQdNv: data.soQdNv,
                idQdNv: data.id,
                ngayQdNv: data.ngayTao,
                phanLoai: 'BL',
                pthucBanTrucTiep: data.pthucBanTrucTiep,
                donViTinh: data.donViTinh
              });
            }
          }
          let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
          if (dataChiCuc && dataChiCuc.length > 0) {
            dataChiCuc.forEach(e => {
              this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
            });
            this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
          }
        } else {
          if (data.pthucBanTrucTiep == '02') {
            this.soQdNvXh = data.soQdNv
            this.formData.patchValue({
              soQdNv: data.soQdNv,
              idQdNv: data.id,
              ngayQdNv: data.ngayTao,
              phanLoai: 'HĐ',
              pthucBanTrucTiep: data.pthucBanTrucTiep,
            });
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, dataRes.msg);
      }
      await this.spinner.hide();
    }
  }

  async searchHopDong() {
    if (this.formData.get('pthucBanTrucTiep').value != '02') {
      return
    }
    this.spinner.show();
    let dataHd = [];
    let body = {
      namHd: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      soQdNv: this.soQdNvXh,
      trangThai: STATUS.DA_KY,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.hopDongBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataHd = res.data?.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH QUYẾT ĐỊNH KẾ HOẠCH GIAO NHIỆM VỤ XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataHd,
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soHd', 'tenHd', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.loadChiTietHopDong(dataChose.id);
      }
    });
  }

  async loadChiTietHopDong(idHd) {
    if (idHd > 0) {
      await this.spinner.show();
      let dataHd = await this.hopDongBttService.getDetail(idHd)
      if (dataHd.msg == MESSAGE.SUCCESS) {
        const data = dataHd.data;
        if (this.formData.value.pthucBanTrucTiep == '01') {
          this.formData.patchValue({
            donViTinh: data.donViTinh,
            donGia: data.donGiaBanTrucTiep
          });
        } else {
          if (this.formData.value.pthucBanTrucTiep == '02') {
            this.listPhieuXuatKho(data.soQdNv)
            this.formData.patchValue({
              idHd: data.id,
              soHd: data.soHd,
              ngayKyHd: data.ngayPduyet,
              donViTinh: data.donViTinh,
              donGia: data.donGiaBanTrucTiep
            });
            if (data.xhHopDongBttDviList && data.xhHopDongBttDviList.length > 0) {
              this.listDiaDiemNhap = data.xhHopDongBttDviList;
            }
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, dataHd.msg);
      }
      await this.spinner.hide();
    }
  }

  async searchBangKeBanLe() {
    if (this.formData.get('pthucBanTrucTiep').value != '03') {
      return
    }
    this.spinner.show();
    let dataBL = [];
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      soQdNv: this.soQdNvXh,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.bangKeBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataBL = res.data?.content;
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
        dataTable: dataBL,
        dataHeader: ['Số bảng kê', 'Tên người mua', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soBangKe', 'tenNguoiMua', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataBangKe(dataChose.id);
      }
    });
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

  async listPhieuXuatKho(even) {
    await this.spinner.show();
    let body = {
      soQdNv: even,
      loaiVthh: this.loaiVthh,
      namKh: this.formData.value.namKh,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.phieuXuatKhoBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      this.phieuXuatKho = data.content;
      const diffList = [
        ...this.listDiaDiemNhap.filter((item) => {
          return !this.phieuXuatKho.some((child) => {
            if (child.maNganKho.length > 0 && item.maNganKho.length > 0) {
              return item.maNganKho === child.maNganKho;
            } else {
              return item.maDiemKho === child.maDiemKho;
            }
          });
        }),
      ];
      this.listDiaDiemNhap = diffList;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuongDeXuat']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.dataTable = [];
        this.formData.patchValue({
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
        });
        await this.loadPhieuKtraCluong(data);
      }
    });
  }

  async loadPhieuKtraCluong(data) {
    let body = {
      trangThai: STATUS.DA_DUYET_LDC,
    }
    let res = await this.phieuKtraCluongBttService.search(body)
    if (res.data) {
      const list = res.data.content;
      this.listPhieuKtraCl = list.filter(item => (item.maDiemKho == data.maDiemKho && item.maNhaKho == data.maNhaKho && item.maNganKho == data.maNganKho && item.maLoKho == data.maLoKho));
      const dataPhieu = this.listPhieuKtraCl[0]
      if (dataPhieu) {
        let resDetail = await this.phieuKtraCluongBttService.getDetail(dataPhieu.id);
        if (resDetail.data) {
          const dataPhieuKn = resDetail.data;
          this.formData.patchValue({
            idPhieu: dataPhieuKn.id,
            soPhieu: dataPhieuKn.soPhieu,
            loaiVthh: dataPhieuKn.loaiVthh,
            tenLoaiVthh: dataPhieuKn.tenLoaiVthh,
            cloaiVthh: dataPhieuKn.cloaiVthh,
            tenCloaiVthh: dataPhieuKn.tenCloaiVthh,
            moTaHangHoa: dataPhieuKn.moTaHangHoa,
            ngayKnghiem: dataPhieuKn.ngayKnghiem,
            idKtv: dataPhieuKn.idKtv,
            tenKtv: dataPhieuKn.tenKtv,
            soLuong: dataPhieuKn.soLuong,
          });
          await this.loadChiTietHopDong(dataPhieuKn.idHd);
          let dataObj = {
            moTaHangHoa: this.loaiVthh.startsWith('02') ? (this.formData.value.tenCloaiVthh ? this.formData.value.tenCloaiVthh : this.formData.value.tenLoaiVthh) : (this.formData.value.moTaHangHoa ? this.formData.value.moTaHangHoa : this.formData.value.tenCloaiVthh),
            maSo: '',
            donViTinh: this.formData.value.donViTinh,
            soLuongChungTu: 0,
            soLuongThucXuat: this.formData.value.soLuong,
            donGia: this.formData.value.donGia
          }
          this.dataTable.push(dataObj)
        }
      }
    }
  }

  async logdataTable() {
    this.dataTable.forEach(s => {
      this.formData.patchValue({
        soLuongThucXuat: s.soLuongThucXuat,
        maSo: s.maSo,
        soLuongChungTu: s.soLuongChungTu
      });
    })
  }

  async save(isGuiDuyet?: boolean) {
    this.logdataTable();
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
        this.dataTable = []
        await this.loadChiTiet();
      }
    }
  }

  async loadChiTiet() {
    let data = await this.detail(this.id);
    if (data) {
      this.fileDinhKem = data.fileDinhKem;
      this.dataTable.push(data);
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  pheDuyet(isPheDuyet) {
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
  }

  clearItemRow(i) {
    this.dataTable[i] = {};
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
