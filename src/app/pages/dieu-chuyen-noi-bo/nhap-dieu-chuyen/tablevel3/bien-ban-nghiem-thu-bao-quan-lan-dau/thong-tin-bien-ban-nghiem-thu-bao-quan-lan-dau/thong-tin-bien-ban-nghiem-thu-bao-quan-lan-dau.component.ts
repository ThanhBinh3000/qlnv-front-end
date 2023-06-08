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
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { MaTongHopQuyetDinhDieuChuyenService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/ma-tong-hop-quyet-dinh-dieu-chinh.service";
import { SoDeXuatQuyetDinhDieuChuyenService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/so-de-xuat-quyet-dinh-dieu-chinh.service";
import { KeHoachDieuChuyenService } from "../../../../ke-hoach-dieu-chuyen/ke-hoach-dieu-chuyen.service";
import * as uuid from "uuid";
import { ThongTinHangDtqgComponent } from "../thong-tin-hang-dtqg/thong-tin-hang-dtqg.component";


@Component({
  selector: 'app-thong-tin-bien-ban-nghiem-thu-bao-quan-lan-dau',
  templateUrl: './thong-tin-bien-ban-nghiem-thu-bao-quan-lan-dau.component.html',
  styleUrls: ['./thong-tin-bien-ban-nghiem-thu-bao-quan-lan-dau.component.scss']
})
export class ThongTinBienBanNghiemThuBaoQuanLanDauComponent extends Base2Component implements OnInit {

  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  maBb: string;
  dataTableView: []
  fileDinhKemReq: any[] = [];
  listDanhSachQuyetDinh: any[] = [];
  listPhuongThucBaoQuan: any[] = [];
  listHinhThucBaoQuan: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private maTongHopQuyetDinhDieuChuyenService: MaTongHopQuyetDinhDieuChuyenService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, maTongHopQuyetDinhDieuChuyenService);
    this.formData = this.fb.group({
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      tenDvi: [],
      maQhns: [],
      soBban: [],
      ngayLap: [dayjs().format('YYYY-MM-DD')],
      ngayKetThucNt: [],
      soQdDcCuc: [],
      ngayQdDcCuc: [],
      ktvBaoQuan: [],
      thuKho: [],
      keToan: [],
      thuTruong: [],
      tenLoKho: [],
      tenNganKho: [],
      tenNhaKho: [],
      tenDiemKho: [],
      loaiHinhKho: [],
      loaiVthh: [],
      tenCloaiVthh: [],
      tichLuongKhaDung: [],
      dsPhieuNhapKho: [],
      slThucNhapDc: [],
      hinhThucBaoQuan: [],
      phuongThucBaoQuan: [],
      dinhMucDuocGiao: [],
      dinhMucTT: [],
      tenLoKhoXuat: [],
      tongKinhPhiDaThBc: [],
      tongKinhPhiDaTh: [],
      dcnbBBNTBQDtlList: [new Array<any>(),],
      nhanXet: [],
    }
    );
  }

  async ngOnInit() {
    this.maBb = 'BBNT-' + this.userInfo.DON_VI.tenVietTat;
    let id = await this.userService.getId('DCNB_BB_NT_BQ_HDR_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      ktvBaoQuan: this.userInfo.TEN_DAY_DU,
      soBban: `${id}/${this.formData.get('nam').value}/${this.maBb}`,

    })

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

  async loadDataBaoQuan(cloaiVthh) {
    if (cloaiVthh) {
      let res = await this.danhMucService.getDetail(cloaiVthh);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listPhuongThucBaoQuan = res.data?.phuongPhapBq
        this.listHinhThucBaoQuan = res.data?.hinhThucBq
      }
      console.log('loadDataBaoQuan', res)
    }
  }

  async add(row?: any) {
    await this.spinner.show();

    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'THÔNG TIN HÀNG DTQG CẦN ĐIỀU CHUYỂN',
      nzContent: ThongTinHangDtqgComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        // danhSachKeHoach: this.danhSachKeHoach,
        // dsChiCuc: this.listChiCucNhan,
        // data: row ? row : undefined,
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {


      }
    });
  }


  async openDialogQD() {
    // if (this.formData.get('type').value != 'TTr') {
    //   return
    // }
    // this.setValidator()
    // this.formData.patchValue({
    //   idThop: undefined
    // });
    await this.spinner.show();
    // Get data tờ trình
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: ['0101', '0102'],
      loaiDc: "DCNB",
      maDvi: this.userInfo.MA_DVI
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    }
    let resSoDX = await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenCuc(body);
    if (resSoDX.msg == MESSAGE.SUCCESS) {
      this.listDanhSachQuyetDinh = resSoDX.data;
      console.log('this.listDanhSachQuyetDinh', this.listDanhSachQuyetDinh)
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
        dataHeader: ['Số quyết định'],
        dataColumn: ['soQdinh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        // this.setValidator()
        // this.formData.patchValue({
        //   idDxuat: data.id,
        //   idThop: undefined
        // });
        // this.dataTableView = []
        console.log('openDialogQD', data)
        this.formData.patchValue({
          soQdDcCuc: data.soQdinh,
          ngayQdDcCuc: data.ngayKyQdinh
        });
        await this.loadChiTietQdinh(data.id);
      }
    });
  }

  async loadChiTietQdinh(id: number) {
    let res = await this.quyetDinhDieuChuyenCucService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      console.log('loadChiTietQdinh', res)
      const data = res.data
      if (data.danhSachQuyetDinh.length == 0) return
      this.formData.patchValue({
        tenLoKho: data.danhSachQuyetDinh[0].danhSachKeHoach[0].tenLoKho,
        tenNganKho: data.danhSachQuyetDinh[0].danhSachKeHoach[0].tenNganKho,
        tenNhaKho: data.danhSachQuyetDinh[0].danhSachKeHoach[0].tenNhaKho,
        tenDiemKho: data.danhSachQuyetDinh[0].danhSachKeHoach[0].tenDiemKho,
        tenLoKhoXuat: `${data.danhSachQuyetDinh[0].danhSachKeHoach[0].tenDiemKhoNhan}-${data.danhSachQuyetDinh[0].danhSachKeHoach[0].tenNhaKhoNhan}-${data.danhSachQuyetDinh[0].danhSachKeHoach[0].tenNganKhoNhan}-${data.danhSachQuyetDinh[0].danhSachKeHoach[0].tenLoKhoNhan || ""}`,
        loaiVthh: data.danhSachQuyetDinh[0].danhSachKeHoach[0].tenLoaiVthh,
        tenCloaiVthh: data.danhSachQuyetDinh[0].danhSachKeHoach[0].tenCloaiVthh,
        tichLuongKhaDung: data.danhSachQuyetDinh[0].danhSachKeHoach[0].tichLuongKd,
      });

      await this.loadDataBaoQuan(data.danhSachQuyetDinh[0].danhSachKeHoach[0].cloaiVthh)
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
    // body.quyetDinh = this.quyetDinh;
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
