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
  @Input() isView;
  @Input() isCache: boolean = false;
  @Input() isTongHop;

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

  constructor(
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private dxKhLcntService: DanhSachDauThauService,
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
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    if (changes) {
      if (this.dataInput) {
        let res = await this.dxKhLcntService.getDetail(this.dataInput.idDxHdr);
        if (this.isTongHop) {
          this.listOfData = this.dataInput.children;
        } else {
          if (this.dataInput.dsGtDtlList) {
            this.dataInput.children = this.dataInput.dsGtDtlList
          }
          this.listOfData = this.dataInput.children;
        }
        if (res.msg == MESSAGE.SUCCESS) {
          this.tgianBdauTchucChange = res.data.tgianBdauTchuc
          this.tgianDthauChange = res.data.tgianDthau
          this.tgianMthauChange = res.data.tgianMthau
          this.tgianNhangChange = res.data.tgianNhang
          this.helperService.bidingDataInFormGroup(this.formData, res.data);
          let soLuong = res.data.tongMucDt / res.data.donGiaVat / 1000;
          this.formData.patchValue({
            soLuong: soLuong,
            tongMucDt: soLuong * res.data.donGiaVat * 1000
          });
          if (!this.isCache) {
            if (this.dataInput.soLuong) {
              this.formData.patchValue({
                soLuong: this.dataInput.soLuong,
                tongMucDt: this.dataInput.soLuong * this.dataInput.donGiaVat * 1000
              })
            }
          }
        }
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


  // convertListData() {
  //   this.listDataChiCuc = [];
  //   this.listDataCuc = [];
  //   this.listDataDetail = [];
  //   this.listOfData.forEach(item => {
  //     this.listDataCuc.push(item)
  //     item.children.forEach(i => {
  //       this.listDataChiCuc.push(i)
  //     })
  //   })
  //   this.listDataChiCuc = chain(this.listDataChiCuc).groupBy('idGoiThau').value()

  //   this.listDataCuc.forEach(item => {
  //     if (this.listDataChiCuc[item.id] != undefined) {
  //       for (let i = 0; i < this.listDataChiCuc[item.id].length; i++) {
  //         if (item.id == this.listDataChiCuc[item.id][i].idGoiThau) {
  //           this.listData.push({ tenDvi: this.listDataChiCuc[item.id][i].tenDvi, dataChild: item })
  //         }
  //       }
  //     }
  //   })
  //   const groupedData = chain(this.listData)
  //     .groupBy('tenDvi')
  //     .value();

  //   this.listDataDetail = Object.keys(groupedData).map(tenDvi => ({
  //     tenDvi: tenDvi,
  //     dataChild: groupedData[tenDvi].flatMap(item => item.dataChild)
  //   }));
  //   this.listDataDetail.forEach(item => {
  //     item.dataChild = item.dataChild.filter((value, index, self) => {
  //       return self.findIndex(v => v.id === value.id) === index;
  //     });
  //   });

  //   console.log("3", this.listDataDetail);
  // }

  convertListData() {
    this.helperService.setIndexArray(this.listOfData);
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()
  }

  onDateChanged(value: any, type: any) {
    debugger
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
        dataChild: value
      })).value()
    console.log(this.listDataGroup)
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

  themMoiGoiThau(data?: any, index?: number) {
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm nhập kho',
      nzContent: DialogThemMoiVatTuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        loaiVthh: this.formData.get('loaiVthh').value,
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }
      if (index >= 0) {
        this.listOfData[index] = res.value;
      } else {
        this.listOfData = [...this.listOfData, res.value];
      }
      let tongMucDt: number = 0;
      let soLuong: number = 0;
      this.listOfData.forEach((item) => {
        tongMucDt = tongMucDt + item.soLuong * item.donGia;
        soLuong = soLuong + item.soLuong;
      });
      this.formData.patchValue({
        tongMucDt: tongMucDt,
        soLuong: soLuong
      });
      this.soLuongChange.emit(soLuong);
      this.helperService.setIndexArray(this.listOfData);
      this.convertListData();
    });
  };

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
    this.listDataGroup.forEach(item => {
      item.dataChild.forEach(res => {
        res.children.forEach(data => {
          sum += (res.donGiaTamTinh != null ?
            res.donGiaTamTinh * data.soLuong : (res.donGiaVat != null ? res.donGiaVat *
              data.soLuong : (res.donGia != null ? res.donGia * data.soLuong : 0)));
          sumSl += data.soLuong;
        })
      })
    })
    this.formData.get('tongMucDtDx').setValue(sum);
    this.formData.get('soLuong').setValue(sumSl);
    this.soLuongChange.emit(sumSl);
    this.donGiaTamTinhOut.emit(this.formData.get('tongMucDtDx').value)
  }


}
