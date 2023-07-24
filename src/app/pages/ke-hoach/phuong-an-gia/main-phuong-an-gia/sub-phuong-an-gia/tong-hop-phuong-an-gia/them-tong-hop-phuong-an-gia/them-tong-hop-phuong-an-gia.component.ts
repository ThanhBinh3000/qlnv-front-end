import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {API_STATUS_CODE, PAGE_SIZE_DEFAULT, TYPE_PAG} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {UserLogin} from 'src/app/models/userlogin';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {DanhMucTieuChuanService} from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import {DonviService} from 'src/app/services/donvi.service';
import {HelperService} from 'src/app/services/helper.service';
import {TongHopPhuongAnGiaService} from 'src/app/services/ke-hoach/phuong-an-gia/tong-hop-phuong-an-gia.service';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {chain} from "lodash";
import {v4 as uuidv4} from "uuid";

@Component({
  selector: 'app-them-tong-hop-phuong-an-gia',
  templateUrl: './them-tong-hop-phuong-an-gia.component.html',
  styleUrls: ['./them-tong-hop-phuong-an-gia.component.scss']
})
export class ThemTongHopPhuongAnGiaComponent implements OnInit {
  @Input() pagType: string;
  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();
  formData: FormGroup;
  @Input() type: string;
  formTraCuu: FormGroup;
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  pageSize: number = PAGE_SIZE_DEFAULT;
  page: number = 1;
  dsNam: any[] = [];
  userInfo: UserLogin;
  listCucSelected: any[] = [];
  dsLoaiGia: any[] = [];
  dataTable: any[] = [];
  dataTableView: any[] = [];
  listCuc: any[] = [];
  isTongHop: boolean = false;
  isMain: boolean = true;
  fileDinhKem: any[] = [];
  STATUS = STATUS
  typeConst = TYPE_PAG
  expandSet = new Set<number>();
  idSelected: number;
  isViewModal: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public globals: Globals,
    private helperService: HelperService,
    private tongHopPhuongAnGiaService: TongHopPhuongAnGiaService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private donviService: DonviService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namTongHop: [],
        loaiVthh: [],
        cloaiVthh: [],
        loaiGia: [],
        maDvis: [],
        ngayDxTu: [],
        ngayDxDen: [],
        ngayTongHop: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
        noiDung: [null, [Validators.required]],
        ghiChu: [],
        giaKsTt: [],
        giaKsTtVat: [],
        kqTdVat: [],
        kqTd: [],
        giaDng: [],
        giaDngVat: [],
        trangThaiTh: [],
        trangThaiTt: [],
        tenTrangThaiTh: [],
        tenTrangThaiTt: [],
      }
    );
    this.formTraCuu = this.fb.group(
      {
        id: [],
        namTongHop: [dayjs().get('year')],
        loaiVthh: [null, [Validators.required]],
        cloaiVthh: [null, [Validators.required]],
        loaiGia: [null, [Validators.required]],
        maDvis: [[]],
        ngayDxTu: [null],
        ngayDxDen: [null],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.getListCuc(),
      this.loadDsVthh(),
      this.loadDsLoaiGia(),
      this.getDataDetail(this.idInput),
    ])
    this.spinner.hide();
  }


  async getListCuc() {
    const res = await this.donviService.layTatCaDonViByLevel(2);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        this.listCuc.push({tenDvi: "Tất cả", maDvi: "all", type: "DV"})
        this.listCuc = [...this.listCuc, res.data].flat();
        if (this.listCuc && this.listCuc.length > 0) {
          this.listCuc = this.listCuc.filter(item => item.type != 'PB')
        }
      } else {
        this.listCuc = []
      }
    }
  }

  async getDataDetail(id) {
    if (id > 0) {
      this.isTongHop = true;
      let res = await this.tongHopPhuongAnGiaService.getDetail(id);
      const data = res.data;
      this.formTraCuu.patchValue({
        namTongHop: data.namTongHop,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        maDvis: data.maDvis,
        ngayDxTu: data.ngayDxTu,
        ngayDxDen: data.ngayDxDen,
        loaiGia: data.loaiGia
      });
      this.listCucSelected = data.maDvis && data.maDvis.length > 0 ? data.maDvis : []
      this.bindingDataTongHop(res.data, null)
      this.fileDinhKem = data.fileDinhKems;
    }
  }

  async loadDsLoaiGia() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_GIA');
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.type == TYPE_PAG.GIA_MUA_TOI_DA) {
        this.dsLoaiGia = res.data.filter(item =>
          item.ma == 'LG01' || item.ma == 'LG02'
        );
      }
      if (this.type == TYPE_PAG.GIA_CU_THE) {
        this.dsLoaiGia = res.data.filter(item =>
          item.ma == 'LG03' || item.ma == 'LG04'
        );
      }
    }
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  downloadFileKeHoach(event) {
  }

  quayLai() {
    this.onClose.emit();
  }

  banHanh() {
  }

  async save() {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    body.type = this.type;
    body.pagChiTiets = this.dataTable
    let res = await this.tongHopPhuongAnGiaService.create(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.idInput > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.quayLai();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

    this.spinner.hide();
  }

  async loadDsVthh() {
    this.listVthh = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data.filter(item => item.ma != '02');
    }
  }

  async onChangeLoaiVthh(event) {
    let body = {
      "str": event
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.listCloaiVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listCloaiVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async onChangeCloaiVthh(event) {
    let res = await this.danhMucTieuChuanService.getDetailByMaHh(event);
    if (res.statusCode == API_STATUS_CODE.SUCCESS) {
      this.formData.patchValue({
        tchuanCluong: res.data ? res.data.tenQchuan : null
      })
    }
  }

  async tongHop() {
    try {
      this.spinner.show();
      this.helperService.markFormGroupTouched(this.formTraCuu);
      if (this.formTraCuu.invalid) {
        this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
        this.spinner.hide();
        return;
      }
      let body = this.formTraCuu.value;
      body.type = this.type;
      body.maDvis = this.listCucSelected
      let res = await this.tongHopPhuongAnGiaService.tongHop(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.isTongHop = true;
        this.formData.reset();
        this.dataTable = [];
        this.bindingDataTongHop(res.data, body);
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.TONG_HOP_SUCCESS);
      } else {
        this.isTongHop = false;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  bindingDataTongHop(data, reqBody) {
    let giaKsTt = data.giaKsTtTu && data.giaKsTtDen ? Intl.NumberFormat('vi-VN').format(data.giaKsTtTu) + " - " + Intl.NumberFormat('vi-VN').format(data.giaKsTtDen) : null;
    let giaKsTtVat = data.giaKsTtVatTu && data.giaKsTtVatDen ? Intl.NumberFormat('vi-VN').format(data.giaKsTtVatTu) + " - " + Intl.NumberFormat('vi-VN').format(data.giaKsTtVatDen) : null;
    let kqTd = data.giaTdTu && data.giaTdDen ? Intl.NumberFormat('vi-VN').format(data.giaTdTu) + " - " + Intl.NumberFormat('vi-VN').format(data.giaTdDen) : null;
    let kqTdVat = data.giaTdVatTu && data.giaTdVatDen ? Intl.NumberFormat('vi-VN').format(data.giaTdVatTu) + " - " + Intl.NumberFormat('vi-VN').format(data.giaTdVatDen) : null;
    let giaDng = data.giaDnTu && data.giaDnDen ? Intl.NumberFormat('vi-VN').format(data.giaDnTu) + " - " + Intl.NumberFormat('vi-VN').format(data.giaDnDen) : null;
    let giaDngVat = data.giaDnVatTu && data.giaDnVatDen ? Intl.NumberFormat('vi-VN').format(data.giaDnVatTu) + " - " + Intl.NumberFormat('vi-VN').format(data.giaDnVatDen) : null;
    this.formData.patchValue({
      id: data.id,
      namTongHop: data.namTongHop ?? reqBody.namTongHop,
      loaiVthh: data.loaiVthh ?? reqBody.loaiVthh,
      cloaiVthh: data.cloaiVthh ?? reqBody.cloaiVthh,
      loaiGia: data.loaiGia ?? reqBody.loaiGia,
      maDvis: data.maDvis ?? reqBody.maDvis,
      ngayDxTu: data.ngayDxTu ?? reqBody.ngayDxTu,
      ngayDxDen: data.ngayDxDen ?? reqBody.ngayDxDen,
      noiDung: data.noiDung,
      ghiChu: data.ghiChu,
      giaKsTt: giaKsTt,
      giaKsTtVat: giaKsTtVat,
      kqTd: kqTd,
      kqTdVat: kqTdVat,
      giaDng: giaDng,
      giaDngVat: giaDngVat,
      trangThaiTh: data.trangThaiTh,
      trangThaiTt: data.trangThaiTt,
      tenTrangThaiTt: data.tenTrangThaiTt,
      tenTrangThaiTh: data.tenTrangThaiTh ? data.tenTrangThaiTh : 'Chưa tạo tờ trình',
    })
    this.dataTable = data.pagChiTiets;
    this.buildTreePagCt();
  }

  buildTreePagCt() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTableView = chain(this.dataTable)
        .groupBy("maDvi")
        .map((value, key) => {
          return {
            idVirtual: uuidv4(),
            tenVungMien: value && value[0] && value[0].tenVungMien ? value[0].tenVungMien : null,
            tenDvi: value && value[0] && value[0].tenDvi ? value[0].tenDvi : null,
            soDx : value && value[0] && value[0].soDx ? value[0].soDx : null,
            children: value
          };
        }).value();
    }
    this.expandAll()
  }
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }


  expandAll() {
    if (this.dataTableView && this.dataTableView.length > 0) {
      this.dataTableView.forEach(s => {
        this.expandSet.add(s.idVirtual);
      });
    }
  }

  taoTtrinh() {
    this.isMain = false;
    if (this.formData.value.trangThaiTh == STATUS.CHUA_TAO_TT || this.formData.value.trangThaiTt == STATUS.DU_THAO || this.formData.value.trangThaiTt == STATUS.TU_CHOI_LDV ) {
      this.isView = false;
    }
  }

  reOpenMain() {
    this.isMain = true;
    this.getDataDetail(this.idInput);
  }

  async openModalDxChinhSua(pagId: number) {
    this.idSelected = pagId
    this.isViewModal = true;
  }

  closeDxPaModal() {
    this.idSelected = null;
    this.isViewModal = false;
  }

  changeListDsCuc(event: any) {
    if (event && event.length > 0) {
      if (event.includes("all")) {
        this.listCucSelected = this.listCuc.map(item => item.maDvi)
        this.listCucSelected.splice(0, 1);
      }
    }
  }
}


