import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
import { FileDinhKem } from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import { MESSAGE } from "src/app/constants/message";
import { chain } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { Base2Component } from "src/app/components/base2/base2.component";
import { QuanLyHangTrongKhoService } from "src/app/services/quanLyHangTrongKho.service";
import { TinhTrangKhoHienThoiService } from "src/app/services/tinhTrangKhoHienThoi.service";
import { DanhMucTieuChuanService } from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { MangLuoiKhoService } from "src/app/services/qlnv-kho/mangLuoiKho.service";
import { LIST_VAT_TU_HANG_HOA, LOAI_HANG_DTQG, TEN_LOAI_VTHH } from "src/app/constants/config";
import { PREVIEW } from "src/app/constants/fileType";

export class QuyetDinhPdDtl {
  idVirtual: string;
  id: number;
  idDx: number;
  soDx: string;
  maDviDx: string;
  ngayPduyetDx: Date;
  trichYeuDx: string;
  tongSoLuongDx: number;
  soLuongXuatCap: number;
  tenDviDx: string;
  quyetDinhPdDx: Array<any> = [];
}

export class QuyetDinhPdDx {
  idVirtual: string = '';
  id: number = null;
  noiDung: string = '';
  soLuongXuat: number = 0;
  soLuongXuatCuc: number = 0;
  maDviCuc: string = '';
  tonKhoCuc: number = 0;
  soLuongCon: number = 0;
  maDviChiCuc: string = '';
  tonKhoChiCuc: number = 0;
  loaiVthh: string = '';
  cloaiVthh: string = '';
  tonKhoCloaiVthh: number = 0;
  soLuongXuatChiCuc: number = 0;
  donViTinh: string = '';
  donGiaKhongVat: number = 0;
  thanhTien: number = 0;
  tenCloaiVthh: string = '';
  tenCuc: string = '';
  tenChiCuc: string = '';

  soLuongXuatDeXuat: number = 0;
  soLuongXuatThucTe: number = 0;
  level: number = 0;
}

