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
import { KhCnQuyChuanKyThuat } from "src/app/services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
import { StorageService } from "src/app/services/storage.service";
import * as uuidv4 from "uuid";

@Component({
  selector: 'app-thong-tin-bien-ban-lay-mau-ban-giao-mau',
  templateUrl: './thong-tin-bien-ban-lay-mau-ban-giao-mau.component.html',
  styleUrls: ['./thong-tin-bien-ban-lay-mau-ban-giao-mau.component.scss']
})
export class ThongTinBienBanLayMauBanGiaoMauComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  @Input() isVatTu: boolean;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() data: any;
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
  chiTieuChatLuongs: any[] = []

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private bienBanNhapDayKhoService: BienBanNhapDayKhoService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
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
      bbNhapDayKhoId: [],
      tenLoNganKho: [],
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
      loaiDc: [this.loaiDc],
      isVatTu: [this.isVatTu],
      loaiQdinh: ['NHAP'],
      lyDoTuChoi: [],
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
      loaiDc: this.loaiDc,
      isVatTu: this.isVatTu
    })

    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }

    if (this.data) {
      console.log('data', this.data)
      this.formData.patchValue({
        soQdinhDcc: this.data.soQdinh,
        ngayQdDcCuc: this.data.ngayHieuLuc,
        qdccId: this.data.qddccId,
        tenLoNganKho: `${this.data.tenLoKho || ""} ${this.data.tenNganKho}`,
        tenLoKho: this.data.tenLoKho,
        maLoKho: this.data.maLoKho,
        tenNganKho: this.data.tenNganKho,
        maNganKho: this.data.maNganKho,
        tenNhaKho: this.data.tenNhaKho,
        maNhaKho: this.data.maNhaKho,
        tenDiemKho: this.data.tenDiemKho,
        maDiemKho: this.data.maDiemKho,
        loaiVthh: this.data.maHangHoa,
        tenLoaiVthh: this.data.tenHangHoa,
        cloaiVthh: this.data.maChLoaiHangHoa,
        tenCloaiVthh: this.data.tenChLoaiHangHoa,
        tichLuongKhaDung: this.data.tichLuongKd,
        tenDonViTinh: this.data.tenDonViTinh,
      });
      await this.loadChiTietQdinh(this.data.qddccId);
      await this.loadPhuongPhapLayMau(this.data.maChLoaiHangHoa)
      await this.getTieuChiCanKiemTra(this.data.maHangHoa, this.data.maChLoaiHangHoa)
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
      this.bienBanLayMauDinhKem = data.bienBanLayMauDinhKem
      this.fileDinhKemChupMauNiemPhong = data.fileDinhKemChupMauNiemPhong
      const dsDaiDien = data.dcnbBienBanLayMauDtl.map(item => {
        return {
          ...item,
          daiDien: item.tenDaiDien
        }
      })
      this.listDaiDienCuc = dsDaiDien.filter(item => item.loaiDaiDien === "00")
      this.listDaiDienChiCuc = dsDaiDien.filter(item => item.loaiDaiDien === "01")
      this.formData.patchValue({
        ...data,
      });
      await this.loadPhuongPhapLayMau(data.cloaiVthh)
      const body = {
        loaiVthh: data.loaiVthh,
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0
        }
      }
      const res = await this.khCnQuyChuanKyThuat.search(body);
      if (res.statusCode == 0) {
        const data = res.data
        await this.loadChiTieuChatLuongs(data?.content[0]?.id, data.cloaiVthh)
      }

      if (data.pplayMau) {
        const dspplayMau = data.pplayMau.split(",").map(f => ({ id: f.split("-")[0], giaTri: f.split("-")[1] }))
        this.phuongPhapLayMaus = this.phuongPhapLayMaus.map(pp => {
          return {
            ...pp,
            checked: !!dspplayMau.find(check => Number(check.id) == pp.id)
          }
        })

      }

      if (data.chiTieuKiemTra) {

        const dschiTieuKiemTra = data.chiTieuKiemTra.split(",").map(f => ({ id: f.split("-")[0], giaTri: f.split("-")[1] }))
        this.chiTieuChatLuongs = this.chiTieuChatLuongs.map(pp => {
          return {
            ...pp,
            checked: !!dschiTieuKiemTra.find(check => Number(check.id) == pp.id)
          }
        })

      }

    }
    await this.spinner.hide();
  }

  checkedChange() {

  }

  async openDialogQD() {
    if (this.isView) return
    await this.spinner.show();
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: ['0101', '0102'],
      loaiDc: this.loaiDc,
      maDvi: this.userInfo.MA_DVI,
      type: this.formData.value.type
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
          tenLoNganKho: "",
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
        this.phuongPhapLayMaus = []
        await this.loadChiTietQdinh(data.id);
      }
    });
  }

  async openDialogBBNDK() {
    if (this.isView) return
    await this.spinner.show();
    // Get data tờ trình
    let body = {
      trangThai: STATUS.BAN_HANH,
      // loaiVthh: ['0101', '0102'],
      loaiDc: "DCNB",
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
        dataHeader: ['Số biên bản nhập đầy kho'],
        dataColumn: ['soBb']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        console.log('openDialogQD', data)
        this.formData.patchValue({
          soBbNhapDayKho: data.soBb,
          ngayBbNhapDayKho: data.ngayPDuyet,
          bbNhapDayKhoId: data.id,

        });
        await this.loadChiTietQdinh(data.id);
      }
    });
  }

  async loadChiTietQdinh(id: number) {
    let res = await this.quyetDinhDieuChuyenCucService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      this.dsKeHoach = []
      if (data.danhSachQuyetDinh.length == 0) return
      data.danhSachQuyetDinh.map(qdinh => {
        this.dsKeHoach = this.dsKeHoach.concat(qdinh.danhSachKeHoach)
      })

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
          tenLoNganKho: `${data.tenLoKhoNhan || ""} ${data.tenNganKhoNhan}`,
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
        await this.loadPhuongPhapLayMau(data.cloaiVthh)
        await this.getTieuChiCanKiemTra(data.loaiVthh, data.cloaiVthh)
      }
    });
  }

  async loadPhuongPhapLayMau(maChLoaiHangHoa) {
    let res = await this.danhMucService.loadDanhMucHangChiTiet(maChLoaiHangHoa)
    if (res.msg == MESSAGE.SUCCESS) {
      this.phuongPhapLayMaus = res.data.ppLayMau
    }
    // this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
    //   if (res.msg == MESSAGE.SUCCESS) {
    //     this.phuongPhapLayMaus = res.data;
    //   }
    //   else {
    //     this.notification.error(MESSAGE.ERROR, res.msg);
    //   }
    // }).catch(err => {
    //   this.notification.error(MESSAGE.ERROR, err.msg);
    // })
  }

  async getTieuChiCanKiemTra(loaiVthh: string, cloaiVthh?: string) {
    const body = {
      loaiVthh,
      // cloaiVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      }
    }
    const res = await this.khCnQuyChuanKyThuat.search(body);
    if (res.statusCode == 0) {
      const data = res.data
      this.loadChiTieuChatLuongs(data?.content[0]?.id, cloaiVthh)
    }

  };

  async loadChiTieuChatLuongs(id: number, cloaiVthh: string) {
    if (id) {
      const res = await this.khCnQuyChuanKyThuat.getDetail(id);
      if (res?.msg === MESSAGE.SUCCESS) {
        if (res.data?.apDungCloaiVthh) {
          this.chiTieuChatLuongs = Array.isArray(res.data.tieuChuanKyThuat) ? res.data.tieuChuanKyThuat.map((f) => ({
            id: f.id, giaTri: f.tenChiTieu + " " + f.mucYeuCauNhap, checked: false
          })) : []
        } else {
          this.chiTieuChatLuongs = Array.isArray(res.data.tieuChuanKyThuat) ? res.data.tieuChuanKyThuat.filter(f => f.cloaiVthh === cloaiVthh).map((f) => ({
            id: f.id, giaTri: f.tenChiTieu + " " + f.mucYeuCauNhap, checked: false
          })) : []
        }
      }
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
    body.pplayMau = this.phuongPhapLayMaus.filter(item => item.checked).map(f => `${f.id}-${f.giaTri}`).join(",")
    body.chiTieuKiemTra = this.chiTieuChatLuongs.filter(item => item.checked).map(f => `${f.id}-${f.giaTri}`).join(",")
    body.bienBanLayMauDinhKem = this.bienBanLayMauDinhKem;
    body.fileDinhKemChupMauNiemPhong = this.fileDinhKemChupMauNiemPhong;
    body.dcnbBienBanLayMauDtl = this.listDaiDienCuc.map(f => ({ ...f, loaiDaiDien: '00', tenDaiDien: f.daiDien })).concat(this.listDaiDienChiCuc.map(f => ({ ...f, loaiDaiDien: '01', tenDaiDien: f.daiDien })))
    if (this.idInput) {
      body.id = this.idInput
    }
    console.log('save', body, this.phuongPhapLayMaus)

    let res = this.idInput ? await this.bienBanLayMauService.update(body) : await this.bienBanLayMauService.create(body);
    if (res.data) {
      this.idInput = res.data.id;
      if (isGuiDuyet) {
        this.guiDuyet();
      }
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
