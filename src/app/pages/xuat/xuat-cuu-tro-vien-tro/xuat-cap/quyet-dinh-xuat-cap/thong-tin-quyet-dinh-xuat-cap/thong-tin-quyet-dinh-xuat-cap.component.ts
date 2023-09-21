import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "src/app/services/donvi.service";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import * as dayjs from "dayjs";
import {FormGroup, Validators} from "@angular/forms";
import {STATUS} from "src/app/constants/status";
import {FileDinhKem} from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import {MESSAGE} from "src/app/constants/message";
import {chain} from "lodash";
import {v4 as uuidv4} from "uuid";
import {Base2Component} from "src/app/components/base2/base2.component";
import {QuanLyHangTrongKhoService} from "src/app/services/quanLyHangTrongKho.service";
import {TinhTrangKhoHienThoiService} from "src/app/services/tinhTrangKhoHienThoi.service";
import {DanhMucTieuChuanService} from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";

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
        ngayKy: [],
        ngayHluc: [],
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
        mucDichXuat: [],
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
        canCu: [new Array<FileDinhKem>()]
      }
    );

    this.formDataDtl = this.fb.group(
      {
        idVirtual: [''],
        noiDungOld: [],
        id: [''],
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
            this.formData.patchValue(res.data);
            this.formData.value.quyetDinhPdDtl.forEach(s => s.idVirtual = uuidv4());
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
        tenVthh: 'Thóc tẻ',
        tenDvi: this.userInfo.TEN_DVI,
        kieuNhapXuat: 'Xuất không thu tiền',
        loaiNhapXuat: 'Xuất cấp',
        type: 'XC'
      })
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = {
      ...this.formData.value,
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null
    }
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThaiHienTai: string, msg: string, msgSuccess?: string) {
    let trangThai;
    if (trangThaiHienTai == STATUS.DU_THAO || trangThaiHienTai == STATUS.TU_CHOI_LDV || trangThaiHienTai == STATUS.TU_CHOI_LDTC) {
      trangThai = STATUS.CHO_DUYET_LDV;
    }
    let body = {...this.formData.value, soBbQd: this.formData.value.soBbQd + this.maHauTo}
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
        this.formDataDtl.patchValue({noiDungDx: data.noiDungDx});
      } else if (level == 1) {
        data.edit = level;
        this.formDataDtl.patchValue(data);
      }
    } else {
      this.formDataDtl.patchValue({
        idVirtual: uuidv4(),
        loaiVthh: '0101',
        tenLoaiVthh: 'Thóc tẻ',
      });
    }
    this.modalChiTiet = true;
  }

  async luuPhuongAn() {
    await this.helperService.ignoreRequiredForm(this.formDataDtl);
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
    this.formData.patchValue({quyetDinhPdDtl: quyetDinhPdDtl});
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
    this.formData.patchValue({quyetDinhPdDtl: quyetDinhPdDtl});
    await this.buildTableView();
  }

  async buildTableView() {
    let dataView = chain(this.formData.value.quyetDinhPdDtl)
      .groupBy("noiDungDx")
      .map((value, key) => {
        return {
          idVirtual: uuidv4(),
          noiDungDx: key,
          soLuong: 0,
          childData: value
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
      await this.kiemTraTonKho();
    }
  }

  async kiemTraTonKho() {
    let maDvi = this.formDataDtl.value.maDvi;
    let loaiVthh = this.formDataDtl.value.loaiVthh;
    if (maDvi) {
      await this.quanLyHangTrongKhoService.getTrangThaiHt({
        maDvi: maDvi,
        loaiVthh: loaiVthh,
        // cloaiVthh: cloaiVthh
      }).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let data = res.data;
          if (data.length > 0) {
            let tonKhoLoaiVthh = data.reduce((prev, cur) => prev + cur.slHienThoi, 0);
            this.formDataDtl.patchValue({
              tonKhoLoaiVthh: tonKhoLoaiVthh,
            });
            this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(tonKhoLoaiVthh)]);
            this.formDataDtl.controls['soLuong'].updateValueAndValidity();
          } else {
            this.formDataDtl.patchValue({tonKhoLoaiVthh: 0, tonKhoCloaiVthh: 0});
            this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(0)]);
            this.formDataDtl.controls['soLuong'].updateValueAndValidity();
          }
        }
      });
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
      trangThai = STATUS.DA_DUYET_LDTC;
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
  async bindingDataQdPd(data:any){
    data.quyetDinhPdDtl.forEach(s => {
      if(s.soLuongXc){

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
}
