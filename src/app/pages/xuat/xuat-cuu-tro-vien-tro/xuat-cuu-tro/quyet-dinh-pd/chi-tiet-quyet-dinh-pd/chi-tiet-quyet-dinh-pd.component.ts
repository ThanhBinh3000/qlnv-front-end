import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import { DanhMucService } from "src/app/services/danhmuc.service";
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import {
  TongHopPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import * as dayjs from "dayjs";
import { FormGroup, Validators } from "@angular/forms";
import { STATUS } from "src/app/constants/status";
import { FileDinhKem } from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import { MESSAGE } from "src/app/constants/message";
import { v4 as uuidv4 } from "uuid";
import { chain, cloneDeep, groupBy, uniqBy } from 'lodash';
import { UserLogin } from "src/app/models/userlogin";
import { DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan } from "src/app/models/KeHoachBanDauGia";
import { DatePipe } from "@angular/common";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { PREVIEW } from "../../../../../../constants/fileType";
import { LOAI_HANG_DTQG, TEN_LOAI_VTHH } from 'src/app/constants/config';
import { AMOUNT_NO_DECIMAL, AMOUNT_ONE_DECIMAL, AMOUNT_TWO_DECIMAL } from 'src/app/Utility/utils';
import { MangLuoiKhoService } from 'src/app/services/qlnv-kho/mangLuoiKho.service';

@Component({
  selector: 'app-chi-tiet-quyet-dinh-pd',
  templateUrl: './chi-tiet-quyet-dinh-pd.component.html',
  styleUrls: ['./chi-tiet-quyet-dinh-pd.component.scss']
})
export class ChiTietQuyetDinhPdComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Input() loaiXuat: any;
  @Input() isViewOnModal: boolean;
  @Output() removeDataInit: EventEmitter<any> = new EventEmitter<any>();
  radioValue: any;
  cacheData: any[] = [];
  fileDinhKem: Array<FileDinhKem> = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  listLoaiHangHoa: any[] = [];
  userInfo: UserLogin;
  expandSetView = new Set<number>();
  expandSetEdit = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  listChungLoaiHangHoa: any[] = [];
  maKeHoach: string;
  listLoaiHopDong: any[] = [];
  listLoaiHinhNhapXuat: any[] = [];
  thongTinChiTiet: any[];
  thongTinChiTietTh: any[];
  tongSoLuongDxuat = 0;
  tongSoLuongTongHop = 0;
  tongThanhTienDxuat = 0;
  tongThanhTienTongHop = 0;
  tongHopEdit: any = [];
  datePipe = new DatePipe('en-US');
  isVisible = false;
  formDataDtl: FormGroup;

  isVisibleTuChoiDialog = false;
  isQuyetDinh: boolean = false;
  listThanhTien: number[];
  listSoLuong: number[];
  phuongAnView: any;
  phuongAnHdrView: any;
  phuongAnViewCache: any;
  phuongAnHdrViewCache: any;
  expandSetString = new Set<string>();
  expandSetStringCache = new Set<string>();
  listKieuNhapXuat: any;
  listHangHoaAll: any;
  dsDonVi: any;
  tongThanhTien: any;
  tongSoLuong: any;
  tongSoLuongDx: any;
  quyetDinhPdDtlCache: any[] = [];
  maHauTo: any;
  templateName = "Quyết định phê duyệt phương án";
  templateNameVt = "Quyết định phê duyệt phương án vật tư";
  tongSoLuongChuyenCapThoc: number = 0;
  tongSoLuongChuyenCapThocDx: number = 0;
  tongSlQd: number = 0;
  tongSoLuongQD: number = 0;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  amount = { ...AMOUNT_NO_DECIMAL };
  amount1 = { ...AMOUNT_TWO_DECIMAL };
  amount1Left = { ...AMOUNT_TWO_DECIMAL, align: "left" }
  dataPhanBoXuatCap: any[] = [];
  dataPhanBoXuatCapView: any[] = [];
  modalChiTiet: boolean = false;
  listDonVi: any[] = [];
  listNamNhap: Array<{ value: number, text: number, soLuong: number }> = [];
  ngayKetThucDx: string;
  ngayKetThuc: string;
  soDxTh: string;
  phuongAnViewVttb: any[] = [];
  openViewVttb: boolean = false;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private tongHopPhuongAnCuuTroService: TongHopPhuongAnCuuTroService,
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService,
    private mangLuoiKhoService: MangLuoiKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetPhuongAnCuuTroService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      nam: [dayjs().get("year"), [Validators.required]],
      soBbQd: [, [Validators.required]],
      ngayKy: [, [Validators.required]],
      ngayHluc: [, [Validators.required]],
      idTongHop: [],
      maTongHop: [],
      ngayThop: [],
      idDx: [],
      soDx: [],
      idXc: [],
      soXc: [],
      ngayDx: [],
      tongSoLuongDx: [],
      tongSoLuong: [],
      thanhTien: [],
      soLuongXuatCap: [],
      loaiVthh: [LOAI_HANG_DTQG.GAO],
      cloaiVthh: [],
      tenVthh: ["Gạo tẻ"],
      loaiNhapXuat: [],
      kieuNhapXuat: [],
      mucDichXuat: [],
      phanLoai: [],
      trichYeu: [],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      lyDoTuChoi: [],
      xuatCap: [false],
      type: [],
      ngayPduyet: [],
      nguoiPduyetId: [],
      donViTinh: ["kg"],
      idQdGiaoNv: [],
      soQdGiaoNv: [],
      tenDvi: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      tenTrangThai: ['Đang nhập dữ liệu'],
      quyetDinhPdDtl: [new Array()],
      fileDinhKem: [new Array<FileDinhKem>()],
      canCu: [new Array<FileDinhKem>()],
      ngayKetThuc: [],
      ngayTapKet: [],
      ngayGiaoHang: []
    }
    );
    this.formDataDtl = this.fb.group({
      id: [""],
      idDx: [""],
      soDx: [""],
      ngayKyDx: [""],
      trichYeuDx: [""],
      soLuongDx: [""],
      loaiHinhNhapXuat: [""],
      loaiNhapXuat: ["", [Validators.required]],
      kieuNhapXuat: ["", [Validators.required]],
      mucDichXuat: ["", [Validators.required]],
      phanLoai: [''],
      noiDungDx: ["", [Validators.required]],
      idDonViNhan: ["", [Validators.required]],
      loaiVthh: ["", [Validators.required]],
      cloaiVthh: [""],
      maDvi: ["", [Validators.required]],
      mId: [""],
      soLuong: ["", [Validators.required, Validators.min(1)]],
      soLuongXc: [""],
      soLuongNhuCauXuat: [""],
      tonKhoDvi: ["", [Validators.required]],
      tonKhoLoaiVthh: [""],
      tonKhoCloaiVthh: [""],
      donViTinh: [""],
      idQdGnv: [""],
      soQdGnv: [""],
      ngayKetThuc: [""],
      tenLoaiVthh: [""],
      tenCloaiVthh: [""],
      tenDvi: ["", [Validators.required]],
      type: [""],
      ghiChu: [""],
      edit: true,
      namNhap: [""],
      xuatCap: false
    })
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    };
    // this.formData.controls['ngayHluc'].valueChanges.subscribe((value) => {
    // })
    this.formData.controls['type'].valueChanges.pipe().subscribe((value) => {
      this.formData.patchValue({ quyetDinhPdDtl: [], loaiNhapXuat: '', ngayKetThuc: '', kieuNhapXuat: '', idTongHop: '', maTongHop: '', ngayThop: '', idDx: '', soDx: '', ngayDx: '', xuatCap: false, soLuongXuatCap: '' });
      this.quyetDinhPdDtlCache = [];
      this.tongSoLuongDx = 0;
      this.tongSoLuongChuyenCapThocDx = 0;
      this.ngayKetThuc = "";
      this.ngayKetThucDx = "";
      this.tongSoLuong = 0;
      this.tongSoLuongChuyenCapThoc = 0;
      this.phuongAnHdrView = [];
      this.phuongAnHdrViewCache = [];
      this.phuongAnView = [];
      this.phuongAnViewCache = [];
    });
    this.formData.get('tenVthh').valueChanges.pipe().subscribe((value) => {
      if (value == TEN_LOAI_VTHH.THOC) {
        this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.THOC, donViTinh: "kg" });
      } else if (value == TEN_LOAI_VTHH.GAO) {
        this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.GAO, donViTinh: "kg" });
      } else if (value == TEN_LOAI_VTHH.MUOI) {
        this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.MUOI, donViTinh: "kg" });
      } else {
        this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.VAT_TU, donViTinh: null });
      };
      this.formData.patchValue({ quyetDinhPdDtl: [], loaiNhapXuat: '', kieuNhapXuat: '', ngayNhapXuat: '', idTongHop: '', maTongHop: '', ngayThop: '', idDx: '', soDx: '', ngayDx: '', xuatCap: false, soLuongXuatCap: '' });
      this.quyetDinhPdDtlCache = [];
      this.tongSoLuongDx = 0;
      this.tongSoLuongChuyenCapThocDx = 0;
      this.ngayKetThuc = "";
      this.ngayKetThucDx = "";
      this.tongSoLuong = 0;
      this.tongSoLuongChuyenCapThoc = 0;
      this.phuongAnHdrView = [];
      this.phuongAnHdrViewCache = [];
      this.phuongAnView = [];
      this.phuongAnViewCache = [];
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      // this.formData.patchValue({ type: this.loaiXuat });
      this.maHauTo = '/QĐPDCTVT-' + this.userInfo.DON_VI.tenVietTat;
      await this.loadDetail();
      await this.loadDsDonVi();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }
  async loadDetail() {
    if (this.idSelected > 0) {
      await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDetail(this.idSelected)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data.soBbQd) {
              this.maHauTo = '/' + res.data.soBbQd?.split("/")[1];
              res.data.soBbQd = res.data.soBbQd?.split("/")[0];
            }
            const quyetDinhPdDtl = res.data.quyetDinhPdDtl.filter(f => !f.xuatCap).map(s => ({ ...s, idVirtual: uuidv4() }));
            this.helperService.bidingDataInFormGroupAndNotTrigger(this.formData, { ...res.data, quyetDinhPdDtl }, ['type', 'tenVthh']);
            //get cache
            this.ngayKetThuc = res.data.type === 'TTr' ? res.data.ngayKetThuc : '';
            if (this.formData.value.type == 'TTr') {
              let res = await this.deXuatPhuongAnCuuTroService.getDetail(this.formData.value.idDx);
              let detail = res.data;
              detail.deXuatPhuongAn.forEach(s => {
                s.noiDungDx = s.noiDung;
                s.soDx = detail.soDx;
                s.idDx = detail.idDx;
                s.ngayKyDx = detail.ngayDx;
                s.trichYeuDx = detail.trichYeu;
                // s.soLuongDx = s.soLuong;
                s.loaiNhapXuat = detail.loaiNhapXuat;
                s.kieuNhapXuat = detail.kieuNhapXuat;
                s.mucDichXuat = detail.mucDichXuat;
                s.phanLoai = detail.phanLoai;
                s.ngayKetThuc = detail.ngayKetThuc;
              });
              this.quyetDinhPdDtlCache = cloneDeep(detail.deXuatPhuongAn.map(element => ({
                ...element, soLuongXc: element.soLuongXc ? element.soLuongXc : element.soLuongChuyenCapThoc,
                soLuongDx: element.soLuongDx ? element.soLuongDx : element.soLuong
              })));
              this.ngayKetThucDx = detail.ngayKetThuc
            } else {
              let res = await this.tongHopPhuongAnCuuTroService.getDetail(this.formData.value.idTongHop);
              let detail = res.data;
              this.quyetDinhPdDtlCache = cloneDeep(detail.deXuatCuuTro.map(element => ({
                ...element,
                soLuongXc: element.soLuongXc ? element.soLuongXc : element.soLuongChuyenCapThoc, soLuongDx: element.soLuongDx ? element.soLuongDx : element.soLuong
              }))).sort((a, b) => b.id - a.id);

            }
            if (res.data.xuatCap) {
              const dataGocKhongXoa = uniqBy(res.data.quyetDinhPdDtl.filter(f => f.soLuongXc > 0), 'noiDungDx')
                .map(f => ({ ...f, tenDvi: '', maDvi: '', id: null, mId: uuidv4(), xuatCap: true, soLuong: "", tonKhoDvi: "", tonKhoLoaiVthh: "", tonKhoCloaiVthh: "" }));
              this.dataPhanBoXuatCap = cloneDeep(res.data.quyetDinhPdDtl).filter(f => !!f.xuatCap).map(f => ({ ...f, mId: uuidv4() })).concat(dataGocKhongXoa);
              this.buildTableViewXuatCap();
            }
            await this.buildTableView();
            if (this.phuongAnHdrView && this.formData.value.type === "TH" && this.phuongAnHdrView[0]) {
              await this.selectRow(this.phuongAnHdrView[0]);
              this.soDxTh = this.phuongAnHdrView[0].soDx;
            }
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      if (this.dataInit.isTaoQdPdPa) {
        this.formData.controls['tenVthh'].setValue(this.dataInit.tenVthh, { emitEvent: false });
        this.formData.controls['type'].setValue(this.dataInit.type, { emitEvent: false });
        this.formData.controls['tenDvi'].setValue(this.userInfo.TEN_DVI);
        this.formData.controls['donViTinh'].setValue([TEN_LOAI_VTHH.GAO, TEN_LOAI_VTHH.THOC, TEN_LOAI_VTHH.MUOI].includes(this.dataInit.tenVthh) ? 'kg' : '');
        if (this.dataInit.type === "TH") {
          this.bindingDataTh(this.dataInit)
        } else if (this.dataInit.type === "TTr") {
          this.bindingDataTTr(this.dataInit)
        }
      } else {
        this.formData.patchValue({ type: 'TH', tenDvi: this.userInfo.TEN_DVI });
      }

    }
  }

  quayLai() {
    this.showListEvent.emit();
    this.removeDataInit.emit();
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    this.formData.controls['soBbQd'].setValidators(Validators.required);

    if (!this.formData.value.quyetDinhPdDtl || this.formData.value.quyetDinhPdDtl.length <= 0) {
      return this.notification.error(MESSAGE.ERROR, "Thông tin chi tiết đề xuất cứu trợ, viện trợ của các đơn vị không tồn tại.")
    }
    if (this.formData.value.xuatCap) {
      const soLuongXuatCap = this.dataPhanBoXuatCap.filter(f => !f.maDvi).reduce((sum, cur) => sum += cur.soLuongXc, 0);
      this.formData.patchValue({ soLuongXuatCap })
    }
    let body = {
      ...this.formData.value,
      tongSoLuong: this.tongSoLuong,
      tongSoLuongDx: this.tongSoLuongDx,
      quyetDinhPdDtl: [...this.formData.value.quyetDinhPdDtl, ...this.dataPhanBoXuatCap.filter(f => !!f.maDvi)],
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null
    }
    await this.createUpdate(body, null, null, ['tenVthh', 'type']);
    this.helperService.restoreRequiredForm(this.formData)
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    if (!this.checkHoanThanhPhanBoXuatCap()) return;
    if (this.formData.value.xuatCap) {
      const soLuongXuatCap = this.dataPhanBoXuatCap.filter(f => !f.maDvi).reduce((sum, cur) => sum += cur.soLuongXc, 0);
      this.formData.patchValue({ soLuongXuatCap })
    }
    let body = {
      ...this.formData.value,
      tongSoLuong: this.tongSoLuong,
      tongSoLuongDx: this.tongSoLuongDx,
      soBbQd: this.formData.value.soBbQd + this.maHauTo,
      quyetDinhPdDtl: [...this.formData.value.quyetDinhPdDtl, ...this.dataPhanBoXuatCap.filter(f => !!f.maDvi)]
    }
    await super.saveAndSend(body, trangThai, msg, msgSuccess, ['tenVthh', 'type']);
  }

  async openDialogTh() {
    if (this.formData.get('type').value != 'TH' || this.isView) {
      return;
    }
    try {
      await this.spinner.show();
      let res = await this.tongHopPhuongAnCuuTroService.danhSach({
        trangThai: STATUS.DA_DUYET_LDV,
        // nam: this.formData.get('nam').value,
        // idQdPdNull: true,
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0
        },
      });
      if (res.msg == MESSAGE.SUCCESS) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách tổng hợp đề xuất phương án cứu trợ, viện trợ',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data.filter(f => f.tenVthh === this.formData.value.tenVthh),
            dataHeader: ['Số tổng hợp', 'Ngày tổng hợp', 'Nội dung tổng hợp'],
            dataColumn: ['id', 'ngayTao', 'noiDungThop']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.bindingDataTh(data)
          }

        });
      }
    } catch (e) {
      console.log(e)
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      await this.spinner.hide();
    }
  }
  async bindingDataTh(data: any) {
    this.formData.patchValue({
      idTongHop: data.id,
      maTongHop: data.maTongHop,
      ngayThop: data.ngayTao
    });
    let res = await this.tongHopPhuongAnCuuTroService.getDetail(data.id);
    let detail = res.data;
    this.quyetDinhPdDtlCache = cloneDeep(detail.deXuatCuuTro.map(f => ({ ...f, soLuongXc: f.soLuongChuyenCapThoc })));
    if (!this.formData.value.id) {
      // this.formData.patchValue({ quyetDinhPdDtl: detail.deXuatCuuTro.map(f => ({ ...f, mId: uuidv4() })) });
      this.formData.patchValue({ quyetDinhPdDtl: detail.deXuatCuuTro });
    }
    delete data.id;
    delete data.trangThai;
    delete data.tenTrangThai;
    delete data.type;
    delete data.canCu;
    delete data.fileDinhKem;
    delete data.trichYeu;
    data.ngayThop = data.ngayTao;
    this.formData.value.quyetDinhPdDtl.forEach(s => {
      s.soLuongXc = s.soLuongChuyenCapThoc
      delete s.id
    });
    // this.formData.patchValue(data);
    this.helperService.bidingDataInFormGroupAndIgnore(this.formData, data, ['tenVthh', 'quyetDinhPdDtl']);
    await this.buildTableView();
    if (this.phuongAnHdrView[0]) {
      await this.selectRow(this.phuongAnHdrView[0]);
      this.soDxTh = this.phuongAnHdrView[0].soDx;
    }
  }
  async openDialogTr() {
    if (this.formData.get('type').value != 'TTr' || this.isView) {
      return
    }
    // Get data tờ trình
    try {
      await this.spinner.show();
      let res = await this.deXuatPhuongAnCuuTroService.search({
        trangThaiList: [STATUS.DA_DUYET_LDV, STATUS.DA_DUYET_LDC, STATUS.DA_TAO_CBV],
        maTongHop: null,
        // nam: this.formData.get('2022').value,
        //loaiVthh: this.loaiVthh,
        idQdPdNull: true,
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0
        },
      });
      if (res.msg == MESSAGE.SUCCESS) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách đề xuất phương án cứu trợ, viện trợ',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data.content.filter(f => !f.soQdPd && f.tenVthh === this.formData.value.tenVthh),
            dataHeader: ['Số tờ trình đề xuất', 'Ngày đề xuất', 'Nội dung'],
            dataColumn: ['soDx', 'ngayDx', 'noiDung']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.bindingDataTTr(data)
          }
        });
      }
    } catch (e) {
      console.log(e)
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      await this.spinner.hide();
    }
  }
  async bindingDataTTr(data) {
    let res = await this.deXuatPhuongAnCuuTroService.getDetail(data.id);
    let detail = res.data;
    detail.deXuatPhuongAn.forEach(s => {
      s.noiDungDx = s.noiDung;
      s.soDx = detail.soDx;
      s.ngayKyDx = detail.ngayDx;
      s.trichYeuDx = detail.trichYeu;
      s.soLuongDx = s.soLuong;
      s.loaiNhapXuat = detail.loaiNhapXuat;
      s.kieuNhapXuat = detail.kieuNhapXuat;
      s.mucDichXuat = detail.mucDichXuat;
      s.phanLoai = detail.phanLoai;
      s.ngayKetThuc = detail.ngayKetThuc;
      s.tenVthh = detail.tenVthh;
      s.soLuongXc = s.soLuongChuyenCapThoc;
    });
    this.quyetDinhPdDtlCache = cloneDeep(detail.deXuatPhuongAn);
    if (!this.formData.value.id) {
      // this.formData.patchValue({ quyetDinhPdDtl: detail.deXuatPhuongAn.map(f => ({ ...f, mId: uuidv4() })) });
      this.formData.patchValue({ quyetDinhPdDtl: detail.deXuatPhuongAn });
    }

    data.idDx = data.id;
    delete data.id;
    delete data.trangThai;
    delete data.tenTrangThai;
    delete data.type;
    delete data.canCu;
    delete data.fileDinhKem;
    delete data.trichYeu;
    this.formData.value.quyetDinhPdDtl.forEach(s => {
      delete s.id;
      s.idDx = data.idDx
    });
    this.helperService.bidingDataInFormGroupAndIgnore(this.formData, data, ['tenVthh', 'quyetDinhPdDtl']);
    this.ngayKetThuc = detail.ngayKetThuc;
    this.ngayKetThucDx = detail.ngayKetThuc;
    await this.buildTableView();
    await this.expandAll();
  }
  async buildTableView() {
    if (this.formData.value.type === "TH") {

      if (this.isVthhVatuThietBi()) {
        this.phuongAnHdrView = chain(this.formData.value.quyetDinhPdDtl)
          .groupBy("soDx")
          .map((value, key) => {
            let row = value.find(s => s.soDx === key);
            if (!row) return;
            let rs = chain(value)
              .groupBy("noiDungDx")
              .map((v, k) => {
                let row1 = v.find(s => s.noiDungDx === k);
                if (!row1) return;
                let rs1 = chain(v)
                  .groupBy("loaiVthh")
                  .map((v1, k1) => {
                    let row2 = v1.find(s => s.loaiVthh === k1);
                    if (!row2) return;
                    const rs2 = chain(v1).groupBy("cloaiVthh").map((v2, k2) => {
                      const row3 = v2.find(f => f.cloaiVthh == k2);
                      if (!row3) return;
                      return {
                        ...row3,
                        idVirtual: uuidv4(),
                        childData: v2
                      }
                    }).value().filter(f => !!f)
                    let soLuongDx = rs2.reduce((prev, next) => prev += next.soLuongDx, 0);
                    let soLuong = rs2.reduce((prev, next) => prev += next.soLuong, 0);
                    return {
                      idVirtual: uuidv4(),
                      loaiVthh: k1,
                      tenLoaiVthh: row2.tenLoaiVthh,
                      donViTinh: row2.donViTinh,
                      // soLuong: row2.soLuong,
                      // soLuongDx: row2.soLuongDx,
                      soLuong,
                      soLuongDx,
                      tenCloaiVthh: row2.tenCloaiVthh,
                      childData: rs2,
                      loaiNhapXuat: row2.loaiNhapXuat,
                      kieuNhapXuat: row2.kieuNhapXuat,
                    }
                  }).value().filter(f => !!f);
                let soLuongDx = rs1.reduce((prev, next) => prev += next.soLuongDx, 0);
                let soLuong = rs1.reduce((prev, next) => prev += next.soLuong, 0);
                return {
                  idVirtual: uuidv4(),
                  noiDungDx: k,
                  soLuong,
                  soLuongDx,
                  childData: rs1,
                  loaiNhapXuat: rs1.loaiNhapXuat,
                  kieuNhapXuat: rs1.kieuNhapXuat,
                }
              }).value().filter(f => !!f);
            let soLuong = rs.reduce((prev, next) => prev += next.soLuong, 0);
            let soLuongDx = rs.reduce((prev, next) => prev += next.soLuongDx, 0);
            // let soLuongNhuCauXuat = rs.reduce((prev, next) => prev += next.soLuongNhuCauXuat ? next.soLuongNhuCauXuat : 0, 0);
            let soLuongNhuCauXuat = row.soLuongNhuCauXuat;
            return {
              idVirtual: uuidv4(),
              tenDvi: row.tenDvi,
              maDvi: row.maDvi,
              soDx: row.soDx,
              trichYeuDx: row.trichYeuDx,
              mucDichXuat: row.mucDichXuat,
              phanLoai: row.phanLoai,
              ngayKetThuc: row.ngayKetThuc,
              ngayKyDx: row.ngayKyDx,
              soLuong,
              soLuongDx,
              soLuongNhuCauXuat: soLuongNhuCauXuat,
              childData: rs,
              loaiNhapXuat: row.loaiNhapXuat,
              kieuNhapXuat: row.kieuNhapXuat,
            };
          }).value();
      } else {
        this.phuongAnHdrView = chain(this.formData.value.quyetDinhPdDtl)
          .groupBy("soDx")
          .map((value, key) => {
            const row = value.find(s => s.soDx === key);
            if (!row) return;
            const rs1 = chain(value).groupBy("noiDungDx").map((v, k) => {
              const row1 = v.find(f => f.noiDungDx === k);
              if (!row1) return;
              const soLuongDx = v.reduce((prev, next) => prev += next.soLuongDx, 0);
              const soLuong = v.reduce((prev, next) => prev += next.soLuong, 0);
              return {
                ...row1,
                idVirtual: uuidv4(),
                soLuong,
                soLuongDx,
                childData: v
              }
            }).value().filter(f => !!f);
            const soLuongDx = rs1.reduce((prev, next) => prev += next.soLuongDx, 0);
            const soLuong = rs1.reduce((prev, next) => prev += next.soLuong, 0);
            return {
              idVirtual: uuidv4(),
              tenDvi: row.tenDvi,
              maDvi: row.maDvi,
              soDx: row.soDx,
              trichYeuDx: row.trichYeuDx,
              mucDichXuat: row.mucDichXuat,
              phanLoai: row.phanLoai,
              ngayKetThuc: row.ngayKetThuc,
              ngayKyDx: row.ngayKyDx,
              thoiGian: row.ngayKyDx,
              soLuongDx: soLuongDx,
              soLuong: soLuong,
              soLuongNhuCauXuat: row.soLuongNhuCauXuat,
              soLuongXc: row.soLuongXc,
              loaiNhapXuat: row.loaiNhapXuat,
              kieuNhapXuat: row.kieuNhapXuat,
              childData: rs1,
            };
          }).value().filter(f => !!f);
      }

      //
      if (this.isVthhVatuThietBi()) {

        this.phuongAnHdrViewCache = chain(this.quyetDinhPdDtlCache)
          .groupBy("soDx")
          .map((value, key) => {
            let row = value.find(s => s.soDx === key);
            // let soLuongDx = value.reduce((prev, next) => prev += next.soLuongDx, 0);
            // let soLuongDx = value.reduce((prev, next) => prev += next.soLuongDx, 0);
            if (!row) return;
            let rs = chain(value)
              .groupBy("noiDungDx")
              .map((v, k) => {
                let row1 = v.find(s => s.noiDungDx === k);
                if (!row1) return;
                let rs1 = chain(v)
                  .groupBy("loaiVthh")
                  .map((v1, k1) => {
                    let row2 = v1.find(s => s.loaiVthh === k1);
                    if (!row2) return;
                    const rs2 = chain(v1).groupBy("cloaiVthh").map((v2, k2) => {
                      const row3 = v2.find(f => f.cloaiVthh == k2);
                      if (!row3) return;
                      let soLuongDx = v2.reduce((prev, next) => prev += next.soLuongDx, 0);
                      let soLuong = v2.reduce((prev, next) => prev += next.soLuong, 0);
                      return {
                        ...row3,
                        idVirtual: uuidv4(),
                        soLuong,
                        soLuongDx,
                        childData: v2
                      }
                    }).value().filter(f => !!f)
                    let soLuongDx = rs2.reduce((prev, next) => prev += next.soLuongDx, 0);
                    let soLuong = rs2.reduce((prev, next) => prev += next.soLuong, 0);
                    return {
                      idVirtual: uuidv4(),
                      loaiVthh: k1,
                      tenLoaiVthh: row2.tenLoaiVthh,
                      donViTinh: row2.donViTinh,
                      soLuongDx,
                      soLuong,
                      tenCloaiVthh: row2.tenCloaiVthh,
                      childData: rs2
                    }
                  }).value().filter(f => !!f);
                let soLuongDx = rs1.reduce((prev, next) => prev += next.soLuongDx, 0);
                let soLuong = rs1.reduce((prev, next) => prev += next.soLuong, 0);
                return {
                  idVirtual: uuidv4(),
                  noiDungDx: k,
                  soLuong,
                  soLuongDx,
                  childData: rs1
                }
              }).value().filter(f => !!f);
            let soLuongDx = rs.reduce((prev, next) => prev += next.soLuongDx, 0);
            let soLuong = rs.reduce((prev, next) => prev += next.soLuong, 0);
            return {
              idVirtual: uuidv4(),
              tenDvi: row.tenDvi,
              maDvi: row.maDvi,
              soDx: row.soDx,
              trichYeuDx: row.trichYeuDx,
              mucDichXuat: row.mucDichXuat,
              phanLoai: row.phanLoai,
              ngayKetThuc: row.ngayKetThuc,
              ngayKyDx: row.ngayKyDx,
              thoiGian: row.ngayKyDx,
              soLuongDx: soLuongDx,
              soLuong,
              childData: rs
            };
          }).value().filter(f => !!f);
      } else {
        this.phuongAnHdrViewCache = chain(this.quyetDinhPdDtlCache)
          .groupBy("soDx")
          .map((value, key) => {
            let row = value.find(s => s.soDx === key);
            if (!row) return;
            const rs1 = chain(value).groupBy("noiDungDx").map((v, k) => {
              const row1 = v.find(f => f.noiDungDx === k);
              if (!row1) return;
              const soLuongDx = v.reduce((prev, next) => prev += next.soLuongDx, 0);
              const soLuong = v.reduce((prev, next) => prev += next.soLuong, 0);
              return {
                ...row1,
                idVirtual: uuidv4(),
                soLuong,
                soLuongDx,
                childData: v
              }
            }).value().filter(f => !!f)
            const soLuongDx = rs1.reduce((prev, next) => prev += next.soLuongDx, 0);
            const soLuong = rs1.reduce((prev, next) => prev += next.soLuong, 0);
            // let soLuongNhuCauXuat = row.soLuongNhuCauXuat;
            return {
              idVirtual: uuidv4(),
              tenDvi: row.tenDvi,
              maDvi: row.maDvi,
              soDx: row.soDx,
              trichYeuDx: row.trichYeuDx,
              mucDichXuat: row.mucDichXuat,
              phanLoai: row.phanLoai,
              ngayKetThuc: row.ngayKetThuc,
              ngayKyDx: row.ngayKyDx,
              thoiGian: row.ngayKyDx,
              soLuongDx: soLuongDx,
              soLuong,
              // soLuongNhuCauXuat,
              childData: rs1,
            };
          }).value().filter(f => !!f);
      }
    } else {
      if (this.isVthhVatuThietBi()) {
        this.formData.value.quyetDinhPdDtl.forEach(element => {
          element.vthh = element.cloaiVthh ? `${element.loaiVthh}-${element.cloaiVthh}` : element.loaiVthh;
          element.tenVthh = element.tenCloaiVthh ? `${element.tenLoaiVthh}-${element.tenCloaiVthh}` : element.tenLoaiVthh;
        });
        this.phuongAnHdrView = chain(this.formData.value.quyetDinhPdDtl)
          .groupBy("noiDungDx")
          .map((value, key) => {
            const row = value.find(s => s.noiDungDx === key);
            if (!row) return;
            const rs = chain(value)
              .groupBy("vthh")
              .map((v, k) => {
                const row1 = v.find(s => s.vthh === k);
                if (!row1) return;
                const rs1 = chain(v).groupBy("maDvi").map((v1, k1) => {
                  const row2 = v1.find(f => f.maDvi === k1);
                  if (!row2) return;
                  const soLuongDx = v1.reduce((prev, next) => prev += next.soLuongDx, 0);
                  const soLuong = v1.reduce((prev, next) => prev += next.soLuong, 0);
                  return {
                    ...row2,
                    idVirtual: uuidv4(),
                    soLuongDx,
                    soLuong,
                    childData: v1
                  }

                }).value().filter(f => !!f)
                const soLuongDx = rs1.reduce((prev, next) => prev += next.soLuongDx, 0);
                const soLuong = rs1.reduce((prev, next) => prev += next.soLuong, 0);
                return {
                  idVirtual: uuidv4(),
                  noiDungDx: k,
                  tenLoaiVthh: row1.tenLoaiVthh,
                  tenVthh: row1.tenVthh,
                  donViTinh: row1.donViTinh,
                  soLuong,
                  soLuongDx,
                  tonKhoCloaiVthh: row1.tonKhoCloaiVthh,
                  childData: rs1,
                  loaiNhapXuat: row1.loaiNhapXuat,
                  kieuNhapXuat: row1.kieuNhapXuat,
                }
              }).value().filter(f => !!f);
            const soLuongDx = rs.reduce((prev, next) => prev += next.soLuongDx, 0);
            const soLuong = rs.reduce((prev, next) => prev += next.soLuong, 0);
            return {
              idVirtual: uuidv4(),
              noiDungDx: row.noiDungDx,
              tenDvi: row.tenDvi,
              maDvi: row.maDvi,
              soDx: row.soDx,
              trichYeuDx: row.trichYeuDx,
              mucDichXuat: row.mucDichXuat,
              phanLoai: row.phanLoai,
              ngayKetThuc: row.ngayKetThuc,
              ngayKyDx: row.ngayKyDx,
              thoiGian: row.ngayKyDx,
              soLuongDx: soLuongDx,
              soLuong,
              loaiNhapXuat: row.loaiNhapXuat,
              kieuNhapXuat: row.kieuNhapXuat,
              childData: rs
            };
          }).value().filter(f => !!f);
      } else {
        this.phuongAnHdrView = chain(this.formData.value.quyetDinhPdDtl)
          .groupBy("noiDungDx")
          .map((value, key) => {
            let row = value.find(s => s.noiDungDx === key);
            if (!row) return;
            const rs = chain(value).groupBy("maDvi").map((v1, k1) => {
              const row1 = v1.find(f => f.maDvi === k1);
              if (!row1) return;
              let soLuongDx = v1.reduce((prev, next) => prev += next.soLuongDx, 0);
              let soLuong = v1.reduce((prev, next) => prev += next.soLuong, 0);
              return {
                idVirtual: uuidv4(),
                ...row1,
                soLuong,
                soLuongDx,
                childData: v1,
              }
            }).value().filter(f => !!f)
            let soLuongDx = rs.reduce((prev, next) => prev += next.soLuongDx, 0);
            let soLuong = rs.reduce((prev, next) => prev += next.soLuong, 0);
            // let soLuongNhuCauXuat = value.reduce((prev, next) => prev += next.soLuongNhuCauXuat ? next.soLuongNhuCauXuat : 0, 0);
            // let soLuongXc = value.reduce((prev, next) => prev += next.soLuongXc ? next.soLuongXc : 0, 0);
            return {
              idVirtual: uuidv4(),
              ...row,
              soLuong,
              soLuongDx,
              childData: rs,
            };
          }).value().filter(f => !!f);
      }

      //
      if (this.isVthhVatuThietBi()) {
        this.quyetDinhPdDtlCache.forEach(element => {
          element.vthh = element.cloaiVthh ? `${element.loaiVthh}-${element.cloaiVthh}` : element.loaiVthh;
          element.tenVthh = element.tenCloaiVthh ? `${element.tenLoaiVthh}-${element.tenCloaiVthh}` : element.tenLoaiVthh;
        });
        this.phuongAnHdrViewCache = chain(this.quyetDinhPdDtlCache)
          .groupBy("noiDungDx")
          .map((value, key) => {
            let row = value.find(s => s.noiDungDx === key);
            if (!row) return;
            let rs = chain(value)
              .groupBy("vthh")
              .map((v, k) => {
                let row1 = v.find(s => s.vthh === k);
                if (!row1) return;
                const rs1 = chain(v).groupBy("maDvi").map((v1, k1) => {
                  const row2 = v1.find(f => f.maDvi === k1);
                  if (!row2) return;
                  let soLuongDx = v1.reduce((prev, next) => prev += next.soLuongDx, 0);
                  let soLuong = v1.reduce((prev, next) => prev += next.soLuong, 0);
                  return {
                    ...row2,
                    idVirtual: uuidv4(),
                    soLuong,
                    soLuongDx,
                    childData: v1
                  }
                }).value().filter(f => !!f)
                let soLuongDx = rs1.reduce((prev, next) => prev += next.soLuongDx, 0);
                let soLuong = rs1.reduce((prev, next) => prev += next.soLuong, 0);
                return {
                  idVirtual: uuidv4(),
                  noiDungDx: row1.noiDungDx,
                  tenLoaiVthh: row1.tenLoaiVthh,
                  tenVthh: row1.tenVthh,
                  donViTinh: row1.donViTinh,
                  soLuong,
                  soLuongDx,
                  childData: rs1,
                }
              }).value().filter(f => !!f);
            let soLuongDx = rs.reduce((prev, next) => prev += next.soLuongDx, 0);
            let soLuong = rs.reduce((prev, next) => prev += next.soLuong, 0);
            return {
              idVirtual: uuidv4(),
              noiDungDx: row.noiDungDx,
              noiDung: row.noiDung,
              tenDvi: row.tenDvi,
              maDvi: row.maDvi,
              soDx: row.soDx,
              trichYeuDx: row.trichYeuDx,
              mucDichXuat: row.mucDichXuat,
              phanLoai: row.phanLoai,
              ngayKetThuc: row.ngayKetThuc,
              ngayKyDx: row.ngayKyDx,
              thoiGian: row.ngayKyDx,
              soLuong,
              soLuongDx,
              childData: rs
            };
          }).value().filter(f => !!f);
      } else {
        this.phuongAnHdrViewCache = chain(this.quyetDinhPdDtlCache)
          .groupBy("noiDungDx")
          .map((value, key) => {
            let row = value.find(s => s.noiDungDx === key);
            if (!row) return;
            const rs = chain(value).groupBy("maDvi").map((v1, k1) => {
              const row1 = v1.find(f => f.maDvi === k1);
              if (!row1) return;
              let soLuongDx = v1.reduce((prev, next) => prev += next.soLuongDx, 0);
              let soLuong = v1.reduce((prev, next) => prev += next.soLuong, 0);
              return {
                idVirtual: uuidv4(),
                ...row1,
                soLuong,
                soLuongDx,
                childData: v1,
              }
            }).value().filter(f => !!f)
            const soLuongDx = rs.reduce((prev, next) => prev += next.soLuongDx, 0);
            const soLuong = rs.reduce((prev, next) => prev += next.soLuong, 0);
            return {
              ...row,
              idVirtual: uuidv4(),
              soLuongDx,
              soLuong,
              childData: rs,
            };
          }).value().filter(f => !!f);
      }
    };
    if (this.formData.value.type !== "TH") {
      this.phuongAnView = this.phuongAnHdrView;
      this.phuongAnViewCache = this.phuongAnHdrViewCache;
      await this.tinhTong();
    };
    // await this.tinhTong();
    this.expandAll();
  }
  buildTableViewXuatCap() {
    this.dataPhanBoXuatCapView = chain(this.dataPhanBoXuatCap).groupBy('noiDungDx').map((value, key) => {
      const row = value.find(s => s.noiDungDx === key);
      // let soLuongDx = value.reduce((prev, next) => prev += next.soLuongDx, 0);
      if (!row) return;
      const lv1 = chain(value).groupBy("maDvi").map((v1, k1) => {
        const row1 = v1.find(f => k1 && f.maDvi === k1);
        if (!row1) return;
        const soLuong = v1.reduce((prev, next) => prev += next.soLuong, 0);
        return {
          ...row1,
          idVirtual: uuidv4(),
          soLuong,
          namNhap: '',
          tonKhoDvi: '',
          ghiChu: '',
          childData: v1,
        }

      }).value().filter(f => !!f)
      const soLuong = lv1.reduce((prev, next) => prev += next.soLuong, 0);
      return {
        ...row,
        idVirtual: uuidv4(),
        soLuong,
        // soLuongDx,
        namNhap: '',
        tonKhoDvi: '',
        ghiChu: '',
        childData: lv1,
      }

    }).value().filter(f => !!f);
    this.expandAll('XC');
  }
  async selectRow(item: any) {
    if (!item.selected) {
      this.phuongAnHdrView.forEach(i => i.selected = false);
      item.selected = true;
      const findndex = this.phuongAnHdrView.findIndex(s => s.soDx == item.soDx);
      const findCacheIndex = this.phuongAnHdrViewCache.findIndex(s => s.soDx == item.soDx);
      this.phuongAnView = this.phuongAnHdrView[findndex]?.childData ? this.phuongAnHdrView[findndex].childData : [];
      this.phuongAnViewCache = this.phuongAnHdrViewCache[findCacheIndex]?.childData ? this.phuongAnHdrViewCache[findCacheIndex].childData : [];
      this.ngayKetThuc = this.phuongAnHdrView[findndex]?.ngayKetThuc;
      this.ngayKetThucDx = this.phuongAnHdrViewCache[findCacheIndex]?.ngayKetThuc;
      await this.tinhTong();
    }
  }
  buildTableViewVttb() {
    this.phuongAnViewVttb = chain(this.formData.value.quyetDinhPdDtl).groupBy("maDvi").map((value, k) => {
      const row = value.find(f => f.maDvi === k);
      if (!row) return;
      const rs = chain(value).groupBy("vthh").map((v1, k1) => {
        const row1 = v1.find(f => f.vthh === k1);
        if (!row1) return;
        return {
          ...row1,
          idVirtual: uuidv4(),
          childData: v1
        }
      }).value().filter(f => !!f)
      return {
        ...row,
        idVirtual: uuidv4(),
        childData: rs
      }
    }).value().filter(f => !!f);
    this.expandAllVttb();
  }
  expandAll(type?: string) {
    if (type === 'XC') {
      Array.isArray(this.dataPhanBoXuatCapView) && this.dataPhanBoXuatCapView.forEach(s => {
        this.expandSetString.add(s.idVirtual);
        Array.isArray(s.childData) && s.childData.forEach(s1 => {
          this.expandSetString.add(s1.idVirtual);
        })
      });
    }
    Array.isArray(this.phuongAnHdrView) && this.phuongAnHdrView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
      Array.isArray(s.childData) && s.childData.forEach(s1 => {
        this.expandSetString.add(s1.idVirtual);
      })
    });

    Array.isArray(this.phuongAnHdrViewCache) && this.phuongAnHdrViewCache.forEach(s => {
      this.expandSetStringCache.add(s.idVirtual);
      Array.isArray(s.childData) && s.childData.forEach(s1 => {
        this.expandSetStringCache.add(s1.idVirtual);
      })
    });
  }
  expandAllVttb() {
    Array.isArray(this.phuongAnViewVttb) && this.phuongAnViewVttb.forEach(s => {
      this.expandSetString.add(s.idVirtual);
      Array.isArray(s.childData) && s.childData.forEach(s1 => {
        this.expandSetString.add(s1.idVirtual);
      })
    });
  }

  onExpandStringChange(id: string, checked: boolean) {

    if (checked) {
      this.expandSetString.add(id);
      this.expandSetStringCache.add(id);
    } else {
      this.expandSetString.delete(id);
      this.expandSetStringCache.delete(id);
    }
  }

  async xemTruocPd(id, tenBaoCao, children) {
    await this.quyetDinhPheDuyetPhuongAnCuuTroService.preview({
      tenBaoCao: tenBaoCao + '.docx',
      id: id,
      children: children
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

  async tinhTong() {
    const { tongSoLuongDx, tongSoLuongChuyenCapThocDx } = this.phuongAnViewCache.reduce((obj, cur) => {
      obj.tongSoLuongDx += cur.soLuongDx;
      obj.tongSoLuongChuyenCapThocDx += cur.soLuongXc ? cur.soLuongXc : 0;
      return obj
    }, { tongSoLuongDx: 0, tongSoLuongChuyenCapThocDx: 0 });
    const { tongSoLuong, tongSoLuongChuyenCapThoc } = this.phuongAnView.reduce((obj, cur) => {
      obj.tongSoLuong += cur.soLuong;
      obj.tongSoLuongChuyenCapThoc += cur.soLuongXc ? cur.soLuongXc : 0;
      return obj
    }, { tongSoLuong: 0, tongSoLuongChuyenCapThoc: 0 });
    this.tongSoLuong = tongSoLuong;
    this.tongSoLuongDx = tongSoLuongDx;
    this.tongSoLuongChuyenCapThocDx = tongSoLuongChuyenCapThocDx;
    this.tongSoLuongChuyenCapThoc = tongSoLuongChuyenCapThoc;
    this.phuongAnHdrView.forEach(element => {
      element.soLuong = element.childData.reduce((sum, cur) => sum += cur.soLuong, 0)
    });
  }
  tinhTongVthh(currentRow: any, $event: any, parentRow?: any, ppRow?: any, item?: any) {
    currentRow.soLuong = $event;
    if (parentRow) {
      const soLuong = Array.isArray(parentRow.childData) ? parentRow.childData.reduce((sum, cur) => sum += cur.soLuong, 0) : 0;
      parentRow.soLuong = soLuong;
      if (ppRow) {
        const soLuong = Array.isArray(ppRow.childData) ? ppRow.childData.reduce((sum, cur) => sum += cur.soLuong, 0) : 0;
        ppRow.soLuong = soLuong;
        if (item) {
          const soLuong = Array.isArray(item.childData) ? item.childData.reduce((sum, cur) => sum += cur.soLuong, 0) : 0;
          item.soLuong = soLuong;
        }
      }
    }
    this.tinhTong();
    // const quyetDinhPdDtl = this.formData.value.quyetDinhPdDtl.map(f => {
    //   if (f.mId === currentRow.mId) {
    //     return { ...f, soLuong: currentRow.soLuong, soLuongXc: currentRow.soLuongXc }
    //   }
    //   return f
    // });
    // this.formData.patchValue({ quyetDinhPdDtl });
  }
  tinhXuatCap(currentRow: any, $event: any, isVatTu?: boolean, parentRow?: any, ppRow?: any) {
    if (parentRow) {
      if (ppRow) {
        const soLuongNhuCauXuat = parentRow.soLuongNhuCauXuat
        currentRow.soLuong = $event;
        const tongSoLuongP = Array.isArray(parentRow.childData) ? parentRow.childData.reduce((sum, cur) => sum += cur.soLuong ? cur.soLuong : 0, 0) : 0;
        parentRow.soLuong = tongSoLuongP;
        const tongSoLuongPP = Array.isArray(ppRow.childData) ? ppRow.childData.reduce((sum, cur) => sum += cur.soLuong ? cur.soLuong : 0, 0) : 0;
        const soLuongXc = soLuongNhuCauXuat > tongSoLuongPP ? soLuongNhuCauXuat - tongSoLuongPP : 0;
        // currentRow.soLuongXc = soLuongXc;
        // parentRow.soLuongXc = soLuongXc;
        ppRow.soLuongXc = soLuongXc;
        ppRow.soLuongConThieu = soLuongXc;
        ppRow.soLuongChuyenCapThoc = soLuongXc;
        ppRow.soLuong = tongSoLuongPP;
        Array.isArray(ppRow.childData) && ppRow.childData.forEach(element => {
          element.soLuongXc = soLuongXc;
          element.soLuongConThieu = soLuongXc;
          element.soLuongChuyenCapThoc = soLuongXc;
          Array.isArray(element.childData) && element.childData.forEach(element => {
            element.soLuongXc = soLuongXc;
            element.soLuongConThieu = soLuongXc;
            element.soLuongChuyenCapThoc = soLuongXc;
          });
        });
        this.tinhTong();
      }
      else {
        const soLuongNhuCauXuat = parentRow.soLuongNhuCauXuat
        currentRow.soLuong = $event;
        const tongSoLuongP = Array.isArray(parentRow.childData) ? parentRow.childData.reduce((sum, cur) => sum += cur.soLuong ? cur.soLuong : 0, 0) : 0;
        parentRow.soLuong = tongSoLuongP;
        const soLuongXc = soLuongNhuCauXuat > tongSoLuongP ? soLuongNhuCauXuat - tongSoLuongP : 0;
        // currentRow.soLuongXc = soLuongXc;
        parentRow.soLuongXc = soLuongXc;
        parentRow.soLuongConThieu = soLuongXc;
        parentRow.soLuongChuyenCapThoc = soLuongXc;
        Array.isArray(parentRow.childData) && parentRow.childData.forEach(element => {
          element.soLuongXc = soLuongXc;
          element.soLuongConThieu = soLuongXc;
          element.soLuongChuyenCapThoc = soLuongXc;
        });
        this.tinhTong();
      }
    }
  }
  handleChangeXuatCap() {
    if (this.formData.value.type === "TTr") {
      if (this.formData.value.xuatCap) {
        this.dataPhanBoXuatCap = uniqBy(this.formData.value.quyetDinhPdDtl.filter(f => f.soLuongXc > 0), 'noiDungDx')
          .map(f => ({ ...f, tenDvi: '', maDvi: '', id: null, mId: uuidv4(), xuatCap: true, soLuong: "", tonKhoDvi: "", tonKhoLoaiVthh: "", tonKhoCloaiVthh: "" }));
        this.buildTableViewXuatCap();
      }
    }
  }
  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI.substring(0, 4),
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDonVi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async changeMaDviDtl($event) {
    if ($event) {
      let item = this.listDonVi.find(s => s.maDvi === $event);
      this.formDataDtl.patchValue({
        tenDvi: item.tenDvi
      })
      // await this.kiemTraTonKho();
      this.formDataDtl.get("namNhap").reset();
      this.formDataDtl.get("soLuong").reset();
      this.formDataDtl.get("tonKhoDvi").reset();
      this.formDataDtl.get("namNhap").setErrors(null);
      this.formDataDtl.get("soLuong").setErrors(null);
      this.formDataDtl.get("tonKhoDvi").setErrors(null);
      await this.getListNamXuat();
    }
  }
  validatorSoLuong() {
    const { maDvi, tonKhoDvi, soLuongXc } = this.formDataDtl.value;
    if (maDvi) {
      if (this.isVthhGao()) {
        this.formDataDtl.get('soLuong').setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongXc, tonKhoDvi))]);
      } else {
        this.formDataDtl.get('soLuong').setValidators([Validators.required, Validators.min(1), Validators.max(tonKhoDvi)]);
      }
    }
    this.formDataDtl.get('soLuong').updateValueAndValidity()
  }
  handleChangeNamNhap() {
    const namNhapData = this.listNamNhap.find(f => f.value === this.formDataDtl.value.namNhap);
    const tonKhoDvi = namNhapData ? namNhapData.soLuong : 0;
    this.formDataDtl.patchValue({ tonKhoDvi });
    this.validatorSoLuong()
  }
  async getListNamXuat() {
    try {
      await this.spinner.show();
      const { maDvi } = this.formDataDtl.value;
      const loaiVthh = LOAI_HANG_DTQG.THOC;
      const res = await this.mangLuoiKhoService.getDetailByMa({ maDvi });
      if (res.msg === MESSAGE.SUCCESS) {
        // this.listNamNhap = [];
        // Array.isArray(res.data.object.ctietHhTrongKho) && res.data.object.ctietHhTrongKho.forEach(element => {
        //   if (loaiVthh && loaiVthh === element.loaiVthh) {
        //     const findIndex = this.listNamNhap.findIndex(f => f.value === element.namNhap);
        //     if (findIndex >= 0) {
        //       this.listNamNhap[findIndex].soLuong += element.slHienThoi;
        //     } else {
        //       this.listNamNhap.push({ value: element.namNhap, text: element.namNhap, soLuong: element.slHienThoi })
        //     }
        //   }
        // });
        const newObject = new Map();
        Array.isArray(res.data.object.ctietHhTrongKho) && res.data.object.ctietHhTrongKho.forEach(element => {
          if (loaiVthh && loaiVthh === element.loaiVthh) {
            if (newObject.get(element.namNhap)) {
              newObject[element.namNhap] += element.slHienThoi;
            } else {
              newObject[element.namNhap] = element.slHienThoi;
            }
          }
        })
        this.listNamNhap = Object.entries(newObject).map(([namNhap, soLuong]) => {
          return { value: Number(namNhap), text: Number(namNhap), soLuong: Number(soLuong) };
        });
      }
    } catch (error) {
      console.log("error", error)
    } finally {
      await this.spinner.hide();
    }

  };
  checkHoanThanhPhanBoXuatCap() {
    if (this.formData.value.xuatCap) {
      const tongSoLuongXc = this.dataPhanBoXuatCap.filter(f => !f.maDvi).reduce((sum, cur) => sum += cur.soLuongXc, 0);
      const tongSoLuongPhanBoXuatCap = this.dataPhanBoXuatCap.filter(f => !!f.maDvi).reduce((sum, cur) => sum += cur.soLuong, 0);
      if (tongSoLuongPhanBoXuatCap === tongSoLuongXc) {
        return true
      }
      this.notification.error(MESSAGE.ERROR, "Vui lòng hoàn thành phân bổ gạo cần chuyển xuất cấp!.")
      return false;
    }
    return true
  }
  async kiemTraTonKho() {
    const { maDvi, mId, soLuongXc, noiDungDx } = this.formDataDtl.value;
    const soLuongCanPhanBo = soLuongXc - this.dataPhanBoXuatCap.filter(f => f.maDvi && f.mId !== mId && f.noiDungDx === noiDungDx).reduce((sum, cur) => sum += cur.soLuong, 0);
    if (maDvi) {
      const body = { maDvi, maVthh: LOAI_HANG_DTQG.THOC }
      const res = await this.mangLuoiKhoService.slTon(body);
      let tonKhoDvi: number = 0;
      if (res.msg === MESSAGE.SUCCESS) {
        const slTon = res.data;
        tonKhoDvi = slTon;
        this.formDataDtl.patchValue({ tonKhoDvi });
        this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(tonKhoDvi, soLuongCanPhanBo, soLuongXc))]);
        this.formDataDtl.controls['soLuong'].updateValueAndValidity();
      } else {
        this.formDataDtl.patchValue({ tonKhoLoaiVthh: 0, tonKhoDvi: 0 });
        this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(0)]);
        this.formDataDtl.controls['soLuong'].updateValueAndValidity();
      }
    }
  }
  changeNgayKetThuc($event: MouseEvent) {
    if (this.formData.value.type == 'TH') {
      this.formData.value.quyetDinhPdDtl.forEach(element => {
        if (element.soDx === this.soDxTh) {
          element.ngayKetThuc = this.ngayKetThuc
        }
      });
    } else {
      this.formData.patchValue({ ngayKetThuc: this.ngayKetThuc });
      this.formData.value.quyetDinhPdDtl.forEach(element => {
        element.ngayKetThuc = this.ngayKetThuc
      });
    }
  }
  themPhuongAnXc(data: any) {
    this.formDataDtl.reset();
    this.formDataDtl.patchValue({ ...data, mId: uuidv4(), soLuong: 0 });
    this.modalChiTiet = true
  }
  suaPhuongAnXc(data: any) {
    this.formDataDtl.reset();
    this.formDataDtl.patchValue({ ...data, edit: true });
    this.modalChiTiet = true
  }
  async luuPhuongAnXc() {
    await this.helperService.markFormGroupTouched(this.formDataDtl);
    if (this.formDataDtl.invalid) {
      return;
    }
    const row = this.formDataDtl.value;
    if (row.edit) {
      this.dataPhanBoXuatCap.forEach((item) => {
        if (item.mId === row.mId) {
          Object.assign(item, row);
        }
      })
    } else {
      const indexExist = this.dataPhanBoXuatCap.findIndex(f => f.noiDungDx === row.noiDungDx && f.maDvi === row.maDvi && f.namNhap === row.namNhap);
      if (indexExist >= 0) {
        this.dataPhanBoXuatCap[indexExist] = { ...row }
      } else {
        this.dataPhanBoXuatCap.push(row);
      }
    };
    this.huyPhuongAnXc()
  }
  xoaPhuongAnXc(data: any) {
    this.dataPhanBoXuatCap = this.dataPhanBoXuatCap.filter(f => f.mId !== data.mId);
    this.huyPhuongAnXc();
  }
  async huyPhuongAnXc() {
    this.formDataDtl.reset();
    this.listNamNhap = [];
    this.modalChiTiet = false;
    this.formDataDtl.controls.soLuong.clearValidators();
    this.formDataDtl.controls.soLuong.setValidators([Validators.required, Validators.min(1)]);
    this.formDataDtl.controls.soLuong.updateValueAndValidity();
    this.buildTableViewXuatCap();
  }
  isVthhGao() {
    if (this.formData.value.tenVthh == "Gạo tẻ") {
      return true;
    }
    return false;
  }
  isVthhVatuThietBi() {
    if (this.formData.value.tenVthh == "Vật tư thiết bị") {
      return true;
    }
    return false
  }
  isDisabled() {
    return this.isView || this.formData.value.xuatCap
  }
  openVttbModal() {
    this.openViewVttb = true;
    this.buildTableViewVttb();
  }
  closeVttbModal() {
    this.openViewVttb = false;
    this.phuongAnViewVttb = [];
  }
}
