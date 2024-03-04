import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { CanCuXacDinh, FileDinhKem } from "../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import { UserLogin } from "../../../../../../models/userlogin";
import { NzModalService } from "ng-zorro-antd/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { DanhMucService } from "../../../../../../services/danhmuc.service";
import {
  DxuatKhLcntService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/dxuatKhLcnt.service";
import {
  QuyetDinhPheDuyetKeHoachLCNTService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service";
import { ChiTieuKeHoachNamCapTongCucService } from "../../../../../../services/chiTieuKeHoachNamCapTongCuc.service";
import {
  TongHopDeXuatKHLCNTService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service";
import { UserService } from "../../../../../../services/user.service";
import {
  DanhSachDauThauService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service";
import { Globals } from "../../../../../../shared/globals";
import * as dayjs from "dayjs";
import { MESSAGE } from "../../../../../../constants/message";
import { DialogTuChoiComponent } from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { saveAs } from "file-saver";
import { STATUS } from "../../../../../../constants/status";
import { Base2Component } from "../../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../services/storage.service";
import { ThongtinDexuatVtComponent } from "./thongtin-dexuat-vt/thongtin-dexuat-vt.component";
import { cloneDeep } from 'lodash';
import { PREVIEW } from "../../../../../../constants/fileType";

@Component({
  selector: "app-themmoi-quyetdinh-khlcnt-vt",
  templateUrl: "./themmoi-quyetdinh-khlcnt-vt.component.html",
  styleUrls: ["./themmoi-quyetdinh-khlcnt-vt.component.scss"]
})
export class ThemmoiQuyetdinhKhlcntVtComponent extends Base2Component implements OnInit {

  @ViewChild("thongtinDexuatVtComponent") thongtinDexuatVtComponent: ThongtinDexuatVtComponent;
  @Input() loaiVthh: string;
  @Input() idInput: number = 0;
  @Input() dataTongHop: any;
  @Input() isViewOnModal: boolean;
  @Input() checkPrice: any;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() isView: boolean;
  formData: FormGroup;
  maQd: string = null;
  fileDinhKem: Array<FileDinhKem> = [];
  fileDinhKems: any[] = [];
  listCcPhapLy: any[] = [];
  listToTrinh: any[] = [];
  userInfo: UserLogin;
  listNam: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];


  STATUS = STATUS;
  selected: boolean = false;

  dataInput: any;
  dataInputCache: any;
  dataLoadDetail: any;
  isTongHop: boolean;
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  maDviSelected: any;
  baoGiaThiTruongList: CanCuXacDinh[] = [];
  canCuKhacList: CanCuXacDinh[] = [];
  editBaoGiaCache: { [key: string]: { edit: boolean; data: any } } = {};
  editCoSoCache: { [key: string]: { edit: boolean; data: any } } = {};
  addModelBaoGia: any = {
    moTa: "",
    tenTlieu: "",
    taiLieu: []
  };
  addModelCoSo: any = {
    moTa: "",
    taiLieu: []
  };
  previewName: string = "qd_pd_kh_lcnt_vat_tu";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private dxuatKhlcntService: DxuatKhLcntService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    public userService: UserService,
    private dauThauService: DanhSachDauThauService,
    public globals: Globals
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKeHoachLCNTService);
    this.formData = this.fb.group({
      id: [null],
      namKhoach: [dayjs().get("year"), Validators.required],
      soQd: [""],
      ngayQd: [""],
      // ngayHluc: [""],
      idTrHdr: [""],
      soTrHdr: [""],
      trichYeu: [""],
      noiDungQd: [""],
      loaiHinhNx: [""],
      kieuNx: [""],
      soQdCc: [""],
      loaiVthh: ["", [Validators.required]],
      tenLoaiVthh: ["", [Validators.required]],
      tchuanCluong: [""],
      ykienThamGia: [""],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ["Đang nhập dữ liệu"],
      tgianThienHd: [null],
      tenDuAn: [""],
      dienGiaiTongMucDt: [""],
      quyMo: [""],
      tongMucDtDx: [null],

      hthucLcnt: [""],
      pthucLcnt: [""],
      loaiHdong: [""],
      nguonVon: [""],
      tgianBdauTchuc: [""],
      tgianDthau: [""],
      tgianMthau: [""],
      tgianNhang: [""],
      ghiChu: [""],
      cloaiVthh: [""],
      tenCloaiVthh: [""],
      moTaHangHoa: [""],
      ldoTuchoi: [""],
      vat: ["5"],
      gtriDthau: [""],
      gtriHdong: [""],
      donGiaVat: [""],
      tongMucDt: [null],
      dienGiai: [""],
      tenDvi: [""],
      tgianThien: [""]
    });
  }

  setValidator(isGuiDuyet?) {
    if (isGuiDuyet) {
      this.formData.controls["namKhoach"].setValidators([Validators.required]);
      this.formData.controls["soTrHdr"].setValidators([Validators.required]);
      this.formData.controls["soQd"].setValidators([Validators.required]);
      this.formData.controls["ngayQd"].setValidators([Validators.required]);
      // this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["namKhoach"].clearValidators();
      this.formData.controls["soTrHdr"].clearValidators();
      this.formData.controls["soQd"].clearValidators();
      this.formData.controls["ngayQd"].clearValidators();
      // this.formData.controls["ngayHluc"].clearValidators();
    }
  }

  isDetailPermission() {
    return this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_QDLCNT_THEM");
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.maQd = this.userInfo.MA_QD;
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get("year") + i,
          text: dayjs().get("year") + i
        });
      }
      if (this.idInput) {
        await this.loadChiTiet(this.idInput);
      } else {
        this.initForm();
      }
      await Promise.all([
        this.loadDataComboBox()
      ]);
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  initForm() {
    this.idInput = 0;
    this.formData.patchValue({
      namKhoach: dayjs().get("year"),
    });
  }

  async loadDataComboBox() {
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
  }

  onChangeLhNx($event) {
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu
      });
    }
  }

  async save(isGuiDuyet?) {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    await this.spinner.show();
    if (!this.isDetailPermission()) {
      return;
    }
    this.setValidator(isGuiDuyet);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      await this.spinner.hide();
      return;
    }
    if (isGuiDuyet && this.fileDinhKems && this.fileDinhKems.length == 0) {
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, "File đính kèm quyết định đã ký và đóng dấu không được bỏ trống.");
      return;
    }
    let childBody = this.thongtinDexuatVtComponent.formData.value;
    this.formData.patchValue({
      tenDuAn: childBody.tenDuAn,
      tongMucDtDx: childBody.tongMucDtDx,
      tongMucDt: childBody.tongMucDt,
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
    body.dsGoiThau = this.dataInput.dsGtDtlList;
    body.fileDinhKems = this.fileDinhKems;
    body.listCcPhapLy = this.listCcPhapLy;
    let res = null;
    if (this.formData.get("id").value) {
      res = await this.quyetDinhPheDuyetKeHoachLCNTService.update(body);
    } else {
      res = await this.quyetDinhPheDuyetKeHoachLCNTService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.idInput = res.data.id;
        this.guiDuyet();
      } else {
        if (this.formData.get("id").value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.formData.get("id").setValue(res.data.id);
          this.idInput = res.data.id;
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  convertDateToString(event: any): string {
    let result = "";
    if (event) {
      result = dayjs(event).format("DD/MM/YYYY").toString();
    }
    return result;
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: "Từ chối",
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "900px",
      nzFooter: null,
      nzComponentParams: {}
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        await this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDo: text,
            trangThai: STATUS.TU_CHOI_LDV
          };
          const res = await this.quyetDinhPheDuyetKeHoachLCNTService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
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

  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    let trangThai = "";
    let mesg = "";
    // Vật tư
    switch (this.formData.get("trangThai").value) {
      case STATUS.DANG_NHAP_DU_LIEU: {
        trangThai = STATUS.BAN_HANH;
        mesg = "Văn bản sẵn sàng ban hành ?";
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
            "id": this.idInput,
            "trangThai": trangThai
          };
          let res = await this.quyetDinhPheDuyetKeHoachLCNTService.approve(body);
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

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(id);
      const data = res.data;
      this.fileDinhKems = data.fileDinhKems;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        soQd: data.soQd?.split("/")[0],
        soQuyetDinhDieuBDG: data.qthtChotGiaInfoRes?.qthtDieuChinhKHLCNT?.soQuyetDinhDieuKHLCNT ?? null,
        ngayQuyetDinhDieuBDG: data.qthtChotGiaInfoRes?.qthtDieuChinhKHLCNT?.ngayQuyetDinhDieuKHLCNT ?? null,
        chotDcGia: !!data.qthtChotGiaInfoRes?.qthtChotDieuChinhGia?.length,
        quyetDinhDcGia: !!data.qthtChotGiaInfoRes?.qthtQuyetDinhChinhGia?.length,
        quyetDinhDc: !!(data.qthtChotGiaInfoRes?.qthtDieuChinhKHLCNT?.soQuyetDinhDieuKHLCNT && data.qthtChotGiaInfoRes?.qthtDieuChinhKHLCNT?.ngayQuyetDinhDieuKHLCNT),
      });
      this.dataLoadDetail = data.dsGthau;
      await this.onChangeIdTrHdr(data.idTrHdr, true)
      this.listCcPhapLy = data.listCcPhapLy;
    }
  }

  initDataInput() {
    this.dataInput.tenDuAn = this.formData.value.tenDuAn;
    this.dataInput.tongMucDtDx = this.formData.value.tongMucDtDx;
    this.dataInput.dienGiaiTongMucDt = this.formData.value.dienGiaiTongMucDt;
    this.dataInput.tongMucDt = this.formData.value.tongMucDt;
    this.dataInput.tgianThien = this.formData.value.tgianThien;
    this.dataInput.quyMo = this.formData.value.quyMo;
    this.dataInput.hthucLcnt = this.formData.value.hthucLcnt;
    this.dataInput.pthucLcnt = this.formData.value.pthucLcnt;
    this.dataInput.tgianBdauTchuc = this.formData.value.tgianBdauTchuc;
    this.dataInput.loaiHdong = this.formData.value.loaiHdong;
    this.dataInput.tgianThienHd = this.formData.value.tgianThienHd;
    this.dataInput.dienGiai = this.formData.value.dienGiai;
    this.dataInput.vat = this.formData.value.vat;
    this.dataInput.dsGtDtlList = this.dataLoadDetail;
  }

  async openDialogTr() {
    await this.spinner.show();
    // Get data tờ trình
    let bodyToTrinh = {
      trangThai: STATUS.DA_DUYET_LDV,
      namKh: this.formData.get("namKhoach").value,
      loaiVthh: this.loaiVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      }
    };
    let resToTrinh = await this.dauThauService.search(bodyToTrinh);
    if (resToTrinh.msg == MESSAGE.SUCCESS) {
      this.listToTrinh = resToTrinh.data.content.filter(x => x.trangThaiTh == null);
    }
    await this.spinner.hide();


    const modalQD = this.modal.create({
      nzTitle: "Danh sách đề xuất kế hoạch lựa chọn nhà thầu",
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "900px",
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listToTrinh,
        dataHeader: ["Số tờ trình đề xuất", "Loại hàng DTQG", "Chủng loại hàng DTQG"],
        dataColumn: ["soDxuat", "tenLoaiVthh", "tenCloaiVthh"]
      }
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeIdTrHdr(data.id, false);
      }
    });
  }

  async onChangeIdTrHdr(id, isInit?: boolean) {
    await this.spinner.show();
    if (id > 0) {
      const res = await this.dxuatKhlcntService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        this.dataInputCache = cloneDeep(res.data);
        this.dataInput = cloneDeep(res.data);
        if (isInit) {
          this.initDataInput();
        }
        this.formData.patchValue({
          loaiHinhNx: res.data.loaiHinhNx,
          kieuNx: res.data.kieuNx,
          loaiVthh: res.data.loaiVthh,
          tenLoaiVthh: res.data.tenLoaiVthh,
          tchuanCluong: res.data.tchuanCluong,
          ykienThamGia: res.data.ykienThamGia,
          soTrHdr: res.data.soDxuat,
          idTrHdr: res.data.id,
          soQdCc: res.data.soQd,
        });
        this.baoGiaThiTruongList = [];
        this.canCuKhacList = [];
        this.bindingCanCu(res.data.ccXdgDtlList);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide();
  }

  bindingCanCu(data) {
    if (data && data.length > 0) {
      data.forEach((chiTiet) => {
        if (chiTiet.loaiCanCu == "00") {
          this.baoGiaThiTruongList = [...this.baoGiaThiTruongList, chiTiet];
        } else if (chiTiet.loaiCanCu == "01") {
          this.canCuKhacList = [...this.canCuKhacList, chiTiet];
        }
      });
    }
  }

  setNewDanhsachDx($event) {
    this.dataInput.dsGtDtlList = $event;
  }

  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  deleteTaiLieuDinhKemTag(data: any, id, type) {
    if (type == "bao-gia") {
      if (id == 0) {
        this.addModelBaoGia.taiLieu = [];
        this.addModelBaoGia.children = [];
      } else if (id > 0) {
        this.editBaoGiaCache[id].data.taiLieu = [];
        this.editBaoGiaCache[id].data.children = [];
        this.checkDataExistBaoGia(this.editBaoGiaCache[id].data);
      }
    } else if (type == "co-so") {
      if (id == 0) {
        this.addModelCoSo.taiLieu = [];
        this.addModelCoSo.children = [];
      } else if (id > 0) {
        this.editCoSoCache[id].data.taiLieu = [];
        this.editCoSoCache[id].data.children = [];
        this.checkDataExistCoSo(this.editCoSoCache[id].data);
      }
    }
  }

  openFile(event, id, type) {
    let item = {
      id: new Date().getTime(),
      text: event.name
    };
    this.uploadFileService
      .uploadFile(event.file, event.name)
      .then((resUpload) => {
        const fileDinhKem = new FileDinhKem();
        fileDinhKem.fileName = resUpload.filename;
        fileDinhKem.fileSize = resUpload.size;
        fileDinhKem.fileUrl = resUpload.url;
        const lastPeriodIndex = resUpload.filename.lastIndexOf(".");
        let fileName = "";
        if (lastPeriodIndex !== -1) {
          fileName = resUpload.filename.slice(0, lastPeriodIndex);
        } else {
          fileName = resUpload.filename;
        }
        fileDinhKem.noiDung = fileName;
        if (type == "bao-gia") {
          if (id == 0) {
            if (this.addModelBaoGia.tenTlieu == null || this.addModelBaoGia.tenTlieu == "") {
              this.addModelBaoGia.tenTlieu = fileName;
            }
            this.addModelBaoGia.taiLieu = [];
            this.addModelBaoGia.taiLieu = [
              ...this.addModelBaoGia.taiLieu,
              item
            ];
            this.addModelBaoGia.children = [];
            this.addModelBaoGia.children = [
              ...this.addModelBaoGia.children,
              fileDinhKem
            ];
          } else if (id > 0) {
            if (this.editBaoGiaCache[id].data.tenTlieu == null || this.editBaoGiaCache[id].data.tenTlieu == "") {
              this.editBaoGiaCache[id].data.tenTlieu = fileName;
            }
            this.editBaoGiaCache[id].data.taiLieu = [];
            this.editBaoGiaCache[id].data.taiLieu = [
              ...this.editBaoGiaCache[id]?.data?.taiLieu,
              item
            ];
            this.editBaoGiaCache[id].data.children = [];
            this.editBaoGiaCache[id].data.children = [
              ...this.editBaoGiaCache[id].data.children,
              fileDinhKem
            ];
          }
        } else if (type == "co-so") {
          if (id == 0) {
            if (this.addModelCoSo.tenTlieu == null || this.addModelCoSo.tenTlieu == "") {
              this.addModelCoSo.tenTlieu = fileName;
            }
            this.addModelCoSo.taiLieu = [];
            this.addModelCoSo.taiLieu = [...this.addModelCoSo.taiLieu, item];
            this.addModelCoSo.children = [];
            this.addModelCoSo.children = [
              ...this.addModelCoSo.children,
              fileDinhKem
            ];
          } else if (id > 0) {
            if (this.editCoSoCache[id].data.tenTlieu == null || this.editBaoGiaCache[id].data.tenTlieu == "") {
              this.editCoSoCache[id].data.tenTlieu = fileName;
            }
            this.editCoSoCache[id].data.taiLieu = [];
            this.editCoSoCache[id].data.taiLieu = [
              ...this.editCoSoCache[id]?.data?.taiLieu,
              item
            ];
            this.editCoSoCache[id].data.children = [];
            this.editCoSoCache[id].data.children = [
              ...this.editCoSoCache[id].data.children,
              fileDinhKem
            ];
          }
        }
      });
  }

  checkDataExistBaoGia(data) {
    if (this.baoGiaThiTruongList && this.baoGiaThiTruongList.length > 0) {
      let index = this.baoGiaThiTruongList.findIndex((x) => x.id == data.id);
      if (index != -1) {
        this.baoGiaThiTruongList.splice(index, 1);
      }
    } else {
      this.baoGiaThiTruongList = [];
    }
    this.baoGiaThiTruongList = [...this.baoGiaThiTruongList, data];
    this.updatEditBaoGiaCache();
  }

  checkDataExistCoSo(data) {
    if (this.canCuKhacList && this.canCuKhacList.length > 0) {
      let index = this.canCuKhacList.findIndex((x) => x.id == data.id);
      if (index != -1) {
        this.canCuKhacList.splice(index, 1);
      }
    } else {
      this.canCuKhacList = [];
    }
    this.canCuKhacList = [...this.canCuKhacList, data];
    this.updatEditCoSoCache();
  }

  updatEditCoSoCache(): void {
    if (this.canCuKhacList && this.canCuKhacList.length > 0) {
      this.canCuKhacList.forEach((item) => {
        this.editCoSoCache[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }

  updatEditBaoGiaCache(): void {
    if (this.baoGiaThiTruongList && this.baoGiaThiTruongList.length > 0) {
      this.baoGiaThiTruongList.forEach((item) => {
        this.editBaoGiaCache[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }

  addBaoGia() {
    const taiLieuBaoGiaThiTruong = new CanCuXacDinh();
    taiLieuBaoGiaThiTruong.loaiCanCu = "00";
    taiLieuBaoGiaThiTruong.tenTlieu = this.addModelBaoGia.tenTlieu;
    taiLieuBaoGiaThiTruong.id = new Date().getTime() + 1;
    taiLieuBaoGiaThiTruong.children = this.addModelBaoGia.children;
    taiLieuBaoGiaThiTruong.taiLieu = this.addModelBaoGia.taiLieu;
    this.checkDataExistBaoGia(taiLieuBaoGiaThiTruong);
    this.clearBaoGia();
  }

  clearBaoGia() {
    this.addModelBaoGia = {
      tenTlieu: "",
      taiLieu: [],
      children: []
    };
  }

  editRowBaoGia(id) {
    this.editBaoGiaCache[id].edit = true;
  }

  deleteRowBaoGia(data) {
    this.baoGiaThiTruongList = this.baoGiaThiTruongList.filter(
      (x) => x.id != data.id
    );
  }

  cancelEditBaoGia(id: number): void {
    const index = this.baoGiaThiTruongList.findIndex((item) => item.id === id);
    this.editBaoGiaCache[id] = {
      data: { ...this.baoGiaThiTruongList[index] },
      edit: false
    };
  }

  saveEditBaoGia(id: number): void {
    this.editBaoGiaCache[id].edit = false;
    this.checkDataExistBaoGia(this.editBaoGiaCache[id].data);
  }

  addCoSo() {
    const taiLieuCanCuKhac = new CanCuXacDinh();
    taiLieuCanCuKhac.loaiCanCu = "01";
    taiLieuCanCuKhac.tenTlieu = this.addModelCoSo.tenTlieu;
    taiLieuCanCuKhac.id = new Date().getTime() + 1;
    taiLieuCanCuKhac.children = this.addModelCoSo.children;
    taiLieuCanCuKhac.taiLieu = this.addModelCoSo.taiLieu;
    this.checkDataExistCoSo(taiLieuCanCuKhac);
    this.clearCoSo();
  }

  clearCoSo() {
    this.addModelCoSo = {
      tenTlieu: "",
      taiLieu: [],
      children: []
    };
  }

  editRowCoSo(id) {
    this.editCoSoCache[id].edit = true;
  }

  deleteRowCoSo(data) {
    this.canCuKhacList = this.canCuKhacList.filter((x) => x.id != data.id);
  }

  cancelEditCoSo(id: number): void {
    const index = this.canCuKhacList.findIndex((item) => item.id === id);
    this.editCoSoCache[id] = {
      data: { ...this.canCuKhacList[index] },
      edit: false
    };
  }

  saveEditCoSo(id: number): void {
    this.editCoSoCache[id].edit = false;
    this.checkDataExistCoSo(this.editCoSoCache[id].data);
  }

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }
}
