import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzCardModule, NzCardComponent } from "ng-zorro-antd/card";
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import * as dayjs from "dayjs";
import { FileDinhKem } from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import { MESSAGE } from "src/app/constants/message";
import { DanhMucService } from "src/app/services/danhmuc.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import { DonviService } from "src/app/services/donvi.service";
import {
  TongHopPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { v4 as uuidv4 } from 'uuid';
import { chain, cloneDeep } from 'lodash';
import { STATUS } from "src/app/constants/status";
import { QuyetDinhDieuChuyenTCService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service";
import { MaTongHopQuyetDinhDieuChuyenService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/ma-tong-hop-quyet-dinh-dieu-chinh.service";
import { SoDeXuatQuyetDinhDieuChuyenService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/so-de-xuat-quyet-dinh-dieu-chinh.service";
import { KeHoachDieuChuyenService } from "../../../../ke-hoach-dieu-chuyen/ke-hoach-dieu-chuyen.service";
import * as uuid from "uuid";

export class QuyetDinhPdDtl {
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
}

@Component({
  selector: 'app-thong-tin-kiem-tra-chat-luong',
  templateUrl: './thong-tin-kiem-tra-chat-luong.component.html',
  styleUrls: ['./thong-tin-kiem-tra-chat-luong.component.scss']
})
export class ThongTinKiemTraChatLuongComponent extends Base2Component implements OnInit {

  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  dataTableView: []
  quyetDinh: any[] = [];


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private soDeXuatQuyetDinhDieuChuyenService: SoDeXuatQuyetDinhDieuChuyenService,
    private maTongHopQuyetDinhDieuChuyenService: MaTongHopQuyetDinhDieuChuyenService,
    private quyetDinhDieuChuyenTCService: QuyetDinhDieuChuyenTCService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDieuChuyenTCService);
    this.formData = this.fb.group({
      loaiDc: ['CHI_CUC', [Validators.required]],
      tenLoaiDc: ['Giữa 2 chi cục trong cùng 1 cục'],
      nam: [dayjs().get("year"), [Validators.required]],
      soQdinh: [, [Validators.required]],
      ngayKyQdinh: [],
      ngayPduyet: [],
      idThop: [, [Validators.required]],
      idDxuat: [, [Validators.required]],
      trichYeu: [],
      type: ['TH', [Validators.required]],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      quyetDinhPdDtl: [new Array<QuyetDinhPdDtl>(),],
      danhSachQuyetDinh: [new Array<any>(),],
    }
    );
  }

  async ngOnInit() {
    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }

  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    // if (id) {
    //   let data = await this.detail(id);
    //   this.danhSachKeHoach = []
    //   this.formData.patchValue({
    //     ...data,
    //     soQdinh: data.soQdinh.split('/')[0]
    //   });

    //   data.danhSachQuyetDinh.map(async (item, i) => {
    //     if (item.dcnbKeHoachDcHdr) {
    //       let dcnbKeHoachDcHdr = item.dcnbKeHoachDcHdr

    //       dcnbKeHoachDcHdr.danhSachHangHoa.forEach(element => {
    //         this.danhSachKeHoach.push({
    //           ...element,
    //           maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho,
    //           maDvi: dcnbKeHoachDcHdr.maDvi,
    //           tenDvi: dcnbKeHoachDcHdr.tenDvi,
    //         })
    //       });
    //     }
    //   })

    //   this.canCu = data.canCu;
    //   this.quyetDinh = data.quyetDinh;

    //   if (data.loaiDc !== "DCNB") this.loadDsQuyetDinh(data.loaiDc, data.loaiQdinh)

    //   if (data.loaiDc === "DCNB") {
    //     this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maChiCucNhan")
    //   }
    //   if (data.loaiDc === "CHI_CUC") {
    //     this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")
    //   }
    //   if (data.loaiDc === "CUC" && !(this.isChiCuc() && data.loaiQdinh == '01')) {
    //     this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")
    //   }
    //   if (data.loaiDc === "CUC" && this.isChiCuc() && data.loaiQdinh == '01') {
    //     this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")

    //   }
    // }
    await this.spinner.hide();
  }



  async openDialogQD() {

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
    // body.canCu = this.canCu;
    body.quyetDinh = this.quyetDinh;
    if (this.idInput) {
      body.id = this.idInput
    } else {
      // body.soQdinh = `${this.formData.value.soQdinh}/${this.maQd}`
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

  isYCXDDiemNhap() {
    return this.formData.value.trangThai == STATUS.DU_THAO && this.formData.value.loaiQdinh == '01'
  }

  async ycXDDiemNhap() {
    await this.spinner.show();
    let body = this.formData.value;
    // body.canCu = this.canCu;
    body.quyetDinh = this.quyetDinh;
    if (this.idInput) body.id = this.idInput

    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
      let trangThai = STATUS.YC_CHICUC_PHANBO_DC;
      let mesg = 'Bạn muốn yêu cầu xác định điểm nhập?'
      this.approve(this.idInput, trangThai, mesg);
    }
    await this.spinner.hide();

  }

  async guiDuyet() {
    // if (this.isCuc()) {
    //   let trangThai = STATUS.CHO_DUYET_TP;
    //   let mesg = 'Bạn muốn gửi duyệt văn bản?'
    //   this.approve(this.idInput, trangThai, mesg);
    // }
    // if (this.isChiCuc()) {
    //   let trangThai = STATUS.CHODUYET_TBP_TVQT;
    //   let mesg = 'Bạn muốn gửi duyệt văn bản?'
    //   this.approve(this.idInput, trangThai, mesg);
    // }
  }

  isTuChoi() {
    // if (this.isCuc()) {
    //   return this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.TU_CHOI_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC || this.formData.value.trangThai == STATUS.TU_CHOI_LDC
    // }
    return false
  }

  async tuChoi() {
    // if (this.isCuc()) {
    //   let trangThai = () => {
    //     if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP)
    //       return STATUS.TU_CHOI_TP
    //     if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDC)
    //       return STATUS.TU_CHOI_LDC
    //     return STATUS.CHO_DUYET_TP;
    //   };
    //   this.reject(this.idInput, trangThai());
    // }
    // if (this.isChiCuc()) {
    //   let trangThai = () => {
    //     if (this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT)
    //       return STATUS.TUCHOI_TBP_TVQT
    //     if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC)
    //       return STATUS.TU_CHOI_LDCC
    //     return STATUS.CHODUYET_TBP_TVQT;
    //   };
    //   this.reject(this.idInput, trangThai());
    // }
  }

  isPheDuyet() {
    // if (this.isCuc()) {
    //   return this.formData.value.trangThai == STATUS.CHO_DUYET_TP
    // }
    // if (this.isChiCuc()) {
    //   return this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT || this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
    // }
    return false
  }

  async pheDuyet() {
    // if (this.isCuc()) {
    //   let trangThai = this.formData.value.trangThai == STATUS.CHO_DUYET_TP ? STATUS.CHO_DUYET_LDC : STATUS.BAN_HANH;
    //   let mesg = 'Bạn muốn phê duyệt văn bản?'
    //   this.approve(this.idInput, trangThai, mesg);
    // }
    // if (this.isChiCuc()) {
    //   let trangThai = this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT ? STATUS.CHO_DUYET_LDCC : STATUS.DA_DUYET_LDCC;
    //   let mesg = 'Bạn muốn phê duyệt văn bản?'
    //   this.approve(this.idInput, trangThai, mesg);
    // }

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


}
