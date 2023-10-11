import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Base2Component } from "src/app/components/base2/base2.component";
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
import * as dayjs from "dayjs";
import { FormGroup, Validators } from "@angular/forms";
import { FileDinhKem } from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import { STATUS } from "src/app/constants/status";
import { chain, cloneDeep } from 'lodash';
import { MESSAGE } from "src/app/constants/message";
import { v4 as uuidv4 } from "uuid";
import { QuanLyHangTrongKhoService } from "src/app/services/quanLyHangTrongKho.service";
import { LOAI_HANG_DTQG, TEN_LOAI_VTHH } from "src/app/constants/config";
import { PREVIEW } from 'src/app/constants/fileType';
import { MangLuoiKhoService } from 'src/app/services/qlnv-kho/mangLuoiKho.service';


@Component({
  selector: 'app-chi-tiet-de-xuat',
  templateUrl: './chi-tiet-de-xuat.component.html',
  styleUrls: ['./chi-tiet-de-xuat.component.scss']
})
export class ChiTietDeXuatComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
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
  templateName: string = "Đề xuất cứu trợ, viện trợ";
  constructor(httpClient: HttpClient,
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
    private mangLuoiKhoService: MangLuoiKhoService,
    private cdr: ChangeDetectorRef,) {

    super(httpClient, storageService, notification, spinner, modal, deXuatPhuongAnCuuTroService);
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.formData = this.fb.group(
      {
        id: [''],
        nam: [dayjs().get("year")],
        maDvi: [''],
        loaiNhapXuat: [''],
        kieuNhapXuat: [''],
        mucDichXuat: [''],
        soDx: [''],
        trichYeu: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        tenVthh: [''],
        ngayDx: [''],
        ngayKetThuc: [''],
        noiDung: [''],
        trangThai: [STATUS.DU_THAO],
        idThop: [''],
        maTongHop: [''],
        idQdPd: [''],
        soQdPd: [''],
        ngayKyQd: [''],
        tongSoLuong: [''],
        tongSoLuongDeXuat: [0, [Validators.required, Validators.min(0)]],
        soLuongXuatCap: [''],
        ngayGduyet: [''],
        nguoiGduyetId: [''],
        ngayPduyet: [''],
        nguoiPduyetId: [''],
        lyDoTuChoi: [''],
        type: [''],
        mapDmucDvi: [''],
        tenDvi: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenTrangThai: ['Dự Thảo'],
        tenTrangThaiTh: [''],
        tenTrangThaiQd: [''],
        canCu: [new Array<FileDinhKem>()],
        deXuatPhuongAn: [new Array()],
        donViTinh: [''],
        tongSoLuongXuatCap: [0],
        tongSoLuongNhuCauXuat: [0]
      }
    );

    this.formDataDtl = this.fb.group(
      {
        idVirtual: [''],
        noiDungOld: [],
        id: [''],
        noiDung: ['', [Validators.required]],
        loaiVthh: ['', [Validators.required]],
        cloaiVthh: [''],
        maDvi: [''],
        tonKhoDvi: [''],
        tonKhoLoaiVthh: [''],
        tonKhoCloaiVthh: [''],
        donViTinh: [''],
        soLuong: [0, [Validators.required, Validators.min(1)]],
        mapVthh: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        mapDmucDvi: [''],
        tenDvi: [''],
        edit: [],
        soLuongNhuCauXuat: [0],
        soLuongConThieu: [0],
        soLuongChuyenCapThoc: [0],
      });
    this.formData.controls['deXuatPhuongAn'].valueChanges.subscribe(value => {
      const { tongSoLuongDeXuat, tongSoLuongXuatCap, tongSoLuongNhuCauXuat } = Array.isArray(value) ? value.reduce((obj, cur) => {
        obj.tongSoLuongDeXuat += cur.soLuong ? +cur.soLuong : 0;
        obj.tongSoLuongXuatCap += cur.soLuongChuyenCapThoc ? +cur.soLuongChuyenCapThoc : 0;
        obj.tongSoLuongNhuCauXuat += cur.soLuongNhuCauXuat ? cur.soLuongNhuCauXuat : 0
        return obj;
      }, { tongSoLuongDeXuat: 0, tongSoLuongXuatCap: 0, tongSoLuongNhuCauXuat: 0 }) : { tongSoLuongDeXuat: 0, tongSoLuongXuatCap: 0, tongSoLuongNhuCauXuat: 0 };
      this.formData.controls["tongSoLuongDeXuat"].setValue(tongSoLuongDeXuat);
      this.formData.controls["tongSoLuongXuatCap"].setValue(tongSoLuongXuatCap);
      this.formData.controls["tongSoLuongNhuCauXuat"].setValue(tongSoLuongNhuCauXuat)

    });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/ĐXCTVT-' + this.userInfo.DON_VI.tenVietTat;
      await Promise.all([
        this.loadDsDonVi(),
        this.loadDsDiaDanh(),
        this.loadDsVthh(),
        this.loadDsMucDichXuat()
      ]);
      await this.loadDetail();
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
            if (res.data.soDx) {
              this.maHauTo = '/' + res.data.soDx?.split("/")[1];
              res.data.soDx = res.data.soDx?.split("/")[0];
            }
            this.formData.patchValue(res.data);
            if (!this.isVthhVatuThietBi()) {
              this.formData.patchValue({ donViTinh: "kg" })
            }
            this.formData.value.deXuatPhuongAn.forEach(s => s.idVirtual = uuidv4());
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
        tenVthh: TEN_LOAI_VTHH.GAO,
        loaiVthh: LOAI_HANG_DTQG.GAO,
        tenDvi: this.userInfo.TEN_DVI,
        kieuNhapXuat: 'Xuất không thu tiền',
        loaiNhapXuat: 'Xuất cứu trợ',
        donViTinh: 'kg'
      })
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = {
      ...this.formData.value,
      deXuatPhuongAn: cloneDeep(this.formData.value.deXuatPhuongAn).map(f => ({
        ...f, soLuongChuyenCapThoc: f.soLuongChuyenCapThoc ? f.soLuongChuyenCapThoc : 0,
        soLuongConThieu: f.soLuongConThieu ? f.soLuongConThieu : 0, soLuongNhuCauXuat: f.soLuongNhuCauXuat ? f.soLuongNhuCauXuat : 0
      })),
      soDx: this.formData.value.soDx ? this.formData.value.soDx + this.maHauTo : null
    }
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    let body = { ...this.formData.value, soDx: this.formData.value.soDx + this.maHauTo }
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
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
    console.log("aaa them")
    this.formDataDtl.reset();
    if (data) {
      if (level == 0) {
        this.formDataDtl.patchValue({ noiDung: data.noiDung });
      } else if (level == 1) {
        this.formDataDtl.patchValue({
          idVirtual: uuidv4(),
          noiDung: data.noiDung,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          maDvi: data.maDvi,
          edit: level
        });
      } else if (level == 2) {
        data.edit = level;
        this.formDataDtl.patchValue(data);
      } else if (level === 3) {
        this.formDataDtl.patchValue({ noiDung: data.noiDung, loaiVthh: data.childData[0]?.loaiVthh, tenLoaiVthh: data.childData[0]?.tenLoaiVthh });
      } else if (level === 5) {
        this.formDataDtl.patchValue({
          idVirtual: uuidv4(),
          noiDung: data.noiDung,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          maDvi: data.maDvi,
        });
      }
    } else {
      this.formDataDtl.patchValue({
        idVirtual: uuidv4(),
        loaiVthh: this.listLoaiHangHoa[0].ma,
        tenLoaiVthh: this.listLoaiHangHoa[0].ten,
      });
    }
    // await this.changeLoaiVthh(this.formDataDtl.value.loaiVthh);
    if (this.userService.isCuc()) {
      this.formDataDtl.patchValue({ maDvi: this.userInfo.MA_DVI });
      await this.changeMaDviDtl(this.userInfo.MA_DVI);
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
    let deXuatPhuongAn = this.formData.value.deXuatPhuongAn;
    if (row.edit == 0) {
      deXuatPhuongAn.forEach(s => {
        if (s.noiDung === row.noiDungOld) {
          s.noiDung = row.noiDung;
        }
      });
    } else {
      let exist =
        // this.formData.value.deXuatPhuongAn.find(s => s.idVirtual === row.idVirtual) ||
        this.formData.value.deXuatPhuongAn.find(s => s.noiDung === row.noiDung && s.maDvi === row.maDvi && s.loaiVthh === row.loaiVthh && s.cloaiVthh === '') ||
        this.formData.value.deXuatPhuongAn.find(s => s.noiDung === row.noiDung && s.maDvi === row.maDvi && s.loaiVthh === row.loaiVthh && s.cloaiVthh === row.cloaiVthh);
      if (exist) {
        Object.assign(exist, row);
      } else {
        deXuatPhuongAn = [...deXuatPhuongAn, row];
      }/*
      let existRowIndex = deXuatPhuongAn.findIndex(s => s.idVirtual === row.idVirtual);
      if (existRowIndex !== -1) {
        deXuatPhuongAn[existRowIndex] = row;
      } else {
        deXuatPhuongAn = [...deXuatPhuongAn, row];
      }*/
    }
    this.formData.patchValue({ deXuatPhuongAn: deXuatPhuongAn });
    await this.buildTableView();
    await this.huyPhuongAn();
    await this.helperService.restoreRequiredForm(this.formDataDtl);
  }

  async huyPhuongAn() {
    this.formDataDtl.reset();
    this.modalChiTiet = false;
  }


  async xoaPhuongAn(data: any, dataParent?: any, level?: any) {
    let deXuatPhuongAn = this.formData.value.deXuatPhuongAn;
    if (level == 3) {
      deXuatPhuongAn = deXuatPhuongAn.filter(s => s.idVirtual != data.idVirtual);
    } else if (level == 2) {
      deXuatPhuongAn = deXuatPhuongAn.filter(s => !(s.tenLoaiVthh === data.tenLoaiVthh && s.noiDung === dataParent.noiDung));
    } else if (level == 1) {
      deXuatPhuongAn = deXuatPhuongAn.filter(s => s.noiDung !== data.noiDung);
    }

    this.formData.patchValue({ deXuatPhuongAn: deXuatPhuongAn });
    await this.buildTableView();
  }

  async buildTableView() {
    let dataView = [];
    if (this.formData.value.tenVthh !== "Vật tư thiết bị") {
      if (!this.userService.isTongCuc()) {
        dataView = cloneDeep(this.formData.value.deXuatPhuongAn)
      } else {
        dataView = chain(this.formData.value.deXuatPhuongAn)
          .groupBy("noiDung")
          .map((value, key) => {
            let rs = value.find(f => f.noiDung === key);
            return {
              idVirtual: uuidv4(),
              noiDung: key,
              soLuong: rs ? value.reduce((sum, cur) => sum += cur.soLuong ? cur.soLuong : 0, 0) : 0,
              childData: rs ? value : [],
              soLuongNhuCauXuat: rs ? value.reduce((sum, cur) => sum += cur.soLuongNhuCauXuat ? cur.soLuongNhuCauXuat : 0, 0) : 0,
              soLuongChuyenCapThoc: rs ? value.reduce((sum, cur) => sum += cur.soLuongChuyenCapThoc ? cur.soLuongChuyenCapThoc : 0, 0) : 0,
            };
          }).value();
      }
    } else {

      dataView = chain(this.formData.value.deXuatPhuongAn)
        .groupBy("noiDung")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("loaiVthh")
            .map((v, k) => {
              let row = v.find(s => s.loaiVthh === k);
              let tonKho = v.reduce((prev, next) => prev + next.tonKho, 0);
              let soLuong = v.reduce((prev, next) => prev + next.soLuong, 0);
              let tonKhoLoaiVthh = v[0]?.tonKhoLoaiVthh ? v[0].tonKhoLoaiVthh : 0;
              return {
                idVirtual: uuidv4(),
                loaiVthh: k,
                tenLoaiVthh: row?.tenLoaiVthh,
                cloaiVthh: row?.cloaiVthh,
                tenCloaiVthh: row?.tenCloaiVthh,
                noiDung: row.noiDung,
                tonKho: tonKho,
                soLuong: soLuong,
                donViTinh: row?.donViTinh,
                tonKhoLoaiVthh,
                childData: v
              }
            }
            ).value();
          return {
            idVirtual: uuidv4(),
            noiDung: key,
            soLuong: 0,
            childData: rs
          };
        }).value();
    }
    this.phuongAnView = dataView;
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
      this.listDonVi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.loadDanhMucHangHoaAsync();
    if (res.msg == MESSAGE.SUCCESS) {
      // this.listVatTuHangHoa = res.data?.filter((x) => (x.ma.length == 2 && !x.ma.match("^01.*")) || (x.ma.length == 4 && x.ma.match("^02.*")));
      this.listVatTuHangHoa = res.data;
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
    console.log("eve")
    if ($event) {
      let item = this.listDonVi.find(s => s.maDvi === $event);
      this.formDataDtl.patchValue({
        tenDvi: item.tenDvi
      })
      await this.kiemTraTonKho();
    }
  }

  async kiemTraTonKho() {
    // let maDvi = this.formDataDtl.value.maDvi || this.userInfo.MA_DVI;
    let maDvi = this.formDataDtl.value.maDvi;
    let loaiVthh = this.formDataDtl.value.loaiVthh;
    let cloaiVthh = this.formDataDtl.value.cloaiVthh;
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
      //       let dataCloai = data.filter(s => s.cloaiVthh == cloaiVthh);
      //       let tonKhoCloaiVthh = dataCloai.reduce((prev, cur) => prev + cur.slHienThoi, 0);
      //       this.formDataDtl.patchValue({
      //         tonKhoLoaiVthh: tonKhoLoaiVthh,
      //         tonKhoCloaiVthh: tonKhoCloaiVthh
      //       });
      //       cloaiVthh ?
      //         this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(tonKhoCloaiVthh)]) :
      //         this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(tonKhoLoaiVthh)]);
      //       this.formDataDtl.controls['soLuong'].updateValueAndValidity();
      //     } else {
      //       this.formDataDtl.patchValue({ tonKhoLoaiVthh: 0, tonKhoCloaiVthh: 0 });
      //       this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(0)]);
      //       this.formDataDtl.controls['soLuong'].updateValueAndValidity();
      //     }
      //   }
      // });
      const body = { maDvi, maVthh: cloaiVthh ? cloaiVthh : loaiVthh }
      const res = await this.mangLuoiKhoService.slTon(body);
      let tonKhoLoaiVthh: number = 0;
      let tonKhoCloaiVthh: number = 0
      if (res.msg === MESSAGE.SUCCESS) {
        const slTon = res.data;
        tonKhoLoaiVthh = slTon;
        tonKhoCloaiVthh = slTon;
        this.formDataDtl.patchValue({ tonKhoLoaiVthh, tonKhoCloaiVthh });
        cloaiVthh ?
          this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(tonKhoCloaiVthh)]) :
          this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(tonKhoLoaiVthh)]);
        this.formDataDtl.controls['soLuong'].updateValueAndValidity();
      } else {
        this.formData.patchValue({ tonKhoLoaiVthh: 0 });
        this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(0)]);
        this.formDataDtl.controls['soLuong'].updateValueAndValidity();
      }
    }
  }

  async changeVthh($event) {
    this.listLoaiHangHoa = [];
    if ($event == TEN_LOAI_VTHH.THOC) {
      let listLuongThuc = this.listVatTuHangHoa.find(s => s.key == '01');
      let filter = cloneDeep(listLuongThuc.children.filter(s => s.key == LOAI_HANG_DTQG.THOC));
      Object.assign(this.listLoaiHangHoa, filter);
      this.formDataDtl.patchValue({ loaiVthh: LOAI_HANG_DTQG.THOC, donViTinh: "kg" });
      this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.THOC, donViTinh: "kg" });
    } else if ($event == TEN_LOAI_VTHH.GAO) {
      let listLuongThuc = this.listVatTuHangHoa.find(s => s.key == '01');
      let filter = cloneDeep(listLuongThuc.children.filter(s => s.key == LOAI_HANG_DTQG.GAO));
      Object.assign(this.listLoaiHangHoa, filter);
      this.formDataDtl.patchValue({ loaiVthh: LOAI_HANG_DTQG.GAO, donViTinh: "kg" });
      this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.GAO, donViTinh: "kg" });
    } else if ($event == TEN_LOAI_VTHH.MUOI) {
      let filter = cloneDeep(this.listVatTuHangHoa.find(s => s.key == LOAI_HANG_DTQG.MUOI));
      Object.assign(this.listLoaiHangHoa, filter.children);
      this.formDataDtl.patchValue({ loaiVthh: LOAI_HANG_DTQG.MUOI, donViTinh: "kg" });
      this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.MUOI, donViTinh: "kg" });
    } else {
      let filter = cloneDeep(this.listVatTuHangHoa.find(s => s.key == LOAI_HANG_DTQG.VAT_TU));
      Object.assign(this.listLoaiHangHoa, filter.children);
      this.formDataDtl.patchValue({ loaiVthh: LOAI_HANG_DTQG.VAT_TU, donViTinh: null });
      this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.VAT_TU, donViTinh: null });
    }
    this.formData.patchValue({ deXuatPhuongAn: [] });
    // await this.kiemTraTonKho();
  }

  async changeLoaiVthh($event) {
    try {
      if ($event) {
        this.listChungLoaiHangHoa = [];
        let filter = cloneDeep(this.listLoaiHangHoa.find(s => s.key == $event));
        if (filter.children) {
          this.listChungLoaiHangHoa = filter.children;
        }
        let item = this.listLoaiHangHoa.find(s => s.ma === $event);
        this.formDataDtl.patchValue({
          tenLoaiVthh: item.ten,
          donViTinh: item.maDviTinh
        });
      }
      await this.kiemTraTonKho();
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

  async changeCloaiVthh($event) {
    if ($event) {
      let item = this.listChungLoaiHangHoa.find(s => s.ma === $event);
      this.formDataDtl.patchValue({
        tenCloaiVthh: item.ten
      });
    }
    await this.kiemTraTonKho();
  }

  soLuongNhuCauXuatChange($event) {
    // (tính soLuongConThieu = nếu (Nhu cầu xuất cứu trợ  - sl xuất cứu trợ đề xuất ) > 0 thì (Nhu cầu xuất cứu trợ  - sl xuất cứu trợ đề xuất ) ngược lại  = 0 )
    if (this.formDataDtl.value.soLuongNhuCauXuat > this.formDataDtl.value.soLuong) {
      let soLuongConThieu = this.formDataDtl.value.soLuongNhuCauXuat - this.formDataDtl.value.soLuong;
      if (soLuongConThieu < 0) {
        soLuongConThieu = 0;
      }
      this.formDataDtl.patchValue({
        soLuongConThieu: soLuongConThieu,
        soLuongChuyenCapThoc: soLuongConThieu
      });
    }
  }

  isVthhGao() {
    if (this.formData.value.tenVthh == "Gạo tẻ") {
      return true;
    }
    return false;
  }
  isVthhVatuThietBi() {
    if (this.formData.value.tenVthh == "Vật tư thiết bị") {
      return true;
    }
    return false
  }
  genCuuTroVienTro() {
    if (this.formData.value.loaiNhapXuat === 'Xuất viện trợ') {
      return "viện trợ"
    } else {
      return "cứu trợ"
    }
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
