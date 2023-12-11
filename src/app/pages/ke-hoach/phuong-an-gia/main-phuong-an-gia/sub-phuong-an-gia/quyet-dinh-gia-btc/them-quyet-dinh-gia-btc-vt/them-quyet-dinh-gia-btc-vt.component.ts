import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import dayjs from "dayjs";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {MESSAGE} from "src/app/constants/message";
import {UserLogin} from "src/app/models/userlogin";
import {HelperService} from "src/app/services/helper.service";
import {UserService} from "src/app/services/user.service";
import {Globals} from "src/app/shared/globals";
import {STATUS} from "src/app/constants/status";
import {QuyetDinhGiaCuaBtcService} from "src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {TongHopPhuongAnGiaService} from "src/app/services/ke-hoach/phuong-an-gia/tong-hop-phuong-an-gia.service";
import {DialogPagQdBtcComponent} from "../dialog-pag-qd-btc/dialog-pag-qd-btc.component";
import printJS from "print-js";
import {saveAs} from "file-saver";
import {cloneDeep} from 'lodash';

@Component({
  selector: "app-them-quyet-dinh-gia-btc-vt",
  templateUrl: "./them-quyet-dinh-gia-btc-vt.component.html",
  styleUrls: ["./them-quyet-dinh-gia-btc-vt.component.scss"]
})
export class ThemQuyetDinhGiaBtcVtComponent implements OnInit {
  @Input("type") type: string;
  @Input("pagType") pagType: string;
  @Input("isView") isView: boolean;
  @Input() idInput: number;
  @Output("onClose") onClose = new EventEmitter<any>();
  formData: FormGroup;

