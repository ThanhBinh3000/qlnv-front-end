import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { LEVEL, LEVEL_USER, LOAI_QD_CTKH } from 'src/app/constants/config';
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
import { v4 as uuidv4 } from 'uuid';
import { TAB_SELECTED } from './thong-tin-chi-tieu-ke-hoach-nam.constant';
import { STATUS } from '../../../../../../constants/status';
import { QuyetDinhBtcTcdtService } from '../../../../../../services/quyetDinhBtcTcdt.service';
import { QuanLyHangTrongKhoService } from '../../../../../../services/quanLyHangTrongKho.service';
import { QuyetDinhTtcpService } from '../../../../../../services/quyetDinhTtcp.service';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { ThemSuaKeHoachVatTuComponent } from './them-sua-ke-hoach-vat-tu/them-sua-ke-hoach-vat-tu.component';
import { FILETYPE, PREVIEW } from '../../../../../../constants/fileType';
import moment from 'moment/moment';
import printJS from 'print-js';

@Component({
  selector: 'app-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl: './thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: ['./thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThongTinChiTieuKeHoachNamComponent implements OnInit {
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
  //xem trước
  pdfSrc: any;
  wordSrc: any;
  excelSrc: any;
  printSrc: any;
  pdfBlob: any;
  excelBlob: any;
  showDlgPreview = false;
  showDlgPreviewTheoCuc = false;


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
  keHoachVatTuCreate: KeHoachVatTu;
  isAddVatTu: boolean = false;
  dataVatTuCha: any[] = [];
  dataVatTuChaShow: any[] = [];
  dataVatTuCon: any[] = [];
  dataVatTuConClone: any[] = [];
  dataVatTuConShow: any[] = [];
  lastBreadcrumb: string;
  canCuList: any[] = [];
  taiLieuDinhKemList: any[] = [];
  listCcPhapLy: any[] = [];
  listFile: any[] = [];
  page: number = 1;
  pageSize: number = 100;
  totalRecord: number = 0;
  keHoachLuongThucShow: Array<KeHoachLuongThuc> = [];
  keHoachMuoiShow: Array<KeHoachMuoi> = [];
  keHoachVatTuShow: Array<KeHoachVatTu> = [];
  userInfo: UserLogin;
  tenDonViCuc: string;
  //dialog
  openSelectCanCu: any;
  canCuData: any;
  allChecked = false;
  indeterminate = false;
  // dsCanCu: Array<{ label: string; value: string }> = [];
  dsCanCu: any[] = [];
  dataVatTuNhap: any[] = [];
  dataVatTuNhapTree: any[] = [];
  dataVatTuXuat: any[] = [];
  dataVatTuXuatTree: any[] = [];
  expandSetVatTuNhap = new Set<string>();
  expandSetVatTuXuat = new Set<string>();
  keHoachVatTuNhapCreate: KeHoachVatTuCustom = new KeHoachVatTuCustom();
  keHoachVatTuXuatCreate: KeHoachVatTuCustom = new KeHoachVatTuCustom();
  dataVatTuNhapEdit: Array<KeHoachVatTuCustom> = [];
  dataVatTuXuatEdit: Array<KeHoachVatTuCustom> = [];
  dataVatTuConEditNhapShow: any[] = [];
  dataVatTuConEditXuatShow: any[] = [];
  arrayDonVi: any[] = [];
  dataQdTtcpOrBtc: any;
  dataQdTCDTGiaoCuc: any;
  expandSet = new Set<number>();
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
  subTab = '';

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
        namKeHoach: dayjs().get('year'),
      });
      this.thongTinChiTieuKeHoachNam.capDvi = this.userInfo.CAP_DVI;
      // await this.findCanCuByYear(this.yearNow);
      // await this.initDataThemMoi();
      // await this.loadQdTtcpGiaoBoNganh(this.yearNow);
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
    this.spinner.show();
    try {
      if (chiTieuKhNam) {
        if (chiTieuKhNam.capDvi == '2' && (!chiTieuKhNam.loaiCanCu || chiTieuKhNam.loaiCanCu == 'QD-TCDT')) {
          let res = await this.chiTieuKeHoachNamService.canCuCucQd(year);
          if (res.msg == MESSAGE.SUCCESS) {
            let dataQd = res.data;
            if (dataQd) {
              this.dataQdTCDTGiaoCuc = {};
              this.formData.patchValue({
                loaiCanCu: 'QD-TCDT',
                soQdTtcpBtc: dataQd.soQuyetDinh,
              });
              // Lấy kế hoạch tổng cục giao cho cục đang login
              let dataLuongThuc = dataQd.khLuongThuc.find(item => item.maDonVi == chiTieuKhNam.maDvi);
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
            this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR);
          }
        } else {
          this.dataQdTtcpOrBtc = {};
          //Lấy ra số qd căn giao qd của BTC hoặc TTCP
          if (chiTieuKhNam && chiTieuKhNam.loaiCanCu && chiTieuKhNam.loaiCanCu == 'TTCP') {
            let res = await this.quyetDinhTtcpService.getDetail(chiTieuKhNam.idCanCu);
            if (res.msg == MESSAGE.SUCCESS) {
              this.formData.patchValue({
                soQdTtcpBtc: res.data.soQd,
                idCanCu: chiTieuKhNam.idCanCu,
              });
              let data = res.data;
              let dataTTCP = data.listBoNganh ? res.data.listBoNganh.find(item => item.maBoNganh == '01') : null;
              //Lấy data của TTCP giao cho BTC (TCDT)
              if (dataTTCP) {
                this.dataQdTtcpOrBtc = {
                  'data': 'TTCP',
                  'ltThocMua': dataTTCP.ltThocMua,
                  'ltGaoMua': dataTTCP.ltGaoMua,
                  'ltThocXuat': dataTTCP.ltThocXuat,
                  'ltGaoXuat': dataTTCP.ltGaoXuat,
                };
              }
            }
          }
          if (chiTieuKhNam && chiTieuKhNam.loaiCanCu && chiTieuKhNam.loaiCanCu == 'BTC') {
            let res = await this.quyetDinhBtcTcdtService.getDetail(chiTieuKhNam.idCanCu);
            if (res.msg == MESSAGE.SUCCESS) {
              let data = res.data;
              this.formData.patchValue({
                soQdTtcpBtc: res.data.soQd,
                idCanCu: chiTieuKhNam.idCanCu,
              });
              this.dataQdTtcpOrBtc = {
                'data': 'BTC',
                'ltThocMua': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongMuaThoc) ? data.keHoachNhapXuat.soLuongMuaThoc : 0,
                'ltGaoMua': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongMuaGao) ? data.keHoachNhapXuat.soLuongMuaGao : 0,
                'ltThocXuat': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongBanThoc) ? data.keHoachNhapXuat.soLuongBanThoc : 0,
                'ltGaoXuat': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongBanGao) ? data.keHoachNhapXuat.soLuongBanGao : 0,
              };
            }
          }
        }
      } else {
        this.formData.patchValue({
          canCu: null,
          chiTieuId: null,
          soQdTtcpBtc: null,
        });
        if (this.userService.isCuc()) {
          let res = await this.chiTieuKeHoachNamService.canCuCucPa(year);
          if (res.msg == MESSAGE.SUCCESS) {
            let data = res.data;
            if (data) {
              this.dataQdTCDTGiaoCuc = {};
              this.formData.patchValue({
                canCu: data.soQuyetDinh,
                chiTieuId: data.id,
              });
              //load thông tin của phương án cục duyệt
              this.loadDataPhuongAn(data);
              //load căn cứ qd tổng cục giao cho cục để validate
              let res1 = await this.chiTieuKeHoachNamService.canCuCucQd(year);
              if (res1.msg == MESSAGE.SUCCESS) {
                let dataQd = res1.data;
                // Lấy kế hoạch tổng cục giao cho cục đang login
                let dataLuongThuc = dataQd.khLuongThuc.find(item => item.maDonVi == this.userInfo.MA_DVI);
                if (dataLuongThuc) {
                  this.dataQdTCDTGiaoCuc = {
                    'ltThocMua': dataLuongThuc.ntnThoc,
                    'ltGaoMua': dataLuongThuc.ntnGao,
                    'ltThocXuat': dataLuongThuc.xtnTongThoc,
                    'ltGaoXuat': dataLuongThuc.xtnTongGao,
                  };
                }
                this.formData.patchValue({
                  loaiCanCu: 'QD-TCDT',
                  soQdTtcpBtc: dataQd.soQuyetDinh,
                });
              } else {
                this.notification.warning(MESSAGE.WARNING, 'Quyết định giao chỉ tiêu của tổng cục năm ' + year + ' chưa được tạo hoặc chưa được duyệt,vui lòng kiểm tra lại.');
              }
            } else {
              this.notification.warning(MESSAGE.WARNING, 'Phương án giao chỉ tiêu kế hoạch năm ' + year + ' chưa được tạo hoặc chưa được duyệt,vui lòng kiểm tra lại.');
            }
          } else {
            this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR);
          }
        }
        if (this.userService.isTongCuc()) {
          this.dataQdTtcpOrBtc = {};
          let res = await this.chiTieuKeHoachNamService.canCuCucPa(year);
          if (res.msg == MESSAGE.SUCCESS) {
            let data = res.data;
            if (data) {
              // console.log(data.khVatTuNhap.filter(item =>item.maDvi =='010115'),'datadatadata');
              //Load data của phương án giao chỉ tiêu cho QĐ giao chỉ tiêu
              this.loadDataPhuongAn(data);
              //Gán số công văn bản ghi phương án vào căn cứ, chiTieuId là id của bản ghi phương án.
              this.formData.patchValue({
                canCu: data.soQuyetDinh,
                chiTieuId: data.id,
                loaiCanCu: data.loaiCanCu,
                soQdTtcpBtc: (data.loaiCanCu && data.loaiCanCu != 'OTHER') ? data.canCu : '',
              });
              if (data.loaiCanCu && data.loaiCanCu == 'TTCP' && data.idCanCu && data.canCu) {
                let res = await this.quyetDinhTtcpService.getDetail(data.idCanCu);
                if (res.msg == MESSAGE.SUCCESS) {
                  let data = res.data;
                  if (data) {
                    this.formData.patchValue({
                      idCanCu: data.id,
                    });
                    let dataTTCP = data.listBoNganh ? res.data.listBoNganh.find(item => item.maBoNganh == '01') : null;
                    //Lấy data của TTCP giao cho BTC (TCDT)
                    if (dataTTCP) {
                      this.dataQdTtcpOrBtc = {
                        'data': 'TTCP',
                        'ltThocMua': dataTTCP.ltThocMua,
                        'ltGaoMua': dataTTCP.ltGaoMua,
                        'ltThocXuat': dataTTCP.ltThocXuat,
                        'ltGaoXuat': dataTTCP.ltGaoXuat,
                      };
                    }
                  }
                }
              } else if (data.loaiCanCu && data.loaiCanCu == 'BTC' && data.idCanCu && data.canCu) {
                let res = await this.quyetDinhBtcTcdtService.getDetail(data.idCanCu);
                if (res.msg == MESSAGE.SUCCESS) {
                  let data = res.data;
                  if (data) {
                    this.formData.patchValue({
                      idCanCu: data.id,
                    });
                    this.dataQdTtcpOrBtc = {
                      'data': 'BTC',
                      'ltThocMua': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongMuaThoc) ? data.keHoachNhapXuat.soLuongMuaThoc : 0,
                      'ltGaoMua': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongMuaGao) ? data.keHoachNhapXuat.soLuongMuaGao : 0,
                      'ltThocXuat': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongBanThoc) ? data.keHoachNhapXuat.soLuongBanThoc : 0,
                      'ltGaoXuat': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongBanGao) ? data.keHoachNhapXuat.soLuongBanGao : 0,
                    };
                  }
                }
              } else {
                //Nếu Phương án được tạo khi chưa quyết định của TTCP hoặc BTC ban hành thì khi tạo QD giao chỉ tiêu, phải lấy lại 1 trong 2 số mà được TTCP giao hoặc BTC giao ( Ưu tiên QD BTC)
                let res = await this.chiTieuKeHoachNamService.canCuBTCGiaoTCDT(year);
                if (res.msg == MESSAGE.SUCCESS) {
                  let data = res.data;
                  if (data) {
                    this.formData.patchValue({
                      soQdTtcpBtc: data.soQd,
                      idCanCu: data.id,
                      loaiCanCu: 'BTC',
                    });
                    //Lấy data của BTC giao cho TCDT
                    this.dataQdTtcpOrBtc = {
                      'data': 'BTC',
                      'ltThocMua': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongMuaThoc) ? data.keHoachNhapXuat.soLuongMuaThoc : 0,
                      'ltGaoMua': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongMuaGao) ? data.keHoachNhapXuat.soLuongMuaGao : 0,
                      'ltThocXuat': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongBanThoc) ? data.keHoachNhapXuat.soLuongBanThoc : 0,
                      'ltGaoXuat': (data.keHoachNhapXuat && data.keHoachNhapXuat.soLuongBanGao) ? data.keHoachNhapXuat.soLuongBanGao : 0,
                    };
                  } else {
                    let res = await this.quyetDinhTtcpService.chiTietTheoNam(year);
                    if (res.msg == MESSAGE.SUCCESS) {
                      let data = res.data;
                      if (data) {
                        //Lấy data của TTCP giao cho BTC (TCDT)
                        let dataTTCP = data.listBoNganh ? res.data.listBoNganh.find(item => item.maBoNganh == '01') : null;
                        if (dataTTCP) {
                          this.dataQdTtcpOrBtc = {
                            'data': 'TTCP',
                            'ltThocMua': dataTTCP.ltThocMua,
                            'ltGaoMua': dataTTCP.ltGaoMua,
                            'ltThocXuat': dataTTCP.ltThocXuat,
                            'ltGaoXuat': dataTTCP.ltGaoXuat,
                          };
                        }
                        this.formData.patchValue({
                          soQdTtcpBtc: data.soQd,
                          idCanCu: data.id,
                          loaiCanCu: 'TTCP',
                        });
                      }
                    }
                  }
                }
              }
            } else {
              this.notification.warning(MESSAGE.WARNING, 'Phương án giao chỉ tiêu kế hoạch năm ' + year + ' chưa có hoặc chưa được duyệt,vui lòng kiểm tra lại.');
            }
          } else {
            this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR);
          }
        }
      }
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

  calculateAndConvertDataKHLT() {
    if (this.dsKeHoachLuongThucClone && this.dsKeHoachLuongThucClone.length > 0) {
      this.dsKeHoachLuongThucClone.forEach(function(item) {
        if (item.tkdnThoc && item.tkdnThoc.length > 0) {
          item.tkdnThoc.forEach(tkdnThoc => {
            tkdnThoc.soLuong = tkdnThoc.soLuong ? (tkdnThoc.soLuong / 1000) : 0;
          });
          item.tkdnGao.forEach(tkdnGao => {
            tkdnGao.soLuong = tkdnGao.soLuong ? (tkdnGao.soLuong / 1000) : 0;
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
          new ItemDetail(0),
          new ItemDetail(0),
          new ItemDetail(0),
        ];
        this.keHoachLuongThucCreate.tkdnThoc = [
          new ItemDetail(0),
          new ItemDetail(0),
          new ItemDetail(0),
        ];
        this.keHoachLuongThucCreate.xtnGao = [new ItemDetail(0), new ItemDetail(0), new ItemDetail(0)];
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
      await this.quanLyHangTrongKhoService.getTrangThaiHt({
        listMaDvi: this.arrayDonVi,
        listLoaiVthh: ['0101', '0102'],
      }).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            this.dsKeHoachLuongThucClone.forEach((item) => {
              let dataTonKho = res.data.filter(dt => dt.nam && Number(dt.nam) < this.yearNow && Number(dt.nam) >= this.yearNow - 3 && item.maDonVi == dt.maDonVi);
              if (dataTonKho && dataTonKho.length > 0) {
                dataTonKho.forEach((tonKho) => {
                  if (tonKho.loaiVthh == '0101') {
                    switch (tonKho.nam) {
                      case (this.yearNow - 1).toString():
                        item.tkdnThoc[2].soLuong +=
                          tonKho.duDau;
                        break;
                      case (this.yearNow - 2).toString():
                        item.tkdnThoc[1].soLuong +=
                          tonKho.duDau;
                        break;
                      case (this.yearNow - 3).toString():
                        item.tkdnThoc[0].soLuong +=
                          tonKho.duDau;
                        break;
                      default:
                        break;
                    }
                  } else if (tonKho.loaiVthh == '0102') {
                    switch (tonKho.nam) {
                      case (this.yearNow - 1).toString():
                        item.tkdnGao[2].soLuong +=
                          tonKho.duDau;
                        break;
                      case (this.yearNow - 2).toString():
                        item.tkdnGao[1].soLuong +=
                          tonKho.duDau;
                        break;
                      case (this.yearNow - 3).toString():
                        item.tkdnGao[0].soLuong +=
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
      await this.quanLyHangTrongKhoService.getTrangThaiHt({
        listMaDvi: this.arrayDonVi,
        listLoaiVthh: ['04'],
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
      soQd: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.soQuyetDinh
          : null,
        [],
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
      canCu: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.canCu
          : null,
        [Validators.required],
      ],
      loaiCanCu: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.loaiCanCu
          : null,
        [],
      ],
      idCanCu: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.idCanCu
          : null,
        [],
      ],
      soQdTtcpBtc: [],
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
  isTongCuc() {
    return this.userService.isTongCuc()
  }

  isCuc() {
    return this.userService.isCuc()
  }

  getListVatTuThietBi(dataCon: any, dataReturn: any) {
    if (!dataReturn) {
      dataReturn = [];
    }
    if (dataCon) {
      let item = {
        maVatTu: dataCon.ma,
        maVatTuCha: null,
        vatTuId: dataCon.id,
        vatTuChaId: null,
        tenVatTu: dataCon.ten,
        tenVatTuCha: null,
      };
      if (dataCon.parent) {
        item.maVatTuCha = dataCon.parent.ma;
        item.vatTuChaId = dataCon.parent.id;
        item.tenVatTuCha = dataCon.parent.ten;
        dataReturn.push(item);
        this.getListVatTuThietBi(dataCon.parent, dataReturn);
      } else {
        dataReturn.push(item);
      }
    }
    return dataReturn;
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

          const maDV = this.userInfo.MA_DVI;
          let dsKHLT = [];
            if (this.userService.isTongCuc())
              dsKHLT = this.thongTinChiTieuKeHoachNam.khLuongThuc;
            else {
              if (this.thongTinChiTieuKeHoachNam.capDvi == '1') {
                dsKHLT = this.thongTinChiTieuKeHoachNam.khLuongThuc.filter((item) => item.maDonVi == maDV);
              } else {
                dsKHLT = this.thongTinChiTieuKeHoachNam.khLuongThuc;
              }
            }
          this.dsKeHoachLuongThucClone = cloneDeep(dsKHLT);
          let keHoachMuoi = () => {
            if (this.isTongCuc())
              return this.thongTinChiTieuKeHoachNam.khMuoiDuTru
            else {
              if (this.thongTinChiTieuKeHoachNam.capDvi == '1') {
                return this.thongTinChiTieuKeHoachNam.khMuoiDuTru.filter((item) => item.maDonVi == maDV)
              } else {
                return this.thongTinChiTieuKeHoachNam.khMuoiDuTru
              }
            }
          }
          this.dsMuoiClone = cloneDeep(
            keHoachMuoi()
          );
          // this.dsMuoiClone = cloneDeep(
          //   this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
          // );
          if (this.thongTinChiTieuKeHoachNam.soQuyetDinh && this.thongTinChiTieuKeHoachNam.soQuyetDinh.split('/').length > 1) {
            this.qdTCDT = this.thongTinChiTieuKeHoachNam.soQuyetDinh.split('/')[1];
          }
          // Xử lý vật tư to tree
          this.dataVatTuNhap = cloneDeep(this.thongTinChiTieuKeHoachNam.khVatTuNhap);
          this.dataVatTuXuat = cloneDeep(this.thongTinChiTieuKeHoachNam.khVatTuXuat);
          if (this.userService.isCuc()) {
            if (this.thongTinChiTieuKeHoachNam.capDvi == '1') {
              this.dataVatTuNhap = this.dataVatTuNhap.filter((item) => item.maDonVi == maDV)
              this.dataVatTuXuat = this.dataVatTuXuat.filter((item) => item.maDonVi == maDV)
            }
          }
          this.convertListDataVatTuNhap(this.dataVatTuNhap);
          this.convertListDataVatTuXuat(this.dataVatTuXuat);
          this.expandAll(this.dataVatTuNhapTree);
          this.expandAllVatTuXuat(this.dataVatTuXuatTree);
          if (this.thongTinChiTieuKeHoachNam.trangThai == STATUS.DA_DUYET_LDC || this.thongTinChiTieuKeHoachNam.trangThai == STATUS.DA_DUYET_LDV) {
            this.formData.controls['ngayKy'].setValidators([Validators.required]);
            this.formData.controls['ngayHieuLuc'].setValidators([Validators.required]);
            this.formData.controls['soQd'].setValidators([Validators.required]);
          } else {
            this.formData.controls['ngayKy'].setValidators([]);
            this.formData.controls['ngayHieuLuc'].setValidators([]);
            this.formData.controls['soQd'].setValidators([]);
          }
          this.formData.patchValue({
            namKeHoach: this.thongTinChiTieuKeHoachNam.namKeHoach,
            canCu: this.thongTinChiTieuKeHoachNam.canCu,
            trichYeu: this.thongTinChiTieuKeHoachNam.trichYeu,
            soQd: this.thongTinChiTieuKeHoachNam.soQuyetDinh ? this.thongTinChiTieuKeHoachNam.soQuyetDinh.split('/')[0] : null,
            ngayKy: this.thongTinChiTieuKeHoachNam.ngayKy,
            ngayHieuLuc: this.thongTinChiTieuKeHoachNam.ngayHieuLuc,
            chiTieuId: this.thongTinChiTieuKeHoachNam.qdGocId,
          });
          this.findCanCuByYear(this.thongTinChiTieuKeHoachNam.namKeHoach, this.thongTinChiTieuKeHoachNam);
          // this.loadData();
          this.formData.patchValue({
            soQD: this.formData.get('soQd').value?.split('/')[0],
          });
          this.sumRowDetailMuoi();
          this.sumRowDetailLuongThuc();
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }

  loadDataPhuongAn(data) {
    this.thongTinChiTieuKeHoachNam.khLuongThuc = [];
    this.thongTinChiTieuKeHoachNam.khMuoiDuTru = [];
    this.thongTinChiTieuKeHoachNam.khVatTuNhap = [];
    this.thongTinChiTieuKeHoachNam.khVatTuXuat = [];
    if (data) {
      this.thongTinChiTieuKeHoachNam.khLuongThuc = data.khLuongThuc;
      this.thongTinChiTieuKeHoachNam.khMuoiDuTru = data.khMuoiDuTru;
      this.thongTinChiTieuKeHoachNam.khVatTuNhap = data.khVatTuNhap;
      this.thongTinChiTieuKeHoachNam.khVatTuXuat = data.khVatTuXuat;
      //remove id của các bản ghi kế hoạch chi tiết
      this.thongTinChiTieuKeHoachNam.khLuongThuc.forEach(item => {
        delete item.id;
        if (item.xtnThoc && item.xtnThoc.length > 0) {
          item.xtnThoc.forEach(it => {
            delete it.id;
          });
        }
        if (item.xtnGao && item.xtnGao.length > 0) {
          item.xtnGao.forEach(it => {
            delete it.id;
          });
        }
      });
      this.thongTinChiTieuKeHoachNam.khMuoiDuTru.forEach(item => {
        delete item.id;
      });
      this.thongTinChiTieuKeHoachNam.khVatTuNhap.forEach(item => {
        delete item.id;
      });
      this.thongTinChiTieuKeHoachNam.khVatTuXuat.forEach(item => {
        delete item.id;
      });
      this.thongTinChiTieuKeHoachNam.fileDinhKemReqs =
        data.fileDinhKems;
      this.thongTinChiTieuKeHoachNam.fileDinhKemReqs.forEach(item => {
        if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
          this.listCcPhapLy.push(item);
        }
      });
      this.dsKeHoachLuongThucClone = cloneDeep(
        this.thongTinChiTieuKeHoachNam.khLuongThuc,
      );
      this.dsMuoiClone = cloneDeep(
        this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
      );
      // Xử lý vật tư to tree
      this.dataVatTuNhap = cloneDeep(this.thongTinChiTieuKeHoachNam.khVatTuNhap);
      this.dataVatTuXuat = cloneDeep(this.thongTinChiTieuKeHoachNam.khVatTuXuat);
      this.convertListDataVatTuNhap(this.dataVatTuNhap);
      this.convertListDataVatTuXuat(this.dataVatTuXuat);
      this.expandAll(this.dataVatTuNhapTree);
      this.expandAllVatTuXuat(this.dataVatTuXuatTree);
      this.sumRowDetailMuoi();
      this.sumRowDetailLuongThuc();
    }
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

  deleteKeHoachVatTu(stt: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.thongTinChiTieuKeHoachNam.khVatTu =
          this.thongTinChiTieuKeHoachNam.khVatTu.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.thongTinChiTieuKeHoachNam?.khVatTu.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        this.dsVatTuClone = cloneDeep(this.thongTinChiTieuKeHoachNam.khVatTu);
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

  async importFileData(event: any) {
    this.spinner.show();
    try {
      const element = event.currentTarget as HTMLInputElement;
      let fileList: FileList | null = element.files;
      if (fileList) {
        let res = await this.chiTieuKeHoachNamService.importFile(fileList[0]);
        if (res.msg == MESSAGE.SUCCESS) {
          let temptData = res.data;
          if (temptData) {
            if (temptData.khluongthuc && temptData.khluongthuc.length > 0) {
              for (let i = 0; i < temptData.khluongthuc.length; i++) {
                this.checkDataExistLuongThuc(temptData.khluongthuc[i]);
              }
              this.dsKeHoachLuongThucClone = cloneDeep(
                this.thongTinChiTieuKeHoachNam.khLuongThuc,
              );
            }
            if (temptData.khMuoi && temptData.khMuoi.length > 0) {
              for (let i = 0; i < temptData.khMuoi.length; i++) {
                this.checkDataExistMuoi(temptData.khMuoi[i]);
              }
              this.dsMuoiClone = cloneDeep(
                this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
              );
            }
            if (temptData.khVatTu && temptData.khVatTu.length > 0) {
              for (let i = 0; i < temptData.khVatTu.length; i++) {
                this.checkDataExistVatTu(temptData.khVatTu[i]);
              }
              this.convertKhVatTuList(temptData.khVatTu);
              this.dsVatTuClone = cloneDeep(
                this.thongTinChiTieuKeHoachNam.khVatTu,
              );
            }
            this.loadData();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
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

  banHanh() {
    this.spinner.show();
    this.formData.controls['soQd'].setValidators([Validators.required]);
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
          await this.save(true);
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
    if (this.thongTinChiTieuKeHoachNam.capDvi == '1') {
      this.formData.controls['soQdTtcpBtc'].setValidators([Validators.required]);
      this.formData.controls['idCanCu'].setValidators([Validators.required]);
    }
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
    this.thongTinChiTieuKeHoachNam.soQuyetDinh = this.formData.get('soQd').value ? `${this.formData.get('soQd').value
    }/${this.qdTCDT}` : null;
    this.thongTinChiTieuKeHoachNam.ngayKy = this.formData.get('ngayKy').value ?? null;
    this.thongTinChiTieuKeHoachNam.ngayHieuLuc =
      this.formData.get('ngayHieuLuc').value ?? null;
    this.thongTinChiTieuKeHoachNam.namKeHoach =
      this.formData.get('namKeHoach').value;
    this.thongTinChiTieuKeHoachNam.trichYeu =
      this.formData.get('trichYeu').value;
    this.thongTinChiTieuKeHoachNam.loai = this.LOAI_QD.QD;
    this.thongTinChiTieuKeHoachNam.chiTieuId = this.formData.get('chiTieuId').value;
    this.thongTinChiTieuKeHoachNam.canCu = this.formData.get('canCu').value;
    this.thongTinChiTieuKeHoachNam.idCanCu = this.formData.get('idCanCu').value;
    this.thongTinChiTieuKeHoachNam.loaiCanCu = this.formData.get('loaiCanCu').value;
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
    if (this.thongTinChiTieuKeHoachNam.id > 0) {
      this.chiTieuKeHoachNamService
        .chinhSuaChiTieuKeHoach(this.thongTinChiTieuKeHoachNamInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let body = {
                id: res.data.id,
                trangThai: STATUS.BAN_HANH,
              };
              this.chiTieuKeHoachNamService.updateStatus(body)
                .then((resp) => {
                  if (resp.msg == MESSAGE.SUCCESS) {
                    if (res.msg == MESSAGE.SUCCESS) {
                      this.notification.success(
                        MESSAGE.SUCCESS,
                        MESSAGE.BAN_HANH_SUCCESS,
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
              let body = {
                id: res.data.id,
                trangThai: STATUS.BAN_HANH,
              };
              this.chiTieuKeHoachNamService.updateStatus(body)
                .then((resp) => {
                  if (resp.msg == MESSAGE.SUCCESS) {
                    if (res.msg == MESSAGE.SUCCESS) {
                      this.notification.success(
                        MESSAGE.SUCCESS,
                        MESSAGE.BAN_HANH_SUCCESS,
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
              this.id = res.data.id;
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

  downloadTemplate() {
    this.chiTieuKeHoachNamService.downloadFile().subscribe((blob) => {
      saveAs(blob, 'biểu mẫu nhập dữ liệu Lương thực.xlsx');
    });
  }

  selectNam() {
    this.yearNow = this.formData.get('namKeHoach').value;
    if (!this.id) {
      this.findCanCuByYear(this.yearNow);
      // this.initDataThemMoi();
    }
    this.loadQdTtcpGiaoBoNganh(this.yearNow);
  }

  convertTrangThai(status: string) {
    if (status == STATUS.DANG_NHAP_DU_LIEU) {
      return 'Đang nhập dữ liệu';
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

  onInputTenHang(e: Event): void {
    this.isAddVatTu = false;
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.keHoachVatTuCreate.vatTuThietBi[0].tenVatTuCha = '';
      this.keHoachVatTuCreate.vatTuThietBi[0].maVatTuCha = '';
      this.keHoachVatTuCreate.vatTuThietBi[0].kyHieu = '';
      this.keHoachVatTuCreate.vatTuThietBi[0].tenVatTu = '';
      this.keHoachVatTuCreate.vatTuThietBi[0].donViTinh = '';
      this.dataVatTuConShow = this.dataVatTuCon;
      this.dataVatTuChaShow = this.dataVatTuCha;
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
      this.keHoachVatTuCreate.donViTinh = '';
    } else {
      if (this.keHoachVatTuNhapCreate.dsVatTu[0].tenVatTu) {
        this.dataVatTuConShow = this.dataVatTuConClone.filter(
          (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
        );
      }
    }
  }

  selectDonvi(donVi) {
    // this.newObjectLuongThuc();
    this.isAddLuongThuc = true;
    this.keHoachLuongThucCreate.maDonVi = donVi.maDvi;
    this.keHoachLuongThucCreate.tenDonvi = donVi.tenDvi;
    this.keHoachLuongThucCreate.donViId = donVi.id;
    this.quanLyHangTrongKhoService.getTrangThaiHt({
      maDvi: donVi.maDvi,
      listLoaiVthh: ['0101', '0102'],
    }).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          res.data.forEach((tonKho) => {
            if (tonKho.loaiVthh == '0101') {
              switch (tonKho.nam) {
                case (this.yearNow - 1).toString():
                  this.keHoachLuongThucCreate.tkdnThoc[2].soLuong +=
                    tonKho.duDau;
                  break;
                case (this.yearNow - 2).toString():
                  this.keHoachLuongThucCreate.tkdnThoc[1].soLuong +=
                    tonKho.duDau;
                  break;
                case (this.yearNow - 3).toString():
                  this.keHoachLuongThucCreate.tkdnThoc[0].soLuong +=
                    tonKho.duDau;
                  break;
                default:
                  break;
              }
            } else if (tonKho.loaiVthh == '0102') {
              switch (tonKho.nam) {
                case (this.yearNow - 1).toString():
                  this.keHoachLuongThucCreate.tkdnGao[2].soLuong +=
                    tonKho.duDau;
                  break;
                case (this.yearNow - 2).toString():
                  this.keHoachLuongThucCreate.tkdnGao[1].soLuong +=
                    tonKho.duDau;
                  break;
                case (this.yearNow - 3).toString():
                  this.keHoachLuongThucCreate.tkdnGao[0].soLuong +=
                    tonKho.duDau;
                  break;
                default:
                  break;
              }
            }
          });
        } else {
          this.keHoachLuongThucCreate.tkdnThoc.forEach((thoc) => {
            thoc.soLuong = 0;
          });
          this.keHoachLuongThucCreate.tkdnGao.forEach((gao) => {
            gao.soLuong = 0;
          });
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    });
  }

  selectDonViKHLT(donVi) {
    this.isAddLuongThuc = true;
    this.keHoachLuongThucCreate.maDonVi = donVi.maDvi;
    this.keHoachLuongThucCreate.tenDonvi = donVi.tenDvi;
    this.keHoachLuongThucCreate.donViId = donVi.id;
    this.chiTieuKeHoachNamService
      .tonKhoDauNam({ maDvi: donVi.maDvi, maVthhList: ['010103', '010101'] })
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            res.data.forEach((tonKho) => {
              if (tonKho.maVthh == '010101') {
                switch (tonKho.nam) {
                  case (this.yearNow - 1).toString():
                    this.keHoachLuongThucCreate.tkdnThoc[0].soLuong =
                      tonKho.slHienThoi;
                    break;
                  case (this.yearNow - 2).toString():
                    this.keHoachLuongThucCreate.tkdnThoc[1].soLuong =
                      tonKho.slHienThoi;
                    break;
                  case (this.yearNow - 3).toString():
                    this.keHoachLuongThucCreate.tkdnThoc[2].soLuong =
                      tonKho.slHienThoi;
                    break;
                  default:
                    break;
                }
              } else if (tonKho.maVthh == '010103') {
                switch (tonKho.nam) {
                  case (this.yearNow - 1).toString():
                    this.keHoachLuongThucCreate.tkdnGao[0].soLuong =
                      tonKho.slHienThoi;
                    break;
                  case (this.yearNow - 2).toString():
                    this.keHoachLuongThucCreate.tkdnGao[1].soLuong =
                      tonKho.slHienThoi;
                    break;
                  default:
                    break;
                }
              }
            });
          } else {
            this.keHoachLuongThucCreate.tkdnThoc.forEach((thoc) => {
              thoc.soLuong = 0;
            });
            this.keHoachLuongThucCreate.tkdnGao.forEach((gao) => {
              gao.soLuong = 0;
            });
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
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
      this.dataQdTtcpOrBtc = res.data.listBoNganh ? res.data.listBoNganh.find(item => item.maBoNganh == '01') : null;
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
          if (totalNtnThoc > (this.dataQdTtcpOrBtc?.ltThocMua ? this.dataQdTtcpOrBtc.ltThocMua : 0)) {
            this.notification.error(MESSAGE.ERROR, 'Nhập quá số lượng mua thóc BTC giao');
            return false;
          }
          if (totalNtnGao > (this.dataQdTtcpOrBtc?.ltGaoMua ? this.dataQdTtcpOrBtc.ltGaoMua : 0)) {
            this.notification.error(MESSAGE.ERROR, 'Nhập quá số lượng mua gạo BTC giao');
            return false;
          }
        }
      } else {
        totalNtnThoc = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnThoc, 0);
        totalNtnGao = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.ntnGao, 0);
        if (totalNtnThoc || totalNtnGao) {
          if (totalNtnThoc < (this.dataQdTtcpOrBtc?.ltThocMua ? this.dataQdTtcpOrBtc.ltThocMua : 0) && isGuiDuyet) {
            this.notification.error(MESSAGE.ERROR, 'Nhập chưa bằng số chỉ tiêu mua thóc BTC giao');
            return false;
          }
          if (totalNtnGao < (this.dataQdTtcpOrBtc?.ltGaoMua ? this.dataQdTtcpOrBtc.ltGaoMua : 0) && isGuiDuyet) {
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

  themMoiKHLT() {
    if (!this.isAddLuongThuc) {
      return;
    }
    //Kiểm tra số nhập trong năm thóc , gạo có bằng chỉ tiêu BTC giao TCDT hoặc TCDT giao Cục hay ko ?
    let checkFlag = this.soSanhCtCapTrenGiao('add');
    if (!checkFlag) {
      return;
    }
    this.keHoachLuongThucDialog = new KeHoachLuongThuc();
    this.keHoachLuongThucDialog.tenDonvi = this.keHoachLuongThucCreate.tenDonvi;
    this.keHoachLuongThucDialog.maDonVi = this.keHoachLuongThucCreate.maDonVi;
    this.keHoachLuongThucDialog.tkdnTongSoQuyThoc =
      +this.keHoachLuongThucCreate.tkdnTongSoQuyThoc;
    this.keHoachLuongThucDialog.tkdnTongThoc =
      +this.keHoachLuongThucCreate.tkdnThoc[0].soLuong +
      +this.keHoachLuongThucCreate.tkdnThoc[1].soLuong +
      +this.keHoachLuongThucCreate.tkdnThoc[2].soLuong;
    const tkdnThoc1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: +this.keHoachLuongThucCreate.tkdnThoc[0].soLuong,
      vatTuId: null,
    };
    const tkdnThoc2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: +this.keHoachLuongThucCreate.tkdnThoc[1].soLuong,
      vatTuId: null,
    };
    const tkdnThoc3 = {
      id: null,
      nam: this.yearNow - 3,
      soLuong: +this.keHoachLuongThucCreate.tkdnThoc[2].soLuong,
      vatTuId: null,
    };
    this.keHoachLuongThucDialog.tkdnThoc = [tkdnThoc1, tkdnThoc2, tkdnThoc3];
    this.keHoachLuongThucDialog.tkdnTongGao =
      +this.keHoachLuongThucCreate.tkdnGao[0].soLuong +
      +this.keHoachLuongThucCreate.tkdnGao[1].soLuong +
      +this.keHoachLuongThucCreate.tkdnGao[2].soLuong;
    const tkdnGao1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: +this.keHoachLuongThucCreate.tkdnGao[0].soLuong,
      vatTuId: null,
    };
    const tkdnGao2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: +this.keHoachLuongThucCreate.tkdnGao[1].soLuong,
      vatTuId: null,
    };
    const tkdnGao3 = {
      id: null,
      nam: this.yearNow - 3,
      soLuong: +this.keHoachLuongThucCreate.tkdnGao[2].soLuong,
      vatTuId: null,
    };
    this.keHoachLuongThucDialog.tkdnGao = [tkdnGao1, tkdnGao2, tkdnGao3];
    this.keHoachLuongThucDialog.ntnTongSoQuyThoc =
      +this.keHoachLuongThucCreate.ntnTongSoQuyThoc;
    this.keHoachLuongThucDialog.ntnThoc = +this.keHoachLuongThucCreate.ntnThoc;
    this.keHoachLuongThucDialog.ntnGao = +this.keHoachLuongThucCreate.ntnGao;
    this.keHoachLuongThucDialog.xtnTongSoQuyThoc =
      +this.keHoachLuongThucCreate.xtnTongSoQuyThoc;
    this.keHoachLuongThucDialog.xtnTongThoc =
      +this.keHoachLuongThucCreate.xtnThoc[0].soLuong +
      +this.keHoachLuongThucCreate.xtnThoc[1].soLuong +
      +this.keHoachLuongThucCreate.xtnThoc[2].soLuong;
    const xtnThoc1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: +this.keHoachLuongThucCreate.xtnThoc[0].soLuong,
      vatTuId: null,
    };
    const xtnThoc2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: +this.keHoachLuongThucCreate.xtnThoc[1].soLuong,
      vatTuId: null,
    };
    const xtnThoc3 = {
      id: null,
      nam: this.yearNow - 3,
      soLuong: +this.keHoachLuongThucCreate.xtnThoc[2].soLuong,
      vatTuId: null,
    };
    this.keHoachLuongThucDialog.xtnThoc = [xtnThoc1, xtnThoc2, xtnThoc3];
    this.keHoachLuongThucDialog.xtnTongGao =
      +this.keHoachLuongThucCreate.xtnGao[0].soLuong +
      +this.keHoachLuongThucCreate.xtnGao[1].soLuong + this.keHoachLuongThucCreate.xtnGao[2].soLuong;
    const xtnGao1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: +this.keHoachLuongThucCreate.xtnGao[0].soLuong,
      vatTuId: null,
    };
    const xtnGao2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: +this.keHoachLuongThucCreate.xtnGao[1].soLuong,
      vatTuId: null,
    };
    const xtnGao3 = {
      id: null,
      nam: this.yearNow - 3,
      soLuong: +this.keHoachLuongThucCreate.xtnGao[2].soLuong,
      vatTuId: null,
    };
    this.keHoachLuongThucDialog.xtnGao = [xtnGao1, xtnGao2, xtnGao3];
    this.keHoachLuongThucDialog.tkcnTongSoQuyThoc =
      +this.keHoachLuongThucCreate.tkcnTongSoQuyThoc;
    this.keHoachLuongThucDialog.tkcnTongThoc =
      +this.keHoachLuongThucCreate.tkcnTongThoc;
    this.keHoachLuongThucDialog.tkcnTongGao =
      +this.keHoachLuongThucCreate.tkcnTongGao;
    this.keHoachLuongThucDialog.stt =
      this.thongTinChiTieuKeHoachNam.khLuongThuc?.length + 1;
    this.keHoachLuongThucDialog.donViId = this.keHoachLuongThucCreate.donViId;
    this.keHoachLuongThucDialog.khGaoId = this.keHoachLuongThucCreate.khGaoId;
    this.keHoachLuongThucDialog.khThocId = this.keHoachLuongThucCreate.khThocId;
    this.keHoachLuongThucDialog.donViTinh = MESSAGE.DON_VI_TINH_LUONG_THUC;
    this.checkDataExistLuongThuc(this.keHoachLuongThucDialog);
    this.isAddLuongThuc = false;
    this.newObjectLuongThuc();
    if (this.userInfo.CAP_DVI === LEVEL_USER.CUC) {
      this.keHoachLuongThucCreate.tenDonvi = this.tenDonViCuc;
      // this.isAddLuongThuc = true;
    }
    this.keHoachLuongThucCreate;
    this.dsKeHoachLuongThucClone = cloneDeep(
      this.thongTinChiTieuKeHoachNam.khLuongThuc,
    );
    this.loadData();
    this.sumRowDetailLuongThuc();
  }

  changeDonViMuoi() {
    this.isAddMuoi = false;
  }

  clearKHLT() {
    this.isAddLuongThuc = false;
    this.newObjectLuongThuc();
  }

  themMoiMuoiDuTru() {
    if (!this.isAddMuoi) {
      return;
    }
    if (!this.keHoachMuoiCreate.nhapTrongNam && !this.keHoachMuoiCreate.xuatTrongNamMuoi) {
      this.notification.error(MESSAGE.ERROR, 'Bạn phải nhập đủ dữ liệu.');
      return;
    }
    this.keHoachMuoiDialog = new KeHoachMuoi();
    this.keHoachMuoiDialog.maDonVi = this.keHoachMuoiCreate.maDonVi;
    this.keHoachMuoiDialog.ntnTongSoMuoi = this.keHoachMuoiCreate.ntnTongSoMuoi;
    this.keHoachMuoiDialog.tenDonVi = this.keHoachMuoiCreate.tenDonVi;
    this.keHoachMuoiDialog.tonKhoDauNam = this.keHoachMuoiCreate.tonKhoDauNam;
    this.keHoachMuoiDialog.nhapTrongNam = this.keHoachMuoiCreate.nhapTrongNam;
    this.keHoachMuoiDialog.xuatTrongNamMuoi = this.keHoachMuoiCreate.xuatTrongNamMuoi;
    this.keHoachMuoiDialog.tonKhoCuoiNam = this.keHoachMuoiCreate.tonKhoCuoiNam;
    // const tkdnMuoi1 = {
    //   id: null,
    //   nam: this.yearNow - 1,
    //   soLuong: this.keHoachMuoiCreate.tkdnMuoi[0].soLuong,
    //   vatTuId: null,
    // };
    // const tkdnMuoi2 = {
    //   id: null,
    //   nam: this.yearNow - 2,
    //   soLuong: this.keHoachMuoiCreate.tkdnMuoi[1].soLuong,
    //   vatTuId: null,
    // };
    // const tkdnMuoi3 = {
    //   id: null,
    //   nam: this.yearNow - 3,
    //   soLuong: this.keHoachMuoiCreate.tkdnMuoi[2].soLuong,
    //   vatTuId: null,
    // };
    // this.keHoachMuoiDialog.tkdnMuoi = [tkdnMuoi1, tkdnMuoi2, tkdnMuoi3];
    // this.keHoachMuoiDialog.tkdnTongSoMuoi =
    //   this.keHoachMuoiCreate.tkdnTongSoMuoi;
    // const xtnMuoi1 = {
    //   id: null,
    //   nam: this.yearNow - 1,
    //   soLuong: this.keHoachMuoiCreate.xtnMuoi[0].soLuong,
    //   vatTuId: null,
    // };
    // const xtnMuoi2 = {
    //   id: null,
    //   nam: this.yearNow - 2,
    //   soLuong: this.keHoachMuoiCreate.xtnMuoi[1].soLuong,
    //   vatTuId: null,
    // };
    // const xtnMuoi3 = {
    //   id: null,
    //   nam: this.yearNow - 3,
    //   soLuong: this.keHoachMuoiCreate.xtnMuoi[2].soLuong,
    //   vatTuId: null,
    // };
    // this.keHoachMuoiDialog.xtnMuoi = [xtnMuoi1, xtnMuoi2, xtnMuoi3];
    this.keHoachMuoiDialog.xtnTongSoMuoi = this.keHoachMuoiCreate.xtnTongSoMuoi;
    this.keHoachMuoiDialog.stt =
      this.thongTinChiTieuKeHoachNam.khMuoiDuTru?.length + 1;
    this.keHoachMuoiDialog.donViId = this.keHoachMuoiCreate.donViId;
    this.keHoachMuoiDialog.id = this.keHoachMuoiCreate.id;
    this.checkDataExistMuoi(this.keHoachMuoiDialog);
    this.isAddMuoi = false;
    this.newObjectMuoi();
    if (this.userInfo.CAP_DVI === LEVEL_USER.CUC) {
      this.keHoachMuoiCreate.tenDonVi = this.tenDonViCuc;
    }
    this.dsMuoiClone = cloneDeep(this.thongTinChiTieuKeHoachNam.khMuoiDuTru);
    this.sumRowDetailMuoi();
    this.loadData();
  }

  clearMuoiDuTru() {
    this.isAddMuoi = false;
    this.newObjectMuoi();
  }

  selectDonViMuoi(muoi) {
    this.isAddMuoi = true;
    this.keHoachMuoiCreate.maDonVi = muoi.maDvi;
    this.keHoachMuoiCreate.tenDonVi = muoi.tenDvi;
    this.keHoachMuoiCreate.donViId = muoi.id;
    let body = {
      'maDvi': muoi.maDvi,
      'listLoaiVthh': ['04'],
    };
    this.chiTieuKeHoachNamService.trangThaiHienThoi(body).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          let tkdn = 0;
          let tkcn = 0;
          res.data.forEach((item) => {
            tkdn = tkdn + item.duDau;
            tkcn = tkcn + (item.duDau + item.tongNhap - item.tongXuat);
          });
          this.keHoachMuoiCreate.tonKhoDauNam = tkdn;
          this.keHoachMuoiCreate.tonKhoCuoiNam = tkcn;
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        this.keHoachMuoiCreate.tonKhoDauNam = 0;
        this.keHoachMuoiCreate.tonKhoCuoiNam = 0;
      }
    });
  }

  selectDonViVatTu(vatTu) {
    this.isAddVatTu = true;
    this.keHoachVatTuCreate.maDvi = vatTu.maDvi;
    this.keHoachVatTuCreate.tenDonVi = vatTu.tenDvi;
    this.keHoachVatTuCreate.donViId = vatTu.id;
    if (this.keHoachVatTuCreate.maHang) {
      this.getTonKhoDauNam();
    }
  }

  selectTenHang(vatTu) {
    if (this.keHoachVatTuCreate.maDvi) {
      this.isAddVatTu = true;
      this.getTonKhoDauNam();
    }
    this.dataVatTuConClone = vatTu.child;
    this.dataVatTuConShow = this.dataVatTuConClone;
    this.keHoachVatTuCreate.vatTuThietBi[0].tenVatTu = '';
    this.keHoachVatTuCreate.vatTuThietBi[0].kyHieu = vatTu.kyHieu;
    this.keHoachVatTuCreate.donViTinh = vatTu.donViTinh;
    this.keHoachVatTuCreate.vatTuThietBi[0].donViTinh = vatTu.donViTinh;
    this.keHoachVatTuCreate.vatTuThietBi[0].maVatTuCha = vatTu.maHang;
    this.keHoachVatTuCreate.vatTuThietBi[0].vatTuChaId = vatTu.id;
  }

  selectChungLoaiHang(chungLoaiHang) {
    if (this.keHoachVatTuCreate.maDvi) {
      this.isAddVatTu = true;
    }
    this.keHoachVatTuCreate.vatTuThietBi[0].donViTinh = chungLoaiHang.donViTinh;
    this.keHoachVatTuCreate.vatTuThietBi[0].maVatTu = chungLoaiHang.maHang;
    this.keHoachVatTuCreate.vatTuThietBi[0].vatTuId = chungLoaiHang.id;
    const vatTuChaFilter = this.dataVatTuCha.find(
      (vaTuCha) => vaTuCha.id === chungLoaiHang.idParent,
    );
    if (vatTuChaFilter) {
      this.keHoachVatTuCreate.vatTuThietBi[0].kyHieu = vatTuChaFilter.kyHieu;
      this.keHoachVatTuCreate.donViTinh = vatTuChaFilter.donViTinh;
      this.keHoachVatTuCreate.vatTuThietBi[0].donViTinh =
        vatTuChaFilter.donViTinh;
      this.keHoachVatTuCreate.vatTuThietBi[0].maVatTuCha =
        vatTuChaFilter.maHang;
      this.keHoachVatTuCreate.vatTuThietBi[0].tenVatTuCha = vatTuChaFilter.ten;
    } else {
      this.keHoachVatTuCreate.vatTuThietBi[0].kyHieu = chungLoaiHang.kyHieu;
      this.keHoachVatTuCreate.donViTinh = chungLoaiHang.donViTinh;
      this.keHoachVatTuCreate.vatTuThietBi[0].donViTinh =
        chungLoaiHang.donViTinh;
      this.keHoachVatTuCreate.vatTuThietBi[0].maVatTuCha = chungLoaiHang.maHang;
      this.keHoachVatTuCreate.vatTuThietBi[0].tenVatTuCha = '';
    }
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
    this.sumTotalKhDuTruLuongThuc.xtnGao_nam3 = this.dsKeHoachLuongThucClone?.reduce((a, b) => a + +b.xtnGao[2]?.soLuong ? b.xtnGao[2].soLuong : 0, 0);
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

  themMoiVatTu() {
    if (!this.isAddVatTu) {
      return;
    }
    this.keHoachVatTuDialog = new KeHoachVatTu();
    this.keHoachVatTuDialog.tenDonVi = this.keHoachVatTuCreate.tenDonVi;
    this.keHoachVatTuDialog.maDvi = this.keHoachVatTuCreate.maDvi;
    this.keHoachVatTuDialog.donViId = this.keHoachVatTuCreate.donViId;
    this.keHoachVatTuDialog.donViTinh = this.keHoachVatTuCreate.donViTinh;
    this.keHoachVatTuDialog.stt =
      this.thongTinChiTieuKeHoachNam.khVatTu?.length + 1;
    this.keHoachVatTuDialog.vatTuThietBi = [];
    const vatTuTemp = new VatTuThietBi();
    vatTuTemp.kyHieu = this.keHoachVatTuCreate.vatTuThietBi[0].kyHieu;
    vatTuTemp.tenVatTuCha = this.keHoachVatTuCreate.vatTuThietBi[0].tenVatTuCha;
    vatTuTemp.tenVatTu = this.keHoachVatTuCreate.vatTuThietBi[0].tenVatTu;
    vatTuTemp.donViTinh = this.keHoachVatTuCreate.vatTuThietBi[0].donViTinh;
    vatTuTemp.maVatTu = this.keHoachVatTuCreate.vatTuThietBi[0].maVatTu;
    vatTuTemp.maVatTuCha = this.keHoachVatTuCreate.vatTuThietBi[0].maVatTuCha;
    vatTuTemp.vatTuId = this.keHoachVatTuCreate.vatTuThietBi[0].vatTuId;
    vatTuTemp.vatTuChaId = this.keHoachVatTuCreate.vatTuThietBi[0].vatTuChaId;
    vatTuTemp.nhapTrongNam = this.keHoachVatTuCreate.vatTuThietBi[0]
      .nhapTrongNam
      ? this.keHoachVatTuCreate.vatTuThietBi[0].nhapTrongNam
      : 0;
    vatTuTemp.cacNamTruoc = this.keHoachVatTuCreate.vatTuThietBi[0].cacNamTruoc;
    vatTuTemp.tongCacNamTruoc =
      this.keHoachVatTuCreate.vatTuThietBi[0].cacNamTruoc[0].soLuong +
      this.keHoachVatTuCreate.vatTuThietBi[0].cacNamTruoc[1].soLuong +
      this.keHoachVatTuCreate.vatTuThietBi[0].cacNamTruoc[2].soLuong;
    vatTuTemp.tongNhap = this.keHoachVatTuCreate.vatTuThietBi[0].nhapTrongNam
      ? this.keHoachVatTuCreate.vatTuThietBi[0].nhapTrongNam +
      this.keHoachVatTuCreate.vatTuThietBi[0].tongCacNamTruoc
      : 0;
    this.keHoachVatTuDialog.vatTuThietBi.push(vatTuTemp);
    this.isAddVatTu = false;
    // this.newObjectVatTu();
    if (this.userInfo.CAP_DVI === LEVEL_USER.CUC) {
      this.keHoachVatTuCreate.tenDonVi = this.tenDonViCuc;
      // this.isAddLuongThuc = true;
    }
    this.checkDataExistVatTu(this.keHoachVatTuDialog);
    this.dsVatTuClone = cloneDeep(this.thongTinChiTieuKeHoachNam.khVatTu);
    this.loadData();
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

  getTonKhoDauNam() {
    this.chiTieuKeHoachNamService
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

  deleteTaiLieuDinhKemTag(data: any) {
    this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
      (x) => x.id !== data.id,
    );
    this.thongTinChiTieuKeHoachNam.fileDinhKemReqs = this.thongTinChiTieuKeHoachNam.fileDinhKemReqs.filter(
      (x) => x.id !== data.id,
    );

  }

  openFile(event) {
    let item = {
      id: new Date().getTime(),
      text: event.name,
    };
    if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
      this.uploadFileService
        .uploadFile(event.file, event.name)
        .then((resUpload) => {
          const fileDinhKem = new FileDinhKem();
          fileDinhKem.fileName = resUpload.filename;
          fileDinhKem.fileSize = resUpload.size;
          fileDinhKem.fileUrl = resUpload.url;
          this.thongTinChiTieuKeHoachNam.fileDinhKemReqs.push(fileDinhKem);
          this.taiLieuDinhKemList.push(item);
        });
    }
  }

  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === STATUS.DANG_NHAP_DU_LIEU
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

  selectTabData(tabName: string) {
    this.tabSelected = tabName;
    this.loadData();
  }

  checkTrangThaiRecord(): boolean {
    return (
      this.thongTinChiTieuKeHoachNam.trangThai == STATUS.CHO_DUYET_LDV || this.thongTinChiTieuKeHoachNam.trangThai == STATUS.CHO_DUYET_LDC || this.thongTinChiTieuKeHoachNam.trangThai == STATUS.BAN_HANH
    );
  }

  openDialogGiaoChiTieu(role) {
    const modalQD = this.modal.create({
      nzTitle: role == 'cuc' ? 'Thông tin QĐ giao chỉ tiêu kế hoạch' : 'Danh sách QĐ phân bổ vốn và giao dự toán của BTC cho TCDTNN',
      nzContent: DialogQuyetDinhGiaoChiTieuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        isDexuat: true,
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        let item = {
          id: data.id,
          text: data.soQuyetDinh,
        };
        this.formData.patchValue({
          canCu: data.soQuyetDinh,
        });
        if (!this.canCuList.find((x) => x.text === item.text)) {
          this.canCuList = [];
          this.canCuList.push(item);
        }
      }
    });
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

  private async loadDsCanCu() {
    let body = {
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
      trangThai: STATUS.BAN_HANH,
      namKeHoach: this.formData.value.nam,
    };
    let res = await this.quyetDinhBtcTcdtService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsCanCu = res.data.content;
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
            this.notification.error(MESSAGE.ALERT, 'Loại và chủng loại hàng hóa đã tồn tại.');
          } else {
            this.keHoachVatTuNhapCreate.dsVatTu[0].donViId = this.keHoachVatTuNhapCreate.donViId;
            this.keHoachVatTuNhapCreate.dsVatTu[0].sttDonVi = indexExists + 1;
            dataExists.dsVatTu.push(this.keHoachVatTuNhapCreate.dsVatTu[0]);
            this.dataVatTuNhap.splice(indexExists, 1, dataExists);
            this.dataVatTuNhapEdit = this.dataVatTuNhap;
            this.keHoachVatTuNhapCreate = new KeHoachVatTuCustom();
          }
        } else {
          this.keHoachVatTuNhapCreate.sttDonVi = this.dataVatTuNhap.length + 1;
          this.dataVatTuNhap = [...this.dataVatTuNhap, this.keHoachVatTuNhapCreate];
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
            this.notification.error(MESSAGE.ALERT, 'Loại và chủng loại hàng hóa đã tồn tại.');
          } else {
            dataExists.dsVatTu.push(this.keHoachVatTuXuatCreate.dsVatTu[0]);
            this.dataVatTuXuat.splice(indexExists, 1, dataExists);
            this.dataVatTuXuatEdit = this.dataVatTuXuat;
            this.keHoachVatTuXuatCreate = new KeHoachVatTuCustom();
          }
        } else {
          this.keHoachVatTuXuatCreate.sttDonVi = this.dataVatTuXuat.length + 1;
          this.dataVatTuXuat = [...this.dataVatTuXuat, this.keHoachVatTuXuatCreate];
          this.dataVatTuXuatEdit = this.dataVatTuXuat;
          this.expandSetVatTuXuat.add(this.keHoachVatTuXuatCreate.maDvi);
          this.keHoachVatTuXuatCreate = new KeHoachVatTuCustom();
        }
      }
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
            // this.dataVatTuXuat.push(item);
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

  async preViewTheoCuc() {
    this.spinner.show();
    //Convert data to list object cuc
    this.chiTieuKeHoachNamService.xemTruocCtKhNamTheoCuc({
      id: this.thongTinChiTieuKeHoachNam.id,
      tenBaoCao: 'chi_tieu_ke_hoach_nam_theo_tung_cuc.docx',
      dataVatTunhap: this.getDataPreviewTheoCuc(this.thongTinChiTieuKeHoachNam),
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

  getDataPreviewTheoCuc(dataChiTieuKhNam) {
    let arrayData = [];
    if (dataChiTieuKhNam && dataChiTieuKhNam.khLuongThuc && dataChiTieuKhNam.khLuongThuc.length > 0) {
      for (let item of dataChiTieuKhNam.khLuongThuc) {
        let data = {
          tenDvi: item.tenDonvi,
          maDvi: item.maDonVi,
          // khLuongThuc: item,
          khVatTuNhap: (this.dataVatTuNhapTree && this.dataVatTuNhapTree.length > 0) ? this.dataVatTuNhapTree.find(it => it.maDvi == item.maDonVi) : [],
        };
        arrayData = [...arrayData, data];
      }
    }
    return arrayData;
  }

  async preView(type?) {
    try {
      this.spinner.show();
      if (type === 'MUOI') {
        this.subTab = 'MUOI';
        let body = {
          soQd: this.thongTinChiTieuKeHoachNam.soQuyetDinh,
          ngayQd: dayjs(this.thongTinChiTieuKeHoachNam.ngayKy, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          tenDvi: this.thongTinChiTieuKeHoachNam.tenDvi,
          typeFile: 'pdf',
          nam: this.thongTinChiTieuKeHoachNam.namKeHoach,
          idHdr: this.thongTinChiTieuKeHoachNam.id,
          fileName: 'xemtruoc_chi_tieu_kh_muoi.jrxml',
        };
        await this.chiTieuKeHoachNamService.xemTruocCtKhNamMuoi(body).then(async s => {
          this.pdfBlob = s;
          this.pdfSrc = await new Response(s).arrayBuffer();
        });
        // this.showDlgPreview = true;
      } else if (type === 'LT') {
        this.subTab = 'LT';
        let body = {
          id: this.thongTinChiTieuKeHoachNam.id,
          typeFile: 'pdf',
          fileName: 'ke-hoach-luong-thuc-du-tru-nha-nuoc.jrxml',
          tenBaoCao: 'Kế hoạch lương thực dự trữ nhà nước',
        };
        await this.chiTieuKeHoachNamService.xemTruocCtKhNamLuongThuc(body).then(async s => {
          this.pdfBlob = s;
          this.pdfSrc = await new Response(s).arrayBuffer();
        });
      } else if (type === 'VT') {
        this.subTab = 'VT-' + (this.subTabVatTu == 0 ? 'NHAP' : 'XUAT');
        await this.chiTieuKeHoachNamService.xemTruocCtKhNamVatTu({
          soQd: this.thongTinChiTieuKeHoachNam.soQuyetDinh,
          ngayQd: dayjs(this.thongTinChiTieuKeHoachNam.ngayKy, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          tenDvi: this.thongTinChiTieuKeHoachNam.tenDvi,
          typeFile: 'pdf',
          nam: this.thongTinChiTieuKeHoachNam.namKeHoach,
          idHdr: this.thongTinChiTieuKeHoachNam.id,
          fileName: 'chi-tieu-vat-tu-thiet-bi.jrxml',
          loaiNhapXuat: this.subTabVatTu == 0 ? 'NHAP' : 'XUAT',
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

  //
  // downloadPdf() {
  //   saveAs(this.pdfBlob, 'baocao.pdf');
  // }

  async downloadExcel() {
    try {
      this.spinner.show();
      if (this.subTab === 'LT') {
        await this.chiTieuKeHoachNamService.xemTruocCtKhNamLuongThuc({
          id: this.thongTinChiTieuKeHoachNam.id,
          typeFile: 'xlsx',
          fileName: 'ke-hoach-luong-thuc-du-tru-nha-nuoc.jrxml',
          tenBaoCao: 'Kế hoạch lương thực dự trữ nhà nước',
        }).then(async s => {
          this.excelBlob = s;
          saveAs(this.excelBlob, 'Kế hoạch lương thực dự trữ nhà nước.xlsx');
        });
      } else if (this.subTab === 'MUOI') {
        await this.chiTieuKeHoachNamService.xemTruocCtKhNamMuoi({
          typeFile: 'xlsx',
          nam: this.thongTinChiTieuKeHoachNam.namKeHoach,
          idHdr: this.thongTinChiTieuKeHoachNam.id,
          fileName: 'chi-tieu-vat-tu-thiet-bi.jrxml',
        }).then(async s => {
          this.excelBlob = s;
          saveAs(this.excelBlob, 'chi-tieu-nhap-vat-tu-thiet-bi.xlsx');
        });
      } else if (this.subTab === 'VT-NHAP') {
        await this.chiTieuKeHoachNamService.xemTruocCtKhNamVatTu({
          typeFile: 'xlsx',
          nam: this.thongTinChiTieuKeHoachNam.namKeHoach,
          idHdr: this.thongTinChiTieuKeHoachNam.id,
          maBieuSo: this.thongTinChiTieuKeHoachNam.soQuyetDinh,
          ngayBatDauQuy: moment(this.thongTinChiTieuKeHoachNam.ngayKy, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          fileName: 'chi-tieu-vat-tu-thiet-bi.jrxml',
          loaiNhapXuat: 'NHAP',
        }).then(async s => {
          this.excelBlob = s;
          saveAs(this.excelBlob, 'chi-tieu-nhap-vat-tu-thiet-bi.xlsx');
        });
      } else if (this.subTab === 'VT-XUAT') {
        await this.chiTieuKeHoachNamService.xemTruocCtKhNamVatTu({
          typeFile: 'xlsx',
          nam: this.thongTinChiTieuKeHoachNam.namKeHoach,
          idHdr: this.thongTinChiTieuKeHoachNam.id,
          maBieuSo: this.thongTinChiTieuKeHoachNam.soQuyetDinh,
          ngayBatDauQuy: this.thongTinChiTieuKeHoachNam.ngayKy,
          fileName: 'chi-tieu-vat-tu-thiet-bi.jrxml',
          loaiNhapXuat: 'XUAT',
        }).then(async s => {
          this.excelBlob = s;
          saveAs(this.excelBlob, 'chi-tieu-xuat-vat-tu-thiet-bi.xlsx');
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

  closeDlgTheoCuc() {
    this.showDlgPreviewTheoCuc = false;
  }

  downloadPdf() {
    saveAs(this.pdfSrc, 'chi_tieu_ke_hoach_nam_theo_tung_cuc.pdf');
  }

  downloadWord() {
    saveAs(this.wordSrc, 'chi_tieu_ke_hoach_nam_theo_tung_cuc.docx');
  }

  printPreview() {
    printJS({ printable: this.printSrc, type: 'pdf', base64: true });
  }

  async baoCaoNhapVt() {
    try {
      await this.spinner.show();
      await this.chiTieuKeHoachNamService.xuatBaoCaoNhapVt({
        id: this.id,
        namKeHoach: this.formData.value.namKeHoach,
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
