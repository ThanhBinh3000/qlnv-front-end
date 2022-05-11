import { saveAs } from 'file-saver';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeHoachLuongThuc } from 'src/app/models/KeHoachLuongThuc';
import { KeHoachMuoi } from 'src/app/models/KeHoachMuoi';
import { TAB_SELECTED } from './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam.constant';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DialogDieuChinhThemThongTinLuongThucComponent } from 'src/app/components/dialog/dialog-dieu-chinh-them-thong-tin-luong-thuc/dialog-dieu-chinh-them-thong-tin-luong-thuc.component';
import { DialogDieuChinhThemThongTinMuoiComponent } from 'src/app/components/dialog/dialog-dieu-chinh-them-thong-tin-muoi/dialog-dieu-chinh-them-thong-tin-muoi.component';
import { DialogDieuChinhThemThongTinVatTuComponent } from 'src/app/components/dialog/dialog-dieu-chinh-them-thong-tin-vat-tu/dialog-dieu-chinh-them-thong-tin-vat-tu.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DialogLuaChonInComponent } from 'src/app/components/dialog/dialog-lua-chon-in/dialog-lua-chon-in.component';
import { ThongTinChiTieuKeHoachNam } from 'src/app/models/ThongTinChiTieuKHNam';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QuyetDinhDieuChinhChiTieuKeHoachNamService } from 'src/app/services/quyetDinhDieuChinhChiTieuKeHoachNam.service';
import { MESSAGE } from 'src/app/constants/message';
import * as XLSX from 'xlsx';
import { DieuChinhThongTinChiTieuKHNam } from 'src/app/models/DieuChinhThongTinChiTieuKHNam';
import { QuyetDinhChiTieuKHNam } from 'src/app/models/QuyetDinhChiTieuKHNam';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { HelperService } from 'src/app/services/helper.service';
import { KeHoachVatTu, VatTuThietBi } from 'src/app/models/KeHoachVatTu';
import { environment } from 'src/environments/environment';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { cloneDeep } from 'lodash';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { LEVEL, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { ItemDetail } from 'src/app/models/ItemDetail';
import { Globals } from './../../../shared/globals';
import { DonviService } from 'src/app/services/donvi.service';
import { UserService } from 'src/app/services/user.service';
import { UserLogin } from 'src/app/models/userlogin';

@Component({
  selector: 'app-dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl:
    './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: [
    './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss',
  ],
})
export class DieuChinhThongTinChiTieuKeHoachNamComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  listThoc: KeHoachLuongThuc[] = [];
  listMuoi: KeHoachMuoi[] = [];
  listVatTu = [];
  modals = {
    luaChonIn: false,
    thongTinLuongThuc: false,
    thongTinVatTuTrongNam: false,
    thongTinMuoi: false,
  };
  id: number;
  tabSelected: string = TAB_SELECTED.luongThuc;
  detail = {
    soQD: null,
    ngayKy: null,
    ngayHieuLuc: null,
    namKeHoach: dayjs().get('year'),
    trichYeu: null,
  };
  tab = TAB_SELECTED;
  listNam: any[] = [];
  yearNow: number = 0;
  startValue: Date | null = null;
  endValue: Date | null = null;
  formData: FormGroup;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  selectedCanCu: any = {};
  dieuChinhThongTinChiTieuKHNam: any = {};
  fileDinhKem: string = null;
  tableExist: boolean = false;
  qdTCDT: string = MESSAGE.QD_TCDT;
  userInfo: UserLogin;

  taiLieuDinhKemList: any[] = [];
  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-gateway/qlnv-core/file/upload-attachment`;

  dataTag: any[] = [];

  dataGiaoChiTieu: any[] = [];

  lastBreadcrumb: string;
  trangThai: string = 'Dự thảo';

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  dataLuongThuc: any[] = [];
  dataMuoi: any[] = [];
  dataVatTu: any[] = [];

  keHoachLuongThucCreate: KeHoachLuongThuc = new KeHoachLuongThuc();
  isAddLuongThuc: boolean = false;

  keHoachMuoiCreate: KeHoachMuoi = new KeHoachMuoi();
  isAddMuoi: boolean = false;

  keHoachVatTuCreate: KeHoachVatTu = new KeHoachVatTu();
  isAddVatTu: boolean = false;

  dataVatTuCha: any[] = [];
  dataVatTuChaShow: any[] = [];
  dataVatTuCon: any[] = [];
  dataVatTuConClone: any[] = [];
  dataVatTuConShow: any[] = [];

  options: any[] = [];
  optionsDonVi: any[] = [];

  thocIdDefault: number = 2;
  gaoIdDefault: number = 6;
  muoiIdDefault: number = 78;

  editLuongThucCache: { [key: string]: { edit: boolean; data: any } } = {};
  editMuoiCache: { [key: string]: { edit: boolean; data: any } } = {};
  editVatTuCache: { [key: string]: { edit: boolean; data: any } } = {};

  constructor(
    private router: Router,
    private routerActive: ActivatedRoute,
    private fb: FormBuilder,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private quyetDinhDieuChinhChiTieuKeHoachNamService: QuyetDinhDieuChinhChiTieuKeHoachNamService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private danhMucService: DanhMucService,
    private helperService: HelperService,
    private cdr: ChangeDetectorRef,
    public globals: Globals,
    private donViService: DonviService,
    private userService: UserService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.userInfo) {
        this.qdTCDT = this.userInfo.MA_QD;
      }
      if (this.router.url.includes(LEVEL.TONG_CUC)) {
        this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
      } else if (this.router.url.includes(LEVEL.CHI_CUC)) {
        this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
      } else if (this.router.url.includes(LEVEL.CUC)) {
        this.lastBreadcrumb = LEVEL.CUC_SHOW;
      }
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      await this.loadDataChiTiet(this.id);
      await this.loadDanhMucHang();
      this.loadDefaultLuongThucNew();
      this.loadDefaultMuoiNew();
      this.loadDefaultVatTuNew();
      this.loadDonVi();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  updateDataVatTu() {
    let temp = [];
    if (this.dieuChinhThongTinChiTieuKHNam.khVatTu && this.dieuChinhThongTinChiTieuKHNam.khVatTu.length > 0) {
      this.dieuChinhThongTinChiTieuKHNam.khVatTu.forEach(element => {
        if (element.vatTuThietBi && element.vatTuThietBi.length > 0) {
          element.vatTuThietBi.forEach(vatTu => {
            let item = cloneDeep(element);
            item.vatTuThietBi = [];
            item.vatTuThietBi.push(vatTu);
            temp.push(item);
          });
        }
      });
    }
    temp = temp.sort((a, b) => a.tenDonVi.localeCompare(b.tenDonVi));
    this.dieuChinhThongTinChiTieuKHNam.khVatTu = temp;
  }

  caculatorDieuChinhLT(item: any) {
    item.sdcNtnThoc = (!isNaN(item.tdcNtnThoc) ? item.tdcNtnThoc : 0) + (!isNaN(item.dcNtnThoc) ? item.dcNtnThoc : 0);
    item.sdcNtnGao = (!isNaN(item.tdcNtnGao) ? item.tdcNtnGao : 0) + (!isNaN(item.dcNtnGao) ? item.dcNtnGao : 0);
    item.sdcNtnTongSoQuyThoc = (item.sdcNtnThoc ?? 0) + (item.sdcNtnGao ?? 0) * 2;

    if (item.tdcXtnThoc && item.tdcXtnThoc.length > 0 && item.dcXtnThoc && item.dcXtnThoc.length > 0
      && item.sdcXtnThoc && item.sdcXtnThoc.length > 0) {
      item.sdcXtnThoc[0].soLuong = (item.tdcXtnThoc[0].soLuong ?? 0) + (item.dcXtnThoc[0].soLuong ?? 0);
      item.sdcXtnThoc[1].soLuong = (item.tdcXtnThoc[1].soLuong ?? 0) + (item.dcXtnThoc[1].soLuong ?? 0);
      item.sdcXtnThoc[2].soLuong = (item.tdcXtnThoc[2].soLuong ?? 0) + (item.dcXtnThoc[2].soLuong ?? 0);

      item.sdcXtnTongThoc = item.sdcXtnThoc[0].soLuong + item.sdcXtnThoc[1].soLuong + item.sdcXtnThoc[2].soLuong;
    }

    if (item.tdcXtnGao && item.tdcXtnGao.length > 0 && item.dcXtnGao && item.dcXtnGao.length > 0
      && item.sdcXtnGao && item.sdcXtnGao.length > 0) {
      item.sdcXtnGao[0].soLuong = (item.tdcXtnGao[0].soLuong ?? 0) + (item.dcXtnGao[0].soLuong ?? 0);
      item.sdcXtnGao[1].soLuong = (item.tdcXtnGao[1].soLuong ?? 0) + (item.dcXtnGao[1].soLuong ?? 0);

      item.sdcXtnTongGao = item.sdcXtnGao[0].soLuong + item.sdcXtnGao[1].soLuong;
    }

    item.sdcXtnTongSoQuyThoc = (item.sdcXtnTongThoc ?? 0) + (item.sdcXtnTongGao ?? 0) * 2;

    item.tkcnTongThoc = (item.tkdnTongThoc ?? 0) + (item.sdcNtnThoc ?? 0) - (item.sdcXtnTongThoc ?? 0);
    item.tkcnTongGao = (item.tkdnTongGao ?? 0) + (item.sdcNtnGao ?? 0) - (item.sdcXtnTongGao ?? 0);
    item.tkcnTongSoQuyThoc = (item.tkcnTongThoc ?? 0) + (item.tkcnTongGao ?? 0) * 2;
  }

  caculatorDieuChinhMuoi(item: any) {
    item.sdcNtnTongSoMuoi = (!isNaN(item.tdcNtnTongSoMuoi) ? item.tdcNtnTongSoMuoi : 0) + (!isNaN(item.dcNtnTongSoMuoi) ? item.dcNtnTongSoMuoi : 0);

    if (item.tdcXtnMuoi && item.tdcXtnMuoi.length > 0 && item.dcXtnMuoi && item.dcXtnMuoi.length > 0
      && item.sdcXtnMuoi && item.sdcXtnMuoi.length > 0) {
      item.sdcXtnMuoi[0].soLuong = (item.tdcXtnMuoi[0].soLuong ?? 0) + (item.dcXtnMuoi[0].soLuong ?? 0);
      item.sdcXtnMuoi[1].soLuong = (item.tdcXtnMuoi[1].soLuong ?? 0) + (item.dcXtnMuoi[1].soLuong ?? 0);
      item.sdcXtnMuoi[2].soLuong = (item.tdcXtnMuoi[2].soLuong ?? 0) + (item.dcXtnMuoi[2].soLuong ?? 0);

      item.sdcXtnTongSoMuoi = item.sdcXtnThoc[0].soLuong + item.sdcXtnThoc[1].soLuong + item.sdcXtnThoc[2].soLuong;
    }

    item.tkcnTongThoc = (item.tkdnTongThoc ?? 0) + (item.sdcNtnThoc ?? 0) - (item.sdcXtnTongThoc ?? 0);
    item.tkcnTongGao = (item.tkdnTongGao ?? 0) + (item.sdcNtnGao ?? 0) - (item.sdcXtnTongGao ?? 0);
    item.tkcnTongSoQuyThoc = (item.tkcnTongThoc ?? 0) + (item.tkcnTongGao ?? 0) * 2;
  }

  caculatorDieuChinhVatTu(item: any) {
    item.vatTuThietBi[0].sdcNhapTrongNam = (!isNaN(item.vatTuThietBi[0].tdcNhapTrongNam) ? item.vatTuThietBi[0].tdcNhapTrongNam : 0) + (!isNaN(item.vatTuThietBi[0].dcNhapTrongNam) ? item.vatTuThietBi[0].dcNhapTrongNam : 0);
  }

  updateEditVatTuCache(): void {
    if (this.dataVatTu && this.dataVatTu.length > 0) {
      this.dataVatTu.forEach((item) => {
        this.editVatTuCache[item.donViId + '-' + item.vatTuThietBi[0].vatTuId] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  cancelEditVatTu(donViId: number, vatTuId: number): void {
    const index = this.dataVatTu.findIndex((item) => item.donViId === donViId && item.vatTuThietBi[0].vatTuId == vatTuId);
    this.editVatTuCache[donViId + '-' + vatTuId] = {
      data: { ...this.dataVatTu[index] },
      edit: false,
    };
  }

  saveEditVatTu(donViId: number, vatTuId: number): void {
    const index = this.dataVatTu.findIndex((item) => item.donViId === donViId && item.vatTuThietBi[0].vatTuId == vatTuId);
    Object.assign(this.dataVatTu[index], this.editVatTuCache[donViId + '-' + vatTuId].data);
    this.editVatTuCache[donViId + '-' + vatTuId].edit = false;
    this.updateDataVatTu();
    this.loadData();
  }

  deleteRowVatTu(data: any) {
    this.dieuChinhThongTinChiTieuKHNam.khVatTu =
      this.dieuChinhThongTinChiTieuKHNam.khVatTu.filter(
        (x) => x.donViId != data.donViId && x.vatTuThietBi[0].vatTuId != data.vatTuThietBi[0].vatTuId,
      );
    this.loadData();
  }

  editRowVatTu(donViId: number, vatTuId: number) {
    this.editVatTuCache[donViId + '-' + vatTuId].edit = true;
  }

  themMoiKHVatTu() {
    if (!this.dataVatTu) {
      this.dataVatTu = [];
    }
    this.checkDataExistVatTu(this.keHoachVatTuCreate);
    this.updateDataVatTu();
    this.loadData();
    this.loadDefaultVatTuNew();
  }

  loadDefaultVatTuNew() {
    this.keHoachVatTuCreate = new KeHoachVatTu();
    let temp = [
      new ItemDetail(0),
      new ItemDetail(0),
      new ItemDetail(0),
    ]
    this.keHoachVatTuCreate.vatTuThietBi[0].cacNamTruoc = cloneDeep(temp);
    this.keHoachVatTuCreate.vatTuThietBi[0].sdcCacNamTruoc = cloneDeep(temp);
    this.keHoachVatTuCreate.vatTuThietBi[0].tdcCacNamTruoc = cloneDeep(temp);
    this.keHoachVatTuCreate.vatTuThietBi[0].sdcTongCacNamTruoc = 0;
    this.keHoachVatTuCreate.vatTuThietBi[0].sdcTongNhap = 0;
  }

  updateEditMuoiCache(): void {
    if (this.dataMuoi && this.dataMuoi.length > 0) {
      this.dataMuoi.forEach((item) => {
        this.editMuoiCache[item.donViId] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  cancelEditMuoi(donViId: number): void {
    const index = this.dataMuoi.findIndex((item) => item.donViId === donViId);
    this.editMuoiCache[donViId] = {
      data: { ...this.dataMuoi[index] },
      edit: false,
    };
  }

  saveEditMuoi(donViId: number): void {
    const index = this.dataMuoi.findIndex((item) => item.donViId === donViId);
    this.editMuoiCache[donViId].data.thanhTien =
      (this.editMuoiCache[donViId].data.soLuong ?? 0) *
      (this.editMuoiCache[donViId].data.donGia ?? 0);
    Object.assign(this.dataMuoi[index], this.editMuoiCache[donViId].data);
    this.editMuoiCache[donViId].edit = false;
  }

  deleteRowMuoi(data: any) {
    this.dieuChinhThongTinChiTieuKHNam.khMuoi =
      this.dieuChinhThongTinChiTieuKHNam.khMuoi.filter(
        (x) => x.donViId != data.donViId,
      );
    this.loadData();
  }

  editRowMuoi(donViId: number) {
    this.editMuoiCache[donViId].edit = true;
  }

  themMoiKHMuoi() {
    if (!this.dataMuoi) {
      this.dataMuoi = [];
    }
    this.checkDataExistMuoi(this.keHoachMuoiCreate);
    this.loadDefaultMuoiNew();
  }

  loadDefaultMuoiNew() {
    this.keHoachMuoiCreate = new KeHoachMuoi();
    let tkdnMuoi: Array<ItemDetail> = [
      {
        nam: this.yearNow - 1,
        soLuong: 0,
        vatTuId: this.thocIdDefault,
        id: 0,
      },
      {
        nam: this.yearNow - 2,
        soLuong: 0,
        vatTuId: this.thocIdDefault,
        id: 0,
      },
      {
        nam: this.yearNow - 3,
        soLuong: 0,
        vatTuId: this.thocIdDefault,
        id: 0,
      },
    ];
    this.keHoachMuoiCreate.tkdnMuoi = cloneDeep(tkdnMuoi);
    this.keHoachMuoiCreate.xtnMuoi = cloneDeep(tkdnMuoi);
    this.keHoachMuoiCreate.tdcXtnMuoi = cloneDeep(tkdnMuoi);
    this.keHoachMuoiCreate.dcXtnMuoi = cloneDeep(tkdnMuoi);
    this.keHoachMuoiCreate.sdcXtnMuoi = cloneDeep(tkdnMuoi);
  }

  updateEditLuongThucCache(): void {
    if (this.dataLuongThuc && this.dataLuongThuc.length > 0) {
      this.dataLuongThuc.forEach((item) => {
        this.editLuongThucCache[item.donViId] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  cancelEditLuongThuc(donViId: number): void {
    const index = this.dataLuongThuc.findIndex(
      (item) => item.donViId === donViId,
    );
    this.editLuongThucCache[donViId] = {
      data: { ...this.dataLuongThuc[index] },
      edit: false,
    };
  }

  saveEditLuongThuc(donViId: number): void {
    const index = this.dataLuongThuc.findIndex(
      (item) => item.donViId === donViId,
    );
    this.editLuongThucCache[donViId].data.thanhTien =
      (this.editLuongThucCache[donViId].data.soLuong ?? 0) *
      (this.editLuongThucCache[donViId].data.donGia ?? 0);
    Object.assign(
      this.dataLuongThuc[index],
      this.editLuongThucCache[donViId].data,
    );
    this.editLuongThucCache[donViId].edit = false;
  }

  deleteRowLuongThuc(data: any) {
    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc =
      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.filter(
        (x) => x.donViId != data.donViId,
      );
    this.loadData();
  }

  editRowLuongThuc(donViId: number) {
    this.editLuongThucCache[donViId].edit = true;
  }

  themMoiKHLT() {
    if (!this.dataLuongThuc) {
      this.dataLuongThuc = [];
    }
    this.checkDataExistLuongThuc(this.keHoachLuongThucCreate);
    this.loadDefaultLuongThucNew();
  }

  loadDefaultLuongThucNew() {
    this.keHoachLuongThucCreate = new KeHoachLuongThuc();
    let tkdnThoc: Array<ItemDetail> = [
      {
        nam: this.yearNow - 1,
        soLuong: 0,
        vatTuId: this.thocIdDefault,
        id: 0,
      },
      {
        nam: this.yearNow - 2,
        soLuong: 0,
        vatTuId: this.thocIdDefault,
        id: 0,
      },
      {
        nam: this.yearNow - 3,
        soLuong: 0,
        vatTuId: this.thocIdDefault,
        id: 0,
      },
    ];
    let tkdnGao: Array<ItemDetail> = [
      {
        nam: this.yearNow - 1,
        soLuong: 0,
        vatTuId: this.thocIdDefault,
        id: 0,
      },
      {
        nam: this.yearNow - 2,
        soLuong: 0,
        vatTuId: this.thocIdDefault,
        id: 0,
      },
    ];
    this.keHoachLuongThucCreate.tkdnThoc = cloneDeep(tkdnThoc);
    this.keHoachLuongThucCreate.tkdnGao = cloneDeep(tkdnGao);

    this.keHoachLuongThucCreate.tdcXtnThoc = cloneDeep(tkdnThoc);
    this.keHoachLuongThucCreate.tdcXtnGao = cloneDeep(tkdnGao);

    this.keHoachLuongThucCreate.xtnThoc = cloneDeep(tkdnThoc);
    this.keHoachLuongThucCreate.xtnGao = cloneDeep(tkdnGao);

    this.keHoachLuongThucCreate.dcXtnThoc = cloneDeep(tkdnThoc);
    this.keHoachLuongThucCreate.dcXtnGao = cloneDeep(tkdnGao);

    this.keHoachLuongThucCreate.sdcXtnThoc = cloneDeep(tkdnThoc);
    this.keHoachLuongThucCreate.sdcXtnGao = cloneDeep(tkdnGao);
  }

  selectDataMultipleTag(data: any) { }

  deleteDataMultipleTag(data: any) {
    this.dataTag = this.dataTag.filter((x) => x.id != data.id);
  }

  caculatorXuatThocSauDc() { }

  caculatorXuatGaoSauDc() { }

  caculatorXuatTongQuyThocSauDc() { }

  async selectDonViKHLT(donVi) {
    this.spinner.show();
    try {
      this.isAddLuongThuc = true;
      this.keHoachLuongThucCreate.maDonVi = donVi.maDvi;
      this.keHoachLuongThucCreate.tenDonvi = donVi.tenDvi;
      this.keHoachLuongThucCreate.donViId = donVi.id;

      let body = {
        donViId: this.keHoachLuongThucCreate.donViId,
        ctkhnId: this.selectedCanCu.id,
        vatTuIds: [this.thocIdDefault, this.gaoIdDefault],
      };

      let data =
        await this.quyetDinhDieuChinhChiTieuKeHoachNamService.soLuongTruocDieuChinh(
          body,
        );
      if (data && data.msg == MESSAGE.SUCCESS) {
        if (
          data.data &&
          data.data.tonKhoDauNam &&
          data.data.tonKhoDauNam.length > 0
        ) {
          data.data.tonKhoDauNam.forEach((tonKho) => {
            if (tonKho.vatTuId == this.thocIdDefault) {
              switch (tonKho.nam) {
                case this.yearNow - 1:
                  this.keHoachLuongThucCreate.tkdnThoc[0].soLuong =
                    tonKho.soLuong;
                  break;
                case this.yearNow - 2:
                  this.keHoachLuongThucCreate.tkdnThoc[1].soLuong =
                    tonKho.soLuong;
                  break;
                case this.yearNow - 3:
                  this.keHoachLuongThucCreate.tkdnThoc[2].soLuong =
                    tonKho.soLuong;
                  break;
                default:
                  break;
              }
            } else if (tonKho.vatTuId == this.gaoIdDefault) {
              switch (tonKho.nam) {
                case this.yearNow - 1:
                  this.keHoachLuongThucCreate.tkdnGao[0].soLuong =
                    tonKho.soLuong;
                  break;
                case this.yearNow - 2:
                  this.keHoachLuongThucCreate.tkdnGao[1].soLuong =
                    tonKho.soLuong;
                  break;
                default:
                  break;
              }
            }
          });
        }
        if (
          data.data &&
          data.data.nhapTrongNam &&
          data.data.nhapTrongNam.length > 0
        ) {
          data.data.nhapTrongNam.forEach((tonKho) => {
            if (tonKho.vatTuId == this.thocIdDefault) {
              this.keHoachLuongThucCreate.ntnThoc = tonKho.soLuong;
            } else if (tonKho.vatTuId == this.gaoIdDefault) {
              this.keHoachLuongThucCreate.ntnGao = tonKho.soLuong;
            }
          });
        }
        if (
          data.data &&
          data.data.xuatTrongNam &&
          data.data.xuatTrongNam.length > 0
        ) {
          data.data.xuatTrongNam.forEach((tonKho) => {
            if (tonKho.vatTuId == this.thocIdDefault) {
              switch (tonKho.nam) {
                case this.yearNow - 1:
                  this.keHoachLuongThucCreate.xtnThoc[0].soLuong =
                    tonKho.soLuong;
                  break;
                case this.yearNow - 2:
                  this.keHoachLuongThucCreate.xtnThoc[1].soLuong =
                    tonKho.soLuong;
                  break;
                case this.yearNow - 3:
                  this.keHoachLuongThucCreate.xtnThoc[2].soLuong =
                    tonKho.soLuong;
                  break;
                default:
                  break;
              }
            } else if (tonKho.vatTuId == this.gaoIdDefault) {
              switch (tonKho.nam) {
                case this.yearNow - 1:
                  this.keHoachLuongThucCreate.xtnGao[0].soLuong =
                    tonKho.soLuong;
                  break;
                case this.yearNow - 2:
                  this.keHoachLuongThucCreate.xtnGao[1].soLuong =
                    tonKho.soLuong;
                  break;
                default:
                  break;
              }
            }
          });
        }
      } else {
        this.notification.error(MESSAGE.ERROR, data.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async selectDonViKHMuoi(donVi) {
    this.spinner.show();
    try {
      this.isAddLuongThuc = true;
      this.keHoachMuoiCreate.maDonVi = donVi.maDvi;
      this.keHoachMuoiCreate.tenDonvi = donVi.tenDvi;
      this.keHoachMuoiCreate.donViId = donVi.id;

      let body = {
        donViId: this.keHoachMuoiCreate.donViId,
        ctkhnId: this.selectedCanCu.id,
        vatTuIds: [this.muoiIdDefault],
      };

      let data =
        await this.quyetDinhDieuChinhChiTieuKeHoachNamService.soLuongTruocDieuChinh(
          body,
        );
      if (data && data.msg == MESSAGE.SUCCESS) {
        if (
          data.data &&
          data.data.tonKhoDauNam &&
          data.data.tonKhoDauNam.length > 0
        ) {
          data.data.tonKhoDauNam.forEach((tonKho) => {
            if (tonKho.vatTuId == this.muoiIdDefault) {
              switch (tonKho.nam) {
                case this.yearNow - 1:
                  this.keHoachMuoiCreate.tkdnMuoi[0].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 2:
                  this.keHoachMuoiCreate.tkdnMuoi[1].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 3:
                  this.keHoachMuoiCreate.tkdnMuoi[2].soLuong = tonKho.soLuong;
                  break;
                default:
                  break;
              }
            }
          });
        }
        if (
          data.data &&
          data.data.nhapTrongNam &&
          data.data.nhapTrongNam.length > 0
        ) {
          data.data.nhapTrongNam.forEach((tonKho) => {
            if (tonKho.vatTuId == this.muoiIdDefault) {
              this.keHoachMuoiCreate.ntnTongSoMuoi = tonKho.soLuong;
            }
          });
        }
        if (
          data.data &&
          data.data.xuatTrongNam &&
          data.data.xuatTrongNam.length > 0
        ) {
          data.data.xuatTrongNam.forEach((tonKho) => {
            if (tonKho.vatTuId == this.muoiIdDefault) {
              switch (tonKho.nam) {
                case this.yearNow - 1:
                  this.keHoachMuoiCreate.xtnMuoi[0].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 2:
                  this.keHoachMuoiCreate.xtnMuoi[1].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 3:
                  this.keHoachMuoiCreate.xtnMuoi[2].soLuong = tonKho.soLuong;
                  break;
                default:
                  break;
              }
            }
          });
        }
      } else {
        this.notification.error(MESSAGE.ERROR, data.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async selectDonViVatTu(donVi) {

  }

  onInput(e: Event, data: string): void {
    switch (data) {
      case 'luong-thuc':
        this.isAddLuongThuc = false;
        break;
      case 'muoi':
        this.isAddMuoi = false;
        break;
      case 'vat-tu':
        this.isAddVatTu = false;
        break;
      default:
        break;
    }
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.options = cloneDeep(this.optionsDonVi);
    } else {
      this.options = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  onInputTenHang(e: Event): void {
    this.isAddVatTu = false;
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.dataVatTuChaShow = cloneDeep(this.dataVatTuCha);
      this.keHoachVatTuCreate.maHang = '';
      this.keHoachVatTuCreate.kyHieu = '';
      this.keHoachVatTuCreate.chungLoaiHang = '';
      this.keHoachVatTuCreate.donViTinh = '';
      this.dataVatTuConClone = cloneDeep(this.dataVatTuCon);
      this.dataVatTuConShow = cloneDeep(this.dataVatTuCon);
    } else {
      this.dataVatTuChaShow = this.dataVatTuCha.filter(
        (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  onInputChungLoaiHang(e: Event): void {
    this.isAddVatTu = false;
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.dataVatTuConShow = cloneDeep(this.dataVatTuConClone);
      this.keHoachVatTuCreate.donViTinh = '';
    } else {
      this.dataVatTuConShow = this.dataVatTuConClone.filter(
        (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  selectTenHang(vatTu) {
    if (this.keHoachVatTuCreate.maDonVi) {
      this.isAddVatTu = true;
    }
    this.dataVatTuConClone = vatTu.child;
    this.dataVatTuConShow = cloneDeep(this.dataVatTuConClone);

    this.keHoachVatTuCreate.kyHieu = vatTu.kyHieu;
    this.keHoachVatTuCreate.donViTinh = vatTu.donViTinh;
    this.keHoachVatTuCreate.vatTuThietBi[0].maVatTuCha = vatTu.maHang;
    this.keHoachVatTuCreate.vatTuThietBi[0].vatTuChaId = vatTu.id;

    this.keHoachVatTuCreate.vatTuThietBi[0].donViTinh = vatTu.donViTinh;
    this.keHoachVatTuCreate.vatTuThietBi[0].maVatTu = '';
    this.keHoachVatTuCreate.vatTuThietBi[0].vatTuId = 0;
    this.keHoachVatTuCreate.chungLoaiHang = '';

    if (this.keHoachVatTuCreate.maDonVi) {

    }
  }

  selectChungLoaiHang(chungLoaiHang) {
    if (this.keHoachVatTuCreate.maDonVi) {
      this.isAddVatTu = true;
    }
    this.keHoachVatTuCreate.vatTuThietBi[0].donViTinh = chungLoaiHang.donViTinh;
    this.keHoachVatTuCreate.vatTuThietBi[0].maVatTu = chungLoaiHang.maHang;
    this.keHoachVatTuCreate.vatTuThietBi[0].vatTuId = chungLoaiHang.id;
    const vatTuChaFilter = this.dataVatTuCha.find(
      (vaTuCha) => vaTuCha.id === chungLoaiHang.idParent,
    );
    if (vatTuChaFilter) {
      this.keHoachVatTuCreate.kyHieu = vatTuChaFilter.kyHieu;
      this.keHoachVatTuCreate.donViTinh = vatTuChaFilter.donViTinh;
      this.keHoachVatTuCreate.vatTuThietBi[0].maVatTuCha = vatTuChaFilter.maHang;
      this.keHoachVatTuCreate.tenHang = vatTuChaFilter.ten;
    } else {
      this.keHoachVatTuCreate.kyHieu = chungLoaiHang.kyHieu;
      this.keHoachVatTuCreate.donViTinh = chungLoaiHang.donViTinh;
      this.keHoachVatTuCreate.vatTuThietBi[0].maVatTuCha = chungLoaiHang.maHang;
      this.keHoachVatTuCreate.tenHang = '';
    }
  }

  async loadDonVi() {
    try {
      const res = await this.donViService.layTatCaDonVi();
      this.optionsDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
          };
          this.optionsDonVi.push(item);
        }
        this.options = cloneDeep(this.optionsDonVi);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  async loadDanhMucHang() {
    let res = await this.danhMucService.loadDanhMucHangGiaoChiTieu();
    let data = res.data;
    for (let i = 0; i < data.length; i++) {
      if (data[i].cap == 2) {
        let child = [];
        if (data[i].child && data[i].child.length > 0) {
          for (let j = 0; j < data[i].child.length; j++) {
            let itemChild = {
              id: data[i].child[j].id,
              ten: data[i].child[j].ten,
              idParent: data[i].id,
              tenParent: data[i].ten,
              donViTinh: data[i].child[j].maDviTinh,
              maHang: data[i].child[j].ma,
              kyHieu: data[i].kyHieu,
            };
            child.push(itemChild);
            this.dataVatTuCon.push(itemChild);
          }
        }
        let item = {
          id: data[i].id,
          ten: data[i].ten,
          child: child,
          maHang: data[i].ma,
          kyHieu: data[i].kyHieu,
          donViTinh: data[i].maDviTinh,
        };
        this.dataVatTuCha.push(item);
      } else if (data[i].cap == 3) {
        let itemCon = {
          id: data[i].id,
          ten: data[i].ten,
          idParent: 0,
          tenParent: '',
          donViTinh: data[i].maDviTinh,
          maHang: data[i].ma,
          kyHieu: data[i].kyHieu,
        };
        this.dataVatTuCon.push(itemCon);
      }
    }
    this.dataVatTuConClone = cloneDeep(this.dataVatTuCon);
    this.dataVatTuChaShow = cloneDeep(this.dataVatTuCha);
    this.dataVatTuConShow = cloneDeep(this.dataVatTuCon);
  }

  selectNam() {
    this.yearNow = this.formData.get('namKeHoach').value;
  }

  updateDataListVatTu(data: any) {
    if (data && data.length > 0) {
      for (let j = 0; j < data.length; j++) {
        let res = [];
        let parentList = data[j].vatTuThietBi.filter(
          (x) => x.maVatTuCha == null,
        );
        for (let i = 0; i < parentList.length; i++) {
          let tempt = [];
          let hasChild = false;
          let checkChild = data[j].vatTuThietBi.filter(
            (x) => x.maVatTuCha == parentList[i].maVatTu,
          );
          if (checkChild && checkChild.length > 0) {
            hasChild = true;
          }
          let item = {
            ...parentList[i],
            level: 0,
            hasChild: hasChild,
            expand: false,
            display: true,
          };
          tempt.push(item);
          let dataChild = this.updateDataChaCon(
            data[j].vatTuThietBi,
            item,
            tempt,
          );
          res = [...res, ...dataChild];
        }
        data[j].listDisplay = [];
        if (res && res.length > 0) {
          data[j].listDisplay = res;
        }
      }
    }
    return data;
  }

  updateDataChaCon(dataList: any, dataCha: any, dataReturn: any) {
    let listChild = dataList.filter((x) => x.maVatTuCha == dataCha.maVatTu);
    for (let i = 0; i < listChild.length; i++) {
      let hasChild = false;
      let checkChild = dataList.filter(
        (x) => x.maVatTuCha == listChild[i].maVatTu,
      );
      if (checkChild && checkChild.length > 0) {
        hasChild = true;
      }
      let item = {
        ...listChild[i],
        level: dataCha.level + 1,
        hasChild: hasChild,
        expand: false,
        display: dataCha.level + 1 == 1 ? true : false,
      };
      dataReturn.push(item);
      this.updateDataChaCon(dataList, item, dataReturn);
    }
    return dataReturn;
  }

  displayChildTong(item: any, listCha: any, expand: boolean) {
    for (
      let i = 0;
      i < this.dieuChinhThongTinChiTieuKHNam.qd.khVatTu.length;
      i++
    ) {
      if (
        this.dieuChinhThongTinChiTieuKHNam.qd.khVatTu[i].donViId ==
        listCha.donViId
      ) {
        for (
          let j = 0;
          j <
          this.dieuChinhThongTinChiTieuKHNam.qd.khVatTu[i].listDisplay.length;
          j++
        ) {
          if (
            this.dieuChinhThongTinChiTieuKHNam.qd.khVatTu[i].listDisplay[j]
              .maVatTu == item.maVatTu
          ) {
            this.dieuChinhThongTinChiTieuKHNam.qd.khVatTu[i].listDisplay[
              j
            ].expand = expand;
          }
          if (
            this.dieuChinhThongTinChiTieuKHNam.qd.khVatTu[i].listDisplay[j]
              .maVatTuCha == item.maVatTu
          ) {
            this.dieuChinhThongTinChiTieuKHNam.qd.khVatTu[i].listDisplay[
              j
            ].display = expand;
          }
        }
        if (!expand) {
          this.dieuChinhThongTinChiTieuKHNam.qd.khVatTu[i].listDisplay =
            this.updateHideDisplayChild(
              item,
              this.dieuChinhThongTinChiTieuKHNam.qd.khVatTu[i].listDisplay,
            );
        }
        break;
      }
    }
  }

  displayChildDieuChinh(item: any, listCha: any, expand: boolean) {
    for (
      let i = 0;
      i < this.dieuChinhThongTinChiTieuKHNam.khVatTu.length;
      i++
    ) {
      if (
        this.dieuChinhThongTinChiTieuKHNam.khVatTu[i].donViId ==
        listCha.donViId
      ) {
        for (
          let j = 0;
          j <
          this.dieuChinhThongTinChiTieuKHNam.khVatTu[i].listDisplay.length;
          j++
        ) {
          if (
            this.dieuChinhThongTinChiTieuKHNam.khVatTu[i].listDisplay[j]
              .maVatTu == item.maVatTu
          ) {
            this.dieuChinhThongTinChiTieuKHNam.khVatTu[i].listDisplay[
              j
            ].expand = expand;
          }
          if (
            this.dieuChinhThongTinChiTieuKHNam.khVatTu[i].listDisplay[j]
              .maVatTuCha == item.maVatTu
          ) {
            this.dieuChinhThongTinChiTieuKHNam.khVatTu[i].listDisplay[
              j
            ].display = expand;
          }
        }
        if (!expand) {
          this.dieuChinhThongTinChiTieuKHNam.qd.khVatTu[i].listDisplay =
            this.updateHideDisplayChild(
              item,
              this.dieuChinhThongTinChiTieuKHNam.qd.khVatTu[i].listDisplay,
            );
        }
        break;
      }
    }
  }

  updateHideDisplayChild(itemCha: any, dataReturn: any) {
    for (let i = 0; i < dataReturn.length; i++) {
      if (dataReturn[i].maVatTuCha == itemCha.maVatTu) {
        dataReturn[i].display = false;
        dataReturn[i].expand = false;
        this.updateHideDisplayChild(dataReturn[i], dataReturn);
      }
    }
    return dataReturn;
  }

  async loadDataChiTiet(id: number) {
    this.dieuChinhThongTinChiTieuKHNam.qd = new QuyetDinhChiTieuKHNam();
    this.dieuChinhThongTinChiTieuKHNam.qdDc = new QuyetDinhChiTieuKHNam();
    this.dieuChinhThongTinChiTieuKHNam.qd.khLuongThuc = [];
    this.dieuChinhThongTinChiTieuKHNam.qd.khMuoi = [];
    this.dieuChinhThongTinChiTieuKHNam.qd.khVatTu = [];
    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc = [];
    this.dieuChinhThongTinChiTieuKHNam.khMuoi = [];
    this.dieuChinhThongTinChiTieuKHNam.khVatTu = [];
    this.formData = this.fb.group({
      canCu: [null],
      soQD: [null, [Validators.required]],
      ngayKy: [null, [Validators.required]],
      ngayHieuLuc: [null, [Validators.required]],
      namKeHoach: [this.yearNow, [Validators.required]],
      trichYeu: [null],
      ghiChu: [null, [Validators.required]],
    });
    if (id > 0) {
      let res = await this.quyetDinhDieuChinhChiTieuKeHoachNamService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.dieuChinhThongTinChiTieuKHNam = res.data;

          this.selectedCanCu.id = this.dieuChinhThongTinChiTieuKHNam.qdGocId;
          this.selectedCanCu.soQuyetDinh = this.dieuChinhThongTinChiTieuKHNam.soQuyetDinh;

          this.dataGiaoChiTieu = [];
          let item = {
            id: this.selectedCanCu.id,
            text: this.selectedCanCu.soQuyetDinh,
          };
          this.dataGiaoChiTieu.push(item);

          this.trangThai = this.dieuChinhThongTinChiTieuKHNam.tenTrangThai;

          this.formData.controls['canCu'].setValue(
            this.selectedCanCu ? this.selectedCanCu.soQuyetDinh : '',
          );
          this.formData.controls['soQD'].setValue(
            this.dieuChinhThongTinChiTieuKHNam.soQuyetDinh.split('/')[0],
          );
          this.formData.controls['ngayKy'].setValue(
            this.dieuChinhThongTinChiTieuKHNam.ngayKy,
          );
          this.formData.controls['ngayHieuLuc'].setValue(
            this.dieuChinhThongTinChiTieuKHNam.ngayHieuLuc,
          );
          this.formData.controls['namKeHoach'].setValue(
            this.dieuChinhThongTinChiTieuKHNam.namKeHoach,
          );
          this.formData.controls['trichYeu'].setValue(
            this.dieuChinhThongTinChiTieuKHNam.trichYeu,
          );
          this.formData.controls['ghiChu'].setValue(
            this.dieuChinhThongTinChiTieuKHNam.ghiChu,
          );

          this.updateDataVatTu();
          this.loadData();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  ngAfterViewChecked(): void {
    const table = document.getElementsByTagName('table');
    this.tableExist = table && table.length > 0 ? true : false;
    this.cdr.detectChanges();
  }

  themMoi(data?: any) {
    if (this.tabSelected == TAB_SELECTED.luongThuc) {
      const modalLuongThuc = this.modal.create({
        nzTitle: 'Thông tin lương thực',
        nzContent: DialogDieuChinhThemThongTinLuongThucComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          data: data,
          yearNow: this.yearNow,
          qdGocId: this.dieuChinhThongTinChiTieuKHNam.qd.id,
        },
      });
      modalLuongThuc.afterClose.subscribe((res) => {
        if (res) {
          this.checkDataExistLuongThuc(res);
        }
      });
    } else if (this.tabSelected == TAB_SELECTED.vatTu) {
      const modalVatTu = this.modal.create({
        nzTitle: 'Thông tin vật tư trong năm',
        nzContent: DialogDieuChinhThemThongTinVatTuComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          data: data,
          yearNow: this.yearNow,
          qdGocId: this.dieuChinhThongTinChiTieuKHNam.qd.id,
        },
      });
      modalVatTu.afterClose.subscribe((res) => {
        if (res) {
          this.checkDataExistVatTu(res);
          this.dieuChinhThongTinChiTieuKHNam.khVatTu =
            this.updateDataListVatTu(
              this.dieuChinhThongTinChiTieuKHNam.khVatTu,
            );
          this.loadData();
        }
      });
    } else if (this.tabSelected == TAB_SELECTED.muoi) {
      const modalMuoi = this.modal.create({
        nzTitle: 'Thông tin muối',
        nzContent: DialogDieuChinhThemThongTinMuoiComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          data: data,
          yearNow: this.yearNow,
          qdGocId: this.dieuChinhThongTinChiTieuKHNam.qd.id,
        },
      });
      modalMuoi.afterClose.subscribe((res) => {
        if (res) {
          this.checkDataExistMuoi(res);
        }
      });
    }
  }

  redirectChiTieuKeHoachNam() {
    this.router.navigate([
      '/kehoach/dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc',
    ]);
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.formData.controls['ngayHieuLuc'].value) {
      return false;
    }
    return (
      startValue.getTime() >
      this.formData.controls['ngayHieuLuc'].value.getTime()
    );
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.formData.controls['ngayKy'].value) {
      return false;
    }
    return (
      endValue.getTime() <= this.formData.controls['ngayKy'].value.getTime()
    );
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }

  openDialogQuyetDinhGiaoChiTieu() {
    if (this.id == 0) {
      const modalQD = this.modal.create({
        nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
        nzContent: DialogQuyetDinhGiaoChiTieuComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {},
      });
      modalQD.afterClose.subscribe((data) => {
        if (data) {
          this.spinner.show();
          this.formData.controls['canCu'].setValue(data.soQuyetDinh);
          this.selectedCanCu = data;
          this.dataGiaoChiTieu = [];
          let item = {
            id: data.id,
            text: data.soQuyetDinh,
          };
          this.dataGiaoChiTieu.push(item);
          this.chiTieuKeHoachNamCapTongCucService
            .loadThongTinChiTieuKeHoachNam(this.selectedCanCu.id)
            .then((res) => {
              if (res.msg == MESSAGE.SUCCESS) {
                let tempData = res.data;
                this.formData.controls['namKeHoach'].setValue(
                  tempData.namKeHoach,
                );

                this.dieuChinhThongTinChiTieuKHNam.qdGocId = tempData.id;
                this.dieuChinhThongTinChiTieuKHNam.khLuongThuc = cloneDeep(
                  tempData.khLuongThuc,
                );
                if (
                  this.dieuChinhThongTinChiTieuKHNam.khLuongThuc &&
                  this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.length > 0
                ) {
                  for (
                    let i = 0;
                    i <
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.length;
                    i++
                  ) {
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].id =
                      null;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                    ].khGaoId = null;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                    ].khThocId = null;
                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                        .xtnGao &&
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                        .xtnGao.length > 0
                    ) {
                      for (
                        let j = 0;
                        j <
                        this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                          .xtnGao.length;
                        j++
                      ) {
                        this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                          i
                        ].xtnGao[j].id = null;
                      }
                    }
                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                        .xtnThoc &&
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                        .xtnThoc.length > 0
                    ) {
                      for (
                        let j = 0;
                        j <
                        this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                          .xtnThoc.length;
                        j++
                      ) {
                        this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                          i
                        ].xtnThoc[j].id = null;
                      }
                    }
                  }
                }

                this.dieuChinhThongTinChiTieuKHNam.khMuoi = cloneDeep(
                  tempData.khMuoiDuTru,
                );
                if (
                  this.dieuChinhThongTinChiTieuKHNam.khMuoi &&
                  this.dieuChinhThongTinChiTieuKHNam.khMuoi.length > 0
                ) {
                  for (
                    let i = 0;
                    i < this.dieuChinhThongTinChiTieuKHNam.khMuoi.length;
                    i++
                  ) {
                    this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].id = null;
                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[i]
                        .xtnMuoi &&
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].xtnMuoi
                        .length > 0
                    ) {
                      for (
                        let j = 0;
                        j <
                        this.dieuChinhThongTinChiTieuKHNam.khMuoi[i]
                          .xtnMuoi.length;
                        j++
                      ) {
                        this.dieuChinhThongTinChiTieuKHNam.khMuoi[
                          i
                        ].xtnMuoi[j].id = null;
                      }
                    }
                  }
                }

                this.dieuChinhThongTinChiTieuKHNam.khVatTu = cloneDeep(
                  tempData.khVatTu,
                );
                if (
                  this.dieuChinhThongTinChiTieuKHNam.khVatTu &&
                  this.dieuChinhThongTinChiTieuKHNam.khVatTu.length > 0
                ) {
                  for (
                    let i = 0;
                    i < this.dieuChinhThongTinChiTieuKHNam.khVatTu.length;
                    i++
                  ) {
                    this.dieuChinhThongTinChiTieuKHNam.khVatTu[i].id =
                      null;
                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khVatTu[i]
                        .vatTuThietBi &&
                      this.dieuChinhThongTinChiTieuKHNam.khVatTu[i]
                        .vatTuThietBi.length > 0
                    ) {
                      for (
                        let j = 0;
                        j <
                        this.dieuChinhThongTinChiTieuKHNam.khVatTu[i]
                          .vatTuThietBi.length;
                        j++
                      ) {
                        this.dieuChinhThongTinChiTieuKHNam.khVatTu[
                          i
                        ].vatTuThietBi[j].id = null;
                      }
                    }
                  }
                }

                this.updateDataVatTu();
                this.loadData();
              }
            });
          this.spinner.hide();
        }
      });
    }
  }

  reduceRowData(
    indexTable: number,
    indexCell: number,
    indexRow: number,
    stringReplace: string,
    idTable: string,
  ): number {
    let sumVal = 0;
    const listTable = document
      .getElementById(idTable)
      ?.getElementsByTagName('table');

    if (listTable && listTable.length >= indexTable) {
      const table = listTable[indexTable];
      for (let i = indexRow; i < table.rows.length - 1; i++) {
        if (
          table.rows[i]?.cells[indexCell]?.innerHTML &&
          table.rows[i]?.cells[indexCell]?.innerHTML != ''
        ) {
          sumVal =
            sumVal + (!isNaN(parseFloat(this.helperService.replaceAll(table.rows[i].cells[indexCell].innerHTML, stringReplace, '',),))
              ? parseFloat(this.helperService.replaceAll(table.rows[i].cells[indexCell].innerHTML, stringReplace, '',),) : 0);
        }
      }
    }
    return sumVal;
  }

  reduceRowDataVatTu(
    indexTable: number,
    indexCell: number,
    indexRow: number,
    stringReplace: string,
    idTable: string,
  ): number {
    let sumVal = 0;
    const listTable = document
      .getElementById(idTable)
      ?.getElementsByTagName('table');

    if (listTable && listTable.length >= indexTable) {
      const table = listTable[indexTable];

      for (let i = indexRow; i < table.rows.length - 1; i++) {
        if (
          table?.rows[i]?.className.includes('table__header-vat-tu') &&
          table.rows[i]?.cells[indexCell]?.innerHTML &&
          table.rows[i]?.cells[indexCell]?.innerHTML != ''
        ) {
          sumVal =
            sumVal +
            parseFloat(
              this.helperService.replaceAll(
                table.rows[i].cells[indexCell].innerHTML,
                stringReplace,
                '',
              ),
            );
        }
      }
    }
    return sumVal;
  }

  rowSpanVatTu(data: any): number {
    let rowspan = 1;
    if (data && data?.listDisplay && data?.listDisplay?.length > 0) {
      let getDisplay = data?.listDisplay.filter((x) => x.display == true);
      if (getDisplay && getDisplay.length > 0) {
        rowspan = getDisplay.length + 1;
      }
    }
    return rowspan;
  }

  selectFile(idElement: string) {
    document.getElementById(idElement).click();
  }

  deleteKeHoachLuongThuc(stt: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.dieuChinhThongTinChiTieuKHNam.khLuongThuc =
          this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.dieuChinhThongTinChiTieuKHNam.qdDc?.khLuongThuc.forEach(
          (lt, i) => {
            if (i >= stt - 1) {
              lt.stt = i + 1;
            }
          },
        );
      },
    });
  }

  deleteKeHoachMuoi(stt: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.dieuChinhThongTinChiTieuKHNam.khMuoi =
          this.dieuChinhThongTinChiTieuKHNam.khMuoi.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.dieuChinhThongTinChiTieuKHNam.qdDc?.khMuoi.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
      },
    });
  }

  exportData() {
    var workbook = XLSX.utils.book_new();
    const tableLuongThuc = document
      .getElementById('table-luong-thuc-tong-hop')
      .getElementsByTagName('table');
    if (tableLuongThuc && tableLuongThuc.length > 0) {
      let sheetLuongThuc = XLSX.utils.table_to_sheet(tableLuongThuc[0]);
      sheetLuongThuc['!cols'] = [];
      sheetLuongThuc['!cols'][24] = { hidden: true };
      XLSX.utils.book_append_sheet(workbook, sheetLuongThuc, 'sheetLuongThuc');
    }
    const tableMuoi = document
      .getElementById('table-muoi-tong-hop')
      .getElementsByTagName('table');
    if (tableMuoi && tableMuoi.length > 0) {
      let sheetMuoi = XLSX.utils.table_to_sheet(tableMuoi[0]);
      sheetMuoi['!cols'] = [];
      sheetMuoi['!cols'][12] = { hidden: true };
      XLSX.utils.book_append_sheet(workbook, sheetMuoi, 'sheetMuoi');
    }
    const tableVatTu = document
      .getElementById('table-vat-tu-tong-hop')
      .getElementsByTagName('table');
    if (tableVatTu && tableVatTu.length > 0) {
      let sheetVatTu = XLSX.utils.table_to_sheet(tableVatTu[0]);
      XLSX.utils.book_append_sheet(workbook, sheetVatTu, 'sheetVatTu');
    }
    XLSX.writeFile(workbook, 'thong-tin-dieu-chinh-chi-tieu-ke-hoach-nam.xlsx');
  }

  async importFileData(event: any) {
    this.spinner.show();
    try {
      const element = event.currentTarget as HTMLInputElement;
      let fileList: FileList | null = element.files;
      if (fileList) {
        let res =
          await this.quyetDinhDieuChinhChiTieuKeHoachNamService.importFile(
            fileList[0],
          );
        if (res.msg == MESSAGE.SUCCESS) {
          let temptData = res.data;
          if (temptData) {
            if (temptData.khluongthuc && temptData.khluongthuc.length > 0) {
              for (let i = 0; i < temptData.khluongthuc.length; i++) {
                this.checkDataExistLuongThuc(temptData.khluongthuc[i]);
              }
            }
            if (temptData.khMuoi && temptData.khMuoi.length > 0) {
              for (let i = 0; i < temptData.khMuoi.length; i++) {
                this.checkDataExistMuoi(temptData.khMuoi[i]);
              }
            }
            if (temptData.khVatTu && temptData.khVatTu.length > 0) {
              for (let i = 0; i < temptData.khVatTu.length; i++) {
                this.checkDataExistVatTu(temptData.khVatTu[i]);
              }
              this.updateDataVatTu();
              this.loadData();
            }
          }
        }
      }
      element.value = null;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  checkDataExistLuongThuc(data: any) {
    if (this.dieuChinhThongTinChiTieuKHNam.khLuongThuc) {
      let indexExist =
        this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.findIndex(
          (x) => x.maDonVi == data.maDonVi,
        );
      if (indexExist != -1) {
        this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.splice(
          indexExist,
          1,
        );
      }
    } else {
      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc = [];
    }
    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc = [
      ...this.dieuChinhThongTinChiTieuKHNam.khLuongThuc,
      data,
    ];
    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.forEach((lt, i) => {
      lt.stt = i + 1;
    });
    this.loadData();
  }

  checkDataExistMuoi(data: any) {
    if (this.dieuChinhThongTinChiTieuKHNam.khMuoi) {
      let indexExist = this.dieuChinhThongTinChiTieuKHNam.khMuoi.findIndex(
        (x) => x.maDonVi == data.maDonVi,
      );
      if (indexExist != -1) {
        this.dieuChinhThongTinChiTieuKHNam.khMuoi.splice(indexExist, 1);
      }
    } else {
      this.dieuChinhThongTinChiTieuKHNam.khMuoi = [];
    }
    this.dieuChinhThongTinChiTieuKHNam.khMuoi = [
      ...this.dieuChinhThongTinChiTieuKHNam.khMuoi,
      data,
    ];
    this.dieuChinhThongTinChiTieuKHNam.khMuoi.forEach((lt, i) => {
      lt.stt = i + 1;
    });
    this.loadData();
  }

  checkDataExistVatTu(data: any) {
    if (this.dieuChinhThongTinChiTieuKHNam.khVatTu) {
      let indexExist = this.dieuChinhThongTinChiTieuKHNam.khVatTu.findIndex(
        (x) => x.maDonVi == data.maDonVi && x.vatTuThietBi[0].vatTuId == data.vatTuThietBi[0].vatTuId,
      );
      if (indexExist != -1) {
        this.dieuChinhThongTinChiTieuKHNam.khVatTu.splice(indexExist, 1);
      }
    } else {
      this.dieuChinhThongTinChiTieuKHNam.khVatTu = [];
    }
    this.dieuChinhThongTinChiTieuKHNam.khVatTu = [
      ...this.dieuChinhThongTinChiTieuKHNam.khVatTu,
      data,
    ];
    this.dieuChinhThongTinChiTieuKHNam.khVatTu.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  printTable() {
    const modalIn = this.modal.create({
      nzTitle: 'Lựa chọn in',
      nzContent: DialogLuaChonInComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '600px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalIn.afterClose.subscribe((res) => {
      if (res) {
        let WindowPrt = window.open(
          '',
          '',
          'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
        );
        let printContent = '';
        if (res.luongThuc) {
          printContent = printContent + '<div>';
          printContent =
            printContent +
            document.getElementById('table-luong-thuc-tong-hop').innerHTML;
          printContent = printContent + '</div>';
        }
        if (res.muoi) {
          printContent = printContent + '<div>';
          printContent =
            printContent +
            document.getElementById('table-muoi-tong-hop').innerHTML;
          printContent = printContent + '</div>';
        }
        if (res.vatTu) {
          printContent = printContent + '<div>';
          printContent =
            printContent +
            document.getElementById('table-vat-tu-tong-hop').innerHTML;
          printContent = printContent + '</div>';
        }
        WindowPrt.document.write(printContent);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();
      }
    });
  }

  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '01',
          };
          let res =
            await this.quyetDinhDieuChinhChiTieuKeHoachNamService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.redirectChiTieuKeHoachNam();
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

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '02',
          };
          let res =
            await this.quyetDinhDieuChinhChiTieuKeHoachNamService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.redirectChiTieuKeHoachNam();
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
            trangThai: '03',
          };
          let res =
            await this.quyetDinhDieuChinhChiTieuKeHoachNamService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.redirectChiTieuKeHoachNam();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.router.navigate([
          '/kehoach/dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc',
        ]);
      },
    });
  }

  async save(isGuiDuyet: boolean) {
    if (this.formData.valid) {
      this.spinner.show();
      try {
        this.dieuChinhThongTinChiTieuKHNam.id = this.id;
        this.dieuChinhThongTinChiTieuKHNam.soQuyetDinh =
          this.formData.get('soQD').value + this.qdTCDT;
        this.dieuChinhThongTinChiTieuKHNam.ngayKy =
          this.formData.get('ngayKy').value;
        this.dieuChinhThongTinChiTieuKHNam.ngayHieuLuc =
          this.formData.get('ngayHieuLuc').value;
        this.dieuChinhThongTinChiTieuKHNam.namKeHoach =
          this.formData.get('namKeHoach').value;
        this.dieuChinhThongTinChiTieuKHNam.trichYeu =
          this.formData.get('trichYeu').value;
        this.dieuChinhThongTinChiTieuKHNam.ghiChu =
          this.formData.get('ghiChu').value;
        let body = {
          qdDc: this.dieuChinhThongTinChiTieuKHNam.qdDc,
          qdGocId: this.dieuChinhThongTinChiTieuKHNam.qdGocId,
        };
        if (this.id > 0) {
          let res = await this.quyetDinhDieuChinhChiTieuKeHoachNamService.sua(
            body,
          );
          if (res.msg == MESSAGE.SUCCESS) {
            if (!isGuiDuyet) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.UPDATE_SUCCESS,
              );
              this.redirectChiTieuKeHoachNam();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } else {
          let res = await this.quyetDinhDieuChinhChiTieuKeHoachNamService.them(
            body,
          );
          if (res.msg == MESSAGE.SUCCESS) {
            if (!isGuiDuyet) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.redirectChiTieuKeHoachNam();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
  }

  downloadTemplate() {
    this.chiTieuKeHoachNamCapTongCucService.downloadFile().subscribe((blob) => {
      saveAs(blob, 'biểu mẫu nhập dữ liệu Lương thực.xlsx');
    });
  }

  async changePageIndex(event) {
    this.page = event;
    this.loadData();
  }

  async changePageSize(event) {
    this.pageSize = event;
    this.loadData();
  }

  loadData() {
    if (this.tabSelected == this.tab.luongThuc) {
      this.dataLuongThuc =
        this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.slice(
          this.pageSize * (this.page - 1),
          this.pageSize * this.page,
        );
      this.totalRecord =
        this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.length;
      this.updateDataLuongThuc();
      this.updateEditLuongThucCache();
    } else if (this.tabSelected == this.tab.muoi) {
      if (this.dieuChinhThongTinChiTieuKHNam.khMuoi) {
        this.dataMuoi = this.dieuChinhThongTinChiTieuKHNam.khMuoi.slice(
          this.pageSize * (this.page - 1),
          this.pageSize * this.page,
        );
        this.totalRecord = this.dieuChinhThongTinChiTieuKHNam.khMuoi.length;
      }
      else if (this.dieuChinhThongTinChiTieuKHNam.khMuoiDuTru) {
        this.dataMuoi = this.dieuChinhThongTinChiTieuKHNam.khMuoiDuTru.slice(
          this.pageSize * (this.page - 1),
          this.pageSize * this.page,
        );
        this.totalRecord = this.dieuChinhThongTinChiTieuKHNam.khMuoiDuTru.length;
      }
      this.updateDataMuoi();
      this.updateEditMuoiCache();
    } else if (this.tabSelected == this.tab.vatTu) {
      this.dataVatTu = this.dieuChinhThongTinChiTieuKHNam.khVatTu.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page,
      );
      this.totalRecord = this.dieuChinhThongTinChiTieuKHNam.khVatTu.length;
      this.updateDataVatTuLoad();
      this.updateEditVatTuCache();
    }
  }

  selectTabData(tabName: string) {
    this.tabSelected = tabName;
    this.loadData();
  }

  updateDataLuongThuc() {
    if (this.dataLuongThuc && this.dataLuongThuc.length > 0) {
      let tkdnThoc: Array<ItemDetail> = [
        {
          nam: this.yearNow - 1,
          soLuong: 0,
          vatTuId: this.thocIdDefault,
          id: 0,
        },
        {
          nam: this.yearNow - 2,
          soLuong: 0,
          vatTuId: this.thocIdDefault,
          id: 0,
        },
        {
          nam: this.yearNow - 3,
          soLuong: 0,
          vatTuId: this.thocIdDefault,
          id: 0,
        },
      ];
      let tkdnGao: Array<ItemDetail> = [
        {
          nam: this.yearNow - 1,
          soLuong: 0,
          vatTuId: this.thocIdDefault,
          id: 0,
        },
        {
          nam: this.yearNow - 2,
          soLuong: 0,
          vatTuId: this.thocIdDefault,
          id: 0,
        },
      ];
      this.dataLuongThuc.forEach((element) => {
        if (element) {
          if (!element.tkdnThoc) {
            element.tkdnThoc = cloneDeep(tkdnThoc);
          }
          if (!element.tkdnGao) {
            element.tkdnGao = cloneDeep(tkdnGao);
          }
          if (!element.xtnThoc) {
            element.xtnThoc = cloneDeep(tkdnThoc);
          }
          if (!element.xtnGao) {
            element.xtnGao = cloneDeep(tkdnGao);
          }
          if (!element.xtnThocDc) {
            element.xtnThocDc = cloneDeep(tkdnThoc);
          }
          if (!element.xtnGaoDc) {
            element.xtnGaoDc = cloneDeep(tkdnGao);
          }
        }
      });
    }
  }

  updateDataMuoi() {
    if (this.dataMuoi && this.dataMuoi.length > 0) {
      let tkdnMuoi: Array<ItemDetail> = [
        {
          nam: this.yearNow - 1,
          soLuong: 0,
          vatTuId: this.thocIdDefault,
          id: 0,
        },
        {
          nam: this.yearNow - 2,
          soLuong: 0,
          vatTuId: this.thocIdDefault,
          id: 0,
        },
        {
          nam: this.yearNow - 3,
          soLuong: 0,
          vatTuId: this.thocIdDefault,
          id: 0,
        },
      ];
      this.dataMuoi.forEach((element) => {
        if (element) {
          if (!element.tkdnMuoi) {
            element.tkdnMuoi = cloneDeep(tkdnMuoi);
          }
          if (!element.xtnMuoi) {
            element.xtnMuoi = cloneDeep(tkdnMuoi);
          }
          if (!element.xtnMuoiDc) {
            element.xtnMuoiDc = cloneDeep(tkdnMuoi);
          }
        }
      });
    }
  }

  updateDataVatTuLoad() {
    if (this.dataVatTu && this.dataVatTu.length > 0) {
      let temp = [
        new ItemDetail(0),
        new ItemDetail(0),
        new ItemDetail(0),
      ]
      this.dataVatTu.forEach((element) => {
        if (element) {
          if (!element.vatTuThietBi[0].cacNamTruoc) {
            element.vatTuThietBi[0].cacNamTruoc = cloneDeep(temp);
          }
          if (!element.vatTuThietBi[0].sdcCacNamTruoc) {
            element.vatTuThietBi[0].sdcCacNamTruoc = cloneDeep(temp);
          }
          if (!element.vatTuThietBi[0].tdcCacNamTruoc) {
            element.vatTuThietBi[0].tdcCacNamTruoc = cloneDeep(temp);
          }
        }
      });
    }
  }

  deleteTaiLieuDinhKemTag(data: any) {
    this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
      (x) => x.id !== data.id,
    );
  }

  openFile(event) {
    let item = {
      id: new Date().getTime(),
      text: event,
    };
    if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
      this.taiLieuDinhKemList.push(item);
    }
  }

  thongTinTrangThai(trangThai: string): string {
    if (trangThai === '00' || trangThai === '01' || trangThai === '03') {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === '02') {
      return 'da-ban-hanh';
    }
  }
}
