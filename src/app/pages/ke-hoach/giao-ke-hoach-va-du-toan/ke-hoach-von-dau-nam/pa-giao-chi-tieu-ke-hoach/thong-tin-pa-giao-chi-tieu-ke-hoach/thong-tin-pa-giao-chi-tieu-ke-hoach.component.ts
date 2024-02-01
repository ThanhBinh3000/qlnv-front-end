import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import * as dayjs from 'dayjs';
import {saveAs} from 'file-saver';
import {chain, cloneDeep} from 'lodash';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {DialogLuaChonInComponent} from 'src/app/components/dialog/dialog-lua-chon-in/dialog-lua-chon-in.component';
import {
  DialogQuyetDinhGiaoChiTieuComponent,
} from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import {
  DialogThemThongTinMuoiComponent,
} from 'src/app/components/dialog/dialog-them-thong-tin-muoi/dialog-them-thong-tin-muoi.component';
import {
  DialogThemThongTinVatTuTrongNamComponent,
} from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/dialog-them-thong-tin-vat-tu-trong-nam.component';
import {
  DialogThongTinLuongThucComponent,
} from 'src/app/components/dialog/dialog-thong-tin-luong-thuc/dialog-thong-tin-luong-thuc.component';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {LEVEL, LEVEL_USER, LOAI_QD_CTKH, PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {ItemDetail} from 'src/app/models/itemDetail';
import {KeHoachLuongThuc} from 'src/app/models/KeHoachLuongThuc';
import {KeHoachMuoi} from 'src/app/models/KeHoachMuoi';
import {KeHoachVatTu, KeHoachVatTuCustom, KhVatTu, VatTuThietBi} from 'src/app/models/KeHoachVatTu';
import {ThongTinChiTieuKeHoachNam} from 'src/app/models/ThongTinChiTieuKHNam';
import {UserLogin} from 'src/app/models/userlogin';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {DonviService} from 'src/app/services/donvi.service';
import {HelperService} from 'src/app/services/helper.service';
import {UploadFileService} from 'src/app/services/uploaFile.service';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import * as XLSX from 'xlsx';
import {v4 as uuidv4} from 'uuid';
import {STATUS} from '../../../../../../constants/status';
import {QuyetDinhBtcTcdtService} from '../../../../../../services/quyetDinhBtcTcdt.service';
import {QuanLyHangTrongKhoService} from '../../../../../../services/quanLyHangTrongKho.service';
import {QuyetDinhTtcpService} from '../../../../../../services/quyetDinhTtcp.service';
import {AMOUNT_THREE_DECIMAL, AMOUNT_TWO_DECIMAL} from '../../../../../../Utility/utils';
import {CurrencyMaskInputMode} from 'ngx-currency';
import {
  ThemSuaMuaTangComponent,
} from '../../quyet-dinh/btc-giao-tcdt/them-quyet-dinh-btc-giao-tcdt/ke-hoach-mua-tang/them-sua-mua-tang/them-sua-mua-tang.component';
import {
  ThemSuaKeHoachVatTuComponent,
} from '../../chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/them-sua-ke-hoach-vat-tu/them-sua-ke-hoach-vat-tu.component';
import {
  TAB_SELECTED,
} from '../../chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam.constant';
import {
  DialogTableSelectionComponent,
} from '../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component';
import {FILETYPE} from '../../../../../../constants/fileType';

@Component({
  selector: 'app-thong-tin-pa-giao-chi-tieu-ke-hoach',
  templateUrl: './thong-tin-pa-giao-chi-tieu-ke-hoach.component.html',
  styleUrls: ['./thong-tin-pa-giao-chi-tieu-ke-hoach.component.scss'],
})
export class ThongTinPaGiaoChiTieuKeHoachComponent implements OnInit {
  @Input() id: number;
  @Input() isViewDetail: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  maQd: string;
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
  thongTinChiTieuKeHoachNam: ThongTinChiTieuKeHoachNam =
    new ThongTinChiTieuKeHoachNam();
  thongTinChiTieuKeHoachNamInput: ThongTinChiTieuKeHoachNam =
    new ThongTinChiTieuKeHoachNam();
  tableExist: boolean = false;
  keHoachLuongThucDialog: KeHoachLuongThuc;
  keHoachMuoiDialog: KeHoachMuoi;
  keHoachVatTuDialog: KeHoachVatTu;
  fileDinhKem: string = null;
  qdTCDT: string = MESSAGE.QD_TCDT;
  formData: FormGroup;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  listNam: any[] = [];
  mapOfExpandedData: { [key: string]: any[] } = {};
  dsKeHoachLuongThucClone: Array<KeHoachLuongThuc> = [];
  dsMuoiClone: Array<KeHoachMuoi> = [];
  dsVatTuClone: Array<KeHoachVatTu> = [];
  keHoachLuongThucCreate: KeHoachLuongThuc;
  isAddLuongThuc: boolean = false;
  keHoachMuoiCreate: KeHoachMuoi;
  isAddMuoi: boolean = false;
  isAddVatTu: boolean = false;
  dataVatTuCha: any[] = [];
  dataVatTuChaShow: any[] = [];
  dataVatTuCon: any[] = [];
  dataVatTuConClone: any[] = [];
  lastBreadcrumb: string;
  taiLieuDinhKemList: any[] = [];
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
  dataVatTuNhapTree: any[] = [];
  dataVatTuXuat: any[] = [];
  dataVatTuXuatTree: any[] = [];
  arrayDonVi: any[] = [];
  dataQdCanCu: any;
  dataQdTCDTGiaoCuc: any;
  expandSetNhap = new Set<string>();
  expandSetXuat = new Set<string>();
  AMOUNT = {
    allowZero: true,
    allowNegative: false,
    precision: 3,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: 'right',
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  };
  LOAI_QD = LOAI_QD_CTKH;
  subTabVatTu = 0;
  //

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
    this.userInfo = this.userService.getUserLogin();
    this.maQd = '/QĐ-BTC';
    if (this.userInfo) {
      this.qdTCDT = this.userInfo.MA_QD;
    }
    if (this.userService.isTongCuc()) {
      this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
    } else if (this.userService.isChiCuc()) {
      this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
    } else if (this.userService.isCuc()) {
      this.lastBreadcrumb = LEVEL.CUC_SHOW;
    }
    await this.loadDonVi(),
      await Promise.all([
        this.loadDanhMucHang(),
      ]);
    if (this.id > 0) {
      await this.loadThongTinChiTieuKeHoachNam(this.id);
    } else {
      this.formData.patchValue({
        loaiCanCu: 'OTHER',
        namKeHoach: dayjs().get('year'),
      });
      this.thongTinChiTieuKeHoachNam.capDvi = this.userInfo.CAP_DVI;
      this.thongTinChiTieuKeHoachNam.trangThai = STATUS.DU_THAO;
      this.findCanCuByYear(this.yearNow);
      // await this.initDataThemMoi();
    }
  }

  async initDataThemMoi() {
    this.spinner.show();
    try {
      await this.newObjectLuongThuc();
      await this.newObjectMuoi();
      await this.newObjectVatTu();
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(
        MESSAGE.ERROR,
        e.error.errors[0].defaultMessage,
      );
    } finally {
      this.spinner.hide();
    }
  }

  async findCanCuByYear(year: number, chiTieuKhNam?) {
    if (chiTieuKhNam) {
      if (chiTieuKhNam.capDvi == '2' && (!chiTieuKhNam.loaiCanCu || chiTieuKhNam.loaiCanCu == 'QD-TCDT')) {
        let res = await this.chiTieuKeHoachNamService.loadThongTinChiTieuKeHoachNam(chiTieuKhNam.qdGocId);
        if (res.msg == MESSAGE.SUCCESS) {
          let data = res.data;
          if (data) {
            this.dataQdTCDTGiaoCuc = {};
            this.formData.patchValue({
              canCu: data.soQuyetDinh,
              chiTieuId: data.id,
            });
            // Lấy kế hoạch tổng cục giao cho cục đang login
            let dataLuongThuc = data.khLuongThuc.find(item => item.maDonVi == this.userInfo.MA_DVI);
            if (dataLuongThuc) {
              this.dataQdTCDTGiaoCuc = {
                'ltThocMua': dataLuongThuc.ntnThoc,
                'ltGaoMua': dataLuongThuc.ntnGao,
                'ltThocXuat': dataLuongThuc.xtnTongThoc,
                'ltGaoXuat': dataLuongThuc.xtnTongGao,
              };
            }
          }
        } else {
          this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy quyết định giao chỉ tiêu của Tổng Cục DTNN.');
        }
      }else{
        this.dataQdCanCu = {};
        this.formData.patchValue({
          canCu: null,
          idCanCu: null,
        });
        if (this.formData.get('loaiCanCu').value == 'TTCP') {
          let res = await this.quyetDinhTtcpService.chiTietTheoNam(year);
          if (res.msg == MESSAGE.SUCCESS) {
            let data = res.data;
            if (data) {
              //Lấy data của TTCP giao cho BTC (TCDT)
              this.dataQdCanCu = data.listBoNganh ? res.data.listBoNganh.find(item => item.maBoNganh == '01') : null;
              this.formData.patchValue({
                canCu: data.soQd,
                idCanCu: data.id,
              });
            }
          } else {
            this.notification.warning(MESSAGE.WARNING, res.msg);
          }
        } else if (this.formData.get('loaiCanCu').value == 'BTC') {
          this.formData.patchValue({
            canCu: null,
            idCanCu: null,
          });
          let res = await this.chiTieuKeHoachNamService.canCuBTCGiaoTCDT(year);
          if (res.msg == MESSAGE.SUCCESS) {
            let data = res.data;
            if (data) {
              //Lấy data của BTC giao cho TCDT
              this.dataQdCanCu = {
                'ltThocMua': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongMuaThoc) ? data.keHoachNhapXuat.soLuongMuaThoc : 0,
                'ltGaoMua': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongMuaGao) ? data.keHoachNhapXuat.soLuongMuaGao : 0,
                'ltThocXuat': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongBanThoc) ? data.keHoachNhapXuat.soLuongBanThoc : 0,
                'ltGaoXuat': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongBanGao) ? data.keHoachNhapXuat.soLuongBanGao : 0,
              };
              this.formData.patchValue({
                canCu: data.soQd,
                idCanCu: data.id,
              });
            }
          } else {
            this.notification.warning(MESSAGE.WARNING, res.msg);
          }
        } else if (this.formData.get('loaiCanCu').value == 'OTHER') {
          this.formData.patchValue({
            canCu: chiTieuKhNam.canCu,
            idCanCu: null,
          });
        }
      }
    } else {
      if (this.userService.isCuc()) {
        this.formData.patchValue({
          canCu: null,
          chiTieuId: null,
        });
        this.dataQdTCDTGiaoCuc = {};
        let res = await this.chiTieuKeHoachNamService.canCuCucQd(year);
        if (res.msg == MESSAGE.SUCCESS) {
          let data = res.data;
          if (data) {
            this.dataQdTCDTGiaoCuc = {};
            this.formData.patchValue({
              canCu: data.soQuyetDinh,
              chiTieuId: data.id,
              loaiCanCu: 'QD-TCDT',
              idCanCu: data.id,
            });
            // Lấy kế hoạch tổng cục giao cho cục đang login
            let dataLuongThuc = data.khLuongThuc.find(item => item.maDonVi == this.userInfo.MA_DVI);
            if (dataLuongThuc) {
              this.dataQdTCDTGiaoCuc = {
                'ltThocMua': dataLuongThuc.ntnThoc,
                'ltGaoMua': dataLuongThuc.ntnGao,
                'ltThocXuat': dataLuongThuc.xtnTongThoc,
                'ltGaoXuat': dataLuongThuc.xtnTongGao,
              };
            }
          }
        } else {
          this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy quyết định giao chỉ tiêu cuủa Tổng Cục DTNN.');
        }
      }
      if (this.userService.isTongCuc()) {
        this.dataQdCanCu = {};
        this.formData.patchValue({
          canCu: null,
          idCanCu: null,
        });
        if (this.formData.get('loaiCanCu').value == 'TTCP') {
          let res = await this.quyetDinhTtcpService.chiTietTheoNam(year);
          if (res.msg == MESSAGE.SUCCESS) {
            let data = res.data;
            if (data) {
              //Lấy data của TTCP giao cho BTC (TCDT)
              this.dataQdCanCu = data.listBoNganh ? res.data.listBoNganh.find(item => item.maBoNganh == '01') : null;
              this.formData.patchValue({
                canCu: data.soQd,
                idCanCu: data.id,
              });
            }
          } else {
            this.notification.warning(MESSAGE.WARNING, res.msg);
          }
        } else if (this.formData.get('loaiCanCu').value == 'BTC') {
          this.formData.patchValue({
            canCu: null,
            idCanCu: null,
          });
          let res = await this.chiTieuKeHoachNamService.canCuBTCGiaoTCDT(year);
          if (res.msg == MESSAGE.SUCCESS) {
            let data = res.data;
            if (data) {
              //Lấy data của BTC giao cho TCDT
              this.dataQdCanCu = {
                'ltThocMua': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongMuaThoc) ? data.keHoachNhapXuat.soLuongMuaThoc : 0,
                'ltGaoMua': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongMuaGao) ? data.keHoachNhapXuat.soLuongMuaGao : 0,
                'ltThocXuat': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongBanThoc) ? data.keHoachNhapXuat.soLuongBanThoc : 0,
                'ltGaoXuat': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongBanGao) ? data.keHoachNhapXuat.soLuongBanGao : 0,
              };
              this.formData.patchValue({
                canCu: data.soQd,
                idCanCu: data.id,
              });
            }
          } else {
            this.notification.warning(MESSAGE.WARNING, res.msg);
          }
        }
      }
    }
  }

  calculateAndConvertDataKHLT() {
    if (this.dsKeHoachLuongThucClone && this.dsKeHoachLuongThucClone.length > 0) {
      this.dsKeHoachLuongThucClone.forEach(function (item) {
        if (item.tkdnThoc && item.tkdnThoc.length > 0) {
          item.tkdnThoc.forEach(tkdnThoc => {
            tkdnThoc.soLuong = tkdnThoc.soLuong ? (tkdnThoc.soLuong / 1000) : 0;
          });
          item.tkdnGao.forEach(tkdnGao => {
            tkdnGao.soLuong = tkdnGao.soLuong ? (tkdnGao.soLuong / 1000) : 0;
          });
        }
        if (item.xtnThoc && item.xtnGao.length > 0) {
          item.xtnThoc.forEach(xtnThoc => {
            xtnThoc.soLuong = xtnThoc.soLuong ? (xtnThoc.soLuong / 1000) : 0;
          });
          item.xtnGao.forEach(xtnGao => {
            xtnGao.soLuong = xtnGao.soLuong ? (xtnGao.soLuong / 1000) : 0;
          });
        }
        item.tkdnTongThoc = (item.tkdnThoc.reduce((a, b) => a + b.soLuong, 0));
        item.tkdnTongGao = item.tkdnGao.reduce((a, b) => a + +b.soLuong, 0);
        item.tkdnTongSoQuyThoc = item.tkdnTongThoc + item.tkdnTongGao * 2;
        item.ntnTongSoQuyThoc = item.ntnThoc + item.ntnGao * 2;
        item.xtnTongThoc = item.xtnThoc.reduce((a, b) => a + b.soLuong, 0);
        item.xtnTongGao = item.xtnGao.reduce((a, b) => a + b.soLuong, 0);
        item.xtnTongSoQuyThoc = item.xtnTongThoc + item.xtnTongGao * 2;
        item.tkcnTongThoc = (item.tkdnTongThoc) + item.ntnThoc - item.xtnTongThoc;
        item.tkcnTongGao = (item.tkdnTongGao) + item.ntnGao - item.xtnTongGao;
        item.tkcnTongSoQuyThoc = item.tkcnTongThoc + item.tkcnTongGao * 2;
      });
    }
  }

  async newObjectLuongThuc() {
    this.dsKeHoachLuongThucClone = [];
    this.arrayDonVi = [];
    // Code thiết kế mới, mặc định load toàn bộ đơn bị con ra
    let i = 1;
    if (this.options && this.options.length > 0) {
      for (let donVi of this.options) {
        this.arrayDonVi.push(donVi.maDvi);
        this.keHoachLuongThucCreate = new KeHoachLuongThuc();
        this.keHoachLuongThucCreate.tenDonvi = donVi.tenDvi;
        this.keHoachLuongThucCreate.donViId = donVi.id;
        this.keHoachLuongThucCreate.maDvi = donVi.maDvi;
        this.keHoachLuongThucCreate.maDonVi = donVi.maDvi;
        this.keHoachLuongThucCreate.donViTinh = MESSAGE.DON_VI_TINH_LUONG_THUC;
        this.keHoachLuongThucCreate.stt = i;
        this.keHoachLuongThucCreate.xtnThoc = [
          new ItemDetail(0, this.yearNow - 1),
          new ItemDetail(0, this.yearNow - 2),
          new ItemDetail(0, this.yearNow - 3),
        ];
        this.keHoachLuongThucCreate.tkdnThoc = [
          new ItemDetail(0),
          new ItemDetail(0),
          new ItemDetail(0),
        ];
        this.keHoachLuongThucCreate.xtnGao = [new ItemDetail(0, this.yearNow - 1), new ItemDetail(0, this.yearNow - 2), new ItemDetail(0, this.yearNow - 3)];
        this.keHoachLuongThucCreate.tkdnGao = [
          new ItemDetail(0),
          new ItemDetail(0),
          new ItemDetail(0),
        ];
        this.keHoachLuongThucCreate.ntnThoc = 0;
        this.keHoachLuongThucCreate.ntnGao = 0;
        this.dsKeHoachLuongThucClone.push(this.keHoachLuongThucCreate);
        i++;
      }
      //get số dư đầu kỳ của các đơn vị
      await this.quanLyHangTrongKhoService.getTrangThaiHtNew({
        listMaDvi: this.arrayDonVi,
        listLoaiVthh: ['0101', '0102'],
        capDvi: this.userInfo.CAP_DVI,
      }).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            this.dsKeHoachLuongThucClone.forEach((item) => {
              let dataTonKho = res.data.filter(dt => dt.nam && dt.nam < this.yearNow && dt.nam >= this.yearNow - 3 && item.maDonVi == dt.maDonVi);
              if (dataTonKho && dataTonKho.length > 0) {
                dataTonKho.forEach((tonKho) => {
                  if (tonKho.loaiVthh == '0101') {
                    switch (tonKho.nam) {
                      case this.yearNow - 1:
                        item.tkdnThoc[2].soLuong +=
                          tonKho.duDau;
                        break;
                      case this.yearNow - 2:
                        item.tkdnThoc[1].soLuong +=
                          tonKho.duDau;
                        item.xtnThoc[1].soLuong +=
                          tonKho.duDau;
                        break;
                      case this.yearNow - 3:
                        item.tkdnThoc[0].soLuong +=
                          tonKho.duDau;
                        item.xtnThoc[0].soLuong +=
                          tonKho.duDau;
                        break;
                      default:
                        break;
                    }
                  } else if (tonKho.loaiVthh == '0102') {
                    switch (tonKho.nam) {
                      case this.yearNow - 1:
                        item.tkdnGao[2].soLuong +=
                          tonKho.duDau;
                        item.xtnGao[2].soLuong +=
                          tonKho.duDau;
                        break;
                      case this.yearNow - 2:
                        item.tkdnGao[1].soLuong +=
                          tonKho.duDau;
                        item.xtnGao[1].soLuong +=
                          tonKho.duDau;
                        break;
                      case this.yearNow - 3:
                        item.tkdnGao[0].soLuong +=
                          tonKho.duDau;
                        item.xtnGao[0].soLuong +=
                          tonKho.duDau;
                        break;
                      default:
                        break;
                    }
                  }
                });
              }
            });
          }
        }
      });
    }
    //Đổi qua tấn và tính toán lại các số tổng
    this.calculateAndConvertDataKHLT();
    this.procThemMoiKHLT();
    this.thongTinChiTieuKeHoachNam.khLuongThuc = cloneDeep(this.dsKeHoachLuongThucClone);
    this.dsKeHoachLuongThucClone.forEach(item => {
      item.isEdit = true;
    });
    this.sumRowDetailLuongThuc();
  }

  async newObjectMuoi() {
    //Mặc định load all các đơn vị con của user đăng nhập.
    this.dsMuoiClone = [];
    let i = 1;
    if (this.options && this.options.length > 0) {
      for (let donVi of this.options) {
        this.keHoachMuoiCreate = new KeHoachMuoi();
        this.keHoachMuoiCreate.tenDonVi = donVi.tenDvi;
        this.keHoachMuoiCreate.maDvi = donVi.maDvi;
        this.keHoachMuoiCreate.donViId = donVi.id;
        this.keHoachMuoiCreate.maDonVi = donVi.maDvi;
        this.keHoachMuoiCreate.donViTinh = 'Kg';
        this.keHoachMuoiCreate.stt = i;
        this.keHoachMuoiCreate.tonKhoDauNam = 0;
        this.keHoachMuoiCreate.tonKhoCuoiNam = 0;
        this.keHoachMuoiCreate.nhapTrongNam = 0;
        this.keHoachMuoiCreate.xuatTrongNamMuoi = 0;
        this.dsMuoiClone.push(this.keHoachMuoiCreate);
        i++;
      }
      await this.quanLyHangTrongKhoService.getTrangThaiHtNew({
        listMaDvi: this.arrayDonVi,
        listLoaiVthh: ['04'],
        capDvi: this.userInfo.CAP_DVI,
      }).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            let dataTonCacNamtrc = res.data;
            this.dsMuoiClone.forEach((item) => {
              let tkdn = 0;
              let tkcn = 0;
              let tonKhoCuaDonVi = dataTonCacNamtrc.filter(dt => dt.maDonVi == item.maDonVi);
              if (tonKhoCuaDonVi && tonKhoCuaDonVi.length > 0) {
                tonKhoCuaDonVi.forEach(it => {
                  tkdn = tkdn + it.duDau;
                  tkcn = tkcn + (it.duDau + it.tongNhap - it.tongXuat);
                });
                item.tonKhoDauNam = tkdn;
                item.tonKhoCuoiNam = tkcn;
              }
            });
          }
        }
      });
    }
    this.thongTinChiTieuKeHoachNam.khMuoiDuTru = cloneDeep(this.dsMuoiClone);
    this.sumRowDetailMuoi();
  }

  async newObjectVatTu() {
    if (this.options && this.options.length > 0) {
      let i = 1;
      this.dataVatTuNhap = [];
      this.dataVatTuXuat = [];
      for (let donVi of this.options) {
        let khVatTu = new KhVatTu();
        khVatTu.donViId = donVi.id;
        khVatTu.maDvi = donVi.maDvi;
        khVatTu.tenDvi = donVi.tenDvi;
        khVatTu.sttDonVi = i;
        khVatTu.donViTinh = '';
        khVatTu.vatTuId = null;
        khVatTu.vatTuChaId = null;
        khVatTu.maVatTu = '';
        khVatTu.maVatTuCha = '';
        khVatTu.tenVatTu = '';
        khVatTu.tenVatTuCha = '';
        khVatTu.soLuongNhap = 0;
        khVatTu.soLuongXuat = 0;
        khVatTu.namNhap = null;
        khVatTu.soLuongChuyenSang = 0;
        this.dataVatTuNhap.push(khVatTu);
        this.dataVatTuXuat.push(khVatTu);
        i++;
      }
    }
    this.convertListDataVatTuNhap(this.dataVatTuNhap);
    this.convertListDataVatTuXuat(this.dataVatTuXuat);
    this.expandAll(this.dataVatTuNhapTree);
    this.expandAllVatTuXuat(this.dataVatTuXuatTree);
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
      soQuyetDinh: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.soQuyetDinh
          : null,
        [Validators.required],
      ],
      ngayKy: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.ngayKy
          : null,
        [],
      ],
      ngayHieuLuc: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.ngayHieuLuc
          : null,
        [],
      ],
      chiTieuId: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.chiTieuId
          : null,
        [],
      ],
      namKeHoach: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.namKeHoach
          : null,
        [Validators.required],
      ],
      trichYeu: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.trichYeu
          : null,
        [Validators.required],
      ],
      loaiCanCu: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.loaiCanCu
          : null,
        [Validators.required],
      ],
      canCu: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.canCu
          : null,
        [Validators.required],
      ],
      idCanCu: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.idCanCu
          : null,
        [],
      ],
      arrCanCu: [],
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
          this.keHoachMuoiDialog.tkdnTongSoMuoi = +muoi.value.tkdnTongSo;
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

  changeRadioLoaiCanCu(event) {
    if (event == 'OTHER') {
      this.formData.patchValue({
        canCu: null,
      });
    } else {
      this.findCanCuByYear(this.yearNow);
    }
  }

  redirectChiTieuKeHoachNam() {
    this.showListEvent.emit();
  }

  loadThongTinChiTieuKeHoachNam(id: number) {
    this.chiTieuKeHoachNamService
      .loadThongTinChiTieuKeHoachNam(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.thongTinChiTieuKeHoachNam = res.data;
          this.thongTinChiTieuKeHoachNam.fileDinhKemReqs =
            res.data.fileDinhKems;
          this.thongTinChiTieuKeHoachNam.fileDinhKemReqs.forEach(item => {
            if (item.fileType == FILETYPE.FILE_DINH_KEM) {
              this.taiLieuDinhKemList.push(item);
            } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
              this.listCcPhapLy.push(item);
            }
          });
          this.dsKeHoachLuongThucClone = cloneDeep(
            this.thongTinChiTieuKeHoachNam.khLuongThuc,
          );
          this.dsMuoiClone = cloneDeep(
            this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
          );
          if (this.thongTinChiTieuKeHoachNam.soQuyetDinh && this.thongTinChiTieuKeHoachNam.soQuyetDinh.split('/').length > 1) {
            this.qdTCDT = this.thongTinChiTieuKeHoachNam.soQuyetDinh.split('/')[1];
          }
          // Xử lý vật tư to tree
          this.dataVatTuNhap = cloneDeep(this.thongTinChiTieuKeHoachNam.khVatTuNhap);
          this.dataVatTuXuat = cloneDeep(this.thongTinChiTieuKeHoachNam.khVatTuXuat);
          this.convertListDataVatTuNhap(this.dataVatTuNhap);
          this.convertListDataVatTuXuat(this.dataVatTuXuat);
          this.expandAll(this.dataVatTuNhapTree);
          this.expandAllVatTuXuat(this.dataVatTuXuatTree);
          if (this.thongTinChiTieuKeHoachNam.trangThai == STATUS.DA_DUYET_LDC || this.thongTinChiTieuKeHoachNam.trangThai == STATUS.DA_DUYET_LDV) {
            this.formData.controls['ngayKy'].setValidators([Validators.required]);
            this.formData.controls['ngayHieuLuc'].setValidators([Validators.required]);
            this.formData.controls['soQuyetDinh'].setValidators([Validators.required]);
          } else {
            this.formData.controls['ngayKy'].setValidators([]);
            this.formData.controls['ngayHieuLuc'].setValidators([]);
            this.formData.controls['soQuyetDinh'].setValidators([]);
          }
          this.formData.patchValue({
            id: this.thongTinChiTieuKeHoachNam.id,
            loaiCanCu: this.thongTinChiTieuKeHoachNam.loaiCanCu,
            namKeHoach: this.thongTinChiTieuKeHoachNam.namKeHoach,
            canCu: this.thongTinChiTieuKeHoachNam.canCu,
            trichYeu: this.thongTinChiTieuKeHoachNam.trichYeu,
            soQuyetDinh: this.thongTinChiTieuKeHoachNam.soQuyetDinh ? this.thongTinChiTieuKeHoachNam.soQuyetDinh : null,
            ngayKy: this.thongTinChiTieuKeHoachNam.ngayKy,
            ngayHieuLuc: this.thongTinChiTieuKeHoachNam.ngayHieuLuc,
            chiTieuId: this.thongTinChiTieuKeHoachNam.qdGocId,
          });
          this.findCanCuByYear(this.thongTinChiTieuKeHoachNam.namKeHoach, this.thongTinChiTieuKeHoachNam);
          this.loadData();
          // this.formData.patchValue({
          //   soQD: this.formData.get('soQuyetDinh').value,
          // });
          this.sumRowDetailMuoi();
          this.sumRowDetailLuongThuc();
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }

  convertListDataVatTuNhap(data) {
    this.dataVatTuNhapTree = [];
    if (data && data.length > 0) {
      this.dataVatTuNhapTree = chain(data).groupBy('tenDvi').map((value, key) => {
        let rs = chain(value)
          .groupBy('maVatTuCha')
          .map((v, k) => {
              return {
                tenDvi: key,
                maDvi: value[0]?.maDvi,
                idVirtual: uuidv4(),
                maVatTuCha: k,
                tenVatTuCha: v[0]?.tenVatTuCha,
                kyHieu: v[0]?.kyHieu,
                dataChild: v,
              };
            },
          ).value();
        return {
          tenDvi: key,
          maDvi: value[0].maDvi,
          donViId: value[0].donViId,
          dataChild: rs,
          idVirtual: uuidv4(),
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
      this.dataVatTuXuatTree = chain(data).groupBy('tenDvi').map((value, key) => {
        let rs = chain(value)
          .groupBy('maVatTuCha')
          .map((v, k) => {
              let rs1 = chain(v)
                .groupBy('maVatTu')
                .map((v1, k1) => {
                    return {
                      maVatTu: k1,
                      tenVatTu: v1[0]?.tenVatTu,
                      donViTinh: v1[0]?.donViTinh,
                      tenDvi: v1[0]?.tenDvi,
                      maDvi: v1[0]?.maDvi,
                      idVirtual: uuidv4(),
                      maVatTuCha: v1[0]?.maVatTuCha,
                      dataChild: v1,
                    };
                  },
                ).value();
              return {
                tenDvi: key,
                maDvi: value[0]?.maDvi,
                idVirtual: uuidv4(),
                maVatTuCha: k,
                donViTinh: v[0]?.donViTinh,
                kyHieu: v[0]?.kyHieu,
                tenVatTuCha: v[0]?.tenVatTuCha,
                dataChild: rs1,
              };
            },
          ).value();
        return {
          tenDvi: key,
          maDvi: value[0].maDvi,
          donViId: value[0].donViId,
          dataChild: rs,
          idVirtual: uuidv4(),
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
        this.expandSetNhap.add(s.idVirtual);
        if (s.dataChild && s.dataChild.length > 0) {
          s.dataChild.forEach(item => {
            this.expandSetNhap.add(item.idVirtual);
          });
        }
      });
    }
  }

  expandAllVatTuXuat(table: any[]) {
    if (table && table.length > 0) {
      table.forEach(s => {
        this.expandSetXuat.add(s.idVirtual);
        if (s.dataChild && s.dataChild.length > 0) {
          s.dataChild.forEach(item => {
            this.expandSetXuat.add(item.idVirtual);
            if (item.dataChild && item.dataChild.length > 0) {
              item.dataChild.forEach(item1 => {
                this.expandSetXuat.add(item1.idVirtual);
              });
            }
          });
        }
      });
    }
  }

  // convertKhVatTuList(khVatTus: Array<KeHoachVatTu>) {
  //   const khVatTuList = new Array<KeHoachVatTu>();
  //   let khVatTu = khVatTus;
  //   for (let i = 0; i < khVatTu.length; i++) {
  //     for (let j = 0; j < khVatTu[i].vatTuThietBi.length; j++) {
  //       const vatTuTemp = new KeHoachVatTu();
  //       vatTuTemp.donViId = khVatTu[i].donViId;
  //       vatTuTemp.maDvi = khVatTu[i].maDonVi;
  //       vatTuTemp.stt = khVatTu[i].stt;
  //       vatTuTemp.tenDonVi = khVatTu[i].tenDonVi;
  //       vatTuTemp.vatTuThietBi[0] = khVatTu[i].vatTuThietBi[j];
  //       khVatTuList.push(vatTuTemp);
  //     }
  //   }
  //   khVatTuList.forEach((vt, i) => {
  //     vt.stt = i + 1;
  //     vt.isEdit = false;
  //   });
  //   this.thongTinChiTieuKeHoachNam.khVatTu = khVatTuList;
  // }

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

  exportData() {
    var workbook = XLSX.utils.book_new();
    const tableLuongThuc = document
      .getElementById('table-luong-thuc')
      .getElementsByTagName('table');
    if (tableLuongThuc && tableLuongThuc.length > 0) {
      let sheetLuongThuc = XLSX.utils.table_to_sheet(tableLuongThuc[0]);
      sheetLuongThuc['!cols'] = [];
      sheetLuongThuc['!cols'][24] = {hidden: true};
      sheetLuongThuc['!cols'][25] = {hidden: true};
      XLSX.utils.book_append_sheet(workbook, sheetLuongThuc, 'sheetLuongThuc');
    }
    const tableMuoi = document
      .getElementById('table-muoi')
      .getElementsByTagName('table');
    if (tableMuoi && tableMuoi.length > 0) {
      let sheetMuoi = XLSX.utils.table_to_sheet(tableMuoi[0]);
      sheetMuoi['!cols'] = [];
      sheetMuoi['!cols'][12] = {hidden: true};
      sheetMuoi['!cols'][13] = {hidden: true};
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
        this.thongTinChiTieuKeHoachNam.khLuongThuc =
          this.thongTinChiTieuKeHoachNam.khLuongThuc.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.thongTinChiTieuKeHoachNam?.khLuongThuc.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        this.dsMuoiClone = cloneDeep(
          this.thongTinChiTieuKeHoachNam.khLuongThuc,
        );
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
        this.thongTinChiTieuKeHoachNam.khMuoiDuTru =
          this.thongTinChiTieuKeHoachNam.khMuoiDuTru.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.thongTinChiTieuKeHoachNam?.khMuoiDuTru.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        this.dsMuoiClone = cloneDeep(
          this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
        );
        this.sumRowDetailMuoi();
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

  guiDuyet() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return;
    }
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
          this.save(true);
          // this.redirectChiTieuKeHoachNam()
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
  }

  taoQuyetDinh() {
    this.spinner.show();
    this.formData.controls['soQuyetDinh'].setValidators([Validators.required]);
    this.formData.controls['ngayKy'].setValidators([Validators.required]);
    this.formData.controls['ngayHieuLuc'].setValidators([Validators.required]);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
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
              trangThai = STATUS.TU_CHOI_TP;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              trangThai = STATUS.TU_CHOI_LDC;
              break;
            }
            case STATUS.CHO_DUYET_LDV: {
              trangThai = STATUS.TU_CHOI_LDV;
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
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return;
    }
    //Kiểm tra số nhập trong năm thóc , gạo có bằng chỉ tiêu BTC giao TCDT hoặc TCDT giao Cục hay ko ?
    let checkFlag = this.soSanhCtCapTrenGiao('save', isGuiDuyet);
    if (!checkFlag) {
      this.spinner.hide();
      return;
    }
    this.thongTinChiTieuKeHoachNam.soQuyetDinh = this.formData.get('soQuyetDinh').value ? this.formData.get('soQuyetDinh').value : null;
    this.thongTinChiTieuKeHoachNam.ngayKy = this.formData.get('ngayKy').value ?? null;
    this.thongTinChiTieuKeHoachNam.ngayHieuLuc =
      this.formData.get('ngayHieuLuc').value ?? null;
    this.thongTinChiTieuKeHoachNam.namKeHoach =
      this.formData.get('namKeHoach').value;
    this.thongTinChiTieuKeHoachNam.trichYeu =
      this.formData.get('trichYeu').value;
    this.thongTinChiTieuKeHoachNam.loaiCanCu =
      this.formData.get('loaiCanCu').value;
    this.thongTinChiTieuKeHoachNam.loai = this.LOAI_QD.PA;
    this.thongTinChiTieuKeHoachNam.chiTieuId = this.formData.get('chiTieuId').value;
    this.thongTinChiTieuKeHoachNam.canCu = this.formData.get('canCu').value;
    this.thongTinChiTieuKeHoachNam.idCanCu = this.formData.get('idCanCu').value;
    this.listFile = [];
    if (this.taiLieuDinhKemList.length > 0) {
      this.taiLieuDinhKemList.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM;
        this.listFile.push(item);
      });
    }
    if (this.listCcPhapLy.length > 0) {
      this.listCcPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY;
        this.listFile.push(element);
      });
    }
    if (this.listFile && this.listFile.length > 0) {
      this.thongTinChiTieuKeHoachNam.fileDinhKemReqs = this.listFile;
    }
    this.thongTinChiTieuKeHoachNamInput = cloneDeep(
      this.thongTinChiTieuKeHoachNam,
    );
    this.thongTinChiTieuKeHoachNamInput.khMuoi = [];
    this.thongTinChiTieuKeHoachNamInput.khMuoi = cloneDeep(
      this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
    );
    delete this.thongTinChiTieuKeHoachNamInput.khMuoiDuTru;
    //convert to flat object
    this.thongTinChiTieuKeHoachNamInput.khVatTuNhap = this.dataVatTuNhap;
    this.thongTinChiTieuKeHoachNamInput.khVatTuXuat = this.dataVatTuXuat;
    //xử lý data nhập xuất vật tư, nếu đơn vị nào đó đã đươợc thêm 1 loại hàng hóa thì xóa dòng trống đi.
    // let dataVtNhap = this.thongTinChiTieuKeHoachNamInput.khVatTuNhap.filter()
    if (this.thongTinChiTieuKeHoachNam.id > 0) {
      this.chiTieuKeHoachNamService
        .chinhSuaChiTieuKeHoach(this.thongTinChiTieuKeHoachNamInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let trangThai;
              if (this.userService.isTongCuc()) {
                switch (this.thongTinChiTieuKeHoachNam.trangThai) {
                  case STATUS.DU_THAO: {
                    trangThai = STATUS.CHO_DUYET_LDV;
                    break;
                  }
                  case STATUS.TU_CHOI_LDV: {
                    trangThai = STATUS.CHO_DUYET_LDV;
                    break;
                  }
                }
              }
              if (this.userService.isCuc()) {
                switch (this.thongTinChiTieuKeHoachNam.trangThai) {
                  case STATUS.DU_THAO: {
                    trangThai = STATUS.CHO_DUYET_TP;
                    break;
                  }
                  case STATUS.TU_CHOI_TP: {
                    trangThai = STATUS.CHO_DUYET_TP;
                    break;
                  }
                  case STATUS.TU_CHOI_LDC: {
                    trangThai = STATUS.CHO_DUYET_TP;
                    break;
                  }
                }
              }
              let body = {
                id: res.data.id,
                trangThai: trangThai,
              };
              this.chiTieuKeHoachNamService.updateStatus(body)
                .then((resp) => {
                  if (resp.msg == MESSAGE.SUCCESS) {
                    if (res.msg == MESSAGE.SUCCESS) {
                      this.notification.success(
                        MESSAGE.SUCCESS,
                        MESSAGE.UPDATE_SUCCESS,
                      );
                      this.redirectChiTieuKeHoachNam();
                    } else {
                      this.notification.error(MESSAGE.ERROR, res.msg);
                    }
                  } else {
                    this.notification.error(MESSAGE.ERROR, resp.msg);
                  }
                });
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
      this.chiTieuKeHoachNamService
        .themMoiChiTieuKeHoach(this.thongTinChiTieuKeHoachNamInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let body;
              if (this.userService.isTongCuc()) {
                body = {
                  id: res.data.id,
                  trangThai: STATUS.CHO_DUYET_LDV,
                };
              }
              if (this.userService.isCuc()) {
                body = {
                  id: res.data.id,
                  trangThai: STATUS.CHO_DUYET_TP,
                };
              }
              this.chiTieuKeHoachNamService.updateStatus(body)
                .then((resp) => {
                  if (resp.msg == MESSAGE.SUCCESS) {
                    if (res.msg == MESSAGE.SUCCESS) {
                      this.notification.success(
                        MESSAGE.SUCCESS,
                        MESSAGE.ADD_SUCCESS,
                      );
                      this.redirectChiTieuKeHoachNam();
                    } else {
                      this.notification.error(MESSAGE.ERROR, res.msg);
                    }
                  } else {
                    this.notification.error(MESSAGE.ERROR, resp.msg);
                  }
                });
            } else {
              this.thongTinChiTieuKeHoachNam = res.data;
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

  selectNam() {
    this.yearNow = this.formData.get('namKeHoach').value;
    if (!this.id) {
      if ((this.thongTinChiTieuKeHoachNam.capDvi == '1' && this.formData.get('loaiCanCu').value != 'OTHER') || this.thongTinChiTieuKeHoachNam.capDvi == '2') {
        this.findCanCuByYear(this.yearNow);
      }
      this.initDataThemMoi();
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
  }

  cancelEdit(index: number): void {
    this.dsKeHoachLuongThucClone = cloneDeep(
      this.thongTinChiTieuKeHoachNam.khLuongThuc,
    );
    this.dsKeHoachLuongThucClone[index].isEdit = false;
    this.cdr.detectChanges();
  }

  saveEdit(i: number): void {
    this.dsKeHoachLuongThucClone[i].isEdit = false;
    this.dsKeHoachLuongThucClone[i].tkcnTongGao = this.dsKeHoachLuongThucClone[i].tkdnTongGao + (this.dsKeHoachLuongThucClone[i].ntnGao) - this.dsKeHoachLuongThucClone[i].xtnTongGao;
    this.dsKeHoachLuongThucClone[i].tkcnTongThoc = this.dsKeHoachLuongThucClone[i].tkdnTongThoc + (this.dsKeHoachLuongThucClone[i].ntnThoc) - this.dsKeHoachLuongThucClone[i].xtnTongThoc;
    this.dsKeHoachLuongThucClone[i].tkcnTongSoQuyThoc = (this.dsKeHoachLuongThucClone[i].tkcnTongGao * 2) + this.dsKeHoachLuongThucClone[i].tkcnTongThoc;
    Object.assign(
      this.thongTinChiTieuKeHoachNam.khLuongThuc[i],
      this.dsKeHoachLuongThucClone[i],
    );
    this.sumRowDetailLuongThuc();
    this.cdr.detectChanges();
  }

  calculatorxtnTongThoc(i: number): number {
    this.dsKeHoachLuongThucClone[i].xtnTongThoc = this.dsKeHoachLuongThucClone[
      i
      ].xtnThoc.reduce((a, b) => a + +b.soLuong, 0);
    return this.dsKeHoachLuongThucClone[i].xtnTongThoc;
  }

  calculatorxtnTongGao(i: number): number {
    this.dsKeHoachLuongThucClone[i].xtnTongGao = this.dsKeHoachLuongThucClone[i].xtnGao.reduce((a, b) => a + +b.soLuong, 0);
    return this.dsKeHoachLuongThucClone[i].xtnTongGao;
  }

  calculatortkcnTongThoc(i: number): string {
    this.dsKeHoachLuongThucClone[i].tkcnTongThoc =
      (this.dsKeHoachLuongThucClone[i].tkdnTongThoc) + this.dsKeHoachLuongThucClone[i].ntnThoc - this.dsKeHoachLuongThucClone[i].xtnTongThoc;
    return this.dsKeHoachLuongThucClone[i].tkcnTongThoc
      ? Intl.NumberFormat('vi-VN').format(
        this.dsKeHoachLuongThucClone[i].tkcnTongThoc,
      )
      : '0';
  }

  calculatortkcnTongGao(i: number): string {
    this.dsKeHoachLuongThucClone[i].tkcnTongGao =
      (this.dsKeHoachLuongThucClone[i].tkdnTongGao) +
      this.dsKeHoachLuongThucClone[i].ntnGao -
      this.dsKeHoachLuongThucClone[i].xtnTongGao;
    return this.dsKeHoachLuongThucClone[i].tkcnTongGao
      ? Intl.NumberFormat('vi-VN').format(
        (this.dsKeHoachLuongThucClone[i].tkcnTongGao),
      )
      : '0';
  }

  calculatorxtnTongSoQuyThoc(i: number): string {
    this.dsKeHoachLuongThucClone[i].xtnTongSoQuyThoc =
      +this.dsKeHoachLuongThucClone[i].xtnTongThoc +
      +this.dsKeHoachLuongThucClone[i].xtnTongGao * 2;
    return this.dsKeHoachLuongThucClone[i].xtnTongSoQuyThoc
      ? Intl.NumberFormat('vi-VN').format(
        this.dsKeHoachLuongThucClone[i].xtnTongSoQuyThoc,
      )
      : '0';
  }

  calculatortkcnTongSoQuyThoc(i: number): string {
    this.dsKeHoachLuongThucClone[i].tkcnTongSoQuyThoc =
      this.dsKeHoachLuongThucClone[i].tkcnTongThoc +
      this.dsKeHoachLuongThucClone[i].tkcnTongGao * 2;
    return this.dsKeHoachLuongThucClone[i].tkcnTongSoQuyThoc
      ? Intl.NumberFormat('vi-VN').format(
        (this.dsKeHoachLuongThucClone[i].tkcnTongSoQuyThoc),
      )
      : '0';
  }

  calculatorntnTongSoQuyThoc(i: number): string {
    this.dsKeHoachLuongThucClone[i].ntnTongSoQuyThoc =
      +this.dsKeHoachLuongThucClone[i].ntnThoc +
      +this.dsKeHoachLuongThucClone[i].ntnGao * 2;
    return this.dsKeHoachLuongThucClone[i].ntnTongSoQuyThoc
      ? Intl.NumberFormat('vi-VN').format(
        this.dsKeHoachLuongThucClone[i].ntnTongSoQuyThoc,
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
    if (this.userService.isTongCuc()) {
      if (action == 'add') {
        totalNtnThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnThoc, 0) + this.keHoachLuongThucCreate.ntnThoc;
        totalNtnGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnGao, 0) + this.keHoachLuongThucCreate.ntnGao;
        if (totalNtnThoc || totalNtnGao) {
          if (totalNtnThoc > (this.dataQdCanCu?.ltThocMua ? this.dataQdCanCu.ltThocMua : 0)) {
            this.notification.error(MESSAGE.ERROR, 'Nhập quá số lượng mua thóc BTC giao');
            return false;
          }
          if (totalNtnGao > (this.dataQdCanCu?.ltGaoMua ? this.dataQdCanCu.ltGaoMua : 0)) {
            this.notification.error(MESSAGE.ERROR, 'Nhập quá số lượng mua gạo BTC giao');
            return false;
          }
        }
      } else {
        totalNtnThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnThoc, 0);
        totalNtnGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnGao, 0);
        if (totalNtnThoc || totalNtnGao) {
          if (totalNtnThoc < (this.dataQdCanCu?.ltThocMua ? this.dataQdCanCu.ltThocMua : 0) && isGuiDuyet) {
            this.notification.error(MESSAGE.ERROR, 'Nhập chưa bằng số chỉ tiêu mua thóc BTC giao');
            return false;
          }
          if (totalNtnGao < (this.dataQdCanCu?.ltGaoMua ? this.dataQdCanCu.ltGaoMua : 0) && isGuiDuyet) {
            this.notification.error(MESSAGE.ERROR, 'Nhập chưa bằng số chỉ tiêu mua gạo BTC giao');
            return false;
          }
        }
      }
    } else {
      if (action == 'add') {
        totalNtnThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnThoc, 0) + this.keHoachLuongThucCreate.ntnThoc;
        totalNtnGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnGao, 0) + this.keHoachLuongThucCreate.ntnGao;
        if (totalNtnThoc || totalNtnGao) {
          if (totalNtnThoc > (this.dataQdTCDTGiaoCuc?.ltThocMua ? this.dataQdTCDTGiaoCuc.ltThocMua : 0)) {
            this.notification.error(MESSAGE.ERROR, 'Nhập quá số lượng mua thóc TCDT giao');
            return false;
          }
          if (totalNtnGao > (this.dataQdTCDTGiaoCuc?.ltGaoMua ? this.dataQdTCDTGiaoCuc.ltGaoMua : 0)) {
            this.notification.error(MESSAGE.ERROR, 'Nhập quá số lượng mua gạo TCDT giao');
            return false;
          }
        }
      } else {
        totalNtnThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnThoc, 0);
        totalNtnGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnGao, 0);
        if (totalNtnThoc || totalNtnGao) {
          if (totalNtnThoc < (this.dataQdTCDTGiaoCuc?.ltThocMua ? this.dataQdTCDTGiaoCuc.ltThocMua : 0) && isGuiDuyet) {
            this.notification.error(MESSAGE.ERROR, 'Nhập chưa bằng số chỉ tiêu mua thóc TCDT giao');
            return false;
          }
          if (totalNtnGao < (this.dataQdTCDTGiaoCuc?.ltGaoMua ? this.dataQdTCDTGiaoCuc.ltGaoMua : 0) && isGuiDuyet) {
            this.notification.error(MESSAGE.ERROR, 'Nhập chưa bằng số chỉ tiêu mua gạo TCDT giao');
            return false;
            ;
          }
        }
      }
    }
    return checkFlag;
  }

  procThemMoiKHLT() {
    this.dsKeHoachLuongThucClone.forEach((item) => {
      const tkdnThoc1 = {
        id: null,
        nam: this.yearNow - 3,
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
        nam: this.yearNow - 1,
        soLuong: +item.tkdnThoc[2].soLuong,
        vatTuId: null,
      };
      item.tkdnThoc = [tkdnThoc1, tkdnThoc2, tkdnThoc3];
      const tkdnGao1 = {
        id: null,
        nam: this.yearNow - 3,
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
        nam: this.yearNow - 1,
        soLuong: +item.tkdnGao[2].soLuong,
        vatTuId: null,
      };
      item.tkdnGao = [tkdnGao1, tkdnGao2, tkdnGao3];
      const xtnThoc1 = {
        id: null,
        nam: this.yearNow - 3,
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
        nam: this.yearNow - 1,
        soLuong: +item.xtnThoc[2].soLuong,
        vatTuId: null,
      };
      item.xtnThoc = [xtnThoc1, xtnThoc2, xtnThoc3];
      const xtnGao1 = {
        id: null,
        nam: this.yearNow - 3,
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
        nam: this.yearNow - 1,
        soLuong: +item.xtnGao[2].soLuong,
        vatTuId: null,
      };
      item.xtnGao = [xtnGao1, xtnGao2, xtnGao3];
    });
  }

  saveEditMuoi(i: number) {
    this.dsMuoiClone[i].isEdit = false;
    Object.assign(
      this.thongTinChiTieuKeHoachNam.khMuoiDuTru[i],
      this.dsMuoiClone[i],
    );
    this.sumRowDetailMuoi();
    this.cdr.detectChanges();
  }

  sumRowDetailMuoi() {
    this.sumTotalKhDuTruMuoi.tonKhoDauNam = this.dsMuoiClone?.reduce((a, b) => a + +b.tonKhoDauNam, 0);
    this.sumTotalKhDuTruMuoi.nhapTrongNam = this.dsMuoiClone?.reduce((a, b) => a + +b.nhapTrongNam, 0);
    this.sumTotalKhDuTruMuoi.xuatTrongNamMuoi = this.dsMuoiClone?.reduce((a, b) => a + +b.xuatTrongNamMuoi, 0);
    this.sumTotalKhDuTruMuoi.tonKhoCuoiNam = this.sumTotalKhDuTruMuoi.tonKhoDauNam + this.sumTotalKhDuTruMuoi.nhapTrongNam - this.sumTotalKhDuTruMuoi.xuatTrongNamMuoi;
  }

  sumRowDetailLuongThuc() {
    this.sumTotalKhDuTruLuongThuc.tkdnTongSoQuyThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnTongSoQuyThoc, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnTongThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnTongThoc, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnThoc_nam1 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnThoc[0].soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnThoc_nam2 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnThoc[1].soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnThoc_nam3 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnThoc[2].soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnTongGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnTongGao, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnGao_nam1 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnGao[0].soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnGao_nam2 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnGao[1].soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.tkdnGao_nam3 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkdnGao[2].soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.ntnTongSoQuyThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnTongSoQuyThoc, 0);
    this.sumTotalKhDuTruLuongThuc.ntnThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnThoc, 0);
    this.sumTotalKhDuTruLuongThuc.ntnGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnGao, 0);
    this.sumTotalKhDuTruLuongThuc.xtnTongSoQuyThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnTongSoQuyThoc, 0);
    this.sumTotalKhDuTruLuongThuc.xtnTongThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnTongThoc, 0);
    this.sumTotalKhDuTruLuongThuc.xtnThoc_nam1 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnThoc[0].soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.xtnThoc_nam2 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnThoc[1].soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.xtnThoc_nam3 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnThoc[2].soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.xtnTongGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnTongGao, 0);
    this.sumTotalKhDuTruLuongThuc.xtnGao_nam1 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnGao[0].soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.xtnGao_nam2 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnGao[1].soLuong, 0);
    this.sumTotalKhDuTruLuongThuc.xtnGao_nam3 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +(b.xtnGao[2]?.soLuong ?? 0), 0);
    this.sumTotalKhDuTruLuongThuc.tkcnTongSoQuyThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkcnTongSoQuyThoc, 0);
    this.sumTotalKhDuTruLuongThuc.tkcnTongThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkcnTongThoc, 0);
    this.sumTotalKhDuTruLuongThuc.tkcnTongGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.tkcnTongGao, 0);
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
    if (this.tabSelected == this.tab.luongThuc) {
      this.dsKeHoachLuongThucClone =
        this.thongTinChiTieuKeHoachNam.khLuongThuc.slice(
          this.pageSize * (this.page - 1),
          this.pageSize * this.page,
        );
      this.totalRecord = this.thongTinChiTieuKeHoachNam.khLuongThuc?.length;
    } else if (this.tabSelected == this.tab.muoi) {
      this.dsMuoiClone = this.thongTinChiTieuKeHoachNam.khMuoiDuTru?.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page,
      );
      this.totalRecord = this.thongTinChiTieuKeHoachNam.khMuoiDuTru?.length;
    } else if (this.tabSelected == this.tab.vatTu) {
      this.dsVatTuClone = this.thongTinChiTieuKeHoachNam.khVatTu?.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page,
      );
      this.totalRecord = this.thongTinChiTieuKeHoachNam.khVatTu?.length;
    }
    this.cdr.detectChanges();
  }

  checkTrangThaiRecord(): boolean {
    return (
      this.thongTinChiTieuKeHoachNam.trangThai == STATUS.CHO_DUYET_LDV || this.thongTinChiTieuKeHoachNam.trangThai == STATUS.CHO_DUYET_LDC || this.thongTinChiTieuKeHoachNam.trangThai == STATUS.DA_DUYET_LDC || this.thongTinChiTieuKeHoachNam.trangThai == STATUS.DA_DUYET_LDV
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
  onExpandChangeNhap(id: string, checked: boolean): void {
    console.log(id, 'idididid');
    console.log(checked, 'checkedchecked');
    if (checked) {
      this.expandSetNhap.add(id);
    } else {
      this.expandSetNhap.delete(id);
    }
  }

  onExpandChangeXuat(id: string, checked: boolean): void {
    console.log(id, 'idididid');
    console.log(checked, 'checkedchecked');
    if (checked) {
      this.expandSetXuat.add(id);
    } else {
      this.expandSetXuat.delete(id);
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
        if (tab == 'NHAP') {
          //NHAP
          if (type == 'them') {
            let countByDv = this.dataVatTuNhap.filter(it => it.maDvi == item.maDvi).length;
            if (countByDv > 0) {
              this.dataVatTuNhap.push(item);
            } else {
              let indexOldItem = this.dataVatTuNhap.findIndex(it => it.maDvi == item.maDvi);
              this.dataVatTuNhap.splice(indexOldItem, 1, item);
            }
            // this.dataVatTuNhap.push(item);
          } else {
            let index = -1;
            if (isRoot) {
              //check trùng bản ghi
              let uniqueRecord = this.dataVatTuNhap.find(it => it.maDvi == item.maDvi && it.maVatTuCha == item.maVatTuCha);
              if (uniqueRecord && item.maVatTuCha != data.maVatTuCha) {
                this.notification.warning(MESSAGE.WARNING, item.tenVatTuCha + ' đã được thêm cho đơn vị ' + item.tenDvi);
                return;
              }
              index = this.dataVatTuNhap.findIndex(it => it.maDvi == data.maDvi && it.maVatTuCha == data.maVatTuCha);
            } else {
              //check trùng bản ghi
              let uniqueRecord = this.dataVatTuNhap.find(it => it.maDvi == item.maDvi && it.maVatTuCha == item.maVatTuCha && it.maVatTu == data.maVatTu);
              if (uniqueRecord && item.maVatTu != data.maVatTu) {
                this.notification.warning(MESSAGE.WARNING, item.tenVatTu + ' đã được thêm cho đơn vị ' + item.tenDvi);
                return;
              }
              index = this.dataVatTuNhap.findIndex(it => it.maDvi == data.maDvi && it.maVatTuCha == data.maVatTuCha && it.maVatTu == data.maVatTu);
            }
            if (index >= 0) {
              this.dataVatTuNhap.splice(index, 1, item);
            } else {
              this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy bản ghi cần sửa.');
              return;
            }
          }
          this.convertListDataVatTuNhap(this.dataVatTuNhap);
          this.expandAll(this.dataVatTuNhapTree);
        } else {
          //XUATTTTTTTTTTT
          if (type == 'them') {
            let countByDv = this.dataVatTuXuat.filter(it => it.maDvi == item.maDvi).length;
            if (countByDv > 0) {
              this.dataVatTuXuat.push(item);
            } else {
              let indexOldItem = this.dataVatTuXuat.findIndex(it => it.maDvi == item.maDvi);
              this.dataVatTuXuat.splice(indexOldItem, 1, item);
            }
          } else {
            let index = -1;
            if (isRoot) {
              index = this.dataVatTuXuat.findIndex(it => it.maDvi == data.maDvi && it.maVatTuCha == data.maVatTuCha);
            } else {
              index = this.dataVatTuXuat.findIndex(it => it.maDvi == data.maDvi && it.maVatTuCha == data.maVatTuCha && it.maVatTu == data.maVatTu);
            }
            if (index >= 0) {
              this.dataVatTuXuat.splice(index, 1, item);
            } else {
              this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy bản ghi cần sửa.');
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
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          let index = -1;
          if (isRoot) {
            let arrayAfterRemove = this.dataVatTuNhap.filter(it => (it.maDvi != item.maDvi) || (it.maDvi == item.maDvi && it.maVatTuCha != item.maVatTuCha));
            this.dataVatTuNhap = arrayAfterRemove;
          } else {
            index = this.dataVatTuNhap.findIndex(it => it.maDvi == item.maDvi && it.maVatTuCha == item.maVatTuCha && it.maVatTu == item.maVatTu);
          }
          if (index >= 0) {
            this.dataVatTuNhap.splice(index, 1);
          }
          this.convertListDataVatTuNhap(this.dataVatTuNhap);
          this.expandAll(this.dataVatTuNhapTree);
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  xoaKeHoachVatTuXuat(item: any, level: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
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
            index = this.dataVatTuXuat.findIndex(it => it.maDvi == item.maDvi && it.maVatTuCha == item.maVatTuCha && it.maVatTu == item.maVatTu && it.namNhap == item.namNhap);
          }
          if (index >= 0) {
            this.dataVatTuXuat.splice(index, 1);
          }
          this.convertListDataVatTuXuat(this.dataVatTuXuat);
          this.expandAllVatTuXuat(this.dataVatTuXuatTree);
        } catch (e) {
          console.log('error', e);
        }
      },
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
        });
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

  async baoCaoNhapVt() {
    try {
      await this.spinner.show();
      await this.chiTieuKeHoachNamService.xuatBaoCaoNhapVt({
        id: this.id,
        namKeHoach: this.formData.value.namKeHoach
      }).then(async (response) => {
        if (response && response.status == 200) {
          const contentDisposition = response.headers.get('content-disposition');
          const fileName = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
          saveAs(response.body, JSON.parse(fileName));
        }
      });
    } catch (e) {
      console.log(e);
    } finally {
      await this.spinner.hide();
    }
  }
}
