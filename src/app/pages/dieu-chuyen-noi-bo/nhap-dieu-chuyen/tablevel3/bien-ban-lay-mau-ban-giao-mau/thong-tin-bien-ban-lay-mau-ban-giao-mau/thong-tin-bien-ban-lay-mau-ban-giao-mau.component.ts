import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
import { BienBanLayMauService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-lay-mau";
import { BienBanNhapDayKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nhap-day-kho";
import { MaTongHopQuyetDinhDieuChuyenService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/ma-tong-hop-quyet-dinh-dieu-chinh.service";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { SoDeXuatQuyetDinhDieuChuyenService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/so-de-xuat-quyet-dinh-dieu-chinh.service";
import { StorageService } from "src/app/services/storage.service";

@Component({
  selector: 'app-thong-tin-bien-ban-lay-mau-ban-giao-mau',
  templateUrl: './thong-tin-bien-ban-lay-mau-ban-giao-mau.component.html',
  styleUrls: ['./thong-tin-bien-ban-lay-mau-ban-giao-mau.component.scss']
})
export class ThongTinBienBanLayMauBanGiaoMauComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  maBb: string;
  dataTableView: []

  bienBanLayMauDinhKem: any[] = [];
  fileDinhKemChupMauNiemPhong: any[] = [];
  listDanhSachQuyetDinh: any[] = [];

  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];

  ketQuaNiemPhong: false
  checked: false

  dsKeHoach: any[] = []
  phuongPhapLayMaus: any[] = []

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private bienBanNhapDayKhoService: BienBanNhapDayKhoService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bienBanLayMauService: BienBanLayMauService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauService);
    this.formData = this.fb.group({
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      loaiBb: ['ALL'],
      id: [],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      tenDvi: [],
      maQhns: [],
      soBbLayMau: [],
      ngayLayMau: [dayjs().format('YYYY-MM-DD')],
      soQdinhDcc: [],
      qdccId: [],
      soBbNhapDayKho: [],
      ngayBbNhapDayKho: [],
      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [],
      maNganKho: [],
      tenNhaKho: [],
      maNhaKho: [],
      tenDiemKho: [],
      maDiemKho: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      ktvBaoQuan: [],
      dviKiemNghiem: [],
      diaDiemLayMau: [],
      soBbNT: [],
      soLuongMau: [],
      pplayMau: [],
      chiTieuKiemTra: [],
      ketQuaNiemPhong: [],
      type: ["01"],
      loaiDc: ["DCNB"]
    });
  }

  async ngOnInit() {
    this.maBb = 'BBLM-' + this.userInfo.DON_VI.tenVietTat;
    let id = await this.userService.getId('DCNB_BIEN_BAN_LAY_MAU_HDR_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      ktvBaoQuan: this.userInfo.TEN_DAY_DU,
      soBbLayMau: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
      id: id,
      loaiDc: this.loaiDc
    })
    await this.loadPhuongPhapLayMau()
    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }

  }

  log(v) { }

  isCuc() {
    return this.userService.isCuc()
  }

  isChiCuc() {
    return this.userService.isChiCuc()
  }

  async loadPhuongPhapLayMau() {
    this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.phuongPhapLayMaus = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.bienBanLayMauDinhKem = data.bienBanLayMauDinhKem
      this.fileDinhKemChupMauNiemPhong = data.fileDinhKemChupMauNiemPhong
      const dsDaiDien = data.dcnbBienBanLayMauDtl.map(item => {
        return {
          ...item,
          daiDien: item.tenDaiDien
        }
      })
      console.log('loadChiTiet', data, dsDaiDien)
      this.listDaiDienCuc = dsDaiDien.filter(item => item.loaiDaiDien === "00")
      this.listDaiDienChiCuc = dsDaiDien.filter(item => item.loaiDaiDien === "01")
      if (data.pplayMau) {
        const dspplayMau = data.pplayMau.split(",").map(f => ({ id: f.split("-")[0], giaTri: f.split("-")[1] }))
        this.phuongPhapLayMaus = this.phuongPhapLayMaus.map(pp => {
          return {
            ...pp,
            checked: !!dspplayMau.find(check => Number(check.id) == pp.id)
          }
        })

      }

      this.formData.patchValue({
        ...data,
        // soQdinh: data.soQdinh.split('/')[0]
      });

      // data.danhSachQuyetDinh.map(async (item, i) => {
      //   if (item.dcnbKeHoachDcHdr) {
      //     let dcnbKeHoachDcHdr = item.dcnbKeHoachDcHdr

      //     dcnbKeHoachDcHdr.danhSachHangHoa.forEach(element => {
      //       this.danhSachKeHoach.push({
      //         ...element,
      //         maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho,
      //         maDvi: dcnbKeHoachDcHdr.maDvi,
      //         tenDvi: dcnbKeHoachDcHdr.tenDvi,
      //       })
      //     });
      //   }
      // })

      // this.canCu = data.canCu;
      // this.quyetDinh = data.quyetDinh;

      // if (data.loaiDc !== "DCNB") this.loadDsQuyetDinh(data.loaiDc, data.loaiQdinh)

      // if (data.loaiDc === "DCNB") {
      //   this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maChiCucNhan")
      // }
      // if (data.loaiDc === "CHI_CUC") {
      //   this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")
      // }
      // if (data.loaiDc === "CUC" && !(this.isChiCuc() && data.loaiQdinh == '01')) {
      //   this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")
      // }
      // if (data.loaiDc === "CUC" && this.isChiCuc() && data.loaiQdinh == '01') {
      //   this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")

      // }
    }
    await this.spinner.hide();
  }

  checkedChange() {

  }

  async openDialogQD() {
    if (this.isView) return
    await this.spinner.show();
    // Get data tờ trình
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: ['0101', '0102'],
      loaiDc: "DCNB",
      maDvi: this.userInfo.MA_DVI
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    }
    let resSoDX = this.isCuc() ? await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenCuc(body) : await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
    if (resSoDX.msg == MESSAGE.SUCCESS) {
      this.listDanhSachQuyetDinh = resSoDX.data;
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
        console.log('openDialogQD', data)
        this.formData.patchValue({
          soQdinhDcc: data.soQdinh,
          qdccId: data.id,
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
          tenDonViTinh: "",
        });
        // this.listPhuongThucBaoQuan = []
        // this.listHinhThucBaoQuan = []
        await this.loadChiTietQdinh(data.id);
      }
    });
  }

  async openDialogBBNDK() {
    if (this.isView) return
    await this.spinner.show();
    // Get data tờ trình
    let body = {
      // trangThai: STATUS.BAN_HANH,
      // loaiVthh: ['0101', '0102'],
      // loaiDc: "DCNB",
      // maDvi: this.userInfo.MA_DVI
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    }
    let res = await this.bienBanNhapDayKhoService.getDanhSach(body)
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDanhSachQuyetDinh = res.data;
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
        console.log('openDialogQD', data)
        this.formData.patchValue({
          soQdinhDcc: data.soQdinh,
          qdccId: data.id,
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
          tenDonViTinh: "",
        });
        // this.listPhuongThucBaoQuan = []
        // this.listHinhThucBaoQuan = []
        await this.loadChiTietQdinh(data.id);
      }
    });
  }

  async loadChiTietQdinh(id: number) {
    let res = await this.quyetDinhDieuChuyenCucService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      this.dsKeHoach = []
      // this.dsDiemKhoNhan = []
      if (data.danhSachQuyetDinh.length == 0) return
      data.danhSachQuyetDinh.map(qdinh => {
        this.dsKeHoach = this.dsKeHoach.concat(qdinh.danhSachKeHoach)
      })

      // this.dsKeHoach.map(kehoach => {
      //   const diemKho = this.dsDiemKhoNhan.find(item => item.maDiemKhoNhan === kehoach.maDiemKhoNhan)
      //   if (!diemKho && kehoach.maDiemKhoNhan) this.dsDiemKhoNhan.push(kehoach)
      // })

      // console.log('loadChiTietQdinh dsKH', this.dsKeHoach, this.dsDiemKhoNhan)



    }
  }

  async openDialogKhoNhap() {
    if (this.isView) return
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
        dataColumn: ['tenLoKhoNhan', 'tenNganKhoNhan', 'tenNhaKhoNhan', 'tenDiemKhoNhan']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          tenLoKho: data.tenLoKhoNhan,
          maLoKho: data.maLoKhoNhan,
          tenNganKho: data.tenNganKhoNhan,
          maNganKho: data.maNganKhoNhan,
          tenNhaKho: data.tenNhaKhoNhan,
          maNhaKho: data.maNhaKhoNhan,
          tenDiemKho: data.tenDiemKhoNhan,
          maDiemKho: data.maDiemKhoNhan,
          tenLoKhoXuat: data.tenLoKho,
          maLoKhoXuat: data.maLoKho,
          tenNganKhoXuat: data.tenNganKho,
          maNganKhoXuat: data.maNganKho,
          tenNhaKhoXuat: data.tenNhaKho,
          maNhaKhoXuat: data.maNhaKho,
          tenDiemKhoXuat: data.tenDiemKho,
          maDiemKhoXuat: data.maDiemKho,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          tichLuongKhaDung: data.tichLuongKd,
          tenDonViTinh: data.tenDonViTinh,
          idKeHoachDtl: data.id
        });
        // await this.loadDataBaoQuan(data.cloaiVthh)
        // let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(data.cloaiVthh);
        // if (dmTieuChuan.data) {
        //   console.log('dmTieuChuan')
        //   this.dataTableChiTieu = dmTieuChuan.data.children;
        //   this.dataTableChiTieu.forEach(element => {
        //     element.edit = false
        //   });
        // }
      }
    });
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
    body.pplayMau = this.phuongPhapLayMaus.filter(item => item.checked).map(f => `${f.id}-${f.giaTri}`).join(",")
    body.bienBanLayMauDinhKem = this.bienBanLayMauDinhKem;
    body.fileDinhKemChupMauNiemPhong = this.fileDinhKemChupMauNiemPhong;
    body.dcnbBienBanLayMauDtl = this.listDaiDienCuc.map(f => ({ ...f, loaiDaiDien: '00', tenDaiDien: f.daiDien })).concat(this.listDaiDienChiCuc.map(f => ({ ...f, loaiDaiDien: '01', tenDaiDien: f.daiDien })))
    if (this.idInput) {
      body.id = this.idInput
    }
    console.log('save', body, this.phuongPhapLayMaus)

    let res = this.idInput ? await this.bienBanLayMauService.update(body) : await this.bienBanLayMauService.create(body);
    if (res.data) {
      if (isGuiDuyet) {
        this.idInput = res.data.id;
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
    let trangThai = STATUS.CHO_DUYET_LDCC;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  isTuChoi() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
  }

  async tuChoi() {
    // let trangThai = () => {
    //   if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC)
    //     return STATUS.TU_CHOI_LDCC
    //   if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDC)
    //     return STATUS.TU_CHOI_LDC
    //   return STATUS.CHO_DUYET_TP;
    // };
    let trangThai = STATUS.TU_CHOI_LDCC
    this.reject(this.idInput, trangThai);
  }

  isPheDuyet() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
  }

  async pheDuyet() {
    let trangThai = STATUS.DA_DUYET_LDCC;
    let mesg = 'Bạn muốn phê duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);

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
