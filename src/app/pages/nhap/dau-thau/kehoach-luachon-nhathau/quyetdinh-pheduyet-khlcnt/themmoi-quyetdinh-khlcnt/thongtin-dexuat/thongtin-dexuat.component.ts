import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Globals } from "../../../../../../../shared/globals";
import { MESSAGE } from "../../../../../../../constants/message";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { cloneDeep, chain } from 'lodash';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService } from 'src/app/services/helper.service';
import { DanhSachGoiThau } from "../../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {
  DialogThemMoiVatTuComponent
} from "../../../../../../../components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component";
import { NzModalService } from "ng-zorro-antd/modal";
import dayjs from 'dayjs';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service';
import { DatePipe } from '@angular/common';
import {STATUS} from "../../../../../../../constants/status";
import {
  DialogThemMoiGoiThauComponent
} from "../../../../../../../components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component";
import {UserService} from "../../../../../../../services/user.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {CurrencyMaskInputMode} from "ngx-currency";


@Component({
  selector: 'app-thongtin-dexuat',
  templateUrl: './thongtin-dexuat.component.html',
  styleUrls: ['./thongtin-dexuat.component.scss']
})
export class ThongtinDexuatComponent implements OnInit, OnChanges {
  @Input() title;
  @Input() titlePl;
  @Input() dataInput;
  @Output() soLuongChange = new EventEmitter<number>();
  @Output() donGiaTamTinhOut = new EventEmitter<number>();
  @Output() objectChange = new EventEmitter<number>();
  @Output() dsDxChange = new EventEmitter<any>();
  @Input() isView;
  @Input() isCache: boolean = false;
  @Input() isTongHop;
  @Input() dataChiTieu;
  @Input() maDvi;
  @Input() trangThaiQd;
  @Input() isQdTongCuc: boolean = false;
  @Input() fileDinhKem: any[] = [];
  fileDinhKems: any[] = [];
  formData: FormGroup
  listNguonVon: any[] = [];
  listThuHoachVu: any[] = [];
  listQuocGia: any[] = [];
  listDataGroup: any[] = [];
  listOfData: any[] = [];
  isEditing: boolean = false;
  editingSoLuong: any;
  listDataDetail: any[] = [];
  listData: any[] = [];
  tenDuAn: any;
  tenHangHoa: any;
  tongTienTamTinh: any;
  tongSLuongNhap: any;
  sumDataSoLuong: any[] = [];
  sumThanhTienTamTinh: any[] = [];
  STATUS = STATUS;
  listQuy: any[] = [];
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
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private dxKhLcntService: DanhSachDauThauService,
    private userService: UserService,
    private notification: NzNotificationService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private modal: NzModalService,
  ) {
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      diaChiDvi: [],
      namKhoach: [,],
      soDxuat: [null,],
      trichYeu: [null],
      ngayPduyet: [],
      soQd: [,],
      loaiVthh: [,],
      tenLoaiVthh: [,],
      cloaiVthh: [,],
      tenCloaiVthh: [,],
      moTaHangHoa: [,],
      tchuanCluong: [null],
      tenDuAn: [null,],
      loaiHdong: [null,],
      hthucLcnt: [null,],
      pthucLcnt: [null,],
      tgianBdauTchuc: [null,],

      tgianDthau: [null,],
      tgianMthau: [null,],

      gtriDthau: [null,],
      gtriHdong: [null,],
      soLuong: [],
      donGiaVat: [''],
      tongMucDt: [null],
      tongMucDtLamTron: [null],
      tongMucDtDx: [null, [Validators.required]],
      tongMucDtDxLamTron: [null, [Validators.required]],
      nguonVon: [null,],
      tgianNhang: [null,],
      ghiChu: [null],
      ldoTuchoi: [],
      trangThai: [],
      quy: [''],
      ctietTccl: [''],
      namSxuat: [''],
      vu: [''],
      thuHoachVu: [''],
      namThuHoach: [''],
      quocGiaSx: [''],
      giaBanHoSo: [''],
      tgianMoHoSo: [''],
      soQdPdGiaCuThe: [''],
      ngayKyQdPdGiaCuThe: [''],
      tgianMthauTime: [],
      tgianDthauTime: [],
      tgianMoHoSoTime: [],
      thueVat: [],
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    let data = null;
    let res = null;
    if (changes) {
      if (this.dataInput) {
        if (!this.isCache && this.dataInput.idQdHdr != undefined) {
          data = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(this.dataInput.idQdHdr);
          if (this.dataInput.soLuong) {
            this.formData.patchValue({
              soLuong: this.dataInput.soLuong,
              tongMucDt: this.dataInput.soLuong * this.dataInput.donGiaVat
            })
          }
        } else {
          res = await this.dxKhLcntService.getDetail(this.dataInput.idDxHdr);
        }
        if (this.isTongHop) {
          this.listOfData = this.dataInput.children;
        } else {
          if (this.dataInput.dsGtDtlList) {
            this.dataInput.children = this.dataInput.dsGtDtlList
          }
          this.listOfData = this.dataInput.children;
        }
        if (data != null && data.msg == MESSAGE.SUCCESS) {
          this.helperService.bidingDataInFormGroup(this.formData, data.data);
          this.formData.patchValue({
            tgianDthau: this.dataInput.tgianDthau,
            tgianMthau: this.dataInput.tgianMthau,
            tgianNhang: this.dataInput.tgianNhang,
            tgianDthauTime: this.dataInput.tgianDthauTime,
            tgianMthauTime: this.dataInput.tgianMthauTime,
            tgianMoHoSoTime: this.dataInput.tgianMoHoSoTime,
            tgianMoHoSo: this.dataInput.tgianMoHoSo,
            giaBanHoSo: this.dataInput.giaBanHoSo,
            tgianBdauTchuc: this.dataInput.tgianBdauTchuc,
            gtriDthau: this.dataInput.dxuatKhLcntHdr?.gtriDthau,
            gtriHdong: this.dataInput.dxuatKhLcntHdr?.gtriHdong,
            tchuanCluong: this.dataInput.dxuatKhLcntHdr?.tchuanCluong,
            tongMucDt: this.dataInput.dxuatKhLcntHdr?.tongMucDt,
            tenDuAn: this.dataInput.dxuatKhLcntHdr?.tenDuAn,
            tenDvi: this.dataInput.dxuatKhLcntHdr?.tenDvi,
            ctietTccl: this.dataInput.dxuatKhLcntHdr?.ctietTccl,
            namSxuat: this.dataInput.dxuatKhLcntHdr?.namSxuat,
            vu: this.dataInput.dxuatKhLcntHdr?.vu,
            thuHoachVu: this.dataInput.dxuatKhLcntHdr?.thuHoachVu,
            namThuHoach: this.dataInput.dxuatKhLcntHdr?.namThuHoach,
            quocGiaSx: this.dataInput.dxuatKhLcntHdr?.quocGiaSx,
            quy: this.dataInput.dxuatKhLcntHdr?.quy,
            thueVat: this.dataInput.dxuatKhLcntHdr?.thueVat,
          });
          this.initListQuy();
        } else if (res != null && res.msg == MESSAGE.SUCCESS) {
          this.helperService.bidingDataInFormGroup(this.formData, res.data);
          this.initListQuy();
        }
        this.tinhTongMucDtDx();
        if (this.fileDinhKem != null) {
          this.fileDinhKems = this.fileDinhKem;
        }
        this.objectChange.emit(this.formData.value)
      } else {
        this.formData.reset();
      }
    }
    await this.spinner.hide()
  }
  async ngOnInit() {
    await this.spinner.show()
    await this.loadDataComboBox();
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
  async loadDataComboBox() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
    this.listThuHoachVu = [];
    let resVu = await this.danhMucService.danhMucChungGetAll('VU_THU_HOACH');
    if (resVu.msg == MESSAGE.SUCCESS) {
      this.listThuHoachVu = resVu.data;
    }
    this.listQuocGia = [];
    let resQg = await this.danhMucService.danhMucChungGetAll('QUOC_GIA');
    if (resQg.msg == MESSAGE.SUCCESS) {
      this.listQuocGia = resQg.data;
    }
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
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

  sumThanhTien() {
    var sum = 0;
    var sumSl = 0;
    let sumDataSoLuong = 0;
    let sumThanhTienTamTinh = 0;
    this.sumDataSoLuong = []
    this.sumThanhTienTamTinh = []
    this.listDataGroup.forEach(item => {
      sumDataSoLuong = 0;
      sumThanhTienTamTinh = 0;
      item.dataChild.forEach(res => {
        res.children.forEach(data => {
          sum += (res.donGiaTamTinh != null ?
            res.donGiaTamTinh * data.soLuong * 1000 : (res.donGiaVat != null ? res.donGiaVat *
              data.soLuong * 1000 : (res.donGia != null ? res.donGia * data.soLuong * 1000 : 0)));
          sumSl += data.soLuong;
          sumDataSoLuong += data.soLuong;
          sumThanhTienTamTinh += (res.donGiaTamTinh != null ?
            res.donGiaTamTinh * data.soLuong * 1000 : (res.donGiaVat != null ? res.donGiaVat *
              data.soLuong * 1000 : (res.donGia != null ? res.donGia * data.soLuong * 1000 : 0)));
        })
      })
      this.sumDataSoLuong.push(sumDataSoLuong)
      this.sumThanhTienTamTinh.push(sumThanhTienTamTinh)
    })
    this.formData.get('tongMucDtDx').setValue(sum);
    this.formData.get('soLuong').setValue(sumSl);
    this.tongSLuongNhap = sumSl;
    this.tongTienTamTinh = sum;
    this.soLuongChange.emit(sumSl);
    this.donGiaTamTinhOut.emit(this.formData.get('tongMucDtDx').value)
  }

  calcTongSl() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum;
    }
  }

  calcTongThanhTien() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * item.donGia;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum * 1000;
    }
  }

  calcTongThanhTienDx() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * cur.donGiaTamTinh;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum * 1000;
    }
  }

  calcTongThanhTienBaoLanh() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * cur.donGiaTamTinh * this.formData.value.gtriDthau / 100;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum * 1000;
    }
  }

  isDisbleForm(): boolean {
    if (this.trangThaiQd == STATUS.DANG_NHAP_DU_LIEU || this.trangThaiQd == STATUS.TU_CHOI_TP || this.trangThaiQd == STATUS.TU_CHOI_LDC) {
      return false
    } else {
      return true
    }
  }

  themMoiCuc($event: any, goiThau?: string) {
    $event.stopPropagation();
    if (!this.formData.get('loaiVthh').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa');
      return;
    }
    let data = [];
    let listGoiThau = [];
    this.listOfData.forEach(item => {
      listGoiThau.push(item.goiThau)
      if (goiThau && goiThau != '' && item.goiThau == goiThau) {
        data.push(item)
      }
    })
    let setListGoiThau = new Set(listGoiThau);
    listGoiThau = [...setListGoiThau]
    let disabledGoiThau = false;
    if (goiThau && goiThau != '') {
      disabledGoiThau = true;
    }
    const modalGT = this.modal.create({
      nzTitle: '',
      nzContent: DialogThemMoiVatTuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1500px',
      nzFooter: null,
      nzClassName: 'dialog-luong-thuc',
      nzComponentParams: {
        maDvi: this.maDvi,
        disabledGoiThau: disabledGoiThau,
        dataAll: this.listOfData,
        listGoiThau: listGoiThau,
        dataEdit: data,
        dataChiTieu: this.dataChiTieu,
        loaiVthh: this.formData.get('loaiVthh').value,
        cloaiVthh: this.formData.get('cloaiVthh').value,
        tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
        namKhoach: this.formData.get('namKhoach').value,
        donGiaVat: this.formData.get('donGiaVat').value,
        showFromQd: true
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }
      let isReplace = false;
      if (res.value.goiThau && res.value.goiThau != '') {
        for (let i = 0; i < this.listOfData.length; i++) {
          if (this.listOfData[i].goiThau == res.value.goiThau) {
            this.listOfData.splice(i, 1, res.value)
            isReplace = true;
          }
        }
      }
      if (isReplace == false) {
        this.listOfData = [...this.listOfData, res.value]
      }
      this.tinhTongMucDtDx()
      // this.convertListDataLuongThuc();
      this.dataInput.children = this.listOfData;
      if (!this.isTongHop && this.dataInput.dsGtDtlList) {
        this.dataInput.dsGtDtlList = this.dataInput.children;
      }
      this.dsDxChange.emit(this.dataInput);
    });
  }
  deleteGoiThau(i:number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa gói thầu?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.listOfData.splice(i, 1)
        this.tinhTongMucDtDx()
      },
    });
  }

  deleteDiemKho(i:number, y:number, z:number) {
    this.listOfData[i].children[y].children.splice(z, 1)
    if (this.listOfData[i].children[y].children.length > 0) {
      let soLuong = 0;
      this.listOfData[i].children[y].children.forEach(item => {
        soLuong += item.soLuong
      })
      this.listOfData[i].children[y].soLuong = soLuong;
    } else {
      this.listOfData[i].children.splice(y, 1)
    }
    if (this.listOfData[i].children.length > 0) {
      let soLuongGoiThau = 0;
      this.listOfData[i].children.forEach(chiCuc => {
        soLuongGoiThau += chiCuc.soLuong
      })
      this.listOfData[i].soLuong = soLuongGoiThau
    }
    this.tinhTongMucDtDx()
  }

  tinhTongMucDtDx () {
    let tongMucDt: number = 0;
    let tongMucDtDx: number = 0;
    let tongSlChiTieu: number = 0;
    let tongSl: number = 0;
    this.listOfData.forEach((item) => {
      let thanhTien: number = 0;
      let thanhTienDx: number = 0;
      item.children.forEach(i => {
        tongMucDt = tongMucDt + (i.soLuong * i.donGia *1000);
        tongMucDtDx = tongMucDtDx + (i.soLuong * i.donGiaTamTinh * 1000);
        thanhTien = thanhTien + (i.soLuong * i.donGia *1000);
        thanhTienDx = thanhTienDx + (i.soLuong * i.donGiaTamTinh * 1000);
        tongSl += i.soLuong
        tongSlChiTieu += i.soLuongChiTieu
      })
      item.thanhTien = thanhTien;
      item.thanhTienDx = thanhTienDx;
    });
    this.formData.patchValue({
      tongMucDtLamTron: parseFloat((tongMucDt/1000000000).toFixed(2)),
      tongMucDtDxLamTron: parseFloat((tongMucDtDx/1000000000).toFixed(2)),
      tongMucDt: tongMucDt,
      tongMucDtDx: tongMucDtDx,
      tongSlChiTieu: tongSlChiTieu,
      soLuong: tongSl,
    });
  }

  disabledDate = (current: Date): boolean => {
    const startDate = new Date(this.formData.get("namKhoach").value, (this.formData.get("quy").value - 1) * 3, 1);
    const endDate = new Date(this.formData.get("namKhoach").value, this.formData.get("quy").value * 3, 0);
    return current < startDate || current > endDate;
  };
}
