import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Base2Component } from "../../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "../../../../../../services/danhmuc.service";
import {
  DanhSachDauThauService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service";
import { ChiTieuKeHoachNamCapTongCucService } from "../../../../../../services/chiTieuKeHoachNamCapTongCuc.service";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { MESSAGE } from "../../../../../../constants/message";
import { CanCuXacDinh, DanhSachGoiThau, FileDinhKem } from "../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import { DatePipe } from "@angular/common";
import { PREVIEW } from "../../../../../../constants/fileType";
import { DialogTuChoiComponent } from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import { STATUS } from "../../../../../../constants/status";
import { saveAs } from "file-saver";
import {
  DialogDanhSachHangHoaComponent
} from "../../../../../../components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component";
import {
  DialogThemMoiGoiThauComponent
} from "../../../../../../components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component";
import {CurrencyMaskInputMode} from "ngx-currency";

@Component({
  selector: "app-themmoi-kehoach-lcnt-vt",
  templateUrl: "./themmoi-kehoach-lcnt-vt.component.html",
  styleUrls: ["./themmoi-kehoach-lcnt-vt.component.scss"]
})
export class ThemmoiKehoachLcntVtComponent extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() showFromTH: boolean;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() soDx: string;
  @Output() showListEvent = new EventEmitter<any>();
  maTrinh: string = "";
  listNguonVon: any[] = [];
  listPhuongThucDauThau: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  listQuy: any[] = [];
  dataChiTieu: any;
  listOfData: any[] = [];
  baoGiaThiTruongList: CanCuXacDinh[] = [];
  canCuKhacList: CanCuXacDinh[] = [];
  addModelBaoGia: any = {
    moTa: "",
    tenTlieu: "",
    taiLieu: []
  };
  addModelCoSo: any = {
    moTa: "",
    taiLieu: []
  };
  editBaoGiaCache: { [key: string]: { edit: boolean; data: any } } = {};
  editCoSoCache: { [key: string]: { edit: boolean; data: any } } = {};
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 2,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }
  previewName: string = "de_xuat_kh_lcnt_vat_tu";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private dauThauService: DanhSachDauThauService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dauThauService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [""],
      tenDvi: [""],
      maDviLapDx: [""],
      tenDviLapDx: [""],
      loaiHinhNx: [""],
      kieuNx: [""],
      diaChiDvi: [],
      namKhoach: [dayjs().get("year")],
      soDxuat: [null],
      trichYeu: [null],
      ngayTao: [dayjs().format("YYYY-MM-DD")],
      ngayPduyet: [],
      soQd: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      moTaHangHoa: [],
      tchuanCluong: [null],
      tenDuAn: [null],
      loaiHdong: [null],
      hthucLcnt: [null],
      pthucLcnt: [null],
      tgianBdauTchuc: [null],
      tgianDthau: [null],
      tgianMthau: [null],
      gtriDthau: [null],
      gtriHdong: [null],
      donGiaVat: [],
      thueVat: [],
      tongMucDt: [null],
      tongMucDtDx: [null],
      nguonVon: ["NGV01"],
      dienGiai: [""],
      dienGiaiTongMucDt: [""],
      tgianNhang: [null],
      tgianThien: [null],
      ghiChu: [null],
      quyMo: [null],
      cviecDaTh: [null],
      cviecKhongTh: [null],
      ldoTuchoi: [],
      trangThai: ["00"],
      tenTrangThai: ["Dự Thảo"],
      diaDiemDuAn: [""],
      ykienThamGia: [""],
      tongMucDtBangChu: [""],
      tongSlChiTieu: [""],
      quy: [""],
      tgianThienHd: [""],
      soQdPdGiaCuThe: [""],
      ngayKyQdPdGiaCuThe: [""],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maTrinh = "/" + this.userInfo.MA_TR;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
    this.formData.get("loaiVthh").setValue(this.loaiVthhInput);
    await this.loadDanhMucHang();
    if (this.idInput > 0) {
      await this.getDetail(this.idInput, null);
    } else {
      if (this.soDx) {
        await this.getDetail(null, this.soDx);
      }
      this.initForm();
    }
    await Promise.all([
      this.loadDataComboBox(),
      this.getDataChiTieu()
    ]);
    this.initListQuy();
    await this.spinner.hide();
  }

  async loadDanhMucHang() {
    await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        const data = hangHoa.data.filter(item => item.ma == this.loaiVthhInput.slice(0, 2));
        this.formData.get("tenLoaiVthh").setValue(data[0].ten);
      }
    });
  }

  async getDetail(id?: number, soDx?: string) {
    if (id) {
      await this.dauThauService
        .getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataDetail = res.data;
            this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
            this.formData.patchValue({
              soDxuat: dataDetail.soDxuat?.split("/")[0],
              tgianBdauTchuc: dataDetail.tgianBdauTchuc
            });
            if (dataDetail) {
              this.fileDinhKem = dataDetail.fileDinhKems;
              this.listOfData = dataDetail.dsGtDtlList;
              this.bindingCanCu(dataDetail.ccXdgDtlList);
            }
          }
        })
        .catch((e) => {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    if (soDx) {
      var body = this.formData.value;
      body.soDxuat = soDx;
      await this.dauThauService
        .getDetailBySoDx(body)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataDetail = res.data;
            this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
            this.formData.patchValue({
              soDxuat: dataDetail.soDxuat?.split("/")[0]
            });
            if (dataDetail) {
              this.fileDinhKem = dataDetail.fileDinhKems;
              this.listOfData = dataDetail.dsGtDtlList;
              this.bindingCanCu(dataDetail.ccXdgDtlList);
            }
          }
        })
        .catch((e) => {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      tenDviLapDx: this.userInfo.TEN_PHONG_BAN + ' - ' + this.userInfo.TEN_DVI,
      maDviLapDx: this.userInfo.MA_PHONG_BAN,
      diaChiDvi: this.userInfo.DON_VI.diaChi
    });
  }

  async loadDataComboBox() {
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
  }

  initListQuy() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const quarters = [];

    for (let quarter = 1; quarter <= 4; quarter++) {
      if (this.formData.get('namKhoach').value < currentYear || (this.formData.get('namKhoach').value === currentYear && quarter <= Math.ceil((currentMonth + 1) / 3))) {
        quarters.push(quarter);
      }
    }
    this.listQuy = [];
    for (const element of quarters) {
      this.listQuy.push({ giaTri: "Quý " + element + "/" + this.formData.get("namKhoach").value, ma: element})
    }
  }
  disabledDate = (current: Date): boolean => {
    const startDate = new Date(this.formData.get("namKhoach").value, (this.formData.get("quy").value - 1) * 3, 1);
    const endDate = new Date(this.formData.get("namKhoach").value, this.formData.get("quy").value * 3, 0);
    return current < startDate || current > endDate;
  };

  onChangeQuy() {
    this.formData.get("tgianBdauTchuc").setValue(null);
  }
  async getDataChiTieu() {
    let res2 = await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachVtNam(
      +this.formData.get("namKhoach").value
    );
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
      this.formData.patchValue({
        soQd: this.dataChiTieu.soQuyetDinh
      });
    } else {
      this.dataChiTieu = null;
      this.formData.patchValue({
        soQd: null
      });
    }
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

  quayLai() {
    this.showListEvent.emit();
  }

  async preview() {
    this.reportTemplate.fileName = this.previewName + '.docx';
    let body = this.formData.value;
    body.reportTemplateRequest = this.reportTemplate;
    await this.dauThauService.previewVt(body).then(async s => {
      this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
      this.printSrc = s.data.pdfSrc;
      this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
      this.showDlgPreview = true;
    });
  }

  tuChoi() {
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
          let body = {
            id: this.idInput,
            lyDo: text,
            trangThai: ""
          };
          switch (this.formData.get("trangThai").value) {
            case STATUS.CHO_DUYET_TP: {
              body.trangThai = STATUS.TU_CHOI_TP;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              body.trangThai = STATUS.TU_CHOI_LDC;
              break;
            }
            case STATUS.CHO_DUYET_LDV: {
              body.trangThai = STATUS.TU_CHOI_LDV;
              break;
            }
          }
          const res = await this.dauThauService.approve(body);
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

  async guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn gửi duyệt?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.get("id").value,
            trangThai: ""
          };
          switch (this.formData.get("trangThai").value) {
            case STATUS.TU_CHOI_LDV:
            case STATUS.DU_THAO: {
              body.trangThai = STATUS.CHO_DUYET_LDV;
              break;
            }
            case STATUS.CHO_DUYET_LDV: {
              body.trangThai = STATUS.DA_DUYET_LDV;
              break;
            }
          }
          let res = await this.dauThauService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DUYET_SUCCESS);
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

  async save(isGuiDuyet?) {
    if (!this.isDetailPermission()) {
      return;
    }
    if (!isGuiDuyet) {
      this.clearValidatorLuuDuThao();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      if (this.formData.get("loaiVthh").value == null) {
        this.formData.get("loaiVthh").setValue(this.loaiVthhInput);
      }
      await this.luuVaGuiDuyet(isGuiDuyet);
    } else {
      this.setValidator();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      if (this.listOfData.length == 0) {
        this.notification.error(
          MESSAGE.ERROR,
          "Danh sách kế hoạch không được để trống"
        );
        return;
      }
      this.listOfData.forEach(item => {
        if (item.donGiaVat == null ) {
          this.notification.error(
            MESSAGE.ERROR,
            "Cần phải yêu cầu Vụ Kế hoạch phê duyệt giá cụ thể mua vật tư, thiết bị cho " + item.tenCloaiVthh + "!"
          );
          return;
        }
      })
      await this.luuVaGuiDuyet(isGuiDuyet);
    }
  }
  setValidator() {
    this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["kieuNx"].setValidators([Validators.required]);
    this.formData.controls["diaChiDvi"].setValidators([Validators.required]);
    this.formData.controls["soDxuat"].setValidators([Validators.required]);
    this.formData.controls["trichYeu"].setValidators([Validators.required]);
    this.formData.controls["ngayTao"].setValidators([Validators.required]);
    this.formData.controls["soQd"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenDuAn"].setValidators([Validators.required]);
    this.formData.controls["nguonVon"].setValidators([Validators.required]);
    this.formData.controls["tongMucDtDx"].setValidators([Validators.required]);
    this.formData.controls["tgianThien"].setValidators([Validators.required]);
    this.formData.controls["hthucLcnt"].setValidators([Validators.required]);
    this.formData.controls["pthucLcnt"].setValidators([Validators.required]);
    this.formData.controls["loaiHdong"].setValidators([Validators.required]);
    this.formData.controls["tgianThienHd"].setValidators([Validators.required]);
    this.formData.controls["quy"].setValidators([Validators.required]);
  }
  clearValidatorLuuDuThao() {
    Object.keys(this.formData.controls).forEach(key => {
      const control = this.formData.controls[key];
      control.clearValidators();
      control.updateValueAndValidity();
    });
    this.formData.updateValueAndValidity();
  }
  async luuVaGuiDuyet(isGuiDuyet) {
    let body = this.formData.value;
    if (this.formData.get("soDxuat").value) {
      body.soDxuat = this.formData.get("soDxuat").value + this.maTrinh;
    }
    body.fileDinhKemReq = this.fileDinhKem;
    body.dsGtReq = this.listOfData;
    body.ccXdgReq = [...this.baoGiaThiTruongList, ...this.canCuKhacList];
    let res = null;
    if (this.formData.value.tongMucDt > this.formData.value.tongMucDtDx) {
      await this.modal.confirm({
        nzClosable: false,
        nzTitle: "Xác nhận",
        nzContent: "Tổng giá trị gói thầu cao hơn Tổng mức đầu tư/dự toán. Bạn có muốn lưu không?",
        nzOkText: "Đồng ý",
        nzCancelText: "Không",
        nzOkDanger: true,
        nzWidth: 350,
        nzOnOk: async () => {
          this.spinner.show();
          if (this.formData.get("id").value) {
            res = await this.dauThauService.update(body);
          } else {
            res = await this.dauThauService.create(body);
          }
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              this.idInput = res.data.id;
              this.formData.get("id").setValue(res.data.id);
              await this.guiDuyet();
            } else {
              if (this.formData.get("id").value) {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
              } else {
                this.formData.get("id").setValue(res.data.id);
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              }
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        }
      });
    } else {
      this.spinner.show();
      if (this.formData.get("id").value) {
        res = await this.dauThauService.update(body);
      } else {
        res = await this.dauThauService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (isGuiDuyet) {
          this.idInput = res.data.id;
          await this.guiDuyet();
        } else {
          if (this.formData.get("id").value) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          } else {
            this.formData.get("id").setValue(res.data.id);
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    }
  }

  isDetailPermission() {
    if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_THEM")) {
      return true;
    }
    this.notification.error(MESSAGE.ERROR, "Bạn không có quyền truy cập chức năng này !");
    return false;
  }

  onChangeLhNx($event) {
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu
      });
    }
  }

  //TODO: khi nào chạy thật thì đóng disable năm kế hoạch
  async onChangeNamKh() {
    await this.getDataChiTieu();
    this.initListQuy();
  }

  selectHangHoa() {
    let data = this.loaiVthhInput;
    let bodyParamVatTu = {
      data,
      isCaseSpecial: true,
      onlyVatTu: true
    };
    const modalTuChoi = this.modal.create({
      nzTitle: "Danh sách hàng hóa",
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "900px",
      nzFooter: null,
      nzComponentParams: bodyParamVatTu
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          loaiVthh: data.ma,
          tenLoaiVthh: data.ten
        });
        let res = await this.danhMucService.getDetail(
          this.formData.get("loaiVthh").value
        );
        if (res.msg == MESSAGE.SUCCESS) {
          this.formData.patchValue({
            tchuanCluong: res.data ? res.data.tieuChuanCl : null
          });
        }
      }
    });
  }

  isDisbleForm(): boolean {
    if (this.formData.value.trangThai == STATUS.DU_THAO || this.formData.value.trangThai == STATUS.TU_CHOI_TP || this.formData.value.trangThai == STATUS.TU_CHOI_LDC) {
      return false;
    } else {
      return true;
    }
  }

  themMoiGoiThau($event: any, data?: DanhSachGoiThau, index?: number) {
    $event.stopPropagation();
    if (this.formData.get("loaiVthh").value == null || this.formData.get("loaiVthh").value == '02') {
      this.notification.error(MESSAGE.NOTIFICATION, "Vui lòng chọn loại hàng DTQG");
      return;
    }
    let listGoiThau = [];
    this.listOfData.forEach(item => {
      listGoiThau.push(item.goiThau);
    });
    let setListGoiThau = new Set(listGoiThau);
    listGoiThau = [...setListGoiThau];
    let isReadOnly = false;
    if (data != null) {
      isReadOnly = true;
    }
    const modal = this.modal.create({
      nzTitle: "THÔNG TIN GÓI THẦU",
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "1500px",
      nzFooter: null,
      nzClassName: "dialog-vat-tu",
      nzComponentParams: {
        trangThai: this.formData.get("trangThai").value,
        data: data,
        dataAll: this.listOfData,
        listGoiThau: listGoiThau,
        isReadOnly: isReadOnly,
        dataChiTieu: this.dataChiTieu,
        loaiVthh: this.formData.get("loaiVthh").value,
        dviTinh: this.formData.get("loaiVthh").value.maDviTinh,
        namKeHoach: this.formData.value.namKhoach
      }
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        let isUpdate = false;
        for (let i = 0; i < this.listOfData.length; i++) {
          if (this.listOfData[i].goiThau == res.goiThau) {
            this.listOfData[i] = res;
            isUpdate = true;
          }
        }
        if (!isUpdate) {
          this.listOfData.push(res);
        }
        let tongMucDt: number = 0;
        let tongSlChiTieu: number = 0;
        this.listOfData.forEach((item) => {
          tongMucDt = tongMucDt + (item.soLuong * item.donGiaVat / 1000000000);
          tongSlChiTieu += item.soLuongTheoChiTieu;
        });
        this.formData.patchValue({
          tongMucDt: parseFloat(tongMucDt.toFixed(2)),
          tongSlChiTieu: tongSlChiTieu,
          ngayKyQdPdGiaCuThe: res.ngayKyQdPdGiaCuThe,
          soQdPdGiaCuThe: res.soQdPdGiaCuThe,
          thueVat: res.vat
        });
      }
    });
  }

  deleteRow(i: number): void {
    this.listOfData = this.listOfData.filter((d, index) => index !== i);
  }

  calcTongSl() {
    if (this.listOfData) {
      let sum = 0;
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong;
          return prev;
        }, 0);
        sum += sumChild;
      });
      return sum;
    }
  }

  calcTongThanhTien() {
    if (this.listOfData) {
      let sum = 0;
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * item.donGiaVat;
          return prev;
        }, 0);
        sum += sumChild;
      });
      return sum;
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
  deleteTaiLieuDinhKemTag(data: any, id, type) {
    if (type == 'bao-gia') {
      if (id == 0) {
        this.addModelBaoGia.taiLieu = [];
        this.addModelBaoGia.children = [];
      } else if (id > 0) {
        this.editBaoGiaCache[id].data.taiLieu = [];
        this.editBaoGiaCache[id].data.children = [];
        this.checkDataExistBaoGia(this.editBaoGiaCache[id].data);
      }
    } else if (type == 'co-so') {
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
          data: { ...item },
        };
      });
    }
  }
  updatEditBaoGiaCache(): void {
    if (this.baoGiaThiTruongList && this.baoGiaThiTruongList.length > 0) {
      this.baoGiaThiTruongList.forEach((item) => {
        this.editBaoGiaCache[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }
  addBaoGia() {
    const taiLieuBaoGiaThiTruong = new CanCuXacDinh();
    taiLieuBaoGiaThiTruong.loaiCanCu = '00';
    taiLieuBaoGiaThiTruong.tenTlieu = this.addModelBaoGia.tenTlieu;
    taiLieuBaoGiaThiTruong.id = new Date().getTime() + 1;
    taiLieuBaoGiaThiTruong.children = this.addModelBaoGia.children;
    taiLieuBaoGiaThiTruong.taiLieu = this.addModelBaoGia.taiLieu;
    this.checkDataExistBaoGia(taiLieuBaoGiaThiTruong);
    this.clearBaoGia();
  }
  clearBaoGia() {
    this.addModelBaoGia = {
      tenTlieu: '',
      taiLieu: [],
      children: [],
    };
  }
  editRowBaoGia(id) {
    this.editBaoGiaCache[id].edit = true;
  }

  deleteRowBaoGia(data) {
    this.baoGiaThiTruongList = this.baoGiaThiTruongList.filter(
      (x) => x.id != data.id,
    );
  }
  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }

  cancelEditBaoGia(id: number): void {
    const index = this.baoGiaThiTruongList.findIndex((item) => item.id === id);
    this.editBaoGiaCache[id] = {
      data: { ...this.baoGiaThiTruongList[index] },
      edit: false,
    };
  }

  saveEditBaoGia(id: number): void {
    this.editBaoGiaCache[id].edit = false;
    this.checkDataExistBaoGia(this.editBaoGiaCache[id].data);
  }
  addCoSo() {
    const taiLieuCanCuKhac = new CanCuXacDinh();
    taiLieuCanCuKhac.loaiCanCu = '01';
    taiLieuCanCuKhac.tenTlieu = this.addModelCoSo.tenTlieu;
    taiLieuCanCuKhac.id = new Date().getTime() + 1;
    taiLieuCanCuKhac.children = this.addModelCoSo.children;
    taiLieuCanCuKhac.taiLieu = this.addModelCoSo.taiLieu;
    this.checkDataExistCoSo(taiLieuCanCuKhac);
    this.clearCoSo();
  }
  clearCoSo() {
    this.addModelCoSo = {
      tenTlieu: '',
      taiLieu: [],
      children: [],
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
      edit: false,
    };
  }

  saveEditCoSo(id: number): void {
    this.editCoSoCache[id].edit = false;
    this.checkDataExistCoSo(this.editCoSoCache[id].data);
  }

  async danhSachGthauTruot($event) {
    $event.stopPropagation();
    if (this.formData.value.loaiVthh == null || this.formData.value.loaiVthh == '02') {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn loại hàng DTQG.");
      return;
    }
    let body = {
      loaiVthh: this.formData.value.loaiVthh,
      cloaiVthh: this.formData.value.cloaiVthh,
      namKhoach: this.formData.value.namKhoach,
    }
    await this.dauThauService.danhSachGthauTruot(body).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listOfData = res.data
      }
    })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }
}
