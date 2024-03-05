import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output, ViewChild
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { DanhSachGoiThau, FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { STATUS } from "../../../../../../constants/status";
import { cloneDeep } from "lodash";
import {
  DxuatKhLcntService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/dxuatKhLcnt.service";
import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DatePipe } from '@angular/common';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { saveAs } from "file-saver";
import {PREVIEW} from "../../../../../../constants/fileType";
import {ThongtinDexuatComponent} from "./thongtin-dexuat/thongtin-dexuat.component";
import printJS from "print-js";
import {QuyetDinhGiaTCDTNNService} from "../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
import {QuyetDinhGiaCuaBtcService} from "../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";
import {da} from "date-fns/locale";

@Component({
  selector: 'app-themmoi-quyetdinh-khlcnt',
  templateUrl: './themmoi-quyetdinh-khlcnt.component.html',
  styleUrls: ['./themmoi-quyetdinh-khlcnt.component.scss']
})
export class ThemmoiQuyetdinhKhlcntComponent implements OnInit {
  @ViewChild("thongtinDexuatComponent") thongtinDexuatComponent: ThongtinDexuatComponent;
  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() dataTongHop: any;
  @Input() isViewOnModal: boolean;
  @Input() checkPrice: any;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() isView: boolean;
  formData: FormGroup;
  formThongTinChung: FormGroup;
  fileDinhKemDtl: any[] = [];
  selectedCanCu: any = {};
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: "" };
  errorInputRequired: string = null;
  errorGhiChu: boolean = false;
  maQd: string = null;
  fileDinhKem: Array<FileDinhKem> = [];
  listFileDinhKem: any[] = [];
  listCcPhapLy: any[] = [];

  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listVatTuHangHoa: any[] = [];
  fileList: any[] = [];
  listDanhSachTongHop: any[] = [];
  listToTrinh: any[] = [];
  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-core/file/upload-attachment`;

  lastBreadcrumb: string;
  userInfo: UserLogin;

  danhMucDonVi: any;
  danhsachDx: any[] = [];
  danhsachDxCache: any[] = [];

  iconButtonDuyet: string;
  titleButtonDuyet: string;
  dataChiTieu: any;
  listNam: any[] = [];
  yearNow: number = 0;
  listOfData: any[] = [];
  STATUS = STATUS
  selected: boolean = false;

  dataInput: any;
  dataInputCache: any;
  isTongHop: boolean
  isCheckCreate: boolean = true
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  maDviSelected: any;
  reportTemplate: any = {
    typeFile: "",
    fileName: "qd_pd_kh_lcnt_luong_thuc.docx",
    tenBaoCao: "",
    trangThai: ""
  };
  showDlgPreview = false;
  pdfSrc: any;
  wordSrc: any;
  printSrc: any;
  constructor(
    private router: Router,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private dxuatKhlcntService: DxuatKhLcntService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    public userService: UserService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private dauThauService: DanhSachDauThauService,
    public globals: Globals,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      namKhoach: [dayjs().get('year'), Validators.required],
      soQd: ['',],
      ngayQd: ['',],
      ngayHluc: ['',],
      idThHdr: [''],
      idTrHdr: [''],
      soTrHdr: [''],
      trichYeu: [''],
      hthucLcnt: [''],
      pthucLcnt: [''],
      loaiHdong: [''],
      nguonVon: [''],
      tgianBdauTchuc: [''],
      tgianDthau: [''],
      tgianMthau: [''],
      tgianNhang: [''],
      ghiChu: [''],
      soQdCc: [''],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tchuanCluong: [''],
      tenTrangThai: ['Đang nhập dữ liệu'],
      ldoTuchoi: [''],
      phanLoai: ['', [Validators.required]],
      vat: ['5'],
      gtriDthau: [''],
      gtriHdong: [''],
      donGiaVat: [''],
      tongMucDt: [null,],
      dienGiai: [''],
      tenDvi: [''],
      tgianThien: [''],
      ykienThamGia: [''],
      loaiHinhNx: 'Mua đấu thầu',
      kieuNx: 'Nhập mua',
      chotDcGia: [''],
      quyetDinhDcGia: [''],
      quyetDinhDc: [''],
      ngayQuyetDinhDieuBDG: [''],
      soQuyetDinhDieuBDG: [''],
    })
  }

  setValidator(isGuiDuyet?) {
    if (isGuiDuyet) {
      this.formData.controls["soQd"].setValidators([Validators.required]);
      this.formData.controls["ngayQd"].setValidators([Validators.required]);
      // this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soQd"].clearValidators();
      this.formData.controls["ngayQd"].clearValidators();
      // this.formData.controls["ngayHluc"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'TH') {
      this.formData.controls["idThHdr"].setValidators([Validators.required]);
      this.formData.controls["idTrHdr"].clearValidators();
      this.formData.controls["soTrHdr"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'TTr') {
      this.formData.controls["idThHdr"].clearValidators();
      this.formData.controls["idTrHdr"].setValidators([Validators.required]);
      this.formData.controls["soTrHdr"].setValidators([Validators.required]);
    }
  }

  isValidate(data: any) {
    let shouldStop = false;
    data.forEach(item => {
      item.children.forEach(async res => {
        for (const elm of res.children) {
          if (elm.donGia == null) {
            this.notification.error(MESSAGE.ERROR, elm.tenDvi + " chưa được phê duyệt giá mua cụ thể.");
            shouldStop = true;
            continue;
          }
          let body = {
            loaiGia: "LG01",
            namKeHoach: this.formData.value.namKhoach,
            loaiVthh: item.loaiVthh,
            cloaiVthh: item.cloaiVthh,
            trangThai: STATUS.BAN_HANH,
            maDvi: elm.maDvi,
          }
          let res = await this.quyetDinhGiaCuaBtcService.getQdGiaLastestBtc(body);
          if (res.msg === MESSAGE.SUCCESS) {
            if (res.data && res.data.length > 0) {
              let data = res.data[0];
              if (data.giaQdDcBtcVat != null && data.giaQdDcBtcVat > 0) {
                elm.giaToiDa = data.giaQdDcBtcVat
              } else {
                elm.giaToiDa = data.giaQdBtcVat
              }
            }
          }
          if (elm.giaToiDa == null) {
            this.notification.error(MESSAGE.ERROR, elm.tenDvi + " chưa được phê duyệt giá mua tối đa.");
            shouldStop = true;
            continue;
          } else if (elm.donGiaTamTinh > elm.giaToiDa ) {
            this.notification.error(MESSAGE.ERROR, elm.tenDvi + ": Đơn giá đề xuất không được lớn hơn giá tối đa.");
            shouldStop = true;
            continue;
          }
          elm.children.forEach(i => {
            if (i.soLuong > res.soLuong) {
              this.notification.error(MESSAGE.ERROR, "Số lượng của Điểm kho không được lớn hơn số lượng gói thầu");
              shouldStop = true;
              return;
            }
          });
          if (shouldStop) {
            return;
          }
        }
        if (shouldStop) {
          return;
        }
      });
      if (shouldStop) {
        return;
      }
    });
    return !shouldStop;
  }


  isDetailPermission() {
    if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_QDLCNT_THEM")) {
      return true;
    }
    return false;
  }


  async ngOnInit() {
    await this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.maQd = this.userInfo.MA_QD;
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') + i,
          text: dayjs().get('year') + i,
        });
      }
      if (this.idInput) {
        await this.loadChiTiet(this.idInput)
      } else {
        this.initForm();
      }
      await Promise.all([
        this.loadDataComboBox(),
        this.bindingDataTongHop(this.dataTongHop),
      ]);
      // await this.getDataChiTieu()
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  initForm() {
    this.idInput = 0;
    this.formData.patchValue({
      namKhoach: dayjs().get('year'),
      phanLoai: this.loaiVthh == '02' ? 'TTr' : 'TH'
    })
  }

  async showFirstRow($event, dataGoiThau: any) {
    await this.showDetail($event, dataGoiThau);
  }

  async loadDataComboBox() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
    // phương thức đấu thầu
    this.listPhuongThucDauThau = [];
    let resPt = await this.danhMucService.danhMucChungGetAll('PT_DTHAU');
    if (resPt.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = resPt.data;
    }
    // hình thức đấu thầu
    this.listHinhThucDauThau = [];
    let resPtdt = await this.danhMucService.danhMucChungGetAll('HT_LCNT');
    if (resPtdt.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = resPtdt.data;
    }
    // hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('HINH_THUC_HOP_DONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
  }

  async bindingDataTongHop(dataTongHop?) {
    if (dataTongHop) {
      this.formData.patchValue({
        cloaiVthh: dataTongHop.cloaiVthh,
        tenCloaiVthh: dataTongHop.tenCloaiVthh,
        loaiVthh: dataTongHop.loaiVthh,
        tenLoaiVthh: dataTongHop.tenLoaiVthh,
        namKhoach: +dataTongHop.namKhoach,
        idThHdr: dataTongHop.id,
        tchuanCluong: dataTongHop.tchuanCluong,
        phanLoai: 'TH',
      })
      await this.listDsTongHopToTrinh();
      await this.selectMaTongHop(dataTongHop.id);
    }
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }


  async listDsTongHopToTrinh() {
    await this.spinner.show();
    // Get data tổng hợp
    let bodyTh = {
      trangThai: STATUS.CHUA_TAO_QD,
      namKhoach: this.formData.get('namKhoach').value,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resTh = await this.tongHopDeXuatKHLCNTService.search(bodyTh);
    if (resTh.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = resTh.data.content;
    }
    await this.spinner.hide();
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
    this.setValidator(isGuiDuyet)
    await this.setDonGiaVat();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      await this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maQd;
    }
    let pipe = new DatePipe('en-US');
    if (this.thongtinDexuatComponent.formData.value.tgianMthau != null) {
      if (this.thongtinDexuatComponent.formData.value.tgianMthauTime != null) {
        this.danhsachDx[this.index].tgianMthau = pipe.transform(this.thongtinDexuatComponent.formData.value.tgianMthau, 'yyyy-MM-dd') + " " + pipe.transform(this.thongtinDexuatComponent.formData.value.tgianMthauTime, 'HH:mm') + ":00"
      } else {
        this.danhsachDx[this.index].tgianMthau = pipe.transform(this.thongtinDexuatComponent.formData.value.tgianMthau, 'yyyy-MM-dd')  + " 00:00:00"
      }
    }
    if (this.thongtinDexuatComponent.formData.value.tgianDthau != null) {
      if (this.thongtinDexuatComponent.formData.value.tgianDthauTime != null) {
        this.danhsachDx[this.index].tgianDthau =  pipe.transform(this.thongtinDexuatComponent.formData.value.tgianDthau, 'yyyy-MM-dd') + " " + pipe.transform(this.thongtinDexuatComponent.formData.value.tgianDthauTime, 'HH:mm') + ":00"
      } else {
        this.danhsachDx[this.index].tgianDthau =  pipe.transform(this.thongtinDexuatComponent.formData.value.tgianDthau, 'yyyy-MM-dd') + " 23:59:59"
      }
    }
    if (this.thongtinDexuatComponent.formData.value.tgianMoHoSo != null) {
      if (this.thongtinDexuatComponent.formData.value.tgianMoHoSoTime != null) {
        this.danhsachDx[this.index].tgianMoHoSo = pipe.transform(this.thongtinDexuatComponent.formData.value.tgianMoHoSo, 'yyyy-MM-dd') + " " + pipe.transform(this.thongtinDexuatComponent.formData.value.tgianMoHoSoTime, 'HH:mm') + ":00"
      } else {
        this.danhsachDx[this.index].tgianMoHoSo =   pipe.transform(this.thongtinDexuatComponent.formData.value.tgianMoHoSo, 'yyyy-MM-dd') + " 23:59:59"
      }
    }
    this.danhsachDx[this.index].tgianBdauTchuc = this.thongtinDexuatComponent.formData.value.tgianBdauTchuc
    this.danhsachDx[this.index].tgianNhang = this.thongtinDexuatComponent.formData.value.tgianNhang
    this.danhsachDx[this.index].tongTien = this.thongtinDexuatComponent.formData.value.tongMucDtDx
    this.danhsachDx[this.index].children = this.thongtinDexuatComponent.listOfData;
    this.danhsachDx[this.index].tgianMthauTime = pipe.transform(this.thongtinDexuatComponent.formData.value.tgianMthauTime, 'yyyy-MM-dd HH:mm')
    this.danhsachDx[this.index].tgianDthauTime = pipe.transform(this.thongtinDexuatComponent.formData.value.tgianDthauTime, 'yyyy-MM-dd HH:mm')
    this.danhsachDx[this.index].tgianMoHoSoTime = pipe.transform(this.thongtinDexuatComponent.formData.value.tgianMoHoSoTime, 'yyyy-MM-dd HH:mm')
    this.danhsachDx[this.index].giaBanHoSo = this.thongtinDexuatComponent.formData.value.giaBanHoSo
    this.danhsachDx[this.index].fileDinhKem = this.thongtinDexuatComponent.fileDinhKems
    body.children = this.danhsachDx;
    body.fileDinhKems = this.listFileDinhKem;
    body.listCcPhapLy = this.listCcPhapLy;
    if (isGuiDuyet && !this.isValidate(body.children)) {
      await this.spinner.hide();
      return;
    }
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.quyetDinhPheDuyetKeHoachLCNTService.update(body);
    } else {
      res = await this.quyetDinhPheDuyetKeHoachLCNTService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.idInput = res.data.id;
        await this.guiDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.formData.get('id').setValue(res.data.id);
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
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        await this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDo: text,
            trangThai: STATUS.TU_CHOI_LDV,
          };
          const res = await this.quyetDinhPheDuyetKeHoachLCNTService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai()
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
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
    let trangThai = ''
    let mesg = ''
    // Vật tư
    switch (this.formData.get('trangThai').value) {
      case STATUS.DANG_NHAP_DU_LIEU: {
        trangThai = STATUS.BAN_HANH;
        mesg = 'Văn bản sẵn sàng ban hành ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mesg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          let body = {
            "id": this.idInput,
            "trangThai": trangThai
          }
          let res = await this.quyetDinhPheDuyetKeHoachLCNTService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          await this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(id);
      this.listToTrinh = [];
      this.listDanhSachTongHop = [];
      const data = res.data;
      this.listFileDinhKem = data.fileDinhKems;
      this.listCcPhapLy = data.listCcPhapLy;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        soQd: data.soQd?.split("/")[0],
        soQuyetDinhDieuBDG: data.qthtChotGiaInfoRes?.qthtDieuChinhKHLCNT?.soQuyetDinhDieuKHLCNT ?? null,
        ngayQuyetDinhDieuBDG: data.qthtChotGiaInfoRes?.qthtDieuChinhKHLCNT?.ngayQuyetDinhDieuKHLCNT ?? null,
        chotDcGia: !!data.qthtChotGiaInfoRes?.qthtChotDieuChinhGia?.length,
        quyetDinhDcGia: !!data.qthtChotGiaInfoRes?.qthtQuyetDinhChinhGia?.length,
        quyetDinhDc: !!(data.qthtChotGiaInfoRes?.qthtDieuChinhKHLCNT?.soQuyetDinhDieuKHLCNT && data.qthtChotGiaInfoRes?.qthtDieuChinhKHLCNT?.ngayQuyetDinhDieuKHLCNT),
      });
      if (!this.userService.isTongCuc()) {
        this.danhsachDx = data.children.filter(item => this.userInfo.MA_DVI.startsWith(item.maDvi));
      } else {
        this.danhsachDx = data.children;
      }
      this.danhsachDxCache = cloneDeep(this.danhsachDx);
      for (const item of this.danhsachDxCache) {
        await this.dauThauService.getDetail(item.idDxHdr).then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            item.children = res.data.dsGtDtlList;
          }
        })
      }
      this.showFirstRow(event, 0);
    };
  }

  async getDataChiTieu(id) {
    if (id > 0) {
      await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachNam(id).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.dataChiTieu = res.data;
        }
      }).catch((e) => {
        this.dataChiTieu = null;
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
    }
  }

  async openDialogTh() {
    if (this.formData.get('phanLoai').value != 'TH') {
      return;
    }
    await this.listDsTongHopToTrinh();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách tổng hợp đề xuất kế hoạch lựa chọn nhà thầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachTongHop,
        dataHeader: ['Số tổng hợp', 'Nội dung tổng hợp'],
        dataColumn: ['id', 'noiDung']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.selectMaTongHop(data.id);
      }
    });
  }

  async selectMaTongHop(event) {
    await this.spinner.show()
    if (event) {
      const res = await this.tongHopDeXuatKHLCNTService.getDetail(event)
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.formData.patchValue({
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tchuanCluong: data.tchuanCluong,
          loaiHdong: data.loaiHdong,
          pthucLcnt: data.pthucLcnt,
          hthucLcnt: data.hthucLcnt,
          nguonVon: data.nguonVon,
          soQdCc: data.soQdCc,
          idThHdr: event,
          idTrHdr: null,
          soTrHdr: null,
        })
        this.danhsachDx = data.hhDxKhLcntThopDtlList;
        for (const item of this.danhsachDx) {
          await this.dauThauService.getDetail(item.idDxHdr).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              item.children = res.data.dsGtDtlList;
              item.idChiTieuKhNam = res.data.idChiTieuKhNam;
            }
          })
        };
        this.danhsachDxCache = cloneDeep(this.danhsachDx);
        this.dataInput = null;
        this.dataInputCache = null;
        await this.showFirstRow(event, 0)
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide()
  }

  async openDialogTr() {
    if (this.formData.get('phanLoai').value != 'TTr') {
      return
    }
    await this.spinner.show();
    // Get data tờ trình
    let bodyToTrinh = {
      trangThai: this.loaiVthh == '02' ? STATUS.DA_DUYET_LDV : STATUS.DA_DUYET_LDC,
      trangThaiTh: STATUS.CHUA_TONG_HOP,
      namKh: this.formData.get('namKhoach').value,
      loaiVthh: this.loaiVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resToTrinh = await this.dauThauService.search(bodyToTrinh);
    if (resToTrinh.msg == MESSAGE.SUCCESS) {
      this.listToTrinh = resToTrinh.data.content;
    }
    await this.spinner.hide();


    const modalQD = this.modal.create({
      nzTitle: 'Danh sách đề xuất kế hoạch lựa chọn nhà thầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listToTrinh,
        dataHeader: ['Số tờ trình đề xuất', 'Loại hàng DTQG', 'Chủng loại hàng DTQG'],
        dataColumn: ['soDxuat', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeIdTrHdr(data);
      }
    });
  }

  async onChangeIdTrHdr(data) {
    await this.spinner.show();
    this.danhsachDx = [];
    if (data) {
      const res = await this.dxuatKhlcntService.getDetail(data.id)
      if (res.msg == MESSAGE.SUCCESS) {
        const dataRes = res.data;
        let tongMucDt = 0
        dataRes.idDxHdr = data.id;
        if (dataRes.dsGtDtlList) {
          dataRes.children = dataRes.dsGtDtlList
        }
        this.danhsachDx.push(dataRes);
        this.danhsachDx.forEach(dx => {
          let soLuong = 0
          let tongTien = 0
          dx.children.forEach(gt => {
            soLuong += gt.soLuong
            tongTien += gt.thanhTienDx
          })
          dx.soLuong = soLuong
          dx.tongTien = tongTien
        })
        this.formData.patchValue({
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tchuanCluong: data.tchuanCluong,
          loaiHdong: data.loaiHdong,
          pthucLcnt: data.pthucLcnt,
          hthucLcnt: data.hthucLcnt,
          nguonVon: data.nguonVon,
          soQdCc: data.soQd,
          trichYeu: dataRes.trichYeu,
          tgianBdauTchuc: data.tgianBdauTchuc,
          tgianMthau: data.tgianMthau,
          tgianDthau: data.tgianDthau,
          tgianThien: data.tgianThien,
          gtriDthau: data.gtriDthau,
          gtriHdong: data.gtriHdong,
          vat: 5,
          tenDvi: data.tenDvi,
          maDvi: data.maDvi,
          dienGiai: data.dienGiai,
          idThHdr: null,
          soTrHdr: dataRes.soDxuat,
          idTrHdr: dataRes.id,
          tongMucDt: tongMucDt,
          ghiChu: data.ghiChu,
          ykienThamGia: data.ykienThamGia,
        })
        this.danhsachDxCache = cloneDeep(this.danhsachDx);
        this.dataInput = null;
        this.dataInputCache = null;
        this.showFirstRow(event, 0);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide();
  }

  index = 0;
  async showDetail($event, index) {
    await this.spinner.show();
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow');
      this.maDviSelected = this.danhsachDx[index].maDvi
      this.isTongHop = this.formData.value.phanLoai == 'TH';
      this.dataInput = this.danhsachDx[index];
      this.dataInputCache = this.danhsachDxCache[index];
      this.fileDinhKemDtl = this.danhsachDx[index].fileDinhKem
      this.index = index;
      if (this.formData.get('id').value) {
        await this.getDataChiTieu(this.danhsachDx[index].dxuatKhLcntHdr?.idChiTieuKhNam)
      } else {
        await this.getDataChiTieu(this.danhsachDx[index].idChiTieuKhNam)
      }
      await this.spinner.hide();
    } else {
      this.selected = true
      this.isTongHop = this.formData.value.phanLoai == 'TH';
      this.dataInput = this.danhsachDx[0];
      this.dataInputCache = this.danhsachDxCache[0];
      this.index = 0;
      this.maDviSelected = this.danhsachDx[0].maDvi
      this.fileDinhKemDtl = this.danhsachDx[0].fileDinhKem
      if (this.formData.get('id').value) {
        await this.getDataChiTieu(this.danhsachDx[index].dxuatKhLcntHdr?.idChiTieuKhNam)
      } else {
        console.log(this.danhsachDx[index])
        await this.getDataChiTieu(this.danhsachDx[index].idChiTieuKhNam)
      }
      await this.spinner.hide();
    }
  }

  setNewSoLuong($event) {
    this.danhsachDx[this.index].soLuong = $event;
  }

  setNewDonGiaTamTinh($event) {
    this.danhsachDx[this.index].tongTien = $event;
  }

  setNewDanhsachDx($event) {

  }

  setNewData($event) {
    let pipe = new DatePipe('en-US');
    this.formData.get('tgianBdauTchuc').setValue($event.tgianBdauTchuc);
    this.formData.get('tgianMthau').setValue(pipe.transform($event.tgianMthau, 'yyyy-MM-dd HH:mm'));
    this.formData.get('tgianDthau').setValue(pipe.transform($event.tgianDthau, 'yyyy-MM-dd HH:mm'));
    this.formData.get('tgianNhang').setValue($event.tgianNhang);
    this.formData.get('gtriDthau').setValue($event.gtriDthau);
    // this.danhsachDx[this.index].tgianBdauTchuc = $event.tgianBdauTchuc;
    // this.danhsachDx[this.index].tgianMthau = $event.tgianMthau;
    // this.danhsachDx[this.index].tgianDthau = $event.tgianDthau;
    // this.danhsachDx[this.index].tgianNhang = $event.tgianNhang;
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  themMoiGoiThau(data?: any, index?: number) {
    if (!this.formData.get('loaiVthh').value) {
      this.notification.error(MESSAGE.NOTIFICATION, "Vui lòng chọn loại hàng hóa");
      return;
    }
    const modal = this.modal.create({
      nzTitle: 'Địa điểm nhập hàng',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1500px',
      nzFooter: null,
      nzComponentParams: {
        data: data,
        dataChiTieu: this.dataChiTieu,
        loaiVthh: this.formData.get('loaiVthh').value,
        dviTinh: this.formData.get('loaiVthh').value.maDviTinh,
        namKeHoach: this.formData.value.namKhoach,
      },
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        if (index >= 0) {
          this.danhsachDx[index] = res;
        } else {
          this.danhsachDx.push(res);
        }
        let tongMucDt: number = 0;
        this.danhsachDx.forEach((item) => {
          tongMucDt = tongMucDt + item.soLuong * item.donGiaTamTinh;
        });
        this.formData.patchValue({
          tongMucDt: tongMucDt,
        });
      }
    });
  }

  deleteRow(data: any) {
    for (let index = 0; index < this.danhsachDx.length; index++) {
      for (let y = 0; y < this.danhsachDx[index].children.length; y++) {
        for (let k = 0; k < this.danhsachDx[index].children[y].children.length; k++) {
          for (let q = 0; q < this.danhsachDx[index].children[y].children[k].children.length; q++) {
            if (this.danhsachDx[index].children[y].children[k].children[q].id == data.id) {
              this.danhsachDx[index].children[y].children[k].children = this.danhsachDx[index].children[y].children[k].children.filter(d => d.id !== data.id);
            }
          }
        }
      }
    }
  }

  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }


  expandSet3 = new Set<number>();
  onExpandChange3(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet3.add(id);
    } else {
      this.expandSet3.delete(id);
    }
  }

  async preview() {
    let body = this.formData.value;
    body.reportTemplateRequest = this.reportTemplate;
    await this.quyetDinhPheDuyetKeHoachLCNTService.preview(body).then(async s => {
      this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
      this.printSrc = s.data.pdfSrc;
      this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
      this.showDlgPreview = true;
    });
  }
  downloadPdf() {
    saveAs(this.pdfSrc, "qd_pd_kh_lcnt_luong_thuc.pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, "qd_pd_kh_lcnt_luong_thuc.docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview(){
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }

  async setDonGiaVat() {
    for (const dx of this.danhsachDx) {
      for (const gthau of dx.children) {
        for (const chiCuc of gthau.children) {
          if (chiCuc.donGia == null) {
            let bodyPag = {
              namKeHoach: this.formData.value.namKhoach,
              loaiVthh: gthau.loaiVthh,
              cloaiVthh: gthau.cloaiVthh,
              trangThai: STATUS.BAN_HANH,
              maDvi: chiCuc.maDvi,
              loaiGia: 'LG03'
            }
            let pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag)
            if (pag.msg == MESSAGE.SUCCESS && pag.data.length > 0) {
              const data = pag.data[0];
              let donGiaVatQd = 0;
              if (data != null && data.giaQdDcTcdtVat != null && data.giaQdDcTcdtVat > 0) {
                donGiaVatQd = data.giaQdDcTcdtVat
              } else {
                donGiaVatQd = data.giaQdTcdtVat
              }
              chiCuc.donGia = donGiaVatQd
            } else {
              chiCuc.donGia = null
            }
          }
        }
      }
    }

  }
}
