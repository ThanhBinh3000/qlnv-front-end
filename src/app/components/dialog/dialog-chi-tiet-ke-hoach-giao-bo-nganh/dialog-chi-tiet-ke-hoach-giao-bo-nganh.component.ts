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
  nam: any;
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
  radioData: any;
  radioValue: any;

  constructor(
    private readonly _modalRef: NzModalRef,
    private danhMucService: DanhMucService,
    public globals: Globals,
  ) {

  }

  async ngOnInit() {
    this.radioData = [
      {label: 'Bộ tài chính', value: 'BTC'},
      {label: 'Bộ ngành khác', value: 'Khac'},
    ];
    this.radioValue = 'BTC';
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
    //fix btc = tcdt
    if (event == '01') {
      event = '0101'
    }
    this.dsHangHoa = [];

    if (event) {
      const boNganh = this.dsBoNganh.find(item => item.ma == event)
      if (boNganh) {
        this.keHoach.tenBoNganh = boNganh.giaTri;
        this.keHoach.tongTien=null;
      }
      this.danhMucService.getDanhMucHangDvql({
        "dviQly": event
      }).subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          if (event == '0101') {
            const dataVatTu = hangHoa.data.filter(item => (item.ma == "02" || item.ma == "04"));
            dataVatTu.forEach(item => {
              this.dsHangHoa = [...this.dsHangHoa, ...item.child]
            });
          } else {
            this.dsHangHoa = hangHoa.data;
          }
        }
      })
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.danhMucService.danhMucChungGetAll('BO_NGANH');
    if (res.msg == MESSAGE.SUCCESS) {
      let boTaiChinh = res.data.find(s => s.giaTri === 'Bộ Tài Chính');
      this.keHoach.maBoNganh = boTaiChinh.ma;
      this.keHoach.tenBoNganh = boTaiChinh.giaTri;
      //fix theo giao dien moi
      this.dsBoNganh = res.data.filter(s => s.giaTri != 'Bộ Tài Chính');
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
    if (this.keHoachLuongThucComponent) {
      this.keHoachLuongThucComponent.onChangeInput();
    }
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

  onChangeBoNganhRadio() {
    if (this.radioValue == 'BTC') {
      this.keHoach.maBoNganh = '01'
      this.onChangeBoNganh("0101");
    } else {
      this.keHoach.maBoNganh = [];
      this.onChangeBoNganh("");
    }
  }
}
