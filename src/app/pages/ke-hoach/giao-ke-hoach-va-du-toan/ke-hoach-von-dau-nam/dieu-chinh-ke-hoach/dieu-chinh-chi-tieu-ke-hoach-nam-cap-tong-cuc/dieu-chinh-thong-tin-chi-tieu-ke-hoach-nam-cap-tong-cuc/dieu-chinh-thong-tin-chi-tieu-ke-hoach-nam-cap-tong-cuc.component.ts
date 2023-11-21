import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { chain, cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogLuaChonInComponent } from 'src/app/components/dialog/dialog-lua-chon-in/dialog-lua-chon-in.component';
import {
  DialogQuyetDinhGiaoChiTieuComponent
} from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import {
  DialogThemThongTinMuoiComponent
} from 'src/app/components/dialog/dialog-them-thong-tin-muoi/dialog-them-thong-tin-muoi.component';
import {
  DialogThemThongTinVatTuTrongNamComponent
} from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/dialog-them-thong-tin-vat-tu-trong-nam.component';
import {
  DialogThongTinLuongThucComponent
} from 'src/app/components/dialog/dialog-thong-tin-luong-thuc/dialog-thong-tin-luong-thuc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { LEVEL, LEVEL_USER, LOAI_QD_CTKH, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { ItemDetail } from 'src/app/models/itemDetail';
import { KeHoachLuongThuc } from 'src/app/models/KeHoachLuongThuc';
import { KeHoachMuoi } from 'src/app/models/KeHoachMuoi';
import { KeHoachVatTu, KeHoachVatTuCustom, KhVatTu, VatTuThietBi } from 'src/app/models/KeHoachVatTu';
import { ThongTinChiTieuKeHoachNam } from 'src/app/models/ThongTinChiTieuKHNam';
import { UserLogin } from 'src/app/models/userlogin';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from "uuid";
import { STATUS } from "../../../../../../../constants/status";
import { QuyetDinhBtcTcdtService } from "../../../../../../../services/quyetDinhBtcTcdt.service";
import { QuanLyHangTrongKhoService } from "../../../../../../../services/quanLyHangTrongKho.service";
import { QuyetDinhTtcpService } from "../../../../../../../services/quyetDinhTtcp.service";
import { AMOUNT_THREE_DECIMAL, AMOUNT_TWO_DECIMAL } from "../../../../../../../Utility/utils";
import { CurrencyMaskInputMode } from "ngx-currency";
import {
  ThemSuaMuaTangComponent
} from "../../../quyet-dinh/btc-giao-tcdt/them-quyet-dinh-btc-giao-tcdt/ke-hoach-mua-tang/them-sua-mua-tang/them-sua-mua-tang.component";
import {
  ThemSuaKeHoachVatTuComponent
} from "../../../chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/them-sua-ke-hoach-vat-tu/them-sua-ke-hoach-vat-tu.component";
import {
  TAB_SELECTED
} from "../../../chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam.constant";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { FILETYPE, PREVIEW } from "../../../../../../../constants/fileType";
import { QuyetDinhDieuChinhCTKHService } from 'src/app/services/dieu-chinh-chi-tieu-ke-hoach/quyet-dinh-dieu-chinh-ctkh';
import { DeXuatDieuChinhCTKHService } from 'src/app/services/dieu-chinh-chi-tieu-ke-hoach/de-xuat-dieu-chinh-ctkh';
import { PhuongAnDieuChinhCTKHService } from 'src/app/services/dieu-chinh-chi-tieu-ke-hoach/phuong-an-dieu-chinh-ctkh';
import printJS from 'print-js';

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
  @Input() isViewDetail: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  maQd: string
  options: any[] = [];
  optionsDonVi: any[] = [];
  STATUS = STATUS;
  tabSelected: string = TAB_SELECTED.luongThuc;
  detail = {
    soQD: null,
    ngayKy: null,
    ngayHieuLuc: null,
    namKeHoach: null,
    trichYeu: null,
  };
  sumTotalKhDuTruMuoi = {
    tonKhoDauNam: 0,
    nhapTrongNam: 0,
    xuatTrongNamMuoi: 0,
    tonKhoCuoiNam: 0,
  };
  sumTotalKhDuTruLuongThuc: any = {};
  tab = TAB_SELECTED;
  yearNow: number = 0;
  thongTinChiTieuKeHoachNam: any = {};
  thongTinChiTieuKeHoachNamInput: any = {};
  tableExist: boolean = false;
  keHoachLuongThucDialog: KeHoachLuongThuc;
  keHoachMuoiDialog: KeHoachMuoi;
  keHoachVatTuDialog: KeHoachVatTu;
  fileDinhKem: string = null;
  qdTCDT: string = "/QĐ-TCDT";
  formData: FormGroup;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  listNam: any[] = [];
  mapOfExpandedData: { [key: string]: any[] } = {};
  dsKeHoachLuongThuc: Array<any> = [];
  dsKeHoachLuongThucClone: Array<any> = [];
  dsMuoi: Array<any> = [];
  dsVatTuNhap: Array<any> = [];
  dsVatTuXuat: Array<any> = [];
  dsMuoiClone: Array<any> = [];
  dsVatTuClone: Array<any> = [];
  keHoachLuongThucCreate: any;
  isAddLuongThuc: boolean = false;
  keHoachMuoiCreate: any;
  isAddMuoi: boolean = false;
  isAddVatTu: boolean = false;
  dataVatTuCha: any[] = [];
  dataVatTuChaShow: any[] = [];
  dataVatTuCon: any[] = [];
  dataVatTuConClone: any[] = [];
  lastBreadcrumb: string;
  fileDinhKems: any[] = [];
  listCcPhapLy: any[] = [];
  listFile: any[] = [];
  page: number = 1;
  pageSize: number = 100;
  totalRecord: number = 0;
  userInfo: UserLogin;
  //dialog
  openSelectCanCu: any;
  canCuData: any;
  allChecked = false;
  indeterminate = false;
  // dsCanCu: Array<{ label: string; value: string }> = [];
  dataVatTuNhap: any[] = [];
  dataVatTuNhapTree: any[] = []
  dataVatTuXuat: any[] = []
  dataVatTuXuatTree: any[] = []
  expandSetVatTuNhap = new Set<string>();
  arrayDonVi: any[] = [];
  dataQdCanCu: any;
  dataQdTCDTGiaoCuc: any;
  expandSet = new Set<number>();
  AMOUNT = {
    allowZero: true,
    allowNegative: false,
    precision: 3,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "right",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }
  LOAI_QD = LOAI_QD_CTKH;

  listDeXuat: any[] = [];
  listNamKH: any[] = [];
  subTabVatTu = 0;
  subTab = '';

  //xem trước
  pdfSrc: any;
  wordSrc: any;
  excelSrc: any;
  printSrc: any;
  pdfBlob: any;
  excelBlob: any;
  showDlgPreview = false;
  showDlgPreviewTheoCuc = false;

  constructor(
    private router: Router,
    private routerActive: ActivatedRoute,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private donViService: DonviService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private uploadFileService: UploadFileService,
    public userService: UserService,
    public quyetDinhBtcTcdtService: QuyetDinhBtcTcdtService,
    private quyetDinhTtcpService: QuyetDinhTtcpService,
    public quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    public phuongAnDieuChinhCTKHService: PhuongAnDieuChinhCTKHService,
    private deXuatDieuChinhCTKHService: DeXuatDieuChinhCTKHService,
    private quyetDinhDieuChinhCTKHService: QuyetDinhDieuChinhCTKHService,
  ) {
    this.initForm();
  }

  async ngOnInit(): Promise<void> {
    this.yearNow = dayjs().get('year');
    for (let i = -3; i < 5; i++) {
      this.listNam.push({
        value: this.yearNow + i,
        text: this.yearNow + i,
      });
    }
    this.listNamKH = [(this.yearNow - 3), (this.yearNow - 2), (this.yearNow - 1)]
    this.userInfo = this.userService.getUserLogin();

    if (this.userInfo) {
      this.qdTCDT = this.userInfo.MA_QD;
      this.formData.patchValue({
        tenDonVi: this.userInfo.TEN_DVI,
        cap: this.userInfo.CAP_DVI
      })
    }


    await this.loadDonVi(),
      await Promise.all([
        this.loadDanhMucHang(),
      ]);


    if (this.id > 0) {
      await this.loadThongTinChiTieuKeHoachNam(this.id);
    } else {
      this.thongTinChiTieuKeHoachNam.cap = this.userInfo.CAP_DVI;
      this.thongTinChiTieuKeHoachNam.trangThai = STATUS.DANG_NHAP_DU_LIEU;



    }

    if (this.userService.isCuc()) {
      await this.findCanCuByYearCuc(this.yearNow)
    }

    await this.findCanCuByYear(this.yearNow);

  }



  isTongCuc() {
    return this.userService.isTongCuc()
  }

  isCuc() {
    return this.userService.isCuc()
  }

  async getDSDXDC(year) {
    const body = {
      namKeHoach: year,
      trangThai: STATUS.DA_DUYET_LDC
    }

    let res = await this.deXuatDieuChinhCTKHService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data
      if (data) {
        const dsDX = data.content
        this.listDeXuat = dsDX.map((dx) => dx.soDeXuat)

      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR)
    }
  }

  async getPhuongAn(soQD) {

    const body = {
      namKeHoach: this.yearNow,
      soQuyetDinh: soQD
    }

    let res = await this.phuongAnDieuChinhCTKHService.getPhuongAn(body)
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data
      if (data) {
        this.formData.patchValue({
          soCongVan: data.soCongVan,
          soQuyetDinhDcCuaC: data.soQuyetDinhDcCuaC
        });
        if (this.userService.isTongCuc()) {
          this.dsKeHoachLuongThucClone = data.dcKeHoachNamLtDtl.map((khlt) => {

            // gạo tồn
            const tkdnGao = khlt.dcKeHoachNamLtTtDtl.filter((tk) => tk.type == "01").map((item) => {
              return {
                ...item,
                keHoachDieuChuyenLtDtlId: undefined,
                id: undefined
              }
            })

            // thóc tồn
            const tkdnThoc = khlt.dcKeHoachNamLtTtDtl.filter((tk) => tk.type == "00").map((item) => {
              return {
                ...item,
                keHoachDieuChuyenLtDtlId: undefined,
                id: undefined
              }
            })

            // gạo nhập trong năm
            const ntnGao = khlt.dcKeHoachNamLtTtDtl.filter((tk) => tk.type == "11").map((item) => {
              return {
                ...item,
                keHoachDieuChuyenLtDtlId: undefined,
                id: undefined
              }
            })

            // thóc nhập trong năm
            const ntnThoc = khlt.dcKeHoachNamLtTtDtl.filter((tk) => tk.type == "10").map((item) => {
              return {
                ...item,
                keHoachDieuChuyenLtDtlId: undefined,
                id: undefined
              }
            })

            // gạo xuất trong năm
            let xtnGao = khlt.dcKeHoachNamLtTtDtl.filter((tk) => tk.type == "21").map((item) => {
              return {
                ...item,
                keHoachDieuChuyenLtDtlId: undefined,
                id: undefined
              }
            })

            // thóc xuất trong năm
            let xtnThoc = khlt.dcKeHoachNamLtTtDtl.filter((tk) => tk.type == "20").map((item) => {
              return {
                ...item,
                keHoachDieuChuyenLtDtlId: undefined,
                id: undefined
              }
            })

            // gạo tồn kho cuối kỳ
            const tkcnGao = khlt.dcKeHoachNamLtTtDtl.filter((tk) => tk.type == "31").map((item) => {
              return {
                ...item,
                keHoachDieuChuyenLtDtlId: undefined,
                id: undefined
              }
            })
            // thóc tông kho cuối kỳ
            const tkcnThoc = khlt.dcKeHoachNamLtTtDtl.filter((tk) => tk.type == "30").map((item) => {
              return {
                ...item,
                keHoachDieuChuyenLtDtlId: undefined,
                id: undefined
              }
            })



            const dcKeHoachNamLtTtDtl = [...tkdnGao, ...tkdnThoc, ...ntnGao, ...ntnThoc, ...xtnGao, ...xtnThoc, ...tkcnGao, ...tkcnThoc]


            return {
              ...khlt,
              id: undefined,
              hdrId: undefined,
              dcKeHoachNamLtTtDtl,
              tkdnGao,
              tkdnThoc,
              ntnGao,
              ntnThoc,
              xtnGao,
              xtnThoc,
              tkcnGao,
              tkcnThoc
            }
          })

          this.dsKeHoachLuongThucClone = cloneDeep(this.dsKeHoachLuongThucClone)
          this.sumRowDetailLuongThuc();

          this.dsMuoiClone = data.dcKeHoachNamMuoiDtl.map((item) => {
            return {
              ...item,
              hdrId: undefined,
              id: undefined
            }
          })
          this.dsMuoiClone = cloneDeep(this.dsMuoiClone)
          this.sumRowDetailMuoi()

          this.dataVatTuNhap = data.dcKeHoachNamVatTuDtl.filter((vt) => vt.loai == "NHAP").map((item) => {
            return {
              ...item,
              hdrId: undefined,
              id: undefined
            }
          })
          this.dataVatTuXuat = data.dcKeHoachNamVatTuDtl.filter((vt) => vt.loai == "XUAT").map((item) => {
            return {
              ...item,
              hdrId: undefined,
              id: undefined
            }
          })

          this.dataVatTuNhap = cloneDeep(this.dataVatTuNhap)
          this.dataVatTuXuat = cloneDeep(this.dataVatTuXuat)

          this.convertListDataVatTuNhap(this.dataVatTuNhap);
          this.convertListDataVatTuXuat(this.dataVatTuXuat);
          this.expandAll(this.dataVatTuNhapTree);
          this.expandAllVatTuXuat(this.dataVatTuXuatTree);
        }

      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR)
    }
  }

  async getDeXuat(soQD) {

    const body = {
      namKeHoach: this.yearNow,
      soQuyetDinh: soQD
    }

    let res = await this.deXuatDieuChinhCTKHService.getDeXuat(body)
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data
      if (data) {
        this.formData.patchValue({
          soCongVan: data.soDeXuat
        });

      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR)
    }
  }

  async findCanCuByYear(year: number) {
    if (year) {
      const body = {
        namKeHoach: year
      }

      let res = await this.chiTieuKeHoachNamService.loadThongTinChiTieuKeHoachTongCucGiao(body)
      if (res.msg == MESSAGE.SUCCESS) {

        let data = res.data
        if (data) {


          // Lấy kế hoạch tổng cục giao cho cục đang login
          let dataLuongThuc = this.isTongCuc() ? data.khLuongThuc : data.khLuongThuc.filter((kh) => kh.maDonVi == this.userInfo.MA_DVI);
          const ntnThoc = dataLuongThuc.reduce((prev, cur) => prev + cur.ntnThoc, 0)
          const ntnGao = dataLuongThuc.reduce((prev, cur) => prev + cur.ntnGao, 0)
          const xtnTongThoc = dataLuongThuc.reduce((prev, cur) => prev + cur.xtnTongThoc, 0)
          const xtnTongGao = dataLuongThuc.reduce((prev, cur) => prev + cur.xtnTongGao, 0)

          let dataMuoi = this.isTongCuc() ? data.khMuoiDuTru : data.khMuoiDuTru.filter((kh) => kh.maDonVi == this.userInfo.MA_DVI);
          const tonKhoDauNam = dataMuoi.reduce((prev, cur) => prev + cur.tonKhoDauNam, 0)
          const nhapTrongNam = dataMuoi.reduce((prev, cur) => prev + cur.nhapTrongNam, 0)
          const xuatTrongNamMuoi = dataMuoi.reduce((prev, cur) => prev + cur.xuatTrongNamMuoi, 0)
          const tonKhoCuoiNam = dataMuoi.reduce((prev, cur) => prev + cur.tonKhoCuoiNam, 0)

          const dsLT = dataLuongThuc.map((khlt) => {

            // gạo tồn
            const tkdnGao = this.listNamKH.map((nkh) => {
              const tdk = khlt.tkdnGao.find((item) => item.nam == nkh)
              return {
                namKeHoach: nkh,
                soLuong: tdk ? tdk.soLuong : 0,
                type: "01",
              }
            })

            // thóc tồn
            const tkdnThoc = this.listNamKH.map((nkh) => {
              const tdk = khlt.tkdnThoc.find((item) => item.nam == nkh)
              return {
                namKeHoach: nkh,
                soLuong: tdk ? tdk.soLuong : 0,
                type: "00",
              }
            })

            // gạo nhập trong năm
            const ntnGao = [{
              namKeHoach: "",
              soLuong: khlt.ntnGao,
              type: "11",
            }]
            // thóc nhập trong năm
            const ntnThoc = [
              {
                namKeHoach: "",
                soLuong: khlt.ntnThoc,
                type: "10",
              }
            ]

            // gạo xuất trong năm
            let xtnGao = this.listNamKH.map((nkh) => {
              const xtn = khlt.xtnGao.find((item) => item.nam == nkh)
              return {
                namKeHoach: nkh,
                soLuong: xtn ? xtn.soLuong : 0,
                type: "21",
              }
            })

            // thóc xuất trong năm
            let xtnThoc = this.listNamKH.map((nkh) => {
              const xtn = khlt.xtnThoc.find((item) => item.nam == nkh)
              return {
                namKeHoach: nkh,
                soLuong: xtn ? xtn.soLuong : 0,
                type: "20",
              }
            })

            // gạo tồn kho cuối kỳ
            const tkcnGao = [{
              namKeHoach: "",
              soLuong: khlt.tkcnTongGao,
              type: "31",
            }]
            // thóc tông kho cuối kỳ
            const tkcnThoc = [
              {
                namKeHoach: "",
                soLuong: khlt.tkcnTongThoc,
                type: "30",
              }
            ]



            const dcKeHoachNamLtTtDtl = [...tkdnGao, ...tkdnThoc, ...ntnGao, ...ntnThoc, ...xtnGao, ...xtnThoc, ...tkcnGao, ...tkcnThoc]


            return {
              donViTinh: khlt.donViTinh,
              maDvi: khlt.maDonVi,
              tenDvi: khlt.tenDonvi,
              tongSoCuoiNam: khlt.tkcnTongSoQuyThoc,
              tongSoTon: khlt.tkdnTongSoQuyThoc,
              tongGaoTon: khlt.tkdnTongGao,
              tongThocTon: khlt.tkdnTongThoc,
              tongSoXuat: khlt.xtnTongSoQuyThoc,
              tongGaoXuat: khlt.xtnTongGao,
              tongThocXuat: khlt.xtnTongThoc,
              tongSoNhap: khlt.ntnTongSoQuyThoc,
              dcKeHoachNamLtTtDtl,
              tkdnGao,
              tkdnThoc,
              ntnGao,
              ntnThoc,
              xtnGao,
              xtnThoc,
              tkcnGao,
              tkcnThoc
            }
          })

          const dsMuoi = dataMuoi.map((khmuoi) => {
            return {
              donViTinh: khmuoi.donViTinh,
              maDvi: khmuoi.maDonVi,
              stt: khmuoi.stt,
              tenDvi: khmuoi.tenDonVi,
              soLuongNhap: khmuoi.nhapTrongNam,
              soLuongXuat: khmuoi.xuatTrongNamMuoi,
              tonKhoCuoiNam: khmuoi.tonKhoDauNam,
              tonKhoDauNam: khmuoi.tonKhoCuoiNam,
            }
          })

          const khVatTuNhap = data.khVatTuNhap.map((vattu) => {
            return {
              ...vattu,
              id: undefined,
              loai: "NHAP",
            }
          })
          const khVatTuXuat = data.khVatTuXuat.map((vattu) => {
            return {
              ...vattu,
              id: undefined,
              loai: "XUAT",
            }
          })

          if (this.isTongCuc()) {
            this.dsKeHoachLuongThuc = dsLT
            this.dsMuoi = dsMuoi
            this.dsVatTuNhap = khVatTuNhap
            this.dsVatTuXuat = khVatTuXuat
          }



          if (this.id) return

          this.formData.patchValue({
            soQuyetDinhGiaoCuaTc: data.soQuyetDinh,
            quyetDinhGiaoCuaTcId: data.id,
            soQuyetDinhDcCuaCs: data.soQuyetDinhDcCuaC
          });

          this.formData.patchValue({
            slThocNhap: ntnThoc,
            slGaoNhap: ntnGao,
            slTongXuatThoc: xtnTongThoc,
            slTongXuatGao: xtnTongGao,
            slTonKhoDauNam: tonKhoDauNam,
            slNhapTrongNam: nhapTrongNam,
            slXuatTrongNam: xuatTrongNamMuoi,
            slTonKhoCuoiNam: tonKhoCuoiNam
          })

          if (this.isTongCuc()) {


            this.dsKeHoachLuongThucClone = dsLT
            this.dsKeHoachLuongThucClone = cloneDeep(this.dsKeHoachLuongThucClone)

            this.sumRowDetailLuongThuc();


            this.dsMuoiClone = dsMuoi
            this.dsMuoiClone = cloneDeep(this.dsMuoiClone)
            this.sumRowDetailMuoi()



            this.dataVatTuNhap = khVatTuNhap
            this.dataVatTuXuat = khVatTuXuat

            this.dataVatTuNhap = cloneDeep(this.dataVatTuNhap)
            this.dataVatTuXuat = cloneDeep(this.dataVatTuXuat)

            this.convertListDataVatTuNhap(this.dataVatTuNhap);
            this.convertListDataVatTuXuat(this.dataVatTuXuat);
            this.expandAll(this.dataVatTuNhapTree);
            this.expandAllVatTuXuat(this.dataVatTuXuatTree);

            await this.getPhuongAn(data.soQuyetDinh)
          } else {
            await this.getDeXuat(data.soQdDcChiTieu)
          }

        }
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR)
      }
    }

  }

  async findCanCuByYearCuc(year: number) {
    if (year) {

      let res = await this.chiTieuKeHoachNamService.loadThongTinChiTieuKeHoachCucNam(year)
      if (res.msg == MESSAGE.SUCCESS) {

        let data = res.data
        if (data) {
          this.dataQdTCDTGiaoCuc = {};
          this.formData.patchValue({
            soQuyetDinhGiaoNam: data.soQuyetDinh,
            quyetDinhGiaoNamId: data.id
          });
          let dataLuongThuc = data.khLuongThuc;
          let dsLT = dataLuongThuc.map((khlt) => {

            // gạo tồn
            const tkdnGao = this.listNamKH.map((nkh) => {
              const tdk = khlt.tkdnGao.find((item) => item.nam == nkh)
              return {
                namKeHoach: nkh,
                soLuong: tdk ? tdk.soLuong : 0,
                type: "01",
              }
            })

            // thóc tồn
            const tkdnThoc = this.listNamKH.map((nkh) => {
              const tdk = khlt.tkdnThoc.find((item) => item.nam == nkh)
              return {
                namKeHoach: nkh,
                soLuong: tdk ? tdk.soLuong : 0,
                type: "00",
              }
            })

            // gạo nhập trong năm
            const ntnGao = [{
              namKeHoach: "",
              soLuong: khlt.ntnGao,
              type: "11",
            }]
            // thóc nhập trong năm
            const ntnThoc = [
              {
                namKeHoach: "",
                soLuong: khlt.ntnThoc,
                type: "10",
              }
            ]

            // gạo xuất trong năm
            let xtnGao = this.listNamKH.map((nkh) => {
              const xtn = khlt.xtnGao.find((item) => item.nam == nkh)
              return {
                namKeHoach: nkh,
                soLuong: xtn ? xtn.soLuong : 0,
                type: "21",
              }
            })

            // thóc xuất trong năm
            let xtnThoc = this.listNamKH.map((nkh) => {
              const xtn = khlt.xtnThoc.find((item) => item.nam == nkh)
              return {
                namKeHoach: nkh,
                soLuong: xtn ? xtn.soLuong : 0,
                type: "20",
              }
            })

            // gạo tồn kho cuối kỳ
            const tkcnGao = [{
              namKeHoach: "",
              soLuong: khlt.tkcnTongGao,
              type: "31",
            }]
            // thóc tông kho cuối kỳ
            const tkcnThoc = [
              {
                namKeHoach: "",
                soLuong: khlt.tkcnTongThoc,
                type: "30",
              }
            ]



            const dcKeHoachNamLtTtDtl = [...tkdnGao, ...tkdnThoc, ...ntnGao, ...ntnThoc, ...xtnGao, ...xtnThoc, ...tkcnGao, ...tkcnThoc]


            return {
              donViTinh: khlt.donViTinh,
              maDvi: khlt.maDonVi,
              tenDvi: khlt.tenDonvi,
              tongSoCuoiNam: khlt.tkcnTongSoQuyThoc,
              tongSoTon: khlt.tkdnTongSoQuyThoc,
              tongGaoTon: khlt.tkdnTongGao,
              tongThocTon: khlt.tkdnTongThoc,
              tongSoXuat: khlt.xtnTongSoQuyThoc,
              tongGaoXuat: khlt.xtnTongGao,
              tongThocXuat: khlt.xtnTongThoc,
              tongSoNhap: khlt.ntnTongSoQuyThoc,
              dcKeHoachNamLtTtDtl,
              tkdnGao,
              tkdnThoc,
              ntnGao,
              ntnThoc,
              xtnGao,
              xtnThoc,
              tkcnGao,
              tkcnThoc
            }
          })
          this.dsKeHoachLuongThuc = dsLT

          let dataMuoi = data.khMuoiDuTru
          let dsMuoi = dataMuoi.map((khmuoi) => {
            return {
              donViTinh: khmuoi.donViTinh,
              maDvi: khmuoi.maDonVi,
              stt: khmuoi.stt,
              tenDvi: khmuoi.tenDonVi,
              soLuongNhap: khmuoi.nhapTrongNam,
              soLuongXuat: khmuoi.xuatTrongNamMuoi,
              tonKhoCuoiNam: khmuoi.tonKhoDauNam,
              tonKhoDauNam: khmuoi.tonKhoCuoiNam,
            }
          })
          this.dsMuoi = dsMuoi

          let khVatTuNhap = data.khVatTuNhap.map((vattu) => {
            return {
              ...vattu,
              id: undefined,
              loai: "NHAP",
            }
          })
          let khVatTuXuat = data.khVatTuXuat.map((vattu) => {
            return {
              ...vattu,
              id: undefined,
              loai: "XUAT",
            }
          })

          this.dsVatTuNhap = khVatTuNhap
          this.dsVatTuXuat = khVatTuXuat

          if (this.id) return

          this.dsKeHoachLuongThucClone = cloneDeep(dsLT)
          this.sumRowDetailLuongThuc();


          this.dsMuoiClone = cloneDeep(dsMuoi)
          this.sumRowDetailMuoi()


          this.dataVatTuNhap = cloneDeep(khVatTuNhap)
          this.dataVatTuXuat = cloneDeep(khVatTuXuat)

          this.convertListDataVatTuNhap(this.dataVatTuNhap);
          this.convertListDataVatTuXuat(this.dataVatTuXuat);
          this.expandAll(this.dataVatTuNhapTree);
          this.expandAllVatTuXuat(this.dataVatTuXuatTree);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg)
      }
    }

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

  initForm() {
    this.formData = this.fb.group({
      id: [],
      trangThai: STATUS.DANG_NHAP_DU_LIEU,
      tenTrangThai: 'Đang nhập dữ liệu',
      tenDonVi: [],
      soQuyetDinh: [, [Validators.required]],
      ngayKy: [dayjs().format('YYYY-MM-DD')],
      ngayHieuLuc: [dayjs().format('YYYY-MM-DD')],
      soQuyetDinhGiaoCuaTc: [, [Validators.required]],
      quyetDinhGiaoCuaTcId: [, [Validators.required]],
      soQuyetDinhGiaoNam: [],
      quyetDinhGiaoNamId: [],
      soCongVan: [, [Validators.required]],
      namKeHoach: [dayjs().get("year"), [Validators.required]],
      trichYeu: [, [Validators.required]],
      soQuyetDinhDcCuaC: [],
      type: ["02"],
      cap: [],
      dcKeHoachNamLtDtl: [],
      dcKeHoachNamMuoiDtl: [],
      dcKeHoachNamVatTuDtl: [],
      slThocNhap: [],
      slGaoNhap: [],
      slTongXuatThoc: [],
      slTongXuatGao: [],
      slTonKhoDauNam: [],
      slNhapTrongNam: [],
      slXuatTrongNam: [],
      slTonKhoCuoiNam: [],

    });
    this.formData.markAsPristine();
  }

  themMoi(data?: any) {
    if (this.tabSelected == TAB_SELECTED.luongThuc) {
      const modalLuongThuc = this.modal.create({
        nzTitle: 'Thông tin lương thực',
        nzContent: DialogThongTinLuongThucComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          keHoachLuongThuc: data,
          yearNow: this.yearNow,
        },
      });
      modalLuongThuc.afterClose.subscribe((luongThuc) => {
        if (luongThuc) {
          this.keHoachLuongThucDialog = new KeHoachLuongThuc();
          this.keHoachLuongThucDialog.tenDonvi = luongThuc.value.tenDonvi;
          this.keHoachLuongThucDialog.maDonVi = luongThuc.value.maDonVi;
          this.keHoachLuongThucDialog.tkdnTongSoQuyThoc =
            +luongThuc.value.tkdnTongSoQuyThoc;
          this.keHoachLuongThucDialog.tkdnTongThoc =
            +luongThuc.value.tkdnThocSoLuong1 +
            +luongThuc.value.tkdnThocSoLuong2 +
            +luongThuc.value.tkdnThocSoLuong3;
          const tkdnThoc1 = {
            id: null,
            nam: this.yearNow - 1,
            soLuong: +luongThuc.value.tkdnThocSoLuong1,
            vatTuId: null,
          };
          const tkdnThoc2 = {
            id: null,
            nam: this.yearNow - 2,
            soLuong: +luongThuc.value.tkdnThocSoLuong2,
            vatTuId: null,
          };
          const tkdnThoc3 = {
            id: null,
            nam: this.yearNow - 3,
            soLuong: +luongThuc.value.tkdnThocSoLuong3,
            vatTuId: null,
          };
          this.keHoachLuongThucDialog.tkdnThoc = [
            tkdnThoc1,
            tkdnThoc2,
            tkdnThoc3,
          ];
          this.keHoachLuongThucDialog.tkdnTongGao =
            +luongThuc.value.tkdnGaoSoLuong1 + +luongThuc.value.tkdnGaoSoLuong2;
          const tkdnGao1 = {
            id: null,
            nam: this.yearNow - 1,
            soLuong: +luongThuc.value.tkdnGaoSoLuong1,
            vatTuId: null,
          };
          const tkdnGao2 = {
            id: null,
            nam: this.yearNow - 2,
            soLuong: +luongThuc.value.tkdnGaoSoLuong2,
            vatTuId: null,
          };
          const tkdnGao3 = {
            id: null,
            nam: this.yearNow - 3,
            soLuong: +luongThuc.value.tkdnGaoSoLuong3,
            vatTuId: null,
          };
          this.keHoachLuongThucDialog.tkdnGao = [tkdnGao1, tkdnGao2, tkdnGao3];
          this.keHoachLuongThucDialog.ntnTongSoQuyThoc =
            +luongThuc.value.ntnTongSoQuyThoc;
          this.keHoachLuongThucDialog.ntnThoc = +luongThuc.value.ntnThoc;
          this.keHoachLuongThucDialog.ntnGao = +luongThuc.value.ntnGao;
          this.keHoachLuongThucDialog.xtnTongSoQuyThoc =
            +luongThuc.value.xtnTongSoQuyThoc;
          this.keHoachLuongThucDialog.xtnTongThoc =
            +luongThuc.value.xtnThocSoLuong1 +
            +luongThuc.value.xtnThocSoLuong2 +
            +luongThuc.value.xtnThocSoLuong3;
          const xtnThoc1 = {
            id: null,
            nam: this.yearNow - 1,
            soLuong: +luongThuc.value.xtnThocSoLuong1,
            vatTuId: null,
          };
          const xtnThoc2 = {
            id: null,
            nam: this.yearNow - 2,
            soLuong: +luongThuc.value.xtnThocSoLuong2,
            vatTuId: null,
          };
          const xtnThoc3 = {
            id: null,
            nam: this.yearNow - 3,
            soLuong: +luongThuc.value.xtnThocSoLuong3,
            vatTuId: null,
          };
          this.keHoachLuongThucDialog.xtnThoc = [xtnThoc1, xtnThoc2, xtnThoc3];
          this.keHoachLuongThucDialog.xtnTongGao =
            +luongThuc.value.xtnGaoSoLuong1 + +luongThuc.value.xtnGaoSoLuong2 + +luongThuc.value.xtnGaoSoLuong3;
          const xtnGao1 = {
            id: null,
            nam: this.yearNow - 1,
            soLuong: +luongThuc.value.xtnGaoSoLuong1,
            vatTuId: null,
          };
          const xtnGao2 = {
            id: null,
            nam: this.yearNow - 2,
            soLuong: +luongThuc.value.xtnGaoSoLuong2,
            vatTuId: null,
          };
          const xtnGao3 = {
            id: null,
            nam: this.yearNow - 3,
            soLuong: +luongThuc.value.xtnGaoSoLuong3,
            vatTuId: null,
          };
          this.keHoachLuongThucDialog.xtnGao = [xtnGao1, xtnGao2, xtnGao3];
          this.keHoachLuongThucDialog.tkcnTongSoQuyThoc =
            +luongThuc.value.tkcnTongSoQuyThoc;
          this.keHoachLuongThucDialog.tkcnTongThoc =
            +luongThuc.value.tkcnTongThoc;
          this.keHoachLuongThucDialog.tkcnTongGao =
            +luongThuc.value.tkcnTongGao;
          this.keHoachLuongThucDialog.stt =
            this.thongTinChiTieuKeHoachNam.khLuongThuc?.length + 1;
          this.keHoachLuongThucDialog.donViId = luongThuc.value.donViId;
          this.keHoachLuongThucDialog.khGaoId = luongThuc.value.khGaoId;
          this.keHoachLuongThucDialog.khThocId = luongThuc.value.khThocId;
          this.keHoachLuongThucDialog.donViTinh = luongThuc.value.donViTinh;
          this.checkDataExistLuongThuc(this.keHoachLuongThucDialog);
        }
      });
    } else if (this.tabSelected == TAB_SELECTED.vatTu) {
      const modalVatTu = this.modal.create({
        nzTitle: 'Thông tin vật tư trong năm',
        nzContent: DialogThemThongTinVatTuTrongNamComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          yearNow: this.yearNow,
        },
      });
      modalVatTu.afterClose.subscribe((vatTu) => {
        if (vatTu) {
          this.keHoachVatTuDialog = new KeHoachVatTu();
          this.keHoachVatTuDialog.tenDonVi = vatTu.value.tenDonVi;
          this.keHoachVatTuDialog.maDvi = vatTu.value.maDonVi;
          this.keHoachVatTuDialog.donViId = vatTu.value.donViId;
          this.keHoachVatTuDialog.donViTinh = vatTu.value.donViTinh;
          this.keHoachVatTuDialog.stt =
            this.thongTinChiTieuKeHoachNam.khVatTu?.length + 1;
          this.keHoachVatTuDialog.vatTuThietBi = [];
          this.checkDataExistVatTu(this.keHoachVatTuDialog);
        }
      });
    } else if (this.tabSelected == TAB_SELECTED.muoi) {
      const modalMuoi = this.modal.create({
        nzTitle: 'Thông tin muối',
        nzContent: DialogThemThongTinMuoiComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          thongTinMuoi: data,
          yearNow: this.yearNow,
        },
      });
      modalMuoi.afterClose.subscribe((muoi) => {
        if (muoi) {
          this.keHoachMuoiDialog = new KeHoachMuoi();
          this.keHoachMuoiDialog.maDonVi = muoi.value.maDonVi;
          this.keHoachMuoiDialog.ntnTongSoMuoi = muoi.value.ntnTongSo;
          this.keHoachMuoiDialog.tenDonVi = muoi.value.tenDonVi;
          this.keHoachMuoiDialog.tkcnTongSoMuoi = +muoi.value.tkcnTongSo;
          this.keHoachMuoiDialog.donViTinh = muoi.value.donViTinh;
          const tkdnMuoi1 = {
            id: null,
            nam: this.yearNow - 1,
            soLuong: +muoi.value.tkdnSoLuong1,
            vatTuId: null,
          };
          const tkdnMuoi2 = {
            id: null,
            nam: this.yearNow - 2,
            soLuong: +muoi.value.tkdnSoLuong2,
            vatTuId: null,
          };
          const tkdnMuoi3 = {
            id: null,
            nam: this.yearNow - 3,
            soLuong: +muoi.value.tkdnSoLuong3,
            vatTuId: null,
          };
          // this.keHoachMuoiDialog.tkdnMuoi = [tkdnMuoi1, tkdnMuoi2, tkdnMuoi3];
          this.keHoachMuoiDialog.tkdnTongSoMuoi = +muoi.value.tkdnTongSo;
          const xtnMuoi1 = {
            id: null,
            nam: this.yearNow - 1,
            soLuong: +muoi.value.xtnSoLuong1,
            vatTuId: null,
          };
          const xtnMuoi2 = {
            id: null,
            nam: this.yearNow - 2,
            soLuong: +muoi.value.xtnSoLuong2,
            vatTuId: null,
          };
          const xtnMuoi3 = {
            id: null,
            nam: this.yearNow - 3,
            soLuong: +muoi.value.xtnSoLuong3,
            vatTuId: null,
          };
          // this.keHoachMuoiDialog.xtnMuoi = [xtnMuoi1, xtnMuoi2, xtnMuoi3];
          this.keHoachMuoiDialog.xtnTongSoMuoi = +muoi.value.xtnTongSo;
          this.keHoachMuoiDialog.stt =
            this.thongTinChiTieuKeHoachNam.khMuoiDuTru?.length + 1;
          this.keHoachMuoiDialog.donViId = muoi.value.donViId;
          this.keHoachMuoiDialog.id = muoi.value.id;
          this.checkDataExistMuoi(this.keHoachMuoiDialog);
        }
      });
    }
  }

  disableSelect() {
    if (this.thongTinChiTieuKeHoachNam.id) {
      return true;
    } else {
      return false;
    }
  }



  redirectChiTieuKeHoachNam() {
    this.showListEvent.emit();
  }

  loadThongTinChiTieuKeHoachNam(id: number) {
    this.quyetDinhDieuChinhCTKHService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const data = res.data
          if (data.soQuyetDinh)
            data.soQuyetDinh = data.soQuyetDinh.split("/")[0]
          this.formData.patchValue(data)
          this.thongTinChiTieuKeHoachNam = data;
          this.fileDinhKems = data.fileDinhKems

          const maDV = this.userInfo.MA_DVI
          let dsKHLT = () => {
            if (this.isTongCuc())
              return this.thongTinChiTieuKeHoachNam.dcKeHoachNamLtDtl
            else {
              if (this.thongTinChiTieuKeHoachNam.cap == 1) {
                return this.thongTinChiTieuKeHoachNam.dcKeHoachNamLtDtl.filter((item) => item.maDvi == maDV)
              } else {
                return this.thongTinChiTieuKeHoachNam.dcKeHoachNamLtDtl
              }
            }
          }

          let dsLT = dsKHLT().map((lt) => {
            const dcKeHoachNamLtTtDtl = lt.dcKeHoachNamLtTtDtl
            const tkdnGao = dcKeHoachNamLtTtDtl.filter((dtl) => dtl.type === "01").sort((item1, item2) => {
              if (item1.nam > item2.nam) {
                return item2;
              }

              return item1;
            });
            const tkdnThoc = dcKeHoachNamLtTtDtl.filter((dtl) => dtl.type === "00")
            const ntnGao = dcKeHoachNamLtTtDtl.filter((dtl) => dtl.type === "11").sort((item1, item2) => item1.namKeHoach - item2.namKeHoach);
            const ntnThoc = dcKeHoachNamLtTtDtl.filter((dtl) => dtl.type === "10").sort((item1, item2) => item1.namKeHoach - item2.namKeHoach);
            const xtnGao = dcKeHoachNamLtTtDtl.filter((dtl) => dtl.type === "21").sort((item1, item2) => item1.namKeHoach - item2.namKeHoach);
            const xtnThoc = dcKeHoachNamLtTtDtl.filter((dtl) => dtl.type === "20").sort((item1, item2) => item1.namKeHoach - item2.namKeHoach);
            const tkcnGao = dcKeHoachNamLtTtDtl.filter((dtl) => dtl.type === "31")
            const tkcnThoc = dcKeHoachNamLtTtDtl.filter((dtl) => dtl.type === "30")
            return {
              ...lt,
              tkdnGao,
              tkdnThoc,
              ntnGao,
              ntnThoc,
              xtnGao,
              xtnThoc,
              tkcnGao,
              tkcnThoc
            }
          })
          this.dsKeHoachLuongThucClone = cloneDeep(dsLT);
          this.sumRowDetailLuongThuc();

          let dcKeHoachNamMuoiDtl = () => {
            if (this.isTongCuc())
              return this.thongTinChiTieuKeHoachNam.dcKeHoachNamMuoiDtl
            else {
              if (this.thongTinChiTieuKeHoachNam.cap == 1) {
                return this.thongTinChiTieuKeHoachNam.dcKeHoachNamMuoiDtl.filter((item) => item.maDvi == maDV)
              } else {
                return this.thongTinChiTieuKeHoachNam.dcKeHoachNamMuoiDtl
              }
            }
          }
          // const dcKeHoachNamMuoiDtl = this.isTongCuc() ? this.thongTinChiTieuKeHoachNam.dcKeHoachNamMuoiDtl : this.thongTinChiTieuKeHoachNam.dcKeHoachNamMuoiDtll.filter((item) => item.maDvi == maDV)
          this.dsMuoiClone = cloneDeep(
            dcKeHoachNamMuoiDtl()
          );
          this.sumRowDetailMuoi();

          // Xử lý vật tư to tree
          this.dataVatTuNhap = this.thongTinChiTieuKeHoachNam.dcKeHoachNamVatTuDtl.filter((vattu) => vattu.loai == "NHAP")
          this.dataVatTuXuat = this.thongTinChiTieuKeHoachNam.dcKeHoachNamVatTuDtl.filter((vattu) => vattu.loai == "XUAT")

          if (this.isCuc()) {
            if (this.thongTinChiTieuKeHoachNam.cap == 1) {
              this.dataVatTuNhap = this.dataVatTuNhap.filter((item) => item.maDvi == maDV)
              this.dataVatTuXuat = this.dataVatTuXuat.filter((item) => item.maDvi == maDV)
            }
          }

          this.convertListDataVatTuNhap(this.dataVatTuNhap);
          this.convertListDataVatTuXuat(this.dataVatTuXuat);
          this.expandAll(this.dataVatTuNhapTree);
          this.expandAllVatTuXuat(this.dataVatTuXuatTree);


        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }

  convertListDataVatTuNhap(data) {
    this.dataVatTuNhapTree = [];
    if (data && data.length > 0) {
      this.dataVatTuNhapTree = chain(data).groupBy("tenDvi").map((value, key) => {
        let rs = chain(value)
          .groupBy("maVatTuCha")
          .map((v, k) => {
            return {
              tenDvi: key,
              maDvi: value[0]?.maDvi,
              idVirtual: uuidv4(),
              maVatTuCha: k,
              tenVatTuCha: v[0]?.tenVatTuCha,
              kyHieu: v[0]?.kyHieu,
              dataChild: v
            };
          }
          ).value();
        return {
          tenDvi: key,
          thayDoi: value[0]?.thayDoi || value[1]?.thayDoi || value[2]?.thayDoi,
          maDvi: value[0].maDvi,
          donViId: value[0].donViId,
          dataChild: rs,
          idVirtual: uuidv4()
        };
      }).value();
      this.dataVatTuNhapTree.forEach(item => {
        if (item && item.dataChild && item.dataChild.length > 0 && (!item.dataChild[0].maVatTuCha || item.dataChild[0].maVatTuCha == 'null')) {
          item.dataChild.shift();
        }
        if (item.dataChild && item.dataChild.length > 0) {
          item.dataChild.forEach(child => {
            if (child && child.dataChild && child.dataChild.length > 0 && (!child.dataChild[0].maVatTu || child.dataChild[0].maVatTu == 'null')) {
              child.soLuongNhap = child.dataChild[0].soLuongNhap;
              child.soLuongChuyenSang = child.dataChild[0].soLuongChuyenSang;
              child.donViTinh = child.dataChild[0].donViTinh;
              child.dataChild.shift();
            }
          });
        }
      });
    }
  }

  convertListDataVatTuXuat(data) {
    this.dataVatTuXuatTree = [];
    if (data && data.length > 0) {
      this.dataVatTuXuatTree = chain(data).groupBy("tenDvi").map((value, key) => {
        let rs = chain(value)
          .groupBy("maVatTuCha")
          .map((v, k) => {
            let rs1 = chain(v)
              .groupBy("maVatTu")
              .map((v1, k1) => {
                return {
                  maVatTu: k1,
                  tenVatTu: v1[0]?.tenVatTu,
                  donViTinh: v1[0]?.donViTinh,
                  tenDvi: v1[0]?.tenDvi,
                  maDvi: v1[0]?.maDvi,
                  idVirtual: uuidv4(),
                  maVatTuCha: v1[0]?.maVatTuCha,
                  dataChild: v1
                };
              }
              ).value();
            return {
              tenDvi: key,
              maDvi: value[0]?.maDvi,
              idVirtual: uuidv4(),
              maVatTuCha: k,
              donViTinh: v[0]?.donViTinh,
              kyHieu: v[0]?.kyHieu,
              tenVatTuCha: v[0]?.tenVatTuCha,
              dataChild: rs1
            };
          }
          ).value();
        return {
          tenDvi: key,
          thayDoi: value[0]?.thayDoi || value[1]?.thayDoi || value[2]?.thayDoi,
          maDvi: value[0].maDvi,
          donViId: value[0].donViId,
          dataChild: rs,
          idVirtual: uuidv4()
        };
      }).value();
      this.dataVatTuXuatTree.forEach(item => {
        if (item && item.dataChild && item.dataChild.length > 0 && (!item.dataChild[0].maVatTuCha || item.dataChild[0].maVatTuCha == 'null')) {
          item.dataChild.shift();
        }
        if (item.dataChild && item.dataChild.length > 0) {
          item.dataChild.forEach(child => {
            if (child && child.dataChild && child.dataChild.length > 0 && (!child.dataChild[0].maVatTu || child.dataChild[0].maVatTu == 'null')) {
              let dt = cloneDeep(child.dataChild[0].dataChild);
              child.donViTinh = child.dataChild[0].donViTinh;
              child.dataChild.shift();
              child.dataChild = dt;
            }
          });
        }
      });
    }
  }

  expandAll(table: any[]) {
    if (table && table.length > 0) {
      table.forEach(s => {
        this.expandSet.add(s.idVirtual);
        if (s.dataChild && s.dataChild.length > 0) {
          s.dataChild.forEach(item => {
            this.expandSet.add(item.idVirtual);
          });
        }
      });
    }
  }

  expandAllVatTuXuat(table: any[]) {
    if (table && table.length > 0) {
      table.forEach(s => {
        this.expandSet.add(s.idVirtual);
        if (s.dataChild && s.dataChild.length > 0) {
          s.dataChild.forEach(item => {
            this.expandSet.add(item.idVirtual);
            if (item.dataChild && item.dataChild.length > 0) {
              item.dataChild.forEach(item1 => {
                this.expandSet.add(item1.idVirtual);
              });
            }
          });
        }
      });
    }
  }

  convertKhVatTuList(khVatTus: Array<KeHoachVatTu>) {
    const khVatTuList = new Array<KeHoachVatTu>();
    let khVatTu = khVatTus;
    for (let i = 0; i < khVatTu.length; i++) {
      for (let j = 0; j < khVatTu[i].vatTuThietBi.length; j++) {
        const vatTuTemp = new KeHoachVatTu();
        vatTuTemp.donViId = khVatTu[i].donViId;
        vatTuTemp.maDvi = khVatTu[i].maDonVi;
        vatTuTemp.stt = khVatTu[i].stt;
        vatTuTemp.tenDonVi = khVatTu[i].tenDonVi;
        vatTuTemp.vatTuThietBi[0] = khVatTu[i].vatTuThietBi[j];
        khVatTuList.push(vatTuTemp);
      }
    }
    khVatTuList.forEach((vt, i) => {
      vt.stt = i + 1;
      vt.isEdit = false;
    });
    this.thongTinChiTieuKeHoachNam.khVatTu = khVatTuList;
  }

  ngAfterViewChecked(): void {
    const table = document.getElementsByTagName('table');
    this.tableExist = table && table.length > 0 ? true : false;
    this.cdr.detectChanges();
  }

  reduceRowData(
    indexTable: number,
    indexCell: number,
    indexRow: number,
    stringReplace: string,
    idTable: string,
  ): string {
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
    return sumVal ? Intl.NumberFormat('vi-VN').format(sumVal) : '0';
  }

  async preViewTheoCuc() {
    this.spinner.show();
    //Convert data to list object cuc
    this.quyetDinhDieuChinhCTKHService.xemTruocCtKhNamTheoCuc({
      id: this.thongTinChiTieuKeHoachNam.id,
      tenBaoCao: 'dieu_chinh_chi_tieu_ke_hoach_nam_theo_tung_cuc.docx',
      dataVatTunhap: this.getDataPreviewTheoCuc(this.dsKeHoachLuongThucClone),
    }).then(async res => {
      if (res.data) {
        this.printSrc = res.data.pdfSrc;
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreviewTheoCuc = true;
      } else {
        this.notification.error(MESSAGE.ERROR, 'Lỗi trong quá trình tải file.');
      }
    });
    this.spinner.hide();
  }

  getDataPreviewTheoCuc(khLuongThuc) {
    let arrayData = [];
    if (khLuongThuc && khLuongThuc.length > 0) {
      for (let item of khLuongThuc) {
        let data = {
          tenDvi: item.tenDvi,
          maDvi: item.maDvi,
          khVatTuNhap: (this.dataVatTuNhapTree && this.dataVatTuNhapTree.length > 0) ? this.dataVatTuNhapTree.find(it => it.maDvi == item.maDvi) : [],
        };
        arrayData = [...arrayData, data];
      }
    }
    return arrayData;
  }

  closeDlgTheoCuc() {
    this.showDlgPreviewTheoCuc = false;
  }

  downloadPdfCuc() {
    saveAs(this.pdfSrc, 'dieu_chinh_chi_tieu_ke_hoach_nam_theo_tung_cuc.pdf');
  }

  downloadWord() {
    saveAs(this.wordSrc, 'dieu_chinh_chi_tieu_ke_hoach_nam_theo_tung_cuc.docx');
  }

  printPreview() {
    printJS({ printable: this.printSrc, type: 'pdf', base64: true });
  }

  exportData() {
    var workbook = XLSX.utils.book_new();
    const tableLuongThuc = document
      .getElementById('table-luong-thuc')
      .getElementsByTagName('table');
    if (tableLuongThuc && tableLuongThuc.length > 0) {
      let sheetLuongThuc = XLSX.utils.table_to_sheet(tableLuongThuc[0]);
      sheetLuongThuc['!cols'] = [];
      sheetLuongThuc['!cols'][24] = { hidden: true };
      sheetLuongThuc['!cols'][25] = { hidden: true };
      XLSX.utils.book_append_sheet(workbook, sheetLuongThuc, 'sheetLuongThuc');
    }
    const tableMuoi = document
      .getElementById('table-muoi')
      .getElementsByTagName('table');
    if (tableMuoi && tableMuoi.length > 0) {
      let sheetMuoi = XLSX.utils.table_to_sheet(tableMuoi[0]);
      sheetMuoi['!cols'] = [];
      sheetMuoi['!cols'][12] = { hidden: true };
      sheetMuoi['!cols'][13] = { hidden: true };
      XLSX.utils.book_append_sheet(workbook, sheetMuoi, 'sheetMuoi');
    }
    const tableVatTu = document
      .getElementById('table-vat-tu')
      .getElementsByTagName('table');
    if (tableVatTu && tableVatTu.length > 0) {
      let sheetVatTu = XLSX.utils.table_to_sheet(tableVatTu[0]);
      XLSX.utils.book_append_sheet(workbook, sheetVatTu, 'sheetVatTu');
    }
    XLSX.writeFile(workbook, 'thong-tin-chi-tieu-ke-hoach-nam.xlsx');
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
        this.dsKeHoachLuongThucClone = this.dsKeHoachLuongThucClone.filter((lt, i) => i !== stt)
        this.dsKeHoachLuongThucClone = cloneDeep(this.dsKeHoachLuongThucClone)
        this.loadData();
        this.sumRowDetailLuongThuc();
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
        this.dsMuoiClone = this.dsMuoiClone.filter((lt, i) => lt.stt !== stt)
        this.dsMuoiClone = cloneDeep(this.dsMuoiClone)
        this.sumRowDetailMuoi()
        this.loadData();
      },
    });
  }


  uploadFile(event: any) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.fileDinhKem = fileList[0].name;
    }
  }

  checkDataExistLuongThuc(data: any) {
    if (this.thongTinChiTieuKeHoachNam.khLuongThuc) {
      let indexExist = this.thongTinChiTieuKeHoachNam.khLuongThuc.findIndex(
        (x) => x.maDonVi == data.maDonVi,
      );
      if (indexExist != -1) {
        this.thongTinChiTieuKeHoachNam.khLuongThuc.splice(indexExist, 1);
      }
    } else {
      this.thongTinChiTieuKeHoachNam.khLuongThuc = [];
    }
    this.thongTinChiTieuKeHoachNam.khLuongThuc = [
      ...this.thongTinChiTieuKeHoachNam.khLuongThuc,
      data,
    ];
    this.thongTinChiTieuKeHoachNam.khLuongThuc.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  checkDataExistMuoi(data: any) {
    if (this.thongTinChiTieuKeHoachNam.khMuoiDuTru) {
      let indexExist = this.thongTinChiTieuKeHoachNam.khMuoiDuTru.findIndex(
        (x) => x.maDonVi == data.maDonVi,
      );
      if (indexExist != -1) {
        this.thongTinChiTieuKeHoachNam.khMuoiDuTru.splice(indexExist, 1);
      }
    } else {
      this.thongTinChiTieuKeHoachNam.khMuoiDuTru = [];
    }
    this.thongTinChiTieuKeHoachNam.khMuoiDuTru = [
      ...this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
      data,
    ];
    this.thongTinChiTieuKeHoachNam.khMuoiDuTru.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  checkDataExistVatTu(data: any) {
    if (this.thongTinChiTieuKeHoachNam.khVatTu) {
      let indexExist = this.thongTinChiTieuKeHoachNam.khVatTu.findIndex(
        (x) =>
          x.maDvi === data.maDvi &&
          x.vatTuThietBi[0].vatTuId === data.vatTuThietBi[0].vatTuId,
      );
      if (indexExist != -1) {
        this.thongTinChiTieuKeHoachNam.khVatTu.splice(indexExist, 1);
      }
    } else {
      this.thongTinChiTieuKeHoachNam.khVatTu = [];
    }
    this.thongTinChiTieuKeHoachNam.khVatTu = [
      ...this.thongTinChiTieuKeHoachNam.khVatTu,
      data,
    ];
    const khVatTuList = new Array<KeHoachVatTu>();
    let khVatTu = cloneDeep(this.thongTinChiTieuKeHoachNam.khVatTu);
    for (let i = 0; i < khVatTu.length; i++) {
      khVatTuList.push(khVatTu[i]);
      for (let j = i + 1; j <= khVatTu.length - 1; j++) {
        if (khVatTu[i].donViId === khVatTu[j].donViId) {
          khVatTuList.push(khVatTu[j]);
          khVatTu.splice(j, 1);
        }
      }
    }
    this.thongTinChiTieuKeHoachNam.khVatTu = khVatTuList;

    this.thongTinChiTieuKeHoachNam.khVatTu.forEach((lt, i) => {
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
            document.getElementById('table-luong-thuc').innerHTML;
          printContent = printContent + '</div>';
        }
        if (res.muoi) {
          printContent = printContent + '<div>';
          printContent =
            printContent + document.getElementById('table-muoi').innerHTML;
          printContent = printContent + '</div>';
        }
        if (res.vatTu) {
          printContent = printContent + '<div>';
          printContent =
            printContent + document.getElementById('table-vat-tu').innerHTML;
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

  async preView(type?) {
    try {
      this.spinner.show();
      if (type === 'MUOI') {
        this.subTab = 'MUOI';
        let body = {
          'typeFile': 'pdf',
          'nam': this.thongTinChiTieuKeHoachNam.namKeHoach,
          'idHdr': this.thongTinChiTieuKeHoachNam.id,
          'fileName': 'xemtruoc_chi_tieu_kh_muoi.jrxml',
        };
        await this.quyetDinhDieuChinhCTKHService.xemTruocCtKhNamMuoi(body).then(async s => {
          this.pdfBlob = s;
          this.pdfSrc = await new Response(s).arrayBuffer();
        });
        // this.showDlgPreview = true;
      } else if (type === 'LT') {
        this.subTab = 'LT';
        let body = {
          id: this.thongTinChiTieuKeHoachNam.id,
          typeFile: "pdf",
          fileName: "ke-hoach-luong-thuc-du-tru-nha-nuoc.jrxml",
          tenBaoCao: "Kế hoạch lương thực dự trữ nhà nước"
        };
        await this.quyetDinhDieuChinhCTKHService.xemTruocCtKhNamLuongThuc(body).then(async s => {
          this.pdfBlob = s;
          this.pdfSrc = await new Response(s).arrayBuffer();
        });
      } else if (type === 'VT') {
        this.subTab = 'VT-' + (this.subTabVatTu == 0 ? 'NHAP' : 'XUAT');
        await this.quyetDinhDieuChinhCTKHService.xemTruocCtKhNamVatTu({
          typeFile: 'pdf',
          nam: this.thongTinChiTieuKeHoachNam.namKeHoach,
          idHdr: this.thongTinChiTieuKeHoachNam.id,
          fileName: 'chi-tieu-vat-tu-thiet-bi.jrxml',
          loaiNhapXuat: this.subTabVatTu == 0 ? 'NHAP' : 'XUAT'
        }).then(async s => {
          this.pdfBlob = s;
          this.pdfSrc = await new Response(s).arrayBuffer();
        });
      }
      this.showDlgPreview = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  downloadPdf() {
    saveAs(this.pdfBlob, 'baocao.pdf');
  }

  async downloadExcel() {
    try {
      this.spinner.show();
      if (this.subTab === 'LT') {
        await this.quyetDinhDieuChinhCTKHService.xemTruocCtKhNamLuongThuc({
          id: this.thongTinChiTieuKeHoachNam.id,
          typeFile: "xlsx",
          fileName: "ke-hoach-luong-thuc-du-tru-nha-nuoc.jrxml",
          tenBaoCao: "Kế hoạch lương thực dự trữ nhà nước"
        }).then(async s => {
          this.excelBlob = s;
          saveAs(this.excelBlob, "Kế hoạch lương thực dự trữ nhà nước.xlsx");
        });
      } else if (this.subTab === 'MUOI') {
        await this.quyetDinhDieuChinhCTKHService.xemTruocCtKhNamMuoi({
          typeFile: 'xlsx',
          nam: this.thongTinChiTieuKeHoachNam.namKeHoach,
          idHdr: this.thongTinChiTieuKeHoachNam.id,
          fileName: 'chi-tieu-vat-tu-thiet-bi.jrxml',
        }).then(async s => {
          this.excelBlob = s;
          saveAs(this.excelBlob, "chi-tieu-nhap-vat-tu-thiet-bi.xlsx");
        });
      } else if (this.subTab === 'VT-NHAP') {
        await this.quyetDinhDieuChinhCTKHService.xemTruocCtKhNamVatTu({
          typeFile: 'xlsx',
          nam: this.thongTinChiTieuKeHoachNam.namKeHoach,
          idHdr: this.thongTinChiTieuKeHoachNam.id,
          fileName: 'chi-tieu-vat-tu-thiet-bi.jrxml',
          loaiNhapXuat: 'NHAP'
        }).then(async s => {
          this.excelBlob = s;
          saveAs(this.excelBlob, "chi-tieu-nhap-vat-tu-thiet-bi.xlsx");
        });
      } else if (this.subTab === 'VT-XUAT') {
        await this.quyetDinhDieuChinhCTKHService.xemTruocCtKhNamVatTu({
          typeFile: 'xlsx',
          nam: this.thongTinChiTieuKeHoachNam.namKeHoach,
          idHdr: this.thongTinChiTieuKeHoachNam.id,
          fileName: 'chi-tieu-vat-tu-thiet-bi.jrxml',
          loaiNhapXuat: 'XUAT'
        }).then(async s => {
          this.excelBlob = s;
          saveAs(this.excelBlob, "chi-tieu-xuat-vat-tu-thiet-bi.xlsx");
        });
      }
      this.showDlgPreview = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  guiDuyet() {
    if (this.isCuc()) {
      this.formData.controls["soCongVan"].clearValidators();
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide()
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      return;
    }
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
          this.save(true);
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
      nzContent: 'Bạn có chắc chắn muốn duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.thongTinChiTieuKeHoachNam.trangThai) {
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
            trangThai: trangThai,
          };
          const res = await this.quyetDinhDieuChinhCTKHService.duyet(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
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

  taoQuyetDinh() {
    this.spinner.show();
    this.formData.controls["soQuyetDinh"].setValidators([Validators.required]);
    this.formData.controls["ngayKy"].setValidators([Validators.required]);
    this.formData.controls["ngayHieuLuc"].setValidators([Validators.required]);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide()
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      return;
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn ban hành?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: STATUS.BAN_HANH,
          };
          await this.save();
          const res = await this.chiTieuKeHoachNamService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
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
    this.spinner.hide();
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
          let trangThai;
          switch (this.thongTinChiTieuKeHoachNam.trangThai) {
            case STATUS.CHO_DUYET_TP: {
              trangThai = STATUS.TU_CHOI_TP
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              trangThai = STATUS.TU_CHOI_LDC
              break;
            }
            case STATUS.CHO_DUYET_LDV: {
              trangThai = STATUS.TU_CHOI_LDV
              break;
            }
          }
          let body = {
            id: this.id,
            lyDoTuChoi: text,
            trangThai: trangThai,
          };
          const res = await this.chiTieuKeHoachNamService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.redirectChiTieuKeHoachNam();
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

  save(isGuiDuyet?: boolean) {
    if (this.isCuc()) {
      this.formData.controls["soCongVan"].clearValidators();
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      return;
    }
    //Kiểm tra số nhập trong năm thóc , gạo có bằng chỉ tiêu BTC giao TCDT hoặc TCDT giao Cục hay ko ?
    let checkFlag = this.soSanhCtCapTrenGiao('save', isGuiDuyet);
    if (!checkFlag) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value
    body.soQuyetDinh = `${body.soQuyetDinh}/${this.qdTCDT}`
    body.dcKeHoachNamLtDtl = this.dsKeHoachLuongThucClone.map((lt) => {
      return {
        ...lt,
        dcKeHoachNamLtTtDtl: [...lt.tkdnGao, ...lt.tkdnThoc, ...lt.ntnGao, ...lt.ntnThoc, ...lt.xtnGao, ...lt.xtnThoc, ...lt.tkcnGao, ...lt.tkcnThoc]
      }
    })
    body.dcKeHoachNamMuoiDtl = this.dsMuoiClone
    body.dcKeHoachNamVatTuDtl = [...this.dataVatTuNhap, ...this.dataVatTuXuat]
    body.fileDinhKemReq = this.fileDinhKems
    body.canCus = this.listCcPhapLy

    if (this.thongTinChiTieuKeHoachNam.id) {
      body.id = this.thongTinChiTieuKeHoachNam.id
    }

    this.spinner.show();
    if (this.thongTinChiTieuKeHoachNam.id > 0) {
      this.quyetDinhDieuChinhCTKHService
        .update(body)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.thongTinChiTieuKeHoachNam = res.data
            if (isGuiDuyet) {
              let trangThai = STATUS.BAN_HANH;
              let body = {
                id: res.data.id,
                trangThai: trangThai
              };
              this.quyetDinhDieuChinhCTKHService.duyet(body)
                .then((resp) => {
                  if (resp.msg == MESSAGE.SUCCESS) {
                    if (res.msg == MESSAGE.SUCCESS) {
                      this.notification.success(
                        MESSAGE.SUCCESS,
                        MESSAGE.UPDATE_SUCCESS,
                      );
                      this.redirectChiTieuKeHoachNam()
                    } else {
                      this.notification.error(MESSAGE.ERROR, res.msg);
                    }
                  } else {
                    this.notification.error(MESSAGE.ERROR, resp.msg);
                  }
                })
            } else {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
        .catch((e) => {
          console.error('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        .finally(() => {
          this.spinner.hide();
        });
    } else {
      this.quyetDinhDieuChinhCTKHService
        .create(body)
        .then((res) => {
          console.log('themMoi', res)
          if (res.msg == MESSAGE.SUCCESS) {
            this.thongTinChiTieuKeHoachNam = res.data
            if (isGuiDuyet) {
              let trangThai = STATUS.BAN_HANH;
              let body = {
                id: res.data.id,
                trangThai: trangThai
              };
              this.quyetDinhDieuChinhCTKHService.duyet(body)
                .then((resp) => {
                  if (resp.msg == MESSAGE.SUCCESS) {
                    if (res.msg == MESSAGE.SUCCESS) {
                      this.notification.success(
                        MESSAGE.SUCCESS,
                        MESSAGE.ADD_SUCCESS,
                      );
                      this.redirectChiTieuKeHoachNam()
                    } else {
                      this.notification.error(MESSAGE.ERROR, res.msg);
                    }
                  } else {
                    this.notification.error(MESSAGE.ERROR, resp.msg);
                  }
                })
            } else {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
        .catch((e) => {
          console.error('error: ', e);
          this.notification.error(
            MESSAGE.ERROR,
            e.error.errors[0].defaultMessage,
          );
        })
        .finally(() => {
          this.spinner.hide();
        });
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.formData.controls['ngayHieuLuc'].value) {
      return false;
    }
    return startValue.getTime() > this.formData.controls['ngayHieuLuc'].value;
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.formData.controls['ngayKy'].value) {
      return false;
    }
    return endValue.getTime() <= this.formData.controls['ngayKy'].value;
  };

  async selectNam() {
    if (!this.id) {
      this.formData.patchValue({ soQuyetDinhGiaoCuaTc: "", soCongVan: "" })
      this.yearNow = this.formData.get('namKeHoach').value;
      this.listNamKH = [(this.yearNow - 3), (this.yearNow - 2), (this.yearNow - 1)]
      if (this.userService.isCuc()) {
        await this.findCanCuByYearCuc(this.yearNow)
      }
      await this.findCanCuByYear(this.yearNow);
    }
  }

  convertTrangThai(status: string) {
    if (status == this.globals.prop.DU_THAO) {
      return 'Dự thảo';
    } else if (status == this.globals.prop.LANH_DAO_DUYET) {
      return 'Chờ duyệt';
    } else if (status == this.globals.prop.BAN_HANH) {
      return 'Đã duyệt';
    } else if (status == this.globals.prop.TU_CHOI) {
      return 'Từ chối';
    }
  }

  startEdit(index: number): void {
    this.dsKeHoachLuongThucClone[index].isEdit = true;
    console.log("this.dsKeHoachLuongThucClone[index]startEdit", this.dsKeHoachLuongThucClone[index])
  }

  cancelEdit(index: number): void {
    // this.dsKeHoachLuongThucClone = cloneDeep(
    //   this.thongTinChiTieuKeHoachNam.khLuongThuc,
    // );
    this.dsKeHoachLuongThucClone[index].isEdit = false;
    this.cdr.detectChanges();
  }

  saveEdit(i: number): void {
    const newData = this.dsKeHoachLuongThucClone[i]
    const oldData = this.dsKeHoachLuongThuc[i]
    console.log("this.saveEditnewData", newData)
    console.log("this.saveEditoldData", oldData)
    const newDataString = `${newData.ntnThoc[0].soLuong}${newData.ntnGao[0].soLuong}` +
      `${newData.xtnThoc[0].soLuong}${newData.xtnThoc[1].soLuong}${newData.xtnThoc[2].soLuong}` +
      `${newData.xtnGao[0].soLuong}${newData.xtnGao[1].soLuong}${newData.xtnGao[2].soLuong}`

    const oldDataString = `${oldData.ntnThoc[0].soLuong}${oldData.ntnGao[0].soLuong}` +
      `${oldData.xtnThoc[0].soLuong}${oldData.xtnThoc[1].soLuong}${oldData.xtnThoc[2].soLuong}` +
      `${oldData.xtnGao[0].soLuong}${oldData.xtnGao[1].soLuong}${oldData.xtnGao[2].soLuong}`

    console.log("this.dsKeHoachLuongThucClone[index]", newDataString)
    console.log("this.dsKeHoachLuongThuc[index]", oldDataString)

    if (newDataString !== oldDataString) {
      this.dsKeHoachLuongThucClone[i].thayDoi = true
    } else
      this.dsKeHoachLuongThucClone[i].thayDoi = false

    this.dsKeHoachLuongThucClone[i].isEdit = false;

    this.sumRowDetailLuongThuc();
    this.cdr.detectChanges();
  }

  calculatorxtnTongThoc(i: number): string {
    this.dsKeHoachLuongThucClone[i].tongThocXuat = this.dsKeHoachLuongThucClone[i].xtnThoc.reduce((a, b) => a + +b.soLuong, 0);
    return this.dsKeHoachLuongThucClone[i].tongThocXuat
      ? Intl.NumberFormat('vi-VN').format(
        this.dsKeHoachLuongThucClone[i].tongThocXuat,
      )
      : '0';
  }

  calculatorxtnTongGao(i: number): string {
    this.dsKeHoachLuongThucClone[i].tongGaoXuat = this.dsKeHoachLuongThucClone[i].xtnGao.reduce((a, b) => a + +b.soLuong, 0);
    return this.dsKeHoachLuongThucClone[i].tongGaoXuat
      ? Intl.NumberFormat('vi-VN').format(
        this.dsKeHoachLuongThucClone[i].tongGaoXuat,
      )
      : '0';
  }

  calculatortkcnTongThoc(i: number): string {
    this.dsKeHoachLuongThucClone[i].tkcnThoc[0].soLuong =
      (this.dsKeHoachLuongThucClone[i].tongThocTon) + this.dsKeHoachLuongThucClone[i].ntnThoc[0].soLuong - this.dsKeHoachLuongThucClone[i].tongThocXuat;

    return this.dsKeHoachLuongThucClone[i].tkcnThoc[0].soLuong
      ? Intl.NumberFormat('vi-VN').format(
        this.dsKeHoachLuongThucClone[i].tkcnThoc[0].soLuong,
      )
      : '0';
  }

  calculatortkcnTongGao(i: number): string {
    this.dsKeHoachLuongThucClone[i].tkcnGao[0].soLuong =
      (this.dsKeHoachLuongThucClone[i].tongGaoTon) +
      this.dsKeHoachLuongThucClone[i].ntnGao[0].soLuong -
      this.dsKeHoachLuongThucClone[i].tongGaoXuat;
    return this.dsKeHoachLuongThucClone[i].tkcnGao[0].soLuong
      ? Intl.NumberFormat('vi-VN').format(
        (this.dsKeHoachLuongThucClone[i].tkcnGao[0].soLuong),
      )
      : '0';
  }

  calculatorxtnTongSoQuyThoc(i: number): string {
    this.dsKeHoachLuongThucClone[i].tongSoXuat =
      +this.dsKeHoachLuongThucClone[i].tongThocXuat +
      +this.dsKeHoachLuongThucClone[i].tongGaoXuat * 2;
    return this.dsKeHoachLuongThucClone[i].tongSoXuat
      ? Intl.NumberFormat('vi-VN').format(
        this.dsKeHoachLuongThucClone[i].tongSoXuat,
      )
      : '0';
  }

  calculatortkcnTongSoQuyThoc(i: number): string {
    this.dsKeHoachLuongThucClone[i].tongSoCuoiNam =
      this.dsKeHoachLuongThucClone[i].tkcnThoc[0].soLuong +
      this.dsKeHoachLuongThucClone[i].tkcnGao[0].soLuong * 2;
    this.sumRowDetailLuongThuc();
    return this.dsKeHoachLuongThucClone[i].tongSoCuoiNam
      ? Intl.NumberFormat('vi-VN').format(
        (this.dsKeHoachLuongThucClone[i].tongSoCuoiNam),
      )
      : '0';
  }

  calculatorntnTongSoQuyThoc(i: number): string {
    this.dsKeHoachLuongThucClone[i].tongSoNhap =
      +this.dsKeHoachLuongThucClone[i].ntnThoc[0].soLuong +
      +this.dsKeHoachLuongThucClone[i].ntnGao[0].soLuong * 2;
    return this.dsKeHoachLuongThucClone[i].tongSoNhap
      ? Intl.NumberFormat('vi-VN').format(
        this.dsKeHoachLuongThucClone[i].tongSoNhap,
      )
      : '0';


  }

  calculatortkcnMuoi(i: number): string {
    this.dsMuoiClone[i].tonKhoCuoiNam =
      this.dsMuoiClone[i].tonKhoDauNam +
      this.dsMuoiClone[i].soLuongNhap -
      this.dsMuoiClone[i].soLuongXuat;
    return this.dsMuoiClone[i].tonKhoCuoiNam
      ? Intl.NumberFormat('vi-VN').format(
        (this.dsMuoiClone[i].tonKhoCuoiNam),
      )
      : '0';
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
      // this.options = [];
    } else {
      this.options = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async loadDonVi() {
    try {
      const res = await this.donViService.layDonViCon();
      this.optionsDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].type != 'PB') {
            const item = {
              ...res.data[i],
              labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
            };
            this.optionsDonVi.push(item);
          } else {
            continue;
          }
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

  async loadQdTtcpGiaoBoNganh(nam) {
    const res = await this.quyetDinhTtcpService.chiTietTheoNam(nam);
    if (res.msg == MESSAGE.SUCCESS) {
      // lấy chỉ tiêu ttcp giao bộ tài chính : maBoNganh = 01
      this.dataQdCanCu = res.data.listBoNganh ? res.data.listBoNganh.find(item => item.maBoNganh == '01') : null;
    }
  }

  soSanhCtCapTrenGiao(action, isGuiDuyet?) {
    let totalNtnThoc, totalNtnGao = 0;
    let checkFlag = true;
    if (this.sumTotalKhDuTruLuongThuc.ntnThoc !== this.formData.value.slThocNhap && isGuiDuyet) {
      this.notification.error(MESSAGE.ERROR, "Số thóc nhập khác chỉ tiêu mua thóc của TCDT giao");
      checkFlag = false
      return
    }

    if (this.sumTotalKhDuTruLuongThuc.ntnGao !== this.formData.value.slGaoNhap && isGuiDuyet) {
      this.notification.error(MESSAGE.ERROR, "Số gạo nhập khác chỉ tiêu mua gạo của TCDT giao");
      checkFlag = false
      return
    }

    const thayDoiLT = this.dsKeHoachLuongThucClone.find((item) => item.thayDoi == true)
    const thayDoiM = this.dsMuoiClone.find((item) => item.thayDoi == true)
    const thayDoiVTN = this.dataVatTuNhap.find((item) => item.thayDoi == true)
    const thayDoiVTX = this.dataVatTuXuat.find((item) => item.thayDoi == true)

    if (!thayDoiLT && !thayDoiM && !thayDoiVTN && !thayDoiVTX && isGuiDuyet) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa điều chỉnh thông tin chỉ tiêu kế hoạch");
      checkFlag = false
      return
    }
    // if (this.userService.isTongCuc()) {
    //   if (action == 'add') {
    //     totalNtnThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnThoc, 0) + this.keHoachLuongThucCreate.ntnThoc;
    //     totalNtnGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnGao, 0) + this.keHoachLuongThucCreate.ntnGao;
    //     if (totalNtnThoc || totalNtnGao) {
    //       if (totalNtnThoc > (this.dataQdCanCu?.ltThocMua ? this.dataQdCanCu.ltThocMua : 0)) {
    //         this.notification.error(MESSAGE.ERROR, "Nhập quá số lượng mua thóc BTC giao");
    //         return false
    //       }
    //       if (totalNtnGao > (this.dataQdCanCu?.ltGaoMua ? this.dataQdCanCu.ltGaoMua : 0)) {
    //         this.notification.error(MESSAGE.ERROR, "Nhập quá số lượng mua gạo BTC giao");
    //         return false;
    //       }
    //     }
    //   } else {
    //     totalNtnThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnThoc, 0);
    //     totalNtnGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnGao, 0);
    //     if (totalNtnThoc || totalNtnGao) {
    //       if (totalNtnThoc < (this.dataQdCanCu?.ltThocMua ? this.dataQdCanCu.ltThocMua : 0) && isGuiDuyet) {
    //         this.notification.error(MESSAGE.ERROR, "Nhập chưa bằng số chỉ tiêu mua thóc BTC giao");
    //         return false;
    //       }
    //       if (totalNtnGao < (this.dataQdCanCu?.ltGaoMua ? this.dataQdCanCu.ltGaoMua : 0) && isGuiDuyet) {
    //         this.notification.error(MESSAGE.ERROR, "Nhập chưa bằng số chỉ tiêu mua gạo BTC giao");
    //         return false;
    //       }
    //     }
    //   }
    // } else {
    //   if (action == 'add') {
    //     totalNtnThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnThoc, 0) + this.keHoachLuongThucCreate.ntnThoc;
    //     totalNtnGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnGao, 0) + this.keHoachLuongThucCreate.ntnGao;
    //     if (totalNtnThoc || totalNtnGao) {
    //       if (totalNtnThoc > (this.dataQdTCDTGiaoCuc?.ltThocMua ? this.dataQdTCDTGiaoCuc.ltThocMua : 0)) {
    //         this.notification.error(MESSAGE.ERROR, "Nhập quá số lượng mua thóc TCDT giao");
    //         return false;
    //       }
    //       if (totalNtnGao > (this.dataQdTCDTGiaoCuc?.ltGaoMua ? this.dataQdTCDTGiaoCuc.ltGaoMua : 0)) {
    //         this.notification.error(MESSAGE.ERROR, "Nhập quá số lượng mua gạo TCDT giao");
    //         return false;
    //       }
    //     }
    //   } else {
    //     totalNtnThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnThoc, 0);
    //     totalNtnGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnGao, 0);
    //     if (totalNtnThoc || totalNtnGao) {
    //       if (totalNtnThoc < (this.dataQdTCDTGiaoCuc?.ltThocMua ? this.dataQdTCDTGiaoCuc.ltThocMua : 0) && isGuiDuyet) {
    //         this.notification.error(MESSAGE.ERROR, "Nhập chưa bằng số chỉ tiêu mua thóc TCDT giao");
    //         return false;
    //       }
    //       if (totalNtnGao < (this.dataQdTCDTGiaoCuc?.ltGaoMua ? this.dataQdTCDTGiaoCuc.ltGaoMua : 0) && isGuiDuyet) {
    //         this.notification.error(MESSAGE.ERROR, "Nhập chưa bằng số chỉ tiêu mua gạo TCDT giao");
    //         return false;
    //         ;
    //       }
    //     }
    //   }
    // }
    return checkFlag;
  }

  procThemMoiKHLT() {
    this.dsKeHoachLuongThucClone.forEach((item) => {
      const tkdnThoc1 = {
        id: null,
        nam: this.yearNow - 1,
        soLuong: +item.tkdnThoc[0].soLuong,
        vatTuId: null,
      };
      const tkdnThoc2 = {
        id: null,
        nam: this.yearNow - 2,
        soLuong: +item.tkdnThoc[1].soLuong,
        vatTuId: null,
      };
      const tkdnThoc3 = {
        id: null,
        nam: this.yearNow - 3,
        soLuong: +item.tkdnThoc[2].soLuong,
        vatTuId: null,
      };
      item.tkdnThoc = [tkdnThoc1, tkdnThoc2, tkdnThoc3];
      const tkdnGao1 = {
        id: null,
        nam: this.yearNow - 1,
        soLuong: +item.tkdnGao[0].soLuong,
        vatTuId: null,
      };
      const tkdnGao2 = {
        id: null,
        nam: this.yearNow - 2,
        soLuong: +item.tkdnGao[1].soLuong,
        vatTuId: null,
      };
      const tkdnGao3 = {
        id: null,
        nam: this.yearNow - 3,
        soLuong: +item.tkdnGao[2].soLuong,
        vatTuId: null,
      };
      item.tkdnGao = [tkdnGao1, tkdnGao2, tkdnGao3];
      const xtnThoc1 = {
        id: null,
        nam: this.yearNow - 1,
        soLuong: +item.xtnThoc[0].soLuong,
        vatTuId: null,
      };
      const xtnThoc2 = {
        id: null,
        nam: this.yearNow - 2,
        soLuong: +item.xtnThoc[1].soLuong,
        vatTuId: null,
      };
      const xtnThoc3 = {
        id: null,
        nam: this.yearNow - 3,
        soLuong: +item.xtnThoc[2].soLuong,
        vatTuId: null,
      };
      item.xtnThoc = [xtnThoc1, xtnThoc2, xtnThoc3];
      const xtnGao1 = {
        id: null,
        nam: this.yearNow - 1,
        soLuong: +item.xtnGao[0].soLuong,
        vatTuId: null,
      };
      const xtnGao2 = {
        id: null,
        nam: this.yearNow - 2,
        soLuong: +item.xtnGao[1].soLuong,
        vatTuId: null,
      };
      const xtnGao3 = {
        id: null,
        nam: this.yearNow - 3,
        soLuong: +item.xtnGao[2].soLuong,
        vatTuId: null,
      };
      item.xtnGao = [xtnGao1, xtnGao2, xtnGao3];
    });
  }

  saveEditMuoi(i: number) {

    delete this.dsMuoiClone[i].isEdit
    delete this.dsMuoiClone[i].thayDoi

    const newData = this.dsMuoiClone[i]
    const newDataString = `${newData.soLuongNhap}${newData.soLuongXuat}${newData.tonKhoCuoiNam}${newData.tonKhoDauNam}`

    const oldData = this.dsMuoi[i]
    const oldDataString = `${oldData.soLuongNhap}${oldData.soLuongXuat}${oldData.tonKhoCuoiNam}${oldData.tonKhoDauNam}`

    console.log("this.dsMuoiClone[i]", this.dsMuoiClone[i])
    console.log("this.dsMuoi[i]", this.dsMuoi[i])


    if (newDataString !== oldDataString) {
      this.dsMuoiClone[i].thayDoi = true
    } else
      this.dsMuoiClone[i].thayDoi = false

    this.dsMuoiClone[i].isEdit = false;

    this.sumRowDetailMuoi();
    this.cdr.detectChanges();
  }

  sumRowDetailMuoi() {
    this.sumTotalKhDuTruMuoi.tonKhoDauNam = this.dsMuoiClone?.reduce((a, b) => a + +b.tonKhoDauNam, 0);
    this.sumTotalKhDuTruMuoi.nhapTrongNam = this.dsMuoiClone?.reduce((a, b) => a + +b.soLuongNhap, 0);
    this.sumTotalKhDuTruMuoi.xuatTrongNamMuoi = this.dsMuoiClone?.reduce((a, b) => a + +b.soLuongXuat, 0);
    this.sumTotalKhDuTruMuoi.tonKhoCuoiNam = this.dsMuoiClone?.reduce((a, b) => a + +b.tonKhoCuoiNam, 0);//this.sumTotalKhDuTruMuoi.tonKhoDauNam + this.sumTotalKhDuTruMuoi.nhapTrongNam - this.sumTotalKhDuTruMuoi.xuatTrongNamMuoi;
  }

  sumRowDetailLuongThuc() {
    this.sumTotalKhDuTruLuongThuc.tkdnTongSoQuyThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tongSoTon, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnTongThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tongThocTon, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnThoc_nam1 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnThoc[0]?.soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnThoc_nam2 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnThoc[1]?.soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnThoc_nam3 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnThoc[2]?.soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnTongGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tongGaoTon, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnGao_nam1 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnGao[0]?.soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnGao_nam2 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnGao[1]?.soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnGao_nam3 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnGao[2]?.soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.ntnTongSoQuyThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tongSoNhap, 0);
    this.sumTotalKhDuTruLuongThuc.ntnThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnThoc[0]?.soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.ntnGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnGao[0]?.soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.xtnTongSoQuyThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tongSoXuat, 0);
    this.sumTotalKhDuTruLuongThuc.xtnTongThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tongThocXuat, 0);
    this.sumTotalKhDuTruLuongThuc.xtnThoc_nam1 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnThoc[0]?.soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.xtnThoc_nam2 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnThoc[1]?.soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.xtnThoc_nam3 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnThoc[2]?.soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.xtnTongGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tongGaoXuat, 0);
    this.sumTotalKhDuTruLuongThuc.xtnGao_nam1 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnGao[0]?.soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.xtnGao_nam2 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnGao[1]?.soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.xtnGao_nam3 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnGao[2]?.soLuong ? b.xtnGao[2]?.soLuong : 0, 0);
    this.sumTotalKhDuTruLuongThuc.tkcnTongSoQuyThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tongSoCuoiNam, 0);
    this.sumTotalKhDuTruLuongThuc.tkcnTongThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkcnThoc[0]?.soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.tkcnTongGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkcnGao[0]?.soLuong, 0);
  }


  cancelEditMuoi(index: number) {
    this.dsMuoiClone[index].isEdit = false;
  }

  startEditMuoi(index: number): void {
    this.dsMuoiClone[index].isEdit = true;
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
    // this.dataVatTuConShow = this.dataVatTuConClone;
    this.dataVatTuChaShow = this.dataVatTuCha;
  }

  // deleteTaiLieuDinhKemTag(data: any) {
  //   this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
  //     (x) => x.id !== data.id,
  //   );
  //   this.thongTinChiTieuKeHoachNam.fileDinhKemReqs = this.thongTinChiTieuKeHoachNam.fileDinhKemReqs.filter(
  //     (x) => x.id !== data.id,
  //   );
  //
  // }
  //
  // openFile(event) {
  //   let item = {
  //     id: new Date().getTime(),
  //     text: event.name,
  //   };
  //   if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
  //     this.uploadFileService
  //       .uploadFile(event.file, event.name)
  //       .then((resUpload) => {
  //         const fileDinhKem = new FileDinhKem();
  //         fileDinhKem.fileName = resUpload.filename;
  //         fileDinhKem.fileSize = resUpload.size;
  //         fileDinhKem.fileUrl = resUpload.url;
  //         this.thongTinChiTieuKeHoachNam.fileDinhKemReqs.push(fileDinhKem);
  //         this.taiLieuDinhKemList.push(item);
  //       });
  //   }
  // }

  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === this.globals.prop.DU_THAO ||
      trangThai === this.globals.prop.LANH_DAO_DUYET ||
      trangThai === this.globals.prop.TU_CHOI ||
      trangThai === this.globals.prop.DU_THAO_TRINH_DUYET
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === this.globals.prop.BAN_HANH) {
      return 'da-ban-hanh';
    }
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
    // if (this.tabSelected == this.tab.luongThuc) {
    //   this.dsKeHoachLuongThucClone =
    //     this.thongTinChiTieuKeHoachNam.khLuongThuc.slice(
    //       this.pageSize * (this.page - 1),
    //       this.pageSize * this.page,
    //     );
    //   this.totalRecord = this.thongTinChiTieuKeHoachNam.khLuongThuc?.length;
    // } else if (this.tabSelected == this.tab.muoi) {
    //   this.dsMuoiClone = this.thongTinChiTieuKeHoachNam.khMuoiDuTru?.slice(
    //     this.pageSize * (this.page - 1),
    //     this.pageSize * this.page,
    //   );
    //   this.totalRecord = this.thongTinChiTieuKeHoachNam.khMuoiDuTru?.length;
    // } else if (this.tabSelected == this.tab.vatTu) {
    //   this.dsVatTuClone = this.thongTinChiTieuKeHoachNam.khVatTu?.slice(
    //     this.pageSize * (this.page - 1),
    //     this.pageSize * this.page,
    //   );
    //   this.totalRecord = this.thongTinChiTieuKeHoachNam.khVatTu?.length;
    // }
    // this.cdr.detectChanges();
  }

  checkTrangThaiRecord(): boolean {
    return (
      this.thongTinChiTieuKeHoachNam.trangThai == STATUS.CHO_DUYET_LDV || this.thongTinChiTieuKeHoachNam.trangThai == STATUS.CHO_DUYET_LDC || this.thongTinChiTieuKeHoachNam.trangThai == STATUS.BAN_HANH
    );
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.canCuData && this.canCuData.length > 0) {
        this.canCuData.forEach((item) => {
          item.checked = true;
        });
      }
    }
  }

  handleCanCuOk() {

  }

  handleCanCuCancel() {

  }

  updateSingleChecked(): void {
    if (this.canCuData.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.canCuData.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
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

  async themSuaVatTu(data: any, type: string, tab: string, isRoot, sttDonVi: any, donViId?: number) {

    const modalGT = this.modal.create({
      nzTitle: tab == 'NHAP' ? 'CHỈ TIÊU NHẬP VẬT TƯ, THIẾT BỊ' : 'CHỈ TIÊU XUẤT VẬT TƯ, THIẾT BỊ ',
      nzContent: ThemSuaKeHoachVatTuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '500px',
      nzFooter: null,
      nzComponentParams: {
        isRoot: isRoot,
        itemInput: data,
        donViId: donViId,
        dataVatTuChaShow: this.dataVatTuChaShow,
        dataVatTuConClone: this.dataVatTuConClone,
        dataVatTuCha: this.dataVatTuCha,
        dataVatTuCon: this.dataVatTuCon,
        actionType: type,
        tab: tab,
      },
    });
    modalGT.afterClose.subscribe((item) => {
      if (item) {
        item.sttDonVi = sttDonVi + 1;
        item.thayDoi = true
        if (tab == 'NHAP') {
          //NHAP
          if (type == 'them') {
            this.dataVatTuNhap.push({ ...item, loai: "NHAP" });
          } else {
            let index = -1;
            if (isRoot) {
              //check trùng bản ghi
              let uniqueRecord = this.dataVatTuNhap.find(it => it.maDvi == item.maDvi && it.maVatTuCha == item.maVatTuCha);
              if (uniqueRecord && item.maVatTuCha != data.maVatTuCha) {
                this.notification.warning(MESSAGE.WARNING, item.tenVatTuCha + ' đã được thêm cho đơn vị ' + item.tenDvi);
                return;
              }
              index = this.dataVatTuNhap.findIndex(it => it.maDvi == data.maDvi && it.maVatTuCha == data.maVatTuCha)
            } else {
              //check trùng bản ghi
              let uniqueRecord = this.dataVatTuNhap.find(it => it.maDvi == item.maDvi && it.maVatTuCha == item.maVatTuCha && it.maVatTu == data.maVatTu);
              if (uniqueRecord && item.maVatTu != data.maVatTu) {
                this.notification.warning(MESSAGE.WARNING, item.tenVatTu + ' đã được thêm cho đơn vị ' + item.tenDvi);
                return;
              }
              index = this.dataVatTuNhap.findIndex(it => it.maDvi == data.maDvi && it.maVatTuCha == data.maVatTuCha && it.maVatTu == data.maVatTu)
            }
            if (index >= 0) {
              this.dataVatTuNhap.splice(index, 1, item);
            } else {
              this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy bản ghi cần sửa.')
              return;
            }
          }
          this.convertListDataVatTuNhap(this.dataVatTuNhap);
          this.expandAll(this.dataVatTuNhapTree);
        } else {
          //XUATTTTTTTTTTT
          if (type == 'them') {
            this.dataVatTuNhap.push({ ...item, loai: "XUAT" });
          } else {
            let index = -1;
            if (isRoot) {
              index = this.dataVatTuXuat.findIndex(it => it.maDvi == data.maDvi && it.maVatTuCha == data.maVatTuCha)
            } else {
              index = this.dataVatTuXuat.findIndex(it => it.maDvi == data.maDvi && it.maVatTuCha == data.maVatTuCha && it.maVatTu == data.maVatTu)
            }
            if (index >= 0) {
              this.dataVatTuXuat.splice(index, 1, item);
            } else {
              this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy bản ghi cần sửa.')
              return;
            }
          }
          this.convertListDataVatTuXuat(this.dataVatTuXuat);
          this.expandAllVatTuXuat(this.dataVatTuXuatTree);
        }
      }
    });
  }

  xoaKeHoachVatTu(item: any, isRoot?: boolean) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn xóa?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          let index = -1;
          if (isRoot) {
            let arrayAfterRemove = this.dataVatTuNhap.filter(it => (it.maDvi != item.maDvi) || (it.maDvi == item.maDvi && it.maVatTuCha != item.maVatTuCha));
            this.dataVatTuNhap = arrayAfterRemove;
          } else {
            index = this.dataVatTuNhap.findIndex(it => it.maDvi == item.maDvi && it.maVatTuCha == item.maVatTuCha && it.maVatTu == item.maVatTu)
          }
          if (index >= 0) {
            this.dataVatTuNhap.splice(index, 1);
          }
          this.convertListDataVatTuNhap(this.dataVatTuNhap);
          this.expandAll(this.dataVatTuNhapTree);
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

  xoaKeHoachVatTuXuat(item: any, level: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn xóa?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          debugger;
          let index = -1;
          if (level == 1) {
            let arrayAfterRemove = this.dataVatTuXuat.filter(it => (it.maDvi != item.maDvi) || (it.maDvi == item.maDvi && it.maVatTuCha != item.maVatTuCha));
            this.dataVatTuXuat = arrayAfterRemove;
          } else if (level == 2) {
            let arrayAfterRemove = this.dataVatTuXuat.filter(it => (it.maDvi != item.maDvi) || (it.maDvi == item.maDvi && it.maVatTuCha != item.maVatTuCha) || (it.maDvi == item.maDvi && it.maVatTuCha == item.maVatTuCha && it.maVatTu != item.maVatTu));
            this.dataVatTuXuat = arrayAfterRemove;
          } else if (level == 3) {
            index = this.dataVatTuXuat.findIndex(it => it.maDvi == item.maDvi && it.maVatTuCha == item.maVatTuCha && it.maVatTu == item.maVatTu && it.namNhap == item.namNhap)
          }
          if (index >= 0) {
            this.dataVatTuXuat.splice(index, 1);
          }
          this.convertListDataVatTuXuat(this.dataVatTuXuat);
          this.expandAllVatTuXuat(this.dataVatTuXuatTree);
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

  sumSoLuong(data: any, col: string) {
    let sl = 0;
    if (data && data.dataChild && data.dataChild.length > 0) {
      const sum = data.dataChild.reduce((prev, cur) => {
        prev += Number(cur[col]);
        return prev;
      }, 0);
      sl = sum;
    }
    return sl;
  }

  sumSoLuongVatTuXuat(data: any, col: string, level: number) {
    let sl = 0;
    if (level == 1) {
      if (data && data.dataChild && data.dataChild.length > 0) {
        data.dataChild.forEach(it => {
          const sum = (it && it.dataChild && it.dataChild.length > 0) ? it.dataChild.reduce((prev, cur) => {
            prev += Number(cur[col]);
            return prev;
          }, 0) : 0;
          sl += sum;
        })
      }
    }
    if (level == 2) {
      if (data && data.dataChild && data.dataChild.length > 0) {
        const sum = data.dataChild.reduce((prev, cur) => {
          prev += Number(cur[col]);
          return prev;
        }, 0);
        sl = sum;
      }
    }
    return sl;
  }

  async openDialogTh() {
    // if (this.formData.get('type').value != 'TH') {
    //   return;
    // }
    // await this.spinner.show();
    // let bodyTh = {
    //   trangThai: STATUS.DA_DUYET_LDV,
    //   nam: this.formData.get('nam').value,
    //   idQdPdNull: true,
    //   paggingReq: {
    //     limit: this.globals.prop.MAX_INTERGER,
    //     page: 0
    //   },
    // }
    // let resTh = await this.tongHopPhuongAnCuuTroService.search(bodyTh);
    // if (resTh.msg == MESSAGE.SUCCESS) {
    //   this.listDanhSachTongHop = resTh.data.content;
    // }
    // await this.spinner.hide();
    // const modalQD = this.modal.create({
    //   nzTitle: 'Danh sách tổng hợp đề xuất phương án cứu trợ, viện trợ',
    //   nzContent: DialogTableSelectionComponent,
    //   nzMaskClosable: false,
    //   nzClosable: false,
    //   nzWidth: '900px',
    //   nzFooter: null,
    //   nzComponentParams: {
    //     dataTable: this.listDanhSachTongHop,
    //     dataHeader: ['Số tổng hợp', 'Nội dung tổng hợp'],
    //     dataColumn: ['id', 'noiDungThop']
    //   },
    // });
    // modalQD.afterClose.subscribe(async (data) => {
    //   if (data) {
    //     await this.selectMaTongHop(data.id);
    //     await this.selectRow();
    //   }
    // });
  }

  async openDialogQD() {

  }

  async openDialogTr() {
    // if (this.formData.get('type').value != 'TTr') {
    //   return
    // }
    // await this.spinner.show();
    // // Get data tờ trình
    // let bodyDx = {
    //   trangThaiList: [STATUS.DA_DUYET_LDV, STATUS.DA_DUYET_LDC, STATUS.DA_TAO_CBV],
    //   maTongHop: null,
    //   // nam: this.formData.get('2022').value,
    //   loaiVthh: this.loaiVthh,
    //   idQdPdNull: true,
    //   paggingReq: {
    //     limit: this.globals.prop.MAX_INTERGER,
    //     page: 0
    //   },
    // }
    // let resToTrinh = await this.deXuatPhuongAnCuuTroService.search(bodyDx);
    // if (resToTrinh.msg == MESSAGE.SUCCESS) {
    //   this.listDanhSachDeXuat = resToTrinh.data.content;
    // }
    // await this.spinner.hide();
    //
    // const modalQD = this.modal.create({
    //   nzTitle: 'Danh sách đề xuất phương án cứu trợ, viện trợ',
    //   nzContent: DialogTableSelectionComponent,
    //   nzMaskClosable: false,
    //   nzClosable: false,
    //   nzWidth: '900px',
    //   nzFooter: null,
    //   nzComponentParams: {
    //     dataTable: this.listDanhSachDeXuat,
    //     dataHeader: ['Số tờ trình đề xuất', 'Loại hàng hóa', 'loại hình nhập xuất'],
    //     dataColumn: ['soDx', 'tenLoaiVthh', 'loaiNhapXuat']
    //   },
    // });
    // modalQD.afterClose.subscribe(async (data) => {
    //   if (data) {
    //     await this.selectMaDeXuat(data.id);
    //     await this.selectRow();
    //   }
    // });
  }



}
