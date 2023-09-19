import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {
  QuyetDinhGiaoNhiemVuThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";
import {
  PhieuXuatKhoThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/PhieuXuatKhoThanhLy.service";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {FileDinhKem} from "../../../../../../../models/FileDinhKem";
import {MESSAGE} from "../../../../../../../constants/message";
import {STATUS} from "../../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {convertTienTobangChu} from "../../../../../../../shared/commonFunction";
import {
  BienBanTinhKhoThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/BienBanTinhKhoThanhLy.service";

@Component({
  selector: 'app-chi-tiet-bb-tinh-kho-thanh-ly',
  templateUrl: './chi-tiet-bb-tinh-kho-thanh-ly.component.html',
  styleUrls: ['./chi-tiet-bb-tinh-kho-thanh-ly.component.scss']
})
export class ChiTietBbTinhKhoThanhLyComponent extends Base2Component implements OnInit {
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
  templateName = "Biên bản tịnh kho";

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNhiemVuThanhLyService: QuyetDinhGiaoNhiemVuThanhLyService,
    private phieuXuatKhoThanhLyService: PhieuXuatKhoThanhLyService,
    private bienBanTinhKhoThanhLyService: BienBanTinhKhoThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanTinhKhoThanhLyService);

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
        maDiemKho: [null, [Validators.required]],
        tenDiemKho: [null, [Validators.required]],
        maNhaKho: [null, [Validators.required]],
        tenNhaKho: [null, [Validators.required]],
        maNganKho: [null, [Validators.required]],
        tenNganKho: [null, [Validators.required]],
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
        slThucTeCon: [null, [Validators.required]],
        slThua: [],
        slThieu: [],
        nguyenNhan: [null, [Validators.required]],
        kienNghi: [null, [Validators.required]],
        ghiChu: [null, [Validators.required]],
        tenThuKho: [''],
        tenKtvBaoQuan: [''],
        tenKeToan: [''],
        tenLanhDaoChiCuc: [''],
        trangThai: [''],
        tenTrangThai: [''],
        lyDoTuChoi: [''],
        listPhieuXuatKho: [new Array()],
        fileDinhKems: [new Array<FileDinhKem>()],
        donViTinh: [''],
      }
    );
    this.maBb = '-BBTK';
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      if (this.idInput) {
        await this.loadDetail(this.idInput);
      } else {
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
    if (this.idQdNv) {
      this.bindingDataQd(this.idQdNv)
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
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
    let res = await this.quyetDinhGiaoNhiemVuThanhLyService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      if (data && data.length > 0) {
        this.listSoQuyetDinh = data;
        this.listSoQuyetDinh = this.listSoQuyetDinh.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
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
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayKy', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id,);
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
    if (id > 0) {
      await this.quyetDinhGiaoNhiemVuThanhLyService.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
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
              dataChiCuc.forEach(e => {
                this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
              });
              this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
              let set1 = new Set(this.listBienBanTinhKho.map(item => JSON.stringify({
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

  async loadBienBanTinhKho(event) {
    let body = {
      soQdGiaoNvXh: event,
    }
    let res = await this.bienBanTinhKhoThanhLyService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.content && data.content.length > 0) {
        this.listBienBanTinhKho = data.content;
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
          soPhieuKnCl: data.soPhieu,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          moTaHangHoa: data.moTaHangHoa,
        });
        await this.loadPhieuDtl(data);
      }
    });
  }

  async loadPhieuDtl(data) {
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      loaiVthh: this.loaiVthh,
      soQdGiaoNvXh: this.formData.value.soQdGiaoNvXh,
    }
    let res = await this.phieuXuatKhoThanhLyService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let danhSachPhieu = res.data.content
      if (danhSachPhieu && danhSachPhieu.length > 0) {
        this.listPhieuXuatKho = danhSachPhieu.filter(item =>
          item.maDiemKho == data.maDiemKho &&
          item.maNhaKho == data.maNhaKho &&
          item.maNganKho == data.maNganKho &&
          item.maLoKho == data.maLoKho
        );
        this.dataTable = this.listPhieuXuatKho;
        this.dataTable.forEach(s => {
          s.slXuat = s.thucXuat;
          s.idPhieuXuatKho = s.id;
          s.idBkCanHang = s.idBangKeCh;
          s.soBkCanHang = s.soBangKeCh;
        })
        this.formData.patchValue({
          ngayBatDauXuat: this.listPhieuXuatKho[0].ngayXuatKho,
          donViTinh: this.listPhieuXuatKho[0].donViTinh,
          tongSlXuat: this.dataTable.reduce((prev, cur) => prev + cur.slXuat, 0),
          slConLai: this.formData.value.tongSlNhap - this.dataTable.reduce((prev, cur) => prev + cur.slXuat, 0),
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

  async save() {
    if (this.dataTable.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Hiện chưa có thông tin bảng kê cân hàng và phiếu nhập kho',
      );
      return;
    }
    try {
      this.formData.disable()
      let body = this.formData.value;
      body.listPhieuXuatKho = this.dataTable;
      body.fileDinhKems = this.fileDinhKems;
      await this.createUpdate(body);
      this.formData.enable();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
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
