import { cloneDeep } from 'lodash';
import { PhieuXuatKhoDieuChuyenService } from './../../services/dcnb-xuat-kho.service';
import { PhieuKiemNghiemChatLuongDieuChuyenService } from './../../services/dcnb-phieu-kiem-nghiem-chat-luong.service';
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
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
@Component({
  selector: 'app-xuat-dcnb-them-moi-phieu-xuat-kho',
  templateUrl: './them-moi-phieu-xuat-kho.component.html',
  styleUrls: ['./them-moi-phieu-xuat-kho.component.scss']
})
export class ThemMoiPhieuXuatKhoDCNBComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() typeVthh?: string[] | string;
  @Input() isView: boolean;
  @Input() qddcId: number;
  @Input() isViewOnModal: boolean;

  @Output()
  showListEvent = new EventEmitter<any>();
  loaiVthh?: string[] | string;
  id: number;
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];

  listPhieuKtraCl: any[] = [];

  taiLieuDinhKemList: any[] = [];
  dataTable: any[] = [];
  phieuXuatKho: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongBttService: HopDongBttService,
    private phieuXuatKhoDieuChuyenService: PhieuXuatKhoDieuChuyenService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private phieuKiemNghiemChatLuongDieuChuyenService: PhieuKiemNghiemChatLuongDieuChuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoDieuChuyenService);
    this.formData = this.fb.group({
      // id: [],
      // namKh: [dayjs().get('year')],
      // maDvi: ['', [Validators.required]],
      // tenMaDvi: ['', [Validators.required]],
      // maQhns: ['',],

      // soPhieuXuat: [],
      // ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      // ngayXuatKho: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      // no: [],
      // co: [],

      // idQdNv: [],
      // soQdNv: [],
      // ngayQdNv: [''],

      // idHd: [],
      // soHd: [''],
      // ngayKyHd: [null,],

      // maDiemKho: ['', [Validators.required]],
      // tenDiemKho: ['', [Validators.required]],
      // maNhaKho: ['', [Validators.required]],
      // tenNhaKho: ['', [Validators.required]],
      // maNganKho: ['', [Validators.required]],
      // tenNganKho: ['', [Validators.required]],
      // maLoKho: [''],
      // tenLoKho: [''],

      // idPhieu: [],
      // soPhieu: ['', [Validators.required]],
      // ngayKnghiem: [],
      // loaiVthh: ['',],
      // tenLoaiVthh: ['',],
      // cloaiVthh: [''],
      // tenCloaiVthh: [''],
      // moTaHangHoa: [''],

      // idNguoiLapPhieu: [],
      // tenNguoiLapPhieu: [''],
      // idKtv: [],
      // tenKtv: [''],

      // // keToanTruong: [''],
      // nguoiGiao: [''],
      // cmtNguoiGiao: [''],
      // ctyNguoiGiao: [''],
      // diaChiNguoiGiao: [''],
      // tenNguoiPduyet: [],

      // tgianGiaoNhan: [''],
      // soBangKe: [''],
      // maSo: [''],
      // donViTinh: [''],
      // soLuongChungTu: [''],
      // soLuongThucXuat: [''],
      // donGia: [''],
      // soLuong: [''],
      // ghiChu: [''],
      // trangThai: [STATUS.DU_THAO],
      // tenTrangThai: ['Dự Thảo'],
      // lyDoTuChoi: [],
      //new aaa
      id: [],
      type: ['00'],
      nam: [dayjs().get('year')],
      maDvi: ['', [Validators.required]],
      tenMaDvi: ['', [Validators.required]],
      maQhns: [''],
      canBoLapPhieu: [''],
      canBoLapPhieuId: [''],
      soPhieuXuatKho: ['', [Validators.required]],
      ngayTaoPhieu: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      ngayXuatKho: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      taiKhoanCo: [],
      taiKhoanNo: [],
      soQddc: [''],
      qddcId: [],
      ngayKyQddc: [''],

      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: ['', [Validators.required]],
      tenLoKho: ['', [Validators.required]],

      soPhieuKtChatLuong: [''],
      phieuKtChatLuongHdrId: [],
      ngayKyPhieuKtChatLuong: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      ldChiCuc: [''],
      ldChiCucId: [''],
      ktvBaoQuanId: [''],
      ktvBaoQuan: [''],
      keToanTruong: [''],
      keToanTruongId: [''],
      nguoiGiaoHang: [''],
      soCmt: [''],
      ctyNguoiGh: [''],
      diaChi: [''],
      thoiGianGiaoNhan: [''],
      loaiHinhNX: ["Nhập ĐC nội bộ Chi cục"],
      kieuNX: ["Nhập không chi tiền"],
      soBangKeCh: [''],
      soLuongCanDc: [''],
      bangKeChId: [''],

      thanhTien: [],
      thanhTienBc: [''],
      tongSoLuong: [],
      tongSoLuongBc: [''],
      donViTinh: [''],
      donGia: [],

      dcnbPhieuXuatKhoDtl: [[]],
      ghiChu: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [],

    })
  }

  async ngOnInit() {
    try {
      this.id = this.idInput;
      this.loaiVthh = this.typeVthh
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
      soPhieuXuatKho: `${id}/${this.formData.get('nam').value}/PNK-CCDTVP`,
      maDvi: this.userInfo.MA_DVI,
      tenMaDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      canBoLapPhieu: this.userInfo.TEN_DAY_DU,
    });
    if (this.qddcId) {
      await this.bindingDataQd(this.qddcId);
    }
  }

  async openDialogSoQdDC() {
    let dataQdDc = [];
    let body = {
      nam: dayjs().get('year'),
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
      maChiCuc: this.userInfo.MA_DVI
    }
    let res = await this.quyetDinhDieuChuyenCucService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataQdDc = res.data?.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH SỐ QUYẾT ĐỊNH ĐIỀU CHUYỂN',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataQdDc,
        dataHeader: ['Số quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdinh', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
    try {
      if (id > 0) {
        await this.spinner.show();
        let dataRes = await this.quyetDinhDieuChuyenCucService.getDetail(id)
        if (dataRes.msg == MESSAGE.SUCCESS) {
          const data = dataRes.data;
          this.formData.patchValue({
            qddcId: data.id,
            soQddc: data.soQdinh,
            ngayKyQddc: data.ngayKyQdinh,
            donViTinh: data.donViTinh,
          });
          // let dataHd = await this.hopDongBttService.getDetail(data.idHd)
          // if (dataHd.data) {
          //   this.formData.patchValue({
          //     donGia: dataHd.data.donGiaBanTrucTiep,
          //   });
          // }
          this.listDiaDiemNhap = [];
          let dataChiCuc = [];
          if (Array.isArray(data?.danhSachQuyetDinh)) {
            data.danhSachQuyetDinh.forEach(element => {
              if (Array.isArray(element.danhSachKeHoach)) {
                element.danhSachKeHoach.forEach(item => {
                  if (item.maChiCucNhan == this.userInfo.MA_DVI && dataChiCuc.findIndex(f => f.maChiCucNhan == item.maChiCucNhan) < 0 && dataChiCuc.findIndex(f => f.maLoKho == item.maLoKho) < 0) {
                    dataChiCuc.push(item)
                  }
                });
              }
            });
          }
          if (dataChiCuc) {
            this.listDiaDiemNhap = cloneDeep(dataChiCuc);
          }
          // this.listPhieuXuatKho(data.soQdinh)
          // let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
          // if (dataChiCuc && dataChiCuc.length > 0) {
          //   dataChiCuc.forEach(e => {
          //     this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
          //   });
          //   this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
          // }
        } else {
          this.notification.error(MESSAGE.ERROR, dataRes.msg);
        }
      }
    } catch (error) {
      console.log("error", error)
    } finally {
      await this.spinner.hide();
    }
  }

  async listPhieuXuatKho(even) {
    await this.spinner.show();
    let body = {
      soQddc: even,
      loaiVthh: this.loaiVthh,
      nam: this.formData.value.nam,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.phieuXuatKhoDieuChuyenService.search(body);
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
    console.log("listDdNhap", this.listDiaDiemNhap)
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
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuongDc']
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
    let res = await this.phieuKiemNghiemChatLuongDieuChuyenService.search(body)
    if (res.data) {
      const list = res.data.content;
      this.listPhieuKtraCl = list.filter(item => (item.maDiemKho == data.maDiemKho && item.maNhaKho == data.maNhaKho && item.maNganKho == data.maNganKho && item.maLoKho == data.maLoKho));
      const dataPhieu = this.listPhieuKtraCl[0]
      if (dataPhieu) {
        let resDetail = await this.phieuKiemNghiemChatLuongDieuChuyenService.getDetail(dataPhieu.id);
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
          let dataObj = {
            // moTaHangHoa: this.loaiVthh?.startsWith('02') ? (this.formData.value.tenCloaiVthh ? this.formData.value.tenCloaiVthh : this.formData.value.tenLoaiVthh) : (this.formData.value.moTaHangHoa ? this.formData.value.moTaHangHoa : this.formData.value.tenCloaiVthh),
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
    let body = this.formData.value;
    body.fileDinhKem = this.fileDinhKem;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.id = data.id
        this.pheDuyet(true);
      } else {
        this.goBack();
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

}
