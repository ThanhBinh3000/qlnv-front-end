import {Component, OnInit, ViewChild} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {MESSAGE} from 'src/app/constants/message';
import {Globals} from 'src/app/shared/globals';
import {DanhMucService} from '../../../services/danhmuc.service';
import {KeHoachLuongThucComponent} from './ke-hoach-luong-thuc/ke-hoach-luong-thuc.component';

@Component({
  selector: 'app-dialog-chi-tiet-ke-hoach-giao-bo-nganh',
  templateUrl: './dialog-chi-tiet-ke-hoach-giao-bo-nganh.component.html',
  styleUrls: ['./dialog-chi-tiet-ke-hoach-giao-bo-nganh.component.scss'],
})
export class DialogChiTietKeHoachGiaoBoNganhComponent implements OnInit {

  @ViewChild('keHoachLuongThuc') keHoachLuongThucComponent: KeHoachLuongThucComponent;


  isView: boolean = false;
  errorBn: boolean = false;
  errorTt: boolean = false;
  keHoach: any = {
    id: null,
    maBoNganh: null,
    tenBoNganh: null,
    tongTien: null,
    ltGaoMua: null,
    ltThocMua: null,
    ltGaoXuat: null,
    ltThocXuat: null,
    ttMuaTang: null,
    ttXuatBan: null,
    ttXuatGiam: null,
    muaTangList: [],
    xuatGiamList: [],
    xuatBanList: [],
    luanPhienList: [],
  };
  dataTable: any[] = [];
  dsBoNganh: any[];
  dsHangHoa: any[] = [];
  dataEdit: any;

  constructor(
    private readonly _modalRef: NzModalRef,
    private danhMucService: DanhMucService,
    public globals: Globals,
  ) {

  }

  async ngOnInit() {
    this.bindingData(this.dataEdit)
    await Promise.all([
      this.getListBoNganh(),
      this.loadDanhMucHang()
    ]);
  }

  bindingData(dataEdit) {
    if (dataEdit) {
      this.keHoach = dataEdit;
    }
  }

  onChangeBoNganh(event) {
    const boNganh = this.dsBoNganh.find(item => item.ma == event)
    if (boNganh) {
      this.keHoach.tenBoNganh = boNganh.giaTri;
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.danhMucService.danhMucChungGetAll('BO_NGANH');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data;
    }
  }

  async loadDanhMucHang() {
    await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        const dataVatTu = hangHoa.data.filter(item => (item.ma == "02" || item.ma == "04"));
        dataVatTu.forEach(item => {
          this.dsHangHoa = [...this.dsHangHoa, ...item.child]
        })
        // this.dsHangHoa = dataVatTu.child;
      }
    })
  }

  luu() {
    this.keHoachLuongThucComponent.onChangeInput();
    if (this.validateData()) {
      this._modalRef.close(this.keHoach);
    }
  }

  validateData() {
    if (!this.keHoach.maBoNganh) {
      this.errorBn = true;
      return false;
    } else {
      this.errorBn = false;
    }

    if (!this.keHoach.tongTien) {
      this.errorTt = true;
      return false;
    } else {
      this.errorTt = false;
    }
    return true;
  }

  onCancel() {
    this._modalRef.close();
  }

}
