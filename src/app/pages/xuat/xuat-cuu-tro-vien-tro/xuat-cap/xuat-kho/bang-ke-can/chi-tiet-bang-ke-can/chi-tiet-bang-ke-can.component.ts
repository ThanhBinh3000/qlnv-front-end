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
  PhieuKiemNghiemChatLuongService
} from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuKiemNghiemChatLuong.service';
import { PhieuXuatKhoService } from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuXuatKho.service";
import { BangKeCanCtvtService } from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BangKeCanCtvt.service";
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import {
  QuyetDinhGiaoNvCuuTroService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-cap/QuyetDinhGiaoNvCuuTro.service";

@Component({
  selector: 'app-xc-chi-tiet-bang-ke-can',
  templateUrl: './chi-tiet-bang-ke-can.component.html',
  styleUrls: ['./chi-tiet-bang-ke-can.component.scss']
})
export class ChiTietBangKeCanComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
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
  dsQdGnv: any = [];
  dsPhieuXuatKho: any = [];
  dsDiaDiem: any = [];
  expandSetString = new Set<string>();
  phuongAnView = [];
  phuongAnRow: any = {};
  isVisible = false;
  listNoiDung = []
  listThanhTien: any;
  listSoLuong: any;
  flagInit: Boolean = true;
  listDiaDiemKho: any[] = [];
  templateName = "Bảng kê cân hàng";

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
        soBangKe: [''],
        idQdGiaoNvXh: ['', Validators.required],
        soQdGiaoNvXh: [''],
        ngayQdGiaoNvXh: [''],
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
        nlqHoTen: [''],
        nlqCmnd: [''],
        nlqDonVi: [''],
        nlqDiaChi: [''],
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

  async loadDsQdGnv() {
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.quyetDinhGiaoNvCuuTroService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dsQdGnv = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.bangKeCanCtvtService.getDetail(idInput)
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
      await this.tinhTong();
    } else {
      let id = await this.userService.getId('XH_CTVT_BANG_KE_HDR_SEQ')
      this.formData.patchValue({
        soBangKe: `${id}/${this.formData.value.nam}/BKCH-${this.userInfo.DON_VI?.tenVietTat}`,
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        type: "XUAT_CAP",
        thuKho: this.userInfo.TEN_DAY_DU,
        loaiVthh: this.loaiVthh,
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
    this.formData.disable()
    let body = this.formData.value;
    let res;
    if (body.id && body.id > 0) {
      res = await this.bangKeCanCtvtService.update(body);
    } else {
      res = await this.bangKeCanCtvtService.create(body);
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

  async addRow() {
    if (Object.keys(this.bangKeDtlCreate).length !== 0) {
      this.formData.value.bangKeDtl = [...this.formData.value.bangKeDtl, this.bangKeDtlCreate];
      this.clearRow();
      this.tinhTong();
      console.log(this.formData.value, '91991919')
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
        dataColumn: ['soQd', 'ngayKy', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.spinner.show();
        let dataRes = await this.quyetDinhGiaoNvCuuTroService.getDetail(data.id)
        this.formData.patchValue({
          soQdGiaoNvXh: dataRes.data.soQd,
          idQdGiaoNvXh: dataRes.data.id,
          ngayQdGiaoNvXh: dataRes.data.ngayKy,
          bangKeDtl: this.formData.value.bangKeDtl
        });
        let dataChiCuc = dataRes.data.noiDungCuuTro.filter(item => item.maDviChiCuc == this.userInfo.MA_DVI);
        if (dataChiCuc) {
          this.dsDiaDiem = dataChiCuc;
        }
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
          maKho: data.maLoKho ? data.maLoKho : data.maNganKho,
          tenKho: data.tenLoKho ? data.tenLoKho : data.tenNganKho,
          bangKeDtl: this.formData.value.bangKeDtl
        })
        let body = {
          trangThai: STATUS.DA_DUYET_LDCC,
          type: "XUAT_CAP",
          loaiVthh: this.loaiVthh,
        }
        let res = await this.phieuXuatKhoService.search(body)
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
