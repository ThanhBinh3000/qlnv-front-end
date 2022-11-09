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
import { DanhSachMuaTrucTiepService } from 'src/app/services/danh-sach-mua-truc-tiep.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';

@Component({
  selector: 'app-thongtin-dexuat-muatt',
  templateUrl: './thongtin-dexuat-muatt.component.html',
  styleUrls: ['./thongtin-dexuat-muatt.component.scss']
})
export class ThongtinDexuatMuattComponent implements OnInit {
  @Input() title;
  @Input() dataInput;
  @Output() soLuongChange = new EventEmitter<number>();
  @Input() isView;
  @Input() isCache: boolean = false;
  @Input() isTongHop;

  formData: FormGroup
  listNguonVon: any[] = [];
  listDataGroup: any[] = [];
  listOfData: any[] = [];

  constructor(
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
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
      namKh: [,],
      soDxuat: [null],
      trichYeu: [null],
      ngayTao: [],
      ngayPduyet: [],
      tenDuAn: [null,],
      soQd: [,],
      loaiVthh: [,],
      tenLoaiVthh: [,],
      cloaiVthh: [,],
      tenCloaiVthh: [,],
      moTaHangHoa: [,],
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
        let res
        if (this.dataInput.idDxHdr) {
          res = await this.danhSachMuaTrucTiepService.getDetail(this.dataInput.idDxHdr);
          if (this.isTongHop) {
            this.listOfData = this.dataInput.soLuongDiaDiemList;
          } else {
            this.listOfData = this.dataInput.listSlddDtl ? this.dataInput.listSlddDtl : this.dataInput.soLuongDiaDiemList;
          }
        } else {
          res = await this.danhSachMuaTrucTiepService.getDetail(this.dataInput.idDxuat);
          if (this.isTongHop) {
            this.listOfData = this.dataInput.listSlddDtl;
          } else {
            this.listOfData = this.dataInput.soLuongDiaDiemList ? this.dataInput.soLuongDiaDiemList : this.dataInput.listSlddDtl;
          }
        }
        if (res.msg == MESSAGE.SUCCESS) {
          this.helperService.bidingDataInFormGroup(this.formData, res.data);
          let soLuongDxmtt = res.data.tongMucDt / res.data.donGiaVat / 1000;
          this.formData.patchValue({
            soLuongDxmtt: soLuongDxmtt,
            tongMucDt: soLuongDxmtt * res.data.donGiaVat * 1000
          });
          if (!this.isCache) {
            if (this.dataInput.soLuongDxmtt) {
              this.formData.patchValue({
                soLuongDxmtt: this.dataInput.soLuongDxmtt,
                tongMucDt: this.dataInput.soLuongDxmtt * this.dataInput.donGiaVat * 1000
              })
            }
          }
        }
        this.helperService.setIndexArray(this.listOfData);
        this.convertListData();
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
      let soLuongDxmtt: number = 0;
      this.listOfData.forEach((item) => {
        tongMucDt = tongMucDt + item.soLuongDxmtt * item.donGiaVat;
        soLuongDxmtt = soLuongDxmtt + item.soLuongDxmtt;
      });
      this.formData.patchValue({
        tongMucDt: tongMucDt,
        soLuongDxmtt: soLuongDxmtt
      });
      this.soLuongChange.emit(soLuongDxmtt);
      this.helperService.setIndexArray(this.listOfData);
      this.convertListData();
    });
  };



  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

}
