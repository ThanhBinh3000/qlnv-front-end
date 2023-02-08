import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {QlDinhMucPhiService} from "../../../../../services/qlnv-kho/QlDinhMucPhi.service";
import {FormGroup, Validators} from "@angular/forms";
import {DinhMucPhiNxBq} from "../../../../../models/DinhMucPhi";
import {MESSAGE} from "../../../../../constants/message";
import {DanhMucDinhMucService} from "../../../../../services/danh-muc-dinh-muc.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {DonviService} from "../../../../../services/donvi.service";
import {KeHoachVonPhiBNCT} from "../../../../../models/KeHoachVonPhiBNCT";

@Component({
  selector: 'app-thong-tin-dinh-muc-phi-nhap-xuat-bao-quan',
  templateUrl: './thong-tin-dinh-muc-phi-nhap-xuat-bao-quan.component.html',
  styleUrls: ['./thong-tin-dinh-muc-phi-nhap-xuat-bao-quan.component.scss']
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
  listDonVi: any[] = []
  listDmDinhMuc: any[] = [];
  listHangHoa: any[] = [];
  listLoaiDinhMuc: any[] = [];
  listLoaiBaoQuan: any[] = [];

  constructor(
    httpClient: HttpClient,
    private donViService: DonviService,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    qlDinhMucPhiService: QlDinhMucPhiService,
    private danhMucDinhMucService: DanhMucDinhMucService,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qlDinhMucPhiService)
    super.ngOnInit()
    this.formData = this.fb.group({
      soQd: ['', [Validators.required]],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      ngayKy: ['', [Validators.required]],
      capDvi: [],
      trichYeu: ['', [Validators.required]],
      listQlDinhMucPhis: [null],
      fileDinhKems: [null]
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.getAllLoaiDinhMuc();
      await this.loaiVTHHGetAll();
      await this.loadDmDinhMuc();
      await this.loadDonVi();
      await this.search();
      if(this.idInput > 0){
        this.detail(this.idInput);
      }
      this.updateEditCache();
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  save() {
    if (this.dataTable.length <= 0) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập chi tiết định mức phí nhập xuất bảo quản.");
      return;
    }
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucPhis = this.dataTable;
    this.formData.value.capDvi = this.capDvi;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    console.log(this.formData.value);
    this.createUpdate(this.formData.value)
  }

  async loadDmDinhMuc() {
    let body = {
      paggingReq: {
        limit: 10000,
        page: 0,
      }
    };
    let res = await this.danhMucDinhMucService.search(body);
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
      this.rowItem.tenDinhMuc = item.tenDinhMuc ? item.tenDinhMuc.toString() : null;
      this.rowItem.maDinhMuc = item.maDinhMuc ? item.maDinhMuc.toString() : null;
      this.rowItem.donViTinh = item.dviTinh ? item.dviTinh.toString() : null;
      this.rowItem.loaiDinhMuc = item.loaiDinhMuc ? item.loaiDinhMuc.toString() : null;
      this.rowItem.loaiBaoQuan = item.loaiHinhBq ? item.loaiHinhBq.toString() : null;
      this.rowItem.htBaoQuan = item.hinhThucBq ? item.hinhThucBq.toString() : null;
      this.rowItem.loaiVthh = item.loaiVthh ? item.loaiVthh.toString() : null;
      this.rowItem.cloaiVthh = item.cloaiVthh ? item.cloaiVthh.toString() : null;
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

  async loadDonVi() {
    const res = await this.donViService.layDonViCon();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDonVi = res.data.filter(item => item.type !== 'PB');
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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

  async addDetailDinhMuc() {
    if (!this.isAddDetail) {
      return;
    }
    let msgRequired = '';
    //validator
    if (!this.rowItem.tenDinhMuc) {
      msgRequired = "Tên định mức không được để trống";
    } else if (!this.rowItem.maDinhMuc) {
      msgRequired = "Mã định mức không được để trống";
    }
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    this.rowItem.apDungTaiCuc = this.rowItem.apDungTaiCuc ? this.rowItem.apDungTaiCuc.toString() : null;
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new DinhMucPhiNxBq();
    this.updateEditCache();
    this.isAddDetail = false;
  }

  validAddDetailDm() {
    if (this.rowItem.tenDinhMuc && this.rowItem.maDinhMuc) {
      this.isAddDetail = true;
    }
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  saveEdit(idx: number): void {
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }

  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
    console.log(this.dataEdit[stt]);
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: {...this.dataTable[stt]},
      edit: false
    };
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
          this.dataTable.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }
}
