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
  listDiaDiemXh: any[] = [];
  phuongPhapLayMaus: any[] = [];
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  canCuPhapLy: any[] = [];
  fileNiemPhong: any[] = [];
  bienBanLayMau: any[] = [];

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
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      loaiBienBan: ['', [Validators.required]],
      nam: [dayjs().get('year'), [Validators.required]],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maQhns: [''],

      soQd: ['', [Validators.required]],
      idQd: ['', [Validators.required]],
      soHd: [''],
      ngayQd: [''],
      ngayHd: [''],

      idKtv: [''],
      tenKtv: [''],

      soBienBan: ['', [Validators.required]],
      ngayLayMau: [dayjs().format('YYYY-MM-DD'), [Validators.required]],


      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],

      idDdiemXh: [''],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],

      dviKnghiem: ['', [Validators.required]],
      ddiemLayMau: ['', [Validators.required]],

      soLuongLayMau: ['', [Validators.required]],
      ppLayMau: ['', [Validators.required]],
      chiTieuKiemTra: ['', [Validators.required]],
      ketQuaNiemPhong: [],
      flagNiemPhong: [],

    })
  }

  async ngOnInit() {
    await Promise.all([
      this.loadDataComboBox()
    ]);
    if (this.id > 0) {
      await this.loadChitiet();
    } else {
      this.initForm();
    }
  }

  async openDialogSoQd() {
    let dataQd = [];
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
      maChiCuc: this.userInfo.MA_DVI
    }
    let res = await this.quyetDinhGiaoNhiemVuXuatHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataQd = res.data?.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataQd,
        dataHeader: ['Số quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQd', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  }

  async bindingDataQd(id) {
    await this.spinner.show();
    let res = await this.quyetDinhGiaoNhiemVuXuatHangService.getDetail(id);
    if (res.data) {
      const data = res.data;
      this.formData.patchValue({
        soQd: data.soQd,
        idQd: data.id,
        soHd: data.soHd,
        ngayQd: data.ngayTao,
        ngayHd: data.ngayKy,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa
      });
      this.listBienBanLayMau(data.soQd)
      let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
      if (dataChiCuc && dataChiCuc.length > 0) {
        this.listDiaDiemXh = dataChiCuc[0].children;
      }
    };
    await this.spinner.hide();
  }

  async listBienBanLayMau(even) {
    await this.spinner.show();
    let body = {
      soQd: even,
      loaiVthh: this.loaiVthh,
      nam: this.formData.value.nam,
    }
    let res = await this.bienBanLayMauXhService.search(body)
    const data = res.data;
    this.bienBanLayMau = data.content;
    const diffList = [
      ...this.listDiaDiemXh.filter((item) => {
        console.log(item, 999)
        return !this.bienBanLayMau.some((child) => {
          if (child.maNganKho.length > 0 && item.maNganKho.length > 0) {
            return item.maNganKho === child.maNganKho;
          } else {
            return item.maDiemKho === child.maDiemKho;
          }
        });
      }),
    ];
    this.listDiaDiemXh = diffList;
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH DỊA ĐIỂM XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemXh,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
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
          // soLuong: data.soLuong
        });
      }
    });
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.DA_DUYET_LDCC) {
      return true;
    } else {
      return false;
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_BB_LAY_MAU_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      soBienBan: `${id}/${this.formData.get('nam').value}/BBLM-CCDTVP`,
      tenKtv: this.userInfo.TEN_DAY_DU,
    });
    if (this.idQdGiaoNvXh) {
      await this.bindingDataQd(this.idQdGiaoNvXh);
    }
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
        this.phuongPhapLayMaus = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }

  async save(isGuiDuyet?: boolean) {
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
        // this.goBack();
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

}
