import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { Base2Component } from "../../../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  QuyetDinhPheDuyetKeHoachLCNTService
} from "../../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service";
import { MESSAGE } from "../../../../../../../constants/message";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { DanhSachGoiThau } from "../../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {
  DialogThemMoiGoiThauComponent
} from "../../../../../../../components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component";
import { ChiTieuKeHoachNamCapTongCucService } from "../../../../../../../services/chiTieuKeHoachNamCapTongCuc.service";
import { FormGroup } from "@angular/forms";
import * as dayjs from "dayjs";
import { NzCollapsePanelComponent } from "ng-zorro-antd/collapse";
import {formatDate} from "@angular/common";
import {CurrencyMaskInputMode} from "ngx-currency";

@Component({
  selector: 'app-thongtin-dexuat-vt',
  templateUrl: './thongtin-dexuat-vt.component.html',
  styleUrls: ['./thongtin-dexuat-vt.component.scss']
})
export class ThongtinDexuatVtComponent extends Base2Component implements OnInit {
  @Input() title;
  @Input() titleDx;
  @Input() dataInput;
  @Input() isView: boolean = false;
  @Input() isCache: boolean = false;
  @Output() dsDxChange = new EventEmitter<any>();
  listNguonVon: any[] = [];
  listPhuongThucDauThau: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  listQuy: any[] = [];
  listOfData: any[] = [];
  listOfDataCache: any[] = [];
  dataChiTieu: any;
  formData: FormGroup
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
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKeHoachLCNTService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [""],
      tenDuAn: [null],
      tenDvi: [""],
      nguonVon: ["NGV01"],
      tongMucDt: [null],
      tongMucDtDx: [null],
      dienGiai: [""],
      dienGiaiTongMucDt: [""],
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
      tgianNhang: [null],
      tgianThien: [null],
      tgianThienHd: [null],
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
      soQdPdGiaCuThe: [""],
      ngayKyQdPdGiaCuThe: [""],
    });
  }
  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    if (changes) {
      if (this.dataInput) {
        this.helperService.bidingDataInFormGroup(this.formData, this.dataInput);
        this.formData.patchValue({
          ngayKyQdPdGiaCuThe: formatDate(this.dataInput.ngayKyQdPdGiaCuThe, "dd/MM/yyyy", 'en-US'),
        })
        this.listOfData = [...this.dataInput.dsGtDtlList];
        this.listOfDataCache = this.dataInput.dsGtDtlList;
        await this.getDataChiTieu();
        this.initListQuy();
      }
    }
    await this.spinner.hide()
  }
  async ngOnInit() {
    this.spinner.show();
    await this.loadDataComboBox();
    await this.spinner.hide();
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

  themMoiGoiThau($event: any, data?: DanhSachGoiThau, index?: number) {
    $event.stopPropagation();
    if (this.formData.get("loaiVthh").value == null) {
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
          tongSlChiTieu: tongSlChiTieu
        });
        this.dsDxChange.emit(this.listOfData);
      }
    });
  }

  deleteRow(i: number): void {
    this.listOfData = this.listOfData.filter((d, index) => index !== i);
    this.helperService.setIndexArray(this.listOfData);
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
}
