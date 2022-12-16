import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemMoiVatTuComponent } from 'src/app/components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HelperService } from 'src/app/services/helper.service';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-thongtin-dieuchinh',
  templateUrl: './thongtin-dieuchinh.component.html',
})
export class ThongtinDieuchinhComponent implements OnInit, OnChanges {

  @Input() title;
  @Input() dataInput;
  @Output() soLuongChange = new EventEmitter<number>();
  @Input() isView: boolean = false;
  @Input() isCache: boolean = false;
  @Input() isTongHop;
  @Input()
  listNguonVon: any[] = [];
  @Input()
  listPhuongThucDauThau: any[] = [];
  @Input()
  listHinhThucDauThau: any[] = [];
  @Input()
  listLoaiHopDong: any[] = [];

  formData: FormGroup
  listDataGroup: any[] = [];
  listOfData: any[] = [];
  dataTable: any[] = [];


  STATUS: STATUS

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
      nguonVon: [null,],
      tgianNhang: [null,],
      ghiChu: [null],
      ldoTuchoi: [],
      ngayQd: ['',],
      ngayHluc: ['',],
      idThHdr: [''],
      idTrHdr: [''],
      soTrHdr: [''],
      soQdCc: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      lyDoTuChoi: [''],
      phanLoai: ['', [Validators.required]],
      dienGiai: [''],
      tgianThien: [null],
      yKien: [''],
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    if (changes) {
      if (this.dataInput) {
        console.log(this.dataInput);
        this.helperService.bidingDataInFormGroup(this.formData, this.dataInput);
        this.dataTable = this.dataInput.children;
        let tongMucDt = 0;
        this.dataTable.forEach(item => {
          tongMucDt += item.soLuong * item.donGiaVat;
        })
        this.formData.patchValue({
          tongMucDt: tongMucDt
        })
      }
      // if (this.dataInput) {
      //   let res = await this.dxKhLcntService.getDetail(this.dataInput.idDxHdr);
      //   if (this.isTongHop) {
      //     this.listOfData = this.dataInput.dsGoiThau;
      //   } else {
      //     this.listOfData = this.dataInput.dsGtDtlList ? this.dataInput.dsGtDtlList : this.dataInput.dsGoiThau;
      //   }
      //   if (res.msg == MESSAGE.SUCCESS) {
      //     this.helperService.bidingDataInFormGroup(this.formData, res.data);
      //     let soLuong = res.data.tongMucDt / res.data.donGiaVat / 1000;
      //     this.formData.patchValue({
      //       soLuong: soLuong,
      //       tongMucDt: soLuong * res.data.donGiaVat * 1000
      //     });
      //     if (!this.isCache) {
      //       if (this.dataInput.soLuong) {
      //         this.formData.patchValue({
      //           soLuong: this.dataInput.soLuong,
      //           tongMucDt: this.dataInput.soLuong * this.dataInput.donGiaVat * 1000
      //         })
      //       }
      //     }
      //   }
      //   this.helperService.setIndexArray(this.listOfData);
      //   this.convertListData();
      // } else {
      //   this.formData.reset();
      //   this.formData.patchValue({
      //     vat: 5
      //   });
      // }
    }
    await this.spinner.hide()
  }

  convertListData() {

  }

  async ngOnInit() {
    await this.spinner.show()
    // await this.loadDataComboBox();
    await this.spinner.hide()
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
    let resHd = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
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


  expandSet3 = new Set<number>();
  onExpandChange3(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet3.add(id);
    } else {
      this.expandSet3.delete(id);
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


}
