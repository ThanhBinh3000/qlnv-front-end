import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Base2Component } from '../../../../../../../../components/base2/base2.component';
import { PhuongPhapLayMau } from '../../../../../../../../models/PhuongPhapLayMau';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DanhMucService } from '../../../../../../../../services/danhmuc.service';
import dayjs from 'dayjs';
import { Validators } from '@angular/forms';
import { STATUS } from '../../../../../../../../constants/status';
import { FileDinhKem } from '../../../../../../../../models/FileDinhKem';
import { MESSAGE } from '../../../../../../../../constants/message';
import {
  DialogTableSelectionComponent,
} from '../../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component';
import {
  QuyetDinhGiaoNvXuatHangService,
} from '../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhGiaoNvXuatHang.service';
import {
  BienBanLayMauVtKtclService,
} from '../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/BienBanLayMauVtKtcl.service';
import {
  PhieuXuatNhapKhoService,
} from '../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuXuatNhapKho.service';
import { KhCnQuyChuanKyThuat } from '../../../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat';
import { FILETYPE, PREVIEW } from '../../../../../../../../constants/fileType';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-thong-tin-bien-ban-lay-mau-ban-giao-mau',
  templateUrl: './thong-tin-bien-ban-lay-mau-ban-giao-mau.component.html',
  styleUrls: ['./thong-tin-bien-ban-lay-mau-ban-giao-mau.component.scss'],
})
export class ThongTinBienBanLayMauBanGiaoMauComponent extends Base2Component implements OnInit {
  @Input() soQdGiaoNvXh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listSoQuyetDinh: any[] = [];
  listDiaDiemNhap: any[] = [];
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  maBb: string;
  radioValue: any;
  checked: boolean = false;
  canCu: any = [];
  fileNiemPhong: any = [];
  bienBan: any[] = [];
  fileDinhKems: any[] = [];
  listFiles: any = [];
  listPhieuXuatKho: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private phieuXuatKhoService: PhieuXuatNhapKhoService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private bienBanLayMauVtKtclService: BienBanLayMauVtKtclService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauVtKtclService);

    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get('year')],
        maDvi: [, [Validators.required]],
        loaiBienBan: ['LAY_MAU', [Validators.required]],
        maQhNs: [],
        idQdGiaoNvXh: [null, [Validators.required]],
        soQdGiaoNvXh: [null, [Validators.required]],
        ngayQdGiaoNvXh: [null],
        idPhieuXuatKho: [null, [Validators.required]],
        soPhieuXuatKho: [null, [Validators.required]],
        soBienBan: [null, [Validators.required]],
        ngayLayMau: [null],
        ngayXuatLayMau: [null],
        dviKiemNghiem: [null, [Validators.required]],
        diaDiemLayMau: [null, [Validators.required]],
        loaiVthh: [null],
        cloaiVthh: [null],
        maDiaDiem: [null, [Validators.required]],
        maDiemKho: [null],
        maNhaKho: [null],
        maNganKho: [null],
        maLoKho: [null],
        soLuongMau: [null, [Validators.required]],
        ppLayMau: [null],
        chiTieuKiemTra: [null],
        ppLayMauList: [null],
        chiTieuKiemTraList: [null],
        ketQuaNiemPhong: [null],
        trangThai: [STATUS.DU_THAO],
        lyDoTuChoi: [null],
        type: [null],
        tenDvi: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenTrangThai: ['Dự Thảo'],
        diaChiDvi: [null],
        tenDiaDiem: [null],
        tenDiemKho: [null],
        tenNhaKho: [null],
        tenNganKho: [null],
        tenLoKho: [null],
        xhXkVtBbLayMauDtl: [new Array()],
        fileDinhKems: [new Array<FileDinhKem>()],
      },
    );
    this.maBb = 'BBLM-' + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadSoQuyetDinhGiaoNvXh(),
        // this.loadPhuongPhapLayMau(),
      ]);
      await this.loadDetail(this.idInput);
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.bienBanLayMauVtKtclService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            let itemQd = this.listSoQuyetDinh.find(item => item.soQuyetDinh == res.data.soQdGiaoNvXh);
            if (itemQd) {
              this.bindingDataQd(itemQd);
            }
            this.formData.patchValue(res.data);
            const data = res.data;
            this.checked = data.ketQuaNiemPhong;
            this.formData.patchValue({
              soPhieuXuatKho: data.soPhieuXuatKho,
              tenDiaDiem: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho,
            });
            // await this.getListPhieuXuatKho(data.soQuyetDinh)
            if (data.fileDinhKems) {
              this.fileDinhKems = data.fileDinhKems.filter(item => item.fileType === FILETYPE.FILE_DINH_KEM);
              this.canCu = data.fileDinhKems.filter(item => item.fileType === FILETYPE.CAN_CU_PHAP_LY);
              this.fileNiemPhong = data.fileDinhKems.filter(item => item.fileType === FILETYPE.ANH_DINH_KEM);
            }
            //Xử lý pp lấy mẫu và chỉ tiêu kiểm tra chất lượng
            if (data.ppLayMau) {
              let ppLayMauOptions = data.ppLayMau.indexOf(',') > 0 ? data.ppLayMau.split(',') : [data.ppLayMau];
              ppLayMauOptions = ppLayMauOptions.map((str, index) => ({ label: str, value: index + 1, checked: true }));
              this.formData.patchValue({
                ppLayMauList: ppLayMauOptions,
              });
            }
            if (data.chiTieuKiemTra) {
              let chiTieuOptions = data.chiTieuKiemTra.indexOf(',') > 0 ? data.chiTieuKiemTra.split(',') : [data.chiTieuKiemTra];
              chiTieuOptions = chiTieuOptions.map((str, index) => ({ label: str, value: index + 1, checked: true }));
              this.formData.patchValue({
                chiTieuKiemTraList: chiTieuOptions,
              });
            }
            this.listDaiDienChiCuc = data.xhXkVtBbLayMauDtl.filter(x => x.loaiDaiDien == 'CHI_CUC');
            this.listDaiDienCuc = data.xhXkVtBbLayMauDtl.filter(x => x.loaiDaiDien == 'CUC');
            console.log(this.listPhieuXuatKho,"123")
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_XK_VT_BB_LAY_MAU_HDR_SEQ');
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        ktvBaoQuan: this.userInfo.TEN_DAY_DU,
        soBienBan: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
      });
      if (this.soQdGiaoNvXh) {
        let dataQdGiaoNvXh = this.listSoQuyetDinh.find(item => item.soQuyetDinh == this.soQdGiaoNvXh);
        if (dataQdGiaoNvXh) {
          this.bindingDataQd(dataQdGiaoNvXh);
        }
      }
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadSoQuyetDinhGiaoNvXh() {
    let body = {
      // namKeHoach: this.formData.get('nam').value,
      dvql: this.userInfo.MA_DVI,
      trangThai: STATUS.DA_DUYET_LDC,
      listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    };
    let res = await this.quyetDinhGiaoNvXuatHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
      console.log(this.userInfo.MA_DVI,444)
      console.log(this.listSoQuyetDinh,555)
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Năm'],
        dataColumn: ['soQuyetDinh', 'ngayKy', 'namKeHoach'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data);
        this.formData.patchValue({
          soPhieuXuatKho: null,
          idPhieuXuatKho:null,
          maDiemKho: null,
          tenDiaDiem: null,
          tenDiemKho: null,
          maNhaKho: null,
          tenNhaKho: null,
          maNganKho: null,
          tenNganKho: null,
          maLoKho: null,
          tenLoKho: null,
          cloaiVthh: null,
          tenCloaiVthh: null,
        });
      }
    });
  };


  async bindingDataQd(data) {
    try {
      await this.spinner.show();
      this.formData.patchValue({
        soQdGiaoNvXh: data.soQuyetDinh,
        idQdGiaoNvXh: data.id,
        ngayQdGiaoNvXh: data.ngayKy,
        // soPhieuXuatKho: null,
        // idPhieuXuatKho:null,
        // maDiemKho: null,
        // tenDiemKho: null,
        // maNhaKho: null,
        // tenNhaKho: null,
        // maNganKho: null,
        // tenNganKho: null,
        // maLoKho: null,
        // tenLoKho: null,
        // cloaiVthh: null,
        // tenCloaiVthh: null,
      });
      await this.getListPhieuXuatKho(data.soQuyetDinh);
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async getListPhieuXuatKho(itemQdGnvXh) {
    await this.spinner.show();
    this.listPhieuXuatKho = [];
    try {
      let body = {
        soCanCu: itemQdGnvXh,
        // namKeHoach: this.formData.get('nam').value,
        trangThai: STATUS.DA_DUYET_LDCC
      };
      let res = await this.phieuXuatKhoService.search(body);
      console.log(res,777)
      if (res.msg == MESSAGE.SUCCESS) {
        this.listPhieuXuatKho = this.idInput > 0 ? res.data.content : res.data.content.filter(item => !item.soBbLayMau);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async listBienBan(item) {
    await this.spinner.show();
    let body = {
      soQdGiaoNvXh: item,
    };
    let res = await this.bienBanLayMauVtKtclService.search(body);
    const data = res.data;
    this.bienBan = data.content;
    const listDd = [
      ...this.listDiaDiemNhap.filter((e) => {
        return !this.bienBan.some((bb) => {
          if (bb.maLoKho.length > 0 && e.maLoKho.length > 0) {
            return e.maLoKho === bb.maLoKho;
          } else {
            return e.maNganKho === bb.maNganKho;
          }
        });
      }),
    ];
    this.listDiaDiemNhap = listDd;
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
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
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
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
      });
    }
  }

  async save(isGuiDuyet?) {
    let body = this.formData.value;
    //xử lý 3 loại file đính kèm , căn cứ pháp lý và ảnh biên bản lấy mẫu đc chụp
    this.listFiles = [];
    if (this.fileDinhKems.length > 0) {
      this.fileDinhKems.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM;
        this.listFiles.push(item);
      });
    }
    if (this.canCu.length > 0) {
      this.canCu.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY;
        this.listFiles.push(element);
      });
    }
    if (this.fileNiemPhong.length > 0) {
      this.fileNiemPhong.forEach(element => {
        element.fileType = FILETYPE.ANH_DINH_KEM;
        this.listFiles.push(element);
      });
    }
    if (this.listFiles && this.listFiles.length > 0) {
      body.fileDinhKems = this.listFiles;
    }
    // xử lý pp lấy mẫu và tiêu chuẩn cần lấy mẫu kiểm tra
    if (body.ppLayMauList && body.ppLayMauList.length > 0) {
      body.ppLayMau = body.ppLayMauList.map(function(item) {
        return item['label'];
      }).join(',');
    }
    if (body.chiTieuKiemTraList && body.chiTieuKiemTraList.length > 0) {
      body.chiTieuKiemTra = body.chiTieuKiemTraList.map(function(item) {
        return item['label'];
      }).join(',');
    }
    // xử lý người liên quan
    if (this.listDaiDienChiCuc && this.listDaiDienChiCuc.length > 0) {
      this.listDaiDienChiCuc.forEach(item => {
        item.loaiDaiDien = 'CHI_CUC';
      });
    }
    if (this.listDaiDienCuc && this.listDaiDienCuc.length > 0) {
      this.listDaiDienCuc.forEach(item => {
        item.loaiDaiDien = 'CUC';
      });
    }
    body.xhXkVtBbLayMauDtl = [...this.listDaiDienChiCuc, ...this.listDaiDienCuc];
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.pheDuyet();
      }
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
    this.reject(this.idInput, trangThai);
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDC) {
      return true;
    }
    return false;
  }

  async loadPhuongPhapLayMau(cloaiVthh) {
    this.danhMucService.loadDanhMucHangChiTiet(cloaiVthh).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.ppLayMau && res.data.ppLayMau.length > 0) {
          let ppLayMauOptions = [];
          res.data.ppLayMau.forEach(item => {
            let option = {
              label: item.giaTri,
              value: item.ma,
              checked: true,
            };
            ppLayMauOptions.push(option);
            this.formData.patchValue({
              ppLayMauList: ppLayMauOptions,
            });
          });
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    });
  }

  async loadChiTieuCl(cloaiVthh) {
    this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(cloaiVthh).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.length > 0) {
          let chiTieuClOptions = [];
          res.data.forEach(item => {
            let option = {
              label: item.tenChiTieu,
              value: item.id,
              checked: true,
            };
            chiTieuClOptions.push(option);
            this.formData.patchValue({
              chiTieuKiemTraList: chiTieuClOptions,
            });
          });
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    });
  }

  async changeValuePhieuXuatKho($event) {
    if ($event) {
      let item = this.listPhieuXuatKho.find(it => it.soPhieu == $event);
      if (item) {
        this.formData.patchValue({
          maDiaDiem: item.maDiaDiem,
          idPhieuXuatKho: item.id,
          tenDiaDiem: item.tenLoKho ? item.tenLoKho + ' - ' + item.tenNganKho : item.tenNganKho,
          tenNhaKho: item.tenNhaKho,
          tenDiemKho: item.tenDiemKho,
          tenLoaiVthh: item.tenLoaiVthh,
          loaiVthh: item.loaiVthh,
          cloaiVthh: item.cloaiVthh,
          tenCloaiVthh: item.tenCloaiVthh,
          ngayXuatLayMau: item.ngayXuat,
        });
        await this.loadPhuongPhapLayMau(item.cloaiVthh);
        await this.loadChiTieuCl(item.cloaiVthh);
      }
    }
  }

  templateName = 'xuat_khac_ktcl_vat_tu_6_thang_bien_ban_lay_mau';


  async preview(id) {
    this.spinner.show();
    await this.bienBanLayMauVtKtclService.preview({
      tenBaoCao: this.templateName,
      id: id,
    }).then(async res => {
      if (res.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
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
}