  STATUS = STATUS;
  dsVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  dsHangHoa: any[] = [];
  dsLoaiGia: any[] = [];
  arrThongTinGia: any[] = [];
  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  userInfo: UserLogin;
  soDeXuat: string;
  maQd: string;
  dataTable: any[] = [];
  fileDinhKem: any[] = [];
  canCuPhapLys: any[] = [];
  pdfSrc: any;
  excelSrc: any;
  pdfBlob: any;
  excelBlob: any;
  printSrc: any
  showDlgPreview = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public globals: Globals,
    private helperService: HelperService,
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService,
    private danhMucService: DanhMucService,
    private tongHopPhuongAnGiaService: TongHopPhuongAnGiaService,
    private notification: NzNotificationService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get("year"), [Validators.required]],
        soQd: [, [Validators.required]],
        ngayKy: [null, [Validators.required]],
        ngayHieuLuc: [null, [Validators.required]],
        soToTrinh: [null],
        loaiVthh: [null],
        cloaiVthh: [null],
        loaiGia: [null],
        tieuChuanCl: [null],
        trichYeu: [null],
        trangThai: ["00"],
        ghiChu: [null],
        thongTinGia: [null],
        soQdDc: [null],
        loaiDeXuat: ['00'],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.loadDsLoaiGia(),
      this.loadDsVthh(),
      this.maQd = "/QĐ-BTC",
      await this.getDataDetail(this.idInput),
      this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhGiaCuaBtcService.getDetail(id);
      const data = res.data;
      this.arrThongTinGia = data.thongTinGiaVt
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        soQd: data.soQd ? data.soQd.split("/")[0] : '',
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        ngayKy: data.ngayKy,
        ngayHieuLuc: data.ngayHieuLuc,
        loaiGia: data.loaiGia,
        tieuChuanCl: data.tieuChuanCl,
        trichYeu: data.trichYeu,
        trangThai: data.trangThai,
        ghiChu: data.ghiChu,
        soToTrinh: data.soToTrinh,
        soQdDc: data.soQdDc,
        loaiDeXuat: data.loaiDeXuat
      });
      this.fileDinhKem = data.fileDinhKems;
      this.canCuPhapLys = data.canCuPhapLys;
    }
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
  }

  downloadFileKeHoach(event) {
  }

  quayLai() {
    this.onClose.emit();
  }

  banHanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn ban hành?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.value.id,
            lyDoTuChoi: null,
            trangThai: STATUS.BAN_HANH
          };
          let res =
            await this.quyetDinhGiaCuaBtcService.approve(
              body
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.BAN_HANH_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  async save(isBanHanh?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    this.arrThongTinGia.forEach(item => {
      if (item.vat) {
        if (this.formData.value.loaiDeXuat == '00') {
          item.giaQdBtcVat = item.giaQdBtc + item.giaQdBtc * item.vat
        } else {
          item.giaQdDcBtcVat = item.giaQdDcBtc + item.giaQdDcBtc * item.vat
        }
      }
    })

    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    body.maDvi = this.userInfo.MA_DVI;
    body.pagType = this.pagType;
    body.thongTinGiaVt = this.arrThongTinGia
    body.fileDinhKemReq = this.fileDinhKem;
    body.canCuPhapLys = this.canCuPhapLys;
    let res;
    if (this.idInput > 0) {
      res = await this.quyetDinhGiaCuaBtcService.update(body);
    } else {
      res = await this.quyetDinhGiaCuaBtcService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isBanHanh) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        this.banHanh();
      } else {
        if (!isBanHanh) {
          if (this.idInput > 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          }
        }
        this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  async loadDsLoaiGia() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_GIA");
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiGia = res.data;
      if (this.dsLoaiGia && this.dsLoaiGia.length > 0) {
        this.dsLoaiGia = res.data.filter(item =>
          item.ma == 'LG01' || item.ma == 'LG02'
        );
      }
    }
  }

  async loadDsVthh() {
    let body = {
      "str": "02"
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.dsVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.dsVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async onChangeLoaiVthh(event) {
    let body = {
      "str": event
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.dsCloaiVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.dsCloaiVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  openDialogToTrinh() {
    if (!this.isView && this.formData.value.loaiGia != null) {
      let modalQD = this.modal.create({
        nzTitle: 'CHỌN SỐ TỜ TRÌNH HỒ SƠ PHƯƠNG ÁN GIÁ HOẶC SỐ TỜ TRÌNH ĐỀ XUẤT ĐIỀU CHỈNH GIÁ',
        nzContent: DialogPagQdBtcComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '1200px',
        nzFooter: null,
        nzComponentParams: {
          pagType: this.pagType,
          type: this.type,
          namKeHoach: this.formData.value.namKeHoach,
          loaiGia: this.formData.value.loaiGia
        },
      });
      modalQD.afterClose.subscribe((data) => {
        console.log(data, 111)
        if (data && data.listDx && data.listDx.length > 0) {
          let thRes = data.listDx;
          if (thRes && thRes.length > 0) {
            this.formData.patchValue({
              soToTrinh: thRes && thRes.length > 0 ? thRes.map(item => item.soDeXuat).toString() : "",
              soQdDc: thRes && thRes.length > 0 ? thRes.map(item => item.soDeXuatDc).toString() : [],
              loaiDeXuat: data.formData.loaiQd,
            })
          }
          let body = {
            listId: thRes && thRes.length > 0 ? thRes.map(item => item.id) : []
          }
          this.tongHopData(body);
        }
      });
    } else {
      if (!this.isView) {
        this.notification.warning(MESSAGE.WARNING, 'Vui lòng chọn loại giá!');
        return;
      }
    }
  }

  async tongHopData(body) {
    try {
      this.spinner.show();
      let res = await this.quyetDinhGiaCuaBtcService.tongHopDataToTrinh(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let dataTongHop = res.data;
        if (dataTongHop && dataTongHop.length > 0) {
          const uniqueSoDeXuat = new Set<string>();
          for (const record of dataTongHop) {
            record.giaQdBtc = record.giaQdBtcCu;
            record.giaQdBtcVat = record.giaQdBtcCuVat;
            // Sử dụng trường "type" làm key trong Set để kiểm tra sự trùng lặp
            if (!uniqueSoDeXuat.has(record.soQdBtc)) {
              // Nếu trường "type" chưa tồn tại trong Set, thêm giá trị "soDeXuat" vào Set
              uniqueSoDeXuat.add(record.soQdBtc ? record.soQdBtc.toString() : "");
            }
          }
          const uniqueSoDeXuatArray = Array.from(uniqueSoDeXuat);
          this.formData.patchValue({
            soQdDc: uniqueSoDeXuatArray && this.formData.value.loaiDeXuat == '01' ? uniqueSoDeXuatArray.join(', ') : ""
          })
          this.arrThongTinGia = cloneDeep(dataTongHop);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async previewQdGia() {
    try {
      this.spinner.show();
      let body = cloneDeep(this.formData.value);
      body.typeFile = "pdf";
      body.trangThai = "01";
      body.listDto = this.arrThongTinGia;
      body.pagType = this.pagType;
      body.type = this.type;
      body.ngayHieuLuc = this.formData.value.ngayHieuLuc ? dayjs(this.formData.value.ngayHieuLuc).format("DD/MM/YYYY") : "";
      await this.quyetDinhGiaCuaBtcService.previewQdGia(body).then(async s => {
        this.pdfBlob = s;
        this.pdfSrc = await new Response(s).arrayBuffer();
      });
      this.showDlgPreview = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  async downloadExcel() {
    try {
      this.spinner.show();
      let body = cloneDeep(this.formData.value);
      body.typeFile = "xlsx";
      body.trangThai = "01";
      body.listDto = this.arrThongTinGia;
      body.pagType = this.pagType;
      body.type = this.type;
      body.ngayHieuLuc = this.formData.value.ngayHieuLuc ? dayjs(this.formData.value.ngayHieuLuc).format("DD/MM/YYYY") : "";
      await this.quyetDinhGiaCuaBtcService.previewQdGia(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "quyet_dinh_gia_btc.xlsx");
      });
      this.showDlgPreview = true
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  async downloadPdf() {
    saveAs(this.pdfBlob, 'quyet_dinh_gia_btc.pdf');
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview() {
    const blobUrl = URL.createObjectURL(this.pdfBlob);
    printJS({
      printable: blobUrl,
      type: 'pdf',
      base64: false
    })
  }


}


