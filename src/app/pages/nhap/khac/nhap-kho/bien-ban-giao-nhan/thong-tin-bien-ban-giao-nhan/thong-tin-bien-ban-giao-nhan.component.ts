import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { cloneDeep } from 'lodash';
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
import { PhieuNhapKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-nhap-kho";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { BBGiaoNhanService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/BBGiaoNhan";
import { QuyetDinhGiaoNhapHangKhacService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhGiaoNhapHangKhac.service";
import { StorageService } from "src/app/services/storage.service";
import { convertTienTobangChu } from "src/app/shared/commonFunction";
import * as uuidv4 from "uuid";
import { BienBanKetThucNhapKhacNhapKhoVatTuService } from "../../bien-ban-ket-thuc-nhap-kho/bien-ban-ket-thuc-nhap-khac-nhap-kho-vt.service";

@Component({
  selector: 'app-thong-tin-bien-ban-giao-nhan',
  templateUrl: './thong-tin-bien-ban-giao-nhan.component.html',
  styleUrls: ['./thong-tin-bien-ban-giao-nhan.component.scss']
})
export class ThongTinBienBanGiaoNhanComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() data: any;
  @Output()
  showListEvent = new EventEmitter<any>();

  previewName: string = 'nk_bb_gn';
  maBb: string;
  fileCanCuReq: any[] = [];
  fileDinhKemReq: any[] = [];

  listDanhSachQuyetDinh: any[] = [];
  dsKeHoach: any[] = []

  danhSach: any[] = []
  tongSLN: number;
  allCheckedTT = false;
  indeterminateTT = false;

  danhSachDD: any[] = []
  listDonViDaiDien = [
    {
      type: 'CUC',
      title: 'Đại diện cục DTNN KV'
    },
    {
      type: 'CHI_CUC',
      title: 'Đại diện chi cục DTNN KV'
    },
    {
      type: 'GIAO_HANG',
      title: 'Đại diện bên giao hàng'
    }
  ]

  detail: any

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNhapHangKhacService: QuyetDinhGiaoNhapHangKhacService,
    private bienBanKetThucNhapKhoService: BienBanKetThucNhapKhacNhapKhoVatTuService,
    private phieuNhapKhoService: PhieuNhapKhoService,
    private bienBanGiaoNhanPvcService: BBGiaoNhanService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanGiaoNhanPvcService);
    this.formData = this.fb.group({
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      tenDvi: [],
      id: [],
      maQhns: [],
      soBb: [],
      ngayLap: [dayjs().format('YYYY-MM-DD')],
      soQdPdNk: [],
      // ngayQdDcCuc: [],
      qdPdNkId: [],
      soBbKtNhapKho: [],
      ngayKetThucNk: [],
      idBbKtNhapKho: [],
      tenLoNganKho: [],
      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [],
      maNganKho: [],
      tenNhaKho: [],
      maNhaKho: [],
      tenDiemKho: [],
      maDiemKho: [],
      soHoSoKyThuat: [],
      idHoSoKyThuat: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      tenDonViTinh: [],
      danhSachBangKe: [new Array<any>(),],
      danhSachDaiDien: [new Array<any>(),],
      ngayBdNhap: [],
      ngayKtNhap: [],
      soLuongQd: [],
      canBo: [],
      lanhDao: [],
      ghiChu: [],

      hoVaTen: [],
      chucVu: [],
      dvi: [],

    });
  }

  async ngOnInit() {
    this.maBb = 'BBGN-' + this.userInfo.DON_VI.tenVietTat;
    let id = await this.userService.getId('DCNB_BB_NT_BQ_HDR_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      canBo: this.userInfo.TEN_DAY_DU,
      soBb: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
    })

    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }

    if (this.data) {
      console.log('this.data', this.data)
      this.formData.patchValue({
        trangThai: STATUS.DU_THAO,
        tenTrangThai: "Dự thảo",
        soQdPdNk: this.data.soQdPdNk,
        qdPdNkId: this.data.idQdPdNk,
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
        tichLuongKhaDung: this.data.tichLuongKd,
        tenDonViTinh: this.data.tenDonViTinh,
      });
      await this.loadChiTietQdinh(this.data.idQdPdNk);
      await this.getDanhSachTT(this.data.idQdPdNk)
    }

  }

  isCuc() {
    return this.userService.isCuc()
  }

  isChiCuc() {
    return this.userService.isChiCuc()
  }

  convertTien(tien: number): string {
    if (tien) {
      return convertTienTobangChu(tien);
    }
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      if (data) {
        this.detail = data

        this.danhSachDD = data.danhSachDaiDien
        this.formData.patchValue({ ...data, tenLoNganKho: `${data.tenLoKho} ${data.tenNganKho}`, });
        this.fileCanCuReq = data.fileCanCu
        this.fileDinhKemReq = data.fileDinhKems
        await this.loadChiTietQdinh(data.qdPdNkId)
        await this.getDanhSachTT(data.qdPdNkId)
      }

    }
    await this.spinner.hide();
  }

  async getDanhSachTT(qdinhDccId) {
    const body = {
      qdinhDccId
    }
    const danhSachBangKe = this.detail?.danhSachBangKe || []
    let res = await this.phieuNhapKhoService.getDanhSachTT(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.danhSach = res.data.map(element => {
        const check = danhSachBangKe.find(item => item.soPhieuNhapKho === element.soPhieuNhapKho)
        return {
          ...element,
          checked: !!check || false
        }
      });
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

    this.danhSach = cloneDeep(this.danhSach)
    this.tongSLN = this.danhSach.reduce((pre, cur) => pre + Number(cur.soLuong), 0)
    if (this.danhSach.length > 0) {
      const ngayBdNhap = this.danhSach[0].ngayNhapKho
      this.formData.patchValue({
        ngayBdNhap
      })
    }
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
    this.danhSach = cloneDeep(this.danhSach)
    this.tongSLN = this.danhSach.reduce((pre, cur) => pre + Number(cur.soLuong), 0)
    if (this.danhSach.length > 0) {
      const ngayBdNhap = this.danhSach[0].ngayNhapKho
      this.formData.patchValue({
        ngayBdNhap
      })
    }
  }


  async openDialogQD() {
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
          ngayQdDcCuc: data.ngayQd,
          qdPdNkId: data.id,
          tenLoNganKho: "",
          tenLoKho: "",
          maLoKho: "",
          tenNganKho: "",
          maNganKho: "",
          tenNhaKho: "",
          maNhaKho: "",
          tenDiemKho: "",
          maDiemKho: "",
          loaiVthh: "",
          tenLoaiVthh: "",
          cloaiVthh: "",
          tenCloaiVthh: "",
          tichLuongKhaDung: "",
          soLuongQd: "",
          tenDonViTinh: "",
        });
        await this.getDanhSachTT(data.id)
        await this.loadChiTietQdinh(data.id);
      }
    });
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
          tichLuongKhaDung: data.tichLuongKd,
          soLuongQd: data.slDoiThua,
          tenDonViTinh: data.dvt,
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

  async openDialogBBKTNK() {
    await this.spinner.show();
    let body = {
      // trangThai: STATUS.BAN_HANH,
      // loaiVthh: this.loaiVthh,
      // qdPdNkId: this.formData.value.qdPdNkId
      // maDvi: this.userInfo.MA_DVI
    }
    let resSoDX = await this.bienBanKetThucNhapKhoService.getDanhSach(body);
    if (resSoDX.msg == MESSAGE.SUCCESS) {
      this.listDanhSachQuyetDinh = resSoDX.data;
    }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản kết thúc nhập kho',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachQuyetDinh,
        dataHeader: ['Số biên bản kết thúc nhập kho'],
        dataColumn: ['soBBKtNH']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soBbKtNhapKho: data.soBBKtNH,
          ngayKetThucNk: data.ngayKetThucNk,
          idBbKtNhapKho: data.id
        });
        await this.getDanhSachTT(data.id)
        await this.loadChiTietQdinh(data.id);
      }
    });
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }

  them() {
    if (!this.formData.value.hoVaTen || !this.formData.value.chucVu || !this.formData.value.dvi) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập đủ thông tin");
      return
    }
    this.danhSachDD.push({
      idVirtual: uuidv4.v4(),
      edit: false,
      hoVaTen: this.formData.value.hoVaTen,
      chucVu: this.formData.value.chucVu,
      type: this.formData.value.dvi
    })
    this.danhSachDD = cloneDeep(this.danhSachDD)

    this.formData.patchValue({
      hoVaTen: "",
      chucVu: "",
      dvi: "",
    })
  }

  cancelEdit(index: number): void {
    this.danhSachDD[index].edit = false;
  }

  saveEdit(index: number): void {
    this.danhSachDD[index].edit = false;
  }
  sua(index: number) {
    this.danhSachDD[index].edit = true;
    this.danhSachDD = cloneDeep(this.danhSachDD)
  }

  xoa(row) {
    this.danhSachDD = this.danhSachDD.filter(item => item.idVirtual !== row.idVirtual)
  }

  getType(type): string {
    console.log('getType', type)
    const row = this.listDonViDaiDien.find(item => item.type === type)
    return row.title
  }


  async save(isGuiDuyet?) {
    await this.spinner.show();
    let body = this.formData.value;
    body.ngayKtNhap = body.ngayLap
    body.danhSachBangKe = this.danhSach.filter(item => item.checked).map(item => {
      return {
        ...item,
        id: this.idInput ? item.id : undefined
      }
    })
    body.danhSachDaiDien = this.danhSachDD
    body.fileCanCuReq = this.fileCanCuReq;
    body.fileDinhKemReq = this.fileDinhKemReq;

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



  isGuiDuyet() {
    return this.isView && this.formData.value.trangThai !== STATUS.DU_THAO
  }

  async guiDuyet() {
    let trangThai = STATUS.CHO_DUYET_LDC;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  isTuChoi() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDC
  }

  async tuChoi() {
    let trangThai = STATUS.TU_CHOI_LDC;
    this.reject(this.idInput, trangThai);
  }

  isPheDuyet() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDC
  }

  async pheDuyet() {
    let trangThai = STATUS.DA_DUYET_LDC;
    let mesg = 'Bạn muốn phê duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);

  }

  isBanHanh() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
  }

  async banHanh() {
    let trangThai = STATUS.DA_DUYET_LDCC;
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
