import { QuanLyNghiemThuKeLotService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyNghiemThuKeLot.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { DetailBienBanNhapDayKho } from 'src/app/models/BienBanNhapDayKho';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UserLogin } from 'src/app/models/userlogin';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapDayKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { BaseComponent } from "../../../../../../components/base/base.component";
import { FormBuilder, Validators } from "@angular/forms";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { STATUS } from "../../../../../../constants/status";
import { HelperService } from 'src/app/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-them-moi-bien-ban-nhap-day-kho',
  templateUrl: './them-moi-bien-ban-nhap-day-kho.component.html',
  styleUrls: ['./them-moi-bien-ban-nhap-day-kho.component.scss']
})
export class ThemMoiBienBanNhapDayKhoComponent extends BaseComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Input() isTatCa: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  userInfo: UserLogin;
  detail: any = {};

  maVthh: string;
  routerVthh: string;

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listPhieuKiemTraChatLuong: any[] = [];
  listSoQuyetDinh: any[] = [];
  listDiaDiemNhap: any[] = [];
  dataTable: any[] = [];
  listNghiemThuBaoQuan: any[] = [];

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  bienBanNhapDayKhoDetailCreate: DetailBienBanNhapDayKho = new DetailBienBanNhapDayKho();
  dsBienBanNhapDayKhoDetailClone: Array<DetailBienBanNhapDayKho> = [];
  isChiTiet: boolean = false;
  listHopDong: any[] = [];
  taiLieuDinhKemList: any[] = [];
  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  bbNghiemThuBaoQuans: any[] = [];
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    public userService: UserService,
    private quanLyPhieuNhapDayKhoService: QuanLyPhieuNhapDayKhoService,
    private uploadFileService: UploadFileService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
  ) {
    super(httpClient, storageService, quanLyPhieuNhapDayKhoService);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      maDvi: ['', [Validators.required]],
      maQhns: ['',],
      tenDvi: ['', [Validators.required]],

      soBienBanNhapDayKho: [],
      ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      ngayBatDauNhap: [],
      ngayKetThucNhap: [dayjs().format('YYYY-MM-DD')],

      soQdGiaoNvNh: [],
      idQdGiaoNvNh: [],

      soHd: [''],
      ngayHd: [null,],

      idDdiemGiaoNvNh: [, [Validators.required]],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],
      soLuongNhapKho: [],
      soLuong: [],

      loaiVthh: ['',],
      tenLoaiVthh: ['',],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      bienBanChuanBiKho: [''],
      bienBanLayMau: [''],
      tenNguoiTao: [''],
      tenNguoiPduyet: [''],
      tenKeToan: [],
      tenKyThuatVien: [],
      ghiChu: [''],
      trangThai: [],
      tenTrangThai: [],
      lyDoTuChoi: [],
      donGiaHd: [],
    })

  }

  async ngOnInit() {
    this.spinner.show();
    try {
      super.ngOnInit();
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
      ]);
      if (this.id > 0) {
        this.loadPhieuNhapDayKho();
      } else {
        this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let res = await this.userService.getId("BB_NHAP_DAY_KHO_LT_SEQ");
    this.formData.patchValue({
      soBienBanNhapDayKho: `${res}/${this.formData.get('nam').value}/BBNĐK`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      tenNguoiTao: this.userInfo.TEN_DAY_DU
    });
  }

  async loadSoQuyetDinh() {
    this.spinner.show();
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.loaiVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  async openDialogSoQd() {
    await this.loadSoQuyetDinh();
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
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      ngayQdGiaoNvNh: data.ngayQdinh,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
      soHd: data.soHd,
      ngayHd: data.hopDong.ngayKy,
      donGiaHd: data.hopDong.donGia
    });
    let dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
    if (dataChiCuc.length > 0) {
      this.listDiaDiemNhap = dataChiCuc[0].children;
    }
    await this.spinner.hide();
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
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataDdNhap(data);
      }
    });
  }

  bindingDataDdNhap(data, isDetail?: boolean) {
    if (!isDetail) {
      if (this.loaiVthh.startsWith('02')) {
        this.dataTable = data.listBangKeVt;
        this.dataTable.forEach(item => {
          let itemPnk = data.listPhieuNhapKho.filter(x => x.soPhieuNhapKho == item.soPhieuNhapKho)[0];
          item.soPhieuNhapKho = item.soPhieuNhapKho;
          item.soBangKe = item.soBangKe;
          item.ngayNhap = itemPnk.ngayTao;
          item.soLuong = itemPnk.soLuongNhapKho;
        })
      } else {
        this.dataTable = data.listPhieuKtraCl;
        this.dataTable.forEach(item => {
          item.soPhieuNhapKho = item.phieuNhapKho?.soPhieuNhapKho;
          item.soPhieuKtraCl = item.soPhieu;
          item.soBangKe = item.phieuNhapKho?.bangKeCanHang?.soBangKe;
          item.ngayNhap = item.phieuNhapKho?.ngayTao;
          item.soLuong = item.soLuongNhapKho;
        })
      }
      let dataFirst = new Date();
      this.dataTable.forEach(item => {
        let dataCompare = new Date(item.ngayNhap);
        if (dataFirst > dataCompare) {
          dataFirst = dataCompare;
        }
      });
      this.formData.patchValue({
        ngayBatDauNhap: dataFirst,
      })
    }

    this.formData.patchValue({
      idDdiemGiaoNvNh: data.id,
      maDiemKho: data.maDiemKho,
      tenDiemKho: data.tenDiemKho,
      maNhaKho: data.maNhaKho,
      tenNhaKho: data.tenNhaKho,
      maNganKho: data.maNganKho,
      tenNganKho: data.tenNganKho,
      maLoKho: data.maLoKho,
      tenLoKho: data.tenLoKho,
      soLuongNhapKho: this.loaiVthh == '02' ? data.soLuong : data.soLuong * 1000,
      soLuong: data.soLuong,
      bienBanChuanBiKho: data.bienBanChuanBiKho?.soBienBan,
      bienBanLayMau: data.bienBanLayMau?.soBienBan
    });
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_KTV_BAO_QUAN || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_KE_TOAN || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  redirectbienBanNhapDayKho() {
    this.showListEvent.emit();
  }

  async save(isGuiDuyet?: boolean) {
    if (this.validateSave()) {
      this.spinner.show();
      try {
        this.helperService.markFormGroupTouched(this.formData);
        if (this.formData.invalid) {
          await this.spinner.hide();
          return;
        }
        let body = this.formData.value;
        body.chiTiets = this.dataTable;
        let res;
        if (this.formData.get('id').value > 0) {
          res = await this.quanLyPhieuNhapDayKhoService.update(body);
        } else {
          res = await this.quanLyPhieuNhapDayKhoService.create(body);
        }
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            await this.spinner.hide();
            this.id = res.data.id;
            this.pheDuyet();
          } else {
            if (this.formData.get('id').value) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
              this.back();
            } else {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.back();
            }
            await this.spinner.hide();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
          await this.spinner.hide();
        }
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        this.spinner.hide();
      };
    }

  }

  validateSave(): boolean {
    if (this.calcTong() != this.formData.value.soLuongNhapKho) {
      this.notification.error(MESSAGE.ERROR, "Số lượng bảng kê cân hàng và phiếu nhập kho không đủ số lượng đầy kho")
      return false
    }

    return true;
  }

  pheDuyet() {
    let trangThai = ''
    let mess = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_KTVBQ:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_KTVBQ;
        mess = 'Bạn có muối gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.CHO_DUYET_KT;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mess,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 500,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: trangThai,
          };
          let res =
            await this.quanLyPhieuNhapDayKhoService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  tuChoi() {
    let trangThai = this.globals.prop.NHAP_TU_CHOI_KTV_BAO_QUAN;
    switch (this.formData.get('trangThai').value) {
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.TU_CHOI_KTVBQ;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.CHO_DUYET_KT;
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
      }
    }
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: text,
            trangThai: trangThai,
          };
          const res = await this.quanLyPhieuNhapDayKhoService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.redirectbienBanNhapDayKho();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  back() {
    this.showListEvent.emit();
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.detail.ngayKetThucNhap) {
      return false;
    }
    return startValue.getTime() > new Date(this.detail.ngayKetThucNhap).getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.detail.ngayBatDauNhap) {
      return false;
    }
    return endValue.getTime() <= new Date(this.detail.ngayBatDauNhap).getTime();
  };



  loadPhieuNhapDayKho() {
    this.quanLyPhieuNhapDayKhoService
      .getDetail(this.id)
      .then(async (res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.dataTable = data.chiTiets;
          await this.bindingDataQd(data.idQdGiaoNvNh);
          let dataDdnhap = this.listDiaDiemNhap.filter(item => item.id == data.idDdiemGiaoNvNh)[0];
          await this.bindingDataDdNhap(dataDdnhap, true);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }).catch(err => {
        this.notification.error(MESSAGE.ERROR, err.msg);
      })
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
      this.detail.fileDinhKems = this.detail.fileDinhKems.filter((x) => x.idVirtual !== data.id);
    }
  }

  openFile(event) {
    if (!this.isView) {
      let item = {
        id: new Date().getTime(),
        text: event.name,
      };
      if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
        this.uploadFileService
          .uploadFile(event.file, event.name)
          .then((resUpload) => {
            if (!this.detail.fileDinhKems) {
              this.detail.fileDinhKems = [];
            }
            const fileDinhKem = new FileDinhKem();
            fileDinhKem.fileName = resUpload.filename;
            fileDinhKem.fileSize = resUpload.size;
            fileDinhKem.fileUrl = resUpload.url;
            fileDinhKem.idVirtual = item.id;
            this.detail.fileDinhKems.push(fileDinhKem);
            this.taiLieuDinhKemList.push(item);
          });
      }
    }
  }

  downloadFileKeHoach(event) {
    let body = {
      "dataType": "",
      "dataId": 0
    }
    switch (event) {
      case 'tai-lieu-dinh-kem':
        body.dataType = this.detail.fileDinhKems[0].dataType;
        body.dataId = this.detail.fileDinhKems[0].dataId;
        if (this.taiLieuDinhKemList.length > 0) {
          this.chiTieuKeHoachNamService.downloadFileKeHoach(body).subscribe((blob) => {
            saveAs(blob, this.detail.fileDinhKems.length > 1 ? 'Tai-lieu-dinh-kem.zip' : this.detail.fileDinhKems[0].fileName);
          });
        }
        break;
      default:
        break;
    }
  }

  print() {

  }

  calcTong() {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
      return sum;
    }
  }
}
