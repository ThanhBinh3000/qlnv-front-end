import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Base2Component } from "../../../../../../components/base2/base2.component";
import { ThongtinDieuchinhComponent } from "../themmoi-dieuchinh/thongtin-dieuchinh/thongtin-dieuchinh.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  QuyetDinhPheDuyetKeHoachLCNTService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service";
import {
  DieuChinhQuyetDinhPdKhlcntService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/dieuchinh-khlcnt/dieuChinhQuyetDinhPdKhlcnt.service";
import { DanhMucService } from "../../../../../../services/danhmuc.service";
import dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../../constants/status";
import { MESSAGE } from "../../../../../../constants/message";
import { DatePipe } from "@angular/common";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { cloneDeep } from "lodash";

@Component({
  selector: "app-themmoi-dieuchinh-vt",
  templateUrl: "./themmoi-dieuchinh-vt.component.html",
  styleUrls: ["./themmoi-dieuchinh-vt.component.scss"]
})
export class ThemmoiDieuchinhVtComponent extends Base2Component implements OnInit {

  @ViewChild("thongTinDc") thongtinDieuchinhComponent: ThongtinDieuchinhComponent;

  @Input() isViewDetail: boolean;
  @Input() loaiVthh: string;
  @Input() id: number;
  @Output() showListEvent = new EventEmitter<any>();
  danhsachDx: any[] = [];
  danhsachDxCache: any[] = [];
  selected: boolean = false;
  fileDinhKems: any[] = [];
  fileDinhKemsTtr: any[] = [];
  listCcPhapLy: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private dieuChinhQuyetDinhPdKhlcntService: DieuChinhQuyetDinhPdKhlcntService,
    private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dieuChinhQuyetDinhPdKhlcntService);
    this.formData = this.fb.group({
      id: [null],
      nam: [dayjs().get("year"), Validators.required],
      soQdDc: ["", [Validators.required]],
      idQdGoc: ["", Validators.required],
      soQdGoc: ["", [Validators.required]],
      ngayQdGoc: [""],
      ngayQd: ["", [Validators.required]],
      ngayHluc: ["", [Validators.required]],
      trichYeu: [""],
      trichYeuTtr: [""],
      hthucLcnt: [""],
      pthucLcnt: [""],
      loaiHdong: [""],
      nguonVon: [""],
      tgianBdauTchuc: [""],
      tgianDthau: [""],
      tgianMthau: [""],
      tgianNhang: [""],
      tgianThien: [""],
      ghiChu: [""],
      loaiVthh: ["", [Validators.required]],
      tenLoaiVthh: [""],
      cloaiVthh: [""],
      tenCloaiVthh: [""],
      moTaHangHoa: [""],
      trangThai: [STATUS.DA_LAP],
      tenTrangThai: ["Đã lập"],
      tchuanCluong: [""],
      lyDoTuchoi: [""],
      gtriDthau: [""],
      maDvi: [""],
      lanDieuChinh: [""],
      soTtrDc: [""],
      soQdCc: [""],
      noiDungQd: [""],
      loaiHinhNx: [""],
      kieuNx: [""]
    });
  }

  maQd: string = "";
  maTrinh: string = "";
  listQdGoc: any[] = [];
  listNguonVon: any[] = [];
  listPhuongThucDauThau: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];

  isDetail = false;
  dataInput: any;
  dataInputCache: any;

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.loadDataComboBox()
      ]);
      this.maQd = "/" + this.userInfo.MA_QD;
      this.maTrinh = "/" + this.userInfo.MA_TR;
      if (this.id) {
        this.getDetail();
      } else {
        this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      console.log("error: ", e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async loadDataComboBox() {
    this.spinner.show();
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll("NGUON_VON");
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
    // phương thức đấu thầu
    this.listPhuongThucDauThau = [];
    let resPt = await this.danhMucService.danhMucChungGetAll("PT_DTHAU");
    if (resPt.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = resPt.data;
    }
    // hình thức đấu thầu
    this.listHinhThucDauThau = [];
    let resPtdt = await this.danhMucService.danhMucChungGetAll("HT_LCNT");
    if (resPtdt.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = resPtdt.data;
    }
    // hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll("LOAI_HDONG");
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == "NHAP_DT");
      this.formData.get("loaiHinhNx").setValue(this.listLoaiHinhNx[0].ma);
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data;
    }
    this.spinner.hide();
  }

  initForm() {
    this.formData.patchValue({});
  }

  setNewData($event) {
    let pipe = new DatePipe("en-US");
    console.log($event);
    this.formData.get("tgianBdauTchuc").setValue($event.tgianBdauTchuc);
    this.formData.get("tgianMthau").setValue(pipe.transform($event.tgianMthau, "yyyy-MM-dd HH:mm"));
    this.formData.get("tgianDthau").setValue(pipe.transform($event.tgianDthau, "yyyy-MM-dd HH:mm"));
    this.formData.get("tgianNhang").setValue($event.tgianNhang);
    this.formData.get("gtriDthau").setValue($event.gtriDthau);
    this.formData.get("tchuanCluong").setValue($event.tchuanCluong);
    this.formData.get("maDvi").setValue($event.maDvi);
    // this.danhsachDx[this.index].tgianBdauTchuc = $event.tgianBdauTchuc;
    // this.danhsachDx[this.index].tgianMthau = $event.tgianMthau;
    // this.danhsachDx[this.index].tgianDthau = $event.tgianDthau;
    // this.danhsachDx[this.index].tgianNhang = $event.tgianNhang;
  }

  async getDetail() {
    if (this.id > 0) {
      let data = await this.detail(this.id);
      if (data) {
        console.log(data, 'b')
        this.formData.patchValue({
          soQdDc: data.soQdDc?.split("/")[0],
          soTtrDc: data.soTtrDc?.split("/")[0]
        });
        await this.onChangeSoQdGoc(data.idQdGoc);
      }
    }
  }

  async openDialogSoQdGoc() {
    this.spinner.show();
    this.listQdGoc = [];
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: this.loaiVthh,
      namKhoach: this.formData.get("nam").value,
      lastest: 0
    };
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listQdGoc = res.data.content;
    }
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: "Danh sách số quyết định gốc",
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "900px",
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listQdGoc,
        dataHeader: ["Số quyết định gốc", "Loại hàng hóa", "Chủng loại hàng hóa"],
        dataColumn: ["soQd", "tenLoaiVthh", "tenCloaiVthh"]
      }
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeSoQdGoc(data.id);
      }
    });
  }

  async onChangeSoQdGoc($event, isInit?: boolean) {
    this.spinner.show();
    if ($event) {
      let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail($event);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.formData.patchValue({
          soQdGoc: data.soQd,
          idQdGoc: $event,
          lanDieuChinh: data.dchinhDxKhLcntHdr?data.dchinhDxKhLcntHdr.lanDieuChinh + 1 : 1,
          ngayQdGoc: data.ngayQd,
          soQdCc: data.dxKhlcntHdr.soQd,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          loaiHinhNx: data.dxKhlcntHdr.loaiHinhNx,
          kieuNx: data.dxKhlcntHdr.kieuNx,
          tchuanCluong: data.dxKhlcntHdr.tchuanCluong
        });
        this.dataInput = data;
        this.dataInputCache = cloneDeep(data);
        if (isInit) {
          this.initDataInput();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    this.spinner.hide();
  }

  initDataInput() {
    // this.dataInput.tenDuAn = this.formData.value.tenDuAn;
    // this.dataInput.tongMucDtDx = this.formData.value.tongMucDtDx;
    // this.dataInput.dienGiaiTongMucDt = this.formData.value.dienGiaiTongMucDt;
    // this.dataInput.tgianThien = this.formData.value.tgianThien;
    // this.dataInput.quyMo = this.formData.value.quyMo;
    // this.dataInput.hthucLcnt = this.formData.value.hthucLcnt;
    // this.dataInput.pthucLcnt = this.formData.value.pthucLcnt;
    // this.dataInput.tgianBdauTchuc = this.formData.value.tgianBdauTchuc;
    // this.dataInput.loaiHdong = this.formData.value.loaiHdong;
    // this.dataInput.tgianThienHd = this.formData.value.tgianThienHd;
    // this.dataInput.dienGiai = this.formData.value.dienGiai;
    // this.dataInput.vat = this.formData.value.vat;
    // this.dataInput.dsGtDtlList = this.dataLoadDetail;
  }

  async pheDuyet() {
    let trangThai = STATUS.BAN_HANH;
    let mesg = "Văn bản sẵn sàng ban hành ?";
    await this.approve(this.formData.value.id, trangThai, mesg);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async save(isGuiDuyet?) {
    // await this.spinner.show();
    // if (!this.isDetailPermission()) {
    //   return;
    // }
    // this.setValidator(isGuiDuyet);
    // this.helperService.markFormGroupTouched(this.formData);
    // if (this.formData.invalid) {
    //   await this.spinner.hide();
    //   return;
    // }
    debugger
    let childBody = this.thongtinDieuchinhComponent.formData.value;
    this.formData.patchValue({
      tenDuAn: childBody.tenDuAn,
      tongMucDtDx: childBody.tongMucDtDx,
      dienGiaiTongMucDt: childBody.dienGiaiTongMucDt,
      tgianThien: childBody.tgianThien,
      quyMo: childBody.quyMo,
      hthucLcnt: childBody.hthucLcnt,
      pthucLcnt: childBody.pthucLcnt,
      tgianBdauTchuc: childBody.tgianBdauTchuc,
      loaiHdong: childBody.loaiHdong,
      tgianThienHd: childBody.tgianThienHd,
      dienGiai: childBody.dienGiai,
      vat: childBody.vat,
    });
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maQd;
    }
    if (this.formData.value.soTtrDc) {
      body.soTtrDc = this.formData.value.soTtrDc + "/" + this.maTrinh;
    }
    body.dsGoiThau = this.dataInput.dsGtDtlList;
    body.fileDinhKems = this.fileDinhKems;
    body.listCcPhapLy = this.listCcPhapLy;
    let res = null;
    if (this.formData.get("id").value) {
      res = await this.dieuChinhQuyetDinhPdKhlcntService.update(body);
    } else {
      res = await this.dieuChinhQuyetDinhPdKhlcntService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.id = res.data.id;
        // this.guiDuyet();
      } else {
        if (this.formData.get("id").value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.formData.get("id").setValue(res.data.id);
          this.id = res.data.id;
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }


  setValidator() {
    // if (this.formData.get('loaiVthh').value.startsWith('02')) {
    //   this.formData.controls["hthucLcnt"].clearValidators();
    //   this.formData.controls["pthucLcnt"].clearValidators();
    //   this.formData.controls["loaiHdong"].clearValidators();
    //   this.formData.controls["nguonVon"].clearValidators();
    //   this.formData.controls["tgianBdauTchuc"].clearValidators();
    //   this.formData.controls["tgianDthau"].clearValidators();
    //   this.formData.controls["tgianMthau"].clearValidators();
    //   this.formData.controls["tgianNhang"].clearValidators();
    //   this.formData.controls["cloaiVthh"].clearValidators();
    //   this.formData.controls["tenCloaiVthh"].clearValidators();
    //   this.formData.controls["moTaHangHoa"].clearValidators();

    // } else {
    //   this.formData.controls["hthucLcnt"].setValidators([Validators.required]);
    //   this.formData.controls["pthucLcnt"].setValidators([Validators.required]);
    //   this.formData.controls["loaiHdong"].setValidators([Validators.required]);
    //   this.formData.controls["nguonVon"].setValidators([Validators.required]);
    //   this.formData.controls["tgianBdauTchuc"].setValidators([Validators.required]);
    //   this.formData.controls["tgianDthau"].setValidators([Validators.required]);
    //   this.formData.controls["tgianMthau"].setValidators([Validators.required]);
    //   this.formData.controls["tgianNhang"].setValidators([Validators.required]);
    //   this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
    //   this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    //   this.formData.controls["moTaHangHoa"].setValidators([Validators.required]);
    // }
  }

  getNameFile($event) {

  }

  deleteItem(index) {

  }

  onChangeLhNx($event) {
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu
      });
    }
  }
}
