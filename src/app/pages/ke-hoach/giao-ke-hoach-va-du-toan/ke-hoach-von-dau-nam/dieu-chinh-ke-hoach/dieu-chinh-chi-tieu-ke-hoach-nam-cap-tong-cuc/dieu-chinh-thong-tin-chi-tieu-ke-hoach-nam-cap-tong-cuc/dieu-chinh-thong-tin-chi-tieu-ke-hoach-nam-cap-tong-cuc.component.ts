import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import * as dayjs from 'dayjs';
import {saveAs} from 'file-saver';
import {chain, cloneDeep} from 'lodash';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogDieuChinhThemThongTinLuongThucComponent
} from 'src/app/components/dialog/dialog-dieu-chinh-them-thong-tin-luong-thuc/dialog-dieu-chinh-them-thong-tin-luong-thuc.component';
import {
  DialogDieuChinhThemThongTinMuoiComponent
} from 'src/app/components/dialog/dialog-dieu-chinh-them-thong-tin-muoi/dialog-dieu-chinh-them-thong-tin-muoi.component';
import {
  DialogDieuChinhThemThongTinVatTuComponent
} from 'src/app/components/dialog/dialog-dieu-chinh-them-thong-tin-vat-tu/dialog-dieu-chinh-them-thong-tin-vat-tu.component';
import {DialogLuaChonInComponent} from 'src/app/components/dialog/dialog-lua-chon-in/dialog-lua-chon-in.component';
import {
  DialogQuyetDinhGiaoChiTieuComponent
} from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {
  DialogKhongBanHanhComponent
} from 'src/app/components/dialog/dialog-khong-ban-hanh/dialog-khong-ban-hanh.component';
import {LEVEL, LEVEL_USER, PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {ItemDetail} from 'src/app/models/itemDetail';
import {KeHoachLuongThuc} from 'src/app/models/KeHoachLuongThuc';
import {KeHoachMuoi} from 'src/app/models/KeHoachMuoi';
import {KeHoachVatTu, KeHoachVatTuCustom} from 'src/app/models/KeHoachVatTu';
import {QuyetDinhChiTieuKHNam} from 'src/app/models/QuyetDinhChiTieuKHNam';
import {UserLogin} from 'src/app/models/userlogin';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {DeXuatDieuChinhService} from 'src/app/services/deXuatDieuChinh.service';
import {DonviService} from 'src/app/services/donvi.service';
import {HelperService} from 'src/app/services/helper.service';
import {QuyetDinhDieuChinhChiTieuKeHoachNamService} from 'src/app/services/quyetDinhDieuChinhChiTieuKeHoachNam.service';
import {UploadFileService} from 'src/app/services/uploaFile.service';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {environment} from 'src/environments/environment';
import * as XLSX from 'xlsx';
import {TAB_SELECTED} from './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam.constant';
import {STATUS} from "../../../../../../../constants/status";

@Component({
  selector: 'app-dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl:
    './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: [
    './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss',
  ],
})
export class DieuChinhThongTinChiTieuKeHoachNamComponent implements OnInit {
  @Input() id: number;
  @Input() deXuatId: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

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
  tabSelected: string = '00';
  detail = {
    soQD: null,
    ngayKy: null,
    ngayHieuLuc: null,
    namKeHoach: dayjs().get('year'),
    trichYeu: null,
  };
  STATUS = STATUS;
  tab = TAB_SELECTED;
  listNam: any[] = [];
  yearNow: number = 0;
  startValue: Date | null = null;
  endValue: Date | null = null;
  formData: FormGroup;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  selectedCanCu: any = {};
  keHoachVatTuNhapCreate: KeHoachVatTuCustom = new KeHoachVatTuCustom();
  keHoachVatTuXuatCreate: KeHoachVatTuCustom = new KeHoachVatTuCustom();
  dieuChinhThongTinChiTieuKHNam: any = {};
  fileDinhKem: string = null;
  tableExist: boolean = false;
  dataVatTuNhap: any[] = [];
  dataVatTuXuat: any[] = [];
  expandSetVatTuNhap = new Set<string>();
  expandSetVatTuXuat = new Set<string>();
  dataVatTuNhapEdit: Array<KeHoachVatTuCustom> = [];
  dataVatTuXuatEdit: Array<KeHoachVatTuCustom> = [];
  dataVatTuConEditNhapShow: any[] = []
  dataVatTuConEditXuatShow: any[] = []
  sumTotalKhDuTruMuoi = {
    tonKhoDauNam: 0,
    nhapTrongNam: 0,
    xuatTrongNamMuoi: 0,
    tonKhoCuoiNam: 0,
  };
  qdTCDT: string = MESSAGE.QD_TCDT;
  userInfo: UserLogin;

