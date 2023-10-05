import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Base2Component} from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {PhuongPhapLayMau} from 'src/app/models/PhuongPhapLayMau';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {Validators} from '@angular/forms';
import {
  TongHopDanhSachHangDTQGService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/TongHopDanhSachHangDTQG.service";
import {saveAs} from 'file-saver';
import {LOAI_HH_XUAT_KHAC} from "../../../../../../constants/config";
import {
  BienBanLayMauLuongThucHangDTQGService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/BienBanLayMauLuongThucHangDTQG.service";
import { PREVIEW } from '../../../../../../constants/fileType';

@Component({
  selector: 'app-xk-them-moi-bb-lay-mau-ban-giao-mau',
  templateUrl: './them-moi-bb-lay-mau-ban-giao-mau.component.html',
  styleUrls: ['./them-moi-bb-lay-mau-ban-giao-mau.component.scss']
})
export class ThemMoiBbLayMauBanGiaoMauComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() itemInput: any;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  fileDinhKems: any[] = [];
  fileDinhKemNiemPhong: any[] = [];
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listDsTongHop: any[] = [];
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
  bienBan: any[] = [];
  loaiHhXuatKhac = LOAI_HH_XUAT_KHAC;
  templateName = 'xuat_khac_ktcl_luong_thuc_bien_ban_lay_mau';

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private tongHopDanhSachHangDTQGService: TongHopDanhSachHangDTQGService,
    private bienBanLayMauLuongThucHangDTQGService: BienBanLayMauLuongThucHangDTQGService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauLuongThucHangDTQGService);

    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get("year")],
        maDvi: [, [Validators.required]],
        loaiBienBan: [],
        maQhNs: [],
        idTongHop: [, [Validators.required]],
        maDanhSach: [, [Validators.required]],
        tenDanhSach: [],
        ktvBaoQuan: [],
        soBienBan: [],
        ngayLayMau: [],
        dviKiemNghiem: [],
        diaDiemLayMau: [],
        maDiaDiem: [],
        loaiVthh: [],
        cloaiVthh: [],
        moTaHangHoa: [],
        soLuongMau: [],
        ppLayMau: [],
        chiTieuKiemTra: [],
        ketQuaNiemPhong: [],
        trangThai: [STATUS.DU_THAO],
        ngayGduyet: [],
        nguoiGduyetId: [],
        ngayPduyet: [],
        nguoiPduyetId: [],
        lyDoTuChoi: [],
        type: [],
        tenDvi: [],
        diaChiDvi: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenTrangThai: ['Dự Thảo'],
        tenCuc: [],
        tenChiCuc: [],
        tenDiemKho: [],
        tenNhaKho: [],
        tenNganKho: [],
        tenLoKho: [],
        nguoiPduyet: [],
        bbLayMauDtl: [new Array()],
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
        this.loadMaDs(),
        this.loadPhuongPhapLayMau(),
      ])
      await this.loadDetail(this.idInput)
      // if(this.itemInput){
      //   await  this.bindingDataDs(this.itemInput);
      // }
      await this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
    }
  }


  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.bienBanLayMauLuongThucHangDTQGService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            const data = res.data;
            this.checked = data.ketQuaNiemPhong;
            this.listDaiDienChiCuc = data.bbLayMauDtl;
            this.listFileDinhKem = data.fileDinhKems;
            this.canCu = data.canCu;
            this.fileNiemPhong = data.fileDinhKemNiemPhong;
            this.listDaiDienChiCuc = data.bbLayMauDtl.filter(x => x.loaiDaiDien == 'CHI_CUC')
            this.listDaiDienCuc = data.bbLayMauDtl.filter(x => x.loaiDaiDien == 'CUC')
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_XK_LT_BB_LAY_MAU_HDR_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        ktvBaoQuan: this.userInfo.TEN_DAY_DU,
        soBienBan: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
        loaiVthh: this.loaiVthh
      });
      this.radioValue = 'ALL'
    }

  }

  // async bindingDataDs(item){
  //   console.log(item,"uietem")
  //   let dataRes = await this.tongHopDanhSachHangDTQGService.getDetail(item.idHdr)
  //   const data = dataRes.data;
  //  this.formData.patchValue({
  //      idTongHop:data.id,
  //      tenDanhSach:data.tenDanhSach,
  //      maDanhSach:data.maDanhSach,
  //      maDiaDiem:item.maDiaDiem,
  //      loaiVthh:item.loaiVthh,
  //      cloaiVthh:item.cloaiVthh,
  //      tenLoaiVthh:item.tenLoaiVthh,
  //      tenCloaiVthh:item.tenCloaiVthh,
  //      tenChiCuc:item.tenChiCuc,
  //      tenDiemKho:item.tenDiemKho,
  //      tenNhaKho:item.tenNhaKho,
  //      tenNganKho:item.tenNganKho,
  //      tenLoKho:item.tenLoKho,
  //  }
  //  )
  // }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadMaDs() {
    let body = {
      trangThai: STATUS.GUI_DUYET,
      loai: this.loaiHhXuatKhac.LT_6_THANG,
    }
    let res = await this.tongHopDanhSachHangDTQGService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listDsTongHop = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogMaDs() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách tổng hợp hàng DTQG còn 6 tháng hết hạn lưu kho ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDsTongHop,
        dataHeader: ['Mã danh sách', 'Tên danh sách', 'Ngày tạo'],
        dataColumn: ['maDanhSach', 'tenDanhSach', 'ngayTao'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataDs(data.id, true);
      }
    });
  };

  async bindingDataDs(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.tongHopDanhSachHangDTQGService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      idTongHop: data.id,
      tenDanhSach: data.tenDanhSach,
      maDanhSach: data.maDanhSach,


    });
    if (data.tongHopDtl) {
      this.listDiaDiemNhap = data.tongHopDtl;
    }
    await this.listBienBan(data.maDanhSach)
    await this.spinner.hide();
  }

  async listBienBan(maDanhSach) {
    await this.spinner.show();
    let body = {
      maDanhSach: maDanhSach,
    }
    let res = await this.bienBanLayMauLuongThucHangDTQGService.search(body)
    this.bienBan = res.data.content;
    let listDd = [
      ...this.listDiaDiemNhap.filter((e) => {
        return !this.bienBan.some((bb) => {
          if (bb.maDiaDiem.length > 0 && e.maDiaDiem.length > 0) {
            return e.maDiaDiem === bb.maDiaDiem;
          }
        });
      }),
    ];
    this.listDiaDiemNhap = listDd;
    console.log(this.listDiaDiemNhap, "this.listDiaDiemNhap")
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
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      this.formData.patchValue({
        maDiaDiem: data.maDiaDiem,
        tenDiemKho: data.tenDiemKho,
        tenNhaKho: data.tenNhaKho,
        tenNganKho: data.tenNganKho,
        tenLoKho: data.tenLoKho,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
      })
    }
  }

  async save(isGuiDuyet?) {
    // this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maBb;
    }
    body.fileDinhKems = this.listFileDinhKem;
    body.canCu = this.canCu;
    body.fileDinhKemNiemPhong = this.fileNiemPhong;
    body.bbLayMauDtl = [...this.listDaiDienChiCuc, ...this.listDaiDienCuc];
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

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC) {
      return true
    }
    return false;
  }

  async loadPhuongPhapLayMau() {
    this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.phuongPhapLayMaus = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }
  async preview(id) {
    this.spinner.show();
    await this.bienBanLayMauLuongThucHangDTQGService.preview({
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
    saveAs(this.pdfSrc, this.templateName + ".pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, this.templateName + ".docx");
  }

}
