import { saveAs } from 'file-saver';
import { BienBanLayMauDieuChuyenService } from './../../services/dcnb-bien-ban-lay-mau.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BienBanLayMauBanGiaoMauService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BienBanLayMauBanGiaoMau.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { QuyetDinhGiaoNvCuuTroService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { isEmpty } from 'lodash';
import { PhuongPhapLayMau } from 'src/app/models/PhuongPhapLayMau';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { ItemDaiDien } from 'src/app/pages/nhap/dau-thau/kiem-tra-chat-luong/quan-ly-bien-ban-lay-mau/them-moi-bien-ban-lay-mau/thanhphan-laymau/thanhphan-laymau.component';
import { Validators } from '@angular/forms';
import { ChiTietList } from 'src/app/models/QdPheDuyetKHBanDauGia';
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { cloneDeep } from 'lodash';
import { PassData } from '../danh-sach-bien-ban-lay-mau.component';
import { formatNumber } from '@angular/common';
import { KhCnQuyChuanKyThuat } from 'src/app/services/kh-cn-bao-quan/KhCnQuyChuanKyThuat';
import { PREVIEW } from 'src/app/constants/fileType';
interface PhuongPhapLayMauDC extends PhuongPhapLayMau {
  checked: true
}
@Component({
  selector: 'app-chi-tiet-danh-sach-bien-ban-lay-mau',
  templateUrl: './chi-tiet-danh-sach-bien-ban-lay-mau.component.html',
  styleUrls: ['./chi-tiet-danh-sach-bien-ban-lay-mau.component.scss']
})
export class ChiTietDanhSachBienBanLayMau extends Base2Component implements OnInit {
  @Input() isVatTu: boolean;
  @Input() loaiDc: string;
  @Input() thayDoiThuKho: boolean;
  @Input() type: string;
  @Input() idInput: number;
  @Input() isView: boolean;

