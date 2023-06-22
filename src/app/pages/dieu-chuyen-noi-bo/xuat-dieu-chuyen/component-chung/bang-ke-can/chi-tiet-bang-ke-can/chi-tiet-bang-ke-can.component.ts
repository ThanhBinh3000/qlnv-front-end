import { PhieuXuatKhoDieuChuyenService } from './../../services/dcnb-xuat-kho.service';
import { BangKeCanHangDieuChuyenService } from './../../services/dcnb-bang-ke-can-hang.service';
import { QuyetDinhDieuChuyenCucService } from './../../../../../../services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
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
import { convertTienTobangChu } from 'src/app/shared/commonFunction';


@Component({
  selector: 'app-xdcnb-chi-tiet-bang-ke-can',
  templateUrl: './chi-tiet-bang-ke-can.component.html',
  styleUrls: ['./chi-tiet-bang-ke-can.component.scss']
})
export class ChiTietBangKeCanDieuChuyenComponent extends Base2Component implements OnInit {
  @Input() isVatTu: boolean;
  @Input() loaiDc: string;
  @Input() thayDoiThuKho: boolean;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  loaiVthh: string;
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
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
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
  listLoaiHinhNhapXuat: any[] = [];
  listKieuNhapXuat: any[] = [];
  datePipe = new DatePipe('en-US');
  tongSl = 0;
  tongTien = 0;
  diaDiemNhapKho: any[] = [];
  bangKeDtlCreate: any = {};
  bangKeDtlClone: any = {};
  dsDonVi: any = [];
  dsQuyetDinhDC: any = [];
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
  LIST_TRANG_THAI: { [key: string]: string } = {
    [this.STATUS.DU_THAO]: "Dự thảo",
    [this.STATUS.CHO_DUYET_LDCC]: "Chờ duyệt LĐ Chi Cục",
    [this.STATUS.TU_CHOI_LDCC]: "Từ chối LĐ Chi Cục",
    [this.STATUS.DA_DUYET_LDCC]: "Đã duyệt LĐ Chi Cục"
  }

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
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bangKeCanHangDieuChuyenService: BangKeCanHangDieuChuyenService,
    private phieuXuatKhoDieuChuyenService: PhieuXuatKhoDieuChuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanHangDieuChuyenService);
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
        soBangKe: [''],
        qdinhDccId: ['', Validators.required],
        soQdinhDcc: [''],
        ngayKyQdDcc: [''],
        maDiemKho: ['', Validators.required],
        maNhaKho: [''],
        maNganKho: [''],
        maLoKho: [''],
        maKho: [''],
        idPhieuXuatKho: ['', Validators.required],
        soPhieuXuatKho: [''],
        ngayXuat: [''],
        diaDiemKho: ['', Validators.required],
        loaiVthh: [''],
        cloaiVthh: [''],
        donViTinh: [''],
        moTaHangHoa: [''],
        tenNguoiGiaoHang: [''],
        cccd: [''],
        donViNguoiGiaoHang: [''],
        diaChiDonViNguoiGiaoHang: [''],
        thoiGianGiaoNhan: [''],
        tongTrongLuong: [0],
        tongTrongLuongBaoBi: [0],
        tongTrongLuongHang: [0],
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
        tenDiemKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        tenNganKho: ['', [Validators.required]],
        tenLoKho: [''],
        nguoiPduyet: [''],
        nguoiGduyet: [''],
        bangKeDtl: [new Array()]
      }
    );
    this.userInfo = this.userService.getUserLogin();
    this.maDeXuat = '/' + this.userInfo.MA_TCKT;

    // this.setTitle();
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.loadDsVthh(),
        this.loadDsDonVi(),
        // this.loadDSQdDc(),
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
      this.listLoaiHinhNhapXuat = res.data.filter(item => item.phanLoai == 'XUAT_CAP');
    }
  }

  async loadDsKieuNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKieuNhapXuat = res.data.filter(item => item.apDung == 'XUAT_CAP');

    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
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

  async loadDSQdDc() {
    try {
      this.spinner.show()
      let body = {
        trangThai: STATUS.BAN_HANH,
        isVatTu: this.isVatTu,
        loaiDc: this.loaiDc,
        thayDoiThuKho: this.thayDoiThuKho
      }
      let res = await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.dsQuyetDinhDC = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (error) {
      console.log("e", error);
      this.notification.error(MESSAGE.ERROR, error);
    }
    finally {
      this.spinner.hide()
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.bangKeCanHangDieuChuyenService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
      this.tinhTong();
    } else {
      let id = await this.userService.getId('XH_CTVT_BANG_KE_HDR_SEQ');
      this.formData.patchValue({
        soBangKe: `${id}/${this.formData.value.nam}/BKCH-${this.userInfo.DON_VI?.tenVietTat}`,
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        thuKho: this.userInfo.TEN_DAY_DU,
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

  async save() {
    this.formData.disable()
    let body = this.formData.value;
    let res;
    if (body.id && body.id > 0) {
      res = await this.bangKeCanHangDieuChuyenService.update(body);
    } else {
      res = await this.bangKeCanHangDieuChuyenService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.formData.get('id').value) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.formData.enable();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.formData.enable();
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

  async addRow() {
    if (Object.keys(this.bangKeDtlCreate).length !== 0) {
      this.formData.value.bangKeDtl = [...this.formData.value.bangKeDtl, this.bangKeDtlCreate];
      this.clearRow();
      this.tinhTong();
    }
  }

  async clearRow() {
    this.bangKeDtlCreate = {}
  }

  async editRow(i: number) {
    this.formData.value.bangKeDtl.forEach(s => s.isEdit = false);
    this.formData.value.bangKeDtl[i].isEdit = true;
    Object.assign(this.bangKeDtlClone, this.formData.value.bangKeDtl[i]);
  }

  async deleteRow(i: number) {
    this.formData.value.bangKeDtl.splice(i, 1);
    this.tinhTong();
  }

  async saveRow(i: number) {
    this.formData.value.bangKeDtl[i].isEdit = false;
    this.tinhTong();
  }

  async cancelRow(i: number) {
    Object.assign(this.formData.value.bangKeDtl[i], this.bangKeDtlClone);
    this.formData.value.bangKeDtl[i].isEdit = false;
  }

  async openDialogSoQd() {
    await this.loadDSQdDc()
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định điều chuyển hàng hóa',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsQuyetDinhDC,
        dataHeader: ['Số quyết định', 'Ngày ký quyết định'],
        dataColumn: ['soQdinh', 'ngayKyQdinh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        try {
          this.spinner.show();
          this.formData.patchValue({
            soQdinhDcc: data.soQdinh,
            qdinhDccId: data.id,
            ngayKyQdDcc: data.ngayKyQdinh,
            // bangKeDtl: this.formData.value.bangKeDtl
            maLoKho: '',
            tenLoKho: '',
            maNganKho: '',
            tenNganKho: '',
            maNhaKho: '',
            tenNhaKho: '',
            maDiemKho: '',
            tenDiemKho: '',
            loaiVthh: '',
            tenLoaiVthh: '',
            cloaiVthh: '',
            tenCloaiVthh: '',
            tenNguoiGiaoHang: '',

            soPhieuXuatKho: '',
            phieuXuatKhoId: '',
            cccd: '',
            donViNguoiGiaoHang: '',
            diaChiDonViNguoiGiaoHang: '',
            thoiGianGiaoNhan: '',
            tongTrongLuong: 0,
            tongTrongLuongBaoBi: 0,
            tongTrongLuongHang: 0,
          });
          const body = {
            qdinhDccId: data.id
          }
          let dataRes = await this.phieuXuatKhoDieuChuyenService.search(body);
          if (dataRes.msg == MESSAGE.SUCCESS) {

            this.dsDiaDiem = [];
            let dataChiCuc = [];
            if (Array.isArray(data?.danhSachQuyetDinh)) {
              data.danhSachQuyetDinh.forEach(element => {
                if (Array.isArray(element.danhSachKeHoach)) {
                  element.danhSachKeHoach.forEach(item => {
                    if (item.maChiCucNhan == this.userInfo.MA_DVI && dataChiCuc.findIndex(f => f.maChiCucNhan == item.maChiCucNhan) < 0 && dataChiCuc.findIndex(f => f.maLoKho == item.maLoKho) < 0) {
                      dataChiCuc.push(item)
                    }
                  });
                }
              });
            }
            if (dataChiCuc) {
              this.dsDiaDiem = cloneDeep(dataChiCuc);
            }
          } else {
            this.notification.error(MESSAGE.ERROR, dataRes.msg)
          }
        } catch (error) {
          console.log("e", error);
          this.notification.error(MESSAGE.ERROR, error)
        } finally {
          this.spinner.hide();

        }
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
          maKho: data.maLoKho ? data.maLoKho : data.maNganKho,
          tenKho: data.tenLoKho ? data.tenLoKho : data.tenNganKho,
          bangKeDtl: this.formData.value.bangKeDtl
        })
        let body = {
          trangThai: STATUS.DA_DUYET_LDCC,
          loaiDc: this.loaiDc,
          isVatTu: this.isVatTu,

        }
        let res = await this.phieuXuatKhoDieuChuyenService.search(body)
        const list = res.data.content;
        this.dsPhieuXuatKho = list.filter(item => (item.maDiemKho == data.maDiemKho));
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
        console.log(JSON.stringify(data))
        this.formData.patchValue({
          idPhieuXuatKho: data.id,
          soPhieuXuatKho: data.soPhieuXuatKho,
          ngayXuat: data.ngayXuatKho,
          nlqHoTen: data.nguoiGiaoHang,
          nlqCmnd: data.soCmt,
          nlqDonVi: data.ctyNguoiGh,
          nlqDiaChi: data.diaChi,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          moTaHangHoa: data.moTaHangHoa,
          donViTinh: data.donViTinh,
          bangKeDtl: this.formData.value.bangKeDtl
        });
        this.formData.patchValue({ donViTinh: this.listHangHoaAll.find(s => s.ma == data.loaiVthh)?.maDviTinh })
      }
    });
  }

  async changeNam() {
    if (!this.flagInit) {
      this.formData.patchValue({
        soBangKe: this.formData.value.soBangKe.replace(/\/\d+/, `/${this.formData.value.nam}`),
        bangKeDtl: this.formData.value.bangKeDtl
      })
    }
  }

  async tinhTong() {
    let dtl = cloneDeep(this.formData.value.bangKeDtl);
    let tongTrongLuongCaBi = dtl.reduce((prev, cur) => prev + cur.trongLuongCaBi, 0);

    this.formData.patchValue({
      tongTrongLuong: tongTrongLuongCaBi,
      bangKeDtl: this.formData.value.bangKeDtl
    });
  }
  async trongLuongTruBi() {
    let data = cloneDeep(this.formData.value);
    if (data.tongTrongLuongBaoBi) {
      let tongTrongLuongHang = data.tongTrongLuong - data.tongTrongLuongBaoBi;
      this.formData.patchValue({
        tongTrongLuongHang: tongTrongLuongHang,
        tongTrongLuongBaoBi: data.tongTrongLuongBaoBi,
      });
    }
  }

  convertTienTobangChu(tien: number) {
    let rs = convertTienTobangChu(tien);
    return rs.charAt(0).toUpperCase() + rs.slice(1);
  }
}
