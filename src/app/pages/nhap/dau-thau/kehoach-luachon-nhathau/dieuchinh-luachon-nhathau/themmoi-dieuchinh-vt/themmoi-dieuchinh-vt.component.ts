import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {ThongtinDieuchinhComponent} from "../themmoi-dieuchinh/thongtin-dieuchinh/thongtin-dieuchinh.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetDinhPheDuyetKeHoachLCNTService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service";
import {
  DieuChinhQuyetDinhPdKhlcntService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/dieuchinh-khlcnt/dieuChinhQuyetDinhPdKhlcnt.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../../constants/status";
import {MESSAGE} from "../../../../../../constants/message";
import {formatDate} from "@angular/common";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {cloneDeep} from "lodash";
import {DialogTuChoiComponent} from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";

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
  @Input() checkPrice: any;
  @Output() showListEvent = new EventEmitter<any>();
  danhsachDx: any[] = [];
  danhsachDxCache: any[] = [];
  dataGoc: any[] = [];
  selected: boolean = false;
  fileDinhKems: any[] = [];
  fileDinhKemsTtr: any[] = [];
  listCcPhapLy: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  previewName : string = 'qd_dieu_chinh_khlcnt_vt';
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
      nam: [dayjs().get("year")],
      soQdDc: [""],
      idQdGoc: [""],
      soQdGoc: [""],
      ngayQdGoc: [""],
      ngayQd: [""],
      ngayQdDc: [""],
      ngayHluc: [""],
      trichYeu: [""],
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
      loaiVthh: [""],
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
      noiDungTtr: [""],
      trichYeuQd: [""],
      loaiHinhNx: [""],
      kieuNx: [""],
      tenDuAn: [""],
      tongMucDtDx: [""],
      dienGiaiTongMucDt:[""],
      quyMo: [""],
      tgianThienHd:[""],
      dienGiai:[""],
      vat: [""],
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
  dataLoadDetail: any;

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
    let resHd = await this.danhMucService.danhMucChungGetAll("HINH_THUC_HOP_DONG");
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

  async getDetail() {
    if (this.id > 0) {
      let data = await this.detail(this.id);
      if (data) {
        this.helperService.bidingDataInFormGroup(this.formData, data);
        this.formData.patchValue({
          soQdDc: data.soQdDc?.split("/")[0],
          soTtrDc: data.soTtrDc?.split("/")[0]
        });
        if (data.soQdDc != null) {
          this.maQd = "/" + data.soQdDc?.split("/")[1]
        }
        if (data.soTtrDc != null) {
          this.maTrinh = "/" + data.soTtrDc?.split("/")[1]
        }
        if (data.lanDieuChinh > 1) {
          let dataQdGoc = await this.dieuChinhQuyetDinhPdKhlcntService.findByIdQdGoc(data.idQdGoc, data.lanDieuChinh -1);
          if (dataQdGoc.msg == MESSAGE.SUCCESS) {
            this.dataGoc = dataQdGoc.data;
            this.dataInputCache = cloneDeep(dataQdGoc.data);
          }
        } else {
          let dataQdGoc = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(data.idQdGoc);
          if (dataQdGoc.msg == MESSAGE.SUCCESS) {
            this.dataGoc = dataQdGoc.data;
            this.dataInputCache = cloneDeep(dataQdGoc.data);
          }
        }
        this.dataInput = data;
        // this.dataLoadDetail = data.dsGthau;
        this.fileDinhKems = data.fileDinhKems;
        this.listCcPhapLy = data.listCcPhapLy;
        this.fileDinhKemsTtr = data.fileDinhKemsTtr;
        // await this.onChangeSoQdGoc(data.idQdGoc, true);
        // this.formData.patchValue({
        //   lanDieuChinh: data.lanDieuChinh
        // })
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
      lastest: 0,
    };
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.dsQdDuocDieuChinh(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listQdGoc = res.data;
      this.listQdGoc.forEach(item => {
        if (item.soQdDc != null) {
          item.soQd = item.soQdDc
        }
        item.thoiDiemKy = item.ngayQd ? formatDate(item.ngayQd, "dd/MM/yyyy", 'en-US') : ''
        item.trangThaiGia = item.qthtChotGiaInfoRes?.qthtQuyetDinhChinhGia?.length > 0 ? 'Dừng thực hiện để điều chỉnh giá' : '';
        item.loai = item.qthtChotGiaInfoRes?.qthtQuyetDinhChinhGia?.length > 0 ? 'Điều chỉnh giá' : ''
      })
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
        dataHeader: ["Số QĐ cần điều chỉnh", "Ngày ký QĐ", 'Trạng thái', 'Ngày chốt điều chỉnh giá', 'Ngày hiệu lực'],
        dataColumn: ["soQd", "thoiDiemKy", 'trangThaiGia', '', '']
      }
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeSoQdGoc(data.id, false);
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
          soQdGoc: data.soQdDc? data.soQdDc : data.soQd,
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
        this.dataGoc = res.data;
        if (data.dchinhDxKhLcntHdr != null) {
          this.dataInput = data.dchinhDxKhLcntHdr;
          this.dataInput.dsGthau = this.dataInput.dsGthau.filter(item => (item.qdPdHsmt == null || item.qdPdHsmt?.trangThai != STATUS.BAN_HANH))
          this.dataInputCache = cloneDeep(this.dataInput);
        } else {
          this.dataInput = data;
          this.dataInput.dsGthau = this.dataInput.dsGthau.filter(item => (item.qdPdHsmt == null || item.qdPdHsmt?.trangThai != STATUS.BAN_HANH))
          this.dataInputCache = cloneDeep(this.dataInput);
        }
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
    this.dataInput.tenDuAn = this.formData.value.tenDuAn;
    this.dataInput.tongMucDtDx = this.formData.value.tongMucDtDx;
    this.dataInput.dienGiaiTongMucDt = this.formData.value.dienGiaiTongMucDt;
    this.dataInput.tgianThien = this.formData.value.tgianThien;
    this.dataInput.quyMo = this.formData.value.quyMo;
    this.dataInput.hthucLcnt = this.formData.value.hthucLcnt;
    this.dataInput.pthucLcnt = this.formData.value.pthucLcnt;
    this.dataInput.tgianBdauTchuc = this.formData.value.tgianBdauTchuc;
    this.dataInput.loaiHdong = this.formData.value.loaiHdong;
    this.dataInput.tgianThienHd = this.formData.value.tgianThienHd;
    this.dataInput.dienGiai = this.formData.value.dienGiai;
    this.dataInput.vat = this.formData.value.vat;
    this.dataInput.dsGthau = this.dataLoadDetail;
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async save(isGuiDuyet?) {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    await this.spinner.show();
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
    this.setValidator(isGuiDuyet);
    this.helperService.markFormGroupTouched(this.formData);
    this.helperService.markFormGroupTouched(this.thongtinDieuchinhComponent.formData);
    if (this.formData.invalid || this.thongtinDieuchinhComponent.formData.invalid) {
      await this.spinner.hide();
      return;
    }
    if (isGuiDuyet && (this.fileDinhKemsTtr == null || this.fileDinhKemsTtr.length == 0)) {
      this.notification.error(MESSAGE.ERROR, 'File đính kèm tờ trình/công văn phương án điều chỉnh không được bỏ trống.');
      await this.spinner.hide();
      return;
    }
    if (isGuiDuyet && this.formData.get('trangThai').value == STATUS.DA_DUYET_LDV && (this.fileDinhKems == null || this.fileDinhKems.length == 0)) {
      this.notification.error(MESSAGE.ERROR, 'File đính kèm QĐ điều chỉnh đã ký và đóng dấu không được bỏ trống.');
      await this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    if (this.formData.value.soQdDc) {
      body.soQdDc = this.formData.value.soQdDc + this.maQd;
    }
    if (this.formData.value.soTtrDc) {
      body.soTtrDc = this.formData.value.soTtrDc + this.maTrinh;
    }
    body.dsGoiThau = this.dataInput.dsGoiThau;
    body.fileDinhKems = this.fileDinhKems;
    body.fileDinhKemsTtr = this.fileDinhKemsTtr;
    body.listCcPhapLy = this.listCcPhapLy;
    let res = null;
    if (this.formData.get("id").value) {
      res = await this.dieuChinhQuyetDinhPdKhlcntService.update(body);
    } else {
      res = await this.dieuChinhQuyetDinhPdKhlcntService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.get("id").setValue(res.data.id);
      this.id = res.data.id;
      if (isGuiDuyet) {
        this.guiDuyet();
      } else {
        if (this.formData.get("id").value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }


  setValidator(isGuiDuyet?) {
    if (!isGuiDuyet) {
      Object.keys(this.formData.controls).forEach(key => {
        const control = this.formData.controls[key];
        control.clearValidators();
        control.updateValueAndValidity();
      });
      this.formData.updateValueAndValidity();
      this.formData.controls["soQdGoc"].setValidators([Validators.required]);
      this.formData.controls["nam"].setValidators([Validators.required]);
    } else {
      if (this.formData.get('trangThai').value == this.STATUS.DA_LAP) {
        this.formData.controls["nam"].setValidators([Validators.required]);
        this.formData.controls["soTtrDc"].setValidators([Validators.required]);
        this.formData.controls["ngayQd"].setValidators([Validators.required]);
        this.formData.controls["soQdGoc"].setValidators([Validators.required]);
        this.formData.controls["lanDieuChinh"].setValidators([Validators.required]);
        this.formData.controls["kieuNx"].setValidators([Validators.required]);
        this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
        this.formData.controls["loaiVthh"].setValidators([Validators.required]);
        this.thongtinDieuchinhComponent.formData.controls["tenDuAn"].setValidators([Validators.required]);
        this.thongtinDieuchinhComponent.formData.controls["tongMucDtDx"].setValidators([Validators.required]);
        this.thongtinDieuchinhComponent.formData.controls["tgianThien"].setValidators([Validators.required]);
        this.thongtinDieuchinhComponent.formData.controls["hthucLcnt"].setValidators([Validators.required]);
        this.thongtinDieuchinhComponent.formData.controls["pthucLcnt"].setValidators([Validators.required]);
        this.thongtinDieuchinhComponent.formData.controls["loaiHdong"].setValidators([Validators.required]);
        this.thongtinDieuchinhComponent.formData.controls["tgianThienHd"].setValidators([Validators.required]);
      } else if (this.formData.get('trangThai').value == this.STATUS.DA_DUYET_LDV) {
        this.formData.controls["soQdDc"].setValidators([Validators.required]);
        this.formData.controls["ngayQdDc"].setValidators([Validators.required]);
        this.formData.controls["ngayHluc"].setValidators([Validators.required]);
      }
    }
  }

  onChangeLhNx($event) {
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu
      });
    }
  }

  setNewDanhsachDx($event) {
    this.dataInput.dsGoiThau = $event;
  }

  checkDisableQdDc() {
    if (this.isViewDetail) {
      return !(this.formData.get('trangThai').value == STATUS.DA_DUYET_LDV && this.userService.isAccessPermisson("NHDTQG_PTDT_DCKHLCNT_BANHANH_TUCHOI_TC"));
    }
    return this.isViewDetail;
  }

  async guiDuyet() {
    let trangThai = "";
    let mesg = "";
    // Vật tư
    switch (this.formData.get("trangThai").value) {
      case STATUS.DA_LAP: {
        trangThai = STATUS.CHO_DUYET_LDV;
        mesg = "Bạn có chắc chắn muốn gửi duyệt?";
        break;
      }
      case STATUS.TU_CHOI_LDV: {
        trangThai = STATUS.CHO_DUYET_LDV;
        mesg = "Bạn có chắc chắn muốn gửi duyệt?";
        break;
      }
      case STATUS.TU_CHOI_LDTC: {
        trangThai = STATUS.CHO_DUYET_LDV;
        mesg = "Bạn có chắc chắn muốn gửi duyệt?";
        break;
      }
      case STATUS.CHO_DUYET_LDV: {
        trangThai = STATUS.DA_DUYET_LDV;
        mesg = "Bạn có chắc chắn muốn phê duyệt?";
        break;
      }
      case STATUS.DA_DUYET_LDV: {
        trangThai = STATUS.BAN_HANH;
        mesg = "Bạn muốn ban hành quyết định?";
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: mesg,
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          let body = {
            id: this.formData.get("id").value,
            trangThai: trangThai
          };
          let res = await this.dieuChinhQuyetDinhPdKhlcntService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log("error: ", e);
          await this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  async tuChoi() {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    const modalTuChoi = this.modal.create({
      nzTitle: "TỪ CHỐI PHÊ DUYỆT",
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "900px",
      nzFooter: null,
      nzComponentParams: {}
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let trangThai = null;
          switch (this.formData.get("trangThai").value) {
            case STATUS.CHO_DUYET_LDV: {
              trangThai = STATUS.TU_CHOI_LDV
              break;
            }
            case STATUS.DA_DUYET_LDV: {
              trangThai = STATUS.TU_CHOI_LDTC
              break;
            }
          }
          let body = {
            id: this.formData.get("id").value,
            lyDo: text,
            trangThai: trangThai,
          };
          const res = await this.dieuChinhQuyetDinhPdKhlcntService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }
}
