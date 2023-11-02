import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
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
import {chain} from "lodash";
import {v4 as uuidv4} from "uuid";
import {saveAs} from "file-saver";
import printJS from "print-js";
import { cloneDeep } from 'lodash';
import {PdfViewerComponent} from "ng2-pdf-viewer";
import {style} from "@angular/animations";

@Component({
  selector: "app-them-quyet-dinh-gia-btc-lt",
  templateUrl: "./them-quyet-dinh-gia-btc-lt.component.html",
  styleUrls: ["./them-quyet-dinh-gia-btc-lt.component.scss"]
})
export class ThemQuyetDinhGiaBtcLtComponent implements OnInit {
  @ViewChild('pdfViewer') pdfViewer: PdfViewerComponent;
  @Input("type") type: string;
  @Input("pagType") pagType: string;
  @Input("isView") isView: boolean;
  @Input() idInput: number;
  @Output("onClose") onClose = new EventEmitter<any>();
  formData: FormGroup;
  dsNam: any[] = [];
  userInfo: UserLogin;
  maQd: string;
  dataTable: any[] = [];
  dataTableView: any[] = [];
  fileDinhKem: any[] = [];
  canCuPhapLys: any[] = [];
  STATUS = STATUS;
  expandSet = new Set<number>();
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
        namKeHoach: [dayjs().get("year")],
        soQd: [null],
        ngayKy: [null],
        ngayHieuLuc: [null],
        soQdDc: [null],
        tenLoaiGia: [null],
        soToTrinh: [null],
        loaiVthh: [null],
        tenLoaiVthh: [null],
        cloaiVthh: [null],
        tenCloaiVthh: [null],
        loaiGia: [null],
        tieuChuanCl: [null],
        trichYeu: [null],
        trangThai: ["00"],
        ghiChu: [null],
        loaiDeXuat: ['00']
      }
    );
  }

  setValidator(isGuiDuyet) {
    this.formData.controls["namKeHoach"].setValidators([Validators.required]);
    this.formData.controls["soQd"].setValidators([Validators.required]);
    this.formData.controls["soToTrinh"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiGia"].setValidators([Validators.required]);
    if (isGuiDuyet) {
      this.formData.controls["ngayKy"].setValidators([Validators.required]);
      this.formData.controls["ngayHieuLuc"].setValidators([Validators.required]);
    }
  }

  async ngOnInit() {
    this.spinner.show();
    this.maQd = "/QĐ-BTC";
    this.userInfo = this.userService.getUserLogin();
    this.loadDsNam();
    await this.getDataDetail(this.idInput)
    this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhGiaCuaBtcService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        soQd: data.soQd ? data.soQd.split("/")[0] : '',
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        ngayKy: data.ngayKy,
        ngayHieuLuc: data.ngayHieuLuc,
        loaiGia: data.loaiGia,
        tenLoaiGia: data.tenLoaiGia,
        tieuChuanCl: data.tieuChuanCl,
        trichYeu: data.trichYeu,
        trangThai: data.trangThai,
        ghiChu: data.ghiChu,
        soToTrinh: data.soToTrinh,
        loaiDeXuat: data.loaiDeXuat,
        soQdDc: data.soQdDc
      });
      this.fileDinhKem = data.fileDinhKems;
      this.canCuPhapLys = data.canCuPhapLys;
      this.dataTable = data.thongTinGiaLt;
      this.buildTreePagCt();
    }
  }

  loadDsNam() {
    for (let i = -10; i < 15; i++) {
      this.dsNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
  }

  quayLai() {
    this.onClose.emit();
  }

  async banHanh() {
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
    this.helperService.removeValidators(this.formData);
    this.setValidator(isBanHanh);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    this.convertTreeToList();
    if (this.dataTable && this.dataTable.length > 0) {
      if (this.formData.value.loaiGia == 'LG01' || this.formData.value.loaiGia == 'LG03') {
        this.dataTable.forEach(item => {
          if (item.vat) {
            if (this.formData.value.loaiDeXuat == '00') {
              item.giaQdBtcVat = item.giaQdBtc + item.giaQdBtc * item.vat
            } else {
              item.giaQdDcBtcVat = item.giaQdDcBtc + item.giaQdDcBtc * item.vat
            }
          }
        })
      }
    }
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    body.maDvi = this.userInfo.MA_DVI;
    body.capDvi = this.userInfo.CAP_DVI;
    body.pagType = this.pagType;
    body.thongTinGiaLt = this.dataTable
    body.fileDinhKemReq = this.fileDinhKem;
    body.canCuPhapLys = this.canCuPhapLys;
    let res;
    if (this.idInput > 0) {
      res = await this.quyetDinhGiaCuaBtcService.update(body);
    } else {
      res = await this.quyetDinhGiaCuaBtcService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      this.idInput = res.data.id;
      if (isBanHanh) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
       await this.banHanh();
      }
      if (!isBanHanh) {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  openDialogToTrinh() {
    if (!this.isView) {
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
          namKeHoach: this.formData.value.namKeHoach
        },
      });
      modalQD.afterClose.subscribe((data) => {
        if (data) {
          let chiTietToTrinh = data.data;
          if (chiTietToTrinh) {
            this.dataTable = chiTietToTrinh && chiTietToTrinh.pagChiTiets ? chiTietToTrinh.pagChiTiets : [];
            const uniqueSoDeXuat = new Set<string>();
            for (const record of this.dataTable) {
              record.giaQdBtc =  record.giaQdBtcCu;
              record.giaQdBtcVat =  record.giaQdBtcCuVat;
              // Sử dụng trường "type" làm key trong Set để kiểm tra sự trùng lặp
              if (!uniqueSoDeXuat.has(record.soDx)) {
                // Nếu trường "type" chưa tồn tại trong Set, thêm giá trị "soDeXuat" vào Set
                uniqueSoDeXuat.add(record.soQdBtc ? record.soQdBtc.toString() : "");
              }
            }
            const uniqueSoDeXuatArray = Array.from(uniqueSoDeXuat);
            this.formData.patchValue({
              loaiDeXuat: data.formData.loaiQd,
              loaiVthh: chiTietToTrinh.loaiVthh ? chiTietToTrinh.loaiVthh : null,
              cloaiVthh: chiTietToTrinh.cloaiVthh ? chiTietToTrinh.cloaiVthh : null,
              tenLoaiVthh: chiTietToTrinh.tenLoaiVthh ? chiTietToTrinh.tenLoaiVthh : null,
              tenCloaiVthh: chiTietToTrinh.tenCloaiVthh ? chiTietToTrinh.tenCloaiVthh : null,
              loaiGia: chiTietToTrinh.loaiGia ? chiTietToTrinh.loaiGia : null,
              tenLoaiGia: chiTietToTrinh.tenLoaiGia ? chiTietToTrinh.tenLoaiGia : null,
              soToTrinh: chiTietToTrinh.soToTrinh ? chiTietToTrinh.soToTrinh : null,
              tieuChuanCl: chiTietToTrinh.tchuanCluong ? chiTietToTrinh.tchuanCluong : null,
              soQdDc: uniqueSoDeXuatArray && data.formData?.loaiQd == '01' ? uniqueSoDeXuatArray.join(', ') : ""
            })
          }
          this.buildTreePagCt();
        }
      });
    }
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
            soDx: value && value[0] && value[0].soDx ? value[0].soDx : null,
            children: value,
            apDungTatCa: value && value[0] && value[0].apDungTatCa ? value[0].apDungTatCa : null,
            vat: value && value[0] && value[0].vat ? value[0].vat : null,
            giaQdBtc: value && value[0] && value[0].giaQdBtc ? value[0].giaQdBtc : 0,
            giaQdDcBtc: value && value[0] && value[0].giaQdDcBtc ? value[0].giaQdDcBtc : 0,
          };
        }).value();
    }
    this.expandAll()
  }

  convertTreeToList() {
    if (this.dataTableView && this.dataTableView.length > 0) {
      this.dataTable = [];
      this.dataTableView.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => {
            if (child.apDungTatCa) {
              if (this.formData.value.loaiDeXuat == '00') {
                child.giaQdBtc = item.giaQdBtc;
              } else {
                child.giaQdDcBtc = item.giaQdDcBtc;
              }
            }
            this.dataTable.push(child);
          })
        }
      })
    }
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


  async previewQdGia() {
    try {
      this.spinner.show();
      let arr = [];
      this.dataTableView.forEach((item, index) => {
        if (item.children && item.children.length > 0) {
          let itemClonePr = cloneDeep(item);
          itemClonePr.giaQdBtc = null;
          itemClonePr.giaQdDcBtc = null;
          itemClonePr.stt = index + 1;
          arr.push(itemClonePr)
          item.children.forEach(child => {
            let itemCloneChild = cloneDeep(child);
            itemCloneChild.tenDvi = "";
            arr.push(itemCloneChild);
          })
        }
      });
      let body = cloneDeep(this.formData.value);
      body.typeFile = "pdf";
      body.trangThai = "01";
      body.listDto = arr;
      body.pagType = this.pagType;
      body.type = this.type;
      body.ngayHieuLuc = this.formData.value.ngayHieuLuc ? dayjs(this.formData.value.ngayHieuLuc).format("DD/MM/YYYY") : "";
      await this.quyetDinhGiaCuaBtcService.previewQdGia(body).then(async s => {
        this.printSrc = s;
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
      let arr = [];
      this.dataTableView.forEach(item => {
        if (item.children && item.children.length > 0) {
          arr.push(item)
          item.children.forEach(child => {
            child.tenDvi = "";
            arr.push(child);
          })
        }
      });
      let body = cloneDeep(this.formData.value);
      body.typeFile = "xlsx";
      body.trangThai = "01";
      body.listDto = arr;
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


