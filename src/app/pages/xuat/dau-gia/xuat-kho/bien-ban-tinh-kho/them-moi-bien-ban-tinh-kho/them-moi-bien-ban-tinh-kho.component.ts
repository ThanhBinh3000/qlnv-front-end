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
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {
  PhieuKiemNghiemChatLuongService
} from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuKiemNghiemChatLuong.service';
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {Validators} from '@angular/forms';
import {
  BienBanTinhKhoService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BienBanTinhKho.service';
import {
  PhieuXuatKhoService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/PhieuXuatKho.service';
import {
  QuyetDinhGiaoNvXuatHangService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';
import {PREVIEW} from "../../../../../../constants/fileType";

@Component({
  selector: 'app-bdg-them-moi-bien-ban-tinh-kho',
  templateUrl: './them-moi-bien-ban-tinh-kho.component.html',
  styleUrls: ['./them-moi-bien-ban-tinh-kho.component.scss']
})
export class ThemMoiBienBanTinhKhoComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() idQdNv: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  listPhieuXuatKho: any[] = [];
  fileDinhKems: any[] = [];
  maBb: string;
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;
  idPhieuXk: number = 0;
  openPhieuXk = false;
  idBangKe: number = 0;
  openBangKe = false;
  flagInit: Boolean = false;
  listBienBanTinhKho: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    private phieuXuatKhoService: PhieuXuatKhoService,
    private bienBanTinhKhoService: BienBanTinhKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanTinhKhoService);

    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year")],
        maDvi: [''],
        tenDvi: [''],
        maQhns: [],
        soBbTinhKho: [''],
        ngayTaoBb: [''],
        idQdGiaoNvXh: [],
        soQdGiaoNvXh: ['', [Validators.required]],
        ngayQdGiaoNvXh: [''],
        idHdong: [],
        soHdong: [''],
        ngayKyHd: [''],
        maDiemKho: [''],
        tenDiemKho:[''],
        maNhaKho: [''],
        tenNhaKho: [''],
        maNganKho: [],
        tenNganKho: [''],
        maLoKho: [],
        tenLoKho: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        moTaHangHoa: [''],
        ngayBatDauXuat: [''],
        ngayKetThucXuat: [''],
        tongSlNhap: [10000],
        tongSlXuat: [],
        slConLai: [],
        slThucTeCon: [],
        slThua: [],
        slThieu: [],
        nguyenNhan: [''],
        kienNghi: [''],
        ghiChu: [''],
        tenThuKho:[''],
        tenKtvBaoQuan: [''],
        tenKeToan: [''],
        tenLanhDaoChiCuc: [''],
        trangThai: [''],
        tenTrangThai: [''],
        lyDoTuChoi:[''],
        listPhieuXuatKho: [new Array()],
        fileDinhKems: [new Array<FileDinhKem>()],
        donViTinh:[''],
      }
    );
    this.maBb = '-BBTK';
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      if(this.idInput){
        await this.loadDetail(this.idInput);
      }else {
        await this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
      this.flagInit = true;
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_CTVT_PHIEU_XUAT_KHO_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      soBbTinhKho: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
      ngayTaoBb: dayjs().format('YYYY-MM-DD'),
      ngayKetThucXuat: dayjs().format('YYYY-MM-DD'),
      tenThuKho: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
    });
    if(this.idQdNv){
      this.bindingDataQd(this.idQdNv)
    }
  }

  async loadDetail(idInput: number) {
    if(idInput >0){
      let data = await this.detail(idInput);
      this.fileDinhKems = data.fileDinhKems;
      this.dataTable = data.listPhieuXuatKho;
    }
  }

  async openDialogSoQd() {
    await this.spinner.show();
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
    }
    let res = await this.quyetDinhGiaoNvXuatHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS){
      let data = res.data.content;
      if (data && data.length > 0){
        this.listSoQuyetDinh = data;
        this.listSoQuyetDinh = this.listSoQuyetDinh.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
      }
    }else {
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
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayKy', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id, );
      }
    });
    await this.spinner.hide();
  }

  changeSoQd(event) {
    if (this.flagInit && event && event !== this.formData.value.soQdGiaoNvXh) {
      this.formData.patchValue({
        maDiemKho: null,
        tenDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        soPhieuKnCl: null,
        loaiVthh: null,
        cloaiVthh: null,
        tenLoaiVthh: null,
        tenCloaiVthh: null,
        moTaHangHoa: null,
      });
    }
  }

  async bindingDataQd(id) {
    await this.spinner.show();
    if(id > 0){
      await this.quyetDinhGiaoNvXuatHangService.getDetail(id)
        .then(async (res) =>{
          if(res.msg == MESSAGE.SUCCESS){
            const dataQd = res.data
            this.formData.patchValue({
              soQdGiaoNvXh: dataQd.soQd,
              idQdGiaoNvXh: dataQd.id,
              ngayQdGiaoNvXh: dataQd.ngayKy,
              soHdong: dataQd.soHd,
              idHdong: dataQd.idHd,
              ngayKyHd: dataQd.ngayKyHd,
              loaiVthh: dataQd.loaiVthh,
              cloaiVthh: dataQd.cloaiVthh,
            });
            await this.loadBienBanTinhKho(dataQd.soQd);
            let dataChiCuc = dataQd.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
            if (dataChiCuc) {
              this.listDiaDiemNhap = [];
              dataChiCuc.forEach(e =>{
                this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
              });
              this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
              let set1 = new Set(this.listBienBanTinhKho.map(item => JSON.stringify({
                maDiemKho: item.maDiemKho,
                maNhaKho: item.maNhaKho,
                maNganKho: item.maNganKho,
                maLoKho: item.maLoKho
              })));
              this.listDiaDiemNhap = this.listDiaDiemNhap.filter(item =>{
                const key = JSON.stringify({
                  maDiemKho: item.maDiemKho,
                  maNhaKho: item.maNhaKho,
                  maNganKho: item.maNganKho,
                  maLoKho: item.maLoKho
                });
                return !set1.has(key);
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

  async loadBienBanTinhKho(event){
    let body = {
      soQdGiaoNvXh : event,
    }
    let res = await this.bienBanTinhKhoService.search(body);
    if (res.msg == MESSAGE.SUCCESS){
      let data = res.data;
      if(data && data.content && data.content.length >0) {
        this.listBienBanTinhKho = data.content;
      }
    }else {
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
    if(data) {
      this.formData.patchValue({
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        soPhieuKnCl: data.soPhieu,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
      });
      await this.loadPhieuDtl(data);
    }
    });
  }

  async loadPhieuDtl(data){
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      loaiVthh: this.loaiVthh,
      soQdGiaoNvXh: this.formData.value.soQdGiaoNvXh,
    }
    let res = await this.phieuXuatKhoService.search(body);
    if(res.msg == MESSAGE.SUCCESS) {
      let danhSachPhieu = res.data.content
      if(danhSachPhieu && danhSachPhieu.length > 0){
        this.listPhieuXuatKho = danhSachPhieu.filter(item =>
          item.maDiemKho == data.maDiemKho &&
          item.maNhaKho == data.maNhaKho &&
          item.maNganKho == data.maNganKho &&
          item.maLoKho == data.maLoKho
        );
        this.dataTable = this.listPhieuXuatKho;
        this.dataTable.forEach(s =>{
          s.slXuat = s.thucXuat;
          s.idPhieuXuatKho = s.id;
          s.idBkCanHang = s.idBangKeCh;
          s.soBkCanHang = s.soBangKeCh;
        })
        this.formData.patchValue({
          ngayBatDauXuat: this.listPhieuXuatKho[0].ngayXuatKho,
          donViTinh: this.listPhieuXuatKho[0].donViTinh,
          tongSlXuat : this.dataTable.reduce((prev, cur) => prev + cur.slXuat, 0),
          slConLai : this.formData.value.tongSlNhap - this.dataTable.reduce((prev, cur) => prev + cur.slXuat, 0),
        })
      }
    }
  }

  changeDd(event) {
    if (this.flagInit && event && event !== this.formData.value.maDiemKho) {
      this.dataTable.forEach(s => {
          s.slXuat = null;
          s.soBkCanHang = null;
          s.idBkCanHang = null;
          s.idPhieuXuatKho = null;
        }
      )
    }
  }

  async save(isGuiDuyet?: boolean) {
    this.setValidator(isGuiDuyet);
    if (this.dataTable.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Hiện chưa có thông tin bảng kê cân hàng và phiếu nhập kho',
      );
      return;
    }
    let body = this.formData.value;
    body.listPhieuXuatKho = this.dataTable;
    body.fileDinhKems = this.fileDinhKems;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id
        this.pheDuyet(true);
      } else {
        this.idInput = data.id
        await this.loadDetail(data.id);
      }
    }
  }
  pheDuyet(isPheDuyet) {
    let trangThai = '';
    let msg = '';
    if (isPheDuyet) {
      switch (this.formData.value.trangThai) {
        case STATUS.TU_CHOI_LDCC:
        case STATUS.TU_CHOI_KT:
        case STATUS.TU_CHOI_KTVBQ:
        case STATUS.DU_THAO: {
          trangThai = STATUS.CHO_DUYET_KTVBQ;
          msg = MESSAGE.GUI_DUYET_CONFIRM;
          break;
        }
        case STATUS.CHO_DUYET_KTVBQ: {
          trangThai = STATUS.CHO_DUYET_KT;
          msg = MESSAGE.GUI_DUYET_CONFIRM;
          break;
        }
        case STATUS.CHO_DUYET_KT: {
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
      this.approve(this.idInput, trangThai, msg)
    } else {
      switch (this.formData.value.trangThai) {
        case STATUS.CHO_DUYET_LDCC: {
          trangThai = STATUS.TU_CHOI_LDCC;
          break;
        }
        case STATUS.CHO_DUYET_KT: {
          trangThai = STATUS.TU_CHOI_KT;
          break;
        }
        case STATUS.CHO_DUYET_KTVBQ: {
          trangThai = STATUS.TU_CHOI_KTVBQ;
          break;
        }
      }
      this.reject(this.idInput, trangThai)
    }
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.CHO_DUYET_KT || trangThai == STATUS.CHO_DUYET_KTVBQ) {
      return true
    }
    return false;
  }

  calcTong(columnName) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[columnName];
        return prev;
      }, 0);
      return sum;
    }
  }

  slChenhLech() {
    if (this.flagInit) {
      if (this.formData.value.slThucTeCon > 0 && this.formData.value.slConLai > 0) {
        if (this.formData.value.slThucTeCon - this.formData.value.slConLai > 0) {
          this.formData.patchValue({
            slThua: Math.abs(this.formData.value.slThucTeCon - this.formData.value.slConLai),
            slThieu: null
          })
        } else {
          this.formData.patchValue({
            slThieu: Math.abs(this.formData.value.slThucTeCon - this.formData.value.slConLai),
            slThua: null
          })
        }
      }
    }
  }

  async preview(id) {
    await this.bienBanTinhKhoService.preview({
      tenBaoCao: 'Biên bản tịnh kho ba đấu giá',
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

  // downloadPdf() {
  //   saveAs(this.pdfSrc, "phieu-xuat-kho-ke-hoach-ban-dau-gia.pdf");
  // }
  //
  // downloadWord() {
  //   saveAs(this.wordSrc, "phieu-xuat-kho-ke-hoach-ban-dau-gia.docx");
  // }

  closeDlg() {
    this.showDlgPreview = false;
  }

  setValidator(isGuiDuyet) {
    if(isGuiDuyet){
      this.formData.controls["nam"].setValidators([Validators.required]);
      this.formData.controls["maDvi"].setValidators([Validators.required]);
      this.formData.controls["tenDvi"].setValidators([Validators.required]);
      this.formData.controls["maQhns"].setValidators([Validators.required]);
      this.formData.controls["soBbTinhKho"].setValidators([Validators.required]);
      this.formData.controls["ngayTaoBb"].setValidators([Validators.required]);
      this.formData.controls["soHdong"].setValidators([Validators.required]);
      this.formData.controls["ngayKyHd"].setValidators([Validators.required]);
      this.formData.controls["maDiemKho"].setValidators([Validators.required]);
      this.formData.controls["tenDiemKho"].setValidators([Validators.required]);
      this.formData.controls["maNhaKho"].setValidators([Validators.required]);
      this.formData.controls["tenNhaKho"].setValidators([Validators.required]);
      this.formData.controls["maNganKho"].setValidators([Validators.required]);
      this.formData.controls["tenNganKho"].setValidators([Validators.required]);
      this.formData.controls["ngayBatDauXuat"].setValidators([Validators.required]);
      this.formData.controls["ngayKetThucXuat"].setValidators([Validators.required]);
      this.formData.controls["tongSlNhap"].setValidators([Validators.required]);
      this.formData.controls["tongSlXuat"].setValidators([Validators.required]);
      this.formData.controls["slConLai"].setValidators([Validators.required]);
      this.formData.controls["slThucTeCon"].setValidators([Validators.required]);
      this.formData.controls["nguyenNhan"].setValidators([Validators.required]);
      this.formData.controls["kienNghi"].setValidators([Validators.required]);
      this.formData.controls["ghiChu"].setValidators([Validators.required]);
      this.formData.controls["tenThuKho"].setValidators([Validators.required]);
    }else {
      this.formData.controls["nam"].clearValidators();
      this.formData.controls["maDvi"].clearValidators();
      this.formData.controls["tenDvi"].clearValidators();
      this.formData.controls["maQhns"].clearValidators();
      this.formData.controls["soBbTinhKho"].clearValidators();
      this.formData.controls["ngayTaoBb"].clearValidators();
      this.formData.controls["soHdong"].clearValidators();
      this.formData.controls["ngayKyHd"].clearValidators();
      this.formData.controls["maDiemKho"].clearValidators();
      this.formData.controls["tenDiemKho"].clearValidators();
      this.formData.controls["maNhaKho"].clearValidators();
      this.formData.controls["tenNhaKho"].clearValidators();
      this.formData.controls["maNganKho"].clearValidators();
      this.formData.controls["tenNganKho"].clearValidators();
      this.formData.controls["ngayBatDauXuat"].clearValidators();
      this.formData.controls["ngayKetThucXuat"].clearValidators();
      this.formData.controls["tongSlNhap"].clearValidators();
      this.formData.controls["tongSlXuat"].clearValidators();
      this.formData.controls["slConLai"].clearValidators();
      this.formData.controls["slThucTeCon"].clearValidators();
      this.formData.controls["nguyenNhan"].clearValidators();
      this.formData.controls["kienNghi"].clearValidators();
      this.formData.controls["ghiChu"].clearValidators();
      this.formData.controls["tenThuKho"].clearValidators();
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  openPhieuKnClModal(id: number) {
    this.idPhieuKnCl = id;
    this.openPhieuKnCl = true;
  }

  closePhieuKnClModal() {
    this.idPhieuKnCl = null;
    this.openPhieuKnCl = false;
  }

  openPhieuXkModal(id: number) {
    this.idPhieuXk = id;
    this.openPhieuXk = true;
  }

  closePhieuXkModal() {
    this.idPhieuXk = null;
    this.openPhieuXk = false;
  }

  openBangKeModal(id: number) {
    this.idBangKe = id;
    this.openBangKe = true;
  }

  closeBangKeModal() {
    this.idBangKe = null;
    this.openBangKe = false;
  }
}
