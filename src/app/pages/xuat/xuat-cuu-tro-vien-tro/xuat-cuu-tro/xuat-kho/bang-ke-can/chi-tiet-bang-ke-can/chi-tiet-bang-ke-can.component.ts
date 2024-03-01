import { AMOUNT_ONE_DECIMAL, AMOUNT_THREE_DECIMAL, AMOUNT_TWO_DECIMAL } from './../../../../../../../Utility/utils';
import { AMOUNT_NO_DECIMAL } from 'src/app/Utility/utils';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from "@angular/forms";
import { UserLogin } from "src/app/models/userlogin";
import { DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan } from "src/app/models/KeHoachBanDauGia";
import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { DeXuatKeHoachBanDauGiaService } from "src/app/services/deXuatKeHoachBanDauGia.service";
import { DonviService } from "src/app/services/donvi.service";
import { TinhTrangKhoHienThoiService } from "src/app/services/tinhTrangKhoHienThoi.service";
import { DanhMucTieuChuanService } from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import { QuanLyHangTrongKhoService } from "src/app/services/quanLyHangTrongKho.service";
import * as dayjs from "dayjs";
import { MESSAGE } from "src/app/constants/message";
import { STATUS } from 'src/app/constants/status';
import { Base2Component } from "src/app/components/base2/base2.component";
import { v4 as uuidv4 } from 'uuid';
import { chain, cloneDeep } from 'lodash';
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import {
  QuyetDinhGiaoNvCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service";
import {
  PhieuKiemNghiemChatLuongService
} from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuKiemNghiemChatLuong.service';
import { PhieuXuatKhoService } from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuXuatKho.service";
import { BangKeCanCtvtService } from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BangKeCanCtvt.service";
import { convertTienTobangChu, convertTienTobangChuThapPhan } from 'src/app/shared/commonFunction';
import { HelperService } from 'src/app/services/helper.service';
import { FileDinhKem } from 'src/app/models/CuuTro';
import { pairwise, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-chi-tiet-bang-ke-can',
  templateUrl: './chi-tiet-bang-ke-can.component.html',
  styleUrls: ['./chi-tiet-bang-ke-can.component.scss']
})
export class ChiTietBangKeCanComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() loaiXuat: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  helperService: HelperService
  fileDinhKem: any[] = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  userInfo: UserLogin;
  expandSet = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  listChungLoaiHangHoa: any[] = [];
  maDeXuat: string;
  listLoaiHopDong: any[] = [];
  STATUS = STATUS;
  MESSAGE = MESSAGE;
  listLoaiHinhNhapXuat: any[] = [];
  listKieuNhapXuat: any[] = [];
  datePipe = new DatePipe('en-US');
  tongSl = 0;
  tongTien = 0;
  diaDiemNhapKho: any[] = [];
  bangKeDtlCreate: any = {};
  bangKeDtlClone: any = {};
  dsDonVi: any = [];
  dsQdGnv: any = [];
  dsPhieuXuatKho: any = [];
  dsDiaDiem: any = [];
  expandSetString = new Set<string>();
  phuongAnView = [];
  phuongAnRow: any = {};
  isVisible = false;
  isVisibleSuaNoiDung = false;
  listNoiDung = []
  listThanhTien: any;
  listSoLuong: any;
  errorInputComponent: any[] = [];
  flagInit: Boolean = true;
  listDiaDiemKho: any[] = [];
  templateName = "Bảng kê cân hàng";
  templateNameVt = "Bảng kê xuất Vật tư";
  amount = { ...AMOUNT_NO_DECIMAL };
  amount1 = { ...AMOUNT_THREE_DECIMAL };
  amount1Left = { ...AMOUNT_THREE_DECIMAL, align: "left" };
  listPhuongPhapCan: Array<{ label: string, value: string }> = [{ label: 'Cân giám định', value: 'can_giam_dinh' }, { label: 'Cân toàn bộ', value: 'can_toan_bo' }]
  bangKeDtlKcCreate: any = {};
  bangKeDtlKcClone: any = {}
  tongSoBaoCan: number;
  tongSoBaoKc: number;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
    private phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    private phieuXuatKhoService: PhieuXuatKhoService,
    private bangKeCanCtvtService: BangKeCanCtvtService,
    private cdr: ChangeDetectorRef,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanCtvtService);
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get("year")],
        maDvi: [''],
        maQhns: [''],
        soBangKe: ['', [Validators.required]],
        ngayLapBangKe: ['', [Validators.required]],
        idQdGiaoNvXh: [''],
        soQdGiaoNvXh: ['', [Validators.required]],
        ngayQdGiaoNvXh: [''],
        nguoiGiamSat: ['', [Validators.required]],
        maDiemKho: [''],
        maNhaKho: [''],
        maNganKho: [''],
        maLoKho: [''],
        maKho: [''],
        idPhieuXuatKho: [''],
        soPhieuXuatKho: ['', [Validators.required]],
        ngayXuat: ['', [Validators.required]],
        diaDiemKho: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        donViTinh: [''],
        nlqHoTen: [''],
        nlqCmnd: [''],
        nlqDonVi: [''],
        nlqDiaChi: [''],
        thoiGianGiaoNhan: [''],
        tongTrongLuong: [],
        tongTrongLuongBaoBi: [],
        tongTrongLuongHang: [],
        ngayGduyet: [''],
        nguoiGduyetId: [''],
        ngayPduyet: [''],
        nguoiPduyetId: [''],
        lyDoTuChoi: [''],
        trangThai: ['00'],
        type: [''],
        tenDvi: [''],
        diaChiDvi: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenTrangThai: ['Dự thảo'],
        tenChiCuc: [''],
        tenDiemKho: [''],
        tenNhaKho: [''],
        tenNganKho: [''],
        tenLoKho: [''],
        tenNganLoKho: [''],
        nguoiPduyet: [''],
        nguoiGduyet: [''],
        bangKeDtl: [new Array(), [Validators.required, Validators.minLength(1)]],
        thuKho: [''],
        fileDinhKem: [new Array<FileDinhKem>()],
        tongTrongLuongHangBc: [],
        phuongPhapCan: ['can_giam_dinh'],

        bangKeDtlKc: [new Array()],
        trongLuongMotBaoCaBi: [],
        tongTrongLuongCaBiKc: [],
        tongSoLuongBaoBi: [],
      }
    );
    this.userInfo = this.userService.getUserLogin();
    this.maDeXuat = '/' + this.userInfo.MA_TCKT;
    this.formData.get("tongTrongLuongHang").valueChanges.subscribe((value) => {
      const tongTrongLuongHangBc = this.convertTienTobangChu(value, this.formData.value.donViTinh === "kg" ? "kilôgam" : this.formData.value.donViTinh);
      this.formData.patchValue({ tongTrongLuongHangBc });
    })
    this.formData.get('trongLuongMotBaoCaBi')?.valueChanges.pipe(startWith(this.formData.get('trongLuongMotBaoCaBi')?.value), pairwise()).subscribe(([prevValue, nextValue]) => {
      if (prevValue !== nextValue) {
        this.tinhTong()
      }
    })
    this.formData.get('tongTrongLuongBaoBi')?.valueChanges.pipe(startWith(this.formData.get('tongTrongLuongBaoBi')?.value), pairwise()).subscribe(([prevValue, nextValue]) => {
      if (prevValue !== nextValue) {
        this.tinhTong()
      }
    })
    this.formData.get('phuongPhapCan')?.valueChanges.pipe(startWith(this.formData.get('phuongPhapCan')?.value), pairwise()).subscribe(([prevValue, nextValue]) => {
      if (prevValue !== nextValue) {
        this.clearDataCan();
        if (nextValue === "can_giam_dinh") {
          this.formData.get('bangKeDtlKc').setValidators([Validators.required, Validators.minLength(1)])
        } else {
          this.formData.get('bangKeDtlKc').clearValidators()
        }
        this.formData.get('bangKeDtlKc').updateValueAndValidity();
      }
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.loadDsDonVi(),
        this.loadDsQdGnv(),
      ])
      await this.loadDetail(this.idInput)
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      this.flagInit = false;
      await this.spinner.hide();
    }
  }

  async loadDsLoaiHinhNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNhapXuat = res.data.filter(item => item.apDung == 'XUAT_CTVT');
    }
  }

  async loadDsKieuNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKieuNhapXuat = res.data.filter(item => item.apDung == 'XUAT_CTVT');

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
      this.dsDonVi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsQdGnv() {
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: this.loaiVthh,
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
      // listTrangThaiXh: [STATUS.DA_HOAN_THANH],
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      }
    }
    let res = await this.quyetDinhGiaoNvCuuTroService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      // this.dsQdGnv = data.content;
      this.dsQdGnv = data.content.filter(f => f.dataDtl.some(f => f.trangThai === STATUS.DA_HOAN_THANH));
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.bangKeCanCtvtService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            // this.formData.patchValue(res.data);
            this.helperService.bidingDataInFormGroupAndIgnore(this.formData, res.data, ['tongTrongLuongBaoBi', 'tenNganKho', 'tenLoKho', 'bangKeDtl']);
            this.formData.controls['donViTinh'].setValue(res.data.dviTinh);
            this.formData.controls['tongTrongLuongBaoBi'].setValue(res.data.tongTrongLuongBaoBi, { emitEvent: false });
            this.formData.controls['tenNganKho'].setValue(res.data.tenNganKho, { emitEvent: false });
            this.formData.controls['tenLoKho'].setValue(res.data.tenLoKho, { emitEvent: false });
            this.formData.controls['tenNganLoKho'].setValue(res.data.tenLoKho ? `${res.data.tenLoKho} - ${res.data.tenNganKho}` : res.data.tenNganKho)
            if (this.loaiVthh === '02' || (this.loaiVthh !== '02' && res.data.phuongPhapCan === 'can_toan_bo')) {
              this.formData.controls['bangKeDtl'].setValue(res.data.bangKeDtl)
              // this.tinhTong()
            }
            if (res.data.phuongPhapCan === 'can_giam_dinh') {
              const bangKeDtl = res.data.bangKeDtl.filter(f => f.soBaoBi);
              const bangKeDtlKc = res.data.bangKeDtl.filter(f => f.soLuong);
              const trongLuongMotBaoCaBi = bangKeDtlKc[0].soLuong > 0 ? bangKeDtlKc[0].trongLuongCaBi / bangKeDtlKc[0].soLuong : null;
              const tongTrongLuongBaoBi = bangKeDtlKc[0].trongLuongBaoBi;
              this.formData.controls['bangKeDtl'].setValue(bangKeDtl);
              this.formData.controls['bangKeDtlKc'].setValue(bangKeDtlKc);
              this.formData.controls['trongLuongMotBaoCaBi'].setValue(trongLuongMotBaoCaBi);
              this.formData.controls['tongTrongLuongBaoBi'].setValue(tongTrongLuongBaoBi);
            }
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
      this.tinhTong();
    } else {
      let id = await this.userService.getId('XH_CTVT_BANG_KE_HDR_SEQ')
      this.formData.patchValue({
        soBangKe: `${id}/${this.formData.value.nam}/BKCH-${this.userInfo.DON_VI?.tenVietTat}`,
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        type: this.loaiXuat,
        thuKho: this.userInfo.TEN_DAY_DU,
        // loaiVthh: this.loaiVthh,
      })
    }

  }

  expandAll() {
    this.phuongAnView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
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


  async selectHangHoa(event: any) {
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listChungLoaiHangHoa = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  selectRow(item) {
    this.phuongAnView.forEach(i => i.selected = false);
    item.selected = true;
  }

  showModal(data?: any): void {
    this.listNoiDung = [...new Set(this.formData.value.deXuatPhuongAn.map(s => s.noiDung))];
    this.isVisible = true;
    this.phuongAnRow.loaiVthh = this.formData.value.loaiVthh;
    if (this.userService.isCuc()) {
      this.phuongAnRow.maDviCuc = this.userInfo.MA_DVI;
      this.changeCuc(this.phuongAnRow.maDviCuc);
    }
    /* if (data) {
       this.phuongAnRow.maDviCuc = this.dsDonVi.find(s => s.tenDvi === data.tenCuc).maDvi;
       this.changeCuc(this.phuongAnRow.maDviCuc);
       this.phuongAnRow.noiDung = data.childData[0].noiDung;
       this.phuongAnRow.soLuongXuatCuc = data.soLuongXuatCuc;
     }*/
  }

  async buildTableView() {
    let dataView = chain(this.formData.value.deXuatPhuongAn)
      .groupBy("noiDung")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenCuc")
          .map((v, k) => {
            let soLuongXuatCucThucTe = v.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
            let rowCuc = v.find(s => s.tenCuc === k);
            return {
              idVirtual: uuidv4(),
              tenCuc: k,
              soLuongXuatCuc: rowCuc.soLuongXuatCuc,
              soLuongXuatCucThucTe: soLuongXuatCucThucTe,
              tenCloaiVthh: v[0].tenCloaiVthh,
              childData: v
            }
          }
          ).value();
        let soLuongXuat = rs.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
        let soLuongXuatThucTe = rs.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
        return {
          idVirtual: uuidv4(),
          noiDung: key,
          soLuongXuat: soLuongXuat,
          soLuongXuatThucTe: soLuongXuatThucTe,
          childData: rs
        };
      }).value();
    this.phuongAnView = dataView
    this.expandAll()

    if (this.formData.value.deXuatPhuongAn.length !== 0) {
      this.listThanhTien = this.formData.value.deXuatPhuongAn.map(s => s.thanhTien);
      this.listSoLuong = this.formData.value.deXuatPhuongAn.map(s => s.soLuongXuatChiCuc);
    } else {
      this.listThanhTien = [0];
      this.listSoLuong = [0];
    }
  }

  async changeCuc(event: any) {
    if (event) {
      let existRow = this.formData.value.deXuatPhuongAn
        .find(s => s.noiDung === this.phuongAnRow.noiDung && s.maDvi === this.phuongAnRow.maDvi);
      if (existRow) {
        this.phuongAnRow.soLuongXuatCuc = existRow.soLuongXuatCuc;
      } else {
        this.phuongAnRow.soLuongXuatCuc = 0
      }

      let data = this.dsDonVi.find(s => s.maDvi == event);
      this.phuongAnRow.tenCuc = data.tenDvi;
      let body = {
        trangThai: "01",
        maDviCha: event,
        type: "DV"
      };
      let res = await this.donViService.getDonViTheoMaCha(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listChiCuc = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }

  }

  async changeChiCuc(event: any) {
    if (event) {
      let data = this.listChiCuc.find(s => s.maDvi == event);
      this.phuongAnRow.tenChiCuc = data.tenDvi;
      let body = {
        'maDvi': event,
        'loaiVthh': this.formData.value.loaiVthh
      }
      this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let data = res.data;
          if (data.length > 0) {
            this.phuongAnRow.tonKhoChiCuc = data[0].slHienThoi;
          }
        }
      });
    }
  }


  async changeCloaiVthh(event: any) {
    let body = {
      maDvi: this.phuongAnRow.maDviChiCuc,
      loaiVthh: this.formData.value.loaiVthh,
      cloaiVthh: event
    }
    this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data.length > 0) {
          this.phuongAnRow.tonKhoChiCuc = data[0].slHienThoi;
        }

      }
    });
  }

  async save() {
    this.helperService.ignoreRequiredForm(this.formData, ['soBangKe']);
    let body = this.formData.value;
    if (this.loaiVthh !== '02') {
      const bangKeDtl = [...this.formData.value.bangKeDtl, ...this.formData.value.bangKeDtlKc.map(f => ({ ...f, trongLuongCaBi: (f.soLuong || 0) * (this.formData.value.trongLuongMotBaoCaBi || 0), trongLuongBaoBi: this.formData.value.tongTrongLuongBaoBi }))];
      body = { ...body, bangKeDtl }
    }
    await this.createUpdate(body);
    this.helperService.restoreRequiredForm(this.formData);
  }

  async flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
  }

  async suaPhuongAn(data: any) {
    let currentRow;
    if (data.id) {
      currentRow = this.formData.value.deXuatPhuongAn.find(s => s.id == data.id);
    } else if (data.idVirtual) {
      currentRow = this.formData.value.deXuatPhuongAn.find(s => s.idVirtual == data.idVirtual)
    }
    this.phuongAnRow = currentRow;
    this.changeCuc(this.phuongAnRow.maDviCuc);
    this.showModal();
  }

  async suaNoiDung(data: any) {
    this.phuongAnRow.noiDung = data.noiDung;
    this.phuongAnRow.noiDungEdit = data.noiDung;
    this.showModalSuaNoiDung();
  }

  showModalSuaNoiDung(): void {
    this.isVisibleSuaNoiDung = true;
  }

  handleOkSuaNoiDung(): void {
    let currentNoiDung = this.formData.value.deXuatPhuongAn.filter(s => s.noiDung == this.phuongAnRow.noiDung);
    currentNoiDung.forEach(s => {
      s.noiDung = this.phuongAnRow.noiDungEdit;
    });
    this.buildTableView();
    this.isVisibleSuaNoiDung = false;

    //clean
    this.phuongAnRow = {}
  }

  handleCancelSuaNoiDung(): void {
    this.isVisibleSuaNoiDung = false;
    this.phuongAnRow = {}
  }

  async checkVld(inputName: string) {
    if (this.errorInputComponent.find(s => s === inputName)) {
      return 'error'
    } else {
      return '';
    }
  }
  checkAddOrEditRow() {
    if (this.loaiVthh === '02' && Object.keys(this.bangKeDtlCreate).length >= 2 && this.bangKeDtlCreate.soLuong > 0 || this.loaiVthh !== '02' && Object.keys(this.bangKeDtlCreate).length >= 3 && this.bangKeDtlCreate.soBaoBi > 0 && this.bangKeDtlCreate.trongLuongCaBi > 0) {
      return true
    }
    if (this.formData.value.phuongPhapCan === "can_giam_dinh" && this.loaiVthh !== '02' && Object.keys(this.bangKeDtlKcCreate).length >= 2 && this.bangKeDtlKcCreate.soLuong > 0) {
      return true
    }
    return false
  }
  async addRow() {
    if (this.checkAddOrEditRow()) {
      // this.formData.value.bangKeDtl = [...this.formData.value.bangKeDtl, this.bangKeDtlCreate];
      const bangKeDtl = cloneDeep(this.formData.value.bangKeDtl);
      bangKeDtl.push(this.bangKeDtlCreate);
      this.clearRow();
      this.formData.patchValue({ bangKeDtl });
      this.tinhTong();
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin")
    }
  }

  async clearRow() {
    this.bangKeDtlCreate = {}
  }

  async editRow(i: number) {
    // this.formData.value.bangKeDtl.forEach(s => s.isEdit = false);
    // this.formData.value.bangKeDtl[i].isEdit = true;
    const bangKeDtl = cloneDeep(this.formData.value.bangKeDtl);
    bangKeDtl.forEach(s => s.isEdit = false);
    bangKeDtl[i].isEdit = true;
    Object.assign(this.bangKeDtlClone, this.formData.value.bangKeDtl[i]);
    this.formData.patchValue({ bangKeDtl });
  }

  async deleteRow(i: number) {
    // this.formData.value.bangKeDtl.splice(i, 1);
    const bangKeDtl = cloneDeep(this.formData.value.bangKeDtl);
    bangKeDtl.splice(i, 1);
    this.formData.patchValue({ bangKeDtl });
    this.tinhTong();
  }

  async saveRow(i: number) {
    // this.formData.value.bangKeDtl[i].isEdit = false;
    const bangKeDtl = cloneDeep(this.formData.value.bangKeDtl);
    bangKeDtl[i].isEdit = false;
    this.formData.patchValue({ bangKeDtl });
    this.tinhTong();
  }

  async cancelRow(i: number) {
    // Object.assign(this.formData.value.bangKeDtl[i], this.bangKeDtlClone);
    // this.formData.value.bangKeDtl[i].isEdit = false;
    const bangKeDtl = cloneDeep(this.formData.value.bangKeDtl);
    Object.assign(bangKeDtl[i], this.bangKeDtlClone);
    bangKeDtl[i].isEdit = false;
    this.formData.patchValue({ bangKeDtl });
  }

  async addRowKc() {
    if (this.checkAddOrEditRow()) {
      const bangKeDtlKc = cloneDeep(this.formData.value.bangKeDtlKc);
      bangKeDtlKc.push(this.bangKeDtlKcCreate);
      this.clearRowKc();
      this.formData.patchValue({ bangKeDtlKc });
      this.tinhTong();
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin")
    }
  }

  async clearRowKc() {
    this.bangKeDtlKcCreate = {}
  }

  async editRowKc(i: number) {
    const bangKeDtlKc = cloneDeep(this.formData.value.bangKeDtlKc);
    bangKeDtlKc.forEach(s => s.isEdit = false);
    bangKeDtlKc[i].isEdit = true;
    Object.assign(this.bangKeDtlKcClone, this.formData.value.bangKeDtlKc[i]);
    this.formData.patchValue({ bangKeDtlKc });
  }

  async deleteRowKc(i: number) {
    const bangKeDtlKc = cloneDeep(this.formData.value.bangKeDtlKc);
    bangKeDtlKc.splice(i, 1);
    this.formData.patchValue({ bangKeDtlKc });
    this.tinhTong();
  }

  async saveRowKc(i: number) {
    const bangKeDtlKc = cloneDeep(this.formData.value.bangKeDtlKc);
    bangKeDtlKc[i].isEdit = false;
    this.formData.patchValue({ bangKeDtlKc });
    this.tinhTong();
  }

  async cancelRowKc(i: number) {
    const bangKeDtlKc = cloneDeep(this.formData.value.bangKeDtlKc);
    Object.assign(bangKeDtlKc[i], this.bangKeDtlKcClone);
    bangKeDtlKc[i].isEdit = false;
    this.formData.patchValue({ bangKeDtlKc });
  }
  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsQdGnv,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soBbQd', 'ngayKy', 'tenVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.spinner.show();
        let dataRes = await this.quyetDinhGiaoNvCuuTroService.getDetail(data.id)
        this.formData.patchValue({
          // soQdGiaoNvXh: dataRes.data.soQd,
          // idQdGiaoNvXh: dataRes.data.id,
          // ngayQdGiaoNvXh: dataRes.data.ngayKy,
          // bangKeDtl: this.formData.value.bangKeDtl
          soQdGiaoNvXh: dataRes.data.soBbQd,
          idQdGiaoNvXh: dataRes.data.id,
          ngayQdGiaoNvXh: dataRes.data.ngayKy,
          // bangKeDtl: this.formData.value.bangKeDtl
        });
        // let dataChiCuc=dataChiCuc = dataRes.data.noiDungCuuTro.filter(item => item.maDviChiCuc == this.userInfo.MA_DVI);
        let dataChiCuc = [];
        if (dataRes.data.noiDungCuuTro) {
          dataRes.data.noiDungCuuTro.forEach(s => {
            s.maDiemKho = s.maDvi.length >= 10 ? s.maDvi.substring(0, 10) : null;
            s.maNhaKho = s.maDvi.length >= 12 ? s.maDvi.substring(0, 12) : null;
            s.maNganKho = s.maDvi.length >= 14 ? s.maDvi.substring(0, 14) : null;
            s.maLoKho = s.maDvi.length >= 16 ? s.maDvi.substring(0, 16) : null;
          });
          dataChiCuc = dataRes.data.noiDungCuuTro.filter(item => item.maDvi && item.maDvi.slice(0, 8) == this.userInfo.MA_DVI);
        } else if (dataRes.data.dataDtl) {
          dataRes.data.dataDtl.forEach(s => {
            s.maDiemKho = s.maDvi.length >= 10 ? s.maDvi.substring(0, 10) : null;
            s.maNhaKho = s.maDvi.length >= 12 ? s.maDvi.substring(0, 12) : null;
            s.maNganKho = s.maDvi.length >= 14 ? s.maDvi.substring(0, 14) : null;
            s.maLoKho = s.maDvi.length >= 16 ? s.maDvi.substring(0, 16) : null;
          });
          dataChiCuc = dataRes.data.dataDtl.filter(item => item.maDvi && item.maDvi.slice(0, 8) == this.userInfo.MA_DVI);
        }
        if (dataChiCuc) {
          this.dsDiaDiem = dataChiCuc;
        }
        this.clearDataCan();
        await this.spinner.hide();
      }
    });
  };

  async openDialogDdiem() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsDiaDiem,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
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
          maKho: data.maLoKho ? data.maLoKho : data.maNganKho,
          tenKho: data.tenLoKho ? data.tenLoKho : data.tenNganKho,
          // bangKeDtl: this.formData.value.bangKeDtl
        })
        let body = {
          // trangThai: STATUS.DA_DUYET_LDCC,
          trangThai: STATUS.DU_THAO,
          type: this.loaiXuat,
          loaiVthh: this.loaiVthh,
        }
        let res = await this.phieuXuatKhoService.search(body)
        const list = res.data.content;
        this.dsPhieuXuatKho = list.filter(item => (item.maLoKho ? item.maLoKho === data.maLoKho && item.maNganKho === data.maNganKho : item.maNganKho === data.maNganKho));

        let body1 = {
          trangThai: "01",
          maDviCha: this.userInfo.MA_DVI
        };
        const res1 = await this.donViService.getAll(body1)
        const dataDk = res1.data;
        if (dataDk) {
          this.listDiaDiemKho = dataDk.filter(item => item.maDvi == data.maDiemKho);
          this.listDiaDiemKho.forEach(s => {
            this.formData.patchValue({
              diaDiemKho: s.diaChi,
            })
          })
        }
      }
    });
  }

  async openDialogPhieuXuatKho() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách phiếu kiểm nghiệm chất lượng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsPhieuXuatKho,
        dataHeader: ['Số phiếu xuất kho', 'Ngày xuất kho'],
        dataColumn: ['soPhieuXuatKho', 'ngayXuatKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          idPhieuXuatKho: data.id,
          soPhieuXuatKho: data.soPhieuXuatKho,
          ngayXuat: data.ngayXuatKho,
          nlqHoTen: data.nguoiGiaoHang,
          nlqCmnd: data.soCmt,
          nlqDonVi: data.ctyNguoiGh,
          nlqDiaChi: data.diaChi,
          thoiGianGiaoNhan: data.thoiGianGiaoNhan,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          donViTinh: data.donViTinh,
          // bangKeDtl: this.formData.value.bangKeDtl
        });
        this.clearDataCan();
      }
    });
  }

  async changeNam() {
    if (!this.flagInit) {
      this.formData.patchValue({
        soBangKe: this.formData.value.soBangKe.replace(/\/\d+/, `/${this.formData.value.nam}`),
        // bangKeDtl: this.formData.value.bangKeDtl
      })
    }
  }

  async tinhTong() {
    if (this.formData.value.phuongPhapCan === 'can_giam_dinh' && this.loaiVthh !== '02') {
      const dtl = cloneDeep(this.formData.value.bangKeDtl);
      const dltKc = cloneDeep(this.formData.value.bangKeDtlKc);
      const trongLuongMotBaoCaBi = this.formData.get("trongLuongMotBaoCaBi").value;
      this.tongSoBaoCan = dtl.reduce((prev, cur) => prev + cur.soBaoBi, 0);
      this.tongSoBaoKc = dltKc.reduce((prev, cur) => prev + cur.soLuong, 0);
      const tongTrongLuongCaBiCan = dtl.reduce((prev, cur) => prev + cur.trongLuongCaBi, 0);
      const tongTrongLuongCaBiKc = (this.tongSoBaoKc || 0) * (trongLuongMotBaoCaBi || 0);
      const tongTrongLuongBaoBi = this.formData.get('tongTrongLuongBaoBi').value || 0;
      const tongTrongLuongCaBi = tongTrongLuongCaBiCan + tongTrongLuongCaBiKc;
      const tongTrongLuongHang = tongTrongLuongCaBi - tongTrongLuongBaoBi;
      this.formData.patchValue({
        tongTrongLuongCaBiKc,
        tongSoLuongBaoBi: (this.tongSoBaoCan || 0) + (this.tongSoBaoKc || 0),
        tongTrongLuong: tongTrongLuongCaBi,
        tongTrongLuongHang,
      })
    }
    else {
      const dtl = cloneDeep(this.formData.value.bangKeDtl);
      if (this.loaiVthh == '02') {
        this.tongSl = dtl.reduce((prev, cur) => prev + cur.soLuong, 0);
      } else {
        const tongTrongLuongCaBi = dtl.reduce((prev, cur) => prev + cur.trongLuongCaBi, 0);
        const tongTrongLuongBaoBi = this.formData.value.tongTrongLuongBaoBi || 0;
        const tongTrongLuongHang = tongTrongLuongCaBi - tongTrongLuongBaoBi;
        this.formData.patchValue({
          tongTrongLuong: tongTrongLuongCaBi,
          // bangKeDtl: this.formData.value.bangKeDtl,
          tongTrongLuongHang,
        });
      }
    }
  }
  async trongLuongTruBi() {
    const tongTrongLuong = this.formData.value.tongTrongLuong || 0;
    const tongTrongLuongBaoBi = this.formData.value.tongTrongLuongBaoBi || 0;
    let tongTrongLuongHang = tongTrongLuong - tongTrongLuongBaoBi;
    this.formData.patchValue({
      tongTrongLuongHang: tongTrongLuongHang,
    });
  }

  convertTienTobangChu(tien: number, donVi?: string) {
    if (tien > 0) {
      let rs = convertTienTobangChuThapPhan(Number(tien.toFixed(1)));
      return rs.charAt(0).toUpperCase() + rs.slice(1) + (donVi ? " " + donVi : "");
    }
  }
  showAction() {
    return !this.isView
  }
  clearDataCan() {
    this.tongSl = null;
    this.tongSoBaoCan = null;
    this.tongSoBaoKc = null;
    this.tongTien = null;
    this.formData.get("bangKeDtl").setValue([]);
    this.formData.get("bangKeDtlKc").setValue([]);
    this.formData.get('tongTrongLuong').setValue(null);
    this.formData.get('tongTrongLuongBaoBi').setValue(null);
    this.formData.get('tongTrongLuongHang').setValue(null);
    this.formData.get('tongTrongLuongHangBc').setValue(null);

    this.formData.get('trongLuongMotBaoCaBi').setValue(null);
    this.formData.get('tongTrongLuongCaBiKc').setValue(null);
    this.formData.get('tongSoLuongBaoBi').setValue(null);
  }
}