@Component({
  selector: "app-thong-tin-quyet-dinh-xuat-cap",
  templateUrl: "./thong-tin-quyet-dinh-xuat-cap.component.html",
  styleUrls: ["./thong-tin-quyet-dinh-xuat-cap.component.scss"],
  providers: [QuyetDinhPdDx]
})
export class ThongTinQuyetDinhXuatCapComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  formDataDtl: FormGroup;
  maHauTo: any;
  STATUS = STATUS;
  phuongAnView = [];
  expandSetString = new Set<string>();
  modalChiTiet: boolean = false;
  listDiaDanh: any[] = [];
  listDonVi: any[] = [];
  listVatTuHangHoa: any[] = [];
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  listMucDichXuat: any[] = [];
  phuongAnViewCache: any[] = [];
  phuongAnHdrView: any[] = [];
  loaiNhapXuat: string;
  kieuNhapXuat: string;
  tongSoLuong: number;
  tongSoLuongDx: number;
  tongSlXuatCap: string;
  tongNhuCauXuat: string;
  templateName: string = 'QuyetDinhPheDuyetPhuongAnXuatCap';
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private cdr: ChangeDetectorRef,) {

    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetPhuongAnCuuTroService);
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.formData = this.fb.group(
      {
        id: [],
        maDvi: [],
        nam: [dayjs().get("year"), [Validators.required]],
        soBbQd: [, [Validators.required]],
        ngayKy: [, [Validators.required]],
        ngayHluc: [, [Validators.required]],
        idTongHop: [],
        maTongHop: [],
        ngayThop: [],
        idDx: [],
        soDx: [],
        idXc: [],
        soXc: [],
        ngayDx: [],
        tongSoLuongDx: [],
        tongSoLuong: [],
        thanhTien: [],
        soLuongXuatCap: [],
        loaiVthh: [],
        cloaiVthh: [],
        tenVthh: [],
        loaiNhapXuat: [],
        kieuNhapXuat: [],
        mucDichXuat: [, [Validators.required]],
        trichYeu: [],
        trangThai: [STATUS.DU_THAO],
        lyDoTuChoi: [],
        xuatCap: [false],
        type: [],
        ngayPduyet: [],
        nguoiPduyetId: [],
        donViTinh: [],
        idQdGiaoNv: [],
        soQdGiaoNv: [],
        tenDvi: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenTrangThai: ['Dự thảo'],
        quyetDinhPdDtl: [new Array()],
        fileDinhKem: [new Array<FileDinhKem>()],
        canCu: [new Array<FileDinhKem>()],
        qdPaXuatCapId: [],
        paXuatGaoChuyenXc: [false],
        qdPaXuatCap: [],
        ngayKetThuc: []
      }
    );

    this.formDataDtl = this.fb.group(
      {
        idVirtual: [''],
        noiDungOld: [],
        id: [''],
        idDonViNhan: [''],
        noiDungDx: ['', [Validators.required]],
        loaiVthh: ['', [Validators.required]],
        cloaiVthh: [''],
        maDvi: [''],
        tonKhoDvi: [''],
        tonKhoLoaiVthh: [''],
        tonKhoCloaiVthh: [''],
        donViTinh: [''],
        soLuong: [0, [Validators.required, Validators.min(1)]],
        mapVthh: [''],
        tenLoaiVthh: [],
        tenCloaiVthh: [''],
        mapDmucDvi: [''],
        tenDvi: [''],
        edit: []
      });
    this.formData.controls["paXuatGaoChuyenXc"].valueChanges.subscribe((value) => {
      if (value) {
        this.formData.patchValue({
          tenVthh: TEN_LOAI_VTHH.GAO,
          tenLoaiVthh: TEN_LOAI_VTHH.GAO,
          loaiVthh: LOAI_HANG_DTQG.GAO,
        })
      } else {
        this.formData.patchValue({
          tenVthh: TEN_LOAI_VTHH.THOC,
          tenLoaiVthh: TEN_LOAI_VTHH.THOC,
          loaiVthh: LOAI_HANG_DTQG.THOC,
        })
      }
      this.formData.controls["qdPaXuatCap"].setValue("", { emitEvent: false });
      this.formData.controls["mucDichXuat"].setValue("", { emitEvent: false });
      this.phuongAnHdrView = [];
      this.phuongAnView = [];
      this.loaiNhapXuat = '';
      this.kieuNhapXuat = '';
      this.formData.patchValue({ idDx: "", qdPaXuatCapId: "", quyetDinhPdDtl: [], ngayKetThuc: "" });
      this.tinhTong();
    });
    this.formData.controls["mucDichXuat"].valueChanges.subscribe((value) => {
      this.phuongAnHdrView = [];
      this.phuongAnView = [];
      this.loaiNhapXuat = '';
      this.kieuNhapXuat = '';
      this.formData.patchValue({ quyetDinhPdDtl: [], ngayKetThuc: "" });
      this.tinhTong();
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/QĐPDXC-' + this.userInfo.DON_VI.tenVietTat;
      await Promise.all([
        this.loadDsDonVi(),
        this.loadDsDiaDanh(),
        this.loadDsMucDichXuat()
      ]);
      await this.loadDetail();
      // tao qd tu qd ctvt
      if (Object.keys(this.dataInit).length > 0) {
        // this.checkChonPhuongAn();
        // this.checkXuatGao = true;
        await this.bindingDataQdPd(this.dataInit);
        // await this.changeQdPd(this.dataInit.id);
      }
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDetail() {
    if (this.idSelected > 0) {
      await this.service.getDetail(this.idSelected)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data.soBbQd) {
              this.maHauTo = '/' + res.data.soBbQd?.split("/")[1];
              res.data.soBbQd = res.data.soBbQd?.split("/")[0];
            }
            // this.formData.patchValue(res.data);
            this.helperService.bidingDataInFormGroupAndNotTrigger(this.formData, res.data, ['paXuatGaoChuyenXc', 'mucDichXuat']);
            this.formData.value.quyetDinhPdDtl.forEach(s => s.idVirtual = uuidv4());
            if (this.formData.value.paXuatGaoChuyenXc) {
              await this.buildTableViewChuyenXc();
              if (this.phuongAnHdrView[0]) {
                await this.selectRow(this.phuongAnHdrView[0])
              }
            }
            else {
              await this.buildTableView();
            }
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        tenVthh: TEN_LOAI_VTHH.THOC,
        tenLoaiVthh: TEN_LOAI_VTHH.THOC,
        loaiVthh: LOAI_HANG_DTQG.THOC,
        tenDvi: this.userInfo.TEN_DVI,
        kieuNhapXuat: 'Xuất không thu tiền',
        loaiNhapXuat: 'Xuất cấp',
        type: 'XC',
        donViTinh: "kg"
      })
    }
  }
  async selectRow(item) {
    if (!item.selected) {
      this.phuongAnHdrView.forEach(i => i.selected = false);
      item.selected = true;
      // this.phuongAnView = (this.phuongAnHdrView.find(s => s.soDx == item.soDx)).childData;
      // this.phuongAnViewCache = (this.phuongAnHdrViewCache.find(s => s.soDx == item.soDx)).childData;
      const findndex = this.phuongAnHdrView.findIndex(s => s.soDx == item.soDx);
      this.phuongAnView = this.phuongAnHdrView[findndex]?.childData ? this.phuongAnHdrView[findndex].childData : [];
      this.loaiNhapXuat = this.phuongAnHdrView[findndex]?.loaiNhapXuat;
      this.kieuNhapXuat = this.phuongAnHdrView[findndex]?.kieuNhapXuat;
      await this.tinhTong();
    }
  }
  tinhTong() {
    const { tongSoLuongDx, tongSoLuong, tongSlXuatCap, tongNhuCauXuat } = this.phuongAnView.reduce((obj, cur) => {
      obj.tongSoLuongDx += cur.soLuongDx ? cur.soLuongDx : 0;
      obj.tongSoLuong += cur.soLuong ? cur.soLuong : 0;
      obj.tongSlXuatCap += cur.soLuongXc ? cur.soLuongXc : 0;
      obj.tongNhuCauXuat += cur.soLuongXc ? cur.soLuongNhuCauXuat : 0;
      return obj
    }, { tongSoLuongDx: 0, tongSoLuong: 0, tongSlXuatCap: 0, tongNhuCauXuat: 0 });
    this.tongSoLuongDx = tongSoLuongDx;
    this.tongSoLuong = tongSoLuong;
    this.tongSlXuatCap = tongSlXuatCap;
    this.tongNhuCauXuat = tongNhuCauXuat;
  }
  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = {
      ...this.formData.value,
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null
    }
    await this.createUpdate(body, null, null, ['paXuatGaoChuyenXc', 'mucDichXuat']);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThaiHienTai: string, msg: string, msgSuccess?: string) {
    let trangThai;
    if (trangThaiHienTai == STATUS.DU_THAO || trangThaiHienTai == STATUS.TU_CHOI_LDV || trangThaiHienTai == STATUS.TU_CHOI_LDTC) {
      trangThai = STATUS.CHO_DUYET_LDV;
    };
    let body = { ...this.formData.value, soBbQd: this.formData.value.soBbQd + this.maHauTo }
    await super.saveAndSend(body, trangThai, msg, msgSuccess, ['paXuatGaoChuyenXc', 'mucDichXuat']);
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

  async themPhuongAn(data?: any, level?: any) {
    this.formDataDtl.reset();
    if (data) {
      if (level == 0) {
        this.formDataDtl.patchValue({
          noiDungDx: data.noiDungDx, idDonViNhan: data.idDonViNhan, loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh
        });
      } else if (level == 1) {
        data.edit = level;
        this.formDataDtl.patchValue(data);
      }
    } else {
      this.formDataDtl.patchValue({
        idVirtual: uuidv4(),
        loaiVthh: this.formData.value.loaiVthh,
        tenLoaiVthh: this.formData.value.tenLoaiVthh,
      });
    }
    this.modalChiTiet = true;
  }

  async luuPhuongAn() {
    // await this.helperService.ignoreRequiredForm(this.formDataDtl);
    await this.helperService.markFormGroupTouched(this.formDataDtl);
    if (this.formDataDtl.invalid) {
      return;
    }
    let row = this.formDataDtl.value;
    let quyetDinhPdDtl = this.formData.value.quyetDinhPdDtl;
    if (row.edit == 0) {
      quyetDinhPdDtl.forEach(s => {
        if (s.noiDungDx === row.noiDungOld) {
          s.noiDungDx = row.noiDungDx;
        }
      });
    } else {
      let exist = this.formData.value.quyetDinhPdDtl.find(s => s.idVirtual === row.idVirtual) ||
        this.formData.value.quyetDinhPdDtl.find(s => s.noiDungDx === row.noiDungDx && s.maDvi === row.maDvi && s.loaiVthh === row.loaiVthh && s.cloaiVthh === '') ||
        this.formData.value.quyetDinhPdDtl.find(s => s.noiDungDx === row.noiDungDx && s.maDvi === row.maDvi && s.loaiVthh === row.loaiVthh && s.cloaiVthh === row.cloaiVthh);
      if (exist) {
        Object.assign(exist, row);
      } else {
        quyetDinhPdDtl = [...quyetDinhPdDtl, row];
      }
    }
    this.formData.patchValue({ quyetDinhPdDtl: quyetDinhPdDtl });
    await this.buildTableView();
    await this.huyPhuongAn();
    await this.helperService.restoreRequiredForm(this.formDataDtl);
  }

  async huyPhuongAn() {
    this.formDataDtl.reset();
    this.modalChiTiet = false;
  }


  async xoaPhuongAn(data: any, dataParent?: any) {
    let quyetDinhPdDtl = this.formData.value.quyetDinhPdDtl;
    if (data.idVirtual) {
      quyetDinhPdDtl = quyetDinhPdDtl.filter(s => s.idVirtual != data.idVirtual);
    } else if (dataParent) {
      quyetDinhPdDtl = quyetDinhPdDtl.filter(s => !(s.tenLoaiVthh === data.tenLoaiVthh && s.noiDungDx === dataParent.noiDungDx));
    } else if (data.noiDungDx) {
      quyetDinhPdDtl = quyetDinhPdDtl.filter(s => s.noiDungDx !== data.noiDungDx);
    }
    this.formData.patchValue({ quyetDinhPdDtl: quyetDinhPdDtl });
    await this.buildTableView();
  }

  async buildTableView() {
    let dataView = chain(this.formData.value.quyetDinhPdDtl)
      .groupBy("noiDungDx")
      .map((value, key) => {
        const rs = value.find(f => f.noiDungDx === key);
        if (!rs) return;
        return {
          idVirtual: uuidv4(),
          noiDungDx: key,
          soLuong: 0,
          childData: value,
          idDonViNhan: rs.idDonViNhan,
          loaiVthh: rs.loaiVthh,
          tenLoaiVthh: rs.tenLoaiVthh
        };
      }).value().filter(f => !!f);
    this.phuongAnView = dataView
    this.expandAll();
  }
  async buildTableViewChuyenXc() {
    this.phuongAnHdrView = chain(this.formData.value.quyetDinhPdDtl)
      .groupBy("soDx")
      .map((value, key) => {
        const row = value.find(f => f.soDx === key);
        if (!row) return;
        const soLuong = value.reduce((sum, cur) => sum += cur.soLuong, 0);
        return {
          idVirtual: uuidv4(),
          soDx: key,
          ngayKyDx: row.ngayKyDx,
          trichYeuDx: row.trichYeuDx,
          tenDvi: row.tenDvi,
          soLuong: soLuong,
          childData: value
        };
      }).value().filter(f => !!f);
    this.expandAll();
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

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI.substring(0, 4),
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDonVi = res.data.map(f => ({ ...f, idDonViNhan: f.id }));
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsMucDichXuat() {
    this.listMucDichXuat = [];
    let res = await this.danhMucService.danhMucChungGetAll('MUC_DICH_CT_VT');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listMucDichXuat = res.data;
    }
  }

  async changeMaDviDtl($event) {
    if ($event) {
      let item = this.listDonVi.find(s => s.maDvi === $event);
      this.formDataDtl.patchValue({
        tenDvi: item.tenDvi,
        idDonViNhan: item.idDonViNhan
      })
      await this.kiemTraTonKho();
    }
  }

  async kiemTraTonKho() {
    let maDvi = this.formDataDtl.value.maDvi;
    let loaiVthh = this.formDataDtl.value.loaiVthh;
    if (maDvi) {
      // await this.quanLyHangTrongKhoService.getTrangThaiHt({
      //   maDvi: maDvi,
      //   loaiVthh: loaiVthh,
      //   // cloaiVthh: cloaiVthh
      // }).then((res) => {
      //   if (res.msg == MESSAGE.SUCCESS) {
      //     let data = res.data;
      //     if (data.length > 0) {
      //       let tonKhoLoaiVthh = data.reduce((prev, cur) => prev + cur.slHienThoi, 0);
      //       this.formDataDtl.patchValue({
      //         tonKhoLoaiVthh: tonKhoLoaiVthh,
      //       });
      //       this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(tonKhoLoaiVthh)]);
      //       this.formDataDtl.controls['soLuong'].updateValueAndValidity();
      //     } else {
      //       this.formDataDtl.patchValue({ tonKhoLoaiVthh: 0, tonKhoCloaiVthh: 0 });
      //       this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(0)]);
      //       this.formDataDtl.controls['soLuong'].updateValueAndValidity();
      //     }
      //   }
      // });
      const body = { maDvi, maVthh: loaiVthh }
      const res = await this.mangLuoiKhoService.slTon(body);
      if (res.msg === MESSAGE.SUCCESS) {
        const slTon = res.data;
        this.formDataDtl.patchValue({ tonKhoLoaiVthh: slTon });
        this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(slTon)]);
        this.formDataDtl.controls['soLuong'].updateValueAndValidity();
      } else {
        this.formDataDtl.patchValue({ tonKhoLoaiVthh: 0 });
        this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(0)]);
        this.formDataDtl.controls['soLuong'].updateValueAndValidity();
      }
    }
  }

  async reject(id: number, trangThaiHienTai: string, roles?): Promise<void> {
    let trangThai;
    if (trangThaiHienTai == STATUS.CHO_DUYET_LDV) {
      trangThai = STATUS.TU_CHOI_LDV;
    } else if (trangThaiHienTai == STATUS.CHO_DUYET_LDTC) {
      trangThai = STATUS.TU_CHOI_LDTC;
    }
    return super.reject(id, trangThai, roles);
  }

  async approve(id: number, trangThaiHienTai: string, msg: string, roles?: any, msgSuccess?: string): Promise<void> {
    let trangThai
    if (trangThaiHienTai == STATUS.CHO_DUYET_LDV) {
      trangThai = STATUS.CHO_DUYET_LDTC;
    } else if (trangThaiHienTai == STATUS.CHO_DUYET_LDTC) {
      trangThai = STATUS.BAN_HANH;
    }
    return super.approve(id, trangThai, msg, roles, msgSuccess);
  }

  async openDialogQdPd() {
    try {
      await this.spinner.show();
      let res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.search({
        trangThai: STATUS.DA_DUYET_LDTC,
        idQdGnvNull: true,
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0
        },
      });
      if (res.msg == MESSAGE.SUCCESS) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định phê duyệt cứu trợ, viện trợ',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data.content,
            dataHeader: ['Số quyết định', 'Ngày phê duyệt', 'Trích yếu'],
            dataColumn: ['soBbQd', 'ngayPduyet', 'trichYeu']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            let res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDetail(data.id);
            await this.bindingDataQdPd(res.data);
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
  async bindingDataQdPd(data: any) {
    data.quyetDinhPdDtl.forEach(s => {
      if (s.soLuongXc) {

      }
    });
    /*data.quyetDinhPdDtl.forEach(s => {
      s.idQdPdDtl = s.id;
      s.soLuongDx = s.soLuong;
      s.soLuong = 0;
      delete s.id;
    });
    this.formData.patchValue({
      idXc: data.id,
      soXc: data.soBbQd,
      dataDtl: data.quyetDinhPdDtl
    })*/
  }
  async openDialogTrQdPaXuatCapChange() {
    await this.spinner.show();
    // Get data tờ trình
    try {
      let res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.search({
        xuatCap: true,
        trangThai: STATUS.BAN_HANH,
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0
        },
      });
      if (res.msg == MESSAGE.SUCCESS) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định phương án đồng ý xuất cấp',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data.content,
            dataHeader: ['Số quyết định', 'Ngày ký quyết định', 'Mục đích xuất'],
            dataColumn: ['soBbQd', 'ngayKy', 'mucDichXuat']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            let res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDetail(data.id);
            let detail = res.data;
            detail.quyetDinhPdDtl = detail.quyetDinhPdDtl.filter(item => item.soLuongXc > 0);
            detail.quyetDinhPdDtl.forEach(s => {
              // s.soLuong = s.soLuongXc;
              s.tenVthh = detail.tenVthh;
            });
            // if (!this.formData.value.id) {
            //   this.formData.patchValue({ quyetDinhPdDtl: detail.quyetDinhPdDtl });
            // }

            // data.idDx = data.id;
            // data.paXuatGaoChuyenXc = true;
            // data.qdPaXuatCap = res.data.soBbQd;
            // data.qdPaXuatCapId = res.data.id;
            // delete data.id;
            // delete data.soBbQd;
            // delete data.ngayHluc;
            // delete data.tenVthh;
            // delete data.loaiNhapXuat;
            // delete data.kieuNhapXuat;
            // delete data.idDx;
            // delete data.soDx;
            // delete data.ngayKy;
            // delete data.trangThai;
            // delete data.tenTrangThai;
            // delete data.type;
            // delete data.canCu;
            // delete data.fileDinhKem;
            // delete data.trichYeu;
            // delete data.quyetDinhPdDtl;
            const idDx = data.id;
            const qdPaXuatCap = detail.soBbQd;
            const qdPaXuatCapId = detail.id;

            // this.formData.patchValue(data);
            this.formData.patchValue({ idDx, qdPaXuatCap, qdPaXuatCapId, quyetDinhPdDtl: detail.quyetDinhPdDtl, ngayKetThuc: detail.ngayKetThuc });
            this.formData.controls['mucDichXuat'].setValue(detail.mucDichXuat, { emitEvent: false });
            this.formData.value.quyetDinhPdDtl.forEach(s => delete s.id);
            // await this.buildTableView();
            await this.buildTableViewChuyenXc();
            if (this.phuongAnHdrView[0]) {
              this.selectRow(this.phuongAnHdrView[0])
            }
            // await this.expandAll();
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
  async xemTruocPd(id, tenBaoCao, children) {
    await this.quyetDinhPheDuyetPhuongAnCuuTroService.preview({
      tenBaoCao: tenBaoCao + '.docx',
      id: id,
      children: children
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
