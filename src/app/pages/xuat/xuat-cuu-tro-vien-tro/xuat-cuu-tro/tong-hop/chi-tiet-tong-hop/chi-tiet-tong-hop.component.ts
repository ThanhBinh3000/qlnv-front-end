import { DataService } from 'src/app/services/data.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Base2Component } from "src/app/components/base2/base2.component";
import { FormGroup, Validators } from "@angular/forms";
import { FileDinhKem } from "src/app/models/DeXuatKeHoachuaChonNhaThau";
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
import {
  TongHopPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service";
import * as dayjs from "dayjs";
import { MESSAGE } from "src/app/constants/message";
import { STATUS } from 'src/app/constants/status';
import { chain, cloneDeep } from 'lodash';
import { v4 as uuidv4 } from "uuid";
import { PREVIEW } from "../../../../../../constants/fileType";
import { LOAI_HANG_DTQG, TEN_LOAI_VTHH } from "src/app/constants/config";

@Component({
  selector: 'app-chi-tiet-tong-hop',
  templateUrl: './chi-tiet-tong-hop.component.html',
  styleUrls: ['./chi-tiet-tong-hop.component.scss']
})
export class ChiTietTongHopComponent extends Base2Component implements OnInit {

  @Input() loaiVthhInput: string;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Output() taoQuyetDinh = new EventEmitter<any>();
  @Input() id: number;

  maTongHop: string;
  formData: FormGroup;
  cacheData: any[] = [];
  fileDinhKem: Array<FileDinhKem> = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  listLoaiHangHoa: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  userInfo: UserLogin;
  listFileDinhKem: any[] = [];
  expandSetView = new Set<number>();
  expandSetEdit = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  listChungLoaiHangHoa: any[] = [];
  maKeHoach: string;
  listLoaiHopDong: any[] = [];
  listLoaiHinhNhapXuat: any[] = [];
  thongTinChiTiet: any[];
  thongTinChiTietTh: any[];
  tongSoLuongDxuat = 0;
  tongSoLuongTongHop = 0;
  tongThanhTienDxuat = 0;
  tongThanhTienTongHop = 0;
  tongHopEdit: any = [];
  datePipe = new DatePipe('en-US');
  isVisible = false;

  isVisibleTuChoiDialog = false;
  isQuyetDinh: boolean = false;
  listThanhTien: number[];
  listSoLuong: number[];
  phuongAnView: any;
  phuongAnHdrView: any;
  expandSetString = new Set<string>();
  listKieuNhapXuat: any;
  listHangHoaAll: any;
  dsDonVi: any;
  tongThanhTien: any;
  tongSoLuong: any;
  tongSoLuongDeXuat: any;
  tongSoLuongXuatCap: any;
  listVatTuHangHoa: any[] = [];
  templateName = "Tổng hợp phương an cứu trợ";
  templateNameVt = "Tổng hợp phương an cứu trợ vật tư";
  tongSoLuongChuyenCapThoc: number = 0;
  tongSoLuongNhuCauXuat: number = 0;
  tongSoLuongDx: number = 0;
  ngayKetThuc: string;
  listMucDichXuat: any[];
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
    private tongHopPhuongAnCuuTroService: TongHopPhuongAnCuuTroService,
    private cdr: ChangeDetectorRef,
    private dataService: DataService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopPhuongAnCuuTroService);
    this.formData = this.fb.group(
      {
        id: [''],
        nam: [dayjs().get("year")],
        // nam: [''],
        maDvi: [''],
        maTongHop: [''],
        ngayThop: [''],
        noiDungThop: ['', [Validators.required]],
        loaiNhapXuat: [''],
        kieuNhapXuat: [''],
        mucDichXuat: [, [Validators.required]],
        loaiVthh: [LOAI_HANG_DTQG.GAO],
        cloaiVthh: [''],
        tenVthh: [TEN_LOAI_VTHH.GAO, [Validators.required]],
        trangThai: [STATUS.DU_THAO],
        idQdPd: [''],
        soQdPd: [''],
        ngayKyQd: [''],
        ngayGduyet: [''],
        nguoiGduyetId: [''],
        ngayPduyet: [''],
        nguoiPduyetId: [''],
        lyDoTuChoi: [''],
        tongSlCtVt: [0],
        tongSlXuatCap: [0],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenTrangThai: ['Dự Thảo'],
        tenDvi: [''],
        donViTinh: ['kg'],
        ngayTao: ['', [Validators.required]],
        deXuatCuuTro: [new Array()]
      }
    );
    this.userInfo = this.userService.getUserLogin();
    //this.maTongHop = '/' + this.userInfo.MA_TCKT;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        // this.loadDsLoaiHinhNhapXuat(),
        // this.loadDsKieuNhapXuat(),
        this.loadDsVthh(),
        this.loadDsDonVi(),
        this.loadDsMucDichXuat()
      ])
      await this.loadDetail(this.idSelected);
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      await this.spinner.hide();
    }
  }
  async loadDsMucDichXuat() {
    this.listMucDichXuat = [];
    let res = await this.danhMucService.danhMucChungGetAll('MUC_DICH_CT_VT');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listMucDichXuat = res.data;
    }
  }
  async loadDsLoaiHinhNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNhapXuat = res.data.filter(item => item.apDung?.includes('XUAT_CTVT'));
    }
  }

  async loadDsKieuNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKieuNhapXuat = res.data.filter(item => item.apDung?.includes('XUAT_CTVT'));
    }
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI,
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDonVi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }


  quayLai() {
    this.showListEvent.emit();
  }


  async loadDetail(id: number) {
    if (id > 0) {
      await this.tongHopPhuongAnCuuTroService.getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            this.buildTableView();
            if (this.phuongAnHdrView) {
              this.selectRow(this.phuongAnHdrView[0])
            }
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({ loaiNhapXuat: 'Xuất cứu trợ', kieuNhapXuat: 'Xuất không thu tiền' })
    }
  }

  async summary() {
    await this.helperService.ignoreRequiredForm(this.formData, ['nam', 'tenVthh', 'mucDichXuat']);
    await this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin.');
      return;
    } else {
      try {
        await this.spinner.show();
        let body = {
          loaiNhapXuat: this.formData.value.loaiNhapXuat,
          trangThaiList: [STATUS.DA_DUYET_LDC],
          nam: this.formData.value.nam,
          tenVthh: this.formData.value.tenVthh,
          mucDichXuat: this.formData.value.mucDichXuat
        }
        await this.tongHopPhuongAnCuuTroService.tonghop(body).then(async res => {
          if (res.msg == MESSAGE.SUCCESS) {
            res.data.deXuatCuuTro.forEach(s => s.idVirtual = uuidv4());
            this.formData.patchValue({ deXuatCuuTro: res.data.deXuatCuuTro });
            await this.buildTableView();
            if (this.phuongAnHdrView) {
              await this.selectRow(this.phuongAnHdrView[0])
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        });
      } catch (e) {
        console.log(e)
      } finally {
        await this.spinner.hide();
        await this.helperService.restoreRequiredForm(this.formData);
      }
    }

  }

  async dsLoaiHinhNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNhapXuat = res.data.filter(item =>
        item.phanLoai == 'XUAT_CTVT'
      )
        ;
    }
  }
  handleChaneMucDichXuat() {
    this.formData.patchValue({ deXuatCuuTro: [] });
    this.phuongAnHdrView = [];
    this.phuongAnView = [];
    this.tongSoLuongDx = 0;
    this.tongSoLuongNhuCauXuat = 0;
    this.tongSoLuongChuyenCapThoc = 0;
    this.ngayKetThuc = '';
  }

  async save() {
    if (!Array.isArray(this.formData.value.deXuatCuuTro) || this.formData.value.deXuatCuuTro.length <= 0) {
      return this.notification.error(MESSAGE.ERROR, "Thông tin chi tiết đề xuất cứu trợ, viện trợ của các đơn vị không tồn tại")
    }
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = this.formData.value;
    body.kieuNhapXuat = 'Xuất không thu tiền';
    body.loaiNhapXuat = 'Xuất cứu trợ';
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    let body = this.formData.value;
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.thongTinChiTietTh.forEach(s => {
      if (s.idVirtual == this.tongHopEdit.idVirtual) {
        s.thongTinChiTiet = this.tongHopEdit.thongTinChiTiet;
      }
    });
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleTuChoiDialog = false;
  }

  showModalDialogTuChoi(): void {
    this.isVisibleTuChoiDialog = true;
  }

  // taoQuyetDinh() {
  //   /*let elem = document.getElementById('mainTongCuc');
  //   let tabActive = elem.getElementsByClassName('ant-menu-item')[1];
  //   tabActive.classList.remove('ant-menu-item-selected')
  //   let setActive = elem.getElementsByClassName('ant-menu-item')[2];
  //   setActive.classList.add('ant-menu-item-selected');*/
  //   this.isQuyetDinh = true;
  // }

  expandAll() {
    this.phuongAnHdrView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
      s.childData.forEach(s => {
        this.expandSetString.add(s.idVirtual);
      })
    })
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async selectRow(item: any) {
    if (!item.selected) {
      this.phuongAnHdrView.forEach(i => i.selected = false);
      item.selected = true;
      let currentCuc = this.phuongAnHdrView.find(s => s.idVirtual == item.idVirtual);
      this.phuongAnView = currentCuc?.childData;
      // this.tongSoLuongDx = Array.isArray(this.phuongAnView) ? this.phuongAnView.reduce((sum, cur) => sum += cur.soLuongDx ? cur.soLuongDx : 0, 0) : 0;
      if (this.formData.value.tenVthh === TEN_LOAI_VTHH.GAO) {
        this.tongSoLuongDx = Array.isArray(this.phuongAnView) ? this.phuongAnView.reduce((sum, cur) => sum += cur.soLuongNhuCauXuat ? cur.soLuongNhuCauXuat : 0, 0) : 0;
      } else {
        this.tongSoLuongDx = Array.isArray(this.phuongAnView) ? this.phuongAnView.reduce((sum, cur) => sum += cur.soLuongDx ? cur.soLuongDx : 0, 0) : 0;
      }
      this.tongSoLuongChuyenCapThoc = Array.isArray(this.phuongAnView) ? this.phuongAnView.reduce((sum, cur) => sum += cur.soLuongChuyenCapThoc ? cur.soLuongChuyenCapThoc : 0, 0) : 0;
      this.tongSoLuongNhuCauXuat = Array.isArray(this.phuongAnView) ? this.phuongAnView.reduce((sum, cur) => sum += cur.soLuongNhuCauXuat ? cur.soLuongNhuCauXuat : 0, 0) : 0;
      this.ngayKetThuc = currentCuc?.ngayKetThuc ? currentCuc.ngayKetThuc : ""
    }
  }


  /////////////
  async loadDsVthh() {
    let res = await this.danhMucService.loadDanhMucHangHoaAsync();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVatTuHangHoa = res.data;
      let filter = cloneDeep(this.listVatTuHangHoa.filter(s => (s.key == '04' || s.key == '01')));
      filter.forEach(s => {
        this.listLoaiHangHoa = this.listLoaiHangHoa.concat(s.children);
      });
      let vatTu = this.listVatTuHangHoa.find(s => s.key == '02');
      this.listLoaiHangHoa = [...this.listLoaiHangHoa, vatTu];

    }
  }

  async themPhuongAn(data?: any, level?: any) {
    /*this.formDataDtl.reset();
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
      this.formDataDtl.patchValue({idVirtual: uuidv4()});
    }
    console.log(this.formDataDtl.value, 'this.formDataDtl')
    // await this.changeLoaiVthh(this.formDataDtl.value.loaiVthh);
    this.modalChiTiet = true;*/
  }

  async luuPhuongAn() {
    /*let row = this.formDataDtl.value;
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
    await this.huyPhuongAn();*/
  }

  async huyPhuongAn() {
    /*this.formDataDtl.reset();
    this.modalChiTiet = false;*/
  }


  async xoaPhuongAn(data: any, dataParent?: any) {
    /*let deXuatPhuongAn = this.formData.value.deXuatPhuongAn;
    if (data.noiDung) {
      deXuatPhuongAn = deXuatPhuongAn.filter(s => s.noiDung !== data.noiDung);
    } else if (dataParent) {
      deXuatPhuongAn = deXuatPhuongAn.filter(s => !(s.tenLoaiVthh === data.tenLoaiVthh && s.noiDung === dataParent.noiDung));
    } else if (data.idVirtual) {
      deXuatPhuongAn = deXuatPhuongAn.filter(s => s.idVirtual != data.idVirtual);
    }
    this.formData.patchValue({deXuatPhuongAn: deXuatPhuongAn});
    await this.buildTableView();*/
  }

  async buildTableView() {
    let dataView = [];
    if (this.formData.value.tenVthh == "Vật tư thiết bị") {
      dataView = chain(this.formData.value.deXuatCuuTro)
        .groupBy("soDx")
        .map((value, key) => {
          let row = value.find(s => s.soDx === key);
          let rs = chain(value)
            .groupBy("noiDungDx")
            .map((v, k) => {
              let row1 = v.find(s => s.noiDungDx === k);
              let rs = chain(v)
                .groupBy("loaiVthh")
                .map((v1, k1) => {
                  let row2 = v1.find(s => s.loaiVthh === k1);
                  let tonKhoCloaiVthh = v.reduce((prev, next) => prev + next.tonKhoCloaiVthh, 0);
                  let soLuong = v.reduce((prev, next) => prev += next.soLuong ? next.soLuong : 0, 0);
                  let soLuongDx = v.reduce((prev, next) => prev += next.soLuongDx ? next.soLuongDx : 0, 0);
                  return {
                    idVirtual: uuidv4(),
                    loaiVthh: k1,
                    tenLoaiVthh: row2.tenLoaiVthh,
                    donViTinh: row2.donViTinh,
                    // soLuong: row2.soLuong,
                    // soLuongDx: row2.soLuongDx,
                    soLuong: soLuong,
                    soLuongDx: soLuongDx,
                    tonKho: tonKhoCloaiVthh || row2.tonKhoLoaiVthh,
                    tenCloaiVthh: row2.tenCloaiVthh,
                    childData: v1
                  }
                }).value();
              return {
                idVirtual: uuidv4(),
                noiDungDx: k,
                soLuongDx: row1 ? rs.reduce((sum, cur) => sum += cur.soLuongDx ? cur.soLuongDx : 0) : 0,
                soLuong: 0,
                childData: row1 ? rs : []
              }
            }).value();
          return {
            idVirtual: uuidv4(),
            tenDvi: row.tenDvi,
            maDvi: row.maDvi,
            soDx: row.soDx,
            trichYeuDx: row.trichYeuDx,
            mucDichXuat: row.mucDichXuat,
            ngayKyDx: row.ngayKyDx,
            ngayKetThuc: row.ngayKetThuc,
            childData: rs
          };
        }).value();
    } else {
      dataView = chain(this.formData.value.deXuatCuuTro)
        .groupBy("soDx")
        .map((value, key) => {
          let row = value.find(s => s.soDx === key);
          return {
            idVirtual: uuidv4(),
            tenDvi: row.tenDvi,
            maDvi: row.maDvi,
            soDx: row.soDx,
            trichYeuDx: row.trichYeuDx,
            mucDichXuat: row.mucDichXuat,
            ngayKyDx: row.ngayKyDx,
            ngayKetThuc: row.ngayKetThuc,
            childData: row ? value : [],
          };
        }).value();
    }
    this.phuongAnHdrView = dataView;
    this.expandAll();
  }

  async changeVthh($event: any) {
    if ($event == TEN_LOAI_VTHH.THOC) {
      this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.THOC, donViTinh: "kg", deXuatCuuTro: [] });
    } else if ($event == TEN_LOAI_VTHH.GAO) {
      this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.GAO, donViTinh: "kg", deXuatCuuTro: [] });
    } else if ($event == TEN_LOAI_VTHH.MUOI) {
      this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.MUOI, donViTinh: "kg", deXuatCuuTro: [] });
    } else {
      this.formData.patchValue({ loaiVthh: LOAI_HANG_DTQG.VAT_TU, donViTinh: null, deXuatCuuTro: [] });
    };
    this.phuongAnHdrView = [];
    this.phuongAnView = [];
    this.tongSoLuongDx = 0;
    this.tongSoLuongNhuCauXuat = 0;
    this.tongSoLuongChuyenCapThoc = 0;
    this.ngayKetThuc = '';

  }
  taoQuyetDinhPdPa() {
    const dataSend = {
      ...this.formData.value,
      type: "TH",
      isTaoQdPdPa: true
    }
    this.dataService.changeData(dataSend);
    this.taoQuyetDinh.emit(2);
  }
  async xemTruocTh(id, tenBaoCao, children) {
    await this.tongHopPhuongAnCuuTroService.preview({
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
}
