import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { Base2Component } from "src/app/components/base2/base2.component";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { MESSAGE } from "src/app/constants/message";
import { STATUS } from "src/app/constants/status";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { BienBanNhapDayKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nhap-day-kho";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { PhieuNhapKhoService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/phieuNhapKho";
import { QuyetDinhGiaoNhapHangKhacService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhGiaoNhapHangKhac.service";
import { StorageService } from "src/app/services/storage.service";
import { chain, cloneDeep } from 'lodash';
import { BBNhapDayKhoService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/bbNhapDayKho";

@Component({
  selector: 'app-thong-tin-bien-ban-nhap-day-kho',
  templateUrl: './thong-tin-bien-ban-nhap-day-kho.component.html',
  styleUrls: ['./thong-tin-bien-ban-nhap-day-kho.component.scss']
})
export class ThongTinBienBanNhapDayKhoComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() data: any;
  @Output()
  showListEvent = new EventEmitter<any>();

  previewName: string = 'nk_bb_ndk';
  maBb: string;
  danhSach: any[] = []
  dataTableView: any[] = []
  fileDinhKemReq: any[] = [];
  listDanhSachQuyetDinh: any[] = [];

  dsKeHoach: any[] = []
  detailData: any

  allCheckedTT = false;
  indeterminateTT = false;
  tongSL: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private phieuNhapKhoService: PhieuNhapKhoService,
    private quyetDinhGiaoNhapHangKhacService: QuyetDinhGiaoNhapHangKhacService,
    private bienBanNhapDayKhoService: BBNhapDayKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanNhapDayKhoService);
    this.formData = this.fb.group({
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      tenDvi: [],
      maQhns: [],
      soBb: [],
      ngayLap: [dayjs().format('YYYY-MM-DD')],
      soQdPdNk: [],
      ngayQdPdNk: [],
      qdPdNkId: [],
      tenLoNganKho: [],
      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [],
      maNganKho: [],
      tenNhaKho: [],
      maNhaKho: [],
      tenDiemKho: [],
      maDiemKho: [],
      idKeHoachDtl: [],
      loaiHinhKho: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      donViTinh: [],

      ngayBdNhap: [],
      ngayKtNhap: [],
      soLuongQd: [],

      ghiChu: [],
      ktvBaoQuan: [],
      idKyThuatVien: [],
      thuKho: [],
      idThuKho: [],
      keToan: [],
      idKeToan: [],
      idLanhDao: [],
      lanhDao: [],
      children: [new Array<any>(),],
    }
    );
  }

  async ngOnInit() {
    this.maBb = 'BBNDK-' + this.userInfo.DON_VI.tenVietTat;
    let id = await this.userService.getId('XH_PHIEU_XKHO_BTT_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      ktvBaoQuan: this.userInfo.TEN_DAY_DU,
      soBb: `${id}/${this.formData.get('nam').value}/${this.maBb}`,

    })
    if(this.data && !this.idInput){
      console.log(this.data, "data")
      this.formData.patchValue({
        soQdPdNk: this.data.soQdPdNk,
        ngayQdPdNk: this.data.ngayKyQdinh,
        qdPdNkId: this.data.idQdPdNk,
        tenLoKhoXuat: "",
        maLoKhoXuat: "",
        tenNganKhoXuat: "",
        maNganKhoXuat: "",
        tenNhaKhoXuat: "",
        maNhaKhoXuat: "",
        tenDiemKhoXuat: "",
        maDiemKhoXuat: "",
        tichLuongKhaDung: "",
        tenLoNganKho: `${this.data.tenLoKho} ${this.data.tenNganKho}`,
        tenLoKho: this.data.tenLoKho,
        maLoKho: this.data.maLoKho,
        tenNganKho: this.data.tenNganKho,
        maNganKho: this.data.maNganKho,
        tenNhaKho: this.data.tenNhaKho,
        maNhaKho: this.data.maNhaKho,
        tenDiemKho: this.data.tenDiemKho,
        maDiemKho: this.data.maDiemKho,
        loaiVthh: this.data.loaiVthh,
        tenLoaiVthh: this.data.tenLoaiVthh,
        cloaiVthh: this.data.cloaiVthh,
        tenCloaiVthh: this.data.tenCloaiVthh,
        donViTinh: this.data.donViTinh,
        soLuongQd: this.data.slDienChuyen,
      });
      await this.loadChiTietQdinh(this.data.idQdPdNk);
      await this.getDanhSachTT(this.data.qdPdNkId)
    }
    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }

  }

  isCuc() {
    return this.userService.isCuc()
  }

  isChiCuc() {
    return this.userService.isChiCuc()
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      if (!data) return
      this.detailData = data
      this.formData.patchValue({
        ...data,
        tenLoNganKho: `${data.tenLoKho} ${data.tenNganKho}`,
      });
      this.fileDinhKemReq = data.fileDinhKems
      this.loadChiTietQdinh(data.qdPdNkId)
      this.getDanhSachTT(data.qdPdNkId)
    }
    await this.spinner.hide();
  }

  async openDialogQD() {
    await this.spinner.show();
    if (this.isView) return
    await this.spinner.show();
    let body = {
      denNgayQd: null,
      // maDvi: this.userInfo.MA_DVI,
      loaiVthh: this.loaiVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
      trangThai: this.globals.prop.NHAP_BAN_HANH,
    }
    let res = await this.quyetDinhGiaoNhapHangKhacService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDanhSachQuyetDinh = res.data.content;
    }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách quyết định',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayQd', 'tenLoaiVthh'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soQdPdNk: data.soQd,
          ngayQdPdNk: data.ngayQd,
          qdPdNkId: data.id,
          tenLoKho: "",
          maLoKho: "",
          tenNganKho: "",
          maNganKho: "",
          tenNhaKho: "",
          maNhaKho: "",
          tenDiemKho: "",
          maDiemKho: "",
          tenLoKhoXuat: "",
          maLoKhoXuat: "",
          tenNganKhoXuat: "",
          maNganKhoXuat: "",
          tenNhaKhoXuat: "",
          maNhaKhoXuat: "",
          tenDiemKhoXuat: "",
          maDiemKhoXuat: "",
          loaiVthh: "",
          tenCloaiVthh: "",
          tichLuongKhaDung: "",
          donViTinh: "",
        });

        await this.loadChiTietQdinh(data.id);
        await this.getDanhSachTT(data.id)
      }
    });
  }

  async getDanhSachTT(qdGiaoNvId) {
    const body = {
      qdGiaoNvId
    }
    const children = this.detailData?.children || []
    let res = await this.phieuNhapKhoService.getDanhSachTT(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.danhSach = res.data.map(element => {
        const check = children.find(item => item.soPhieuNhapKho === element.soPhieuNhapKho)
        return {
          ...element,
          checked: !!check || false
        }
      });
      let minIdRecord = this.danhSach.reduce((min, current) => (current.id < min.id ? current : min), this.danhSach[0]);
      this.formData.patchValue({
        ngayBdNhap: minIdRecord.ngayNhapKho
      })
    }
  }

  updateAll(): void {
    this.indeterminateTT = false;
    if (this.allCheckedTT) {
      if (this.danhSach && this.danhSach.length > 0) {
        this.danhSach.forEach((item) => {
          item.checked = true;
        });
      }
    } else {
      if (this.danhSach && this.danhSach.length > 0) {
        this.danhSach.forEach((item) => {
          item.checked = false;
        });
      }
    }
    this.tongSL = this.danhSach.filter(item => item.checked).reduce((pre, cur) => pre + Number(cur.soLuong), 0)
    this.danhSach = cloneDeep(this.danhSach)
  }

  updateSingle(): void {
    if (this.danhSach.every((item) => !item.checked)) {
      this.allCheckedTT = false;
      this.indeterminateTT = false;
    } else if (this.danhSach.every((item) => item.checked)) {
      this.allCheckedTT = true;
      this.indeterminateTT = false;
    } else {
      this.indeterminateTT = true;
    }
    this.tongSL = this.danhSach.filter(item => item.checked).reduce((pre, cur) => pre + Number(cur.soLuong), 0)
    this.danhSach = cloneDeep(this.danhSach)
  }

  async openDialogKhoNhap() {
    await this.spinner.show();

    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách kho nhập',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsKeHoach,
        dataHeader: ['Lô kho nhập', 'Ngăn kho nhập', 'Nhà kho nhập', 'Điểm kho nhập'],
        dataColumn: ['tenLoKho', 'tenNganKho', 'tenNhaKho', 'tenDiemKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          tenLoNganKho: `${data.tenLoKho} ${data.tenNganKho}`,
          tenLoKho: data.tenLoKho,
          maLoKho: data.maLoKho,
          tenNganKho: data.tenNganKho,
          maNganKho: data.maNganKho,
          tenNhaKho: data.tenNhaKho,
          maNhaKho: data.maNhaKho,
          tenDiemKho: data.tenDiemKho,
          maDiemKho: data.maDiemKho,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          donViTinh: data.dvt,
          soLuongQd: data.tongSlNhap,
        });

      }
    });
  }

  async loadChiTietQdinh(id: number) {
    let res = await this.quyetDinhGiaoNhapHangKhacService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      this.dsKeHoach = []
      if (data.dtlList.length == 0) return
      this.dsKeHoach = this.dsKeHoach.concat(data.dtlList)
    }
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }


  async save(isGuiDuyet?) {
    await this.spinner.show();
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKemReq;
    body.ngayKtNhap = body.ngayLap
    body.children = this.danhSach.filter(item => item.checked)
    body.ngayQdPdNk = new Date(body.ngayQdPdNk);
    if (this.idInput) {
      body.id = this.idInput
    }

    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.guiDuyet();
      } else {
        this.quayLai();
      }
    }
    await this.spinner.hide();
  }



  async guiDuyet() {
    let trangThai = STATUS.CHO_DUYET_KTVBQ;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  isTuChoi() {
    return (this.formData.value.trangThai == STATUS.CHO_DUYET_KTVBQ && this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_DUYET_KTVBQ') || this.formData.value.trangThai == STATUS.CHO_DUYET_KT && this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_DUYET_KETOAN') || this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC && this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_DUYET_LDCCUC'))
  }

  async tuChoi() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT)
        return STATUS.TUCHOI_TBP_TVQT
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC)
        return STATUS.TU_CHOI_LDCC
      return STATUS.TUCHOI_TBP_TVQT;
    };
    this.reject(this.idInput, trangThai());
  }

  isPheDuyet() {
    return (this.formData.value.trangThai == STATUS.CHO_DUYET_KTVBQ && this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_DUYET_KTVBQ') || this.formData.value.trangThai == STATUS.CHO_DUYET_KT && this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_DUYET_KETOAN') || this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC && this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_DUYET_LDCCUC'))
  }

  async pheDuyet() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_KTVBQ)
        return STATUS.CHO_DUYET_KT
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_KT)
        return STATUS.CHO_DUYET_LDCC
      return STATUS.DA_DUYET_LDCC;
    };
    let mesg = 'Bạn muốn phê duyệt văn bản?'
    this.approve(this.idInput, trangThai(), mesg);
  }

  isBanHanh() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDC
  }

  async banHanh() {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Bạn muốn ban hành văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

}


