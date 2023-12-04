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
import { chain, cloneDeep, groupBy } from 'lodash';
import { UserLogin } from "src/app/models/userlogin";
import { DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan } from "src/app/models/KeHoachBanDauGia";
import { DatePipe } from "@angular/common";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { PREVIEW } from "../../../../../../constants/fileType";
import { LOAI_HANG_DTQG, TEN_LOAI_VTHH } from 'src/app/constants/config';
import { AMOUNT_ONE_DECIMAL } from 'src/app/Utility/utils';

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
  loaiNhapXuat: string;
  kieuNhapXuat: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  ngayKetThuc: string;
  amount1 = { ...AMOUNT_ONE_DECIMAL };
  amount1Left = { ...AMOUNT_ONE_DECIMAL, align: "left" }
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
    }
    );
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    };
    // this.formData.controls['ngayHluc'].valueChanges.subscribe((value) => {
    // })
    this.formData.controls['type'].valueChanges.pipe().subscribe((value) => {
      this.formData.patchValue({ quyetDinhPdDtl: [], loaiNhapXuat: '', kieuNhapXuat: '', idTongHop: '', maTongHop: '', ngayThop: '', idDx: '', soDx: '', ngayDx: '', xuatCap: false, soLuongXuatCap: '' });
      this.quyetDinhPdDtlCache = [];
      this.tongSoLuongDx = 0;
      this.tongSoLuongChuyenCapThocDx = 0;
      this.ngayKetThuc = "";
      this.tongSoLuong = 0;
      this.tongSoLuongChuyenCapThoc = 0;
      this.loaiNhapXuat = "";
      this.kieuNhapXuat = "";
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
      this.formData.patchValue({ quyetDinhPdDtl: [], loaiNhapXuat: '', kieuNhapXuat: '', idTongHop: '', maTongHop: '', ngayThop: '', idDx: '', soDx: '', ngayDx: '', xuatCap: false, soLuongXuatCap: '' });
      this.quyetDinhPdDtlCache = [];
      this.tongSoLuongDx = 0;
      this.tongSoLuongChuyenCapThocDx = 0;
      this.ngayKetThuc = "";
      this.tongSoLuong = 0;
      this.tongSoLuongChuyenCapThoc = 0;
      this.loaiNhapXuat = "";
      this.kieuNhapXuat = "";
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
      await Promise.all([]);
      await this.loadDetail();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }
  bidingDataInFormGroupAndIgnore(formGroup: FormGroup, dataBinding: any, ignoreField: Array<string>) {
    if (dataBinding) {
      for (const name in dataBinding) {
        if (formGroup.controls.hasOwnProperty(name) && !ignoreField.includes(name)) {
          formGroup.controls[name].setValue(dataBinding[name]);
        }
      }
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
            res.data.quyetDinhPdDtl.forEach(s => s.idVirtual = uuidv4());
            this.helperService.bidingDataInFormGroupAndNotTrigger(this.formData, res.data, ['type', 'tenVthh']);

            //get cache
            if (this.formData.value.type == 'TTr') {
              let res = await this.deXuatPhuongAnCuuTroService.getDetail(this.formData.value.idDx);
              let detail = res.data;
              detail.deXuatPhuongAn.forEach(s => {
                s.noiDungDx = s.noiDung;
                s.soDx = detail.soDx;
                s.ngayKyDx = detail.ngayDx;
                s.trichYeuDx = detail.trichYeu;
                // s.soLuongDx = s.soLuong;
                s.loaiNhapXuat = detail.loaiNhapXuat;
                s.kieuNhapXuat = detail.kieuNhapXuat;
                s.mucDichXuat = detail.mucDichXuat;
                s.ngayKetThuc = detail.ngayKetThuc;
              });
              this.quyetDinhPdDtlCache = cloneDeep(detail.deXuatPhuongAn.map(element => ({
                ...element, soLuongXc: element.soLuongXc ? element.soLuongXc : element.soLuongChuyenCapThoc,
                soLuongDx: element.soLuongDx ? element.soLuongDx : element.soLuong
              })));
              // this.loaiNhapXuat = detail.loaiNhapXuat;
              // this.kieuNhapXuat = detail.kieuNhapXuat;
              // this.mucDichXuat = detail.mucDichXuat
              this.ngayKetThuc = detail.ngayKetThuc;
            } else {
              let res = await this.tongHopPhuongAnCuuTroService.getDetail(this.formData.value.idTongHop);
              let detail = res.data;
              this.quyetDinhPdDtlCache = cloneDeep(detail.deXuatCuuTro.map(element => ({
                ...element,
                soLuongXc: element.soLuongXc ? element.soLuongXc : element.soLuongChuyenCapThoc, soLuongDx: element.soLuongDx ? element.soLuongDx : element.soLuong
              }))).sort((a, b) => b.id - a.id);

            }
            await this.buildTableView();
            if (this.phuongAnHdrView && this.formData.value.type === "TH" && this.phuongAnHdrView[0]) {
              await this.selectRow(this.phuongAnHdrView[0])
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
    this.formData.controls['soBbQd'].setValidators(Validators.required)
    if (this.formData.value.xuatCap) {
      const soLuongXuatCap = this.formData.value.quyetDinhPdDtl.reduce((sum, cur) => sum += cur.soLuongXc, 0);
      this.formData.patchValue({ soLuongXuatCap })
    }
    if (!this.formData.value.quyetDinhPdDtl || this.formData.value.quyetDinhPdDtl.length <= 0) {
      return this.notification.error(MESSAGE.ERROR, "Thông tin chi tiết đề xuất cứu trợ, viện trợ của các đơn vị không tồn tại.")
    }
    let body = {
      ...this.formData.value,
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null
    }
    await this.createUpdate(body, null, null, ['tenVthh', 'type']);
    this.helperService.restoreRequiredForm(this.formData)
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    if (this.formData.value.xuatCap) {
      const soLuongXuatCap = this.formData.value.quyetDinhPdDtl.reduce((sum, cur) => sum += cur.soLuongXc, 0);
      this.formData.patchValue({ soLuongXuatCap })
    }
    let body = { ...this.formData.value, soBbQd: this.formData.value.soBbQd + this.maHauTo }
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
    this.bidingDataInFormGroupAndIgnore(this.formData, data, ['tenVthh', 'quyetDinhPdDtl']);
    await this.buildTableView();
    if (this.phuongAnHdrView[0]) {
      await this.selectRow(this.phuongAnHdrView[0]);
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
    this.formData.value.quyetDinhPdDtl.forEach(s => delete s.id);
    // this.formData.patchValue(data, { onlySelf: true, emitEvent: false });
    // this.formData.patchValue(data);
    this.bidingDataInFormGroupAndIgnore(this.formData, data, ['tenVthh', 'quyetDinhPdDtl']);
    this.loaiNhapXuat = detail.loaiNhapXuat;
    this.kieuNhapXuat = detail.kieuNhapXuat;
    this.ngayKetThuc = detail.ngayKetThuc;
    await this.buildTableView();
    // await this.selectRow(this.phuongAnHdrViewCache[0]);
    await this.expandAll();
  }
  // changeVthh($event) {
  //   if ($event == TEN_LOAI_VTHH.THOC) {
  //     this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.THOC, donViTinh: "kg" });
  //   } else if ($event == TEN_LOAI_VTHH.GAO) {
  //     this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.GAO, donViTinh: "kg" });
  //   } else if ($event == TEN_LOAI_VTHH.MUOI) {
  //     this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.MUOI, donViTinh: "kg" });
  //   } else {
  //     this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.VAT_TU, donViTinh: null });
  //   };
  //   this.formData.patchValue({ quyetDinhPdDtl: [], loaiNhapXuat: '', kieuNhapXuat: '' });
  //   this.quyetDinhPdDtlCache = [];
  //   this.tongSoLuongDx = 0;
  //   this.tongSoLuongChuyenCapThocDx = 0;
  //   this.mucDichXuat = "";
  //   this.ngayKetThuc = "";
  //   this.tongSoLuong = 0;
  //   this.tongSoLuongChuyenCapThoc = 0;
  //   this.loaiNhapXuat = "";
  //   this.kieuNhapXuat = "";
  //   this.phuongAnHdrView = [];
  //   this.phuongAnHdrViewCache = [];
  //   this.phuongAnView = [];
  //   this.phuongAnViewCache = [];
  // }
  async buildTableView() {
    if (this.formData.value.type === "TH") {

      if (this.isVthhVatuThietBi()) {
        this.phuongAnHdrView = chain(this.formData.value.quyetDinhPdDtl)
          .groupBy("soDx")
          .map((value, key) => {
            let row = value.find(s => s.soDx === key);

            let rs = row ? chain(value)
              .groupBy("noiDungDx")
              .map((v, k) => {
                let row1 = v.find(s => s.noiDungDx === k);
                let rs1 = row1 ? chain(v)
                  .groupBy("loaiVthh")
                  .map((v1, k1) => {
                    let row2 = v1.find(s => s.loaiVthh === k1);
                    let tonKhoCloaiVthh = v1.reduce((prev, next) => prev += next.tonKhoCloaiVthh, 0);
                    let soLuongDx = v1.reduce((prev, next) => prev += next.soLuongDx, 0);
                    let soLuong = v1.reduce((prev, next) => prev += next.soLuong, 0);
                    return {
                      idVirtual: uuidv4(),
                      loaiVthh: k1,
                      tenLoaiVthh: row2.tenLoaiVthh,
                      donViTinh: row2.donViTinh,
                      // soLuong: row2.soLuong,
                      // soLuongDx: row2.soLuongDx,
                      soLuong,
                      soLuongDx,
                      soLuongNhuCauXuat: row2.soLuongNhuCauXuat,
                      tonKho: row2.tonKhoLoaiVthh || tonKhoCloaiVthh,
                      tenCloaiVthh: row2.tenCloaiVthh,
                      childData: v1,
                      loaiNhapXuat: row2.loaiNhapXuat,
                      kieuNhapXuat: row2.kieuNhapXuat,
                    }
                  }).value() : [];
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
              }).value() : [];
            let soLuong = rs.reduce((prev, next) => prev += next.soLuong, 0);
            let soLuongDx = rs.reduce((prev, next) => prev += next.soLuongDx, 0);
            let soLuongNhuCauXuat = rs.reduce((prev, next) => prev += next.soLuongNhuCauXuat ? next.soLuongNhuCauXuat : 0, 0);
            return {
              idVirtual: uuidv4(),
              tenDvi: row.tenDvi,
              maDvi: row.maDvi,
              soDx: row.soDx,
              trichYeuDx: row.trichYeuDx,
              mucDichXuat: row.mucDichXuat,
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
            let row = value.find(s => s.soDx === key);
            if (!row) return {};
            // let rs = row ? chain(value)
            //   .groupBy("noiDungDx")
            //   .map((v, k) => {
            //     let row1 = v.find(s => s.noiDungDx === k);
            //     return {
            //       ...row1,
            //       idVirtual: uuidv4(),
            //       noiDungDx: k,
            //       // childData: row1 ? v : []
            //     }
            //   }).value() : [];
            let soLuongDx = value.reduce((prev, next) => prev += next.soLuongDx, 0);
            let soLuong = value.reduce((prev, next) => prev += next.soLuong, 0);
            let soLuongNhuCauXuat = value.reduce((prev, next) => prev += next.soLuongNhuCauXuat ? next.soLuongNhuCauXuat : 0, 0);
            let soLuongXc = value.reduce((prev, next) => prev += next.soLuongXc ? next.soLuongXc : 0, 0);
            return {
              idVirtual: uuidv4(),
              tenDvi: row.tenDvi,
              maDvi: row.maDvi,
              soDx: row.soDx,
              trichYeuDx: row.trichYeuDx,
              mucDichXuat: row.mucDichXuat,
              ngayKetThuc: row.ngayKetThuc,
              ngayKyDx: row.ngayKyDx,
              thoiGian: row.ngayKyDx,
              soLuongDx: soLuongDx,
              soLuong: soLuong,
              soLuongNhuCauXuat: soLuongNhuCauXuat,
              soLuongXc,
              childData: row ? value : [],
              loaiNhapXuat: row.loaiNhapXuat,
              kieuNhapXuat: row.kieuNhapXuat,
            };
          }).value();
      }

      //
      if (this.isVthhVatuThietBi()) {

        this.phuongAnHdrViewCache = chain(this.quyetDinhPdDtlCache)
          .groupBy("soDx")
          .map((value, key) => {
            let row = value.find(s => s.soDx === key);
            // let soLuongDx = value.reduce((prev, next) => prev += next.soLuongDx, 0);
            // let soLuongDx = value.reduce((prev, next) => prev += next.soLuongDx, 0);
            let rs = row ? chain(value)
              .groupBy("noiDungDx")
              .map((v, k) => {
                let row1 = v.find(s => s.noiDungDx === k);
                let rs1 = row1 ? chain(v)
                  .groupBy("loaiVthh")
                  .map((v1, k1) => {
                    let row2 = v1.find(s => s.loaiVthh === k1);
                    let tonKhoCloaiVthh = v.reduce((prev, next) => prev += next.tonKhoCloaiVthh, 0);
                    let soLuongDx = v.reduce((prev, next) => prev += next.soLuongDx, 0);
                    let soLuong = v.reduce((prev, next) => prev += next.soLuong, 0);
                    return {
                      idVirtual: uuidv4(),
                      loaiVthh: k1,
                      tenLoaiVthh: row2.tenLoaiVthh,
                      donViTinh: row2.donViTinh,
                      // soLuong: row2.soLuong,
                      // soLuongDx: row2.soLuongDx,
                      soLuongDx,
                      soLuong,
                      tonKho: row2.tonKhoLoaiVthh || tonKhoCloaiVthh,
                      tenCloaiVthh: row2.tenCloaiVthh,
                      childData: v1
                    }
                  }).value() : [];
                return {
                  idVirtual: uuidv4(),
                  noiDungDx: k,
                  soLuong: 0,
                  soLuongDx: 0,
                  childData: rs1
                }
              }).value() : [];
            let soLuongDx = rs.reduce((prev, next) => prev += next.soLuongDx, 0);
            let soLuong = rs.reduce((prev, next) => prev += next.soLuong, 0);
            return {
              idVirtual: uuidv4(),
              tenDvi: row.tenDvi,
              maDvi: row.maDvi,
              soDx: row.soDx,
              trichYeuDx: row.trichYeuDx,
              mucDichXuat: row.mucDichXuat,
              ngayKetThuc: row.ngayKetThuc,
              ngayKyDx: row.ngayKyDx,
              thoiGian: row.ngayKyDx,
              soLuongDx: soLuongDx,
              soLuong,
              childData: rs
            };
          }).value();
      } else {
        this.phuongAnHdrViewCache = chain(this.quyetDinhPdDtlCache)
          .groupBy("soDx")
          .map((value, key) => {
            let row = value.find(s => s.soDx === key);
            let soLuongDx = value.reduce((prev, next) => prev += next.soLuongDx, 0);
            let soLuong = value.reduce((prev, next) => prev += next.soLuong, 0);
            let soLuongNhuCauXuat = value.reduce((prev, next) => prev += next.soLuongNhuCauXuat ? next.soLuongNhuCauXuat : 0, 0);
            return {
              idVirtual: uuidv4(),
              tenDvi: row.tenDvi,
              maDvi: row.maDvi,
              soDx: row.soDx,
              trichYeuDx: row.trichYeuDx,
              mucDichXuat: row.mucDichXuat,
              ngayKetThuc: row.ngayKetThuc,
              ngayKyDx: row.ngayKyDx,
              thoiGian: row.ngayKyDx,
              soLuongDx: soLuongDx,
              soLuong,
              soLuongNhuCauXuat,
              childData: row ? value : [],
            };
          }).value();
      }
    } else {
      if (this.isVthhVatuThietBi()) {
        this.phuongAnHdrView = chain(this.formData.value.quyetDinhPdDtl)
          .groupBy("noiDungDx")
          .map((value, key) => {
            let row = value.find(s => s.noiDungDx === key);
            let rs = chain(value)
              .groupBy("loaiVthh")
              .map((v, k) => {
                let row1 = v.find(s => s.loaiVthh === k);
                let tonKhoCloaiVthh = v.reduce((prev, next) => prev += next.tonKhoCloaiVthh, 0);
                let soLuongDx = v.reduce((prev, next) => prev += next.soLuongDx, 0);
                let soLuong = v.reduce((prev, next) => prev += next.soLuong, 0);
                return {
                  idVirtual: uuidv4(),
                  noiDungDx: k,
                  tenLoaiVthh: row1.tenLoaiVthh,
                  soLuong,
                  soLuongDx,
                  tonKhoCloaiVthh,
                  childData: row1 ? v : [],
                  loaiNhapXuat: row1.loaiNhapXuat,
                  kieuNhapXuat: row1.kieuNhapXuat,
                }
              }).value();
            let soLuongDx = rs.reduce((prev, next) => prev += next.soLuongDx, 0);
            let soLuong = rs.reduce((prev, next) => prev += next.soLuong, 0);
            return {
              idVirtual: uuidv4(),
              noiDungDx: row.noiDungDx,
              tenDvi: row.tenDvi,
              maDvi: row.maDvi,
              soDx: row.soDx,
              trichYeuDx: row.trichYeuDx,
              mucDichXuat: row.mucDichXuat,
              ngayKetThuc: row.ngayKetThuc,
              ngayKyDx: row.ngayKyDx,
              thoiGian: row.ngayKyDx,
              soLuongDx: soLuongDx,
              soLuong,
              loaiNhapXuat: row.loaiNhapXuat,
              kieuNhapXuat: row.kieuNhapXuat,
              childData: rs
            };
          }).value();
      } else {
        this.phuongAnHdrView = chain(this.formData.value.quyetDinhPdDtl)
          .groupBy("noiDungDx")
          .map((value, key) => {
            let row = value.find(s => s.noiDungDx === key);
            let soLuongDx = value.reduce((prev, next) => prev += next.soLuongDx, 0);
            let soLuong = value.reduce((prev, next) => prev += next.soLuong, 0);
            let soLuongNhuCauXuat = value.reduce((prev, next) => prev += next.soLuongNhuCauXuat ? next.soLuongNhuCauXuat : 0, 0);
            let soLuongXc = value.reduce((prev, next) => prev += next.soLuongXc ? next.soLuongXc : 0, 0);
            return {
              idVirtual: uuidv4(),
              noiDungDx: row.noiDungDx,
              tenDvi: row.tenDvi,
              maDvi: row.maDvi,
              soDx: row.soDx,
              trichYeuDx: row.trichYeuDx,
              mucDichXuat: row.mucDichXuat,
              ngayKetThuc: row.ngayKetThuc,
              ngayKyDx: row.ngayKyDx,
              thoiGian: row.ngayKyDx,
              soLuongDx: soLuongDx,
              soLuong: soLuong,
              soLuongNhuCauXuat,
              loaiNhapXuat: row.loaiNhapXuat,
              kieuNhapXuat: row.kieuNhapXuat,
              soLuongXc,
              childData: row ? value : [],
            };
          }).value();
      }

      //
      if (this.isVthhVatuThietBi()) {

        this.phuongAnHdrViewCache = chain(this.quyetDinhPdDtlCache)
          .groupBy("noiDungDx")
          .map((value, key) => {
            let row = value.find(s => s.noiDungDx === key);
            let rs = chain(value)
              .groupBy("loaiVthh")
              .map((v, k) => {
                let row1 = v.find(s => s.loaiVthh === k);
                let soLuongDx = v.reduce((prev, next) => prev += next.soLuongDx, 0);
                let soLuong = v.reduce((prev, next) => prev += next.soLuong, 0);
                let tonKhoLoaiVthh = v.reduce((prev, next) => prev += next.tonKhoLoaiVthh, 0);
                let tonKhoCloaiVthh = v.reduce((prev, next) => prev += next.tonKhoCloaiVthh, 0);
                return {
                  idVirtual: uuidv4(),
                  noiDungDx: k,
                  tenLoaiVthh: row1.tenLoaiVthh,
                  soLuong,
                  soLuongDx,
                  tonKhoCloaiVthh,
                  tonKhoLoaiVthh,
                  childData: row1 ? v : [],
                }
              }).value();
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
              ngayKetThuc: row.ngayKetThuc,
              ngayKyDx: row.ngayKyDx,
              thoiGian: row.ngayKyDx,
              soLuong,
              soLuongDx,
              childData: rs
            };
          }).value();
      } else {
        this.phuongAnHdrViewCache = chain(this.quyetDinhPdDtlCache)
          .groupBy("noiDungDx")
          .map((value, key) => {
            let row = value.find(s => s.noiDungDx === key);
            let soLuongDx = value.reduce((prev, next) => prev += next.soLuongDx, 0);
            let soLuong = value.reduce((prev, next) => prev += next.soLuong, 0);
            let soLuongNhuCauXuat = value.reduce((prev, next) => prev += next.soLuongNhuCauXuat ? next.soLuongNhuCauXuat : 0, 0);
            let soLuongXc = value.reduce((prev, next) => prev += next.soLuongXc ? next.soLuongXc : 0, 0);
            return {
              idVirtual: uuidv4(),
              noiDungDx: row.noiDungDx,
              noiDung: row.noiDung,
              tenDvi: row.tenDvi,
              maDvi: row.maDvi,
              soDx: row.soDx,
              trichYeuDx: row.trichYeuDx,
              mucDichXuat: row.mucDichXuat,
              ngayKetThuc: row.ngayKetThuc,
              ngayKyDx: row.ngayKyDx,
              thoiGian: row.ngayKyDx,
              soLuongDx,
              soLuong,
              soLuongNhuCauXuat,
              soLuongXc,
              childData: row ? value : [],
            };
          }).value();
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

  async selectRow(item: any) {
    if (!item.selected) {
      this.phuongAnHdrView.forEach(i => i.selected = false);
      item.selected = true;
      // this.phuongAnView = (this.phuongAnHdrView.find(s => s.soDx == item.soDx)).childData;
      // this.phuongAnViewCache = (this.phuongAnHdrViewCache.find(s => s.soDx == item.soDx)).childData;
      const findndex = this.phuongAnHdrView.findIndex(s => s.soDx == item.soDx);
      const findCacheIndex = this.phuongAnHdrViewCache.findIndex(s => s.soDx == item.soDx);
      this.phuongAnView = this.phuongAnHdrView[findndex]?.childData ? this.phuongAnHdrView[findndex].childData : [];
      this.phuongAnViewCache = this.phuongAnHdrViewCache[findCacheIndex]?.childData ? this.phuongAnHdrViewCache[findCacheIndex].childData : [];
      this.loaiNhapXuat = this.phuongAnHdrView[findndex]?.loaiNhapXuat;
      this.kieuNhapXuat = this.phuongAnHdrView[findndex]?.kieuNhapXuat;
      this.ngayKetThuc = this.phuongAnHdrView[findndex]?.ngayKetThuc;
      await this.tinhTong();
    }
  }

  expandAll() {
    this.phuongAnHdrView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
      Array.isArray(s.childData) && s.childData.forEach(s1 => {
        this.expandSetString.add(s1.idVirtual);
      })
    });

    this.phuongAnHdrViewCache.forEach(s => {
      this.expandSetStringCache.add(s.idVirtual);
      Array.isArray(s.childData) && s.childData.forEach(s1 => {
        this.expandSetStringCache.add(s1.idVirtual);
      })
    })
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
  tinhTongVthh(currentRow: any, $event: any, parentRow?: any, ppRow?: any) {
    currentRow.soLuong = $event;
    if (parentRow) {
      const soLuong = Array.isArray(parentRow.childData) ? parentRow.childData.reduce((sum, cur) => sum += cur.soLuong, 0) : 0;
      parentRow.soLuong = soLuong;
      if (ppRow) {
        const soLuong = Array.isArray(ppRow.childData) ? ppRow.childData.reduce((sum, cur) => sum += cur.soLuong, 0) : 0;
        ppRow.soLuong = soLuong;
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
    if (isVatTu) {
      currentRow.soLuong = $event;
      let currentDvi = this.formData.value.quyetDinhPdDtl.filter(s => s.maDvi == currentRow.maDvi);
      let tongSoDaGiao = currentDvi.reduce((prev, next) => prev += next.soLuong, 0);
      currentDvi.forEach(s => s.soLuongXc = 0);
      if (tongSoDaGiao < currentRow.soLuongNhuCauXuat) {
        currentRow.soLuongXc = (currentRow.soLuongNhuCauXuat - tongSoDaGiao) > 0 ? (currentRow.soLuongNhuCauXuat - tongSoDaGiao) : 0;
      } else {
        currentRow.soLuongXc = 0;
      }
    }
    else {
      currentRow.soLuong = $event;
      currentRow.soLuongNhuCauXuat = !isNaN(currentRow.soLuongNhuCauXuat) ? currentRow.soLuongNhuCauXuat : 0;
      if ($event < currentRow.soLuongNhuCauXuat) {
        currentRow.soLuongXc = (currentRow.soLuongNhuCauXuat - $event) > 0 ? (currentRow.soLuongNhuCauXuat - $event) : 0;
      } else {
        currentRow.soLuongXc = 0;
      };
      if (parentRow) {
        const { soLuong, soLuongXc } = Array.isArray(parentRow.childData) ? parentRow.childData.reduce((obj, cur) => {
          obj.soLuong += cur.soLuong;
          obj.soLuongXc += cur.soLuongXc;
          return obj;
        }, { soLuong: 0, soLuongXc: 0 }) : { soLuong: 0, soLuongXc: 0 };
        parentRow.soLuongXc = soLuongXc;
        parentRow.soLuong = soLuong;
        if (ppRow) {
          const { soLuong, soLuongXc } = Array.isArray(ppRow.childData) ? ppRow.childData.reduce((obj, cur) => {
            obj.soLuong += cur.soLuong;
            obj.soLuongXc += cur.soLuongXc;
            return obj;
          }, { soLuong: 0, soLuongXc: 0 }) : { soLuong: 0, soLuongXc: 0 };
          ppRow.soLuongXc = soLuongXc;
          ppRow.soLuong = soLuong;
        }
      }
      this.tinhTong()
      // const quyetDinhPdDtl = this.formData.value.quyetDinhPdDtl.map(f => {
      //   if (f.mId === currentRow.mId) {
      //     return { ...f, soLuong: currentRow.soLuong, soLuongXc: currentRow.soLuongXc }
      //   }
      //   return f
      // });
      // this.formData.patchValue({ quyetDinhPdDtl });
    }
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
}
