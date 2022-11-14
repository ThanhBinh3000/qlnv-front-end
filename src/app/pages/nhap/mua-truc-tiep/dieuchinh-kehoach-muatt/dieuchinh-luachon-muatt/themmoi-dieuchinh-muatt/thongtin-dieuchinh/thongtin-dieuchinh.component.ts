import { DialogThemMoiKeHoachMuaTrucTiepComponent } from './../../../../../../../components/dialog/dialog-them-moi-ke-hoach-mua-truc-tiep/dialog-them-moi-ke-hoach-mua-truc-tiep.component';
import { DialogThemMoiVatTuComponent } from 'src/app/components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component';
import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { chain } from 'lodash';
import { NzModalService } from "ng-zorro-antd/modal";
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
import { MESSAGE } from "../../../../../../../constants/message";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { Globals } from "../../../../../../../shared/globals";
import { DieuChinhQuyetDinhPdKhmttService } from './../../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/dieuchinh-khmtt/DieuChinhQuyetDinhPdKhmtt.service';

@Component({
  selector: 'app-thongtin-dieuchinh',
  templateUrl: './thongtin-dieuchinh.component.html',
  styleUrls: ['./thongtin-dieuchinh.component.scss']
})
export class ThongtinDieuchinhComponent implements OnInit {


  @Input() title;
  @Input() dataInput;
  @Input() isView;
  @Output() soLuongChange = new EventEmitter<number>();

  formData: FormGroup
  listNguonVon: any[] = [];
  listDataGroup: any[] = [];
  listDataGroupCache: any[] = [];
  hhQdPheduyetKhMttDxList: any[] = [];
  listOfData: any[] = [];
  listOfDataCache: any[] = [];


  constructor(
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    private dieuChinhQuyetDinhPdKhmttService: DieuChinhQuyetDinhPdKhmttService,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private modal: NzModalService,
  ) {
    this.formData = this.fb.group({
      id: [''],
      maDvi: [''],
      tenDvi: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      namKh: [],
      soDxuat: [null],
      trichYeu: [null],
      ngayTao: [],
      ngayPduyet: [],
      tenDuAn: [null,],
      soQd: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [,],
      moTaHangHoa: [],
      ptMua: [null],
      tchuanCluong: [null],
      giaMua: [],
      giaChuaThue: [],
      giaCoThue: [],
      thueGtgt: [],
      tgianMkho: [],
      tgianKthuc: [],
      ghiChu: [null],
      tongMucDt: [],
      tongSoLuong: [],
      nguonVon: [],
      tenChuDt: [],
      moTa: [],
      maDiemKho: [],
      diaDiemKho: [],
      soLuongCtieu: [],
      soLuongKhDd: [],
      soLuongDxmtt: [],
      trangThaiTh: [],
      donGiaVat: [],
      thanhTien: [],
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    if (changes) {
      if (this.dataInput) {
        console.log(this.dataInput, "aaaa");
        let res;
        if (this.dataInput.idPduyetHdr) {
          res = await this.quyetDinhPheDuyetKeHoachMTTService.getDetail(this.dataInput.idPduyetHdr);
          this.listOfData = this.dataInput.soLuongDiaDiemList;
          if (res.msg == MESSAGE.SUCCESS) {
            let dataFilter = res.data.hhQdPheduyetKhMttDxList.filter(item => item.idPduyetHdr == this.dataInput.idPduyetHdr)[0];
            this.helperService.bidingDataInFormGroup(this.formData, dataFilter)
          }
        } else {
          res = await this.dieuChinhQuyetDinhPdKhmttService.getDetail(this.dataInput.idDcHdr)
          this.listOfData = this.dataInput.hhDcQdPduyetKhmttSlddList;
          if (res.msg == MESSAGE.SUCCESS) {
            let dataFilter = res.data.hhDcQdPduyetKhmttDxList.filter(item => item.id == this.dataInput.id)[0];
            this.helperService.bidingDataInFormGroup(this.formData, dataFilter)
          }
        }

        this.helperService.setIndexArray(this.listOfData);
        this.convertListData();
      }
    }
    await this.spinner.hide()
  }

  convertListData() {
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()

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

  openDialogSldd(data?: any, index?: number) {
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm nhập kho',
      nzContent: DialogThemMoiKeHoachMuaTrucTiepComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        loaiVthh: this.formData.get('loaiVthh').value,
        donGiaVat: this.formData.value.giaCoThue
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
      let tongSoLuong: number = 0;
      this.listOfData.forEach((item) => {
        tongMucDt = tongMucDt + item.tongSoLuong * item.donGiaVat;
        tongSoLuong = tongSoLuong + item.tongSoLuong;
      });
      this.formData.patchValue({
        tongMucDt: tongMucDt,
        tongSoLuong: tongSoLuong,
      });
      this.soLuongChange.emit(tongSoLuong);
      this.helperService.setIndexArray(this.listOfData);
      this.convertListData();
    });
  };

  deleteItem(index) {
    this.hhQdPheduyetKhMttDxList = this.hhQdPheduyetKhMttDxList.filter((item, i) => i !== index)
  }

}
