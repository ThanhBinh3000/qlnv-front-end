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


@Component({
  selector: 'app-thongtin-dexuat',
  templateUrl: './thongtin-dexuat.component.html',
  styleUrls: ['./thongtin-dexuat.component.scss']
})
export class ThongtinDexuatComponent implements OnInit, OnChanges {
  @Input() title;
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

  formData: FormGroup
  listNguonVon: any[] = [];
  listDataGroup: any[] = [];
  listOfData: any[] = [];
  isEditing: boolean = false;
  editingSoLuong: any;
  listDataDetail: any[] = [];
  listDataCuc: any[] = [];
  listDataChiCuc: any[] = [];
  listData: any[] = [];
  tgianBdauTchucChange: Date | null = null;
  tgianNhangChange: Date | null = null;
  tgianDthauChange: Date | null = null;
  tgianMthauChange: Date | null = null;
  tenDuAn: any;
  giaVat: any;
  tienBaoLanh: any;
  tienDamBaoThHd: any;
  tenHangHoa: any;
  tChuanCLuong: any;
  tongTienTamTinh: any;
  tongSLuongNhap: any;
  sumDataSoLuong: any[] = [];
  sumThanhTienTamTinh: any[] = [];
  STATUS = STATUS;

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
      vat: [5],
      tongMucDt: [null,],
      tongMucDtDx: [null,],
      nguonVon: [null,],
      tgianNhang: [null,],
      ghiChu: [null],
      ldoTuchoi: [],
      trangThai: [],
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
          this.tgianBdauTchucChange = data.data.tgianBdauTchuc
          this.tgianDthauChange = data.data.tgianDthau
          this.tgianMthauChange = data.data.tgianMthau
          this.tgianNhangChange = data.data.tgianNhang
          this.tenDuAn = data.data.children[0].tenDuAn
          this.giaVat = data.data.children[0].donGiaVat
          this.tienDamBaoThHd = data.data.children[0].dxuatKhLcntHdr.tongMucDtDx * data.data.children[0].dxuatKhLcntHdr.gtriHdong / 100;
          this.tienBaoLanh = data.data.children[0].dxuatKhLcntHdr.tongMucDtDx + (data.data.children[0].dxuatKhLcntHdr.tongMucDtDx * data.data.children[0].dxuatKhLcntHdr.gtriHdong / 100) + (data.data.children[0].dxuatKhLcntHdr.tongMucDtDx * data.data.children[0].dxuatKhLcntHdr.gtriDthau / 100)
          this.helperService.bidingDataInFormGroup(this.formData, data.data);
          this.formData.patchValue({
            tgianDthau: data.data.tgianDthau,
            tgianMthau: data.data.tgianMthau,
            tgianNhang: data.data.tgianNhang,
            tgianBdauTchuc: data.data.tgianBdauTchuc,
            gtriDthau: data.data.gtriDthau,
            tchuanCluong: data.data.children[0].dxuatKhLcntHdr.tchuanCluong,
            tongMucDt: data.data.children[0].dxuatKhLcntHdr.tongMucDt,
            trangThai: data.data.trangThai
          });
        } else if (res != null && res.msg == MESSAGE.SUCCESS) {
          this.tgianBdauTchucChange = res.data.tgianBdauTchuc
          this.tgianDthauChange = res.data.tgianDthau
          this.tgianMthauChange = res.data.tgianMthau
          this.tgianNhangChange = res.data.tgianNhang
          this.tChuanCLuong = res.data.tchuanCluong
          this.tenHangHoa = res.data.moTaHangHoa
          this.giaVat = res.data.donGiaVat
          this.tenDuAn = res.data.tenDuAn
          this.tienDamBaoThHd = res.data.tongMucDtDx * res.data.gtriHdong / 100;
          this.tienBaoLanh = res.data.tongMucDtDx + (res.data.tongMucDtDx * res.data.gtriHdong / 100) + (res.data.tongMucDtDx * res.data.gtriDthau / 100)
          this.helperService.bidingDataInFormGroup(this.formData, res.data);
          let soLuong = res.data.tongMucDt / res.data.donGiaVat;
          this.formData.patchValue({
            soLuong: soLuong,
            tongMucDt: soLuong * res.data.donGiaVat,
            tgianDthau: res.data.tgianDthau,
            tgianMthau: res.data.tgianMthau,
            tgianNhang: res.data.tgianNhang,
            tgianBdauTchuc: res.data.tgianBdauTchuc,
            gtriDthau: res.data.gtriDthau,
            trangThai: res.data.trangThai
          });
        }
        this.objectChange.emit(this.formData.value)
        this.helperService.setIndexArray(this.listOfData);
        // this.convertListData();
        this.convertListDataLuongThuc()
      } else {
        this.formData.reset();
        this.formData.patchValue({
          vat: 5
        });
      }
    }
    await this.spinner.hide()
  }

  convertListData() {
    this.helperService.setIndexArray(this.listOfData);
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()
  }

  onDateChanged(value: any, type: any) {
    if (type == 'tgianBdauTchuc') {
      this.formData.get('tgianBdauTchuc').setValue(value);
    } else if (type == 'tgianMthau') {
      this.formData.get('tgianMthau').setValue(value);
    } else if (type == 'tgianDthau') {
      this.formData.get('tgianDthau').setValue(value);
    } else if (type == 'tgianNhang') {
      this.formData.get('tgianNhang').setValue(value);
    }
    this.objectChange.emit(this.formData.value)
  }

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }

  convertListDataLuongThuc() {
    let listChild = [];
    this.listOfData.forEach(item => {
      item.children.forEach(i => {
        i.goiThau = item.goiThau
        listChild.push(i)
      })
    })
    this.helperService.setIndexArray(listChild);
    this.listDataGroup = chain(listChild).groupBy('tenDvi').map((value, key) => (
      {
        tenDvi: key,
        soLuongTheoChiTieu: value[0].soLuongTheoChiTieu,
        soLuong: null,
        sumThanhTienTamTinh: null,
        soLuongDaMua: value[0].soLuongDaMua,
        dataChild: value
      })).value()
    this.listDataGroup.forEach(item => {
      let sluong = 0;
      let sumThanhTienTamTinh = 0;
      item.dataChild.forEach(i => {
        sluong = sluong + i.soLuong
        sumThanhTienTamTinh = sumThanhTienTamTinh + i.soLuong * (i.donGiaTamTinh ? i.donGiaTamTinh : i.donGia) * 1000
      })
      item.soLuong = sluong;
      item.sumThanhTienTamTinh = sumThanhTienTamTinh;
    })
    this.sumThanhTien()
  }

  async ngOnInit() {
    await this.spinner.show()
    await this.loadDataComboBox();
    await this.spinner.hide()
  }

  async loadDataComboBox() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
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

  // themMoiGoiThau(data?: any, index?: number) {
  //   const modalGT = this.modal.create({
  //     nzTitle: 'Thêm địa điểm nhập kho',
  //     nzContent: DialogThemMoiVatTuComponent,
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: '1200px',
  //     nzFooter: null,
  //     nzComponentParams: {
  //       dataEdit: data,
  //       loaiVthh: this.formData.get('loaiVthh').value,
  //     },
  //   });
  //   modalGT.afterClose.subscribe((res) => {
  //     if (!res) {
  //       return;
  //     }
  //     if (index >= 0) {
  //       this.listOfData[index] = res.value;
  //     } else {
  //       this.listOfData = [...this.listOfData, res.value];
  //     }
  //     let tongMucDt: number = 0;
  //     let soLuong: number = 0;
  //     this.listOfData.forEach((item) => {
  //       tongMucDt = tongMucDt + item.soLuong * item.donGia;
  //       soLuong = soLuong + item.soLuong;
  //     });
  //     this.formData.patchValue({
  //       tongMucDt: tongMucDt,
  //       soLuong: soLuong
  //     });
  //     this.soLuongChange.emit(soLuong);
  //     this.helperService.setIndexArray(this.listOfData);
  //     this.convertListData();
  //   });
  // };

  onInput(event: any) {
    var value: any;
    value = event;
    this.editingSoLuong = parseInt(value.replaceAll('.', ''));
  }

  editRow(res: any) {
    this.isEditing = true;
    this.editingSoLuong = res.soLuong;
  }


  onBlur(res: any) {
    res.soLuong = this.editingSoLuong;
    this.isEditing = false;
    this.sumThanhTien();
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
          prev += cur.soLuong * item.donGiaTamTinh;
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
          prev += cur.soLuong * item.donGiaTamTinh;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum * (100 + this.formData.get('gtriDthau').value) / 100;
    }
  }
  isDisbleForm(): boolean {
    if (this.trangThaiQd == STATUS.DANG_NHAP_DU_LIEU || this.trangThaiQd == STATUS.TU_CHOI_TP || this.trangThaiQd == STATUS.TU_CHOI_LDC) {
      return false
    } else {
      return true
    }
  }

  themMoiGoiThau(data?: DanhSachGoiThau, index?: number) {
    if (this.formData.get('loaiVthh').value.startsWith('02')) {
      this.themMoiTongCuc(data, index);
    } else {
      this.themMoiCuc();
    }
  }

  themMoiTongCuc(data?: any, index?: number) {
    if (this.formData.get('loaiVthh').value == null || this.formData.get('cloaiVthh').value == null) {
      this.notification.error(MESSAGE.NOTIFICATION, "Vui lòng chọn loại hàng hóa");
      return;
    }
    let listGoiThau = [];
    this.listOfData.forEach(item => {
      listGoiThau.push(item.goiThau)
    })
    let setListGoiThau = new Set(listGoiThau);
    listGoiThau = [...setListGoiThau]
    let isReadOnly = false;
    if (data != null) {
      isReadOnly = true;
    }
    const modal = this.modal.create({
      nzTitle: 'THÔNG TIN GÓI THẦU',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1500px',
      nzFooter: null,
      nzClassName: 'dialog-vat-tu',
      nzComponentParams: {
        trangThai: this.formData.get('trangThai').value,
        data: data,
        dataAll: this.listOfData,
        listGoiThau: listGoiThau,
        isReadOnly: isReadOnly,
        dataChiTieu: this.dataChiTieu,
        loaiVthh: this.formData.get('loaiVthh').value,
        dviTinh: this.formData.get('loaiVthh').value.maDviTinh,
        namKeHoach: this.formData.value.namKhoach,
      },
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        let isUpdate = false;
        for (let i = 0; index < this.listOfData.length; i++) {
          if (this.listOfData[i].goiThau == res.goiThau) {
            this.listOfData[i] = res;
            isUpdate = true;
          }
        }
        if (!isUpdate) {
          this.listOfData.push(res);
        }
        let tongMucDt: number = 0;
        let tongMucDtDx: number = 0;
        this.listOfData.forEach((item) => {
          tongMucDt = tongMucDt + (item.soLuong * item.donGiaVat /1000000000);
          tongMucDtDx = tongMucDtDx + (item.soLuong * item.donGiaTamTinh /1000000000);
        });
        this.formData.patchValue({
          tongMucDt: tongMucDt,
          tongMucDtDx: tongMucDtDx,
        });
      }
    });
  }

  themMoiCuc(goiThau?: string) {
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
        donGiaVat: this.formData.get('donGiaVat').value
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
      let tongMucDt: number = 0;
      let tongMucDtDx: number = 0;
      this.listOfData.forEach((item) => {
        tongMucDt = tongMucDt + (item.soLuong * item.donGiaVat *1000/1000000000);
        tongMucDtDx = tongMucDtDx + (item.soLuong * item.donGiaTamTinh * 1000/1000000000);
      });
      this.formData.patchValue({
        tongMucDt: tongMucDt,
        tongMucDtDx: tongMucDtDx,
      });
      this.convertListDataLuongThuc();
      this.dataInput.children = this.listOfData;
      if (!this.isTongHop && this.dataInput.dsGtDtlList) {
        this.dataInput.dsGtDtlList = this.dataInput.children;
      }
      this.dsDxChange.emit(this.dataInput);
    });
  }


  deleteRowLt(i: number, goiThau: string, z?: number) {
    for (let index = 0; index < this.listOfData.length; index++) {
      if (this.listOfData[index].goiThau == goiThau) {
        if (z) {
          for (let v = 0; v < this.listOfData[index].children.length; v++) {
            if (this.listOfData[index].children[v].idx == i) {
              this.listOfData[index].children[v].children.splice(z, 1)
              if (this.listOfData[index].children[v].children.length == 0) {
                this.listOfData[index].children = this.listOfData[index].children.filter((d, index) => d.idx !== i);
                if (this.listOfData[index].children.length == 0) {
                  this.listOfData.splice(index, 1)
                }
              }
            }
          }
        } else {
          this.listOfData[index].children = this.listOfData[index].children.filter((d, index) => d.idx !== i);
          if (this.listOfData[index].children.length == 0) {
            this.listOfData.splice(index, 1)
          }
        }
        this.helperService.setIndexArray(this.listOfData);
        this.convertListDataLuongThuc()
      }
    }
  }

}
