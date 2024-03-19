import {HttpClient} from '@angular/common/http';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS, THONG_TIN_BAN_TRUC_TIEP} from 'src/app/constants/status';
import {HopDongBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {
  QdPdKetQuaBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import {StorageService} from 'src/app/services/storage.service';
import {
  ChaoGiaMuaLeUyQuyenService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {PREVIEW} from "../../../../../../constants/fileType";
import {
  QuyetDinhPdKhBanTrucTiepService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service";

@Component({
  selector: 'app-quan-ly-hop-dong-btt',
  templateUrl: './quan-ly-hop-dong-btt.component.html',
  styleUrls: ['./quan-ly-hop-dong-btt.component.scss']
})
export class QuanLyHopDongBttComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() loaiVthh: string;
  @Input() check: boolean;
  @Input() checkPrice: any;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  TRUC_TIEP = THONG_TIN_BAN_TRUC_TIEP
  isView: boolean
  isEditHopDong: boolean
  phanLoai: string
  loadDanhSachHdongDaKy: any[] = [];
  idQdNv: number = 0;
  isViewQdNv: boolean = false;
  idHopDong: number;
  isHopDong: boolean = false;
  isDieuChinh: boolean;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongBttService: HopDongBttService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [],
      soQdKq: [''],
      soQdPd: [''],
      soQdDc: [''],
      tenDuAn: [''],
      tenDviCha: [''],
      tenDvi: [''],
      nguonVon: [''],
      tongGiaTriHdong: [],
      tongSlXuatBanQdKh: [],
      tongSlDaKyHdong: [],
      tongSlChuaKyHdong: [],
      donViTinh: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      trangThaiHd: [''],
      tenTrangThaiHd: [''],
      phuongThucBan: [''],
      phanLoai: [''],
    });
  }

  async ngOnInit() {
    if (this.idInput) {
      await this.spinner.show();
      try {
        await this.getDetail();
      } catch (e) {
        console.error('error: ', e);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        await this.spinner.hide();
      }
    }
  }

  async getDetail() {
    this.userService.isChiCuc() ? await this.getDetailChiCuc() : await this.getDetailCuc()
  }

  async getDetailCuc() {
    try {
      const res = this.check ? await this.qdPdKetQuaBttService.getDetail(this.idInput) : await this.quyetDinhPdKhBanTrucTiepService.getDetail(this.idInput);
      if (res.msg === MESSAGE.SUCCESS || res.data) {
        const data = res.data;
        await this.loadDanhDachHopDong();
        this.formData.patchValue({
          namKh: data.namKh,
          soQdPd: data.soQdPd,
          soQdDc: data.soQdDc,
          soQdKq: this.check ? data.soQdKq : null,
          tenDvi: this.check ? data.tenDvi : data.children[0].tenDvi,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          tenLoaiHinhNx: data.tenLoaiHinhNx,
          tenKieuNx: data.tenKieuNx,
          donViTinh: data.donViTinh,
          tongSlXuatBanQdKh: this.check ? data.tongSoLuong : data.children.reduce((acc, item) => acc + item.tongSoLuong, 0),
          tongGiaTriHdong: data.tongGiaTriHdong,
          trangThaiHd: data.trangThaiHd,
          tenTrangThaiHd: data.tenTrangThaiHd,
          phuongThucBan: THONG_TIN_BAN_TRUC_TIEP.CHAO_GIA,
          phanLoai: this.check ? "QĐKQ" : "QĐKH",
        });
        this.phanLoai = this.check ? "QĐKQ" : "QĐKH";
        const filteredItems = this.check ? this.loadDanhSachHdongDaKy.filter(item => item.idQdKq === data.id)
          : this.loadDanhSachHdongDaKy.filter(item => data.type === "QDDC" ? item.idQdDc === data.id && item.idQdPd === data.idQdPd : item.idQdPd === data.id);
        const tongSlDaKyHdong = filteredItems.reduce((acc, item) => acc + item.soLuong, 0);
        const tongSlChuaKyHdong = this.formData.value.tongSlXuatBanQdKh - tongSlDaKyHdong;
        this.formData.patchValue({
          tongSlDaKyHdong: tongSlDaKyHdong,
          tongSlChuaKyHdong: tongSlChuaKyHdong,
        });
        this.dataTable = this.userService.isTongCuc() ? data.listHopDongBtt : data.listHopDongBtt.filter(item => item.maDvi === this.userInfo.MA_DVI);
        if (this.dataTable && this.dataTable.length > 0) {
          await this.selectRow(this.dataTable[0]);
        }
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async getDetailChiCuc() {
    try {
      const res = await this.chaoGiaMuaLeUyQuyenService.getDetail(this.idInput);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.isDieuChinh = data.xhQdPdKhBttHdr.lastest ? false : true;
      await this.loadDanhDachHopDong();
      this.formData.patchValue({
        namKh: data.namKh,
        tenDviCha: data.tenDvi,
        soQdPd: data.soQdPd,
        soQdDc: data.soQdDc,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        tenKieuNx: data.tenKieuNx,
        tongSlXuatBanQdKh: data.children.find(item => item.maDvi === this.userInfo.MA_DVI).soLuongChiCuc,
        tongGiaTriHdong: data.thanhTienDuocDuyet,
        donViTinh: data.donViTinh,
        trangThaiHd: data.trangThaiHd,
        tenTrangThaiHd: data.tenTrangThaiHd,
        phuongThucBan: THONG_TIN_BAN_TRUC_TIEP.UY_QUYEN,
      });
      const dataChildren = data.children.find(item => item.maDvi === this.userInfo.MA_DVI);
      this.formData.patchValue({tenDvi: dataChildren.tenDvi})
      const filteredItems = this.loadDanhSachHdongDaKy.filter(item => item.idChaoGia === data.id);
      const tongSlDaKyHdong = filteredItems.reduce((acc, item) => acc + item.soLuong, 0);
      const tongSlChuaKyHdong = this.formData.value.tongSlXuatBanQdKh - tongSlDaKyHdong;
      this.formData.patchValue({
        tongSlDaKyHdong: tongSlDaKyHdong,
        tongSlChuaKyHdong: tongSlChuaKyHdong,
      });
      this.dataTable = data.listHopDongBtt.filter(item => item.maDvi === this.userInfo.MA_DVI);
      if (this.dataTable && this.dataTable.length > 0) {
        await this.selectRow(this.dataTable[0]);
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async loadDanhDachHopDong() {
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.DA_KY
    };
    const res = await this.hopDongBttService.search(body);
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.loadDanhSachHdongDaKy = data;
  }

  async selectRow(data: any) {
    if (!data.selected) {
      this.dataTable.forEach(item => item.selected = false)
      data.selected = true;
      const findndex = this.dataTable.findIndex(child => child.id == data.id);
      this.idHopDong = this.dataTable[findndex].id
      this.isHopDong = true;
    }
  }

  async redirectHopDong(id: number, isView: boolean, isShowHd: boolean, boolean?: boolean) {
    if (id === 0 && this.checkPrice && this.checkPrice.boolean && boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    if (id === 0 && this.checkPrice && this.checkPrice.booleanNhapXuat && boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgNhapXuat);
      return;
    }
    this.idHopDong = id;
    this.isView = isView;
    this.isEditHopDong = isShowHd;
    if (!isShowHd) {
      try {
        await this.ngOnInit();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  async pheDuyet() {
    if (this.checkPrice && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    if (this.checkPrice && this.checkPrice.booleanNhapXuat) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgNhapXuat);
      return;
    }

    this.userService.isChiCuc() ? await this.guiDuyetChiCuc() : await this.guiDuyetCuc()
  }

  async guiDuyetCuc() {
    if (!this.validateData()) {
      await this.spinner.hide();
      return;
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có muốn hoàn thành thực hiện hợp đồng ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        try {
          const body = {
            id: this.idInput,
            trangThai: STATUS.DA_HOAN_THANH,
          };
          const res = this.check ? await this.qdPdKetQuaBttService.approve(body) : await this.quyetDinhPdKhBanTrucTiepService.approve(body);
          if (res.msg === MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DUYET_SUCCESS);
            this.goBack();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          await this.spinner.hide();
        }
      },
    });
  }

  async guiDuyetChiCuc() {
    if (!this.validateData()) {
      await this.spinner.hide();
      return;
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có muốn hoàn thành thực hiện hợp đồng ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        try {
          const body = {
            id: this.idInput,
            trangThai: STATUS.DA_HOAN_THANH,
          };
          const res = await this.chaoGiaMuaLeUyQuyenService.approve(body);
          if (res.msg === MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DUYET_SUCCESS);
            this.goBack();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          await this.spinner.hide();
        }
      },
    });
  }

  async validateData(): Promise<boolean> {
    if (!this.dataTable || this.dataTable.length === 0) {
      await this.notification.error(MESSAGE.ERROR, "Vui lòng thêm hợp đồng");
      return false;
    }
    const isAnyContractNotSigned = this.dataTable.some(item => item && item.trangThai !== STATUS.DA_KY);
    if (isAnyContractNotSigned) {
      await this.notification.error(MESSAGE.ERROR, "Vui lòng ký tất cả các hợp đồng");
      return false;
    }
    return true;
  }

  async deleteHd(data) {
    if (this.checkPrice && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    if (this.checkPrice && this.checkPrice.booleanNhapXuat) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgNhapXuat);
      return;
    }
    await this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          let body = {
            id: data.id
          };
          await this.hopDongBttService.delete(body);
          if (this.idInput > 0) {
            if (this.userService.isChiCuc()) {
              const res = await this.chaoGiaMuaLeUyQuyenService.getDetail(this.idInput);
              this.dataTableAll = res.data.listHopDongBtt.filter(item => item.maDvi === this.userInfo.MA_DVI);
            } else {
              const res = this.formData.value.phanLoai === "QĐKQ" ? await this.qdPdKetQuaBttService.getDetail(this.idInput) : await this.quyetDinhPdKhBanTrucTiepService.getDetail(this.idInput);
              this.dataTableAll = this.formData.value.phanLoai === "QĐKQ" ? res.data.listHopDongBtt.filter(item => item.maDvi === this.userInfo.MA_DVI) : res.data.listHopDongBtt;
            }
            if (this.dataTableAll && this.dataTableAll.length > 0) {
              this.isHopDong = true;
            } else {
              this.isHopDong = false;
            }
          }
          await this.getDetail();
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          await this.spinner.hide();
        }
      },
    });
  }

  calcTong(column) {
    if (!this.dataTable) return 0;
    return this.dataTable.reduce((sum, cur) => sum + (cur[column] || 0), 0);
  }

  openModal(id: number) {
    this.idQdNv = id;
    this.isViewQdNv = true;
  }

  closeModal() {
    this.idQdNv = null;
    this.isViewQdNv = false;
  }

  async xemTruoc(id) {
    await this.hopDongBttService.preview({
      tenBaoCao: this.userService.isChiCuc() ? 'Hợp đồng bán trực tiếp cấp Chi cục.docx' : 'Hợp đồng bán trực tiếp cấp Cục.docx',
      id: id
    }).then(async res => {
      if (res.data) {
        this.printSrc = res.data.pdfSrc;
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }
}