  @Input() isEdit: boolean;
  // @Input() isViewDetail: boolean;
  @Input() isAddNew: boolean;
  @Input() isViewOnModal: boolean;
  @Input() passData: PassData
  @Output()
  showListEvent = new EventEmitter<any>();

  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listSoQuyetDinh: any[] = [];
  listDiaDiemNhap: any[] = [];
  phuongPhapLayMaus: Array<PhuongPhapLayMauDC>;
  daiDienCuc: string;
  listDaiDienChiCuc: any[] = [];
  daiDienChiCuc: string;
  listDaiDienCuc: any[] = [];
  maBb: string;
  radioValue: any;
  checked: boolean = false;
  canCu: any = [];
  dinhKems: any = [];
  fileDinhKemChupMauNiemPhong: any = [];
  bienBan: any[] = [];
  dcnbBienBanLayMauDtl: any[] = [];
  LIST_TRANG_THAI: { [key: string]: string } = {
    [STATUS.DU_THAO]: "Dự thảo",
    [STATUS.CHO_DUYET_LDCC]: "Chờ duyệt LĐ Chi Cục",
    [STATUS.TU_CHOI_LDCC]: "Từ chối LĐ Chi Cục",
    [STATUS.DA_DUYET_LDCC]: "Đã duyệt LĐ Chi Cục"
  }
  chiTieuKiemTra: any[];
  tabSelected: number = 0;
  previewName: string = "bien_ban_lay_mau_ban_giao_mau_lt_dieu_chuyen";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bienBanLayMauBanGiaoMauService: BienBanLayMauBanGiaoMauService,
    private bienBanLayMauDieuChuyenService: BienBanLayMauDieuChuyenService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauDieuChuyenService);

    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year")],
        maDvi: [],
        loaiBienBan: ['ALL'],
        maQhns: [],
        qdccId: [, [Validators.required]],
        soQdinhDcc: [, [Validators.required]],
        // ngayQdDc: [],
        ktvBaoQuan: [, [Validators.required]],
        soBbLayMau: [],
        ngayLayMau: [dayjs().format('YYYY-MM-DD')],
        dviKiemNghiem: [, [Validators.required]],
        diaDiemLayMau: [, [Validators.required]],
        loaiVthh: [, [Validators.required]],
        cloaiVthh: [, [Validators.required]],
        moTaHangHoa: [],
        maDiemKho: [, [Validators.required]],
        maNhaKho: [, [Validators.required]],
        maNganKho: [, [Validators.required]],
        maLoKho: [],
        soLuongMau: [, [Validators.required, Validators.min(1)]],
        ketQuaNiemPhong: [],
        trangThai: [STATUS.DU_THAO, [Validators.required]],
        lyDoTuChoi: [],
        soBbHaoDoi: [],
        soBbTinhKho: [],
        ngayXuatDocKho: [],
        tenDvi: ['', [Validators.required]],
        tenLoaiVthh: ['', [Validators.required]],
        tenCloaiVthh: ['', [Validators.required]],
        tenTrangThai: ['Dự Thảo'],
        diaChiDvi: [],
        tenDiemKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        tenNganKho: [],
        tenLoKho: [],
        tenNganLoKho: ['', [Validators.required]],
        nguoiLienQuan: [new Array()],
        dinhKems: [new Array<FileDinhKem>()],
        canCu: [new Array<FileDinhKem>()],
        fileDinhKemChupMauNiemPhong: [new Array<FileDinhKem>()],

        doiThuKho: [true],
        checked: [true],
        soBienBanBaoQuanLanDau: [''],
        thuKho: [null],
        tenThuKho: [''],
        donViTinh: '',
        ghiChu: [''],
        keHoachDcDtlId: [, [Validators.required]]
      }
    );
    this.maBb = 'BBLM-' + this.userInfo.DON_VI.tenVietTat;

    // this.setTitle();
  }
  numberFomater = (value) => (value || value == "0") ? formatNumber(value, 'vi_VN', '1.0-1') : '';
  booleanParse = (str: string): boolean => {
    if (str === "true") return true;
    return false;
  }
  async ngOnInit() {
    if (this.isViewOnModal) {
      this.isView = true
    }
    try {
      this.spinner.show();
      await this.loadDetail(this.idInput)
      // await Promise.all([
      //   this.loadDetail(this.idInput),
      //   this.loadPhuongPhapLayMau(),
      // ])
      // if (!this.idInput) {
      //   this.formData.patchValue({ ...this.passData });
      // }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      console.log("error", e)
    } finally {
      this.spinner.hide();
    }
  }
  async loadDetail(id: number) {
    if (id > 0) {
      await this.bienBanLayMauDieuChuyenService.getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue({ ...res.data, soBbLayMau: res.data.soBbLayMau ? res.data.soBbLayMau : res.data.id ? `${res.data.id}/${res.data.nam}/${this.maBb}` : '', tenNganLoKho: res.data.tenLoKho ? `${res.data.tenLoKho} - ${res.data.tenNganKho}` : res.data.tenNganKho });
            const data = res.data;
            this.dcnbBienBanLayMauDtl = cloneDeep(data.dcnbBienBanLayMauDtl),
              this.checked = data.ketQuaNiemPhong;
            // this.daiDienChiCuc = data.nguoiLienQuan;
            this.dinhKems = cloneDeep(data.dinhKems);
            this.canCu = data.canCu;
            this.fileDinhKemChupMauNiemPhong = cloneDeep(data.fileDinhKemChupMauNiemPhong);
            this.phuongPhapLayMaus = Array.isArray(data?.pplayMau?.split("-*")) ? data.pplayMau.split("-*").map(f => ({ id: f.split("+*")[0], giaTri: f.split("+*")[1], checked: this.booleanParse(f.split("+*")[2]) })) : [];
            this.chiTieuKiemTra = Array.isArray(data?.chiTieuKiemTra?.split("-*")) ? data.chiTieuKiemTra.split("-*").map(f => ({ id: f.split("+*")[0], giaTri: f.split("+*")[1], checked: true })) : [];
            const obj = Array.isArray(data.dcnbBienBanLayMauDtl) ? data.dcnbBienBanLayMauDtl.reduce((obj, cur) => {
              if (cur.loaiDaiDien == "00") {
                obj.listDaiDienCuc.push({ ...cur, daiDien: cur.tenDaiDien })
              } else if (cur.loaiDaiDien == "01") {
                obj.listDaiDienChiCuc.push({ ...cur, daiDien: cur.tenDaiDien })
              };
              return obj
            }, { listDaiDienCuc: [], listDaiDienChiCuc: [] }) : { listDaiDienCuc: [], listDaiDienChiCuc: [] };
            this.listDaiDienCuc = cloneDeep(obj.listDaiDienCuc);
            this.listDaiDienChiCuc = cloneDeep(obj.listDaiDienChiCuc);
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        ktvBaoQuan: this.userInfo.TEN_DAY_DU,
        ...this.passData,
        tenNganLoKho: this.passData.tenLoKho ? `${this.passData.tenLoKho} - ${this.passData.tenNganKho}` : this.passData.tenNganKho,
        qdccId: this.passData.qddccId
      });
      // if (this.passData.qddccId) {
      //   this.getChiTietQD(this.passData.qddccId)
      // }
      if (this.passData.cloaiVthh || this.passData.loaiVthh) {
        this.getPPLayMau(this.passData.cloaiVthh || this.passData.loaiVthh)
        this.getChiTietTieuChiCanKiemTra(this.passData.cloaiVthh || this.passData.loaiVthh)
      }
    }

  }

  quayLai() {
    this.showListEvent.emit();
  }
  async loadSoQuyetDinh() {
    let body = {
      trangThai: STATUS.BAN_HANH,
      isVatTu: this.isVatTu,
      loaiDc: this.loaiDc,
      thayDoiThuKho: this.thayDoiThuKho,
      maDvi: this.userInfo.MA_DVI,
      type: "00",
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    }
    try {
      let res = await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listSoQuyetDinh = Array.isArray(data) ? data.reduce((arr, cur) => {
          if (arr.findIndex(f => f.soQdinh == cur.soQdinh) < 0) {
            arr.push(cur)
          }
          return arr
        }, []) : [];
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  async openDialogSoQd(event: MouseEvent, disabled?: boolean) {
    const elm = event.target as HTMLInputElement;
    if (disabled || elm?.localName == "input") return;
    await this.loadSoQuyetDinh();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH QUYẾT ĐỊNH XUẤT ĐIỀU CHUYỂN HÀNG HÓA',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        // dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        // dataColumn: ['soQdinh', 'ngayKyQdinh', 'tenLoaiVthh'],
        dataHeader: ['Số quyết định', 'Ngày ký quyết định'],
        dataColumn: ['soQdinh', 'ngayKyQdinh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soQdinhDcc: '',
          qdccId: '',
          // ngayQdDc: '',
          tenNganLoKho: '',
          maLoKho: '',
          tenLoKho: '',
          maNganKho: '',
          tenNganKho: '',
          maNhaKho: '',
          tenNhaKho: '',
          maDiemKho: '',
          tenDiemKho: '',
          loaiVthh: '',
          tenLoaiVthh: '',
          cloaiVthh: '',
          tenCloaiVthh: '',
          thuKho: null,
          tenThuKho: '',
          donViTinh: '',
          soLuongMau: '',
          keHoachDcDtlId: null
        });
        this.chiTieuKiemTra = [],
          this.phuongPhapLayMaus = [];
        await this.bindingDataQd(data.id, true);
      }
    });
  };

  async bindingDataQd(id, isSetTc?) {
    try {
      await this.spinner.show();
      let dataRes = await this.quyetDinhDieuChuyenCucService.getDetail(id)
      const data = dataRes.data;
      this.formData.patchValue({
        soQdinhDcc: data.soQdinh,
        qdccId: data.id,
        // ngayQdDc: data.ngayKyQdinh,
        // loaiVthh: data.loaiVthh,
        // tenLoaiVthh: data.tenLoaiVthh,
      });
      // let dataChiCuc = data.arrDataQuyetDinh.find(item =>
      //     item.maDviChiCuc == this.userInfo.MA_DVI
      // );
      this.listDiaDiemNhap = [];
      let dataChiCuc = [];
      if (data.maDvi == this.userInfo.MA_DVI && Array.isArray(data?.danhSachQuyetDinh)) {
        data.danhSachQuyetDinh.forEach(element => {
          if (Array.isArray(element?.dcnbKeHoachDcHdr?.danhSachHangHoa)) {
            element.dcnbKeHoachDcHdr.danhSachHangHoa.forEach(item => {
              // if (dataChiCuc.findIndex(f => ((!f.maLoKho && !item.maLoKho && item.maNganKho && f.maNganKho == item.maNganKho) || (f.maLoKho && f.maLoKho == item.maLoKho))) < 0) {
              //   dataChiCuc.push(item)
              // }
              if (item.thayDoiThuKho === this.thayDoiThuKho) {
                dataChiCuc.push(item)
              }
            });
          }
        });
      }
      if (dataChiCuc) {
        // this.listDiaDiemNhap = cloneDeep(dataChiCuc);
        this.listDiaDiemNhap = dataChiCuc.map(f => ({ ...f, noiNhan: `${f.tenDiemKhoNhan || ""} - ${f.tenNhaKhoNhan || ""} - ${f.tenNganKhoNhan || ""} - ${f.tenLoKhoNhan || ""}` }));
      }
    } catch (error) {
      console.log("error", error);

    } finally {
      await this.spinner.hide();

    }
  }
  // async getChiTietQD(id: number) {
  //   const res = await this.quyetDinhDieuChuyenCucService.getDetail(id);
  //   if (res.msg === MESSAGE.SUCCESS) {
  //     this.formData.patchValue({ ngayQdDc: res.data.ngayKyQdinh })
  //   }
  // }
  async getPPLayMau(cloaiVthh) {
    const chiTietHangHoa = await this.danhMucService.loadDanhMucHangChiTiet(cloaiVthh);
    this.formData.patchValue({ donViTinh: chiTietHangHoa.data.maDviTinh });
    this.phuongPhapLayMaus = Array.isArray(chiTietHangHoa?.data?.ppLayMau) ? chiTietHangHoa?.data?.ppLayMau.map(f => ({ ...f, checked: false })) : [];
  }
  async getChiTietTieuChiCanKiemTra(cloaiVthh: string) {
    if (cloaiVthh) {
      const res = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(cloaiVthh);
      if (res?.msg === MESSAGE.SUCCESS) {
        this.chiTieuKiemTra = Array.isArray(res.data) ? res.data.map((f) => ({
          id: f.id, giaTri: (f.tenChiTieu || "") + " " + (f.mucYeuCauXuat || ""), checked: true
        })) : []
      }
    }
  }
  openDialogDdiemNhapHang(event: MouseEvent, disabled?: boolean) {
    const elm = event.target as HTMLInputElement;
    if (disabled || elm?.localName == "input") return;
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho xuất', 'Nhà kho xuất', 'Ngăn kho xuất', 'Lô kho xuất', 'Nơi nhận'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'noiNhan']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          tenNganLoKho: '',
          maLoKho: '',
          tenLoKho: '',
          maNganKho: '',
          tenNganKho: '',
          maNhaKho: '',
          tenNhaKho: '',
          maDiemKho: '',
          tenDiemKho: '',
          loaiVthh: '',
          tenLoaiVthh: '',
          cloaiVthh: '',
          tenCloaiVthh: '',
          thuKho: null,
          tenThuKho: '',
          donViTinh: '',
          soLuongMau: '',
          keHoachDcDtlId: null
        });
        this.chiTieuKiemTra = [],
          this.phuongPhapLayMaus = [];
        this.bindingDataDdNhap(data);
      }
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
        tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
        tenLoaiVthh: data.tenLoaiVthh,
        loaiVthh: data.loaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        cloaiVthh: data.cloaiVthh,
        thuKho: data.thuKhoId,
        tenThuKho: data.thuKho,
        donViTinh: data.donViTinh,
        keHoachDcDtlId: data.id
      })
    }
    if (data.cloaiVthh || data.loaiVthh) {
      this.getPPLayMau(data.cloaiVthh || data.loaiVthh)
      this.getChiTietTieuChiCanKiemTra(data.cloaiVthh || data.loaiVthh)
    }
  }

  async save(isGuiDuyet?) {
    // this.setValidator(isGuiDuyet)
    if (!Array.isArray(this.phuongPhapLayMaus) || this.phuongPhapLayMaus.length <= 0) {
      return this.notification.error(MESSAGE.ERROR, "Chưa có thông tin phương pháp lấy mẫu.")
    } else if (!this.phuongPhapLayMaus.find(f => f.checked)) {
      return this.notification.error(MESSAGE.ERROR, "Chưa có phương pháp lấy mẫu nào được chọn.")
    }
    if (!Array.isArray(this.chiTieuKiemTra) || this.chiTieuKiemTra.length <= 0) {
      return this.notification.error(MESSAGE.ERROR, "Chưa có thông tin chỉ tiêu kiểm tra.")
    }
    let body = this.formData.value;
    body.loaiDc = this.loaiDc;
    body.isVatTu = this.isVatTu;
    body.thayDoiThuKho = this.thayDoiThuKho;
    body.type = this.type;
    body.loaiQding = this.loaiDc === "CUC" ? "XUAT" : undefined;
    body.dinhKems = this.dinhKems;
    body.canCu = this.canCu;
    body.fileDinhKemChupMauNiemPhong = this.fileDinhKemChupMauNiemPhong;
    body.chiTieuKiemTra = this.chiTieuKiemTra.map(f => `${f.id}+*${f.giaTri}`)?.join("-*");
    body.pplayMau = this.phuongPhapLayMaus.map(f => `${f.id}+*${f.giaTri}+*${f.checked}`).join("-*");
    body.dcnbBienBanLayMauDtl = this.listDaiDienCuc.map(f => ({ ...f, loaiDaiDien: '00', tenDaiDien: f.daiDien })).concat(this.listDaiDienChiCuc.map(f => ({ ...f, loaiDaiDien: '01', tenDaiDien: f.daiDien })))
    let data = await this.createUpdate(body, null, isGuiDuyet);
    if (!data) return;
    this.formData.patchValue({ id: data.id, trangThai: data.trangThai, soBbLayMau: data.soBbLayMau ? data.soBbLayMau : data.id ? `${data.id}/${data.nam}/${this.maBb}` : '' })
    if (isGuiDuyet) {
      this.pheDuyet();
    }
  }
  pheDuyet() {
    let trangThai = '';
    let msg = '';
    let MSG = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        MSG = MESSAGE.GUI_DUYET_SUCCESS;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        MSG = MESSAGE.PHE_DUYET_SUCCESS;
        break;
      }
    };
    this.approve(this.formData.value.id, trangThai, msg, null, MSG);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
    }
    this.reject(this.formData.value.id, trangThai)
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
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }
  // async saveAndSend(): Promise<void> {
  //   this.setValidator(true);
  //   this.helperService.markFormGroupTouched(this.formData);
  //   if (this.formData.valid) {
  //     this.save(true)
  //   }
  // }

  selectTab(tab: number) {
    this.tabSelected = tab;
    this.previewName = tab === 0 ? "bien_ban_lay_mau" : "bien_ban_ban_giao_mau";
  }
  // setValidator(isGuiDuyet) {
  //   if (isGuiDuyet) {
  //     this.formData.controls['maDvi'].setValidators([Validators.required]);
  //     // this.formData.controls['soBbLayMau'].setValidators([Validators.required]);
  //     this.formData.controls['dviKiemNghiem'].setValidators([Validators.required]);
  //     this.formData.controls['diaDiemLayMau'].setValidators([Validators.required]);
  //     this.formData.controls['soLuongMau'].setValidators([Validators.required]);
  //     // this.formData.controls['pplayMau'].setValidators([Validators.required]);
  //     // this.formData.controls['chiTieuKiemTra'].setValidators([Validators.required]);
  //     this.formData.controls['ngayLayMau'].setValidators([Validators.required]);
  //   } else {
  //     this.formData.controls['maDvi'].clearValidators();
  //     // this.formData.controls['soBbLayMau'].clearValidators();
  //     this.formData.controls['dviKiemNghiem'].clearValidators();
  //     this.formData.controls['diaDiemLayMau'].clearValidators();
  //     this.formData.controls['soLuongMau'].clearValidators();
  //     // this.formData.controls['pplayMau'].clearValidators();
  //     // this.formData.controls['chiTieuKiemTra'].clearValidators();
  //     this.formData.controls['ngayLayMau'].clearValidators();
  //   }
  // }

}
;
