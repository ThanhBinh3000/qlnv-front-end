import { MangLuoiKhoService } from 'src/app/services/qlnv-kho/mangLuoiKho.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FileDinhKem } from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import { UserLogin } from "src/app/models/userlogin";
import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import { DanhMucService } from "src/app/services/danhmuc.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import * as dayjs from "dayjs";
import { FormGroup, Validators } from "@angular/forms";
import { STATUS } from "src/app/constants/status";
import { MESSAGE } from "src/app/constants/message";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { Base2Component } from "src/app/components/base2/base2.component";
import { v4 as uuidv4 } from "uuid";
import { chain, cloneDeep, includes, uniqBy, groupBy } from 'lodash';
import {
  QuyetDinhGiaoNvCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service";
import { NzTreeNodeOptions } from "ng-zorro-antd/core/tree";
import { DANH_MUC_LEVEL } from "src/app/pages/luu-kho/luu-kho.constant";
import { NzTreeSelectComponent } from "ng-zorro-antd/tree-select";
import { QuanLyHangTrongKhoService } from "src/app/services/quanLyHangTrongKho.service";
import { PREVIEW } from 'src/app/constants/fileType';
import { LOAI_HANG_DTQG, TEN_LOAI_VTHH } from 'src/app/constants/config';
import { AMOUNT_NO_DECIMAL, AMOUNT_ONE_DECIMAL, AMOUNT_TWO_DECIMAL } from 'src/app/Utility/utils';

@Component({
  selector: 'app-chi-tiet-quyet-dinh-gnv',
  templateUrl: './chi-tiet-quyet-dinh-gnv.component.html',
  styleUrls: ['./chi-tiet-quyet-dinh-gnv.component.scss']
})
export class ChiTietQuyetDinhGnvComponent extends Base2Component implements OnInit {
  @ViewChild('NzTreeSelectComponent', { static: false }) nzTreeSelectComponent!: NzTreeSelectComponent;
  @Input() isView: boolean;
  @Input() loaiXuat: any;
  @Input() isViewOnModal: boolean;
  MESSAGE = MESSAGE;
  formDataDtl: FormGroup;
  modalChiTiet: boolean = false;
  listDiaDanh: any[] = [];
  listDonVi: any[] = [];
  listVatTuHangHoa: any[] = [];
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiaDiemKho: any[] = [];
  defaultSelectedKeys: any;
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  userInfo: UserLogin;
  listLoaiHinhNhapXuat: any[] = [];
  datePipe = new DatePipe('en-US');
  isQuyetDinh: boolean = false;
  phuongAnView: any;
  expandSetString = new Set<string>();
  listKieuNhapXuat: any;
  maHauTo: any;
  selectedNode: any;
  templateName: string = "Quyết định giao nhiệm vụ xuất cứu trợ, viện trợ";
  amount1 = { ...AMOUNT_TWO_DECIMAL, align: "left" }
  amount = { ...AMOUNT_NO_DECIMAL, align: "left", min: 0, max: 100 };
  chuyenXuatCap: boolean = true;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService,
    private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvCuuTroService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      nam: [dayjs().get("year"), [Validators.required]],
      soBbQd: [],
      ngayKy: [dayjs().format("YYYY-MM-DD"), [Validators.required]],
      idQdPd: [],
      soQdPd: [, [Validators.required]],
      loaiVthh: [],
      cloaiVthh: [],
      tenVthh: [, [Validators.required]],
      soLuong: [],
      thoiGianGiaoNhan: [, [Validators.required]],
      trichYeu: [],
      trangThai: [],
      lyDoTuChoi: [],
      trangThaiXh: [],
      soBbHaoDoi: [],
      soBbTinhKho: [],
      tongSoLuong: [],
      thanhTien: [],
      type: [],
      ngayGduyet: [],
      nguoiGduyetId: [],
      ngayPduyet: [],
      nguoiPduyetId: [],
      loaiNhapXuat: [],
      kieuNhapXuat: [],
      mucDichXuat: [, [Validators.required]],
      phanLoai: [],
      tenDvi: [, [Validators.required]],
      tenDviCha: [, [Validators.required]],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      tenTrangThai: [],
      tenTrangThaiXh: [],
      noiDungCuuTro: [],
      dataDtl: [new Array(), [Validators.required, Validators.minLength(1)]],
      fileDinhKem: [new Array<FileDinhKem>()],
      canCu: [new Array<FileDinhKem>()],
      paXuatGaoChuyenXc: [],
      ngayTapKet: [],
      ngayGiaoHang: []
    }
    );

    this.formDataDtl = this.fb.group(
      {
        idVirtual: [''],
        id: [],
        idDx: [],
        idQdPdDtl: [],
        idDonViNhan: [],
        soLuongDx: [],
        soLuongGiao: [],
        loaiNhapXuat: [],
        kieuNhapXuat: [],
        mucDichXuat: [],
        phanLoai: [],
        noiDungDx: [],
        loaiVthh: [],
        cloaiVthh: [],
        maDvi: [, [Validators.required]],
        soLuong: [],
        tonKhoCloaiVthh: [],
        tonKhoDvi: [],
        tonKhoLoaiVthh: [],
        donViTinh: [],
        trangThai: [],
        mapVthh: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        mapDmucDvi: [],
        tenDvi: [],
        tenCuc: [],
        tenChiCuc: [],
        tenDiemKho: [],
        tenNhaKho: [],
        tenNganKho: [],
        tenLoKho: [],
        edit: [],
        mId: [],
        slGaoThuHoiSauXayXat: [0],
        slThocDeXayXat: [0],
        tyLeThuHoiSauXayXat: [0, [Validators.min(0), Validators.max(100)]],
        soLuongXc: [0],
        slConLaiGiao: [0],
        namNhap: []
        // 2 trường slThocDeXayXatGiaoCuc và slThocDeXayXatGiaoChiCuc không dùng nữa và thay thế bằng các trường tương ứng soLuongDx và soLuongGiao đề đồng bộ dữ liệu
        // slThocDeXayXatGiaoCuc: [0],
        // slThocDeXayXatGiaoChiCuc: [0]
      });

    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.formDataDtl.get("tyLeThuHoiSauXayXat").valueChanges.subscribe((value) => {
      if (this.formData.value.type === "XC") {
        const slThocDeXayXat = this.formDataDtl.value.slThocDeXayXat || 0;
        const slGaoThuHoiSauXayXat = value ? slThocDeXayXat * value / 100 : 0;
        this.formDataDtl.get('slGaoThuHoiSauXayXat').setValue(slGaoThuHoiSauXayXat, { emitEvent: false })
      }
    })
    this.formDataDtl.get("slThocDeXayXat").valueChanges.subscribe((value) => {
      if (this.formData.value.type === "XC") {
        const tyLeThuHoiSauXayXat = this.formDataDtl.value.tyLeThuHoiSauXayXat || 0;
        const slGaoThuHoiSauXayXat = (value || 0) * tyLeThuHoiSauXayXat / 100;
        this.formDataDtl.get('slGaoThuHoiSauXayXat').setValue(slGaoThuHoiSauXayXat, { emitEvent: false });
        this.formDataDtl.get('soLuong').setValue(value, { emitEvent: false })
      }
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.formData.patchValue({ type: this.loaiXuat });
      this.maHauTo = '/QĐGNV-' + this.userInfo.DON_VI.tenVietTat;
      await Promise.all([
        // this.loadDsDonVi(),
        this.loadDsDiaDanh(),
        this.loadDsVthh(),
        this.loadDetail()
      ]);
      // await this.loadDetail();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }
  bidingDataInFormGroupAndIgnore(formGroup: FormGroup, dataBinding: any, ignoreField: Array<string>) {
    if (dataBinding) {
      for (const name in dataBinding) {
        if (formGroup.controls.hasOwnProperty(name) && !ignoreField.includes(name)) {
          formGroup.controls[name].setValue(dataBinding[name]);
        }
      }
    }
  }
  async loadDetail() {
    if (this.idSelected > 0) {
      await this.quyetDinhGiaoNvCuuTroService.getDetail(this.idSelected)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data.soBbQd) {
              this.maHauTo = '/' + res.data.soBbQd?.split("/")[1];
              res.data.soBbQd = res.data.soBbQd?.split("/")[0];
            }
            // res.data.dataDtl.forEach(s => s.idVirtual = uuidv4());
            res.data.dataDtl.forEach(s => s.mId = uuidv4());
            this.formData.patchValue({ ...res.data, trangThaiXh: res.data.trangThaiXh ? res.data.trangThaiXh : STATUS.CHUA_THUC_HIEN });
            await this.getChiTietQuyetDinhXuatCap();
            await this.buildTableView();
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        trangThai: STATUS.DU_THAO,
        tenTrangThai: 'Dự thảo',
        tenDvi: this.userInfo.TEN_PHONG_BAN,
        tenDviCha: this.userInfo.TEN_DVI,
        maDvi: this.userInfo.MA_DVI
      });
    }
  }
  async getChiTietQuyetDinhXuatCap() {
    const idQdPd = this.formData.value.idQdPd;
    if (idQdPd) {
      const res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDetail(idQdPd);
      if (res.msg === MESSAGE.SUCCESS) {
        this.formData.patchValue({ paXuatGaoChuyenXc: res.data.paXuatGaoChuyenXc })
      }
    }
  }
  async loadDsDiaDanh() {
    let body = {
      capDiaDanh: 1
    };
    let res = await this.danhMucService.loadDsDiaDanhByCap(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDiaDanh = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  // async loadDsDonVi() {
  //   let body = {
  //     trangThai: "01",
  //     maDviCha: this.userInfo.MA_DVI,
  //     // maDviCha: '01010201',
  //     type: "DV"
  //   };
  //   let res = await this.donViService.getDonViTheoMaCha(body);
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     this.listDonVi = res.data;
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }
  async loadDsDonViTheoNamNhap(namNhap: number) {
    try {
      await this.spinner.show();
      let loaiVthh = this.formData.value.type === "XC" && this.formData.value.paXuatGaoChuyenXc ? LOAI_HANG_DTQG.THOC : this.formDataDtl.value.loaiVthh;
      let cloaiVthh = this.formDataDtl.value.cloaiVthh;
      if (this.formDataDtl.value.loaiVthh.startsWith("01") || this.formDataDtl.value.loaiVthh.startsWith("04")) {
        cloaiVthh = undefined;
      }
      this.listDonVi = [];
      let res = await this.mangLuoiKhoService.getDetailByMa({ maDvi: this.userInfo.MA_DVI });
      if (res.msg == MESSAGE.SUCCESS) {
        Array.isArray(res.data.object.ctietHhTrongKho) && res.data.object.ctietHhTrongKho.filter(f => loaiVthh && loaiVthh === f.loaiVthh && (cloaiVthh && cloaiVthh === f.cloaiVthh || !cloaiVthh) && f.maDonVi?.match("^" + this.userInfo.MA_DVI + ".*") && f.namNhap === namNhap && f.slHienThoi > 0).forEach(element => {
          const findIndex = this.listDonVi.findIndex(f => element.maDonVi && element.maDonVi.match("^" + f.maDvi + ".*"))
          if (findIndex >= 0) {
            this.listDonVi[findIndex].tonKhoDvi += element.slHienThoi
          } else {
            this.listDonVi.push({ ...element, maDvi: element.maDonVi.length >= 8 ? element.maDonVi.slice(0, 8) : "", tenDvi: element.tenChiCuc, tonKhoDvi: element.slHienThoi })
          }
        });
        const tenHang = this.formData.value.loaiVthh !== LOAI_HANG_DTQG.VAT_TU ? this.formDataDtl.value.tenLoaiVthh : this.formDataDtl.value.tenCloaiVthh ? this.formDataDtl.value.tenLoaiVthh + " - " + this.formDataDtl.value.tenCloaiVthh : this.formDataDtl.value.tenLoaiVthh;
        this.listDonVi.forEach(s => {
          s.disable = this.formData.value.dataDtl.some(s1 => s1.maDvi === s.maDvi && s1.noiDungDx === this.formDataDtl.value.noiDungDx && s1.idDx === this.formDataDtl.value.idDx && s1.tenHang === tenHang && s1.namNhap === this.formDataDtl.value.namNhap) && !(s.maDvi === this.formDataDtl.value.maDvi && this.formDataDtl.value.edit);
        });

      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (error) {
      console.log("error", error)
    } finally {
      await this.spinner.hide()
    }
  }

  async loadDsDiemKho(maDvi: any, loaiVthh: string, cloaiVthh: string, namNhap: number) {
    if (loaiVthh.startsWith("01") || loaiVthh.startsWith("04")) {
      cloaiVthh = undefined;
    }
    if (this.formData.value.type === "XC" && this.formData.value.paXuatGaoChuyenXc) {
      loaiVthh = LOAI_HANG_DTQG.THOC
    }
    let body = {
      maDvi: this.userInfo.MA_DVI,
      loaiVthh: loaiVthh,
      cloaiVthh: cloaiVthh,
      namNhap: namNhap
    };
    let res = await this.donViService.getDonViHangTree(body);
    // const body = {
    //   maDvi: this.userInfo.MA_DVI,
    //   listCloaiVthh: [cloaiVthh]
    // }
    // const res = await this.mangLuoiKhoService.dsNganLoKhoTheoCloaiVthh(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDiaDiemKho = res.data ? cloneDeep([res.data]) : [];
      this.listDiaDiemKho[0].expanded = true;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.loadDanhMucHangHoaAsync();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVatTuHangHoa = res.data;
      let listLuongThuc = this.listVatTuHangHoa.find(s => s.key == '01');
      let filterLuongThuc = cloneDeep(listLuongThuc.children.filter(s => s.key == '0101' || s.key == '0102'));
      let listVatTu = cloneDeep(this.listVatTuHangHoa.find(s => s.key == '02'));
      let listMuoi = cloneDeep(this.listVatTuHangHoa.find(s => s.key == '04'));
      this.listLoaiHangHoa = [...filterLuongThuc, ...listVatTu.children, ...listMuoi.children];
    }
  }

  async changeLoaiVthh($event) {
    try {
      await this.spinner.show();
      if ($event) {
        this.listChungLoaiHangHoa = [];
        let filter = cloneDeep(this.listLoaiHangHoa.find(s => s.key == $event));
        if (filter.children) {
          this.listChungLoaiHangHoa = filter.children;
        }
        let item = this.listLoaiHangHoa.find(s => s.ma === $event);
        this.formDataDtl.patchValue({
          tenLoaiVthh: item.ten
        })
      }
      if (this.formDataDtl.value.cloaiVthh) {
        let item = this.listChungLoaiHangHoa.find(s => s.ma === this.formDataDtl.value.cloaiVthh);
        if (!item) {
          this.formDataDtl.patchValue({
            cloaiVthh: '',
            tenCloaiVthh: ''
          });
        }
      }
    } catch (e) {
      console.log(e)
    } finally {
      await this.spinner.hide();
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }
  checkHoanTatPhanBo() {
    const { soLuong: tongSoLuong, tenVthh } = this.formData.value;
    const dataDtlFilterDonVi = this.formData.value.dataDtl.filter(f => f.maDvi && f.maDvi.startsWith(this.userInfo.MA_DVI))
    let dataDtl = [];
    if (this.formData.value.type === 'XC' || tenVthh !== "Vật tư thiết bị") {
      dataDtl = dataDtlFilterDonVi.map(f => ({ ...f, noiDungDxTenChiCuc: `${f.noiDungDx}-${f.loaiVthh}-${f.tenChiCuc}` }));
    } else {
      dataDtl = dataDtlFilterDonVi.map(f => ({ ...f, noiDungDxTenChiCuc: `${f.noiDungDx}-${f.cloaiVthh ? f.cloaiVthh : f.loaiVthh}-${f.tenChiCuc}` }));
    }

    const tongSoLuongPb = dataDtl.reduce((sum, cur) => {
      if (this.formData.value.type === 'XC' && this.formData.value.paXuatGaoChuyenXc) {
        sum += cur.slGaoThuHoiSauXayXat ? cur.slGaoThuHoiSauXayXat : 0
      } else {
        sum += cur.soLuong ? cur.soLuong : 0;
      }
      return sum;
    }, 0);
    const tongSoLuongGiao = uniqBy(dataDtl, 'noiDungDxTenChiCuc').reduce((sum, cur) => sum += cur.soLuongGiao ? cur.soLuongGiao : 0, 0);
    if (this.userService.isCuc()) {
      if (tongSoLuong === tongSoLuongGiao || this.formData.value.type === 'XC' && !this.formData.value.paXuatGaoChuyenXc) {
        return true;
      }
      this.notification.error(MESSAGE.ERROR, "Bạn chưa hoàn thành phân bổ.");
      return;
    } else if (this.userService.isChiCuc()) {
      if (tongSoLuongGiao === tongSoLuongPb) {
        return true
      }
      this.notification.error(MESSAGE.ERROR, "Bạn chưa hoàn thành phân bổ.");
      return;
    } else {
      this.notification.error(MESSAGE.ERROR, "Bạn không có nhiệm vụ phân bổ.");
      return;
    }
  }
  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    this.formData.controls.soBbQd.setValidators([Validators.required]);
    // if (!this.checkHoanTatPhanBo()) return;
    let body = {
      ...this.formData.value,
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null
    }
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    // if (!this.checkHoanTatPhanBo()) return;
    if (trangThai === STATUS.DA_DUYET_LDC) {
      this.formData.get("soQdPd").setValidators([Validators.required]);
    } else {
      this.formData.get("soQdPd").clearValidators();
    }
    let body = { ...this.formData.value, soBbQd: this.formData.value.soBbQd + this.maHauTo }
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  async updateProcess(trangThai: STATUS, tenTrangThai: string) {
    this.formData.value.dataDtl.forEach(s => {
      if (s.maDvi.match("^" + this.userInfo.MA_DVI + ".*")) {
        s.trangThai = trangThai;
        s.tenTrangThai = tenTrangThai;
      }
    });
    // if (trangThai === STATUS.DA_HOAN_THANH && this.formData.value.dataDtl.some(f => !f.tenNganKho)) {
    //   return this.notification.error(MESSAGE.ERROR, "Bạn chưa hoàn thành phân bổ.")
    // }
    if (this.formData.value.trangThai === STATUS.BAN_HANH && this.formData.value.dataDtl.filter(s => s.maDvi.match("^" + this.userInfo.MA_DVI + ".*")).some(f => !f.tenNganKho)) {
      return this.notification.error(MESSAGE.ERROR, "Bạn chưa hoàn thành phân bổ.")
    }
    if (trangThai === STATUS.DA_HOAN_THANH) {
      if (!this.checkHoanTatPhanBo()) return;
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: "Bạn có muốn hoàn thành phân bổ?.",
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 350,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let body = {
              ...this.formData.value,
              soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null
            }
            const data = await this.createUpdate(body, null, true);
            if (data) {
              this.formData.patchValue({ trangThaiXh: trangThai });
              this.notification.success(MESSAGE.SUCCESS, 'Hoàn thành phân bổ thành công.')
            }
            await this.buildTableView();
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        },
      });
    } else {
      let body = {
        ...this.formData.value,
        soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null
      }
      const data = await this.createUpdate(body, null, true);
      if (data) {
        this.formData.patchValue({ trangThaiXh: trangThai });
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS)
      }
      await this.buildTableView();
    }
  }


  async openDialogQdPd() {
    try {
      await this.spinner.show();
      let res;
      if (this.formData.value.type == 'XC') {
        res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDanhSach({
          trangThai: STATUS.BAN_HANH,
          types: ["XC"],
          paggingReq: {
            limit: this.globals.prop.MAX_INTERGER,
            page: 0
          },
        });
      } else {
        res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDanhSach({
          trangThai: STATUS.BAN_HANH,
          types: ['TH', 'TTr'],
          paggingReq: {
            limit: this.globals.prop.MAX_INTERGER,
            page: 0
          },
        });
      }

      if (res.msg == MESSAGE.SUCCESS) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định phê duyệt cứu trợ, viện trợ',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số quyết định', 'Ngày phê duyệt', 'Mục đích xuất'],
            dataColumn: ['soBbQd', 'ngayPduyet', 'mucDichXuat']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            let res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDetail(data.id);
            let detail = res.data;
            let quyetDinhPdDtl = [];
            if (this.formData.value.type !== 'XC') {
              quyetDinhPdDtl = cloneDeep(detail.quyetDinhPdDtl).filter(f => !f.xuatCap);
              quyetDinhPdDtl.forEach(s => {
                s.idQdPdDtl = s.id;
                s.soLuongDx = s.soLuong;
                s.soLuong = 0;
                s.mId = uuidv4();
                delete s.id;
              });
            }
            else if (this.formData.value.type === 'XC' && !detail.paXuatGaoChuyenXc) {
              quyetDinhPdDtl = cloneDeep(detail.quyetDinhPdDtl);
              quyetDinhPdDtl.forEach(s => {
                s.idQdPdDtl = s.id;
                s.soLuongXc = s.soLuong;
                s.soLuongDx = s.soLuong;
                s.soLuong = 0;
                s.mId = uuidv4();
                delete s.id;
              });
            } else if (this.formData.value.type === "XC" && detail.paXuatGaoChuyenXc) {
              quyetDinhPdDtl = cloneDeep(detail.quyetDinhPdDtl);
              quyetDinhPdDtl.forEach(s => {
                s.idQdPdDtl = s.id;
                s.soLuongDx = s.soLuongXc;
                s.soLuong = 0;
                s.mId = uuidv4();
                delete s.id;
              });
            }
            const soLuong = quyetDinhPdDtl.filter(f => f.maDvi === this.userInfo.MA_DVI).reduce((sum, cur) => {

              if (detail.paXuatGaoChuyenXc) {
                sum += cur.soLuongXc ? cur.soLuongXc : 0
              } else {
                // sum += cur.soLuong ? cur.soLuong : 0
                sum += cur.soLuongDx ? cur.soLuongDx : 0
              }
              return sum
            }, 0);
            // const thoiGianGiaoNhan = detail.type === "TH" ? detail.quyetDinhPdDtl.find(f => f.maDvi === this.userInfo.MA_DVI) ? detail.quyetDinhPdDtl.find(f => f.maDvi === this.userInfo.MA_DVI).ngayKetThuc : null : detail.ngayKetThuc;
            this.formData.patchValue({
              idQdPd: detail.id,
              soQdPd: detail.soBbQd,
              loaiNhapXuat: detail.loaiNhapXuat,
              kieuNhapXuat: detail.kieuNhapXuat,
              mucDichXuat: detail.mucDichXuat,
              phanLoai: detail.phanLoai,
              // tenVthh: detail.tenVthh,
              dataDtl: quyetDinhPdDtl,
              type: this.formData.value.type === 'XC' ? 'XC' : detail.type,
              tenVthh: this.formData.value.type === 'XC' ? TEN_LOAI_VTHH.THOC : detail.tenVthh,
              loaiVthh: this.formData.value.type === 'XC' ? LOAI_HANG_DTQG.THOC : detail.loaiVthh,
              tenLoaiVthh: this.formData.value.type === 'XC' ? TEN_LOAI_VTHH.THOC : detail.tenLoaiVthh,
              thoiGianGiaoNhan: this.formData.value.type === 'XC' ? detail.paXuatGaoChuyenXc ? quyetDinhPdDtl.find(f => f.maDvi === this.userInfo.MA_DVI) ? quyetDinhPdDtl.find(f => f.maDvi === this.userInfo.MA_DVI).ngayKetThuc : '' : detail.ngayKetThuc : '',
              soLuong,
              paXuatGaoChuyenXc: detail.paXuatGaoChuyenXc

            });
            await this.buildTableView();
          }
        });
      }
    } catch (e) {
      console.log(e)
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      await this.spinner.hide();
    }
  }

  async buildTableView() {
    if (this.formData.value.type !== "XC") {
      this.formData.value.dataDtl.forEach(s => {
        if (s.tenDiemKho) {
          s.tenDiaDiem = this.formData.value.loaiVthh !== LOAI_HANG_DTQG.VAT_TU ? (s.tenDiemKho ? s.tenDiemKho + ' - ' : '') +
            (s.tenNhaKho ? s.tenNhaKho + ' - ' : '') +
            (s.tenNganKho ? s.tenNganKho + ' - ' : '') +
            (s.tenLoKho ? s.tenLoKho + ' - ' : '') + (s.tenLoaiVthh ? s.tenLoaiVthh : '') +
            (s.tenCloaiVthh ? ' - ' + s.tenCloaiVthh : '') : (s.tenDiemKho ? s.tenDiemKho + ' - ' : '') +
            (s.tenNhaKho ? s.tenNhaKho + ' - ' : '') +
            (s.tenNganKho ? s.tenNganKho : '') +
          (s.tenLoKho ? ' - ' + s.tenLoKho : '');
        }
        s.tenHang = this.formData.value.loaiVthh !== LOAI_HANG_DTQG.VAT_TU ? s.tenLoaiVthh : s.tenCloaiVthh ? s.tenLoaiVthh + " - " + s.tenCloaiVthh : s.tenLoaiVthh;
        s.noiDungDxTheoDx = `${s.noiDungDx}-${s.idDx}`;
      });
      let data = this.formData.value.dataDtl;
      if (this.userInfo.CAP_DVI == DANH_MUC_LEVEL.CHI_CUC || this.userInfo.CAP_DVI == DANH_MUC_LEVEL.CUC) {
        data = this.formData.value.dataDtl.filter(s => s.maDvi.match("^" + this.userInfo.MA_DVI + ".*"));
      };
      this.phuongAnView = chain(data)
        .groupBy("noiDungDxTheoDx")
        .map((value, key) => {
          let noiDungDxRow = value.find(s => key && s.noiDungDxTheoDx === key);
          let rs = chain(value)
            .groupBy("tenHang")
            .map((v, k) => {
              let tenLoaiVthhRow = v.find(s => k && s.tenHang === k);
              if (!tenLoaiVthhRow || !k) return;
              const rs1 = chain(v).groupBy('namNhap').map((v1, k1) => {
                const namNhapRow = v1.find(f => f.namNhap === +k1);
                if (!namNhapRow) return;
                const rs2 = chain(v)
                  .groupBy("tenChiCuc")
                  .map((v1, k1) => {
                    let tenChiCucRow = v1.find(s => k1 && s.tenChiCuc === k1);
                    if (!tenChiCucRow) return;
                    let soLuong = v1.reduce((prev, next) => prev + next.soLuong, 0);
                    return {
                      ...tenChiCucRow,
                      idVirtual: uuidv4(),
                      tenTrangThai: tenChiCucRow.tenTrangThai || 'Đang thực hiện',
                      childData: v1.filter(f => !!f.tenDiaDiem),
                      soLuong: soLuong,
                    }
                  }).value().filter(f => !!f);
                const soLuong = rs2.reduce((prev, next) => prev + next.soLuong, 0);
                const soLuongGiao = rs2.reduce((prev, next) => prev + next.soLuongGiao, 0);
                return {
                  ...namNhapRow,
                  idVirtual: uuidv4(),
                  soLuongGiao: soLuongGiao,
                  soLuong: soLuong,
                  childData: rs2,
                }
              }).value().filter(f => !!f);
              let soLuong = rs1.reduce((prev, next) => prev + next.soLuong, 0);
              let soLuongGiao = rs1.reduce((prev, next) => prev + next.soLuongGiao, 0);
              return {
                ...tenLoaiVthhRow,
                idVirtual: uuidv4(),
                soLuongGiao: soLuongGiao,
                soLuong: soLuong,
                childData: rs1,
              }
            }).value().filter(f => !!f);
          if (!noiDungDxRow) return;
          const soLuong = rs.reduce((sum, cur) => sum += cur.soLuong, 0);
          const soLuongDx = rs.reduce((sum, cur) => sum += cur.soLuongDx, 0);
          return {
            ...noiDungDxRow,
            idVirtual: uuidv4(),
            soLuong,
            soLuongDx: soLuongDx,
            childData: rs,
          };
        }).value().filter(f => !!f);
      this.expandAll();
    } else if (this.formData.value.paXuatGaoChuyenXc) {
      this.formData.value.dataDtl.forEach(s => {
        if (s.tenDiemKho) {
          s.tenDiaDiem = this.formData.value.loaiVthh !== LOAI_HANG_DTQG.VAT_TU ? (s.tenDiemKho ? s.tenDiemKho + ' - ' : '') +
            (s.tenNhaKho ? s.tenNhaKho + ' - ' : '') +
            (s.tenNganKho ? s.tenNganKho + ' - ' : '') +
            (s.tenLoKho ? s.tenLoKho + ' - ' : '') + (s.tenLoaiVthh ? s.tenLoaiVthh : '') +
            (s.tenCloaiVthh ? ' - ' + s.tenCloaiVthh : '') : (s.tenDiemKho ? s.tenDiemKho + ' - ' : '') +
            (s.tenNhaKho ? s.tenNhaKho + ' - ' : '') +
            (s.tenNganKho ? s.tenNganKho : '') +
          (s.tenLoKho ? ' - ' + s.tenLoKho : '');
        }
        s.tenHang = s.tenCloaiVthh ? s.tenLoaiVthh + " - " + s.tenCloaiVthh : s.tenLoaiVthh;
        s.noiDungDxTheoDx = `${s.noiDungDx}-${s.idDx}`;
      });
      let data = this.formData.value.dataDtl;
      if (this.userInfo.CAP_DVI == DANH_MUC_LEVEL.CHI_CUC || this.userInfo.CAP_DVI == DANH_MUC_LEVEL.CUC) {
        data = this.formData.value.dataDtl.filter(s => s.maDvi.match("^" + this.userInfo.MA_DVI + ".*"));
      };
      this.phuongAnView = chain(data)
        .groupBy("noiDungDxTheoDx")
        .map((value, key) => {
          let noiDungDxRow = value.find(s => key && s.noiDungDxTheoDx === key);
          if (!noiDungDxRow) return;
          const rs = chain(value).groupBy("namNhap").map((v1, k1) => {
            const namNhapRow = v1.find(s => k1 && s.namNhap === +k1);
            if (!namNhapRow) return;
            let rs1 = chain(v1)
              .groupBy("tenChiCuc")
              .map((v2, k2) => {
                let tenChiCucRow = v2.find(s => k2 && s.tenChiCuc === k2);
                if (!tenChiCucRow) return;
                // let slGaoThuHoiSauXayXat = v1.reduce((prev, next) => prev + next.slGaoThuHoiSauXayXat, 0);
                // let slThocDeXayXat = v1.reduce((prev, next) => prev + next.slThocDeXayXat, 0);
                const { slGaoThuHoiSauXayXat, slThocDeXayXat } = v2.reduce((obj, cur) => {
                  obj.slGaoThuHoiSauXayXat += cur.slGaoThuHoiSauXayXat;
                  obj.slThocDeXayXat += cur.slThocDeXayXat;
                  return obj;
                }, { slGaoThuHoiSauXayXat: 0, slThocDeXayXat: 0 });
                return {
                  ...tenChiCucRow,
                  idVirtual: uuidv4(),
                  slGaoThuHoiSauXayXat,
                  slThocDeXayXat,
                  soLuong: slThocDeXayXat,
                  tenTrangThai: tenChiCucRow.tenTrangThai || 'Đang thực hiện',
                  childData: v2.filter(f => !!f.tenDiaDiem),
                }
              }).value().filter(f => !!f);
            const { soLuongGiao, slGaoThuHoiSauXayXat, slThocDeXayXat } = rs1.reduce((obj, cur) => {
              obj.soLuongGiao += cur.soLuongGiao;
              obj.slGaoThuHoiSauXayXat += cur.slGaoThuHoiSauXayXat;
              obj.slThocDeXayXat += cur.slThocDeXayXat;
              return obj;
            }, { soLuongGiao: 0, slGaoThuHoiSauXayXat: 0, slThocDeXayXat: 0 });
            return {
              ...namNhapRow,
              idVirtual: uuidv4(),
              soLuongGiao,
              slGaoThuHoiSauXayXat,
              slThocDeXayXat: slThocDeXayXat,
              childData: rs1,
            }
          }).value().filter(f => !!f)
          // const soLuongDx = rs.reduce((sum, cur) => sum += cur.soLuongDx, 0);
          // let slGaoThuHoiSauXayXat = rs.reduce((prev, next) => prev + next.slGaoThuHoiSauXayXat, 0);
          // let slThocDeXayXat = rs.reduce((prev, next) => prev + next.slThocDeXayXat, 0);
          const { soLuongGiao, slGaoThuHoiSauXayXat, slThocDeXayXat } = rs.reduce((obj, cur) => {
            obj.soLuongGiao += cur.soLuongGiao;
            obj.slGaoThuHoiSauXayXat += cur.slGaoThuHoiSauXayXat;
            obj.slThocDeXayXat += cur.slThocDeXayXat;
            return obj;
          }, { soLuongGiao: 0, slGaoThuHoiSauXayXat: 0, slThocDeXayXat: 0 });
          return {
            ...noiDungDxRow,
            idVirtual: uuidv4(),
            soLuongGiao,
            slGaoThuHoiSauXayXat,
            slThocDeXayXat: slThocDeXayXat,
            childData: rs,
          };
        }).value().filter(f => !!f);
      this.expandAll();
    } else {
      this.formData.value.dataDtl.forEach(s => {
        if (s.tenDiemKho) {
          s.tenDiaDiem = this.formData.value.loaiVthh !== LOAI_HANG_DTQG.VAT_TU ? (s.tenDiemKho ? s.tenDiemKho + ' - ' : '') +
            (s.tenNhaKho ? s.tenNhaKho + ' - ' : '') +
            (s.tenNganKho ? s.tenNganKho + ' - ' : '') +
            (s.tenLoKho ? s.tenLoKho + ' - ' : '') + (s.tenLoaiVthh ? s.tenLoaiVthh : '') +
            (s.tenCloaiVthh ? ' - ' + s.tenCloaiVthh : '') : (s.tenDiemKho ? s.tenDiemKho + ' - ' : '') +
            (s.tenNhaKho ? s.tenNhaKho + ' - ' : '') +
            (s.tenNganKho ? s.tenNganKho : '') +
          (s.tenLoKho ? ' - ' + s.tenLoKho : '');
        }
        s.tenHang = s.tenCloaiVthh ? s.tenLoaiVthh + " - " + s.tenCloaiVthh : s.tenLoaiVthh;
        s.noiDungDxTheoDx = `${s.noiDungDx}-${s.idDx}`;
      });
      let data = this.formData.value.dataDtl;
      if (this.userInfo.CAP_DVI == DANH_MUC_LEVEL.CHI_CUC || this.userInfo.CAP_DVI == DANH_MUC_LEVEL.CUC) {
        data = this.formData.value.dataDtl.filter(s => s.maDvi.match("^" + this.userInfo.MA_DVI + ".*"));
      };
      this.phuongAnView = chain(data)
        .groupBy("noiDungDxTheoDx")
        .map((value, key) => {
          let noiDungDxRow = value.find(s => key && s.noiDungDxTheoDx === key);
          if (!noiDungDxRow) return;
          const rs = chain(value).groupBy("namNhap").map((v1, k1) => {
            const namNhapRow = v1.find(f => k1 && f.namNhap === +k1);
            if (!namNhapRow) return;
            const rs1 = chain(v1)
              .groupBy("tenChiCuc")
              .map((v2, k2) => {
                let tenChiCucRow = v1.find(s => k2 && s.tenChiCuc === k2);
                if (!tenChiCucRow) return;
                let slGaoThuHoiSauXayXat = v2.reduce((prev, next) => prev + next.slGaoThuHoiSauXayXat, 0);
                let slThocDeXayXat = v2.reduce((prev, next) => prev + next.slThocDeXayXat, 0);
                return {
                  ...tenChiCucRow,
                  idVirtual: uuidv4(),
                  tenTrangThai: tenChiCucRow.tenTrangThai || 'Đang thực hiện',
                  childData: v2.filter(f => !!f.tenDiaDiem),
                  slGaoThuHoiSauXayXat,
                  slThocDeXayXat,
                }
              }).value().filter(f => !!f);
            const slGaoThuHoiSauXayXat = rs1.reduce((prev, next) => prev + next.slGaoThuHoiSauXayXat, 0);
            const slThocDeXayXat = rs1.reduce((prev, next) => prev + next.slThocDeXayXat, 0);
            return {
              ...namNhapRow,
              idVirtual: uuidv4(),
              childData: rs1,
              slGaoThuHoiSauXayXat,
              slThocDeXayXat,
            }
          }).filter(f => !!f)
          return {
            ...noiDungDxRow,
            idVirtual: uuidv4(),
            childData: rs,
          };
        }).value().filter(f => !!f);
      this.expandAll();
    }
  }

  expandAll() {
    this.phuongAnView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    });
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async themPhuongAn(data?: any, level?: any, editRow?: boolean, parentData?: any) {
    this.formDataDtl.reset();
    if (data) {
      let edit = editRow;
      if (level == 1) {
        // let baseData = data.childData[0].childData[0];
        // if (!data.childData[0].tenChiCuc) {
        //   edit = true
        // }
        if (data.childData.length < 1) {
          edit = true
        }
        this.formDataDtl.patchValue({
          // noiDungDx: data.noiDungDx,
          // tenHang: data.tenHang,
          // loaiVthh: data.loaiVthh,
          // cloaiVthh: data.cloaiVthh,
          // soLuongDx: data.soLuongDx,
          // // tonKhoCloaiVthh: data.tonKhoCloaiVthh,
          // donViTinh: data.donViTinh,
          // idQdPdDtl: data.idQdPdDtl,
          // edit,
          // mId: edit ? data.mId : uuidv4(),

          // idDx: data.idDx,
          // idDonViNhan: data.idDonViNhan,
          // loaiNhapXuat: data.loaiNhapXuat,
          // kieuNhapXuat: data.kieuNhapXuat,
          // mucDichXuat: data.mucDichXuat,

          // tonKhoCloaiVthh: data.tonKhoCloaiVthh || 0,
          // tonKhoDvi: data.tonKhoDvi || 0
          ...data,
          tenCuc: data.tenDvi,
          edit,
          mId: edit ? data.mId : uuidv4(),
          id: null,
          tenDvi: '',
          maDvi: null,
          tenChiCuc: '',
          tenDiemKho: '',
          tenNhaKho: '',
          tenNganKho: '',
          tenLoKho: '',
          soLuongGiao: 0,
          soLuong: 0,
          slConLaiGiao: this.checkSlConLaiGiao(data, level, editRow, parentData),
          tonKhoCloaiVthh: 0,
          tonKhoDvi: 0

        });
      } else if (level == 2) {
        if (edit) {
          this.formDataDtl.patchValue({
            // noiDungDx: data.noiDungDx,
            // loaiVthh: data.loaiVthh,
            // tenHang: data.tenHang,
            // cloaiVthh: data.cloaiVthh,
            // soLuongDx: data.soLuongDx,
            // // tonKhoCloaiVthh: data.tonKhoCloaiVthh,
            // donViTinh: data.donViTinh,
            // tenChiCuc: data.tenChiCuc,
            // soLuongGiao: data.soLuongGiao,
            // maDvi: data.maDvi,
            // idQdPdDtl: data.idQdPdDtl,
            // edit,
            // mId: edit ? data.mId : uuidv4(),

            // idDx: data.idDx,
            // idDonViNhan: data.idDonViNhan,
            // loaiNhapXuat: data.loaiNhapXuat,
            // kieuNhapXuat: data.kieuNhapXuat,
            // mucDichXuat: data.mucDichXuat,

            // tonKhoCloaiVthh: data.tonKhoCloaiVthh || 0,
            // tonKhoDvi: data.tonKhoDvi || 0

            ...data,
            edit,
            mId: edit ? data.mId : uuidv4(),
            tonKhoCloaiVthh: data.tonKhoCloaiVthh || 0,
            tonKhoDvi: data.tonKhoDvi || 0,
            slConLaiGiao: this.checkSlConLaiGiao(data, level, editRow, parentData)
          });
          this.kiemTraTonKho();
        } else {

          // let baseData = data.childData[0];
          // if (!data.childData[0].tenDiaDiem) {
          //   edit = true
          // }
          if (data.childData.length < 1) {
            edit = true
          }
          this.formDataDtl.patchValue({
            // noiDungDx: data.noiDungDx,
            // tenHang: data.tenHang,
            // loaiVthh: data.loaiVthh,
            // cloaiVthh: data.cloaiVthh,
            // soLuongDx: data.soLuongDx,
            // // tonKhoCloaiVthh: data.tonKhoCloaiVthh,
            // donViTinh: data.donViTinh,
            // tenChiCuc: data.tenChiCuc,
            // soLuongGiao: data.soLuongGiao,
            // idQdPdDtl: data.idQdPdDtl,
            // edit,
            // mId: edit ? data.mId : uuidv4(),

            // idDx: data.idDx,
            // idDonViNhan: data.idDonViNhan,
            // loaiNhapXuat: data.loaiNhapXuat,
            // kieuNhapXuat: data.kieuNhapXuat,
            // mucDichXuat: data.mucDichXuat,

            // tonKhoCloaiVthh: data.tonKhoCloaiVthh || 0,
            // tonKhoDvi: data.tonKhoDvi || 0
            ...data,
            edit,
            mId: edit ? data.mId : uuidv4(),
            tonKhoCloaiVthh: 0,
            id: null,
            tenDvi: '',
            maDvi: null,
            tenDiemKho: '',
            tenNhaKho: '',
            tenNganKho: '',
            tenLoKho: '',
            soLuong: 0,
            slConLaiGiao: this.checkSlConLaiGiao(data, level, editRow, parentData)
          });
        }
      } else if (level === 3) {
        this.formDataDtl.patchValue({
          // noiDungDx: data.noiDungDx,
          // loaiVthh: data.loaiVthh,
          // tenHang: data.tenHang,
          // cloaiVthh: data.cloaiVthh,
          // soLuongDx: data.soLuongDx,
          // // tonKhoCloaiVthh: data.tonKhoCloaiVthh,
          // donViTinh: data.donViTinh,
          // tenChiCuc: data.tenChiCuc,
          // soLuongGiao: data.soLuongGiao,
          // idQdPdDtl: data.idQdPdDtl,
          // soLuong: data.soLuong,
          // tenDiemKho: data.tenDiemKho,
          // tenNhaKho: data.tenNhaKho,
          // tenNganKho: data.tenNganKho,
          // tenLoKho: data.tenLoKho,
          // maDvi: data.maDvi,
          // edit,
          // mId: edit ? data.mId : uuidv4(),

          // idDx: data.idDx,
          // idDonViNhan: data.idDonViNhan,
          // loaiNhapXuat: data.loaiNhapXuat,
          // kieuNhapXuat: data.kieuNhapXuat,
          // mucDichXuat: data.mucDichXuat,

          // tonKhoCloaiVthh: data.tonKhoCloaiVthh || 0,
          // tonKhoDvi: data.tonKhoDvi || 0
          ...data,
          edit,
          mId: edit ? data.mId : uuidv4(),
          tonKhoCloaiVthh: data.tonKhoCloaiVthh || 0,
          tenDvi: edit ? data.tenDvi : '',
          maDvi: edit ? data.maDvi : null,
          tenDiemKho: edit ? data.tenDiemKho : '',
          tenNhaKho: edit ? data.tenNhaKho : '',
          tenNganKho: edit ? data.tenNganKho : '',
          tenLoKho: edit ? data.tenLoKho : '',
          soLuong: edit ? data.soLuong : 0,
          slConLaiGiao: this.checkSlConLaiGiao(data, level, editRow, parentData)
        });
        this.selectedNode = data.maDvi;
        this.kiemTraTonKho();
      }
    }

    if (this.userService.isCuc()) {
      this.loadDsDonViTheoNamNhap(+data.namNhap)
    }
    await this.changeLoaiVthh(this.formDataDtl.value.loaiVthh);
    await this.loadDsDiemKho(this.userInfo.MA_DVI, this.formDataDtl.value.loaiVthh, this.formDataDtl.value.cloaiVthh, +data.namNhap);

    this.modalChiTiet = true;
  }
  checkSlConLaiGiao(data: any, level: number, edit: boolean, parentData: any) {
    let result = 0;
    const soLuongDx = data.soLuongDx || 0;
    const soLuongGiao = data.soLuongGiao || 0;
    const soLuong = data.soLuong || 0;
    const slGaoThuHoiSauXayXat = data.slGaoThuHoiSauXayXat || 0;
    const slThocDeXayXat = data.slThocDeXayXat || 0;
    if (this.formData.value.type !== 'XC') {
      if (level === 1) {
        result = soLuongDx - soLuongGiao;
      }
      else if (level === 2 && !edit) {
        result = soLuongGiao - soLuong
      }
      else if (level === 2 && edit) {
        result = parentData.soLuongDx - parentData.soLuongGiao + soLuongGiao
      } else {
        result = parentData.soLuongGiao - parentData.soLuong + soLuong
      }
    } else if (this.formData.value.type === 'XC' && !this.formData.value.paXuatGaoChuyenXc) {
      if (level === 1) {
        result = soLuongDx - soLuongGiao;
      }
      else if (level === 2 && !edit) {
        result = soLuongGiao - slThocDeXayXat
      }
      else if (level === 2 && edit) {
        result = parentData.soLuongDx - parentData.soLuongGiao + soLuongGiao
      } else {
        result = parentData.soLuongGiao - parentData.soLuong + slThocDeXayXat
      }
    }
    else if (this.formData.value.paXuatGaoChuyenXc) {
      if (level === 1) {
        result = soLuongDx - soLuongGiao;
      }
      else if (level === 2 && !edit) {
        result = soLuongGiao - slGaoThuHoiSauXayXat
      }
      else if (level === 2 && edit) {
        result = parentData.soLuongDx - parentData.soLuongGiao + soLuongGiao
      } else {
        result = parentData.soLuongGiao - parentData.soLuong + slGaoThuHoiSauXayXat
      }
    }
    return result
  }
  async themPaXuatCapThoc(data: any, level?: number, parentData?: any) {
    const isEdit = data.childData.length >= 1 ? false : true
    this.formDataDtl.patchValue({
      ...data, mId: isEdit ? data.mId : uuidv4(), slThocDeXayXat: 0, slGaoThuHoiSauXayXat: 0, tyLeThuHoiSauXayXat: 0,
      tenCuc: level === 1 ? data.tenDvi : data.tenCuc,
      //Ở cấp cục giao Gạo nên loai Vthh là gạo, cấp chi cục loại Vthh hàng hóa là Thóc
      loaiVthh: level === 2 ? LOAI_HANG_DTQG.THOC : data.loaiVthh,
      maDvi: null,
      tenChiCuc: level === 1 ? '' : data.tenChiCuc,
      id: isEdit ? data.id : null,
      edit: isEdit,
      soLuongGiao: level === 1 ? 0 : data.soLuongGiao,
      soLuong: 0,
      slConLaiGiao: this.checkSlConLaiGiao(data, level, false, parentData),
      tonKhoCloaiVthh: 0,
      tonKhoDvi: level === 1 ? 0 : data.tonKhoDvi,
    });
    this.listDonVi.forEach(s => {
      // s.disable = this.formData.value.dataDtl.some(s1 => s1.maDvi.match("^" + s.maDvi)) && !(s.maDvi === data.maDvi && editRow);
      s.disable = this.formData.value.dataDtl.some(s1 => s1.maDvi === s.maDvi && s1.noiDungDx === data.noiDungDx && s1.idDx === data.idDx);

    })
    await this.changeLoaiVthh(data.loaiVthh);
    if (this.userService.isCuc()) {
      await this.loadDsDonViTheoNamNhap(+this.formDataDtl.value.namNhap)
    } else if (this.userService.isChiCuc()) {
      await this.loadDsDiemKho(this.userInfo.MA_DVI, data.loaiVthh, data.cloaiVthh, +data.namNhap);
    }
    this.modalChiTiet = true;
  }
  async suaPaXuatCapThoc(data: any, level?: number, parentData?: any) {
    // data.patchValue({ ...data, edit: true });
    this.bidingDataInFormGroupAndIgnore(this.formDataDtl, { ...data, edit: true, slConLaiGiao: this.checkSlConLaiGiao(data, level, true, parentData) }, ['tyLeThuHoiSauXayXat', 'slThocDeXayXat', 'slGaoThuHoiSauXayXat']);
    this.formDataDtl.controls['tyLeThuHoiSauXayXat'].setValue(data.tyLeThuHoiSauXayXat, { emitEvent: false });
    this.formDataDtl.controls['slThocDeXayXat'].setValue(data.slThocDeXayXat, { emitEvent: false });
    this.formDataDtl.controls['slGaoThuHoiSauXayXat'].setValue(data.slGaoThuHoiSauXayXat, { emitEvent: false });
    this.listDonVi.forEach(s => {
      // s.disable = this.formData.value.dataDtl.some(s1 => s1.maDvi.match("^" + s.maDvi)) && !(s.maDvi === data.maDvi && editRow);
      s.disable = this.formData.value.dataDtl.some(s1 => s1.maDvi === s.maDvi && s1.noiDungDx === data.noiDungDx && s1.idDx === data.idDx && s.maDvi !== data.maDvi);
    })
    if (level === 3) {
      this.selectedNode = data.maDvi;
    }
    await this.changeLoaiVthh(this.formDataDtl.value.loaiVthh);
    if (this.userService.isCuc()) {
      await this.loadDsDonViTheoNamNhap(+this.formDataDtl.value.namNhap)
    } else if (this.userService.isChiCuc()) {
      await this.loadDsDiemKho(this.userInfo.MA_DVI, this.formDataDtl.value.loaiVthh, this.formDataDtl.value.cloaiVthh, +this.formDataDtl.value.namNhap);
    }
    this.modalChiTiet = true;
  }
  async xoaPaXuatCapThoc(data: any, parent: any, lv) {
    if (parent.childData.length > 1) {
      const findIndex = this.formData.value.dataDtl.findIndex(f => f.mId === data.mId);
      if (findIndex >= 0) {
        this.formData.value.dataDtl.splice(findIndex, 1)
      }
    }
    else if (parent.childData.length == 1 && lv === 2) {
      this.formData.value.dataDtl = this.formData.value.dataDtl.map(s => {
        if (s.mId === data.mId) {
          s.tenChiCuc = '';
          s.soLuongGiao = 0;
          s.maDvi = data.maDvi.substring(0, 6);
        }
        return s
      });
    } else if (parent.childData.length == 1 && lv === 3) {
      this.formData.value.dataDtl = this.formData.value.dataDtl.map(s => {
        if (s.mId === data.mId) {
          s.slGaoThuHoiSauXayXat = 0;
          s.slThocDeXayXat = 0;
          s.tyLeThuHoiSauXayXat = 0;
          s.maDvi = data.maDvi.substring(0, 8);
          s.tenDiemKho = '';
          s.tenNhaKho = '';
          s.tenNganKho = '';
          s.tenLoKho = '';
          s.tenDiaDiem = '';
        }
        return s
      });
    }
    await this.buildTableView();
  }
  async luuPhuongAn() {
    await this.helperService.markFormGroupTouched(this.formDataDtl);
    if (this.formDataDtl.invalid) {
      return;
    }
    let row = this.formDataDtl.value;
    row.tenChiCuc = row.tenChiCuc || this.listDonVi.find(s => s.maDvi == row.maDvi)?.tenDvi;
    row.tenCloaiVthh = row.tenCloaiVthh || this.listChungLoaiHangHoa.find(s => s.ma == row.cloaiVthh)?.ten;
    if (this.formData.value.type === "XC") {
      row.soLuong = row.slThocDeXayXat
    }
    // if (!row.idVirtual) {
    //   row.idVirtual = uuidv4();
    //   if (row.edit) {
    //     this.formData.value.dataDtl[0] = row;
    //   } else {
    //     this.formData.value.dataDtl = [...this.formData.value.dataDtl, row]
    //   }
    // }
    const dataDtl = this.formData.value.dataDtl;
    if (row.edit) {
      const findIndex = dataDtl.findIndex(f => f.mId === row.mId);
      if (findIndex >= 0) {
        dataDtl[findIndex] = { ...dataDtl[findIndex], ...row };
      }
    } else {
      dataDtl.push(row);
    };
    this.formData.patchValue({ dataDtl })
    await this.buildTableView();
    await this.huyPhuongAn();
  }

  async huyPhuongAn() {
    this.formDataDtl.reset();
    this.modalChiTiet = false;
    this.selectedNode = null; // Clear the selected node
  }

  async xoaPhuongAn(data: any, parent?: any, lv?: any) {
    if (parent.childData.length > 1) {
      const findIndex = this.formData.value.dataDtl.findIndex(f => f.mId === data.mId);
      if (findIndex >= 0) {
        this.formData.value.dataDtl.splice(findIndex, 1)
      }
    }
    else if (parent.childData.length == 1 && lv === 2) {
      this.formData.value.dataDtl = this.formData.value.dataDtl.map(s => {
        if (s.mId === data.mId) {
          s.tenChiCuc = '';
          s.soLuongGiao = 0;
          s.maDvi = data.maDvi.substring(0, 6);
        }
        return s
      });
    } else if (parent.childData.length == 1 && lv === 3) {
      this.formData.value.dataDtl = this.formData.value.dataDtl.map(s => {
        if (s.mId === data.mId) {
          s.soLuong = null;
          s.maDvi = data.maDvi.substring(0, 8);
          s.tenDiemKho = '';
          s.tenNhaKho = '';
          s.tenNganKho = '';
          s.tenLoKho = '';
          s.tenDiaDiem = '';
        }
        return s
      });
    }
    await this.buildTableView();
  }
  updateTonKhoDvi(slTonKho: number, maDvi) {
    const tongSlPhanBo = this.formData.value.dataDtl.reduce((sum, cur) => {
      if (cur.maDvi === maDvi) {
        sum += cur.soLuong;
        return sum;
      }
    }, 0);
    return slTonKho - tongSlPhanBo
  }

  selectDiaDiem(node: NzTreeNodeOptions) {
    if (node.isLeaf) {
      let current = node.origin;
      //chon lo
      let diemKhoNode = this.nzTreeSelectComponent.getTreeNodeByKey(current.maDvi.substring(0, 10));
      let nhaKhoNode = this.nzTreeSelectComponent.getTreeNodeByKey(current.maDvi.substring(0, 12));
      if (node.level == 4) {
        let nganKhoNode = this.nzTreeSelectComponent.getTreeNodeByKey(current.maDvi.substring(0, 14));
        this.formDataDtl.patchValue({
          maDvi: current.maDvi,
          tenDiemKho: diemKhoNode.origin.tenDvi,
          tenNhaKho: nhaKhoNode.origin.tenDvi,
          tenNganKho: nganKhoNode.origin.tenDvi,
          tenLoKho: current.tenDvi,
          cloaiVthh: current.cloaiVthh,
          tenCloaiVthh: current.tenCloaiVthh,
        });
      }
      //chon ngan
      else if (node.level == 3) {
        this.formDataDtl.patchValue({
          maDvi: current.maDvi,
          tenDiemKho: diemKhoNode.origin.tenDvi,
          tenNhaKho: nhaKhoNode.origin.tenDvi,
          tenNganKho: current.tenDvi,
          cloaiVthh: current.cloaiVthh,
          tenCloaiVthh: current.tenCloaiVthh
        });
      }
      this.kiemTraTonKho();
    } else {
      node.isSelectable = false;
      node.isExpanded = !node.isExpanded;
    }
  }

  async kiemTraTonKho() {
    let maDvi = this.formDataDtl.value.maDvi;
    let loaiVthh = this.formData.value.type === "XC" && this.formData.value.paXuatGaoChuyenXc ? LOAI_HANG_DTQG.THOC : this.formDataDtl.value.loaiVthh;
    let cloaiVthh = this.formDataDtl.value.cloaiVthh;
    let soLuongGiao = this.formDataDtl.value.soLuongGiao;
    let soLuongDx = this.formDataDtl.value.soLuongDx;
    let slConLaiGiao = this.formDataDtl.value.slConLaiGiao;
    let tonKhoDvi = this.formDataDtl.value.tonKhoDvi;
    let tonKhoCloaiVthh = this.formDataDtl.value.tonKhoCloaiVthh;
    let tenDvi = Array.isArray(this.listDonVi) && this.listDonVi.find(f => f.maDvi === maDvi) ? this.listDonVi.find(f => f.maDvi === maDvi).tenDvi : null;
    this.formDataDtl.patchValue({ tenDvi: tenDvi })
    this.resetValidatorDataDtl();
    if (maDvi) {
      const body = {
        maDvi, maVthh: cloaiVthh ? cloaiVthh : loaiVthh, namNhap: this.formDataDtl.value.namNhap
      }
      // let tonKhoCloaiVthh: number = 0;
      const res = await this.mangLuoiKhoService.slTon(body);
      if (res.msg === MESSAGE.SUCCESS) {
        const slTon = res.data;
        if (this.userService.isCuc()) {
          tonKhoDvi = slTon
        } else {
          tonKhoCloaiVthh = slTon;
        }
        this.formDataDtl.patchValue({
          tonKhoDvi, tonKhoCloaiVthh
        })
        if (this.userService.isCuc()) {
          if (this.formData.value.type === "XC" && this.formData.value.paXuatGaoChuyenXc) {
            this.formDataDtl.controls['soLuongGiao'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongDx, slConLaiGiao))]);
          } else {
            this.formDataDtl.controls['soLuongGiao'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongDx, tonKhoDvi, slConLaiGiao))]);
          }
          this.formDataDtl.controls['soLuongGiao'].updateValueAndValidity();
        }
        if (this.userService.isChiCuc()) {
          if (this.formData.value.type !== "XC") {
            this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongGiao, tonKhoCloaiVthh, slConLaiGiao))]);
            this.formDataDtl.controls['soLuong'].updateValueAndValidity();
          } else {
            if (this.formData.value.paXuatGaoChuyenXc) {
              this.formDataDtl.controls['slThocDeXayXat'].setValidators([Validators.required, Validators.min(1), Validators.max(tonKhoCloaiVthh)]);
              this.formDataDtl.controls['slGaoThuHoiSauXayXat'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongGiao, slConLaiGiao))]);
              this.formDataDtl.controls['slThocDeXayXat'].updateValueAndValidity();
              this.formDataDtl.controls['slGaoThuHoiSauXayXat'].updateValueAndValidity();
              this.formDataDtl.patchValue({ slThocDeXayXat: tonKhoCloaiVthh });
            } else {
              this.formDataDtl.controls['slThocDeXayXat'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongGiao, tonKhoCloaiVthh, slConLaiGiao))]);
              this.formDataDtl.controls['slThocDeXayXat'].updateValueAndValidity();
              if (tonKhoCloaiVthh >= this.formDataDtl.value.soLuongGiao) {
                this.formDataDtl.patchValue({ slThocDeXayXat: soLuongGiao })
              } else {
                this.formDataDtl.patchValue({ slThocDeXayXat: tonKhoCloaiVthh });
              }
            }
          }
        }
      }
      else {
        this.formDataDtl.patchValue({
          tonKhoCloaiVthh: 0,
          tonKhoDvi: 0
        });
        this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongGiao, 0))]);
        this.formDataDtl.controls['soLuong'].updateValueAndValidity();
        this.formDataDtl.controls['slGaoThuHoiSauXayXat'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongGiao, 0))]);
        this.formDataDtl.controls['slGaoThuHoiSauXayXat'].updateValueAndValidity();
      }
    }
  }
  resetValidatorDataDtl() {
    this.formDataDtl.controls['soLuongGiao'].clearValidators();
    this.formDataDtl.controls['soLuong'].clearValidators();
    this.formDataDtl.controls['slThocDeXayXat'].clearValidators();
    this.formDataDtl.controls['slGaoThuHoiSauXayXat'].clearValidators();
    this.formDataDtl.controls['soLuongGiao'].updateValueAndValidity();
    this.formDataDtl.controls['soLuong'].updateValueAndValidity();
    this.formDataDtl.controls['slThocDeXayXat'].updateValueAndValidity();
    this.formDataDtl.controls['slGaoThuHoiSauXayXat'].updateValueAndValidity();
  }
  isVthhGao() {
    if (this.formData.value.tenVthh === "Gạo tẻ") {
      return true
    }
    return false
  }
  isVthhVatuThietBi() {
    if (this.formData.value.tenVthh === "Vật tư thiết bị") {
      return true
    }
    return false
  }
  showAction(): boolean {
    if (this.userService.isCuc() && [STATUS.DU_THAO, STATUS.TU_CHOI_TP, STATUS.TU_CHOI_LDC].includes(this.formData.value.trangThai) && !this.isView) {
      return true;
    }
    else if (this.userService.isChiCuc() && [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN].includes(this.formData.value.trangThaiXh)) {
      return true;
    }
    return false
  }
  async xemTruocPd(id: number) {
    await this.service.preview({
      id: id,
    }).then(async res => {
      if (res.data) {
        this.printSrc = res.data.pdfSrc;
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }
}
