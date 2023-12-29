import { saveAs } from 'file-saver';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { TongHopDieuChuyenCapTongCuc } from './../tong-hop-dieu-chuyen-cap-tong-cuc.component';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from "@angular/forms";
import { UserLogin } from "../../../../../models/userlogin";
import { DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan } from "../../../../../models/KeHoachBanDauGia";
import { DatePipe } from "@angular/common";
import { DiaDiemNhapKho } from "../../../../../models/CuuTro";
import {
  ModalInput
} from "../../../../xuat/xuat-cuu-tro-vien-tro/xuat-cuu-tro/xay-dung-phuong-an/thong-tin-xay-dung-phuong-an/thong-tin-xay-dung-phuong-an.component";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "../../../../../services/danhmuc.service";
import { DeXuatKeHoachBanDauGiaService } from "../../../../../services/deXuatKeHoachBanDauGia.service";
import { DonviService } from "../../../../../services/donvi.service";
import { TinhTrangKhoHienThoiService } from "../../../../../services/tinhTrangKhoHienThoi.service";
import { DanhMucTieuChuanService } from "../../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {
  DeXuatPhuongAnCuuTroService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import { QuanLyHangTrongKhoService } from "../../../../../services/quanLyHangTrongKho.service";
import * as dayjs from "dayjs";
import { FileDinhKem } from "../../../../../models/DeXuatKeHoachuaChonNhaThau";
import { MESSAGE } from "../../../../../constants/message";
import { STATUS } from "src/app/constants/status";
import { chain, cloneDeep, includes, groupBy } from 'lodash';
import * as uuid from "uuid";
import { Utils } from 'src/app/Utility/utils';
import { TongHopDieuChuyenCapTongCucService } from '../../tong-hop-dieu-chuyen-tai-tong-cuc.service';
import { KeHoachDieuChuyenService } from '../../../ke-hoach-dieu-chuyen/ke-hoach-dieu-chuyen.service';
import { TongHopDieuChuyenService } from '../../../tong-hop-dieu-chuyen-tai-cuc/tong-hop-dieu-chuyen-tai-cuc.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chi-tiet-tong-hop-dieu-chuyen-cap-tong-cuc',
  templateUrl: './chi-tiet-tong-hop-dieu-chuyen-cap-tong-cuc.component.html',
  styleUrls: ['./chi-tiet-tong-hop-dieu-chuyen-cap-tong-cuc.component.scss']
})
export class ChiTietTongHopDieuChuyenCapTongCuc extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() isViewDetail: boolean;
  @Input() isEdit: boolean;
  @Input() isAddNew: boolean;
  @Input() qdDcId: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  formData: FormGroup;
  cacheData: any[] = [];
  canCu: any[] = [];
  userLogin: UserLogin;
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  // listHangHoaAll: any[] = [];
  // listLoaiHangHoa: any[] = [];
  // listChungLoaiHangHoa: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  userInfo: UserLogin;
  expandSet = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  STATUS = STATUS;
  datePipe = new DatePipe('en-US');
  expandSetString = new Set<string>();
  tableView = [];
  tableRow: any = {};
  isVisible = false;
  isVisibleSuaNoiDung = false;
  isViewTHKeHoachDCCUC: boolean = false;
  idTHKeHoachDCCUC: any = null;
  isViewKeHoachDC: boolean = false;
  idKeHoachDC: any = null;
  listNoiDung = [];
  errorInputComponent: any[] = [];
  disableInputComponent: ModalInput = new ModalInput();
  Utils = Utils;
  FORMAT_DATE_TIME_STR = Utils.FORMAT_DATE_TIME_STR;

  maHauTo: string;
  isTongHop: boolean = false;
  yeuCauSuccess: boolean = false;
  tongHopData: any[] = [];
  data: any[] = [];

  dataTable2ChiCuc: any[];
  dataTable2Cuc: any[];
  dataCuc: any[];
  groupData2Cuc: any[];
  groupData2ChiCuc: any[];
  daXdinhDiemNhap: boolean = false;
  tongDuToanChiPhi: number;

  listTrangThai: any[] = [
    { ma: STATUS.CHUA_TAO_QD, giaTri: 'Chưa tạo QĐ' },
    { ma: STATUS.DA_DU_THAO_QD, giaTri: 'Đã dự thảo QĐ' },
    { ma: STATUS.DA_BAN_HANH_QD, giaTri: 'Đã ban hành QĐ' },
    { ma: STATUS.TU_CHOI_BAN_HANH_QD, giaTri: 'Từ chối ban hành QĐ' }
  ];
  LIST_TRANG_THAI: { [key: string]: string } = {
    '26': 'Chưa tạo QĐ',
    '27': 'Đã dự thảo QĐ',
    '28': 'Đã ban hành QĐ',
    '78': 'Từ chối ban hành QĐ'
  }
  LOAI_HINH_NHAP_XUAT_CHI_CUC: { [key: string]: string } = {
    loaiHinhNhapXuat: '90', tenLoaiHinhNhapXuat: "Xuất Điều chuyển nội bộ Chi cục", kieuNhapXuat: '04', tenKieuNhapXuat: "Xuất không thu tiền"
  };
  LOAI_HINH_NHAP_XUAT_CUC: { [key: string]: string } = {
    loaiHinhNhapXuat: '94', tenLoaiHinhNhapXuat: "Xuất điều chuyển nội bộ Cục", kieuNhapXuat: '04', tenKieuNhapXuat: "Xuất không thu tiền"
  }
  TEN_KIEU_NHAP_XUAT: { [key: number]: any } = {
    1: "Nhập mua",
    2: "Nhập không chi tiền",
    3: "Xuất bán",
    4: "Xuất không thu tiền",
    5: "Khác"
  };
  dataPreView: { id: number, nam: number, listDtl: any[], type: string, fileType: string };
  previewName: string = "";
  excelBlob: any;
  excelSrc: any
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private router: Router,
    private keHoachDieuChuyenService: KeHoachDieuChuyenService,
    private tongHopDieuChuyenService: TongHopDieuChuyenService,
    private tongHopDieuChuyenCapTongCucService: TongHopDieuChuyenCapTongCucService,
    private danhMucService: DanhMucService,
    private danhMucDungChungService: DanhMucDungChungService,
    private cdr: ChangeDetectorRef,) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDieuChuyenCapTongCucService);
    this.formData = this.fb.group(
      {
        id: [''],
        trangThai: [''],

        lyDoDc: [''],
        namKeHoach: [dayjs().get('year'), Validators.required],
        loaiDieuChuyen: ['CHI_CUC', Validators.required],
        thoiGianTongHop: [''],

        maTongHop: [''],
        ngayTongHop: [dayjs().format('YYYY-MM-DD')],
        trichYeu: [''],
        loaiHinhNhapXuat: [''],
        tenLoaiHinhNhapXuat: [''],
        kieuNhapXuat: [''],
        tenKieuNhapXuat: [''],
        // ngayTrinhTc: ['']
      }
    );
    this.userInfo = this.userService.getUserLogin();
    this.maHauTo = '/' + this.userInfo.MA_TCKT;
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      // this.loadDsVthh()
      if (this.idInput) {
        const data = await this.detail(this.idInput);
        this.formData.patchValue({ maTongHop: data.id ? Number(data.id) : '' });
        this.canCu = data.canCu;
        // if (this.formData.value.loaiDieuChuyen === "CHI_CUC") {
        //   this.formData.patchValue(this.LOAI_HINH_NHAP_XUAT_CHI_CUC)
        // } else if (this.formData.value.loaiDieuChuyen === "CUC") {
        //   this.formData.patchValue(this.LOAI_HINH_NHAP_XUAT_CUC)
        // }
        this.convertTongHop(data, this.isAddNew)
      } else {
        this.initData()

      }
    } catch (e) {
      console.log("e", e)
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      if (this.isEdit || this.isViewDetail) {
        this.isTongHop = true
      };
      this.spinner.hide();
    }
  }
  async initData() {
    // this.formData.controls["id"].setValue(this.idInput)
    if (this.formData.value.loaiDieuChuyen === "CHI_CUC") {
      this.getLoaiHinhNhapXuat({ loai: 'LOAI_HINH_NHAP_XUAT', ma: '94' });
    } else if (this.formData.value.loaiDieuChuyen === "CUC") {
      this.getLoaiHinhNhapXuat({ loai: 'LOAI_HINH_NHAP_XUAT', ma: '144' });
    }
  };
  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }
  mapExpanData = (list: any[] = [], key: string = "children") => {
    let result = list.map(f => {
      if (Array.isArray(f[key]) && f[key].length > 0) {
        return { ...f, expand: true, [key]: this.mapExpanData(f[key], key) }
      }
      return { ...f }
    });
    return result;
  }
  // async loadDsVthh() {
  //     let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
  //     if (res.msg == MESSAGE.SUCCESS) {
  //         this.listHangHoaAll = res.data;
  //         this.listLoaiHangHoa = res.data?.filter((x) => (x.ma.length == 2 && !x.ma.match("^01.*")) || (x.ma.length == 4 && x.ma.match("^01.*")));
  //     }
  // }
  handleChangeLoaiDC = (value) => {
    this.isTongHop = false;
    this.formData.patchValue({ thoiGianTongHop: '' });
    if (this.isViewDetail) return;
    if (this.formData.value.loaiDieuChuyen === "CHI_CUC") {
      this.getLoaiHinhNhapXuat({ loai: 'LOAI_HINH_NHAP_XUAT', ma: '94' });
    } else if (this.formData.value.loaiDieuChuyen === "CUC") {
      this.getLoaiHinhNhapXuat({ loai: 'LOAI_HINH_NHAP_XUAT', ma: '144' });
    }
  }
  async getLoaiHinhNhapXuat(params) {
    try {
      const res = await this.danhMucDungChungService.search(params);
      if (res.msg === MESSAGE.SUCCESS) {
        const loaiHinhNhapXuat = res.data.content[0] ? { ...res.data.content[0] } : {};
        this.formData.patchValue({ loaiHinhNhapXuat: loaiHinhNhapXuat.ma, tenLoaiHinhNhapXuat: loaiHinhNhapXuat.giaTri, kieuNhapXuat: loaiHinhNhapXuat.ghiChu, tenKieuNhapXuat: this.TEN_KIEU_NHAP_XUAT[Number(loaiHinhNhapXuat.ghiChu)] })
      } else {
        this.notification.error(MESSAGE.ERROR, "Có lỗi xảy ra.")
      }

    } catch (error) {
      console.log("e", error);
      this.notification.error(MESSAGE.ERROR, "Có lỗi xảy ra.")
    }
  }
  // changeHangHoa = async (event) => {
  //     if (event) {
  //         this.formData.patchValue({ chungLoaiHangHoa: "" });
  //         this.listChungLoaiHangHoa = []

  //         let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
  //         if (res.msg == MESSAGE.SUCCESS) {
  //             if (res.data) {
  //                 this.listChungLoaiHangHoa = res.data;
  //             }
  //         } else {
  //             this.notification.error(MESSAGE.ERROR, res.msg);
  //         }
  //     }
  // }
  yeuCauChiCucNhan = () => {
    //call api yêu cầu chi cục xác định điểm nhập
    this.yeuCauSuccess = true;
  }
  quayLai() {
    this.showListEvent.emit();
  }
  async taoQuyetDinh(stt: number) {
    //save record-->redirect page tao quyet dinh
    try {
      // this.setValidator(true)
      this.formData.controls['trichYeu'].setValidators([Validators.required])
      this.helperService.markFormGroupTouched(this.formData);
      if (!this.formData.valid) return;
      if (stt == 1) {
        const res = await this.save();
        if (res.msg == MESSAGE.SUCCESS) {
          this.router.navigate(['dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen', { id: this.formData.value.id }]);
        }
      } else if (stt == 2 || stt == 3) {
        this.router.navigate(['dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen', { qdDcId: this.qdDcId }]);
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  async luu() {
    try {
      this.formData.controls['trichYeu'].setValidators([Validators.required])
      this.helperService.markFormGroupTouched(this.formData);
      if (!this.formData.valid) return;
      await this.save()
    } catch (error) {
      console.log("error", error)
    }
  }
  async save() {
    try {
      // this.setValidator(false)
      await this.spinner.show();
      let body = { ...this.formData.value, ngayTongHop: dayjs(this.formData.value.ngayTongHop, 'DD/MM/YYYY').format("YYYY-MM-DD") };
      body.canCu = this.canCu;
      let data;
      if (body.id) {
        data = await this.tongHopDieuChuyenCapTongCucService.capNhatTHTongCuc(body);
        if (data.msg == MESSAGE.SUCCESS) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.error(MESSAGE.ERROR, data.msg);
        }
      }
      else {
        data = await this.tongHopDieuChuyenCapTongCucService.themTHTongCuc(body);
        if (data.msg == MESSAGE.SUCCESS) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        } else {
          this.notification.error(MESSAGE.ERROR, data.msg);
        }
        if (data.data.id) {
          this.idInput = Number(data.data.id);
          this.formData.controls['id'].setValue(Number(data.data.id));
          this.formData.controls['maTongHop'].setValue(Number(data.data.id));
          this.formData.controls['trangThai'].setValue(data.data.trangThai);
          this.isAddNew = false;
          this.isViewDetail = false;
          this.isDetail = true;
          this.isEdit = true;
        };
      }
      this.isTongHop = true;
      return data;
    } catch (error) {
      console.log("e", error)
    } finally {
      await this.spinner.hide();

    }
  }
  async tongHop() {
    this.groupData2Cuc = [];
    this.dataTable2Cuc = [];
    this.dataTable2ChiCuc = [];
    this.formData.value.ngayTongHop = dayjs().format("YYYY-MM-DD")
    // this.setValidator(false);
    this.helperService.markFormGroupTouched(this.formData);
    try {
      if (this.formData.valid) {
        this.isTongHop = true;
        const thoiGianTongHop = dayjs().format("YYYY-MM-DDTHH:mm:ss");
        this.formData.patchValue({ thoiGianTongHop: thoiGianTongHop });
        // if (this.formData.value.loaiDieuChuyen === "CHI_CUC") {
        //   this.formData.patchValue(this.LOAI_HINH_NHAP_XUAT_CHI_CUC)
        // } else if (this.formData.value.loaiDieuChuyen === "CUC") {
        //   this.formData.patchValue(this.LOAI_HINH_NHAP_XUAT_CUC)
        // }
        // call api tổng hợp dữ liệu;
        const body = {
          namKeHoach: this.formData.value.namKeHoach,
          loaiDieuChuyen: this.formData.value.loaiDieuChuyen,
          thoiGianTongHop: this.formData.value.thoiGianTongHop

        }
        this.spinner.show();
        const data = await this.tongHopDieuChuyenCapTongCucService.lapKeHoach(body);
        if (data.msg == MESSAGE.SUCCESS) {
          // this.notification.success(MESSAGE.SUCCESS);
          this.tongHopData = cloneDeep(data.data);
          this.convertTongHop(this.tongHopData, this.isAddNew)
        } else {
          this.notification.error(MESSAGE.ERROR, data.msg);
        }

      }
    } catch (error) {
      console.log("error", error)
    }
    finally {
      this.spinner.hide()
    }

  }
  async selectRow(item: any, isAddNew) {
    if (isAddNew) {
      if (this.formData.value.loaiDieuChuyen == "CUC" && this.groupData2Cuc?.length > 0) {
        this.groupData2Cuc = this.groupData2Cuc.map(i => {
          i.selected = false;
          if (i.thKhDcDtlId == item.thKhDcDtlId) {
            i.selected = true
          }
          return { ...i }
        });

        if (item.thKhDcHdrId) {
          const detailCuc = item.thKeHoachDieuChuyenCucKhacCucDtls;
          if (!detailCuc) return;
          let flatArray = [];
          Array.isArray(item.thKeHoachDieuChuyenCucKhacCucDtls) && item.thKeHoachDieuChuyenCucKhacCucDtls.forEach(element => {
            Array.isArray(element?.dcnbKeHoachDcHdr) && element.dcnbKeHoachDcHdr.forEach(elmHdr => {
              Array.isArray(elmHdr?.danhSachHangHoa) && elmHdr.danhSachHangHoa.forEach(elmDs => {
                flatArray.push({ ...element, dcnbKeHoachDcHdr: null, ...elmHdr, danhSachHangHoa: null, ...elmDs })
              })
            });
          });
          this.dataTable2Cuc = chain(flatArray).groupBy('soDxuat').map((item, i) => {
            const soDxuat = item.find(f => f.soDxuat == i);
            const duToanKphi = item.reduce((sum, cur) => sum += cur.duToanKphi, 0)
            return {
              ...soDxuat,
              children: item,
              duToanKphi,
              expand: true
            }
          }).value();
        }
      }
    } else {
      if (this.formData.value.loaiDieuChuyen == "CUC" && this.groupData2Cuc?.length > 0) {
        this.groupData2Cuc = this.groupData2Cuc.map(i => {
          i.selected = false;
          if (i.thKhDcDtlId == item.thKhDcDtlId) {
            i.selected = true
          }
          return { ...i }
        });

        if (item.thKhDcHdrId) {
          let flatArray = [];
          Array.isArray(item?.thKeHoachDieuChuyenCucKhacCucDtl?.dcnbKeHoachDcHdr) && item?.thKeHoachDieuChuyenCucKhacCucDtl.dcnbKeHoachDcHdr.forEach(elmHdr => {
            Array.isArray(elmHdr?.danhSachHangHoa) && elmHdr.danhSachHangHoa.forEach(elmDs => {
              flatArray.push({ ...elmHdr, danhSachHangHoa: null, ...elmDs })
            })
          });
          this.dataTable2Cuc = chain(flatArray).groupBy('soDxuat').map((item, i) => {
            const soDxuat = item.find(f => f.soDxuat == i);
            const duToanKphi = item.reduce((sum, cur) => sum += cur.duToanKphi, 0)
            return {
              ...soDxuat,
              children: item,
              duToanKphi,
              expand: true
            }
          }).value();
        }
      }
    }
    if (this.formData.value.loaiDieuChuyen == "CHI_CUC" && this.groupData2ChiCuc?.length > 0) {
      this.groupData2ChiCuc = this.groupData2ChiCuc.map(i => {
        i.selected = false;
        if (i.thKhDcHdrId == item.thKhDcHdrId) {
          i.selected = true
        }
        return { ...i }
      });

      if (item.thKhDcHdrId) {
        const res = await this.tongHopDieuChuyenService.getDetail(item.thKhDcHdrId);
        const detail2ChiCuc = res.data;
        if (!detail2ChiCuc) return;
        let flatArray = []
        if (Array.isArray(detail2ChiCuc?.thKeHoachDieuChuyenNoiBoCucDtls)) {
          detail2ChiCuc.thKeHoachDieuChuyenNoiBoCucDtls.forEach(item => {
            Array.isArray(item?.dcnbKeHoachDcHdr?.danhSachHangHoa) && item?.dcnbKeHoachDcHdr?.danhSachHangHoa.forEach(element => {
              const newItem = cloneDeep(item);
              delete newItem.dcnbKeHoachDcHdr.danhSachHangHoa;
              flatArray.push({ ...newItem, ...newItem.dcnbKeHoachDcHdr, ...element, maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho })
            });
          });
        }
        const buildData2ChiCuc = this.buildTableView(flatArray)
        this.dataTable2ChiCuc = cloneDeep(buildData2ChiCuc);
      }
    }
  }
  convertTongHop(data, isNew) {
    if (!data) return;
    if (isNew) {
      if (this.formData.value.loaiDieuChuyen === "CHI_CUC") {
        this.groupData2ChiCuc = cloneDeep(data);
        Array.isArray(data) && this.selectRow(this.groupData2ChiCuc[0], isNew)
      }
      else if (this.formData.value.loaiDieuChuyen === "CUC") {
        this.groupData2Cuc = cloneDeep(data)
        Array.isArray(data) && this.selectRow(this.groupData2Cuc[0], isNew)
      }
    } else {
      if (data.loaiDieuChuyen == "CHI_CUC") {
        this.groupData2ChiCuc = Array.isArray(data.thKeHoachDieuChuyenTongCucDtls) ? cloneDeep(data.thKeHoachDieuChuyenTongCucDtls) : []
        this.selectRow(this.groupData2ChiCuc[0], isNew)
      }
      else if (data.loaiDieuChuyen == "CUC") {
        this.groupData2Cuc = Array.isArray(data.thKeHoachDieuChuyenTongCucDtls) ? cloneDeep(data.thKeHoachDieuChuyenTongCucDtls) : []
        if (Array.isArray(this.groupData2Cuc)) {
          this.selectRow(this.groupData2Cuc[0], isNew)
        }
      }
    }
  };
  buildTableView(data: any[] = [], keychild: string = "children") {
    let dataView = chain(data)
      .groupBy("maDvi")
      ?.map((value, key) => {
        let rs = chain(value)
          .groupBy("maDiemKho")
          ?.map((v, k) => {
            let rss = chain(v)
              .groupBy("maLoNganKho")
              ?.map((vs, ks) => {
                const maLoNganKho = vs.find(s => s?.maLoNganKho == ks);
                const rsss = chain(vs).groupBy("id").map((x, ix) => {
                  const ids = x.find(f => f.id == ix);

                  const hasmaChiCucNhan = x.some(f => f.maChiCucNhan);
                  if (!hasmaChiCucNhan) return {
                    ...ids
                  }
                  const rsxx = chain(x).groupBy("maChiCucNhan")?.map((m, im) => {
                    const maChiCucNhan = m.find(f => f.maChiCucNhan == im);
                    const hasMaDiemKhoNhan = x.some(f => f.maDiemKhoNhan);
                    if (!hasMaDiemKhoNhan) return {
                      ...maChiCucNhan
                    }

                    const rssx = chain(m).groupBy("maDiemKhoNhan")?.map((n, inx) => {
                      const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
                      return {
                        ...maDiemKhoNhan,
                        children: n
                      }
                    }).value()
                    return {
                      ...maChiCucNhan,
                      children: rssx
                    }
                  }).value()
                  //

                  return {
                    ...ids,
                    children: rsxx
                  }
                }).value()
                // let duToanKphi = vs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                let duToanKphi = 0;
                let soLuongDc = 0;
                vs?.forEach(element => {
                  duToanKphi += (element.duToanKphi || 0);
                  soLuongDc += (element.soLuongDc || 0)
                });
                return {
                  ...maLoNganKho,
                  idVirtual: maLoNganKho ? maLoNganKho.idVirtual ? maLoNganKho.idVirtual : uuid.v4() : uuid.v4(),
                  children: rsss,
                  duToanKphi,
                  soLuongDc
                }
              }
              ).value();

            // let duToanKphi = v?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
            let duToanKphi = 0;
            let soLuongDc = 0;
            v?.forEach(element => {
              duToanKphi += (element.duToanKphi || 0);
              soLuongDc += (element.soLuongDc || 0)
            });
            let rowDiemKho = v?.find(s => s.maDiemKho === k);

            return {
              ...rowDiemKho,
              idVirtual: rowDiemKho ? rowDiemKho.idVirtual ? rowDiemKho.idVirtual : uuid.v4() : uuid.v4(),
              duToanKphi,
              soLuongDc,
              children: rss,
              expand: true
            }
          }
          ).value();

        // let duToanKphi = rs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
        let duToanKphi = 0;
        let soLuongDc = 0;
        rs?.forEach(element => {
          duToanKphi += (element.duToanKphi || 0);
          soLuongDc += (element.soLuongDc || 0)
        });
        let rowChiCuc = value?.find(s => s.maDvi === key);
        return {
          ...rowChiCuc,
          idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuid.v4() : uuid.v4(),
          duToanKphi,
          soLuongDc,
          children: rs,
          expand: true
        };
      }).value();
    // this.tableView = dataView;
    // this.expandAll()

    if (data?.length !== 0) {
      this.tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
    };
    return dataView
  }
  openModalTHKeHoachDCCUC(event, id: number) {
    event.preventDefault();
    event.stopPropagation();
    if (id) {
      this.idTHKeHoachDCCUC = id;
      this.isViewTHKeHoachDCCUC = true;
      this.isViewKeHoachDC = false;
    }

  }
  openModalKeHoachDC(event, id: number) {
    event.preventDefault();
    event.stopPropagation();
    if (id) {
      this.idKeHoachDC = id;
      this.isViewKeHoachDC = true;
      this.isViewTHKeHoachDCCUC = false
    }
  }
  closeModalTHKeHoachDCCUC() {
    this.idTHKeHoachDCCUC = null;
    this.isViewTHKeHoachDCCUC = false;
  }
  closeModalKeHoachDC() {
    this.idKeHoachDC = null;
    this.isViewKeHoachDC = false;
  }
  // setValidator(isTaoQD) {
  //     if (isTaoQD) {
  //         this.formData.controls["trichYeu"].setValidators([Validators.required]);
  //     }
  //     else {
  //         this.formData.controls["trichYeu"].clearValidators();
  //     }
  // }
  disabledngayTH = (): boolean => {
    return this.formData.value.trangThai === STATUS.DA_DU_THAO_QD || this.formData.value.trangThai === STATUS.DA_BAN_HANH_QD || this.formData.value.trangThai === STATUS.TU_CHOI_BAN_HANH_QD
  }
  disabledDateNgayTongHop = (value: Date): boolean => {
    if (value && this.formData.value.thoiGianTongHop) {
      return dayjs(value).endOf("days").isBefore(dayjs(this.formData.value.thoiGianTongHop, 'YYYY-MM-DDTHH:mm:ss'));
    }
    return false;
  };
  flattenTree(tree) {
    const flatArray = [];

    function flatten(node) {
      flatArray.push(node);
      if (node.listData && node.listData.length > 0) {
        node.listData.forEach(child => {
          flatten(child);
        });
      }
    }

    tree.forEach(item => {
      flatten(item);
    });

    return flatArray;
  }
  //  const obj = { 
  //   stt: i*5 +1,
  //   tenChiCucXuat: f.tenDvi,
  //   tenChiCucNhan: f.tenChiCucNhan,
  //   // thoiGianDkDc: f.thoiGianDkDc,
  //   thoiGianDkDc: "",
  //   tenLoaiVthh: f.tenLoaiVthh,
  //   tenCloaiVthh: f.tenCloaiVthh,
  //   donViTinh: f.donViTinh,
  //   tonKho: f.tonKho,
  //   namNhap: f.namNhap,
  //   soLuongDc: f.soLuongDc,
  //   duToanKphi: f.tongDuToanKp,
  //   tichLuongKd: f.tichLuongKd,
  //   soLuongPhanBo: f.soLuongPhanBo,
  //   slDcConLai: f.slDcConLai,
  //   lyDo: f.lyDoDc,
  //   tenDiemKho: f.tenDiemKho,
  //   tenNhaKho: f.tenNhaKho,
  //   tenNganKho: f.tenNganKho,
  //   tenLoKho: f.tenLoKho,
  //   tenDiemKhoNhan: f.tenDiemKhoNhan,
  //   tenNhaKhoNhan: f.tenNhaKhoNhan,
  //   tenNganKhoNhan: f.tenNganKhoNhan,
  //   tenLoKhoNhan: f.tenLoKhoNhan
  //  };
  async convertDataPreView(groupData) {
    let listData = [];
    if (this.formData.value.loaiDieuChuyen === "CUC") {
      listData = cloneDeep(groupData).map((dataCuc) => {
        const detailCuc = dataCuc.thKeHoachDieuChuyenCucKhacCucDtl;
        if (!detailCuc) return;
        let flatArray = [];
        Array.isArray(detailCuc.dcnbKeHoachDcHdr) && detailCuc.dcnbKeHoachDcHdr.forEach(elmHdr => {
          Array.isArray(elmHdr?.danhSachHangHoa) && elmHdr.danhSachHangHoa.forEach(elmDs => {
            flatArray.push({ ...elmHdr, danhSachHangHoa: null, ...elmDs })
          })
        });
        const rs1 = chain(flatArray).groupBy('soDxuat').map((value, k) => {
          const row = value.find(f => f.soDxuat == k);
          if (!row) return;
          const tongDuToanKp = value.reduce((sum, cur) => sum += cur.duToanKphi, 0)
          return {
            duToanKphi: tongDuToanKp,
            tenChiCucXuat: row.tenDvi,
            tenChiCucNhan: row.tenChiCucNhan,
            lyDo: row.lyDoDc,
            listData: value.map(f => ({
              thoiGianDkDc: f.thoiGianDkDc,
              tenLoaiVthh: f.tenLoaiVthh,
              tenCloaiVthh: f.tenCloaiVthh,
              donViTinh: f.donViTinh,
              tonKho: f.tonKho,
              namNhap: f.namNhap,
              soLuongDc: f.soLuongDc,
              duToanKphi: f.tongDuToanKp,
              tenDiemKho: f.tenDiemKho,
              tenNhaKho: f.tenNhaKho,
              tenNganKho: f.tenNganKho,
              tenLoKho: (f.tenLoKho ? f.tenLoKho + " - " : "") + (f.tenNhaKho ? f.tenNhaKho + " - " : "") +
                (f.tenNganKho ? f.tenNganKho : ""),
            }))
          }
        }).value().filter(f => !!f);
        return {
          tenCuc: dataCuc.tenCucDxuat,
          soToTrinh: dataCuc.soDxuat,
          tongDuToanKinhPhi: dataCuc.tongDuToanKp,
          listData: this.flattenTree(rs1)
        }
      })
    }
    if (this.formData.value.loaiDieuChuyen === "CHI_CUC") {
      const listPromise = cloneDeep(groupData).map(f => this.tongHopDieuChuyenService.getDetail(f.thKhDcHdrId).then(res => ({ ...res.data, tongDuToanKp: f.tongDuToanKp })));
      const dataPromise = await Promise.all(listPromise);
      listData = Array.isArray(dataPromise) ? dataPromise.map((detail2ChiCuc: any, i) => {
        const flatArray = [];
        if (Array.isArray(detail2ChiCuc?.thKeHoachDieuChuyenNoiBoCucDtls)) {
          detail2ChiCuc.thKeHoachDieuChuyenNoiBoCucDtls.forEach(item => {
            Array.isArray(item?.dcnbKeHoachDcHdr?.danhSachHangHoa) && item?.dcnbKeHoachDcHdr?.danhSachHangHoa.forEach(element => {
              const newItem = cloneDeep(item);
              delete newItem.dcnbKeHoachDcHdr.danhSachHangHoa;
              flatArray.push({ ...newItem, ...newItem.dcnbKeHoachDcHdr, ...element, maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho })
            });
          });
        }
        const rs1 = chain(flatArray).groupBy("maDvi").map((v1, k1) => {
          const row1 = v1.find(f => f.maDvi === k1);
          if (!row1) return;
          const rs2 = chain(v1).groupBy("maLoNganKho").map((v2, k2) => {
            const row2 = v2.find(f => f.maLoNganKho === k2);
            if (!row2) return;
            const rs3 = chain(v2).groupBy("maChiCucNhan").map((v3, k3) => {
              const row3 = v3.find(f => f.maChiCucNhan === k3);
              if (!row3) return;
              const rs4 = chain(v3).groupBy("maDiemKhoNhan").map((v4, k4) => {
                const row4 = v4.find(f => f.maDiemKhoNhan === k4);
                if (!row4) return;
                return {
                  tenDiemKhoNhan: row4.tenDiemKhoNhan,
                  listData: v4.map(f => ({
                    slDcConLai: f.slDcConLai,
                    tichLuongKd: f.tichLuongKd,
                    soLuongPhanBo: f.soLuongPhanBo,
                    tenLoKhoNhan: (f.tenLoKhoNhan ? f.tenLoKhoNhan + " - " : "") + (f.tenNganKhoNhan ? f.tenNganKhoNhan + " - " : "") +
                      (f.tenNhaKhoNhan ? f.tenNhaKhoNhan : "")
                  }))
                }
              }).value().filter(f => !!f)
              return {
                thoiGianDkDc: row3.thoiGianDkDc,
                tenChiCucNhan: row3.tenChiCucNhan,
                listData: rs4
              }
            }).value().filter(f => !!f);

            return {
              tenLoaiVthh: row2.tenLoaiVthh,
              tenCloaiVthh: row2.tenCloaiVthh,
              donViTinh: row2.donViTinh,
              tonKho: row2.tonKho,
              namNhap: row2.namNhap,
              soLuongDc: row2.soLuongDc,
              duToanKphi: row2.duToanKphi,
              tenLoKho: (row2.tenLoKho ? row2.tenLoKho + " - " : "") + (row2.tenNhaKho ? row2.tenNhaKho + " - " : "") +
                (row2.tenNganKho ? row2.tenNganKho + " - " : "") + (row2.tenDiemKho ? row2.tenDiemKho : ""),
              listData: rs3
            }
          }).value().filter(f => !!f)
          return {
            tenChiCucXuat: row1.tenDvi,
            lyDo: row1.lyDoDc,
            listData: rs2
          }
        }).value().filter(f => !!f);
        const newRs1 = this.flattenTree(rs1);
        return {
          tenCuc: detail2ChiCuc.tenDvi,
          soToTrinh: detail2ChiCuc.soDeXuat,
          tongDuToanKinhPhi: detail2ChiCuc.tongDuToanKp,
          listData: newRs1
        }
      }) : [];

    }
    return listData;
  }
  async preview() {
    try {
      this.spinner.show();
      const groupData = this.formData.value.loaiDieuChuyen === "CUC" ? cloneDeep(this.groupData2Cuc) : cloneDeep(this.groupData2ChiCuc);
      let listData = await this.convertDataPreView(groupData);
      this.dataPreView = { id: null, nam: this.formData.value.namKeHoach, listDtl: listData, type: this.formData.value.loaiDieuChuyen, fileType: 'pdf' }
      const resData = await this.tongHopDieuChuyenCapTongCucService.previewTh(this.dataPreView)
      this.pdfBlob = resData;
      const arrayBuffer = await resData.arrayBuffer();
      this.pdfSrc = arrayBuffer;
      this.showDlgPreview = true;
    } catch (error) {
      console.log("error", error)
    } finally {
      this.spinner.hide();
    }

  }
  downloadPdf() {
    saveAs(this.pdfBlob, "tong_hop_ke_hoach_dieu_chuyen_cap_tong_cuc.pdf");
  }
  downloadExcel() {
    this.tongHopDieuChuyenCapTongCucService.previewTh({ ...this.dataPreView, fileType: 'xlsx' }).then(async res => {
      this.excelBlob = res;
      this.excelSrc = await new Response(res).arrayBuffer();
      saveAs(this.excelBlob, "tong_hop_ke_hoach_dieu_chuyen_cap_tong_cuc.xlsx");
    }).catch((error) => console.log("error", error));
  }
}
