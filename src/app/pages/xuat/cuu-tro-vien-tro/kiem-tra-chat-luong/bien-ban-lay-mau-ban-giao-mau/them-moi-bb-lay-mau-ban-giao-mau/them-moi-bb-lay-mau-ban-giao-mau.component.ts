import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './../../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BienBanLayMauBanGiaoMauService } from './../../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BienBanLayMauBanGiaoMau.service';
import { Base2Component } from './../../../../../../components/base2/base2.component';
import dayjs from 'dayjs';
import { FileDinhKem } from './../../../../../../models/FileDinhKem';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { QuyetDinhGiaoNvCuuTroService } from './../../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service';
import { DialogTableSelectionComponent } from './../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component';
import { isEmpty } from 'lodash';
import { PhuongPhapLayMau } from './../../../../../../models/PhuongPhapLayMau';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { ItemDaiDien } from 'src/app/pages/nhap/dau-thau/kiem-tra-chat-luong/quan-ly-bien-ban-lay-mau/them-moi-bien-ban-lay-mau/thanhphan-laymau/thanhphan-laymau.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-them-moi-bb-lay-mau-ban-giao-mau',
  templateUrl: './them-moi-bb-lay-mau-ban-giao-mau.component.html',
  styleUrls: ['./them-moi-bb-lay-mau-ban-giao-mau.component.scss']
})
export class ThemMoiBbLayMauBanGiaoMauComponent extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  fileDinhKems: any[] = [];
  fileDinhKemNiemPhong: any[] = [];
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
  listFileDinhKem: any = [];
  fileNiemPhong: any = [];
  dataEdit: { [key: string]: { edit: boolean; data: ItemDaiDien } } = {};

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
    private bienBanLayMauBanGiaoMauService: BienBanLayMauBanGiaoMauService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauBanGiaoMauService);

    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year")],
        maDvi: [, [Validators.required]],
        loaiBienBan: [],
        maQhNs: [],
        idQdGiaoNvXh: [, [Validators.required]],
        soQdGiaoNvXh: [, [Validators.required]],
        ngayQdGiaoNvXh: [, [Validators.required]],
        ktvBaoQuan: [],
        soBienBan: [, [Validators.required]],
        ngayLayMau: [, [Validators.required]],
        dviKiemNghiem: [, [Validators.required]],
        diaDiemLayMau: [, [Validators.required]],
        loaiVthh: [],
        cloaiVthh: [],
        moTaHangHoa: [],
        maDiemKho: [],
        maNhaKho: [],
        maNganKho: [],
        maLoKho: [],
        soLuongMau: [, [Validators.required]],
        ppLayMau: [, [Validators.required]],
        chiTieuKiemTra: [, [Validators.required]],
        ketQuaNiemPhong: [],
        trangThai: [STATUS.DU_THAO],
        lyDoTuChoi: [],
        soBbHaoDoi: [],
        soBbTinhKho: [],
        ngayXuatDocKho: [],
        type: [],
        tenDvi: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenTrangThai: ['Dự Thảo'],
        diaChiDvi: [],
        tenDiemKho: [],
        tenNhaKho: [],
        tenNganKho: [],
        tenLoKho: [],
        nguoiLienQuan: [],
        fileDinhKems: [new Array<FileDinhKem>()],
        canCu: [new Array<FileDinhKem>()],
        fileDinhKemNiemPhong: [new Array<FileDinhKem>()],

      }
    );
    this.maBb = 'BBLM-' + this.userInfo.DON_VI.tenVietTat;

    // this.setTitle();
  }

  async ngOnInit() {
    try {
      this.spinner.show();

      await Promise.all([
        this.loadSoQuyetDinh(),
        this.loadPhuongPhapLayMau(),
      ])
      await this.loadDetail(this.idInput)
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
      await this.bienBanLayMauBanGiaoMauService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            const data = res.data;
            this.checked = data.ketQuaNiemPhong;
            this.listDaiDienChiCuc = data.nguoiLienQuan;
            this.listFileDinhKem = data.fileDinhKems;
            this.canCu = data.canCu;
            this.fileNiemPhong = data.fileDinhKemNiemPhong;
            this.listDaiDienChiCuc = data.nguoiLienQuan.filter(x => x.loaiDaiDien == 'CHI_CUC')
            this.listDaiDienCuc = data.nguoiLienQuan.filter(x => x.loaiDaiDien == 'CUC')
            this.listDaiDienChiCuc.forEach((item, index) => {
              this.dataEdit[index] = {
                edit: false,
                data: { ...item },
              };
            });
            this.listDaiDienCuc.forEach((item, index) => {
              this.dataEdit[index] = {
                edit: false,
                data: { ...item },
              };
            });
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_CTVT_BB_LAY_MAU_HDR_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        ktvBaoQuan: this.userInfo.TEN_DAY_DU,
        soBienBan: `${id}/${this.formData.get('nam').value}/${this.maBb}`,

      });
    }

  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadSoQuyetDinh() {
    let body = {
      trangThai: STATUS.BAN_HANH,
    }
    let res = await this.quyetDinhGiaoNvCuuTroService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayKy', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id, true);
      }
    });
  };

  async bindingDataQd(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNvCuuTroService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvXh: data.soQd,
      idQdGiaoNvXh: data.id,
      ngayQdGiaoNvXh: data.ngayKy,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,

    });
    let dataChiCuc = data.noiDungCuuTro.find(item => item.maDviChiCuc == this.userInfo.MA_DVI);
    console.log(data, "data");
    console.log(dataChiCuc, 123);
    if (dataChiCuc) {
      this.listDiaDiemNhap = [...this.listDiaDiemNhap, dataChiCuc];
    }
    await this.spinner.hide();
  }



  openDialogDdiemNhapHang() {
    console.log(this.listDiaDiemNhap, 1234);
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
      })
    }
  }

  async save(isGuiDuyet?) {
    // this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maBb;
    }
    console.log(body, "cmm");
    body.fileDinhKems = this.listFileDinhKem;
    body.canCu = this.canCu;
    body.fileDinhKemNiemPhong = this.fileNiemPhong;
    body.nguoiLienQuan = [...this.listDaiDienChiCuc, ...this.listDaiDienCuc];
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.pheDuyet();
      } else {
        this.goBack()
      }
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let data = await this.detail(id);
      this.formData.patchValue({
        soQd: data.soQd.split('/')[0]
      })
      this.dataTable = data.children;
    };
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.BAN_HANH || trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC) {
      return true
    }
    return false;
  }
  async loadPhuongPhapLayMau() {
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

}