  taiLieuDinhKemList: any[] = [];
  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-core/file/upload-attachment`;

  dataTag: any[] = [];

  dataGiaoChiTieu: any[] = [];
  dataDeXuat: any[] = [];
  dataDieuChinh: any[] = [];

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

  titleTable: string = '';
  namKeHoach: number = 0;

  constructor(
    private router: Router,
    private routerActive: ActivatedRoute,
    private fb: FormBuilder,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private quyetDinhDieuChinhChiTieuKeHoachNamService: QuyetDinhDieuChinhChiTieuKeHoachNamService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private deXuatDieuChinhService: DeXuatDieuChinhService,
    private danhMucService: DanhMucService,
    private helperService: HelperService,
    private cdr: ChangeDetectorRef,
    public globals: Globals,
    private donViService: DonviService,
    public userService: UserService,
    private uploadFileService: UploadFileService,
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.userInfo) {
        this.qdTCDT = this.userInfo.MA_QD;
      }
      if (this.userService.isTongCuc()) {
        this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
        this.titleTable = 'CỤC DTNN KHU VỰC';
      } else if (this.userService.isChiCuc()) {
        this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
      } else if (this.userService.isCuc()) {
        this.lastBreadcrumb = LEVEL.CUC_SHOW;
        this.titleTable = 'CHI Cục DTNN';
      }
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      await this.loadDataChiTiet(this.id);
      await this.loadDanhMucHang();
      this.loadDefaultLuongThucNew();
      this.loadDefaultMuoiNew();
      this.loadDefaultVatTuNew();
      this.loadDonVi();
      if (this.userService.isCuc()) {
        await this.selectedQdDcCTKHTC();
      }
      await this.selectedQdGiaoCTKHNam();
      // await this.selectedDeXuatDieuChinhCuc();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  updateDataVatTu() {
    let temp = [];
    if (
      this.dieuChinhThongTinChiTieuKHNam.khVatTu &&
      this.dieuChinhThongTinChiTieuKHNam.khVatTu.length > 0
    ) {
      this.dieuChinhThongTinChiTieuKHNam.khVatTu.forEach((element) => {
        if (element.vatTuThietBi && element.vatTuThietBi.length > 0) {
          element.vatTuThietBi.forEach((vatTu) => {
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

  processDataVattu(data) {
    this.dataVatTuNhap = chain(data.khVatTuNhap)
      .groupBy("maDvi")
      .map((value, key) => {
        let vatTu = value.map(s => Object.assign(s, {
          isEdit: false,
        }))
        return {
          maDvi: key,
          tenDvi: value[0].tenDonVi,
          dsVatTu: vatTu
        };
      }).value();
    this.dataVatTuNhap.forEach(s => this.expandSetVatTuNhap.add(s.maDvi));
    this.dataVatTuNhapEdit = cloneDeep(this.dataVatTuNhap);

    this.dataVatTuXuat = chain(data.khVatTuXuat)
      .groupBy("maDvi")
      .map((value, key) => {
        let vatTu = value.map(s => Object.assign(s, {
          isEdit: false,
        }))
        return {
          maDvi: key,
          tenDvi: value[0].tenDonVi,
          dsVatTu: vatTu
        };
      }).value();
    this.dataVatTuXuat.forEach(s => this.expandSetVatTuXuat.add(s.maDvi));
    this.dataVatTuXuatEdit = cloneDeep(this.dataVatTuXuat);
  }

  caculatorDieuChinhLT(item: any) {
    item.sdcNtnThoc =
      (!isNaN(item.tdcNtnThoc) ? item.tdcNtnThoc : 0) +
      (!isNaN(item.dcNtnThoc) ? item.dcNtnThoc : 0);
    item.sdcNtnGao =
      (!isNaN(item.tdcNtnGao) ? item.tdcNtnGao : 0) +
      (!isNaN(item.dcNtnGao) ? item.dcNtnGao : 0);
    item.sdcNtnTongSoQuyThoc =
      (item.sdcNtnThoc ?? 0) + (item.sdcNtnGao ?? 0) * 2;

    if (
      item.tdcXtnThoc &&
      item.tdcXtnThoc.length > 0 &&
      item.dcXtnThoc &&
      item.dcXtnThoc.length > 0 &&
      item.sdcXtnThoc &&
      item.sdcXtnThoc.length > 0
    ) {
      item.sdcXtnThoc[0].soLuong =
        (item.tdcXtnThoc[0].soLuong ?? 0) + (item.dcXtnThoc[0].soLuong ?? 0);
      item.sdcXtnThoc[1].soLuong =
        (item.tdcXtnThoc[1].soLuong ?? 0) + (item.dcXtnThoc[1].soLuong ?? 0);
      item.sdcXtnThoc[2].soLuong =
        (item.tdcXtnThoc[2].soLuong ?? 0) + (item.dcXtnThoc[2].soLuong ?? 0);

      item.sdcXtnTongThoc =
        item.sdcXtnThoc[0].soLuong +
        item.sdcXtnThoc[1].soLuong +
        item.sdcXtnThoc[2].soLuong;
    }

    if (
      item.tdcXtnGao &&
      item.tdcXtnGao.length > 0 &&
      item.dcXtnGao &&
      item.dcXtnGao.length > 0 &&
      item.sdcXtnGao &&
      item.sdcXtnGao.length > 0
    ) {
      item.sdcXtnGao[0].soLuong =
        (item.tdcXtnGao[0].soLuong ?? 0) + (item.dcXtnGao[0].soLuong ?? 0);
      item.sdcXtnGao[1].soLuong =
        (item.tdcXtnGao[1].soLuong ?? 0) + (item.dcXtnGao[1].soLuong ?? 0);
      item.sdcXtnGao[2].soLuong =
        (item.tdcXtnGao[2].soLuong ?? 0) + (item.dcXtnGao[2].soLuong ?? 0);
      item.sdcXtnTongGao =
        item.sdcXtnGao[0].soLuong + item.sdcXtnGao[1].soLuong;
    }

    item.sdcXtnTongSoQuyThoc =
      (item.sdcXtnTongThoc ?? 0) + (item.sdcXtnTongGao ?? 0) * 2;

    item.tkcnTongThoc =
      (item.tkdnTongThoc ?? 0) +
      (item.sdcNtnThoc ?? 0) -
      (item.sdcXtnTongThoc ?? 0);
    item.tkcnTongGao =
      (item.tkdnTongGao ?? 0) +
      (item.sdcNtnGao ?? 0) -
      (item.sdcXtnTongGao ?? 0);
    item.tkcnTongSoQuyThoc =
      (item.tkcnTongThoc ?? 0) + (item.tkcnTongGao ?? 0) * 2;

    item.ntnThoc = item.sdcNtnThoc;
    item.ntnGao = item.sdcNtnGao;
    item.ntnTongSoQuyThoc = item.sdcNtnTongSoQuyThoc;
    item.xtnThoc = item.sdcXtnThoc;
    item.xtnTongThoc = item.sdcXtnTongThoc;
    item.xtnGao = item.sdcXtnGao;
    item.xtnTongGao = item.sdcXtnTongGao;
    item.xtnTongSoQuyThoc = item.sdcXtnTongSoQuyThoc;
  }

  caculatorDieuChinhMuoi(item: any) {
    item.sdcNtnTongSoMuoi =
      (!isNaN(item.tdcNtnTongSoMuoi) ? item.tdcNtnTongSoMuoi : 0) +
      (!isNaN(item.dcNtnTongSoMuoi) ? item.dcNtnTongSoMuoi : 0);

    if (
      item.tdcXtnMuoi &&
      item.tdcXtnMuoi.length > 0 &&
      item.dcXtnMuoi &&
      item.dcXtnMuoi.length > 0 &&
      item.sdcXtnMuoi &&
      item.sdcXtnMuoi.length > 0
    ) {
      item.sdcXtnMuoi[0].soLuong =
        (item.tdcXtnMuoi[0].soLuong ?? 0) + (item.dcXtnMuoi[0].soLuong ?? 0);
      item.sdcXtnMuoi[1].soLuong =
        (item.tdcXtnMuoi[1].soLuong ?? 0) + (item.dcXtnMuoi[1].soLuong ?? 0);
      item.sdcXtnMuoi[2].soLuong =
        (item.tdcXtnMuoi[2].soLuong ?? 0) + (item.dcXtnMuoi[2].soLuong ?? 0);

      item.sdcXtnTongSoMuoi =
        item.sdcXtnMuoi[0].soLuong +
        item.sdcXtnMuoi[1].soLuong +
        item.sdcXtnMuoi[2].soLuong;
    }

    item.tkcnTongSoMuoi =
      (item.tkdnTongSoMuoi ?? 0) +
      (item.sdcNtnTongSoMuoi ?? 0) -
      (item.sdcXtnTongSoMuoi ?? 0);

    item.nhapTrongNam = item.sdcNtnTongSoMuoi;
    item.xuatTrongNam = item.sdcXtnMuoi;
  }

  caculatorDieuChinhVatTu(item: any) {
    item.vatTuThietBi[0].sdcNhapTrongNam = (!isNaN(item.vatTuThietBi[0].tdcNhapTrongNam) ? item.vatTuThietBi[0].tdcNhapTrongNam : 0) + (!isNaN(item.vatTuThietBi[0].dcNhapTrongNam) ? item.vatTuThietBi[0].dcNhapTrongNam : 0);
    item.vatTuThietBi[0].nhapTrongNam = item.vatTuThietBi[0].sdcNhapTrongNam;
    item.vatTuThietBi[0].sdcTongNhap = (!isNaN(item.vatTuThietBi[0].sdcNhapTrongNam) ? item.vatTuThietBi[0].sdcNhapTrongNam : 0) + (!isNaN(item.vatTuThietBi[0].tdcTongNhap) ? item.vatTuThietBi[0].tdcTongNhap : 0);
  }

  updateEditVatTuCache(): void {
    if (this.dataVatTu && this.dataVatTu.length > 0) {
      this.dataVatTu.forEach((item) => {
        this.editVatTuCache[
        item.donViId +
        '-' +
        item.vatTuThietBi[0].vatTuChaId +
        '-' +
        item.vatTuThietBi[0].vatTuId
          ] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  cancelEditVatTu(
    donViId: number,
    vatTuChaId: number = 0,
    vatTuId: number = 0,
  ): void {
    const index = this.dataVatTu.findIndex(
      (item) =>
        item.donViId === donViId &&
        (item.vatTuThietBi[0].vatTuId == vatTuId || vatTuId == 0) &&
        (item.vatTuThietBi[0].vatTuChaId == vatTuChaId || vatTuChaId == 0),
    );
    this.editVatTuCache[donViId + '-' + vatTuChaId + '-' + vatTuId] = {
      data: {...this.dataVatTu[index]},
      edit: false,
    };
  }

  saveEditVatTu(
    donViId: number,
    vatTuChaId: number = 0,
    vatTuId: number = 0,
  ): void {
    this.editVatTuCache[donViId + '-' + vatTuChaId + '-' + vatTuId].edit =
      false;
    this.checkDataExistVatTu(
      this.editVatTuCache[donViId + '-' + vatTuChaId + '-' + vatTuId].data,
    );
    this.updateDataVatTu();
    this.loadData();
  }

  deleteRowVatTu(data: any) {
    let temp = [];
    if (
      this.dieuChinhThongTinChiTieuKHNam.khVatTu &&
      this.dieuChinhThongTinChiTieuKHNam.khVatTu.length > 0
    ) {
      this.dieuChinhThongTinChiTieuKHNam.khVatTu.forEach((element) => {
        if (
          element.donViId == data.donViId &&
          (element.vatTuThietBi[0].vatTuId == data.vatTuThietBi[0].vatTuId ||
            data.vatTuThietBi[0].vatTuId == 0) &&
          (element.vatTuThietBi[0].vatTuChaId ==
            data.vatTuThietBi[0].vatTuChaId ||
            data.vatTuThietBi[0].vatTuChaId == 0)
        ) {
        } else {
          temp.push(element);
        }
      });
    }
    this.dieuChinhThongTinChiTieuKHNam.khVatTu = temp;
    this.loadData();
  }

  editRowVatTu(donViId: number, vatTuChaId: number = 0, vatTuId: number = 0) {
    this.editVatTuCache[donViId + '-' + vatTuChaId + '-' + vatTuId].edit = true;
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
    let temp = [new ItemDetail(0), new ItemDetail(0), new ItemDetail(0)];
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
          data: {...item},
        };
      });
    }
  }

  cancelEditMuoi(donViId: number): void {
    const index = this.dataMuoi.findIndex((item) => item.donViId === donViId);
    this.editMuoiCache[donViId] = {
      data: {...this.dataMuoi[index]},
      edit: false,
    };
  }

  saveEditMuoi(donViId: number): void {
    this.editMuoiCache[donViId].edit = false;
    this.checkDataExistMuoi(this.editMuoiCache[donViId].data);
    this.loadData();
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
    this.keHoachMuoiCreate.donViTinh = 'Tấn';
    this.checkDataExistMuoi(this.keHoachMuoiCreate);
    this.loadData();
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
          data: {...item},
        };
      });
    }
  }

  cancelEditLuongThuc(donViId: number): void {
    const index = this.dataLuongThuc.findIndex(
      (item) => item.donViId === donViId,
    );
    this.editLuongThucCache[donViId] = {
      data: {...this.dataLuongThuc[index]},
      edit: false,
    };
  }

  saveEditLuongThuc(donViId: number): void {
    this.editLuongThucCache[donViId].edit = false;
    this.checkDataExistLuongThuc(this.editLuongThucCache[donViId].data);
    this.loadData();
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
    this.keHoachLuongThucCreate.donViTinh = 'Tấn';
    this.checkDataExistLuongThuc(this.keHoachLuongThucCreate);
    this.loadData();
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
      {
        nam: this.yearNow - 3,
        soLuong: 0,
        vatTuId: this.thocIdDefault,
        id: 0,
      },
    ];
    this.keHoachLuongThucCreate.tkdnThoc = cloneDeep(tkdnThoc);
    this.keHoachLuongThucCreate.tkdnGao = cloneDeep(tkdnGao);

    this.keHoachLuongThucCreate.dcNtnThoc = 0;
    this.keHoachLuongThucCreate.dcNtnGao = 0;

    // this.keHoachLuongThucCreate.tdcXtnThoc = cloneDeep(tkdnThoc);
    // this.keHoachLuongThucCreate.tdcXtnGao = cloneDeep(tkdnGao);
    //
    this.keHoachLuongThucCreate.xtnThoc = cloneDeep(tkdnThoc);
    this.keHoachLuongThucCreate.xtnGao = cloneDeep(tkdnGao);

    this.keHoachLuongThucCreate.dcXtnThoc = cloneDeep(tkdnThoc);
    this.keHoachLuongThucCreate.dcXtnGao = cloneDeep(tkdnGao);

    // this.keHoachLuongThucCreate.sdcXtnThoc = cloneDeep(tkdnThoc);
    // this.keHoachLuongThucCreate.sdcXtnGao = cloneDeep(tkdnGao);
  }

  selectDataMultipleTag(data: any) {
  }

  deleteDataMultipleTag(data: any) {
    if (this.id == 0 && !this.isView) {
      this.dataGiaoChiTieu = this.dataGiaoChiTieu.filter((x) => x.id != data.id);
      this.selectedCanCu = {};
      this.dieuChinhThongTinChiTieuKHNam.qdGocId = 0;
      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc = [];
      this.dieuChinhThongTinChiTieuKHNam.khMuoiDuTru = [];
      this.dieuChinhThongTinChiTieuKHNam.khMuoi = [];
      this.dieuChinhThongTinChiTieuKHNam.khVatTu = [];
      this.dieuChinhThongTinChiTieuKHNam.namKeHoach = 0;
      this.formData.controls['namKeHoach'].setValue(0);
      this.updateDataVatTu();
      this.loadData();
    }
  }

  async selectDonViKHLT(donVi, isAdd, item) {
    this.spinner.show();
    try {
      this.isAddLuongThuc = isAdd;

      item.maDonVi = donVi.maDvi;
      item.maDvi = donVi.maDvi;
      item.tenDonvi = donVi.tenDvi;
      item.donViId = donVi.id;

      let body = {
        donViId: item.donViId,
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
                  item.tkdnThoc[0].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 2:
                  item.tkdnThoc[1].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 3:
                  item.tkdnThoc[2].soLuong = tonKho.soLuong;
                  break;
                default:
                  break;
              }
            } else if (tonKho.vatTuId == this.gaoIdDefault) {
              switch (tonKho.nam) {
                case this.yearNow - 1:
                  item.tkdnGao[0].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 2:
                  item.tkdnGao[1].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 3:
                  item.tkdnGao[2].soLuong = tonKho.soLuong;
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
              item.ntnThoc = tonKho.soLuong;
            } else if (tonKho.vatTuId == this.gaoIdDefault) {
              item.ntnGao = tonKho.soLuong;
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
                  item.xtnThoc[0].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 2:
                  item.xtnThoc[1].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 3:
                  item.xtnThoc[2].soLuong = tonKho.soLuong;
                  break;
                default:
                  break;
              }
            } else if (tonKho.vatTuId == this.gaoIdDefault) {
              switch (tonKho.nam) {
                case this.yearNow - 1:
                  item.xtnGao[0].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 2:
                  item.xtnGao[1].soLuong = tonKho.soLuong;
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

  async selectDonViKHMuoi(donVi, isAdd, item) {
    this.spinner.show();
    try {
      this.isAddMuoi = isAdd;
      item.maDonVi = donVi.maDvi;
      item.tenDonvi = donVi.tenDvi;
      item.tenDonVi = donVi.tenDvi;
      item.donViId = donVi.id;

      let body = {
        donViId: item.donViId,
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
                  item.tkdnMuoi[0].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 2:
                  item.tkdnMuoi[1].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 3:
                  item.tkdnMuoi[2].soLuong = tonKho.soLuong;
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
              item.ntnTongSoMuoi = tonKho.soLuong;
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
                  item.xtnMuoi[0].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 2:
                  item.xtnMuoi[1].soLuong = tonKho.soLuong;
                  break;
                case this.yearNow - 3:
                  item.xtnMuoi[2].soLuong = tonKho.soLuong;
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

  async selectDonViVatTu(donVi, isAdd, item) {
    item.maDonVi = donVi.maDvi;
    item.tenDonvi = donVi.tenDvi;
    item.tenDonVi = donVi.tenDvi;
    item.donViId = donVi.id;
    await this.loadTonKhoVatTu(isAdd, item);
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
      this.keHoachVatTuCreate.donViTinh = '';
      this.keHoachVatTuCreate.vatTuThietBi[0].kyHieu = '';
      this.keHoachVatTuCreate.vatTuThietBi[0].chungLoaiHang = '';
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

  async selectTenHang(vatTu, isAdd, item) {
    this.dataVatTuConClone = vatTu.child;
    this.dataVatTuConShow = cloneDeep(this.dataVatTuConClone);

    item.donViTinh = vatTu.donViTinh;
    item.vatTuThietBi[0].kyHieu = vatTu.kyHieu;
    item.vatTuThietBi[0].maVatTuCha = vatTu.maHang;
    item.vatTuThietBi[0].vatTuChaId = vatTu.id;
    item.vatTuThietBi[0].donViTinh = vatTu.donViTinh;
    if (vatTu.child && vatTu.child.length > 0) {
      item.vatTuThietBi[0].maVatTu = '';
      item.vatTuThietBi[0].vatTuId = 0;
      item.vatTuThietBi[0].tenVatTu = '';
      item.chungLoaiHang = '';
    } else {
      item.vatTuThietBi[0].maVatTu = vatTu.maHang;
      item.vatTuThietBi[0].vatTuId = vatTu.id;
      item.vatTuThietBi[0].tenVatTu = '';
      item.chungLoaiHang = '';
      await this.loadTonKhoVatTu(isAdd, item);
    }
  }

  async selectChungLoaiHang(chungLoaiHang, isAdd, item) {
    item.vatTuThietBi[0].donViTinh = chungLoaiHang.donViTinh;
    item.vatTuThietBi[0].maVatTu = chungLoaiHang.maHang;
    item.vatTuThietBi[0].vatTuId = chungLoaiHang.id;
    const vatTuChaFilter = this.dataVatTuCha.find(
      (vaTuCha) => vaTuCha.id === chungLoaiHang.idParent,
    );
    if (vatTuChaFilter) {
      item.kyHieu = vatTuChaFilter.kyHieu;
      item.donViTinh = vatTuChaFilter.donViTinh;
      item.vatTuThietBi[0].maVatTuCha = vatTuChaFilter.maHang;
      item.tenHang = vatTuChaFilter.ten;
    } else {
      item.kyHieu = chungLoaiHang.kyHieu;
      item.donViTinh = chungLoaiHang.donViTinh;
      item.vatTuThietBi[0].maVatTuCha = chungLoaiHang.maHang;
      item.tenHang = '';
    }
    await this.loadTonKhoVatTu(isAdd, item);
  }

  async loadTonKhoVatTu(isAdd, item) {
    this.spinner.show();
    try {
      if (
        isAdd &&
        item.vatTuThietBi &&
        item.vatTuThietBi.length > 0 &&
        item.vatTuThietBi[0].vatTuId &&
        item.vatTuThietBi[0].vatTuId > 0
      ) {
        this.isAddVatTu = isAdd;
        let body = {
          donViId: item.donViId,
          ctkhnId: this.selectedCanCu.id,
          vatTuIds: [item.vatTuThietBi[0].vatTuId],
        };

        let data =
          await this.quyetDinhDieuChinhChiTieuKeHoachNamService.soLuongTruocDieuChinh(
            body,
          );
        if (data && data.msg == MESSAGE.SUCCESS) {
          if (
            data.data &&
            data.data.keHoachVatTuNamTruoc &&
            data.data.keHoachVatTuNamTruoc.length > 0
          ) {
            data.data.keHoachVatTuNamTruoc.forEach((tonKho) => {
              if (tonKho.vatTuId == item.vatTuThietBi[0].vatTuId) {
                switch (tonKho.nam) {
                  case this.yearNow - 1:
                    item.vatTuThietBi[0].tdcCacNamTruoc[0].soLuong =
                      tonKho.soLuong;
                    break;
                  case this.yearNow - 2:
                    item.vatTuThietBi[0].tdcCacNamTruoc[1].soLuong =
                      tonKho.soLuong;
                    break;
                  case this.yearNow - 3:
                    item.vatTuThietBi[0].tdcCacNamTruoc[2].soLuong =
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
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDonVi() {
    try {
      if (this.lastBreadcrumb == LEVEL.TONG_CUC_SHOW) {
        if (this.userInfo.CAP_DVI === LEVEL_USER.CUC) {
          const res = await this.donViService.layTatCaDonVi();
          this.optionsDonVi = [];
          if (res.msg == MESSAGE.SUCCESS) {
            for (let i = 0; i < res.data.length; i++) {
              if (this.userInfo.MA_DVI === res.data[i].maDvi) {
                await this.selectDonViKHLT(
                  res.data[i],
                  true,
                  this.keHoachLuongThucCreate,
                );
                this.keHoachLuongThucCreate.tenDonvi = res.data[i].tenDvi;

                await this.selectDonViKHMuoi(
                  res.data[i],
                  true,
                  this.keHoachMuoiCreate,
                );
                this.keHoachMuoiCreate.tenDonVi = res.data[i].tenDvi;

                await this.selectDonViVatTu(
                  res.data[i],
                  true,
                  this.keHoachVatTuCreate,
                );
                this.keHoachVatTuCreate.tenDonVi = res.data[i].tenDvi;

                break;
              }
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } else {
          const res = await this.donViService.layDonViCon();
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
        }
      } else if (this.lastBreadcrumb == LEVEL.CUC_SHOW) {
        const res = await this.donViService.layDonViCon();
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
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
        this.dieuChinhThongTinChiTieuKHNam.khVatTu[i].donViId == listCha.donViId
      ) {
        for (
          let j = 0;
          j < this.dieuChinhThongTinChiTieuKHNam.khVatTu[i].listDisplay.length;
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
    this.dieuChinhThongTinChiTieuKHNam.trangThai = '00';
    this.formData = this.fb.group({
      canCu: [null],
      soQD: [null],
      ngayKy: [null],
      ngayHieuLuc: [null],
      namKeHoach: [this.yearNow],
      trichYeu: [null],
      ghiChu: [null],
      loaiHangHoa: [this.tabSelected]
    });
    if (this.deXuatId && this.deXuatId > 0) {
      let res = await this.deXuatDieuChinhService.loadChiTiet(this.deXuatId);
      if (res.msg == MESSAGE.SUCCESS) {
        let item = {
          id: res.data.id,
          text: res.data.soVanBan,
        };
        if (!this.dataDeXuat) {
          this.dataDeXuat = [];
        }
        this.dataDeXuat.push(item);
        this.formData.controls['namKeHoach'].setValue(
          res.data.namKeHoach,
        );
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    if (id > 0) {
      let res = await this.quyetDinhDieuChinhChiTieuKeHoachNamService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.dieuChinhThongTinChiTieuKHNam = res.data;

          this.selectedCanCu.id = this.dieuChinhThongTinChiTieuKHNam.qdGocId;
          this.selectedCanCu.soQuyetDinh =
            this.dieuChinhThongTinChiTieuKHNam.soQdGoc;

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
            this.dieuChinhThongTinChiTieuKHNam.soQuyetDinh ? this.dieuChinhThongTinChiTieuKHNam.soQuyetDinh.split('/')[0] : null,
          );
          if (this.dieuChinhThongTinChiTieuKHNam.soQuyetDinh && this.dieuChinhThongTinChiTieuKHNam.soQuyetDinh.split('/').length > 1) {
            this.qdTCDT = this.dieuChinhThongTinChiTieuKHNam.soQuyetDinh.split('/')[1];
          }
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
          this.formData.controls['loaiHangHoa'].setValue(
            this.dieuChinhThongTinChiTieuKHNam.loaiHangHoa,
          );

          if (
            this.dieuChinhThongTinChiTieuKHNam.khLuongThuc &&
            this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.length > 0
          ) {
            for (
              let i = 0;
              i < this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.length;
              i++
            ) {
              if (
                this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].dcXtnThoc &&
                this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].dcXtnThoc
                  .length > 0
              ) {
              } else {
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
                this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].dcXtnThoc =
                  tkdnThoc;
              }
              if (
                this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].dcXtnGao &&
                this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].dcXtnGao
                  .length > 0
              ) {
              } else {
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
                  {
                    nam: this.yearNow - 3,
                    soLuong: 0,
                    vatTuId: this.thocIdDefault,
                    id: 0,
                  },
                ];
                this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].dcXtnGao =
                  tkdnGao;
              }
            }
          }

          if (
            this.dieuChinhThongTinChiTieuKHNam.khMuoiDuTru &&
            this.dieuChinhThongTinChiTieuKHNam.khMuoiDuTru.length > 0
          ) {
            this.dieuChinhThongTinChiTieuKHNam.khMuoi = cloneDeep(
              this.dieuChinhThongTinChiTieuKHNam.khMuoiDuTru,
            );
          }

          this.processDataVattu(this.dieuChinhThongTinChiTieuKHNam);


          // if (
          //   this.dieuChinhThongTinChiTieuKHNam.khMuoi &&
          //   this.dieuChinhThongTinChiTieuKHNam.khMuoi.length > 0
          // ) {
          //   for (
          //     let i = 0;
          //     i < this.dieuChinhThongTinChiTieuKHNam.khMuoi.length;
          //     i++
          //   ) {
          //     if (
          //       this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].dcXtnMuoi &&
          //       this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].dcXtnMuoi.length >
          //       0
          //     ) {
          //     } else {
          //       let tkdnMuoi: Array<ItemDetail> = [
          //         {
          //           nam: this.yearNow - 1,
          //           soLuong: 0,
          //           vatTuId: this.thocIdDefault,
          //           id: 0,
          //         },
          //         {
          //           nam: this.yearNow - 2,
          //           soLuong: 0,
          //           vatTuId: this.thocIdDefault,
          //           id: 0,
          //         },
          //         {
          //           nam: this.yearNow - 3,
          //           soLuong: 0,
          //           vatTuId: this.thocIdDefault,
          //           id: 0,
          //         },
          //       ];
          //       this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].dcXtnMuoi =
          //         tkdnMuoi;
          //     }
          //     this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].nhapTrongNam =
          //       this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].sdcNtnTongSoMuoi;
          //     this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].xuatTrongNam =
          //       this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].sdcXtnMuoi;
          //   }
          // }

          if (
            this.dieuChinhThongTinChiTieuKHNam.fileDinhKems &&
            this.dieuChinhThongTinChiTieuKHNam.fileDinhKems.length > 0
          ) {
            this.dieuChinhThongTinChiTieuKHNam.fileDinhKemReqs = cloneDeep(
              this.dieuChinhThongTinChiTieuKHNam.fileDinhKems,
            );
            this.dieuChinhThongTinChiTieuKHNam.fileDinhKemReqs.forEach(
              (element) => {
                element.idVirtual = element.id;
                let item = {
                  id: element.idVirtual,
                  text: element.fileName,
                };
                if (!this.taiLieuDinhKemList) {
                  this.taiLieuDinhKemList = [];
                }
                this.taiLieuDinhKemList.push(item);
              },
            );
          }

          if (
            this.dieuChinhThongTinChiTieuKHNam.deXuats &&
            this.dieuChinhThongTinChiTieuKHNam.deXuats.length > 0
          ) {
            this.dieuChinhThongTinChiTieuKHNam.deXuats.forEach(
              (element) => {
                let item = {
                  id: element.id,
                  text: element.soVanBan,
                };
                if (!this.dataDeXuat) {
                  this.dataDeXuat = [];
                }
                this.dataDeXuat.push(item);
              },
            );
          }

          this.yearNow = this.dieuChinhThongTinChiTieuKHNam.namKeHoach;

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
          this.dieuChinhThongTinChiTieuKHNam.khVatTu = this.updateDataListVatTu(
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
    this.showListEvent.emit();
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

  async selectedQdGiaoCTKHNam() {
    if (this.id == 0 && !this.isView) {
      let body = {
        ngayKyDenNgay: null,
        id: 0,
        donViId: null,
        maDvi: null,
        namKeHoach: this.formData.value.namKeHoach ?? null,
        tenDvi: null,
        pageNumber: this.page,
        pageSize: this.pageSize,
        trichYeu: null,
        ngayKyTuNgay: null,
        trangThai: STATUS.BAN_HANH,
        capDvi: this.userInfo.CAP_DVI,
      };
      this.spinner.show();
      let res = await this.chiTieuKeHoachNamCapTongCucService.timKiem(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          this.dataGiaoChiTieu = [];
          let item = {
            id: data.content[0].id,
            text: data.content[0].soQuyetDinh,
          };
          this.dataGiaoChiTieu.push(item);
          this.selectedCanCu = data.content[0];
          this.chiTieuKeHoachNamCapTongCucService
            .loadThongTinChiTieuKeHoachNam(this.selectedCanCu.id)
            .then((res) => {
              if (res.msg == MESSAGE.SUCCESS) {
                let tempData = res.data;
                // this.formData.controls['namKeHoach'].setValue(
                //   tempData.namKeHoach,
                // );
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
                    i < this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.length;
                    i++
                  ) {
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].id = null;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].khGaoId =
                      null;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].khThocId =
                      null;

                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcNtnTongSoQuyThoc =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                        i
                        ].ntnTongSoQuyThoc;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcNtnThoc =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].ntnThoc;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcNtnGao =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].ntnGao;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcXtnTongSoQuyThoc =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                        i
                        ].xtnTongSoQuyThoc;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcXtnTongThoc =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                        i
                        ].xtnTongThoc;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcXtnTongGao =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                        i
                        ].xtnTongGao;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcXtnThoc =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].xtnThoc;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcXtnGao =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].xtnGao;

                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                        .xtnGao &&
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].xtnGao
                        .length > 0
                    ) {
                      for (
                        let j = 0;
                        j <
                        this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].xtnGao
                          .length;
                        j++
                      ) {
                        this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                          i
                          ].xtnGao[j].id = null;
                      }
                    }

                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                        .dcXtnThoc &&
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                        .dcXtnThoc.length > 0
                    ) {
                    } else {
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
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                        i
                        ].dcXtnThoc = tkdnThoc;
                    }
                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                        .dcXtnGao &&
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].dcXtnGao
                        .length > 0
                    ) {
                    } else {
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
                        {
                          nam: this.yearNow - 3,
                          soLuong: 0,
                          vatTuId: this.thocIdDefault,
                          id: 0,
                        },
                      ];
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                        i
                        ].dcXtnGao = tkdnGao;
                    }

                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                        .xtnThoc &&
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].xtnThoc
                        .length > 0
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

                    this.dieuChinhThongTinChiTieuKHNam.khMuoi[
                      i
                      ].tdcNtnTongSoMuoi =
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[
                        i
                        ].ntnTongSoMuoi;
                    this.dieuChinhThongTinChiTieuKHNam.khMuoi[
                      i
                      ].tdcXtnTongSoMuoi =
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[
                        i
                        ].xtnTongSoMuoi;
                    this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].tdcXtnMuoi =
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].xtnMuoi;

                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].xtnMuoi &&
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].xtnMuoi
                        .length > 0
                    ) {
                      for (
                        let j = 0;
                        j <
                        this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].xtnMuoi
                          .length;
                        j++
                      ) {
                        this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].xtnMuoi[
                          j
                          ].id = null;
                      }
                    }

                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].dcXtnMuoi &&
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].dcXtnMuoi
                        .length > 0
                    ) {
                    } else {
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
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].dcXtnMuoi =
                        tkdnMuoi;
                    }
                  }
                }
                this.processDataVattu(tempData);
                this.dieuChinhThongTinChiTieuKHNam.khVatTu = cloneDeep(
                  tempData.khVatTu,
                );
                this.updateDataVatTu();
                this.loadData();
              }
            });
          this.spinner.hide();
        } else {
          this.notification.error(MESSAGE.ERROR, "Không tìm thấy quyết định giao chỉ tiêu kế hoạch của Cục");
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  openDialogQuyetDinhGiaoChiTieu() {
    return;
    if (this.id == 0 && !this.isView) {
      const modalQD = this.modal.create({
        nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
        nzContent: DialogQuyetDinhGiaoChiTieuComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          maDVi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
          namKeHoach: this.yearNow,
        },
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
                    i < this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.length;
                    i++
                  ) {
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].id = null;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].khGaoId =
                      null;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].khThocId =
                      null;

                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcNtnTongSoQuyThoc =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                        i
                        ].ntnTongSoQuyThoc;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcNtnThoc =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].ntnThoc;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcNtnGao =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].ntnGao;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcXtnTongSoQuyThoc =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                        i
                        ].xtnTongSoQuyThoc;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcXtnTongThoc =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                        i
                        ].xtnTongThoc;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcXtnTongGao =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                        i
                        ].xtnTongGao;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcXtnThoc =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].xtnThoc;
                    this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                      i
                      ].tdcXtnGao =
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].xtnGao;

                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                        .xtnGao &&
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].xtnGao
                        .length > 0
                    ) {
                      for (
                        let j = 0;
                        j <
                        this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].xtnGao
                          .length;
                        j++
                      ) {
                        this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                          i
                          ].xtnGao[j].id = null;
                      }
                    }

                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                        .dcXtnThoc &&
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                        .dcXtnThoc.length > 0
                    ) {
                    } else {
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
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                        i
                        ].dcXtnThoc = tkdnThoc;
                    }
                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                        .dcXtnGao &&
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].dcXtnGao
                        .length > 0
                    ) {
                    } else {
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
                        {
                          nam: this.yearNow - 3,
                          soLuong: 0,
                          vatTuId: this.thocIdDefault,
                          id: 0,
                        },
                      ];
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[
                        i
                        ].dcXtnGao = tkdnGao;
                    }

                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i]
                        .xtnThoc &&
                      this.dieuChinhThongTinChiTieuKHNam.khLuongThuc[i].xtnThoc
                        .length > 0
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

                    this.dieuChinhThongTinChiTieuKHNam.khMuoi[
                      i
                      ].tdcNtnTongSoMuoi =
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[
                        i
                        ].ntnTongSoMuoi;
                    this.dieuChinhThongTinChiTieuKHNam.khMuoi[
                      i
                      ].tdcXtnTongSoMuoi =
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[
                        i
                        ].xtnTongSoMuoi;
                    this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].tdcXtnMuoi =
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].xtnMuoi;

                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].xtnMuoi &&
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].xtnMuoi
                        .length > 0
                    ) {
                      for (
                        let j = 0;
                        j <
                        this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].xtnMuoi
                          .length;
                        j++
                      ) {
                        this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].xtnMuoi[
                          j
                          ].id = null;
                      }
                    }

                    if (
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].dcXtnMuoi &&
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].dcXtnMuoi
                        .length > 0
                    ) {
                    } else {
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
                      this.dieuChinhThongTinChiTieuKHNam.khMuoi[i].dcXtnMuoi =
                        tkdnMuoi;
                    }
                  }
                }
                this.processDataVattu(tempData);
                this.dieuChinhThongTinChiTieuKHNam.khVatTu = cloneDeep(
                  tempData.khVatTu,
                );
                // if (
                //   this.dieuChinhThongTinChiTieuKHNam.khVatTu &&
                //   this.dieuChinhThongTinChiTieuKHNam.khVatTu.length > 0
                // ) {
                //   for (
                //     let i = 0;
                //     i < this.dieuChinhThongTinChiTieuKHNam.khVatTu.length;
                //     i++
                //   ) {
                //     this.dieuChinhThongTinChiTieuKHNam.khVatTu[i].id = null;
                //     if (
                //       this.dieuChinhThongTinChiTieuKHNam.khVatTu[i]
                //         .vatTuThietBi &&
                //       this.dieuChinhThongTinChiTieuKHNam.khVatTu[i].vatTuThietBi
                //         .length > 0
                //     ) {
                //       for (
                //         let j = 0;
                //         j <
                //         this.dieuChinhThongTinChiTieuKHNam.khVatTu[i]
                //           .vatTuThietBi.length;
                //         j++
                //       ) {
                //         this.dieuChinhThongTinChiTieuKHNam.khVatTu[
                //           i
                //           ].vatTuThietBi[j].id = null;
                //
                //         this.dieuChinhThongTinChiTieuKHNam.khVatTu[
                //           i
                //           ].vatTuThietBi[j].tdcNhapTrongNam =
                //           this.dieuChinhThongTinChiTieuKHNam.khVatTu[
                //             i
                //             ].vatTuThietBi[j].nhapTrongNam;
                //         this.dieuChinhThongTinChiTieuKHNam.khVatTu[
                //           i
                //           ].vatTuThietBi[j].tdcTongCacNamTruoc =
                //           this.dieuChinhThongTinChiTieuKHNam.khVatTu[
                //             i
                //             ].vatTuThietBi[j].tongCacNamTruoc;
                //         this.dieuChinhThongTinChiTieuKHNam.khVatTu[
                //           i
                //           ].vatTuThietBi[j].tdcTongNhap =
                //           this.dieuChinhThongTinChiTieuKHNam.khVatTu[
                //             i
                //             ].vatTuThietBi[j].tongNhap;
                //         this.dieuChinhThongTinChiTieuKHNam.khVatTu[
                //           i
                //           ].vatTuThietBi[j].tdcCacNamTruoc =
                //           this.dieuChinhThongTinChiTieuKHNam.khVatTu[
                //             i
                //             ].vatTuThietBi[j].cacNamTruoc;
                //       }
                //     }
                //   }
                // }

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
            sumVal +
            (!isNaN(
              parseFloat(
                this.helperService.replaceAll(
                  table.rows[i].cells[indexCell].innerHTML,
                  stringReplace,
                  '',
                ),
              ),
            )
              ? parseFloat(
                this.helperService.replaceAll(
                  table.rows[i].cells[indexCell].innerHTML,
                  stringReplace,
                  '',
                ),
              )
              : 0);
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
      sheetLuongThuc['!cols'][24] = {hidden: true};
      XLSX.utils.book_append_sheet(workbook, sheetLuongThuc, 'sheetLuongThuc');
    }
    const tableMuoi = document
      .getElementById('table-muoi-tong-hop')
      .getElementsByTagName('table');
    if (tableMuoi && tableMuoi.length > 0) {
      let sheetMuoi = XLSX.utils.table_to_sheet(tableMuoi[0]);
      sheetMuoi['!cols'] = [];
      sheetMuoi['!cols'][12] = {hidden: true};
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
      let indexExist = this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.findIndex(
        (x) => x.maDonVi == data.maDonVi,
      );
      if (indexExist != -1) {
        this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.splice(indexExist, 1);
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
        (x) =>
          x.maDonVi == data.maDonVi &&
          (x.vatTuThietBi[0].vatTuId == data.vatTuThietBi[0].vatTuId ||
            data.vatTuThietBi[0].vatTuId == 0) &&
          (x.vatTuThietBi[0].vatTuChaId == data.vatTuThietBi[0].vatTuChaId ||
            data.vatTuThietBi[0].vatTuChaId == 0),
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
          // await this.save(true);
          let trangThai;
          if (this.userService.isTongCuc()) {
            switch (this.dieuChinhThongTinChiTieuKHNam.trangThai) {
              case STATUS.DU_THAO: {
                trangThai = STATUS.CHO_DUYET_LDV
                break;
              }
              case STATUS.TU_CHOI_LDV: {
                trangThai = STATUS.CHO_DUYET_LDV
                break;
              }
            }
          }
          if (this.userService.isCuc()) {
            switch (this.dieuChinhThongTinChiTieuKHNam.trangThai) {
              case STATUS.DU_THAO: {
                trangThai = STATUS.CHO_DUYET_TP
                break;
              }
              case STATUS.TU_CHOI_TP: {
                trangThai = STATUS.CHO_DUYET_TP
                break;
              }
              case STATUS.TU_CHOI_LDC: {
                trangThai = STATUS.CHO_DUYET_TP
                break;
              }
            }
          }
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: trangThai,
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
          let trangThai;
          switch (this.dieuChinhThongTinChiTieuKHNam.trangThai) {
            case STATUS.CHO_DUYET_LDV: {
              trangThai = STATUS.DA_DUYET_LDV;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              trangThai = STATUS.DA_DUYET_LDC;
              break;
            }
            case STATUS.CHO_DUYET_TP: {
              trangThai = STATUS.CHO_DUYET_LDC;
              break;
            }
          }
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: trangThai,
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

  banHanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn ban hành?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          // await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: STATUS.BAN_HANH
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
            trangThai: STATUS.TU_CHOI_LDV,
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

  khongBanHanh() {
    const modalKhongBanHanh = this.modal.create({
      nzTitle: 'THÔNG BÁO KHÔNG BAN HÀNH',
      nzContent: DialogKhongBanHanhComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalKhongBanHanh.afterClose.subscribe(async (dataKhongBanHanh) => {
      if (dataKhongBanHanh) {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDo: dataKhongBanHanh.lyDo,
            noiDung: dataKhongBanHanh.noiDung,
            ngayKy: dataKhongBanHanh.ngayKy,
            trangThai: STATUS.KHONG_BAN_HANH,
            soVanVan: dataKhongBanHanh.soVanBan,
            vanBanDinhKemReqs: dataKhongBanHanh.vanBanDinhKems
          };
          let res =
            await this.quyetDinhDieuChinhChiTieuKeHoachNamService.cancelBanHanh(
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
        this.redirectChiTieuKeHoachNam();
      },
    });
  }

  async save(isGuiDuyet: boolean) {
    if (this.formData.valid) {
      this.spinner.show();
      try {
        this.dieuChinhThongTinChiTieuKHNam.id = this.id;
        this.dieuChinhThongTinChiTieuKHNam.soQuyetDinh = this.formData.get('soQD').value ? this.formData.get('soQD').value + '/' + this.qdTCDT : null;
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

        this.dieuChinhThongTinChiTieuKHNam.chiTieuId = this.dieuChinhThongTinChiTieuKHNam.qdGocId;

        let dxDcKhnIds = [];
        if (this.dataDeXuat && this.dataDeXuat.length > 0) {
          this.dataDeXuat.forEach((item: any) => {
            dxDcKhnIds.push(item.id);
          });
        }
        this.dieuChinhThongTinChiTieuKHNam.dxDcKhnIds = dxDcKhnIds;
        if (this.dataDieuChinh && this.dataDieuChinh.length > 0) {
          this.dieuChinhThongTinChiTieuKHNam.dcChiTieuId = this.dataDieuChinh[0].id;
        }
        this.dieuChinhThongTinChiTieuKHNam.khVatTuNhap = this.dataVatTuNhap.flatMap(s => s.dsVatTu.map(s1 => {
          delete s.dsVatTu;
          return Object.assign(s1, s)
        }));
        this.dieuChinhThongTinChiTieuKHNam.khVatTuXuat = this.dataVatTuXuat.flatMap(s => s.dsVatTu.map(s1 => {
          delete s.dsVatTu;
          return Object.assign(s1, s)
        }));

        const khVatTu = this.dieuChinhThongTinChiTieuKHNam.khVatTu;
        for (let i = 0; i < khVatTu.length; i++) {
          for (let j = i + 1; j <= khVatTu.length - 1; j++) {
            if (khVatTu[i].donViId === khVatTu[j].donViId) {
              khVatTu[i].vatTuThietBi.push(khVatTu[j].vatTuThietBi[0]);
              khVatTu.splice(j, 1);
            }
          }
        }
        this.dieuChinhThongTinChiTieuKHNam.khVatTu = khVatTu;
        this.dieuChinhThongTinChiTieuKHNam.khVatTu.forEach((vatTu) => {
          delete vatTu.listDisplay;
          vatTu.vatTuThietBi.forEach((thietbi, index) => {
            delete thietbi.cacNamTruoc;
            delete thietbi.tenVatTu;
            delete thietbi.tenVatTuCha;
            delete thietbi.tongCacNamTruoc;
            delete thietbi.tongNhap;
          });
        });

        let body = {
          qdDc: this.dieuChinhThongTinChiTieuKHNam,
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
            } else {
              this.guiDuyet();
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
            } else {
              this.guiDuyet();
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
    if (this.tabSelected == "00") {
      this.dataLuongThuc = this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page,
      );
      this.totalRecord = this.dieuChinhThongTinChiTieuKHNam.khLuongThuc.length;
      this.updateDataLuongThuc();
      this.updateEditLuongThucCache();
    } else if (this.tabSelected == "01") {
      this.dataMuoi = this.dieuChinhThongTinChiTieuKHNam.khMuoi.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page,
      );
      this.totalRecord = this.dieuChinhThongTinChiTieuKHNam.khMuoi.length;
      this.updateDataMuoi();
      this.updateEditMuoiCache();
    } else if (this.tabSelected == "02") {
      this.dataVatTu = this.dieuChinhThongTinChiTieuKHNam.khVatTu.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page,
      );
      this.totalRecord = this.dieuChinhThongTinChiTieuKHNam.khVatTu.length;
      // this.updateDataVatTuLoad();
      // this.updateEditVatTuCache();
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
        {
          nam: this.yearNow - 3,
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
      let temp = [new ItemDetail(0), new ItemDetail(0), new ItemDetail(0)];
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
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
      this.dieuChinhThongTinChiTieuKHNam.fileDinhKemReqs =
        this.dieuChinhThongTinChiTieuKHNam.fileDinhKemReqs.filter(
          (x) => x.idVirtual !== data.id,
        );
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
            if (!this.dieuChinhThongTinChiTieuKHNam.fileDinhKemReqs) {
              this.dieuChinhThongTinChiTieuKHNam.fileDinhKemReqs = [];
            }
            const fileDinhKem = new FileDinhKem();
            fileDinhKem.fileName = resUpload.filename;
            fileDinhKem.fileSize = resUpload.size;
            fileDinhKem.fileUrl = resUpload.url;
            fileDinhKem.idVirtual = item.id;
            this.dieuChinhThongTinChiTieuKHNam.fileDinhKemReqs.push(fileDinhKem);
            this.taiLieuDinhKemList.push(item);
          });
      }
    }
  }

  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === STATUS.DU_THAO ||
      trangThai === STATUS.CHO_DUYET_TP ||
      trangThai === STATUS.TU_CHOI_LDC ||
      trangThai === STATUS.CHO_DUYET_LDC ||
      trangThai === STATUS.CHO_DUYET_LDV
      || trangThai === STATUS.TU_CHOI_LDV
      || trangThai === STATUS.TU_CHOI_TP
      || trangThai === STATUS.KHONG_BAN_HANH
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === STATUS.DA_DUYET_LDC || trangThai === STATUS.DA_DUYET_LDV || trangThai === STATUS.BAN_HANH) {
      return 'da-ban-hanh';
    }
  }

  changeLoaiHangHoa() {
    this.tabSelected = this.formData.get('loaiHangHoa').value;
    this.loadData();
  }

  downloadFileKeHoach(event) {
    let body = {
      "dataType": "",
      "dataId": 0
    }
    switch (event) {
      case 'tai-lieu-dinh-kem':
        body.dataType = this.dieuChinhThongTinChiTieuKHNam.fileDinhKems[0].dataType;
        body.dataId = this.dieuChinhThongTinChiTieuKHNam.fileDinhKems[0].dataId;
        if (this.taiLieuDinhKemList.length > 0) {
          this.chiTieuKeHoachNamCapTongCucService.downloadFileKeHoach(body).subscribe((blob) => {
            saveAs(blob, this.dieuChinhThongTinChiTieuKHNam.fileDinhKems.length > 1 ? 'Tai-lieu-dinh-kem.zip' : this.dieuChinhThongTinChiTieuKHNam.fileDinhKems[0].fileName);
          });
        }
        break;
      default:
        break;
    }
  }

  async selectedDeXuatDieuChinhCuc() {
    if (this.id == 0 && !this.isView) {
      let body = {
        ngayKyDenNgay: null,
        id: 0,
        donViId: null,
        maDvi: null,
        namKeHoach: this.formData.value.namKeHoach ?? null,
        tenDvi: null,
        pageNumber: this.page,
        pageSize: this.pageSize,
        soQD: null,
        soQuyetDinh: null,
        trichYeu: null,
        ngayKyTuNgay: null,
        trangThai: null,
        capDvi: null,
      };
      let res = await this.deXuatDieuChinhService.timKiem(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          let item = {
            id: data.content[0].id,
            text: data.content[0].soVanBan,
          };
          this.dataDeXuat.push(item);
        }
        // else {
        //   this.dataDeXuat = [];
        //   this.notification.error(MESSAGE.ERROR, "Không tìm thấy đề xuất điều chỉnh của Cục.");
        // }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }


  openDialogDeXuatCuc() {
    if (this.id == 0 && !this.isView) {
      const modalQD = this.modal.create({
        nzTitle: 'Thông tin đề xuất của cục',
        nzContent: DialogQuyetDinhGiaoChiTieuComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          type: 'de-xuat',
          namKeHoach: this.formData.value.namKeHoach
        },
      });
      modalQD.afterClose.subscribe((data) => {
        if (data && !Array.isArray(data)) {
          let item = {
            id: data.id,
            text: data.soVanBan,
          };
          if (this.dataDeXuat && this.dataDeXuat.length > 0) {
            let findDeXuat = this.dataDeXuat.find(x => x.id == item.id);
            if (findDeXuat != null && findDeXuat.length > 0) {
              this.dataDeXuat.push(item);
            }
          } else {
            this.dataDeXuat = [];
            this.dataDeXuat.push(item);
          }
        }
        if (data && Array.isArray(data)) {
          this.dataDeXuat = [];
          data.forEach(it => {
            let item = {
              id: it.id,
              text: it.soVanBan,
            };
            this.dataDeXuat.push(item);
          });
        }
      });
    }
  }

  checkTrangThaiRecord(): boolean {
    return (
      this.dieuChinhThongTinChiTieuKHNam.trangThai == STATUS.CHO_DUYET_LDV || this.dieuChinhThongTinChiTieuKHNam.trangThai == STATUS.CHO_DUYET_LDC || this.dieuChinhThongTinChiTieuKHNam.trangThai == STATUS.BAN_HANH
    );
  }

  deleteDataDeXuatCuc(data: any) {
    if (this.id == 0 && !this.isView) {
      this.dataDeXuat = this.dataDeXuat.filter((x) => x.id != data.id);
    }
  }

  async selectedQdDcCTKHTC() {
    let body = {
      "namKeHoach": this.formData.value.namKeHoach,
      "trangThai": STATUS.BAN_HANH,
      "capDvi": "1",
      "loaiQuyetDinh": "01",
      "maDvi": this.userInfo.MA_DVI,
    };
    let res =
      await this.quyetDinhDieuChinhChiTieuKeHoachNamService.layDanhSach(
        body,
      );
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        this.dataDieuChinh = [];
        let item = {
          id: res.data[0].id,
          text: res.data[0].soQuyetDinh,
        };
        this.dataDieuChinh.push(item);
      }
      // else {
      //   this.notification.error(MESSAGE.ERROR, "Không tìm thấy quyết định điều chỉnh của Tổng Cục");
      // }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async selectedQdGiaoCTKHCuc() {
    let body = {
      "namKeHoach": this.formData.value.namKeHoach,
      "trangThai": STATUS.BAN_HANH,
      "capDvi": "2",
      "loaiQuyetDinh": "00",
      "maDvi": this.userInfo.MA_DVI
    };
    let res =
      await this.quyetDinhDieuChinhChiTieuKeHoachNamService.layDanhSach(
        body,
      );
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        this.dataDieuChinh = [];
        let item = {
          id: res.data[0].id,
          text: res.data[0].soQuyetDinh,
        };
        this.dataDieuChinh.push(item);
      } else {
        this.notification.error(MESSAGE.ERROR, "Không tìm thấy quyết định điều chỉnh của Tổng Cục");
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }


  openDialogQuyetDinhDieuChinh() {
    return;
    if (this.id == 0 && !this.isView) {
      const modalQD = this.modal.create({
        nzTitle: 'Thông tin điều chỉnh của cục',
        nzContent: DialogQuyetDinhGiaoChiTieuComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          type: 'dieu-chinh',
          namKeHoach: this.yearNow,
          isDexuat: true,
        },
      });
      modalQD.afterClose.subscribe((data) => {
        if (data) {
          this.dataDieuChinh = [];
          let item = {
            id: data.id,
            text: data.soVanBan,
          };
          this.dataDieuChinh.push(item);
        }
      });
    }
  }

  deleteDataDieuChinh(data: any) {
    if (this.id == 0 && !this.isView) {
      this.dataDieuChinh = this.dataDieuChinh.filter((x) => x.id != data.id);
    }
  }


  selectDonViVatTuNew(vatTu, type) {
    if (type == 'nhap') {
      this.keHoachVatTuNhapCreate.maDvi = vatTu.maDvi;
      this.keHoachVatTuNhapCreate.donViId = vatTu.id;
    } else if (type == 'xuat') {
      this.keHoachVatTuXuatCreate.maDvi = vatTu.maDvi;
      this.keHoachVatTuXuatCreate.donViId = vatTu.id;
    }
  }

  selectDonViKeyDown(event, type) {
    const donVi = this.optionsDonVi.find(
      (donVi) => donVi.tenDvi === event.nzValue.trim(),
    );
    if (donVi) {
      switch (type) {
        case 'kh-vat-tu':
          this.selectDonViVatTuSelect(donVi);
          break;
        default:
          break;
      }
    }
  }

  selectDonViVatTuSelect(vatTu) {
    this.isAddVatTu = true;
    this.keHoachVatTuCreate.maDvi = vatTu.maDvi;
    this.keHoachVatTuCreate.tenDonVi = vatTu.tenDvi;
    this.keHoachVatTuCreate.donViId = vatTu.id;
    if (this.keHoachVatTuCreate.maHang) {
      this.getTonKhoDauNam();
    }
  }

  getTonKhoDauNam() {
    this.chiTieuKeHoachNamCapTongCucService
      .tonKhoDauNam({
        maDvi: this.keHoachVatTuCreate.maDvi,
        maVthhList: [this.keHoachVatTuCreate.vatTuThietBi[0].maVatTuCha],
      })
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          res?.data.forEach((tonKho) => {
            switch (tonKho.nam) {
              case (this.yearNow - 1).toString():
                this.keHoachVatTuCreate.chiTieuNhapCacNamTruoc[0].soLuong =
                  tonKho.slHienThoi;
                break;
              case (this.yearNow - 2).toString():
                this.keHoachVatTuCreate.chiTieuNhapCacNamTruoc[1].soLuong =
                  tonKho.slHienThoi;
                break;
              case (this.yearNow - 3).toString():
                this.keHoachVatTuCreate.chiTieuNhapCacNamTruoc[2].soLuong =
                  tonKho.slHienThoi;
                break;
              default:
                break;
            }
            this.keHoachVatTuCreate.tongChiTieuCacnamTruoc =
              this.keHoachVatTuCreate.chiTieuNhapCacNamTruoc[0].soLuong +
              this.keHoachVatTuCreate.chiTieuNhapCacNamTruoc[1].soLuong +
              this.keHoachVatTuCreate.chiTieuNhapCacNamTruoc[2].soLuong;
          });
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }

  selectTenHangNew(vatTu, type) {
    if (type == 'nhap') {
      if (this.keHoachVatTuNhapCreate.maDvi) {
        this.isAddVatTu = true;
        //this.getTonKhoDauNam();
      }
      this.dataVatTuConClone = vatTu.child;
      this.dataVatTuConShow = this.dataVatTuConClone;
      this.keHoachVatTuNhapCreate.dsVatTu[0].tenVatTu = '';
      this.keHoachVatTuNhapCreate.dsVatTu[0].maVatTu = '';
      this.keHoachVatTuNhapCreate.dsVatTu[0].kyHieu = vatTu.kyHieu;
      this.keHoachVatTuNhapCreate.dsVatTu[0].maHang = vatTu.maHang;
      this.keHoachVatTuNhapCreate.dsVatTu[0].donViTinh = vatTu.donViTinh;
      this.keHoachVatTuNhapCreate.dsVatTu[0].maVatTuCha = vatTu.maHang;
      this.keHoachVatTuNhapCreate.dsVatTu[0].vatTuChaId = vatTu.id;
    } else if (type == 'xuat') {
      if (this.keHoachVatTuXuatCreate.maDvi) {
        this.isAddVatTu = true;
        //this.getTonKhoDauNam();
      }
      this.dataVatTuConClone = vatTu.child;
      this.dataVatTuConShow = this.dataVatTuConClone;
      this.keHoachVatTuXuatCreate.dsVatTu[0].kyHieu = vatTu.kyHieu;
      this.keHoachVatTuXuatCreate.dsVatTu[0].maHang = vatTu.maHang;
      this.keHoachVatTuXuatCreate.dsVatTu[0].donViTinh = vatTu.donViTinh;
      this.keHoachVatTuXuatCreate.dsVatTu[0].maVatTuCha = vatTu.maHang;
      this.keHoachVatTuXuatCreate.dsVatTu[0].vatTuChaId = vatTu.id;
    }
  }


  selectChungLoaiHangNew(chungLoaiHang, type) {
    if (type == 'nhap') {
      if (this.keHoachVatTuNhapCreate.maDvi) {
        this.isAddVatTu = true;
      }
      this.keHoachVatTuNhapCreate.dsVatTu[0].donViTinh = chungLoaiHang.donViTinh;
      this.keHoachVatTuNhapCreate.dsVatTu[0].maHang = chungLoaiHang.maHang;
      this.keHoachVatTuNhapCreate.dsVatTu[0].maVatTu = chungLoaiHang.maHang;
      this.keHoachVatTuNhapCreate.dsVatTu[0].kyHieu = chungLoaiHang.kyHieu;
      this.keHoachVatTuNhapCreate.dsVatTu[0].vatTuId = chungLoaiHang.id;
    } else if (type == 'xuat') {
      if (this.keHoachVatTuXuatCreate.maDvi) {
        this.isAddVatTu = true;
      }
      this.keHoachVatTuXuatCreate.dsVatTu[0].donViTinh = chungLoaiHang.donViTinh;
      this.keHoachVatTuXuatCreate.dsVatTu[0].maHang = chungLoaiHang.maHang;
      this.keHoachVatTuXuatCreate.dsVatTu[0].maVatTu = chungLoaiHang.maHang;
      this.keHoachVatTuXuatCreate.dsVatTu[0].kyHieu = chungLoaiHang.kyHieu;
      this.keHoachVatTuXuatCreate.dsVatTu[0].vatTuId = chungLoaiHang.id;
    }
  }

  selectTenHangEditNew(index, index1, vatTu, type) {
    if (type == 'nhap') {
      this.dataVatTuConClone = vatTu.child;
      this.dataVatTuConEditNhapShow[index] = this.dataVatTuConClone;
      this.dataVatTuNhapEdit[index].dsVatTu[index1].tenVatTu = '';
      this.dataVatTuNhapEdit[index].dsVatTu[index1].maVatTu = '';
      this.dataVatTuNhapEdit[index].dsVatTu[index1].kyHieu = vatTu.kyHieu;
      this.dataVatTuNhapEdit[index].dsVatTu[index1].maHang = vatTu.maHang;
      this.dataVatTuNhapEdit[index].dsVatTu[index1].donViTinh = vatTu.donViTinh;
      this.dataVatTuNhapEdit[index].dsVatTu[index1].maVatTuCha = vatTu.maHang;
      this.dataVatTuNhapEdit[index].dsVatTu[index1].vatTuChaId = vatTu.id;
    } else if (type == 'xuat') {
      if (this.keHoachVatTuXuatCreate.maDvi) {
        this.isAddVatTu = true;
        //this.getTonKhoDauNam();
      }
      this.dataVatTuConClone = vatTu.child;
      this.dataVatTuConEditXuatShow[index] = this.dataVatTuConClone;
      this.dataVatTuXuatEdit[index].dsVatTu[index1].tenVatTu = '';
      this.dataVatTuXuatEdit[index].dsVatTu[index1].maVatTu = '';
      this.dataVatTuXuatEdit[index].dsVatTu[index1].kyHieu = vatTu.kyHieu;
      this.dataVatTuXuatEdit[index].dsVatTu[index1].maHang = vatTu.maHang;
      this.dataVatTuXuatEdit[index].dsVatTu[index1].donViTinh = vatTu.donViTinh;
      this.dataVatTuXuatEdit[index].dsVatTu[index1].maVatTuCha = vatTu.maHang;
      this.dataVatTuXuatEdit[index].dsVatTu[index1].vatTuChaId = vatTu.id;
    }
  }

  themVatTu(type) {
    if (type == 'nhap') {
      if (this.keHoachVatTuNhapCreate.tenDvi && this.keHoachVatTuNhapCreate.dsVatTu.length) {
        let dataExists = this.dataVatTuNhap.find(s => s.tenDvi == this.keHoachVatTuNhapCreate.tenDvi);
        let indexExists = this.dataVatTuNhap.findIndex(s => s.tenDvi == this.keHoachVatTuNhapCreate.tenDvi);
        if (dataExists) {
          //ton tai vthh va cloai
          let find = dataExists.dsVatTu.find(s => s.maVatTuCha == this.keHoachVatTuNhapCreate.dsVatTu[0].maVatTuCha &&
            s.maVatTu == this.keHoachVatTuNhapCreate.dsVatTu[0].maVatTu);
          if (find) {
            this.notification.error(MESSAGE.ALERT, 'Loại và chủng loại hàng hóa đã tồn tại.')
          } else {
            dataExists.dsVatTu.push(this.keHoachVatTuNhapCreate.dsVatTu[0]);
            this.dataVatTuNhap.splice(indexExists, 1, dataExists);
            this.dataVatTuNhapEdit = this.dataVatTuNhap;
            this.keHoachVatTuNhapCreate = new KeHoachVatTuCustom();
          }
        } else {
          this.keHoachVatTuNhapCreate.sttDonVi = this.dataVatTuNhap.length + 1;
          this.dataVatTuNhap = [...this.dataVatTuNhap, this.keHoachVatTuNhapCreate]
          this.dataVatTuNhapEdit = this.dataVatTuNhap;
          this.expandSetVatTuNhap.add(this.keHoachVatTuNhapCreate.maDvi);
          this.keHoachVatTuNhapCreate = new KeHoachVatTuCustom();
        }
      }
    } else if (type == 'xuat') {
      if (this.keHoachVatTuXuatCreate.tenDvi && this.keHoachVatTuXuatCreate.dsVatTu.length) {
        let dataExists = this.dataVatTuXuat.find(s => s.tenDvi == this.keHoachVatTuXuatCreate.tenDvi);
        let indexExists = this.dataVatTuXuat.findIndex(s => s.tenDvi == this.keHoachVatTuXuatCreate.tenDvi);
        if (dataExists) {
          //ton tai vthh va cloai
          let find = dataExists.dsVatTu.find(s => s.maVatTuCha == this.keHoachVatTuXuatCreate.dsVatTu[0].maVatTuCha &&
            s.maVatTu == this.keHoachVatTuXuatCreate.dsVatTu[0].maVatTu);
          if (find) {
            this.notification.error(MESSAGE.ALERT, 'Loại và chủng loại hàng hóa đã tồn tại.')
          } else {
            dataExists.dsVatTu.push(this.keHoachVatTuXuatCreate.dsVatTu[0]);
            this.dataVatTuXuat.splice(indexExists, 1, dataExists);
            this.dataVatTuXuatEdit = this.dataVatTuXuat;
            this.keHoachVatTuXuatCreate = new KeHoachVatTuCustom();
          }
        } else {
          this.keHoachVatTuXuatCreate.sttDonVi = this.dataVatTuXuat.length + 1;
          this.dataVatTuXuat = [...this.dataVatTuXuat, this.keHoachVatTuXuatCreate]
          this.dataVatTuXuatEdit = this.dataVatTuXuat;
          this.expandSetVatTuXuat.add(this.keHoachVatTuXuatCreate.maDvi);
          this.keHoachVatTuXuatCreate = new KeHoachVatTuCustom();
        }
      }
    }
  }


  suaVatTu(index: any, index1: any, type: string) {
    if (type == 'nhap') {
      let data = this.dataVatTuNhapEdit[index].dsVatTu[index1];
      data.isEdit = true;
    } else if (type == 'xuat') {
      let data = this.dataVatTuXuatEdit[index].dsVatTu[index1];
      data.isEdit = true;
    }
  }

  xoaVatTu(index: any, index1: any, type: string) {
    if (type == 'nhap') {
      this.dataVatTuNhap[index].dsVatTu.splice(index1, 1);
      if (!this.dataVatTuNhap[index].dsVatTu?.length) {
        this.dataVatTuNhap.splice(index, 1);
      }
    } else if (type == 'xuat') {
      this.dataVatTuXuat[index].dsVatTu.splice(index1, 1);
      if (!this.dataVatTuXuat[index].dsVatTu?.length) {
        this.dataVatTuXuat.splice(index, 1);
      }
    }
  }

  luuSuaVatTu(index: any, index1: any, type: string) {
    if (type == 'nhap') {
      this.dataVatTuNhap = this.dataVatTuNhapEdit;
      this.dataVatTuNhapEdit[index].dsVatTu[index1].isEdit = false;
    } else if (type == 'xuat') {
      this.dataVatTuXuat = this.dataVatTuXuat;
      this.dataVatTuXuatEdit[index].dsVatTu[index1].isEdit = false;
    }
  }

  huySuaVatTu(index: any, index1: any, type: string) {
    if (type == 'nhap') {
      this.dataVatTuNhapEdit[index].dsVatTu[index1].isEdit = false;
    } else if (type == 'xuat') {
      this.dataVatTuXuatEdit[index].dsVatTu[index1].isEdit = false;
    }
  }

  selectChungLoaiHangEditNew(index, index1, chungLoaiHang, type) {
    if (type == 'nhap') {
      if (this.keHoachVatTuNhapCreate.maDvi) {
        this.isAddVatTu = true;
      }
      this.dataVatTuNhapEdit[index].dsVatTu[index1].donViTinh = chungLoaiHang.donViTinh;
      this.dataVatTuNhapEdit[index].dsVatTu[index1].maHang = chungLoaiHang.maHang;
      this.dataVatTuNhapEdit[index].dsVatTu[index1].maVatTu = chungLoaiHang.maHang;
      this.dataVatTuNhapEdit[index].dsVatTu[index1].kyHieu = chungLoaiHang.kyHieu;
      this.dataVatTuNhapEdit[index].dsVatTu[index1].vatTuId = chungLoaiHang.id;
    } else if (type == 'xuat') {
      if (this.keHoachVatTuXuatCreate.maDvi) {
        this.isAddVatTu = true;
      }
      this.dataVatTuXuatEdit[index].dsVatTu[index1].donViTinh = chungLoaiHang.donViTinh;
      this.dataVatTuXuatEdit[index].dsVatTu[index1].maHang = chungLoaiHang.maHang;
      this.dataVatTuXuatEdit[index].dsVatTu[index1].maVatTu = chungLoaiHang.maHang;
      this.dataVatTuXuatEdit[index].dsVatTu[index1].kyHieu = chungLoaiHang.kyHieu;
      this.dataVatTuXuatEdit[index].dsVatTu[index1].vatTuId = chungLoaiHang.id;
    }
  }

  //vat tu moi
  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetVatTuNhap.add(id);
    } else {
      this.expandSetVatTuNhap.delete(id);
    }
  }

  viewVbKhongBanHanh() {
    const modalKhongBanHanh = this.modal.create({
      nzTitle: 'THÔNG BÁO KHÔNG BAN HÀNH',
      nzContent: DialogKhongBanHanhComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {dataQĐ: this.dieuChinhThongTinChiTieuKHNam, isView: false},
    });
    modalKhongBanHanh.afterClose.subscribe(async (dataKhongBanHanh) => {
      if (dataKhongBanHanh) {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDo: dataKhongBanHanh.lyDo,
            noiDung: dataKhongBanHanh.noiDung,
            ngayKy: dataKhongBanHanh.ngayKy,
            trangThai: STATUS.KHONG_BAN_HANH,
            soVanVan: dataKhongBanHanh.soVanBan,
            vanBanDinhKemReqs: dataKhongBanHanh.vanBanDinhKems
          };
          let res =
            await this.quyetDinhDieuChinhChiTieuKeHoachNamService.cancelBanHanh(
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
}
