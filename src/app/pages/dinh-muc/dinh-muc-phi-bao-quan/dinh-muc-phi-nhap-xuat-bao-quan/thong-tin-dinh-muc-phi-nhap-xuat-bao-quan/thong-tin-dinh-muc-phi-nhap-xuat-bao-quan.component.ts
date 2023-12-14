import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Base2Component } from '../../../../../components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QlDinhMucPhiService } from '../../../../../services/qlnv-kho/QlDinhMucPhi.service';
import { FormGroup, Validators } from '@angular/forms';
import { DinhMucPhiNxBq } from '../../../../../models/DinhMucPhi';
import { MESSAGE } from '../../../../../constants/message';
import { saveAs } from 'file-saver';
import { DanhMucDinhMucService } from '../../../../../services/danh-muc-dinh-muc.service';
import { DanhMucService } from '../../../../../services/danhmuc.service';
import { DonviService } from '../../../../../services/donvi.service';
import { AMOUNT_NO_DECIMAL, AMOUNT_ONE_DECIMAL, AMOUNT_THREE_DECIMAL } from '../../../../../Utility/utils';
import { STATUS } from '../../../../../constants/status';
import { v4 as uuidv4 } from 'uuid';

export interface TreeNodeInterface {
  id?: number;
  uuid?: string;
  parentId?: number;
  parentUuid?: string;
  maDinhMuc?: string;
  tenDinhMuc?: string;
  loaiVthh?: string;
  tenLoaiVthh?: string;
  cloaiVthh?: string;
  tenCloaiVthh?: string;
  loaiDinhMuc?: string;
  apDungTai?: any[];
  apDungTaiStr?: string;
  donViTinh?: string;
  soLuong?: number;
  chiPhiTheoDinhMucNhapToiDa?: number;
  chiPhiTheoDinhMucXuatToiDa?: number;
  chiPhiTheoDinhMucBqToiDa?: number;
  chiPhiNhapToiDa?: number;
  chiPhiXuatToiDa?: number;
  chiPhiBqToiDa?: number;
  thanhToanTheoVnd?: number;
  tyGia?: number;
  thanhToanTheoUsd?: number;
  thanhToanTheoVndKt?: number;
  tyGiaKt?: number;
  thanhToanTheoUsdKt?: number;
  chechLechVnd?: number;
  chechLechUsd?: number;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}

@Component({
  selector: 'app-thong-tin-dinh-muc-phi-nhap-xuat-bao-quan',
  templateUrl: './thong-tin-dinh-muc-phi-nhap-xuat-bao-quan.component.html',
  styleUrls: ['./thong-tin-dinh-muc-phi-nhap-xuat-bao-quan.component.scss'],
})
export class ThongTinDinhMucPhiNhapXuatBaoQuanComponent extends Base2Component implements OnInit {
  formData: FormGroup;
  formDataDtl: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Input('capDvi') capDvi: number;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  taiLieuDinhKemList: any[] = [];
  isAddDetail: boolean = false;
  rowItem: any = {};
  dataTableDetailTqd: any[] = [];
  dataTableDetailKtqd: TreeNodeInterface[] = [];
  dataListDetailKtqd: TreeNodeInterface[] = [];
  dataEdit: { [key: string]: { edit: boolean; data: DinhMucPhiNxBq } } = {};
  dsQtNsChiTw: any[] = [];
  filterTable: any = {
    namQuyetToan: '',
    ngayNhap: '',
    ngayCapNhat: '',
    qdCtKhNam: '',
    trangThai: '',
    trangThaiPdBtc: '',
  };
  listDonVi: any[] = [];
  listDonViPreview: any[] = [];
  listDmDinhMuc: any[] = [];
  listHangHoa: any[] = [];
  listLoaiDinhMuc: any[] = [];
  listLoaiBaoQuan: any[] = [];
  listTongDinhMucTongCucPhan: any[] = [];
  amount = AMOUNT_NO_DECIMAL;
  showDlgAddEdit: boolean = false;
  sttEdit: number;
  AMOUNT = AMOUNT_NO_DECIMAL;
  AMOUNT_THREE_DECIMAL = AMOUNT_THREE_DECIMAL
  formatterDollar = (value: number): string => {
    if (value) {
      let valueStr = value.toFixed(2);
      return `$ ${valueStr}`;
    }
    return `$ 0`;
  };
  parserDollar = (value: string): string => {
    let valueNum = value.replace('$ ', '');
    let num = Number(valueNum);
    return num.toFixed(2);
  };

