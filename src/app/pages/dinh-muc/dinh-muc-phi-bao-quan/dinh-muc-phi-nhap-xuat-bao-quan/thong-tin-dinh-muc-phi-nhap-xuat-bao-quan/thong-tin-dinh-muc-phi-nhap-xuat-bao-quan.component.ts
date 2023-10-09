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
import { DanhMucDinhMucService } from '../../../../../services/danh-muc-dinh-muc.service';
import { DanhMucService } from '../../../../../services/danhmuc.service';
import { DonviService } from '../../../../../services/donvi.service';
import { AMOUNT_NO_DECIMAL, AMOUNT_ONE_DECIMAL } from '../../../../../Utility/utils';
import { STATUS } from '../../../../../constants/status';

@Component({
  selector: 'app-thong-tin-dinh-muc-phi-nhap-xuat-bao-quan',
  templateUrl: './thong-tin-dinh-muc-phi-nhap-xuat-bao-quan.component.html',
  styleUrls: ['./thong-tin-dinh-muc-phi-nhap-xuat-bao-quan.component.scss'],
})
export class ThongTinDinhMucPhiNhapXuatBaoQuanComponent extends Base2Component implements OnInit {
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Input('capDvi') capDvi: number;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  taiLieuDinhKemList: any[] = [];
  isAddDetail: boolean = false;
  rowItem: DinhMucPhiNxBq = new DinhMucPhiNxBq();
  dataTableDetail: any[] = [];
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
      id: [''],
      soQd: ['', [Validators.required]],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      ngayKy: ['', [Validators.required]],
      ngayHieuLuc: ['', [Validators.required]],
      ngayHetHieuLuc: [''],
      capDvi: [''],
      loai: ['00'],
      trichYeu: ['', [Validators.required]],
      listQlDinhMucPhis: [null],
      fileDinhKems: [null],
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    this.dataTableDetail = [];
    this.spinner.show();
    try {
      await this.getAllLoaiDinhMuc();
      await this.loaiVTHHGetAll();
      await this.loadDmDinhMuc();
      await this.loadDonVi();
      await this.getTongDinhMucTongCucPhan();
      await this.loadAllDonViTheoCap();
      if (this.idInput > 0) {
        this.detail(this.idInput);
      }
      this.updateEditCache();
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
          this.dataTableDetail = data.listQlDinhMucPhis;
          this.dataTableDetail.forEach(item => {
            item.apDungTaiStr = this.getStrTenDonVi(item.apDungTai);
          });
          this.updateEditCache();
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


  async save() {
    if (this.dataTableDetail.length <= 0) {
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
    this.formData.value.listQlDinhMucPhis = this.dataTableDetail;
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
      paggingReq: {
        limit: 10000,
        page: 0,
      },
    };
    let res;
    if (this.capDvi == 1) {
      res = await this.danhMucDinhMucService.searchDsChuaSuDung(body);
    } else {
      res = await this.danhMucDinhMucService.searchDsTongCucApDung(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content && res.data.content.length > 0) {
        for (let item of res.data.content) {
          this.listDmDinhMuc.push(item);
        }
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
      ;
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

  async addDetailDinhMuc() {
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
    if (this.checkExitsData(this.rowItem, this.dataTableDetail)) {
      this.notification.error(MESSAGE.ERROR, 'Dữ liệu trùng lặp, đề nghị nhập lại.');
      this.spinner.hide();
      return;
    }
    if (this.rowItem.apDungTai) {
      this.rowItem.apDungTai = this.rowItem.apDungTai ? this.rowItem.apDungTai.toString() : null;
      this.rowItem.apDungTaiStr = this.getStrTenDonVi(this.rowItem.apDungTai);
    }
    this.dataTableDetail = [...this.dataTableDetail, this.rowItem];
    this.rowItem = new DinhMucPhiNxBq();
    this.updateEditCache();
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

  getStrTenDonVi(strMaDonVi) {
    let str = '';
    if (strMaDonVi) {
      let arrMaDvi = strMaDonVi.split(',');
      arrMaDvi.forEach((item) => {
        this.listDonViPreview.forEach(donvi => {
          if (item == donvi.maDvi) {
            str = str + donvi.tenDvi + ',';
          }
        });
      });
    }
    return str.slice(0, -1);
  }

  validAddDetailDm() {
    if (this.rowItem.tenDinhMuc && this.rowItem.maDinhMuc) {
      this.isAddDetail = true;
    }
  }

  updateEditCache(): void {
    if (this.dataTableDetail) {
      this.dataTableDetail.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }

  }

  saveEdit(idx: number): void {
    Object.assign(this.dataTableDetail[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }

  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: { ...this.dataTableDetail[stt] },
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
    Object.assign(this.dataTableDetail[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }

  deleteItem(index: any) {
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
          this.dataTableDetail.splice(index, 1);
          this.updateEditCache();
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
}
