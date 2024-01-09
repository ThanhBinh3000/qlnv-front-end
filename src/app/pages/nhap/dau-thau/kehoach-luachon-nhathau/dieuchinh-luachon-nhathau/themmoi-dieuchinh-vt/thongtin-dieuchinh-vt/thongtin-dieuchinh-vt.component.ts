import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from "@angular/core";
import { Base2Component } from "../../../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  QuyetDinhPheDuyetKeHoachLCNTService
} from "../../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service";
import {
  DieuChinhQuyetDinhPdKhlcntService
} from "../../../../../../../services/qlnv-hang/nhap-hang/dau-thau/dieuchinh-khlcnt/dieuChinhQuyetDinhPdKhlcnt.service";
import { ChiTieuKeHoachNamCapTongCucService } from "../../../../../../../services/chiTieuKeHoachNamCapTongCuc.service";
import { MESSAGE } from "../../../../../../../constants/message";
import * as dayjs from "dayjs";
import { DanhSachGoiThau } from "../../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {
  DialogThemMoiGoiThauComponent
} from "../../../../../../../components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-thongtin-dieuchinh-vt',
  templateUrl: './thongtin-dieuchinh-vt.component.html',
  styleUrls: ['./thongtin-dieuchinh-vt.component.scss']
})
export class ThongtinDieuchinhVtComponent extends Base2Component implements OnInit {
  @Input() listNguonVon: any[] = [];
  @Input() listPhuongThucDauThau: any[] = [];
  @Input() listHinhThucDauThau: any[] = [];
  @Input() listLoaiHopDong: any[] = [];
  @Input() title;
  @Input() titleDx;
  @Input() dataInput;
  @Input() isView: boolean = false;
  @Input() isCache: boolean = false;
  @Input() isQd: boolean = false;
  @Output() dsDxChange = new EventEmitter<any>();
  listOfData: any[] = [];
  listOfDataCache: any[] = [];
  listQuy: any[] = [];
  dataChiTieu: any;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private dieuChinhQuyetDinhPdKhlcntService: DieuChinhQuyetDinhPdKhlcntService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dieuChinhQuyetDinhPdKhlcntService);
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
      vat: ["5"],
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

  ngOnInit(): void {
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    if (changes) {
      if (this.dataInput) {
        this.helperService.bidingDataInFormGroup(this.formData, this.dataInput);
        this.formData.patchValue({
          nguonVon: this.dataInput.dxKhlcntHdr.nguonVon,
          cviecDaTh: this.dataInput.dxKhlcntHdr.cviecDaTh,
          cviecKhongTh: this.dataInput.dxKhlcntHdr.cviecKhongTh,
          quy: this.dataInput.dxKhlcntHdr.quy,
          tongMucDt: this.dataInput.dxKhlcntHdr.tongMucDt,
          soQdPdGiaCuThe: this.dataInput.dxKhlcntHdr.soQdPdGiaCuThe,
          ngayKyQdPdGiaCuThe: formatDate(this.dataInput.dxKhlcntHdr.ngayKyQdPdGiaCuThe, "dd/MM/yyyy", 'en-US'),
        })
        this.listOfData = [...this.dataInput.dsGthau];
        this.listOfDataCache = [...this.dataInput.dsGthau];
        this.dsDxChange.emit(this.listOfData);
        await this.getDataChiTieu();
        this.initListQuy();
        this.tinhTongMucDauTu();
      }
    }
    await this.spinner.hide()
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

  disabledDate = (current: Date): boolean => {
    const startDate = new Date(this.formData.get("namKhoach").value, (this.formData.get("quy").value - 1) * 3, 1);
    const endDate = new Date(this.formData.get("namKhoach").value, this.formData.get("quy").value * 3, 0);
    return current < startDate || current > endDate;
  };

  themMoiGoiThau($event: any, data?: DanhSachGoiThau, index?: number) {
    $event.stopPropagation();
    if (this.formData.get("loaiVthh").value == null) {
      this.notification.error(MESSAGE.NOTIFICATION, "Vui lòng chọn loại hàng hóa");
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
        namKeHoach: this.formData.value.namKhoach,
        showFromQd: true
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
          let soLuong = 0
          item.children.forEach(cuc => {
            soLuong += cuc.soLuong;
          })
          item.soLuong = soLuong;
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
   this.tinhTongMucDauTu();
    this.helperService.setIndexArray(this.listOfData);
    this.dsDxChange.emit(this.listOfData);
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

  tinhTongMucDauTu () {
    let tongMucDt: number = 0;
    this.listOfData.forEach((item) => {
      tongMucDt = tongMucDt + (item.soLuong * item.donGiaVat / 1000000000);
    });
    this.formData.patchValue({
      tongMucDt: parseFloat(tongMucDt.toFixed(2)),
    });
  }
}