  constructor(
    httpClient: HttpClient,
    private donViService: DonviService,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qlDinhMucPhiService: QlDinhMucPhiService,
    private danhMucDinhMucService: DanhMucDinhMucService,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qlDinhMucPhiService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [],
      nam: [''],
      soQd: ['', [Validators.required]],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ['Đang nhập dữ liệu'],
      ngayKy: ['', [Validators.required]],
      ngayHieuLuc: ['', [Validators.required]],
      ngayHetHieuLuc: [''],
      capDvi: [''],
      loai: ['00'],
      nhomDinhMuc: ['1'],
      trichYeu: ['', [Validators.required]],
      listQlDinhMucPhis: [null],
      listQlDinhMucPhisKtqd: [null],
      fileDinhKems: [null],
    });
    this.formDataDtl = this.fb.group({
      level: [, [Validators.required]],
      id: [],
      uuid: [, [Validators.required]],
      parentId: [, [Validators.required]],
      parentUuid: [, [Validators.required]],
      maDinhMuc: [, [Validators.required]],
      tenDinhMuc: [, [Validators.required]],
      loaiVthh: [, [Validators.required]],
      tenLoaiVthh: [, [Validators.required]],
      loaiDinhMuc: [, [Validators.required]],
      apDungTai: [, [Validators.required]],
      apDungTaiStr: [, [Validators.required]],
      donViTinh: [, [Validators.required]],
      soLuong: [, [Validators.required]],
      chiPhiTheoDinhMucNhapToiDa: [],
      chiPhiTheoDinhMucXuatToiDa: [],
      chiPhiNhapToiDa: [],
      chiPhiXuatToiDa: [],
      thanhToanTheoVnd: [],
      tyGia: [],
      thanhToanTheoUsd: [],
    });
    this.filterTable = {};
    this.dataTableDetailKtqd.forEach(item => {
      this.mapOfExpandedData[item.uuid] = this.convertTreeToList(item);
    });
  }

  async ngOnInit() {
    this.dataTableDetailTqd = [];
    this.spinner.show();
    try {
      await this.getAllLoaiDinhMuc();
      await this.loaiVTHHGetAll();
      await this.loadDonVi();
      await this.getTongDinhMucTongCucPhan();
      await this.loadAllDonViTheoCap();
      if (this.idInput > 0) {
        await this.detail(this.idInput);
      }
      this.rowItem = new DinhMucPhiNxBq();
      await this.loadDmDinhMuc();
      this.updateEditCacheTqd();
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.qlDinhMucPhiService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.fileDinhKem;
          this.dataTableDetailTqd = data.listQlDinhMucPhis;
          this.dataTableDetailTqd.forEach(item => {
            item.apDungTaiStr = this.getStrTenDonVi(item.apDungTai);
          });
          this.dataListDetailKtqd = data.listQlDinhMucPhisKtqd;
          this.dataListDetailKtqd.forEach(item => {
            item.apDungTaiStr = this.getStrTenDonVi(item.apDungTai);
          });
          this.updateEditCacheTqd();
          this.buildDataTableDetailKtqd();
          this.updateEditCacheKtqd();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }

  }

  async saveAndSend(status: string, msg: string, msgSuccess?: string) {
    try {
      if (this.dataTableDetailTqd.length <= 0 && this.dataTableDetailKtqd.length <= 0) {
        this.notification.error(MESSAGE.ERROR, 'Bạn chưa nhập chi tiết định mức phí nhập xuất bảo quản.');
        return;
      }
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      if (this.fileDinhKem && this.fileDinhKem.length > 0) {
        this.formData.value.fileDinhKems = this.fileDinhKem;
      }
      this.formData.value.listQlDinhMucPhis = this.dataTableDetailTqd;
      this.formData.value.listQlDinhMucPhisKtqd = this.dataListDetailKtqd;
      this.formData.value.capDvi = this.capDvi;
      this.formData.value.maDvi = this.userInfo.MA_DVI;
      await super.saveAndSend(this.formData.value, status, msg, msgSuccess);
    } catch (error) {
      console.error('Lỗi khi lưu và gửi dữ liệu:', error);
    }
  }


  async save() {
    if (this.dataTableDetailTqd.length <= 0 && this.dataTableDetailKtqd.length <= 0) {
      this.notification.error(MESSAGE.ERROR, 'Bạn chưa nhập chi tiết định mức phí nhập xuất bảo quản.');
      return;
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucPhis = this.dataTableDetailTqd;
    this.formData.value.listQlDinhMucPhisKtqd = this.dataListDetailKtqd;
    this.formData.value.capDvi = this.capDvi;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    let res = await this.createUpdate(this.formData.value);
    if (res) {
      this.idInput = res.id;
      this.formData.patchValue({ id: res.id });
    }
  }

  banHanh(id, trangThai) {
    this.approve(id, trangThai, 'Bạn có chắc chắn muốn ban hành?');
  }

  quayLai(capDvi) {
    this.capDvi = capDvi;
    this.goBack();
  }

  ngungHieuLuc(id, trangThai) {
    this.approve(id, trangThai, 'Bạn có chắc chắn muốn ban ngừng hiệu lực văn bản này?');
  }

  async loadDmDinhMuc() {
    let body = {
      capDvi: 1,
      maDvi: this.userInfo.MA_DVI,
      nhomDinhMuc: this.formData.value.nhomDinhMuc,
      paggingReq: {
        limit: 10000,
        page: 0,
      },
    };
    this.listDmDinhMuc = [];
    let res;
    if (this.capDvi == 1) {
      res = await this.danhMucDinhMucService.searchDsChuaSuDung(body);
    } else {
      res = await this.danhMucDinhMucService.searchDsTongCucApDung(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content && res.data.content.length > 0) {
        this.listDmDinhMuc = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDm(attr): void {
    let item;
    if (attr == 'ma') {
      item = this.listDmDinhMuc.filter(item => item.maDinhMuc == this.rowItem.maDinhMuc)[0];
    } else {
      item = this.listDmDinhMuc.filter(item => item.tenDinhMuc == this.rowItem.tenDinhMuc)[0];
    }
    if (item) {
      let tongDinhMucTongCuc = this.listTongDinhMucTongCucPhan.filter(it => it.maDinhMuc == item.maDinhMuc)[0];
      this.rowItem.tenDinhMuc = item.tenDinhMuc ? item.tenDinhMuc.toString() : null;
      this.rowItem.maDinhMuc = item.maDinhMuc ? item.maDinhMuc.toString() : null;
      this.rowItem.donViTinh = item.dviTinh ? item.dviTinh.toString() : null;
      this.rowItem.loaiDinhMuc = item.loaiDinhMuc ? item.loaiDinhMuc.toString() : null;
      this.rowItem.loaiBaoQuan = item.loaiHinhBq ? item.loaiHinhBq.toString() : null;
      this.rowItem.htBaoQuan = item.hinhThucBq ? item.hinhThucBq.toString() : null;
      this.rowItem.loaiVthh = item.loaiVthh ? item.loaiVthh.toString() : null;
      this.rowItem.cloaiVthh = item.cloaiVthh ? item.cloaiVthh.toString() : null;
      this.rowItem.tenLoaiVthh = item.tenLoaiVthh ? item.tenLoaiVthh.toString() : null;
      this.rowItem.tenCloaiVthh = item.tenCloaiVthh ? item.tenCloaiVthh.toString() : null;
      if (tongDinhMucTongCuc && this.capDvi == 2) {
        this.rowItem.tongDinhMucTc = tongDinhMucTongCuc.tongDinhMuc;
        this.rowItem.tcTongCucDieuHanhKv = tongDinhMucTongCuc.tcTongCucDieuHanhKv;
      }
    } else {
      this.rowItem.tenDinhMuc = null;
      this.rowItem.maDinhMuc = null;
      this.rowItem.donViTinh = null;
      this.rowItem.loaiDinhMuc = null;
      this.rowItem.loaiBaoQuan = null;
      this.rowItem.htBaoQuan = null;
      this.rowItem.loaiVthh = null;
      this.rowItem.cloaiVthh = null;
      this.rowItem.tenLoaiVthh = null;
      this.rowItem.tenCloaiVthh = null;
    }
    this.validAddDetailDm();
  }

  changeDmEdit(attr, idx): void {
    let item;
    if (attr == 'ma') {
      item = this.listDmDinhMuc.filter(item => item.maDinhMuc == this.dataEdit[idx].data.maDinhMuc)[0];
    } else {
      item = this.listDmDinhMuc.filter(item => item.tenDinhMuc == this.dataEdit[idx].data.tenDinhMuc)[0];
    }
    if (item) {
      this.dataEdit[idx].data.tenDinhMuc = item.tenDinhMuc ? item.tenDinhMuc.toString() : null;
      this.dataEdit[idx].data.maDinhMuc = item.maDinhMuc ? item.maDinhMuc.toString() : null;
      this.dataEdit[idx].data.donViTinh = item.dviTinh ? item.dviTinh.toString() : null;
      this.dataEdit[idx].data.loaiDinhMuc = item.loaiDinhMuc ? item.loaiDinhMuc.toString() : null;
      this.dataEdit[idx].data.loaiBaoQuan = item.loaiHinhBq ? item.loaiHinhBq.toString() : null;
      this.dataEdit[idx].data.htBaoQuan = item.hinhThucBq ? item.hinhThucBq.toString() : null;
      this.dataEdit[idx].data.loaiVthh = item.loaiVthh ? item.loaiVthh.toString() : null;
      this.dataEdit[idx].data.cloaiVthh = item.cloaiVthh ? item.cloaiVthh.toString() : null;
    } else {
      this.dataEdit[idx].data.tenDinhMuc = null;
      this.dataEdit[idx].data.maDinhMuc = null;
      this.dataEdit[idx].data.donViTinh = null;
      this.dataEdit[idx].data.loaiDinhMuc = null;
      this.dataEdit[idx].data.loaiBaoQuan = null;
      this.dataEdit[idx].data.htBaoQuan = null;
      this.dataEdit[idx].data.loaiVthh = null;
      this.dataEdit[idx].data.cloaiVthh = null;
    }
  }

  async loadDonVi() {
    const res = await this.donViService.layDonViCon();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDonVi = res.data.filter(item => item.type !== 'PB');
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadAllDonViTheoCap() {
    const res = await this.donViService.layTatCaDonViByLevel(this.capDvi + 1);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDonViPreview = res.data.filter(item => item.type !== 'PB');
    }
  }

  async getAllLoaiDinhMuc() {
    let resLoaiDinhMuc = await this.danhMucService.danhMucChungGetAll('LOAI_DINH_MUC');
    if (resLoaiDinhMuc.msg == MESSAGE.SUCCESS) {
      this.listLoaiDinhMuc = resLoaiDinhMuc.data;
    }
    let resLoaiHinhBaoQuan = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_BAO_QUAN');
    if (resLoaiHinhBaoQuan.msg == MESSAGE.SUCCESS) {
      this.listLoaiBaoQuan = resLoaiHinhBaoQuan.data;
    }
  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (!this.typeVthh) {
        this.listHangHoa = res.data;
      } else {
        this.listHangHoa = res.data?.filter(x => x.ma == this.typeVthh);
      }
    }
  }

  async getTongDinhMucTongCucPhan() {
    this.listTongDinhMucTongCucPhan = [];
    let body = { trangThai: STATUS.BAN_HANH, loai: '00', capDvi: 1, maDvi: this.userInfo.MA_DVI };
    let res = await this.qlDinhMucPhiService.layDanhSachTongDinhMucTongCucPhan(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listTongDinhMucTongCucPhan = res.data;
    }
  }

  async addDetailDinhMucTqd() {
    if (!this.isAddDetail) {
      return;
    }
    let msgRequired = '';
    //validator
    if (!this.rowItem.tenDinhMuc) {
      msgRequired = 'Tên định mức không được để trống';
    } else if (!this.rowItem.maDinhMuc) {
      msgRequired = 'Mã định mức không được để trống';
    }
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (this.checkExitsData(this.rowItem, this.dataTableDetailTqd)) {
      this.notification.error(MESSAGE.ERROR, 'Dữ liệu trùng lặp, đề nghị nhập lại.');
      this.spinner.hide();
      return;
    }
    if (this.rowItem.apDungTai) {
      this.rowItem.apDungTai = this.rowItem.apDungTai ? this.rowItem.apDungTai.toString() : null;
      this.rowItem.apDungTaiStr = this.getStrTenDonVi(this.rowItem.apDungTai);
    }
    this.dataTableDetailTqd = [...this.dataTableDetailTqd, this.rowItem];
    this.rowItem = new DinhMucPhiNxBq();
    this.updateEditCacheTqd();
    this.isAddDetail = false;
  }

  async addDetailDinhMucKtqd() {
    if (!this.isAddDetail) {
      return;
    }
    if (!this.rowItem.uuid) {
      this.rowItem.uuid = uuidv4();
    }
    let msgRequired = '';
    //validator
    if (!this.rowItem.tenDinhMuc) {
      msgRequired = 'Tên định mức không được để trống';
    } else if (!this.rowItem.maDinhMuc) {
      msgRequired = 'Mã định mức không được để trống';
    } else if (!this.rowItem.apDungTai) {
      msgRequired = 'Áp dụng tại cục không được để trống';
    } else if (!this.rowItem.soLuong) {
      msgRequired = 'Số lượng không được để trống';
    }
    // else if (!this.rowItem.thanhToanTheoVnd) {
    //   msgRequired = 'Thanh toán theo VNĐ không được để trống';
    // } else if (!this.rowItem.tyGia) {
    //   msgRequired = 'Tỷ giá không được để trống';
    // } else if (!this.rowItem.thanhToanTheoUsd) {
    //   msgRequired = 'Thanh toán theo USD không được để trống';
    // }

    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (this.checkExitsData(this.rowItem, this.dataTableDetailKtqd)) {
      this.notification.error(MESSAGE.ERROR, 'Dữ liệu trùng lặp, đề nghị nhập lại.');
      this.spinner.hide();
      return;
    }
    if (this.rowItem.apDungTai) {
      let apDungTai = this.rowItem.apDungTai ? this.rowItem.apDungTai.toString() : null;
      if (apDungTai === '') {
        this.rowItem.apDungTaiStr = 'Tất cả';
      } else {
        this.rowItem.apDungTaiStr = this.getStrTenDonVi(apDungTai);
      }
      this.rowItem.apDungTai = this.rowItem.apDungTai ? this.rowItem.apDungTai.toString() : null;
    }
    this.dataListDetailKtqd = [...this.dataListDetailKtqd, this.rowItem];
    this.rowItem = {};
    this.buildDataTableDetailKtqd();
    this.updateEditCacheKtqd();
    this.isAddDetail = false;
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maDinhMuc == item.maDinhMuc) {
          rs = true;
          return;
        }
      });
    }
    return rs;
  }

  checkExitsDataUpdate(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      let times = 0;
      dataItem.forEach(it => {
        if (it.maDinhMuc == item.maDinhMuc) {
          times++;
          if (times == 2) {
            rs = true;
            return;
          }
        }
      });
    }
    return rs;
  }

  getStrTenDonVi(strMaDonVi) {
    let str = '';
    if (strMaDonVi) {
      let arrMaDvi = strMaDonVi.split(',');
      arrMaDvi.forEach((item) => {
        if (item == '') {
          str = 'Tất cả,';
        } else {
          this.listDonViPreview.forEach(donvi => {
            if (item == donvi.maDvi) {
              str = str + donvi.tenDvi + ',';
            }
          });
        }
      });
    }
    return str.slice(0, -1);
  }

  validAddDetailDm() {
    if (this.rowItem.tenDinhMuc && this.rowItem.maDinhMuc) {
      this.isAddDetail = true;
    }
  }

  updateEditCacheTqd(): void {
    if (this.dataTableDetailTqd) {
      this.dataTableDetailTqd.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  updateEditCacheKtqd(): void {
    if (this.dataTableDetailKtqd) {
      this.dataTableDetailKtqd.forEach(item => {
        this.mapOfExpandedData[item.uuid] = this.convertTreeToList(item);
      });
    }
  }

  buildDataTableDetailKtqd() {
    this.dataTableDetailKtqd = [];
    const map = new Map(); // Use a map to efficiently store items by their IDs.

    // First, create a map of items by their IDs.
    this.dataListDetailKtqd.forEach(item => {
      map.set(item.uuid, { ...item, children: [] });
    });

    // Then, organize the items into a tree structure.
    this.dataListDetailKtqd.forEach(item => {
      if (item.parentUuid) {
        // If the item has a parent, add it as a child of the parent.
        map.get(item.parentUuid).children.push(map.get(item.uuid));
        map.get(item.parentUuid).chiPhiTheoDinhMucNhapToiDa = map.get(item.parentUuid).children.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.chiPhiTheoDinhMucNhapToiDa), 0);
        map.get(item.parentUuid).chiPhiTheoDinhMucXuatToiDa = map.get(item.parentUuid).children.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.chiPhiTheoDinhMucXuatToiDa), 0);
        map.get(item.parentUuid).chiPhiNhapToiDa = map.get(item.parentUuid).children.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.chiPhiNhapToiDa), 0);
        map.get(item.parentUuid).chiPhiXuatToiDa = map.get(item.parentUuid).children.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.chiPhiXuatToiDa), 0);

        // update vào list
        let p = this.dataListDetailKtqd.find(item1 => item1.uuid == item.parentUuid);
        if (p) {
          p.chiPhiTheoDinhMucNhapToiDa = map.get(item.parentUuid).chiPhiTheoDinhMucNhapToiDa;
          p.chiPhiTheoDinhMucXuatToiDa = map.get(item.parentUuid).chiPhiTheoDinhMucXuatToiDa;
          p.chiPhiNhapToiDa = map.get(item.parentUuid).chiPhiNhapToiDa;
          p.chiPhiXuatToiDa = map.get(item.parentUuid).chiPhiXuatToiDa;
        }
      } else {
        // If the item has no parent, it's a root item, so add it to the main tree.
        map.get(item.uuid).chiPhiNhapToiDa = map.get(item.uuid).children.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.chiPhiNhapToiDa), 0);
        map.get(item.uuid).chiPhiXuatToiDa = map.get(item.uuid).children.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.chiPhiXuatToiDa), 0);
        // update vào list
        let p = this.dataListDetailKtqd.find(item1 => item1.uuid == item.uuid);
        if (p) {
          p.chiPhiTheoDinhMucNhapToiDa = map.get(item.uuid).chiPhiTheoDinhMucNhapToiDa;
          p.chiPhiTheoDinhMucXuatToiDa = map.get(item.uuid).chiPhiTheoDinhMucXuatToiDa;
          p.chiPhiNhapToiDa = map.get(item.uuid).chiPhiNhapToiDa;
          p.chiPhiXuatToiDa = map.get(item.uuid).chiPhiXuatToiDa;
        }
        this.dataTableDetailKtqd.push(map.get(item.uuid));
      }
    });
  }

  saveEdit(idx: number): void {
    Object.assign(this.dataTableDetailTqd[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }

  editRowTqd(stt: number) {
    this.dataEdit[stt].edit = true;
    this.calcuLateTong('EDIT', stt);
  }

  editRowKtqd(item: any, level: number) {
    this.isAddDetail = false;
    this.sttEdit = this.dataListDetailKtqd.findIndex(element => element.uuid === item.uuid);
    this.openDlgAddEdit();
    if (!item.apDungTai) {
      item.apDungTai = [''];
    }
    this.formDataDtl.patchValue({
      ...item,
      level,
    });
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: { ...this.dataTableDetailTqd[stt] },
      edit: false,
    };
  }

  async saveDinhMuc(idx: number) {
    let msgRequired = '';
    //validator
    if (!this.dataEdit[idx].data.tenDinhMuc) {
      msgRequired = 'Tên định mức không được để trống';
    } else if (!this.dataEdit[idx].data.maDinhMuc) {
      msgRequired = 'Mã định mức không được để trống';
    }
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    this.dataEdit[idx].data.apDungTai = this.dataEdit[idx].data.apDungTai ? this.dataEdit[idx].data.apDungTai.toString() : null;
    Object.assign(this.dataTableDetailTqd[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }

  deleteItemTqd(index: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTableDetailTqd.splice(index, 1);
          this.updateEditCacheTqd();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  deleteItemKtqd(item: any, level: number) {
    this.sttEdit = this.dataListDetailKtqd.findIndex(element => element.uuid === item.uuid);
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataListDetailKtqd.splice(this.sttEdit, 1);
          this.buildDataTableDetailKtqd();
          this.updateEditCacheKtqd();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  maxValueInput(): number {
    return 1000;
  }

  protected readonly AMOUNT_ONE_DECIMAL = AMOUNT_ONE_DECIMAL;

  changeNhomDinhMuc($event: any) {
    if ($event == '2') {
      this.formData.controls['nam'].setValidators(Validators.required);
    } else {
      this.formData.controls['nam'].setValidators(null);
    }
    this.rowItem = {};
    this.loadDmDinhMuc();
  }

  addRow(item: any, level: number) {
    this.isAddDetail = true;
    this.openDlgAddEdit();
    this.formDataDtl.patchValue({
      ...item,
      level,
      parentUuid: item.uuid,
      uuid: undefined,
      maDinhMuc: undefined,
      tenDinhMuc: undefined,
      soLuong: undefined,
      chiPhiTheoDinhMucNhapToiDa: undefined,
      chiPhiTheoDinhMucXuatToiDa: undefined,
      // loaiVthh: undefined,
      // tenLoaiVthh: undefined,
      // cloaiVthh: undefined,
      // tenCloaiVthh: undefined,
      loaiDinhMuc: undefined,
      thanhToanTheoVnd: undefined,
      tyGia: undefined,
      thanhToanTheoUsd: undefined,
      chiPhiNhapToiDa: undefined,
      chiPhiXuatToiDa: undefined,
    });
  }

  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.uuid === d.uuid)!;
          target.expand = true;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: true, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.uuid]) {
      hashMap[node.uuid] = true;
      array.push(node);
    }
  }

  checkDisableNhomDinhMuc() {
    if (this.dataTableDetailTqd && this.dataTableDetailTqd.length > 0) {
      return true;
    }
    if (this.dataTableDetailKtqd && this.dataTableDetailKtqd.length > 0) {
      return true;
    }
    return false;
  }

  openDlgAddEdit() {
    this.showDlgAddEdit = true;
  }

  closeDlgAddEdit() {
    this.showDlgAddEdit = false;
    this.formDataDtl.reset();
  }

  tinhTyGiaVndUsd($event: any) {
    if (!this.rowItem.tyGia) {
      this.rowItem.tyGia = 0;
    }
    if (!this.rowItem.thanhToanTheoUsd) {
      this.rowItem.thanhToanTheoUsd = 0;
    }
    if (this.rowItem.tyGia == 0) {
      this.rowItem.thanhToanTheoUsd = 0;
    } else {
      this.rowItem.thanhToanTheoUsd = $event / this.rowItem.tyGia;
    }
  }

  tinhTyGiaUsdVnd($event: any) {
    if (!this.rowItem.tyGia) {
      this.rowItem.tyGia = 0;
    }
    if (!this.rowItem.thanhToanTheoVnd) {
      this.rowItem.thanhToanTheoVnd = 0;
    }
    if (this.rowItem.tyGia == 0) {
      this.rowItem.thanhToanTheoVnd = 0;
    }
    this.rowItem.thanhToanTheoVnd = $event * this.rowItem.tyGia;
  }

  tinhTyGia($event: any) {
    if (!this.rowItem.tyGia) {
      this.rowItem.tyGia = 0;
    }
    if (!this.rowItem.thanhToanTheoVnd) {
      this.rowItem.thanhToanTheoVnd = 0;
    }
    if (!this.rowItem.thanhToanTheoUsd) {
      this.rowItem.thanhToanTheoUsd = 0;
    }
    this.rowItem.thanhToanTheoUsd = this.rowItem.thanhToanTheoVnd / $event;
    this.rowItem.thanhToanTheoVnd = this.rowItem.thanhToanTheoUsd * $event;
  }

  tinhTyGiaVndUsdKT($event: any) {
    if (!this.rowItem.tyGiaKt) {
      this.rowItem.tyGiaKt = 0;
    }
    if (!this.rowItem.thanhToanTheoUsdKt) {
      this.rowItem.thanhToanTheoUsdKt = 0;
    }
    if (this.rowItem.tyGiaKt == 0) {
      this.rowItem.thanhToanTheoUsdKt = 0;
    } else {
      this.rowItem.thanhToanTheoUsdKt = $event / this.rowItem.tyGiaKt;
    }
  }

  tinhTyGiaUsdVndKT($event: any) {
    if (!this.rowItem.tyGiaKt) {
      this.rowItem.tyGiaKt = 0;
    }
    if (!this.rowItem.thanhToanTheoVndKt) {
      this.rowItem.thanhToanTheoVndKt = 0;
    }
    if (this.rowItem.tyGiaKt == 0) {
      this.rowItem.thanhToanTheoVndKt = 0;
    }
    this.rowItem.thanhToanTheoVndKt = $event * this.rowItem.tyGiaKt;
  }

  tinhTyGiaKT($event: any) {
    if (!this.rowItem.tyGiaKt) {
      this.rowItem.tyGiaKt = 0;
    }
    if (!this.rowItem.thanhToanTheoVndKt) {
      this.rowItem.thanhToanTheoVndKt = 0;
    }
    if (!this.rowItem.thanhToanTheoUsdKt) {
      this.rowItem.thanhToanTheoUsdKt = 0;
    }
    this.rowItem.thanhToanTheoUsdKt = this.rowItem.thanhToanTheoVndKt / $event;
    this.rowItem.thanhToanTheoVndKt = this.rowItem.thanhToanTheoUsdKt * $event;
  }

  changeMaDinhMuc(value: string, attr: any): void {
    let item;
    if (attr == 'ma') {
      item = this.listDmDinhMuc.filter(item => item.maDinhMuc == value)[0];
    } else {
      item = this.listDmDinhMuc.filter(item => item.tenDinhMuc == value)[0];
    }
    if (item) {
      this.formDataDtl.patchValue({
        tenDinhMuc: item.tenDinhMuc ? item.tenDinhMuc.toString() : null,
        donViTinh: item.dviTinh ? item.dviTinh.toString() : null,
        loaiDinhMuc: item.loaiDinhMuc ? item.loaiDinhMuc.toString() : null,
        loaiBaoQuan: item.loaiHinhBq ? item.loaiHinhBq.toString() : null,
        htBaoQuan: item.hinhThucBq ? item.hinhThucBq.toString() : null,
        loaiVthh: item.loaiVthh ? item.loaiVthh.toString() : null,
        cloaiVthh: item.cloaiVthh ? item.cloaiVthh.toString() : null,
        tenLoaiVthh: item.tenLoaiVthh ? item.tenLoaiVthh.toString() : null,
        tenCloaiVthh: item.tenCloaiVthh ? item.tenCloaiVthh.toString() : null,
      });
      let tongDinhMucTongCuc = this.listTongDinhMucTongCucPhan.filter(it => it.maDinhMuc == item.maDinhMuc)[0];
      if (tongDinhMucTongCuc && this.capDvi == 2) {
        this.formDataDtl.patchValue({
          tongDinhMucTc: tongDinhMucTongCuc.tongDinhMuc,
          tcTongCucDieuHanhKv: tongDinhMucTongCuc.tcTongCucDieuHanhKv,
        });
      }
    } else {
      this.formDataDtl.patchValue({
        tenDinhMuc: null,
        donViTinh: null,
        loaiDinhMuc: null,
        loaiBaoQuan: null,
        htBaoQuan: null,
        loaiVthh: null,
        cloaiVthh: null,
        tenLoaiVthh: null,
        tenCloaiVthh: null,
      });
    }
  }

  changeTinhTyGiaVndUsd(event: any) {
    if (!this.formDataDtl.value.tyGia) {
      this.formDataDtl.value.tyGia = 0;
    }
    if (!this.formDataDtl.value.thanhToanTheoUsd) {
      this.formDataDtl.value.thanhToanTheoUsd = 0;
    }
    if (this.formDataDtl.value.tyGia == 0) {
      this.formDataDtl.value.thanhToanTheoUsd = 0;
    } else {
      this.formDataDtl.patchValue({
        thanhToanTheoUsd: event / this.formDataDtl.value.tyGia,
      });
    }
  }

  changeTinhTyGiaUsdVnd($event: any) {
    if (!this.formDataDtl.value.tyGia) {
      this.formDataDtl.value.tyGia = 0;
    }
    if (!this.formDataDtl.value.thanhToanTheoVnd) {
      this.formDataDtl.value.thanhToanTheoVnd = 0;
    }
    if (this.formDataDtl.value.tyGia == 0) {
      this.formDataDtl.value.thanhToanTheoVnd = 0;
    }
    this.formDataDtl.patchValue({
      thanhToanTheoVnd: $event.target.value * this.formDataDtl.value.tyGia,
    });
  }

  calcuLateTong(type, idx?) {
    if (type === 'ADD') {
      this.rowItem.tongCongMucChiVpCuc = (this.rowItem.nvChuyenMonTc ? this.rowItem.nvChuyenMonTc : 0) + (this.rowItem.ttCaNhanTc ? this.rowItem.ttCaNhanTc : 0) + (this.rowItem.tcDieuHanhTc ? this.rowItem.tcDieuHanhTc : 0);
      this.rowItem.congMucChiVpCuc = (this.rowItem.nvChuyenMonTc ? this.rowItem.nvChuyenMonTc : 0) + (this.rowItem.ttCaNhanTc ? this.rowItem.ttCaNhanTc : 0);
      this.rowItem.tongCongMucChiCuc = (this.rowItem.nvChuyenMonKv ? this.rowItem.nvChuyenMonKv : 0) + (this.rowItem.ttCaNhanKv ? this.rowItem.ttCaNhanKv : 0) + (this.rowItem.tcDieuHanhKv ? this.rowItem.tcDieuHanhKv : 0);
      this.rowItem.congMucChiCuc = (this.rowItem.nvChuyenMonKv ? this.rowItem.nvChuyenMonKv : 0) + (this.rowItem.ttCaNhanKv ? this.rowItem.ttCaNhanKv : 0);
      this.rowItem.tongDinhMucChiDonVi = (this.rowItem.tongCongMucChiVpCuc ? this.rowItem.tongCongMucChiVpCuc : 0) + (this.rowItem.tcDieuHanhTc ? this.rowItem.tcDieuHanhTc : 0);
    } else {
      this.dataEdit[idx].data.tongCongMucChiVpCuc = (this.dataEdit[idx].data.nvChuyenMonTc ? this.dataEdit[idx].data.nvChuyenMonTc : 0) + (this.dataEdit[idx].data.ttCaNhanTc ? this.dataEdit[idx].data.ttCaNhanTc : 0) + (this.dataEdit[idx].data.tcDieuHanhTc ? this.dataEdit[idx].data.tcDieuHanhTc : 0);
      this.dataEdit[idx].data.congMucChiVpCuc = (this.dataEdit[idx].data.nvChuyenMonTc ? this.dataEdit[idx].data.nvChuyenMonTc : 0) + (this.dataEdit[idx].data.ttCaNhanTc ? this.dataEdit[idx].data.ttCaNhanTc : 0);
      this.dataEdit[idx].data.tongCongMucChiCuc = (this.dataEdit[idx].data.nvChuyenMonKv ? this.dataEdit[idx].data.nvChuyenMonKv : 0) + (this.dataEdit[idx].data.ttCaNhanKv ? this.dataEdit[idx].data.ttCaNhanKv : 0) + (this.dataEdit[idx].data.tcDieuHanhKv ? this.dataEdit[idx].data.tcDieuHanhKv : 0);
      this.dataEdit[idx].data.congMucChiCuc = (this.dataEdit[idx].data.nvChuyenMonKv ? this.dataEdit[idx].data.nvChuyenMonKv : 0) + (this.dataEdit[idx].data.ttCaNhanKv ? this.dataEdit[idx].data.ttCaNhanKv : 0);
      this.dataEdit[idx].data.tongDinhMucChiDonVi = (this.dataEdit[idx].data.tongCongMucChiVpCuc ? this.dataEdit[idx].data.tongCongMucChiVpCuc : 0) + (this.dataEdit[idx].data.tcDieuHanhTc ? this.dataEdit[idx].data.tcDieuHanhTc : 0);
    }
  }

  changeTinhTyGia(event: any) {
    if (!this.formDataDtl.value.tyGia) {
      this.formDataDtl.value.tyGia = 0;
    }
    if (!this.formDataDtl.value.thanhToanTheoVnd) {
      this.formDataDtl.value.thanhToanTheoVnd = 0;
    }
    if (!this.formDataDtl.value.thanhToanTheoUsd) {
      this.formDataDtl.value.thanhToanTheoUsd = 0;
    }
    this.formDataDtl.patchValue({
      thanhToanTheoUsd: this.formDataDtl.value.thanhToanTheoVnd / event,
    });
    // this.formDataDtl.patchValue({
    //   thanhToanTheoVnd: this.formDataDtl.value.thanhToanTheoUsd * event,
    // });
  }

  saveAddEdit() {
    if (!this.formDataDtl.value.uuid) {
      this.formDataDtl.patchValue({ uuid: uuidv4() });
    }
    let msgRequired = '';
    //validator
    if (!this.formDataDtl.value.tenDinhMuc) {
      msgRequired = 'Tên định mức không được để trống';
    } else if (!this.formDataDtl.value.maDinhMuc) {
      msgRequired = 'Mã định mức không được để trống';
    } else if (!this.formDataDtl.value.apDungTaiStr) {
      msgRequired = 'Áp dụng tại cục không được để trống';
    }
    // else if (!this.formDataDtl.value.thanhToanTheoVnd) {
    //   msgRequired = 'Thanh toán theo VNĐ không được để trống';
    // } else if (!this.formDataDtl.value.tyGia) {
    //   msgRequired = 'Tỷ giá không được để trống';
    // } else if (!this.formDataDtl.value.thanhToanTheoUsd) {
    //   msgRequired = 'Thanh toán theo USD không được để trống';
    // } else if (!this.formDataDtl.value.chiPhiTheoDinhMucNhapToiDa) {
    //   msgRequired = 'Chi phí theo định mức không được để trống';
    // } else if (!this.formDataDtl.value.chiPhiTheoDinhMucXuatToiDa) {
    //   msgRequired = 'Chi phí theo định mức không được để trống';
    // } else if (!this.formDataDtl.value.chiPhiNhapToiDa) {
    //   msgRequired = 'Chi phí không theo định mức - chi phí nhập tối đa không được để trống';
    // } else if (!this.formDataDtl.value.chiPhiXuatToiDa) {
    //   msgRequired = 'Chi phí không theo định mức - chi phí xuất tối đa không được để trống';
    // }
    if (this.formDataDtl.value.level == 0) {
      if (!this.formDataDtl.value.soLuong) {
        msgRequired = 'Số lượng không được để trống';
      }
    }

    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (this.isAddDetail) {
      if (this.checkExitsData(this.formDataDtl.value, this.dataTableDetailKtqd)) {
        this.notification.error(MESSAGE.ERROR, 'Dữ liệu trùng lặp, đề nghị nhập lại.');
        this.spinner.hide();
        return;
      }
    } else {
      if (this.checkExitsDataUpdate(this.formDataDtl.value, this.dataTableDetailKtqd)) {
        this.notification.error(MESSAGE.ERROR, 'Dữ liệu trùng lặp, đề nghị nhập lại.');
        this.spinner.hide();
        return;
      }
    }

    if (this.formDataDtl.value.apDungTai) {
      let apDungTai = this.formDataDtl.value.apDungTai ? this.formDataDtl.value.apDungTai.toString() : null;
      if (apDungTai === '') {
        this.formDataDtl.patchValue({ apDungTaiStr: 'Tất cả' });
      } else {
        this.formDataDtl.patchValue({ apDungTaiStr: this.getStrTenDonVi(apDungTai) });
      }
    }
    if (this.isAddDetail) {
      this.dataListDetailKtqd = [...this.dataListDetailKtqd, this.formDataDtl.value];
    } else {
      this.dataListDetailKtqd[this.sttEdit] = { ...this.formDataDtl.value };
    }

    this.formDataDtl.reset();
    this.buildDataTableDetailKtqd();
    this.updateEditCacheKtqd();
    this.closeDlgAddEdit();
  }

  viewRow(item: TreeNodeInterface, level: number) {
    this.openDlgAddEdit();
    this.formDataDtl.patchValue({
      ...item,
      level,
    });
  }

  exportDataDetail() {
    if ((this.formData.get("nhomDinhMuc").value == "1" && this.dataTableDetailTqd.length > 0) || (this.formData.get("nhomDinhMuc").value == "2" && this.dataTableDetailKtqd.length > 0) ) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        this.qlDinhMucPhiService
          .exportDetail(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-chi-tiet-dinh-muc-phi-nhap-xuat-bao-quan.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }
}
