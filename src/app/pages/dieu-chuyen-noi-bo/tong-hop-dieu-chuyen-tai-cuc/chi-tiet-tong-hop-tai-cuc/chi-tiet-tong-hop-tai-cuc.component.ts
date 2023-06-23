import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from "@angular/forms";
import { UserLogin } from "../../../../models/userlogin";
import { DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan } from "../../../../models/KeHoachBanDauGia";
import { DatePipe } from "@angular/common";
import { DiaDiemNhapKho } from "../../../../models/CuuTro";
import {
  ModalInput
} from "../../../xuat/xuat-cuu-tro-vien-tro/xuat-cuu-tro/xay-dung-phuong-an/thong-tin-xay-dung-phuong-an/thong-tin-xay-dung-phuong-an.component";
import { Base2Component } from "../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "../../../../services/danhmuc.service";
import { DeXuatKeHoachBanDauGiaService } from "../../../../services/deXuatKeHoachBanDauGia.service";
import { DonviService } from "../../../../services/donvi.service";
import { TinhTrangKhoHienThoiService } from "../../../../services/tinhTrangKhoHienThoi.service";
import { DanhMucTieuChuanService } from "../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {
  DeXuatPhuongAnCuuTroService
} from "../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import { QuanLyHangTrongKhoService } from "../../../../services/quanLyHangTrongKho.service";
import * as dayjs from "dayjs";
import { FileDinhKem } from "../../../../models/DeXuatKeHoachuaChonNhaThau";
import { MESSAGE } from "../../../../constants/message";
import { STATUS } from "src/app/constants/status";
import { chain, cloneDeep, groupBy } from 'lodash';
import * as uuid from "uuid";
import { Utils } from 'src/app/Utility/utils';
import { TongHopDieuChuyenService } from '../tong-hop-dieu-chuyen-tai-cuc.service';
import { KeHoachDieuChuyenService } from '../../ke-hoach-dieu-chuyen/ke-hoach-dieu-chuyen.service';
import { BaseService } from 'src/app/services/base.service';
import { DialogTuChoiTongHopDieuChuyenComponent } from '../components/dialog-tu-choi/dialog-tu-choi.component';
@Component({
  selector: 'app-chi-tiet-tong-hop-dieu-chuyen-tai-cuc',
  templateUrl: './chi-tiet-tong-hop-tai-cuc.component.html',
  styleUrls: ['./chi-tiet-tong-hop-tai-cuc.component.scss']
})
export class ChiTietTongHopDieuChuyenTaiCuc extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() isViewDetail: boolean;
  @Input() isEdit: boolean;
  @Input() isAddNew: boolean
  @Output()
  showListEvent = new EventEmitter<any>();

  formData: FormGroup;
  cacheData: any[] = [];
  canCu: any[] = [];
  userLogin: UserLogin;
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  userInfo: UserLogin;
  expandSet = new Set<number>();
  STATUS = STATUS;
  datePipe = new DatePipe('en-US');
  expandSetString = new Set<string>();
  tableView = [];
  tableRow: any = {};
  isVisible = false;
  isVisibleSuaNoiDung = false;
  listNoiDung = [];
  errorInputComponent: any[] = [];
  disableInputComponent: ModalInput = new ModalInput();
  Utils = Utils;
  FORMAT_DATE_TIME_STR = Utils.FORMAT_DATE_TIME_STR;
  FORMAT_DATE_STR = Utils.FORMAT_DATE_STR;

  maHauTo: string;
  isTongHop: boolean = false;
  daXdinhDiemNhap: boolean = false;

  idKeHoachDC: any = null;
  isViewKeHoachDC: boolean = false;
  tongDuToanChiPhi: number = 0;

  tongHopData: any[] = [];

  dataTable2ChiCuc: any[];
  dataTable2Cuc: any[];
  groupData2Cuc: any[];

  listCCNhan: any[];

  listMaCCNhan: any[];
  listTenTrangThai = {
    "00": "Dự thảo",
    "01": "Chờ duyệt - tp",
    "02": "Từ chối -tp",
    "03": "Chờ duyệt - lđ cục",
    "04": "Từ chối - lđ cục",
    "05": "Đã duyệt - lđ cục",
    "59": "Y/c chi cục xác định điểm nhập"
  };
  deXuatPheDuyet: { [key: string]: boolean } = {};
  dcnbKeHoachDcHdrId: number[] = [];
  LOAI_HINH_NHAP_XUAT_CHI_CUC: { [key: string]: string } = {
    loaiHinhNhapXuat: '94', tenLoaiHinhNhapXuat: "Xuất Điều chuyển nội bộ Chi cục", kieuNhapXuat: '04', tenKieuNhapXuat: "Xuất không thu tiền"
  };
  LOAI_HINH_NHAP_XUAT_CUC: { [key: string]: string } = {
    loaiHinhNhapXuat: '144', tenLoaiHinhNhapXuat: "Xuất điều chuyển nội bộ Cục", kieuNhapXuat: '04', tenKieuNhapXuat: "Xuất không thu tiền"
  };
  TEN_KIEU_NHAP_XUAT: { [key: number]: any } = {
    1: "Nhập mua",
    2: "Nhập không chi tiền",
    3: "Xuất bán",
    4: "Xuất không thu tiền",
    5: "Khác"
  };
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private danhMucDungChungService: DanhMucDungChungService,
    private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private tongHopDieuChuyenService: TongHopDieuChuyenService,
    private keHoachDieuChuyenService: KeHoachDieuChuyenService,
    private cdr: ChangeDetectorRef,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDieuChuyenService);
    this.formData = this.fb.group(
      {
        id: [''],
        lyDoTuChoi: [''],

        trangThai: [''],
        tenTrangThai: [''],

        maTongHop: [''],
        soDeXuat: [''],
        ngayTongHop: [dayjs().format('YYYY-MM-DD')],
        trichYeu: [''],
        ngayDuyetLdc: [''],

        namKeHoach: [dayjs().get('year'), Validators.required],
        loaiDieuChuyen: ['CHI_CUC', Validators.required],
        thoiGianTongHop: [''],
        loaiHinhNhapXuat: [''],
        tenLoaiHinhNhapXuat: [''],
        kieuNhapXuat: [''],
        tenKieuNhapXuat: ['']
      }
    );
    this.userInfo = this.userService.getUserLogin();
    this.maHauTo = '/' + this.userInfo.MA_TCKT;
  }

  async ngOnInit() {

    this.spinner.show();
    try {
      // await this.loadDetail(this.idInput)
      if (this.idInput) {
        // await this.getDsChiCucBiTuChoi(this.formData.value.id);
        const data = await this.detail(this.idInput);
        if (data) {
          this.canCu = data.canCu
        }
        this.formData.patchValue({
          soDeXuat: this.formData.value.soDeXuat ? this.formData.value.soDeXuat.split('/')[0] : null
        })
        this.daXdinhDiemNhap = data?.daXdinhDiemNhap
        this.convertTongHop(data, this.isAddNew);
      } else {
        this.initData();

      }
      // await Promise.all([this.loaiVTHHGetAll(), this.loaiHopDongGetAll()]);
    } catch (e) {
      console.log("e", e)
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      if (this.isEdit || this.isViewDetail || this.isViewOnModal) {
        this.isTongHop = true
      };
      this.spinner.hide();
    }
  };
  async initData() {
    if (this.formData.value.loaiDieuChuyen === "CHI_CUC") {
      this.getLoaiHinhNhapXuat({ loai: 'LOAI_HINH_NHAP_XUAT', ma: '94' });
    } else if (this.formData.value.loaiDieuChuyen === "CUC") {
      this.getLoaiHinhNhapXuat({ loai: 'LOAI_HINH_NHAP_XUAT', ma: '144' });
    }
  };
  // async getDsChiCucBiTuChoi(id) {
  //     try {
  //         const res = await this.tongHopDieuChuyenService.getDsChiCucTuChoi({ id });
  //         this.listMaCCNhan = Array.isArray(res.data) ? res.data.map(f => f.maChiCucNhan) : []
  //     } catch (error) {
  //         console.log("error", error)
  //     }
  // }

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

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }
  mapExpanData = (list: any[] = [], key: string = "children") => {
    let result = list.map(f => {
      if (Array.isArray(f[key]) && f[key]?.length > 0) {
        return { ...f, expand: true, [key]: this.mapExpanData(f[key], key) }
      }
      return { ...f }
    });
    return result;
  }
  handleChangeLoaiDC = () => {
    this.isTongHop = false;
    this.formData.patchValue({ thoiGianTongHop: '' });
    if (this.isViewDetail || this.formData.value.trangThai || this.idInput) return;
    if (this.formData.value.loaiDieuChuyen === "CHI_CUC") {
      this.getLoaiHinhNhapXuat({ loai: 'LOAI_HINH_NHAP_XUAT', ma: '94' });
    } else if (this.formData.value.loaiDieuChuyen === "CUC") {
      this.getLoaiHinhNhapXuat({ loai: 'LOAI_HINH_NHAP_XUAT', ma: '144' });
    }
  }
  yeuCauXacDinhDiemNhap = async ($event) => {
    $event.stopPropagation();
    try {
      await this.spinner.show()
      const res = await this.save(false, true);
      if (res.msg == MESSAGE.SUCCESS) {

        const data = await this.tongHopDieuChuyenService.guiYeuCauXacDinhDiemNhap({ id: this.formData.value.id });
        if (data.msg == MESSAGE.SUCCESS) {
          this.notification.success(MESSAGE.SUCCESS, "Gửi yêu cầu xác định điểm nhập thành công!");
          this.formData.controls['trangThai'].setValue(STATUS.YC_CHICUC_PHANBO_DC);
        } else {
          this.notification.error(MESSAGE.ERROR, data.msg);
        }
      }
    } catch (error) {
      await this.spinner.hide()
    }
  }
  expandAll() {
    // this.phuongAnView.forEach(s => {
    //     this.expandSetString.add(s.idVirtual);
    // })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }


  async selectRow(item: any, isAddNew) {
    if (isAddNew) {
      if (this.groupData2Cuc?.length > 0) {
        this.groupData2Cuc = this.groupData2Cuc.map(i => {
          i.selected = false;
          if (i.maCucNhan == item.maCucNhan) {
            i.selected = true
          }
          return { ...i }
        });

        if (item.dcnbKeHoachDcHdrId) {
          const detailCuc = item.dcnbKeHoachDcHdrs;
          if (!Array.isArray(detailCuc)) return;
          const newDetaiData = detailCuc.map(f => ({ ...f, duToanKphi: f.danhSachHangHoa.reduce((sum, cur) => sum += cur.duToanKphi, 0) }))
          this.dataTable2Cuc = this.mapExpanData(newDetaiData, "danhSachHangHoa");

        }
      }

    } else {
      if (this.groupData2Cuc?.length > 0) {
        this.groupData2Cuc = this.groupData2Cuc.map(i => {
          i.selected = false;
          if (i.maCucNhan == item.maCucNhan) {
            i.selected = true
          }
          return { ...i }
        });

        if (item.dcnbKeHoachDcHdrId) {
          const detailCuc = item.dcnbKeHoachDcHdr;
          if (!Array.isArray(detailCuc)) return;
          const newDetaiData = detailCuc.map(f => ({ ...f, duToanKphi: f.danhSachHangHoa.reduce((sum, cur) => sum += cur.duToanKphi, 0) }))
          this.dataTable2Cuc = this.mapExpanData(newDetaiData, "danhSachHangHoa");

        }
      }
    }
  }


  handleOk(): void {

  }

  handleCancel(): void {
    this.isVisible = false;
    this.errorInputComponent = [];
    this.disableInputComponent = new ModalInput();
  };
  duyet(id: number, trangThai: string, msg: string, dcnbKeHoachDcHdrId?: number[], roles?: any, msgSuccess?: string) {
    if (this.formData.value.loaiKeHoach == 'CUC' && (this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC || this.formData.value.trangThai == STATUS.TU_CHOI_LDC) && (!dcnbKeHoachDcHdrId || !Array.isArray(dcnbKeHoachDcHdrId) || dcnbKeHoachDcHdrId.length <= 0)) {
      this.notification.error(MESSAGE.NOTIFICATION, 'Chưa có kế hoạch điều chuyển nào được duyệt.');
      return;
    }
    this.approve(id, trangThai, msg, dcnbKeHoachDcHdrId, roles, msgSuccess)
  }
  async saveAndSend(): Promise<void> {
    try {
      await this.spinner.show();
      this.setValidator(true);
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.valid) {
        const res = await this.save(true, false)
        if (res.msg == MESSAGE.SUCCESS) {
          await this.approve(this.formData.value.id, STATUS.CHO_DUYET_TP, "Bạn có chắc chắn muốn gửi duyệt?");
        }
      }
    } catch (error) {
      console.log("error", error)
    } finally {
      await this.spinner.hide();
    }
  };
  async reject2ChiCuc(id: number, trangThai: string, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối phê duyệt',
      nzContent: DialogTuChoiTongHopDieuChuyenComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: { data: this.listCCNhan },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      const listTuChoi = Array.isArray(data?.listTuChoi) ? data.listTuChoi.filter(f => f.checked).map(f => f.value) : []
      const listTuChoiStr = listTuChoi.join(",")
      if (data.lyDoTuChoi && listTuChoi.length > 0) {
        this.spinner.show();
        try {
          let body = {
            id: id,
            lyDoTuChoi: data.lyDoTuChoi,
            maChiCucNhan: listTuChoiStr,
            trangThai: trangThai,
          };
          const res = await this.tongHopDieuChuyenService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.spinner.hide();
            this.goBack();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            this.spinner.hide();
          }
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      }
    });
  }
  async save(isGuiDuyet: boolean, isGuiYeuCau: boolean) {
    try {

      let body = { ...this.formData.value, soDeXuat: this.formData.value.soDeXuat ? this.formData.value.soDeXuat + '/DCNB' : undefined };
      body.canCu = this.canCu;
      let res;
      await this.spinner.show();
      this.setValidator(false)
      this.helperService.markFormGroupTouched(this.formData);
      if (body.id) {
        res = await this.tongHopDieuChuyenService.capNhatTHCuc(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isGuiDuyet && !isGuiYeuCau) { this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS) };
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        };

      } else {
        res = await this.tongHopDieuChuyenService.themTHCuc({ ...body, id: undefined });
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isGuiDuyet && !isGuiYeuCau) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          }
          this.isAddNew = false;
          this.isViewDetail = false;
          this.isDetail = true;
          this.isEdit = true;
          if (res?.data?.id) {
            this.formData.controls['maTongHop'].setValue(res.data.id);
            this.formData.controls['id'].setValue(res.data.id);
            this.formData.controls['lyDoTuChoi'].setValue(res.data.lyDoTuChoi);
            this.formData.controls['trangThai'].setValue(res.data.trangThai);
            this.formData.controls['tenTrangThai'].setValue(res.data.tenTrangThai);
            this.formData.controls['soDeXuat'].setValue(res.data.soDeXuat ? res.data.soDeXuat.split('/')[0] : null);
            this.formData.controls['ngayTongHop'].setValue(res.data.ngayTongHop);
            this.formData.controls['trichYeu'].setValue(res.data.trichYeu);
            this.formData.controls['ngayDuyetLdc'].setValue(res.data.ngayDuyetLdc);
            this.formData.controls['namKeHoach'].setValue(res.data.namKeHoach, { emitEvent: false });
            this.formData.controls['loaiDieuChuyen'].setValue(res.data.loaiDieuChuyen, { emitEvent: false });
            this.formData.controls['thoiGianTongHop'].setValue(res.data.thoiGianTongHop);
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        };
      }
      return res
    } catch (error) {
      console.log("error")
    } finally {
      this.isTongHop = true;
      await this.spinner.hide();
    }
  }
  async tongHop() {
    this.groupData2Cuc = [];
    this.dataTable2Cuc = [];
    this.dataTable2ChiCuc = [];
    this.formData.value.ngayTongHop = dayjs().format("YYYY-MM-DD")
    this.setValidator(false);
    this.helperService.markFormGroupTouched(this.formData);
    try {
      if (this.formData.valid) {
        this.isTongHop = true;
        const thoiGianTongHop = dayjs().format("YYYY-MM-DDTHH:mm:ss");
        // if (this.formData.value.loaiDieuChuyen === "CHI_CUC") {
        //   this.formData.patchValue({ thoiGianTongHop, ...this.LOAI_HINH_NHAP_XUAT_CHI_CUC })
        // } else if (this.formData.value.loaiDieuChuyen === "CUC") {
        //   this.formData.patchValue({ thoiGianTongHop, ...this.LOAI_HINH_NHAP_XUAT_CUC })

        // }
        this.formData.patchValue({ thoiGianTongHop })
        // call api tổng hợp dữ liệu;
        const body = {
          namKeHoach: this.formData.value.namKeHoach,
          loaiDieuChuyen: this.formData.value.loaiDieuChuyen,
          thoiGianTongHop: this.formData.value.thoiGianTongHop

        }
        this.spinner.show();
        const data = await this.tongHopDieuChuyenService.lapKeHoach(body);
        if (data.msg == MESSAGE.SUCCESS) {
          // this.notification.success(MESSAGE.SUCCESS);
          this.tongHopData = cloneDeep(data.data);
          this.convertTongHop(this.tongHopData, this.isAddNew)
        } else {
          this.notification.error(MESSAGE.ERROR, data.msg);
        }

      } else {
        Object.values(this.formData.controls).forEach(control => {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        });
      }
    } catch (error) {
      console.log("error", error)
    }
    finally {
      this.spinner.hide()
    }

  }

  convertTongHop(data, isNew: boolean = false) {
    if (!data) return;
    if (isNew) {
      if (this.formData.value.loaiDieuChuyen === "CHI_CUC") {
        let flatArray = []
        if (Array.isArray(data)) {
          data.forEach((item, i) => {
            if (Array.isArray(item?.dcnbKeHoachDcDtls)) {
              const newItem = cloneDeep(item);
              delete newItem.dcnbKeHoachDcDtls;
              item?.dcnbKeHoachDcDtls.forEach(element => {
                flatArray.push({ ...newItem, ...element, maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho, })
              });
            }
          })
        }
        const buildData2ChiCuc = this.buildTableView(flatArray)
        this.dataTable2ChiCuc = cloneDeep(buildData2ChiCuc);
      }
      else if (this.formData.value.loaiDieuChuyen === "CUC") {
        this.groupData2Cuc = cloneDeep(data);
        Array.isArray(data) && this.selectRow(this.groupData2Cuc[0], isNew)
      }
    } else {
      if (data.loaiDieuChuyen == "CHI_CUC") {
        if (Array.isArray(data.thKeHoachDieuChuyenNoiBoCucDtls) && data.thKeHoachDieuChuyenNoiBoCucDtls.length > 0) {
          this.daXdinhDiemNhap = true;
          data.thKeHoachDieuChuyenNoiBoCucDtls?.forEach(element => {
            if (!element?.dcnbKeHoachDcHdr?.daXdinhDiemNhap) {
              this.daXdinhDiemNhap = false;
            }
          });

        }
        let flatArray = [];
        let arrCCucNhan = [];
        if (Array.isArray(data?.thKeHoachDieuChuyenNoiBoCucDtls)) {
          data.thKeHoachDieuChuyenNoiBoCucDtls.forEach((item) => {
            Array.isArray(item?.dcnbKeHoachDcHdr?.danhSachHangHoa) && item?.dcnbKeHoachDcHdr?.danhSachHangHoa.forEach(element => {
              const newItem = cloneDeep(item);
              delete newItem.dcnbKeHoachDcHdr.danhSachHangHoa;
              flatArray.push({ ...newItem, ...newItem.dcnbKeHoachDcHdr, ...element, maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho });
              if (!arrCCucNhan.find(f => f.value == element.maChiCucNhan)?.value) {
                arrCCucNhan.push({ label: element.tenChiCucNhan, value: element.maChiCucNhan, checked: false })
              }
            });
          })
        };
        this.listCCNhan = cloneDeep(arrCCucNhan)
        const buildData2ChiCuc = this.buildTableView(flatArray)
        this.dataTable2ChiCuc = cloneDeep(buildData2ChiCuc);
      }
      else if (data.loaiDieuChuyen == "CUC") {
        this.groupData2Cuc = Array.isArray(data.thKeHoachDieuChuyenCucKhacCucDtls) ? data.thKeHoachDieuChuyenCucKhacCucDtls : [];
        if (Array.isArray(this.groupData2Cuc)) {
          this.daXdinhDiemNhap = true;
          this.groupData2Cuc.forEach((item, id) => {
            if (item.dcnbKeHoachDcHdr.some(cur => !cur.daXdinhDiemNhap)) {
              this.daXdinhDiemNhap = false
            };
            if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP) {
              Array.isArray(item.dcnbKeHoachDcHdr) && item.dcnbKeHoachDcHdr.forEach(element => {
                this.deXuatPheDuyet[element.id] = true;
              });

            } else if (this.formData.value.trangThai && this.formData.value.trangThai != STATUS.DU_THAO && typeof item.dcnbKeHoachDcHdrId == "string") {
              item.dcnbKeHoachDcHdrId?.split(",")?.forEach(element => {
                this.deXuatPheDuyet[element] = true
              });
            }
            this.renderListDcnbKeHoachDcHdrId(this.deXuatPheDuyet)
          })
          this.selectRow(this.groupData2Cuc[0], isNew)
        }
      }
    }

  }

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
              duToanKphi: duToanKphi,
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
          duToanKphi: duToanKphi,
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
  setValidator(isGuiDuyet: boolean) {
    if (isGuiDuyet) {
      this.formData.controls["soDeXuat"].setValidators([Validators.required]);
      this.formData.controls["trichYeu"].setValidators([Validators.required]);
    }
    else {
      this.formData.controls["soDeXuat"].clearValidators();
      this.formData.controls["trichYeu"].clearValidators();
    }
  }
  closeModalKeHoachDC() {
    this.idKeHoachDC = null;
    this.isViewKeHoachDC = false;
  }
  openModalKeHoachDC(id: any) {
    if (id) {
      this.idKeHoachDC = id;
      this.isViewKeHoachDC = true;
    }

  }
  checkDxuatDuyet(check: boolean, data: any): void {
    this.deXuatPheDuyet[data.id] = check;
    this.renderListDcnbKeHoachDcHdrId(this.deXuatPheDuyet)
  };
  renderListDcnbKeHoachDcHdrId(listObj = {}) {
    const arr = []
    for (const [key, value] of Object.entries(listObj)) {
      if (value) {
        arr.push(Number(key))
      }
    }
    this.dcnbKeHoachDcHdrId = cloneDeep(arr)
  }
  async approve(id: number, trangThai: string, msg: string, dcnbKeHoachDcHdrId?: number[], roles?: any, msgSuccess?: string) {
    if (!this.checkPermission(roles)) {
      return
    };
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: msg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: id,
            trangThai: trangThai,
            dcnbKeHoachDcHdrId
          }
          let res = await this.tongHopDieuChuyenService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.NOTIFICATION, msgSuccess ? msgSuccess : MESSAGE.UPDATE_SUCCESS);
            this.spinner.hide();
            this.goBack();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            this.spinner.hide();
          }
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      },
    });
  };
  roleCheckXuatDuyet(id: number, trangThai: string) {
    return this.userService.isCuc() && ((this.userService.isAccessPermisson('DCNB_TONGHOPDC_DUYET_TP') && (trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.TU_CHOI_LDC)) || (this.userService.isAccessPermisson('DCNB_TONGHOPDC_DUYET_LDCUC') && trangThai == STATUS.CHO_DUYET_LDC))
  }
  checkDisabledSoDxcv() {
    return this.isViewDetail || (this.formData.value.loaiDieuChuyen == "CHI_CUC" && this.formData.value.trangThai == STATUS.DA_DUYET_LDC) || (this.formData.value.loaiDieuChuyen == "CUC" && this.formData.value.trangThai && this.formData.value.trangThai !== STATUS.DU_THAO)
  }
  disabledNgayTongHop = (value: Date): boolean => {
    if (value && this.formData.value.thoiGianTongHop) {
      return dayjs(value).endOf("days").isBefore(dayjs(this.formData.value.thoiGianTongHop, 'YYYY-MM-DDTHH:mm:ss'));
    }
    return false;
  };
}
