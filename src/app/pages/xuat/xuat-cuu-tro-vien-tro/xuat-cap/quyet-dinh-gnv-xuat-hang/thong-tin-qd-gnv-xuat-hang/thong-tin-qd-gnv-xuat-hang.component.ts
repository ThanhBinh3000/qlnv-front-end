import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "src/app/components/base2/base2.component";
import {chain, cloneDeep} from 'lodash';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetDinhGiaoNvCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cap/QuyetDinhGiaoNvCuuTro.service";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {DanhMucTieuChuanService} from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import dayjs from "dayjs";
import {MESSAGE} from "src/app/constants/message";

import {STATUS} from "src/app/constants/status";
import * as uuid from "uuid";
import {DonviService} from "src/app/services/donvi.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";

/*export class noiDungCuuTro {
  idVirtual: number;
  id: number;
  idHdr: number;
  idDx: number;
  soDx: string;
  maDviDx: string;
  ngayPduyetDx: Date;
  trichYeuDx: string;
  tongSoLuongDx: number;
  soLuongXuatCap: number;
  thanhTienDx: number;
  ngayKetThucDx: Date;
  tenDviDx: string;
  quyetDinhPdDx: Array<any> = [];
}*/

@Component({
  selector: 'app-thong-tin-qd-gnv-xuat-hang-xc',
  templateUrl: './thong-tin-qd-gnv-xuat-hang.component.html',
  styleUrls: ['./thong-tin-qd-gnv-xuat-hang.component.scss']
})
export class ThongTinQdGnvXuatHangComponent extends Base2Component implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Input() id: number;
  @Output() showListEvent = new EventEmitter<any>();
  private flagInit = false;
  public dsQdPd: any;
  public dsNoiDung: any;
  public dsDonVi: any;
  listLoaiHangHoa: any[] = []
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listLoKho: any[] = [];
  expandSetString = new Set<string>();
  noiDungCuuTroView = [];
  noiDungRow: any = {};
  isVisible = false;
  listNoiDung: any;
  listChungLoaiHangHoa: any[] = [];
  statusForm: any = [];

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
              private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService,
              private danhMucService: DanhMucService,
              private donViService: DonviService,
              private danhMucTieuChuanService: DanhMucTieuChuanService) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvCuuTroService);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      soQd: [],
      maDvi: [],
      ngayKy: [],
      idQdPd: [],
      soQdPd: [],
      soBbHaoDoi: [],
      soBbTinhKho: [],
      loaiVthh: [],
      cloaiVthh: [],
      tenVthh: [],
      tongSoLuong: [],
      thoiGianGiaoNhan: [],
      trichYeu: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      trangThaiXh: [],
      tenTrangThaiXh: [],
      lyDoTuChoi: [],
      noiDungCuuTro: [new Array()],
      donViTinh: ['kg'],
      tenDvi: [],
      soLuong: [0],
      canCu: [],
      fileDinhKem: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      tonKhoChiCuc: [],
    })
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadDsVthh(),
        this.loadDsQdPd(),
        this.loadDsDonVi(),
        this.loadDsDiemKho()
      ])
      await this.loadDetail(this.id)
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      this.flagInit = true;
      this.spinner.hide();
    }
  }

  async loadDetail(id: number) {
    if (id > 0) {
      await this.quyetDinhGiaoNvCuuTroService.getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            this.formData.value.noiDungCuuTro.forEach(s => s.idVirtual = uuid.v4());
            this.selectHangHoa(res.data.loaiVthh);
            this.buildTableView();
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {

    }

  }

  buildTableView() {
    let data = cloneDeep(this.formData.value.noiDungCuuTro);
    if (this.userService.isChiCuc()) {
      data = data.filter(s => s.maDviChiCuc === this.userInfo.MA_DVI);
    }
    let dataView = chain(data)
      .groupBy("noiDung")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenChiCuc")
          .map((v, k) => ({
              idVirtual: uuid.v4(),
              tenChiCuc: k,
              soLuongXuatChiCuc: v[0].soLuongXuatChiCuc,
              tenCloaiVthh: v[0].tenCloaiVthh,
              tonKhoChiCuc: v[0].tonKhoChiCuc,
              childData: v
            })
          ).value();
        let soLuongXuat = rs.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
        let donViTinh = value[0].donViTinh;
        return {idVirtual: uuid.v4(), noiDung: key, soLuongXuat: soLuongXuat, childData: rs, donViTinh: donViTinh};
      }).value();
    this.noiDungCuuTroView = dataView
    console.log(JSON.stringify(this.noiDungCuuTroView), 'noiDungCuuTroView')
    this.expandAll()

  }

  flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
  }

  quayLai() {
    this.showListEvent.emit();
  }

  changeQdPd(id) {
    if (id && this.flagInit) {
      try {
        this.spinner.show();
        this.quyetDinhPheDuyetPhuongAnCuuTroService.getDetail(id).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              let noiDungCuuTro = []
              if (this.userInfo.CAP_DVI === "2") {
                noiDungCuuTro = res.data.quyetDinhPdDtl.filter(q => q.quyetDinhPdDx.some(dx => dx.maDviCuc === this.userInfo.MA_DVI));
              } else if (this.userInfo.CAP_DVI === "3") {
                noiDungCuuTro = res.data.quyetDinhPdDtl.filter(q => q.quyetDinhPdDx.some(dx => dx.maDviChiCuc === this.userInfo.MA_DVI));
              }

              this.formData.patchValue({
                loaiVthh: res.data.loaiVthh,
                noiDungCuuTro: noiDungCuuTro[0].quyetDinhPdDx
              });
              this.selectHangHoa(res.data.loaiVthh);
              console.log(JSON.stringify(this.formData.value), 2929)
              this.buildTableView()
            }
          }
        })
      } catch (e) {
        console.log('error: ', e);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        this.spinner.hide();
      }
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
    }
  }

  async loadDsQdPd() {
    this.quyetDinhPheDuyetPhuongAnCuuTroService.search({
      trangThai: STATUS.BAN_HANH,
      nam: this.formData.get('nam').value,
      // nam: 2022,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          this.dsQdPd = data.content;
        }
      } else {
        this.dsQdPd = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    });
  }

  async saveAndSend() {
    let data = await this.createUpdate(this.formData.value);
    if (data) {
      await this.approve(data.id, STATUS.CHO_DUYET_TP, 'Bạn có muốn gửi duyệt ?');
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async save() {
    let rs = await this.createUpdate(this.formData.value);
    if (rs) {
      this.goBack();
    }
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }


  expandAll() {
    this.noiDungCuuTroView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  async loadDsDonVi() {
    const res = await this.donViService.layDonViCon();
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDonVi = res.data.filter(s => !s.type);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsDiemKho() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI,
      type: "MLK"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDiemKho = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  // async loadDsLoKho() {
  //   let body = {
  //     trangThai: "01",
  //     maDviCha: this.userInfo.MA_DVI + "______",
  //   };
  //   let res = await this.donViService.getDonViTheoMaCha(body);
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     this.dsLoKho = res.data;
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }


  async changeDiemKho() {
    //this.noiDungRow.maDiaDiem = null;
    // this.listNhaKho = this.listNhaKho.filter(s => s.maDvi.substring(0, 10) === this.noiDungRow.maDiemKho);
    this.statusForm = '';
    let body = {
      trangThai: "01",
      maDviCha: this.noiDungRow.maDiemKho,
      // type: "MLK"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNhaKho = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeNhaKho() {
    //this.noiDungRow.maDiaDiem = null;
    // this.listNhaKho = this.listNhaKho.filter(s => s.maDvi.substring(0, 10) === this.noiDungRow.maDiemKho);
    this.statusForm = '';
    let body = {
      trangThai: "01",
      maDviCha: this.noiDungRow.maNhaKho,
      // type: "MLK"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNganKho = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeNganKho() {
    this.statusForm = '';
    let body = {
      trangThai: "01",
      maDviCha: this.noiDungRow.maNganKho,
      // type: "MLK"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoKho = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeLoKho() {

  }


  themDiaDiemNhap(lv0: any, lv1: any, lv2: any) {

    let currentRowLv0 = this.noiDungCuuTroView.find(s => s.idVirtual == lv0.idVirtual)
    this.noiDungRow.noiDung = currentRowLv0.noiDung;
    let currentRowLv1 = currentRowLv0.childData.find(s => s.idVirtual == lv1.idVirtual)
    this.noiDungRow.tenChiCuc = currentRowLv1.tenChiCuc;
    this.noiDungRow.tenCloaiVthh = currentRowLv1.tenCloaiVthh;
    this.noiDungRow.tonKhoChiCuc = currentRowLv1.tonKhoChiCuc;
    this.noiDungRow.soLuongXuatChiCuc = currentRowLv1.soLuongXuatChiCuc;
    let currentRowLv2 = currentRowLv1.childData.find(s => s.idVirtual == lv2[0].idVirtual);
    this.noiDungRow.idHdr = currentRowLv2.idHdr;
    this.noiDungRow.maDviChiCuc = currentRowLv2.maDviChiCuc;
    this.noiDungRow.cloaiVthh = currentRowLv2.cloaiVthh;
    this.noiDungRow.soLuongXuatChiCuc = currentRowLv2.soLuongXuatChiCuc;
    this.noiDungRow.loaiVthh = currentRowLv2.loaiVthh;
    this.noiDungRow.donViTinh = currentRowLv2.donViTinh;
    this.noiDungRow.edit = false;
    console.log(this.noiDungRow.edit, 123);
    let index = this.formData.value.noiDungCuuTro.findIndex(s => s.idVirtual === this.noiDungRow.idVirtual);
    let table = this.formData.value.noiDungCuuTro;
    console.log(1234);
    if (index != -1) {
      table.splice(index, 1, this.noiDungRow);
    } else {
      table = [...table, this.noiDungRow]
    }
    this.formData.patchValue({
      noiDungCuuTro: table
    })
    this.buildTableView();
    this.isVisible = false;
    this.noiDungRow = {};
  }

  validatorDdiemNhap(indexTable): boolean {
    let soLuong = 0;

    soLuong += this.noiDungRow.soLuong
    if (soLuong > +this.formData.value.soLuong) {
      this.notification.error(MESSAGE.ERROR, "Số lượng thêm mới không được vượt quá số lượng của chi cục")
      return false;
    }

    return true
  }

  validateButtonThem(typeButton): boolean {
    if (typeButton == 'ddiemNhap') {
      if (this.noiDungRow.maDiemKho && this.noiDungRow.maNhaKho && this.noiDungRow.maNganKho && this.noiDungRow.soLuong > 0) {
        return true
      } else {
        return false;
      }
    } else {
      if (this.noiDungRow.maChiCuc && this.noiDungRow.soLuong > 0) {
        return true
      } else {
        return false;
      }
    }

  }


  clearDiaDiemNhap() {
    this.listNhaKho = [];
    this.listNganKho = [];
    this.listLoKho = [];
    this.noiDungRow = {};
  }

  async saveDdiemNhap(statusSave) {
    this.spinner.show();
    this.formData.value.noiDungCuuTro.forEach(item => {
      item.trangThai = statusSave
    })
    this.formData.value.trangThaiXh = statusSave;
    let body = this.formData.value

    let res = await this.quyetDinhGiaoNvCuuTroService.updateDdiemNhap(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      this.redirectQdNhapXuat();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide();
    }
  }

  redirectQdNhapXuat() {
    this.showListEvent.emit();
  }

  xoaItem(data: any) {
    let noiDungCuuTro;
    if (data.id) {
      noiDungCuuTro = this.formData.value.noiDungCuuTro.filter(s => s.id != data.id);
    } else if (data.idVirtual) {
      noiDungCuuTro = this.formData.value.noiDungCuuTro.filter(s => s.idVirtual != data.idVirtual)
    }
    this.formData.patchValue({
      noiDungCuuTro: noiDungCuuTro
    })
    this.buildTableView();
  }

  handleCancel() {
    this.isVisible = false;
    this.noiDungRow = {}
  }

  handleOk() {
    if (!this.noiDungRow.maDiemKho || !this.noiDungRow.maNhaKho || !this.noiDungRow.maNganKho) {
      this.statusForm = 'error';
      this.notification.error(MESSAGE.ERROR, 'Bạn cần điền đầy đủ thông tin');
      return;
    }
    this.noiDungRow.tenDiemKho = this.listDiemKho.find(s => s.maDvi === this.noiDungRow.maDiemKho).tenDvi;
    this.noiDungRow.tenNhaKho = this.listNhaKho.find(s => s.maDvi === this.noiDungRow.maNhaKho).tenDvi;
    this.noiDungRow.tenNganKho = this.listNganKho.find(s => s.maDvi === this.noiDungRow.maNganKho).tenDvi;
    if (this.noiDungRow.maLoKho) {
      this.noiDungRow.tenLoKho = this.listLoKho.find(s => s.maDvi === this.noiDungRow.maLoKho).tenDvi;
    }
    this.noiDungRow.tenCloaiVthh = this.listChungLoaiHangHoa.find(s => s.ma = this.noiDungRow.cloaiVthh)?.ten;
    this.noiDungRow.thanhTien = this.noiDungRow.soLuongXuatChiCuc * this.noiDungRow.donGiaKhongVat;
    let table = this.formData.value.noiDungCuuTro;
    let index = table.findIndex(s => s.idVirtual === this.noiDungRow.idVirtual);

    if (index != -1) {
      table.splice(index, 1, this.noiDungRow);
    } else {
      table = [...table, this.noiDungRow]
    }
    this.formData.patchValue({
      noiDungCuuTro: table
    })
    this.buildTableView();
    this.isVisible = false;
    //clean
    this.noiDungRow = {}
    this.listChiCuc = []
  }

  showModal(item: any): void {
    this.isVisible = true;
    this.noiDungRow.noiDung = item.noiDung;
    this.noiDungRow.maDviChiCuc = this.userInfo.MA_DVI;
    this.noiDungRow.idVirtual = item.idVirtual ? item.idVirtual : uuid.v4();
    this.noiDungRow.tenChiCuc = this.userInfo.TEN_DVI;
    this.noiDungRow.soLuongXuat = item.soLuongXuat;
    let chiCucHienTai = this.formData.value.noiDungCuuTro.find(s => s.maDviChiCuc === this.userInfo.MA_DVI);
    if (chiCucHienTai) {
      this.noiDungRow.soLuongXuatChiCuc = chiCucHienTai.soLuongXuatChiCuc;
      this.noiDungRow.loaiVthh = chiCucHienTai.loaiVthh;
    }

    // this.listNoiDung = [...new Set(this.formData.value.deXuatPhuongAn.map(s => s.noiDung))];
    // this.phuongAnRow.loaiVthh = this.formData.value.loaiVthh;
  }

  async suaPhuongAn(data: any) {
    let currentRow;
    if (data.id) {
      currentRow = this.formData.value.noiDungCuuTro.find(s => s.id == data.id);
    } else if (data.idVirtual) {
      currentRow = this.formData.value.noiDungCuuTro.find(s => s.idVirtual == data.idVirtual)
    }
    this.noiDungRow = currentRow;
    await this.changeDiemKho();
    await this.changeNhaKho();
    await this.changeNganKho();

    this.showModal(data);
  }

  async selectHangHoa(event: any) {
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({str: event});
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listChungLoaiHangHoa = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
}

