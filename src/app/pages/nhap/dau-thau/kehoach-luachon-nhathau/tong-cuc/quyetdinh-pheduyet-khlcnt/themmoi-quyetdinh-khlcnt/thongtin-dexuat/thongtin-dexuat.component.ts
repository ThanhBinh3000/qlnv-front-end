import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Globals } from "../../../../../../../../shared/globals";
import { MESSAGE } from "../../../../../../../../constants/message";
import { DanhMucService } from "../../../../../../../../services/danhmuc.service";
import { cloneDeep, chain } from 'lodash';
import { DauThauService } from 'src/app/services/dauThau.service';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService } from 'src/app/services/helper.service';
import {DanhSachGoiThau} from "../../../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {
  DialogThemMoiVatTuComponent
} from "../../../../../../../../components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component";
import {NzModalService} from "ng-zorro-antd/modal";


@Component({
  selector: 'app-thongtin-dexuat',
  templateUrl: './thongtin-dexuat.component.html',
  styleUrls: ['./thongtin-dexuat.component.scss']
})
export class ThongtinDexuatComponent implements OnInit, OnChanges {
  @Input() title;
  @Input() dataInput;
  @Input() isView;

  formData: FormGroup
  listNguonVon: any[] = [];
  listDataGroup: any[] = [];
  listDataGroupCache: any[] = [];
  listOfData: any[] = [];
  listOfDataCache: any[] = [];


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
      donGiaVat: [''],
      tongMucDt: [null,],
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
        console.log(this.dataInput);
        this.listOfData = this.dataInput.dsGoiThau;
        let res = await this.dxKhLcntService.getDetail(this.dataInput.idDxHdr);
        if (res.msg == MESSAGE.SUCCESS) {
          this.helperService.bidingDataInFormGroup(this.formData, res.data)
        }
        this.convertListData();
      }
    }
    await this.spinner.hide()
  }

  convertListData() {
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()
  }

  async ngOnInit(){
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


  themMoiGoiThau(data?: DanhSachGoiThau, index?: number) {

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
      this.listOfData.forEach((item) => {
        tongMucDt = tongMucDt + item.soLuong * item.donGia;
      });
      this.formData.patchValue({
        tongMucDt: tongMucDt,
      });
      this.helperService.setIndexArray(this.listOfData);
      this.convertListData();
    });
  };

}
