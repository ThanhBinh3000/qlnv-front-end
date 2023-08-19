import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "src/app/components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {DeXuatKeHoachBanDauGiaService} from "src/app/services/deXuatKeHoachBanDauGia.service";
import {DonviService} from "src/app/services/donvi.service";
import {TinhTrangKhoHienThoiService} from "src/app/services/tinhTrangKhoHienThoi.service";
import {DanhMucTieuChuanService} from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import * as dayjs from "dayjs";
import {FormGroup, Validators} from "@angular/forms";
import {FileDinhKem} from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import {STATUS} from "src/app/constants/status";
import {chain, cloneDeep} from 'lodash';
import {MESSAGE} from "src/app/constants/message";
import {v4 as uuidv4} from "uuid";


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
        noiDungDx: [''],
        trangThai: [STATUS.DU_THAO],
        idThop: [''],
        maTongHop: [''],
        idQdPd: [''],
        soQdPd: [''],
        ngayKyQd: [''],
        tongSoLuong: [''],
        tongSoLuongDeXuat: [''],
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
        soLuong: [''],
        mapVthh: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        mapDmucDvi: [''],
        tenDvi: [''],
        edit: []
      });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.loadDsDonVi(),
        this.loadDsDiaDanh(),
        this.loadDsVthh(),
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
      this.maHauTo = '/DXCTVT-' + this.userInfo.DON_VI.tenVietTat;
      this.formData.patchValue({tenVthh: '0101', kieuNhapXuat: 'Xuất không thu tiền', loaiNhapXuat: 'Xuất cứu trợ'})
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = {
      ...this.formData.value,
      soDx: this.formData.value.soDx ? this.formData.value.soDx + this.maHauTo : null
    }
    console.log(body);
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    let body = {...this.formData.value, soDx: this.formData.value.soDx + this.maHauTo}
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
    this.formDataDtl.reset();
    if (data) {
      if (level == 0) {
        this.formDataDtl.patchValue({noiDung: data.noiDung, noiDungOld: data.noiDung, edit: level});
      } else if (level == 1) {
        this.formDataDtl.patchValue({
          idVirtual: uuidv4(),
          noiDung: data.noiDung,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          edit: level
        });
      } else if (level == 2) {
        data.edit = level;
        this.formDataDtl.patchValue(data);
      }
    } else {
      this.formDataDtl.patchValue({loaiVthh: this.listLoaiHangHoa[0].ma, tenLoaiVthh: this.listLoaiHangHoa[0].ten});
      this.formDataDtl.patchValue({idVirtual: uuidv4()});
    }
    console.log(this.formDataDtl.value, 'this.formDataDtl')
    // await this.changeLoaiVthh(this.formDataDtl.value.loaiVthh);
    this.modalChiTiet = true;
  }

  async luuPhuongAn() {
    this.helperService.markFormGroupTouched(this.formDataDtl);
    if (this.formDataDtl.invalid) {
      return;
    }
    let row = this.formDataDtl.value;
    console.log(row, 'row')
    let deXuatPhuongAn = this.formData.value.deXuatPhuongAn;
    if (row.edit == 0) {
      deXuatPhuongAn.forEach(s => {
        if (s.noiDung === row.noiDungOld) {
          s.noiDung = row.noiDung;
        }
      });
    } else {
      let existRowIndex = deXuatPhuongAn.findIndex(s => s.idVirtual === row.idVirtual);
      console.log(deXuatPhuongAn, 'deXuatPhuongAn')
      if (existRowIndex !== -1) {
        deXuatPhuongAn[existRowIndex] = row;
      } else {
        deXuatPhuongAn = [...deXuatPhuongAn, row];
      }
    }
    this.formData.patchValue({deXuatPhuongAn: deXuatPhuongAn});
    await this.buildTableView();
    await this.huyPhuongAn();
  }

  async huyPhuongAn() {
    this.formDataDtl.reset();
    this.modalChiTiet = false;
  }


  async xoaPhuongAn(data: any, dataParent?: any) {
    let deXuatPhuongAn = this.formData.value.deXuatPhuongAn;
    if (data.noiDung) {
      deXuatPhuongAn = deXuatPhuongAn.filter(s => s.noiDung !== data.noiDung);
    } else if (dataParent) {
      deXuatPhuongAn = deXuatPhuongAn.filter(s => !(s.tenLoaiVthh === data.tenLoaiVthh && s.noiDung === dataParent.noiDung));
    } else if (data.idVirtual) {
      deXuatPhuongAn = deXuatPhuongAn.filter(s => s.idVirtual != data.idVirtual);
    }
    this.formData.patchValue({deXuatPhuongAn: deXuatPhuongAn});
    await this.buildTableView();
  }

  async buildTableView() {
    console.log(this.formData.value.deXuatPhuongAn, 'this.formData.value.deXuatPhuongAn');
    let dataView = chain(this.formData.value.deXuatPhuongAn)
      .groupBy("noiDung")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("loaiVthh")
          .map((v, k) => {
              let row = v.find(s => s.loaiVthh === k);
              return {
                idVirtual: uuidv4(),
                loaiVthh: k,
                tenLoaiVthh: row.tenLoaiVthh,
                cloaiVthh: row.cloaiVthh,
                tenCloaiVthh: row.tenCloaiVthh,
                noiDung: row.noiDung,
                tonKho: 0,
                soLuong: row.soLuong,
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
    this.phuongAnView = dataView
    console.log(this.phuongAnView, "phuongAnView")
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

  async changeMaDviDtl($event) {
    if ($event) {
      let item = this.listDonVi.find(s => s.maDvi === $event);
      this.formDataDtl.patchValue({
        tenDvi: item.tenDvi
      })
    }
  }

  async changeVthh($event) {
    this.listLoaiHangHoa = [];
    if ($event == '0101') {
      let listLuongThuc = this.listVatTuHangHoa.find(s => s.key == '01');
      let filter = cloneDeep(listLuongThuc.children.filter(s => s.key == '0101'));
      Object.assign(this.listLoaiHangHoa, filter);
    } else if ($event == '0102') {
      let listLuongThuc = this.listVatTuHangHoa.find(s => s.key == '01');
      let filter = cloneDeep(listLuongThuc.children.filter(s => s.key == '0102'));
      Object.assign(this.listLoaiHangHoa, filter);
    } else {
      let filter = cloneDeep(this.listVatTuHangHoa.find(s => s.key == '02'));
      Object.assign(this.listLoaiHangHoa, filter.children);
    }
    console.log(this.formData.value, 'this.formData.valuethis.formData.value')
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

  async changeCloaiVthh($event) {
    if ($event) {
      let item = this.listChungLoaiHangHoa.find(s => s.ma === $event);
      this.formDataDtl.patchValue({
        tenCloaiVthh: item.ten
      });
    }
  }
}
