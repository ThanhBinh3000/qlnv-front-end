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
import { chain, cloneDeep, uniqBy, groupBy } from 'lodash';
import { MESSAGE } from "src/app/constants/message";
import { v4 as uuidv4 } from "uuid";
import { QuanLyHangTrongKhoService } from "src/app/services/quanLyHangTrongKho.service";
import { LOAI_HANG_DTQG, TEN_LOAI_VTHH } from "src/app/constants/config";
import { PREVIEW } from 'src/app/constants/fileType';
import { MangLuoiKhoService } from 'src/app/services/qlnv-kho/mangLuoiKho.service';
import { DataService } from 'src/app/services/data.service';
import { AMOUNT_ONE_DECIMAL } from 'src/app/Utility/utils';


@Component({
  selector: 'app-chi-tiet-de-xuat',
  templateUrl: './chi-tiet-de-xuat.component.html',
  styleUrls: ['./chi-tiet-de-xuat.component.scss']
})
export class ChiTietDeXuatComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  @Output() taoQuyetDinh = new EventEmitter<any>();
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
  listDviNhan: any[] = [];
  listQuocGia: any[] = [];
  listDiaDanhHanhChinh: any[] = [];
  editSoLuongNhuCauXuat: boolean = false;
  amount1 = { ...AMOUNT_ONE_DECIMAL, align: "left" };
  listNamNhap: Array<{ value: number, text: number, soLuong: number }> = [];
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
    private cdr: ChangeDetectorRef,
    private dataService: DataService
  ) {

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
        mucDichXuat: ['', [Validators.required]],
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
        tongSoLuongNhuCauXuat: [0],
        tonKhoDvi: [0],
        maDviDx: [0],
        ngayTapKet: [],
        ngayGiaoHang: []
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
        maDvi: ['', [Validators.required]],
        tonKhoDvi: [''],
        tonKhoLoaiVthh: [''],
        tonKhoCloaiVthh: [''],
        donViTinh: [''],
        soLuong: [0, [Validators.required, Validators.min(1)]],
        mapVthh: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        mapDmucDvi: [''],
        tenDvi: ['', [Validators.required]],
        edit: [],
        soLuongNhuCauXuat: [0],
        soLuongConThieu: [0],
        soLuongChuyenCapThoc: [0],
        idDonViNhan: [''],
        editNhuCauXuat: [],
        namNhap: [, [Validators.required]],
      });
    this.formData.controls['deXuatPhuongAn'].valueChanges.subscribe(value => {
      // const { tongSoLuongDeXuat, tongSoLuongXuatCap, tongSoLuongNhuCauXuat } = Array.isArray(value) ? value.reduce((obj, cur) => {
      //   obj.tongSoLuongDeXuat += cur.soLuong ? +cur.soLuong : 0;
      //   // obj.tongSoLuongDeXuat += this.formData.value.tenVthh === TEN_LOAI_VTHH.GAO ? (cur.soLuongNhuCauXuat ? cur.soLuongNhuCauXuat : 0) : (cur.soLuong ? +cur.soLuong : 0)
      //   obj.tongSoLuongXuatCap += cur.soLuongChuyenCapThoc ? +cur.soLuongChuyenCapThoc : 0;
      //   obj.tongSoLuongNhuCauXuat += cur.soLuongNhuCauXuat ? cur.soLuongNhuCauXuat : 0
      //   return obj;
      // }, { tongSoLuongDeXuat: 0, tongSoLuongXuatCap: 0, tongSoLuongNhuCauXuat: 0 }) : { tongSoLuongDeXuat: 0, tongSoLuongXuatCap: 0, tongSoLuongNhuCauXuat: 0 };
      const tongSoLuongDeXuat = Array.isArray(value) ? value.reduce((sum, cur) => sum += cur.soLuong ? cur.soLuong : 0, 0) : 0;
      const { tongSoLuongXuatCap, tongSoLuongNhuCauXuat } = Array.isArray(value) ? uniqBy(value, 'noiDung').reduce((obj, cur) => {
        obj.tongSoLuongXuatCap += cur.soLuongChuyenCapThoc ? +cur.soLuongChuyenCapThoc : 0;
        obj.tongSoLuongNhuCauXuat += cur.soLuongNhuCauXuat ? cur.soLuongNhuCauXuat : 0
        return obj;
      }, { tongSoLuongXuatCap: 0, tongSoLuongNhuCauXuat: 0 }) : { tongSoLuongXuatCap: 0, tongSoLuongNhuCauXuat: 0 };
      this.formData.controls["tongSoLuongDeXuat"].setValue(tongSoLuongDeXuat);
      this.formData.controls["tongSoLuongXuatCap"].setValue(tongSoLuongXuatCap);
      this.formData.controls["tongSoLuongNhuCauXuat"].setValue(tongSoLuongNhuCauXuat)

    });
    this.formData.controls["loaiNhapXuat"].valueChanges.subscribe(async (value) => {
      if (value === "Xuất cứu trợ") {
        if (Array.isArray(this.listDiaDanhHanhChinh) && this.listDiaDanhHanhChinh.length <= 0) {
          await Promise.all([this.loadDsDiaDanh(), this.loadDsDonViNhanCTVT("DON_VI_NHAN_CTVT")]);
        }
        this.listDiaDanh = [...this.listDiaDanhHanhChinh, ...this.listDviNhan]

      } else if (value === "Xuất viện trợ") {
        if (Array.isArray(this.listQuocGia) && this.listQuocGia.length <= 0) {
        } await this.loadDsQuocGiaNhanCTVT("QUOC_GIA");

        this.listDiaDanh = [...this.listQuocGia]
      } else {
        this.listDiaDanh = [];
      }
    });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      if (this.userService.isTongCuc()) {
        this.maHauTo = '/TTr-QLHDT';
      } else {
        this.maHauTo = '/ĐXCTVT-' + this.userInfo.DON_VI.tenVietTat;
      }
      await Promise.all([
        this.loadDsDonVi(),
        // this.loadDsDiaDanh(),
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
            this.formData.patchValue({ ...res.data, tenDvi: res.data.tenDvi ? res.data.tenDvi : res.data.tenDviDx, maDviDx: res.data.maDvi.slice(0, -2) });
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
        maDvi: this.userInfo.MA_PHONG_BAN,
        maDviDx: this.userInfo.MA_PHONG_BAN,
        tenDvi: !this.userInfo.MA_PHONG_BAN || this.userInfo.MA_PHONG_BAN.length <= 6 ? this.userInfo.TEN_PHONG_BAN : this.userInfo.TEN_DVI,
        kieuNhapXuat: 'Xuất không thu tiền',
        loaiNhapXuat: 'Xuất cứu trợ',
        donViTinh: 'kg'
      });
      console.log(" this.userInfo", this.userInfo)
      if (this.userService.isCuc) {
        this.checkTonKhoDonViTaoDeXuat()
      }
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    this.formData.controls['soDx'].setValidators(Validators.required)
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
    console.log("data", data)
    this.formDataDtl.reset();
    if (data) {
      if (level == 0) {
        this.formDataDtl.patchValue({ noiDung: data.noiDung, idDonViNhan: data.idDonViNhan, editNhuCauXuat: false });
      } else {
        this.formDataDtl.patchValue({
          idVirtual: uuidv4(),
          noiDung: data.noiDung,
          idDonViNhan: data.idDonViNhan,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          maDvi: data.maDvi,
          tenDvi: data.tenDvi,
          soLuongNhuCauXuat: data.soLuongNhuCauXuat,
          editNhuCauXuat: false,
          // edit: true
        });
      }
    } else {
      this.formDataDtl.patchValue({
        idVirtual: uuidv4(),
        loaiVthh: this.listLoaiHangHoa[0].ma,
        tenLoaiVthh: this.listLoaiHangHoa[0].ten,
        editNhuCauXuat: true
      });
    }
    // await this.changeLoaiVthh(this.formDataDtl.value.loaiVthh);
    if (this.userService.isCuc()) {
      this.formDataDtl.patchValue({ maDvi: this.userInfo.MA_DVI });
      await this.changeMaDviDtl(this.userInfo.MA_DVI);
    }
    this.modalChiTiet = true;

    this.listDiaDanh.forEach(f => {
      if (!this.isVthhVatuThietBi()) {
        f.disabled = this.formData.value.deXuatPhuongAn.some(s => s.noiDung === f.ten && (!data?.noiDung || f.ten !== data.noiDung));
      } else {
        delete f.disabled;
      }
    });
  }
  async suaPhuongAn(data?: any, level?: any) {
    this.formDataDtl.reset();
    if (data) {
      if (level === 0) {
        this.formDataDtl.patchValue({ noiDung: data.noiDung, soLuongNhuCauXuat: data.soLuongNhuCauXuat, editNhuCauXuat: true, edit: true });
        this.editSoLuongNhuCauXuat = true;
        this.modalChiTiet = true;
      } else {
        data.edit = true;
        this.formDataDtl.patchValue({ ...data, editNhuCauXuat: false });
        // await this.changeLoaiVthh(this.formDataDtl.value.loaiVthh);
        if (this.userService.isCuc()) {
          this.formDataDtl.patchValue({ maDvi: this.userInfo.MA_DVI });
          await this.changeMaDviDtl(this.userInfo.MA_DVI);
        }
        this.modalChiTiet = true;

        this.listDiaDanh.forEach(f => {
          if (!this.isVthhVatuThietBi()) {
            f.disabled = this.formData.value.deXuatPhuongAn.some(s => s.noiDung === f.ten && (!data?.noiDung || f.ten !== data.noiDung));
          } else {
            delete f.disabled;
          }
        });
      }
    }
  }
  async luuPhuongAn() {
    // await this.helperService.ignoreRequiredForm(this.formDataDtl);
    let row = this.formDataDtl.value;
    let deXuatPhuongAn = this.formData.value.deXuatPhuongAn;
    if (row.editNhuCauXuat && row.edit) {
      this.formData.value.deXuatPhuongAn.forEach(item => {
        if (item.noiDung === row.noiDung) {
          item.soLuongNhuCauXuat = row.soLuongNhuCauXuat;
          item.soLuongConThieu = row.soLuongConThieu;
          item.soLuongChuyenCapThoc = row.soLuongConThieu
        }
      });
    }
    else {
      await this.helperService.markFormGroupTouched(this.formDataDtl);
      if (this.formDataDtl.invalid) {
        return;
      }
      if (row.edit == 0) {
        deXuatPhuongAn.forEach(s => {
          if (s.noiDung === row.noiDungOld) {
            s.noiDung = row.noiDung;
          }
        });
      } else {
        let exist =
          // this.formData.value.deXuatPhuongAn.find(s => s.idVirtual === row.idVirtual) ||
          deXuatPhuongAn.find(s => s.noiDung === row.noiDung && s.maDvi === row.maDvi && s.loaiVthh === row.loaiVthh && s.cloaiVthh === '' && s.namNhap === row.namNhap) ||
          deXuatPhuongAn.find(s => s.noiDung === row.noiDung && s.maDvi === row.maDvi && s.loaiVthh === row.loaiVthh && s.cloaiVthh === row.cloaiVthh && s.namNhap === row.namNhap);
        if (exist) {
          Object.assign(exist, row);
        } else {
          deXuatPhuongAn.push(row);
        }/*
        let existRowIndex = deXuatPhuongAn.findIndex(s => s.idVirtual === row.idVirtual);
        if (existRowIndex !== -1) {
          deXuatPhuongAn[existRowIndex] = row;
        } else {
          deXuatPhuongAn = [...deXuatPhuongAn, row];
        }*/
      }
      deXuatPhuongAn.forEach(item => {
        if (item.noiDung === row.noiDung) {
          item.soLuongNhuCauXuat = row.soLuongNhuCauXuat;
          item.soLuongConThieu = row.soLuongConThieu;
          item.soLuongChuyenCapThoc = row.soLuongConThieu
        }
      });
    }
    console.log("deXuatPhuongAn", deXuatPhuongAn)
    this.formData.patchValue({ deXuatPhuongAn });
    await this.buildTableView();
    await this.huyPhuongAn();
    await this.helperService.restoreRequiredForm(this.formDataDtl);
  }

  async huyPhuongAn() {
    this.formDataDtl.reset();
    this.editSoLuongNhuCauXuat = false;
    this.modalChiTiet = false;
    this.listNamNhap = [];
  }


  async xoaPhuongAn(data: any, dataParent?: any, level?: any) {
    let deXuatPhuongAn = this.formData.value.deXuatPhuongAn;
    // if (level == 3) {
    //   deXuatPhuongAn = deXuatPhuongAn.filter(s => s.idVirtual != data.idVirtual);
    // } else if (level == 2) {
    //   deXuatPhuongAn = deXuatPhuongAn.filter(s => !(s.tenLoaiVthh === data.tenLoaiVthh && s.noiDung === dataParent.noiDung));
    // } else if (level == 1) {
    //   deXuatPhuongAn = deXuatPhuongAn.filter(s => s.noiDung !== data.noiDung);
    // }
    // deXuatPhuongAn = deXuatPhuongAn.filter(s => s.noiDung !== data.noiDung);
    deXuatPhuongAn = deXuatPhuongAn.filter(s => s.idVirtual != data.idVirtual);
    deXuatPhuongAn.forEach(item => {
      if (item.noiDung === data.noiDung) {
        item.soLuongConThieu += data.soLuong;
        item.soLuongChuyenCapThoc += data.soLuong;
      }
    });
    this.formData.patchValue({ deXuatPhuongAn: deXuatPhuongAn });
    await this.buildTableView();
  }
  async getListNamXuat() {
    await this.spinner.show();
    try {
      const { maDvi, loaiVthh, cloaiVthh } = this.formDataDtl.value;
      const res = await this.mangLuoiKhoService.getDetailByMa({ maDvi });
      if (res.msg === MESSAGE.SUCCESS) {
        // this.listNamNhap = [];
        // Array.isArray(res.data.object.ctietHhTrongKho) && res.data.object.ctietHhTrongKho.forEach(element => {
        //   if (cloaiVthh ? cloaiVthh === element.cloaiVthh : loaiVthh && loaiVthh === element.loaiVthh) {
        //     const findIndex = this.listNamNhap.findIndex(f => f.value === element.namNhap);
        //     if (findIndex >= 0) {
        //       this.listNamNhap[findIndex].soLuong += element.slHienThoi;
        //     } else {
        //       this.listNamNhap.push({ value: element.namNhap, text: element.namNhap, soLuong: element.slHienThoi })
        //     }
        //   }
        // });
        const newObject = new Map();
        Array.isArray(res.data.object.ctietHhTrongKho) && res.data.object.ctietHhTrongKho.forEach(element => {
          if (cloaiVthh ? cloaiVthh === element.cloaiVthh : loaiVthh && loaiVthh === element.loaiVthh) {
            if (newObject.get(element.namNhap)) {
              newObject[element.namNhap] += element.slHienThoi;
            } else {
              newObject[element.namNhap] = element.slHienThoi;
            }
          }
        })
        this.listNamNhap = Object.entries(newObject).map(([namNhap, soLuong]) => {
          return { value: Number(namNhap), text: Number(namNhap), soLuong: Number(soLuong) };
        });
        console.log("listaNamNhap", this.listNamNhap,)
      }
    } catch (error) {
      console.log("error", error)
    } finally {
      await this.spinner.hide();
    }
  };
  validatorSoLuong() {
    const { maDvi, tonKhoDvi, soLuongNhuCauXuat } = this.formDataDtl.value;
    if (maDvi) {
      if (this.isVthhGao()) {
        this.formDataDtl.get('soLuong').setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongNhuCauXuat, tonKhoDvi))]);
      } else {
        this.formDataDtl.get('soLuong').setValidators([Validators.required, Validators.min(1), Validators.max(tonKhoDvi)]);
      }
    }
    this.formDataDtl.get('soLuong').updateValueAndValidity()
  }
  handleChangeNamNhap() {
    const namNhapData = this.listNamNhap.find(f => f.value === this.formDataDtl.value.namNhap);
    const tonKhoDvi = namNhapData ? namNhapData.soLuong : 0;
    this.formDataDtl.patchValue({ tonKhoDvi });
    this.validatorSoLuong()
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
            if (!rs) return;
            const lv1 = chain(value).groupBy("maDvi").map((v1, k1) => {
              const rs1 = v1.find(s => s.maDvi === k1);
              if (!rs1) return;
              const soLuong = v1.reduce((sum, cur) => sum += cur.soLuong, 0);
              return {
                ...rs1,
                idVirtual: uuidv4(),
                soLuong,
                childData: v1
              }
            }).value().filter(f => !!f);
            const soLuong = lv1.reduce((sum, cur) => sum += cur.soLuong ? cur.soLuong : 0, 0);
            return {
              idVirtual: uuidv4(),
              noiDung: key,
              idDonViNhan: rs.idDonViNhan,
              loaiVthh: rs.loaiVthh,
              tenLoaiVthh: rs.tenLoaiVthh,
              soLuongNhuCauXuat: rs.soLuongNhuCauXuat,
              soLuongChuyenCapThoc: rs.soLuongChuyenCapThoc,
              soLuong,
              childData: lv1,
            };
          }).value().filter(f => !!f);
      }
    } else {

      dataView = chain(this.formData.value.deXuatPhuongAn)
        .groupBy("noiDung")
        .map((value, key) => {
          const rx = value.find(f => f.noiDung === key);
          const lv1 = chain(value)
            .groupBy("loaiVthh")
            .map((v1, k1) => {
              let row = v1.find(s => s.loaiVthh === k1);
              if (!row) return;
              const lv2 = chain(v1).groupBy("maDvi").map((v2, k2) => {
                const row1 = v2.find(f => f.maDvi === k2);
                if (!row1) return;
                const soLuong = v2.reduce((sum, cur) => sum += cur.soLuong, 0);
                return {
                  ...row1,
                  idVirtual: uuidv4(),
                  soLuong,
                  childData: v2
                }
              }).value().filter(f => !!f)
              let soLuong = lv2.reduce((prev, next) => prev + next.soLuong, 0);
              return {
                idVirtual: uuidv4(),
                loaiVthh: k1,
                tenLoaiVthh: row.tenLoaiVthh,
                // cloaiVthh: row.cloaiVthh,
                // tenCloaiVthh: row.tenCloaiVthh,
                noiDung: row.noiDung,
                idDonViNhan: row.idDonViNhan,
                soLuong: soLuong,
                donViTinh: row.donViTinh,
                childData: lv2
              }
            }
            ).value().filter(f => !!f);
          return {
            idVirtual: uuidv4(),
            noiDung: key,
            idDonViNhan: rx.idDonViNhan,
            soLuong: 0,
            childData: lv1
          };
        }).value().filter(f => !!f);
    }
    console.log("dataView", dataView)
    this.phuongAnView = dataView;
    this.expandAll();
  }

  async loadDsDiaDanh() {
    let body = {
      capDiaDanh: 1
    };
    let res = await this.danhMucService.loadDsDiaDanhByCap(body);
    if (res.msg == MESSAGE.SUCCESS) {
      // this.listDiaDanh = res.data;
      this.listDiaDanhHanhChinh = Array.isArray(res.data) ? res.data.map(f => ({ ...f, idDonViNhan: f.id })) : [];
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async loadDsDonViNhanCTVT(loai) {
    let res = await this.danhMucService.danhMucChungGetAll(loai);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDviNhan = Array.isArray(res.data) ? res.data.map(f => ({ ...f, ten: f.giaTri })) : [];
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async loadDsQuocGiaNhanCTVT(loai) {
    let res = await this.danhMucService.danhMucChungGetAll(loai);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listQuocGia = Array.isArray(res.data) ? res.data.filter(f => f.ma !== "VN").map(f => ({ ...f, ten: f.giaTri })) : [];
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
    if ($event) {
      let item = this.listDonVi.find(s => s.maDvi === $event);
      this.formDataDtl.patchValue({
        tenDvi: item.tenDvi
      })
      this.formDataDtl.get("namNhap").reset();
      this.formDataDtl.get("soLuong").reset();
      this.formDataDtl.get("tonKhoDvi").reset();
      this.formDataDtl.get("namNhap").setErrors(null);
      this.formDataDtl.get("soLuong").setErrors(null);
      this.formDataDtl.get("tonKhoDvi").setErrors(null);
      // await this.kiemTraTonKho();
      await this.getListNamXuat();
    }
  }

  async kiemTraTonKho() {
    // let maDvi = this.formDataDtl.value.maDvi || this.userInfo.MA_DVI;
    let maDvi = this.formDataDtl.value.maDvi;
    let loaiVthh = this.formDataDtl.value.loaiVthh;
    let cloaiVthh = this.formDataDtl.value.cloaiVthh;
    if (maDvi) {
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
        this.formDataDtl.patchValue({ tonKhoLoaiVthh: 0, tonKhoCloaiVthh: 0 });
        this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(0)]);
        this.formDataDtl.controls['soLuong'].updateValueAndValidity();
      }
    }
  }
  async checkTonKhoDonViTaoDeXuat() {
    let maDvi = this.formData.value.maDviDx;
    let loaiVthh = this.formData.value.loaiVthh;
    if (maDvi) {
      const body = { maDvi, maVthh: loaiVthh }
      const res = await this.mangLuoiKhoService.slTon(body);
      if (res.msg === MESSAGE.SUCCESS) {
        const slTon = res.data;
        this.formData.patchValue({ tonKhoDvi: slTon });
      } else {
        this.formData.patchValue({ tonKhoDvi: 0 });
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
    if (this.userService.isCuc && this.formData.value.deXuatPhuongAn.length <= 0 && [TEN_LOAI_VTHH.GAO, TEN_LOAI_VTHH.THOC, TEN_LOAI_VTHH.MUOI].includes($event)) {
      await this.checkTonKhoDonViTaoDeXuat();
    }
    if (![TEN_LOAI_VTHH.GAO, TEN_LOAI_VTHH.THOC, TEN_LOAI_VTHH.MUOI].includes($event)) {
      this.formData.patchValue({ tonKhoDvi: 0 })
    }
  }
  async changeDviNhan(data) {
    if (data) {
      const item = this.listDiaDanh.find(f => f.ten === data);
      this.formDataDtl.patchValue({ idDonViNhan: item?.idDonViNhan })
    }
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
      // await this.kiemTraTonKho();
      await this.getListNamXuat();
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
    // await this.kiemTraTonKho();
    await this.getListNamXuat();
  }

  soLuongNhuCauXuatChange($event) {
    // (tính soLuongConThieu = nếu (Nhu cầu xuất cứu trợ  - sl xuất cứu trợ đề xuất ) > 0 thì (Nhu cầu xuất cứu trợ  - sl xuất cứu trợ đề xuất ) ngược lại  = 0 )
    // if (this.formDataDtl.value.soLuongNhuCauXuat > this.formDataDtl.value.soLuong) {
    //   let soLuongConThieu = this.formDataDtl.value.soLuongNhuCauXuat - this.formDataDtl.value.soLuong;
    //   if (soLuongConThieu < 0) {
    //     soLuongConThieu = 0;
    //   }
    //   this.formDataDtl.patchValue({
    //     soLuongConThieu: soLuongConThieu,
    //     soLuongChuyenCapThoc: soLuongConThieu
    //   });
    // } else {
    //   this.formDataDtl.patchValue({
    //     soLuongConThieu: 0,
    //     soLuongChuyenCapThoc: 0
    //   });
    // }
    if (!$event) return;
    this.validatorSoLuong();
    const soLuongNhuCauXuat = this.formDataDtl.value.soLuongNhuCauXuat ? this.formDataDtl.value.soLuongNhuCauXuat : 0;
    const soLuong = this.formData.value.deXuatPhuongAn.filter(f => f.noiDung === this.formDataDtl.value.noiDung && f.idVirtual !== this.formDataDtl.value.idVirtual).reduce((sum, cur) => sum += cur.soLuong, 0) + this.formDataDtl.value.soLuong;
    if (soLuongNhuCauXuat > soLuong) {
      let soLuongConThieu = soLuongNhuCauXuat - soLuong;
      if (soLuongConThieu < 0) {
        soLuongConThieu = 0;
      }
      this.formDataDtl.patchValue({
        soLuongConThieu: soLuongConThieu,
        soLuongChuyenCapThoc: soLuongConThieu
      });
    } else {
      this.formDataDtl.patchValue({
        soLuongConThieu: 0,
        soLuongChuyenCapThoc: 0
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
  taoQuyetDinhPdPa() {
    const dataSend = {
      ...this.formData.value,
      type: "TTr",
      isTaoQdPdPa: true
    }
    this.dataService.changeData(dataSend);
    this.taoQuyetDinh.emit(2);
  }
}
