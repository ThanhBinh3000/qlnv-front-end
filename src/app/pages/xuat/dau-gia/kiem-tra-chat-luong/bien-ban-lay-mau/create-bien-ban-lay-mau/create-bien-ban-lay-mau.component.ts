import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { BienBanLayMauXhService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/bienBanLayMauXh.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import dayjs from 'dayjs';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { STATUS } from 'src/app/constants/status';
import { QuyetDinhGiaoNvXuatHangService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';

@Component({
  selector: 'app-create-bien-ban-lay-mau',
  templateUrl: './create-bien-ban-lay-mau.component.html',
  styleUrls: ['./create-bien-ban-lay-mau.component.scss'],
})
export class CreateBienBanLayMauComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idQdGiaoNvXh: number;
  @Input() isViewOnModal: boolean;

  listBienBan: any[] = [];
  listDiaDiemNhap: any[] = [];
  phuongPhapLayMau: any[] = [];
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  canCuPhapLy: any[] = [];
  fileNiemPhong: any[] = [];
  bienBanLayMau: any[] = [];
  maBb: string;
  loadDanhSachQdNv: any[] = [];
  loadDanhSachBbLm: any[] = [];
  flagInit: Boolean = false;
  previewName: string = 'xdt_bien_ban_lay_mau';

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private bienBanLayMauXhService: BienBanLayMauXhService,
    private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauXhService);
    this.formData = this.fb.group({
      id: [],
      trangThai: [''],
      tenTrangThai: [''],
      lyDoTuChoi: [''],
      loaiBienBan: [''],
      nam: [dayjs().get('year')],
      maDvi: [''],
      tenDvi: [''],
      maQhns: [''],
      soQd: ['', [Validators.required]],
      idQd: [],
      soHd: [''],
      ngayQd: [''],
      ngayHd: [''],
      idKtv: [],
      tenKtv: [''],
      soBienBan: [''],
      ngayLayMau: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],
      dviKnghiem: [''],
      ddiemLayMau: [''],
      soLuongLayMau: [''],
      ppLayMau: [''],
      chiTieuKiemTra: [''],
      ketQuaNiemPhong: [],
      flagNiemPhong: [],
    })
  }

  async ngOnInit() {
    try {
      this.maBb = 'BBLM-' + this.userInfo.DON_VI.tenVietTat;
      if (this.id > 0) {
        await this.loadChitiet();
      } else {
        this.initForm();
      }
      await this.loadDataComboBox();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
      this.flagInit = true;
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_BB_LAY_MAU_SEQ')
    this.formData.patchValue({
      ngayLayMau: dayjs().format('YYYY-MM-DD'),
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      soBienBan: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
      tenKtv: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
    });
    if (this.idQdGiaoNvXh) {
      await this.bindingDataQd(this.idQdGiaoNvXh);
    }
  }

  async loadChitiet() {
    let data = await this.detail(this.id);
    this.listDaiDienChiCuc = data.children.filter(x => x.loaiDaiDien == 'CHI_CUC')
    this.listDaiDienCuc = data.children.filter(x => x.loaiDaiDien == 'CUC')
    this.formData.patchValue({
      flagNiemPhong: this.formData.value.ketQuaNiemPhong == 1,
    })
    this.fileDinhKem = data.fileDinhKems;
    this.canCuPhapLy = data.canCuPhapLy;
    this.fileNiemPhong = data.fileNiemPhong;
  }

  async loadDataComboBox() {
    // Loại biên bản
    await this.danhMucService.danhMucChungGetAll("LOAI_BIEN_BAN").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listBienBan = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    });
    // PP lây mẫu
    this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.phuongPhapLayMau = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }

  async openDialogSoQd() {
    await this.spinner.show();
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
      maChiCuc: this.userInfo.MA_DVI
    }
    let res = await this.quyetDinhGiaoNhiemVuXuatHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      if (data && data.length > 0) {
        this.loadDanhSachQdNv = data;
        this.loadDanhSachQdNv = this.loadDanhSachQdNv.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
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
        dataTable: this.loadDanhSachQdNv,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayKy', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
    await this.spinner.hide();
  }

  changeSoQd(event) {
    if (this.flagInit && event && event !== this.formData.value.soQd) {
      this.formData.patchValue({
        maDiemKho: null,
        tenDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
      });
    }
  }

  async bindingDataQd(id) {
    await this.spinner.show();
    if (id > 0) {
      await this.quyetDinhGiaoNhiemVuXuatHangService.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataQd = res.data
            this.formData.patchValue({
              soQd: dataQd.soQd,
              idQd: dataQd.id,
              soHd: dataQd.soHd,
              ngayQd: dataQd.ngayTao,
              ngayHd: dataQd.ngayKy,
              loaiVthh: dataQd.loaiVthh,
              cloaiVthh: dataQd.cloaiVthh,
              tenLoaiVthh: dataQd.tenLoaiVthh,
              tenCloaiVthh: dataQd.tenCloaiVthh,
              moTaHangHoa: dataQd.moTaHangHoa
            });
            await this.listBienBanLayMau(dataQd.soQd)
            let dataChiCuc = dataQd.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
            if (dataChiCuc) {
              this.listDiaDiemNhap = [];
              dataChiCuc.forEach(e => {
                this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
              });
              this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
              let set = new Set(this.loadDanhSachBbLm.map(item => JSON.stringify({
                maDiemKho: item.maDiemKho,
                maNhaKho: item.maNhaKho,
                maNganKho: item.maNganKho,
                maLoKho: item.maLoKho
              })));
              this.listDiaDiemNhap = this.listDiaDiemNhap.filter(item => {
                const key = JSON.stringify({
                  maDiemKho: item.maDiemKho,
                  maNhaKho: item.maNhaKho,
                  maNganKho: item.maNganKho,
                  maLoKho: item.maLoKho
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

  async listBienBanLayMau(event) {
    await this.spinner.show();
    let body = {
      soQd: event,
    }
    let res = await this.bienBanLayMauXhService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      if (data && data.content && data.content.length > 0) {
        this.loadDanhSachBbLm = data.content
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
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
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
      }
    });
  }

  isDisable() {
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

  async save(isGuiDuyet?: boolean) {
    this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    body.children = [...this.listDaiDienChiCuc, ...this.listDaiDienCuc];
    body.ketQuaNiemPhong = body.flagNiemPhong ? 1 : 0;
    body.fileDinhKems = this.fileDinhKem;
    body.canCuPhapLy = this.canCuPhapLy;
    body.fileNiemPhong = this.fileNiemPhong
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.id = data.id
        this.pheDuyet(true);
      } else {
        this.id = data.id
        await this.loadChitiet();
      }
    }
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

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["loaiBienBan"].setValidators([Validators.required]);
      this.formData.controls["nam"].setValidators([Validators.required]);
      this.formData.controls["maQhns"].setValidators([Validators.required]);
      this.formData.controls["maDvi"].setValidators([Validators.required]);
      this.formData.controls["tenDvi"].setValidators([Validators.required]);
      this.formData.controls["soHd"].setValidators([Validators.required]);
      this.formData.controls["ngayHd"].setValidators([Validators.required]);
      this.formData.controls["soBienBan"].setValidators([Validators.required]);
      this.formData.controls["ngayLayMau"].setValidators([Validators.required]);
      this.formData.controls["dviKnghiem"].setValidators([Validators.required]);
      this.formData.controls["ddiemLayMau"].setValidators([Validators.required]);
      this.formData.controls["loaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["soLuongLayMau"].setValidators([Validators.required]);
      this.formData.controls["ppLayMau"].setValidators([Validators.required]);
      this.formData.controls["chiTieuKiemTra"].setValidators([Validators.required]);
    } else {
      this.formData.controls["loaiBienBan"].clearValidators();
      this.formData.controls["nam"].clearValidators();
      this.formData.controls["maQhns"].clearValidators();
      this.formData.controls["maDvi"].clearValidators();
      this.formData.controls["tenDvi"].clearValidators();
      this.formData.controls["soHd"].clearValidators();
      this.formData.controls["ngayHd"].clearValidators();
      this.formData.controls["soBienBan"].clearValidators();
      this.formData.controls["ngayLayMau"].clearValidators();
      this.formData.controls["dviKnghiem"].clearValidators();
      this.formData.controls["ddiemLayMau"].clearValidators();
      this.formData.controls["loaiVthh"].clearValidators();
      this.formData.controls["tenLoaiVthh"].clearValidators();
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
      this.formData.controls["soLuongLayMau"].clearValidators();
      this.formData.controls["ppLayMau"].clearValidators();
      this.formData.controls["chiTieuKiemTra"].clearValidators();
    }
  }

  // async printPreview() {
  //   let body = this.formData.value;
  //   this.reportTemplate = {
  //     fileName: 'xdt_bien_ban_lay_mau'
  //   }
  //   body.reportTemplateRequest = this.reportTemplate;
  //   await this.bienBanLayMauXhService.preview(body).then(async s => {
  //     // this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
  //     // this.printSrc = s.data.pdfSrc;
  //     // this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
  //     // this.showDlgPreview = true;
  //   });
  // }

  // downloadPdf() {
  //   // saveAs(this.pdfSrc, "tong_hop_kh_lcnt.pdf");
  // }

  // downloadWord() {
  //   // saveAs(this.wordSrc, "tong_hop_kh_lcnt.docx");
  // }

  // closeDlg() {
  //   // this.showDlgPreview = false;
  // }

  // print() {
  //   // printJS({printable: this.printSrc, type: 'pdf', base64: true})
  // }

  // async preview() {
  //   let body = this.formData.value;
  //   body.reportTemplateRequest = this.reportTemplate;
  //   await this.tongHopDeXuatKHLCNTService.preview(body).then(async s => {
  //     this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
  //     this.printSrc = s.data.pdfSrc;
  //     this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
  //     this.showDlgPreview = true;
  //   });
  // }

  // downloadPdf() {
  //   saveAs(this.pdfSrc, "tong_hop_kh_lcnt.pdf");
  // }

  // downloadWord() {
  //   saveAs(this.wordSrc, "tong_hop_kh_lcnt.docx");
  // }

  // closeDlg() {
  //   this.showDlgPreview = false;
  // }

  // printPreview(){
  //   printJS({printable: this.printSrc, type: 'pdf', base64: true})
  // }
}
