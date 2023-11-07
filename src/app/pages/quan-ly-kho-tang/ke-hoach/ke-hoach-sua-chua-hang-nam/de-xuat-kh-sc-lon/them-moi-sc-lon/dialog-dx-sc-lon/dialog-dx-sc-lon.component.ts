import { Component, Input, OnInit } from "@angular/core";
import { UserLogin } from "../../../../../../../models/userlogin";
import { UserService } from "../../../../../../../services/user.service";
import { NzModalRef } from "ng-zorro-antd/modal";
import { Globals } from "../../../../../../../shared/globals";
import { MESSAGE } from "../../../../../../../constants/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { STATUS } from "../../../../../../../constants/status";
import dayjs from "dayjs";
import {
  DanhMucSuaChuaService
} from "../../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/danh-muc-kho/danh-muc-sua-chua.service";

@Component({
  selector: "app-dialog-dx-sc-lon",
  templateUrl: "./dialog-dx-sc-lon.component.html",
  styleUrls: ["./dialog-dx-sc-lon.component.scss"]
})
export class DialogDxScLonComponent implements OnInit {
  @Input() dataInput: any;
  @Input() type: string;
  @Input() sum: number;
  @Input() dataTable: any;
  @Input() page: string;
  @Input()isQd: boolean = false;
  @Input() nam: number;
  item: KhSuaChuaLonDtl = new KhSuaChuaLonDtl();
  listDmScLon: any[] = [];
  listLoaiDuAn: any[] = [];
  listKhoi: any[] = [];
  listNguonVon: any[] = [];
  userInfo: UserLogin;

  constructor(
    private danhMucService: DanhMucService,
    private userService: UserService,
    private _modalRef: NzModalRef,
    public globals: Globals,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    private dmSuaChuaService: DanhMucSuaChuaService
  ) {
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.getAllDmKho();
    this.getAllLoaiDuAn();
    this.getDsKhoi();
    this.getDsNguonVon();
    this.getDetail();
  }

  handleOk() {
    let msgRequired = this.required(this.item);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (this.checkExitsData(this.item, this.dataTable) && this.type == "them") {
      this.notification.error(MESSAGE.ERROR, "Không được chọn trùng danh mục dự án");
      this.spinner.hide();
      return;
    }
    let nguonVon = this.listNguonVon.find(data => data.ma == this.item.nguonVon);
    if (nguonVon) {
      this.item.tenNguonVon = nguonVon.giaTri;
    }
    this._modalRef.close(this.item);
    this.item = new KhSuaChuaLonDtl();
  }

  onCancel() {
    this._modalRef.close();
  }

  required(item: KhSuaChuaLonDtl) {
    let msgRequired = "";
    //validator
    if (!item.maCongTrinh) {
      msgRequired = "Không được để trống danh mục sửa chữa lớn";
    } else if (!item.loaiCongTrinh) {
      msgRequired = "Không được để trống loại công trình";
    }else if (!item.nguonVon) {
      msgRequired = "Không được để trống nguồn vốn";
    }else if (!item.vonDauTu) {
      msgRequired = "Không được để trống kế hoạch vốn đầu tư";
    }
    return msgRequired;
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maCongTrinh == item.maCongTrinh) {
          rs = true;
          return;
        }
      });
    }
    return rs;
  }


  async getAllDmKho() {
    let body = {
      "maDvi" : this.userService.isCuc() ? this.userInfo.MA_DVI  :null,
      "paggingReq": {
        limit: 999999,
        page: 0
      },
      "type" : '00',
      "namKh" : this.nam
    };
    let res = await this.dmSuaChuaService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDmScLon = res.data.content;
      console.log(this.dataInput.khoi,this.page,this.type,this.isQd);
      this.listDmScLon = this.listDmScLon.filter(item =>
        (item.trangThai == STATUS.CHUA_THUC_HIEN) && item.khoi == this.dataInput.khoi
        && (this.page == 'tren' ? item.tmdt > 15000000000 : item.tmdt <= 15000000000));

      // if (this.type == 'them' && this.listDmScLon && this.listDmScLon.length > 0 && !this.isQd) {
      //
      // }
      console.log(this.listDmScLon);
    }
  }

  getDetail() {
    this.item.khoi = this.dataInput.khoi;
    if (this.type == "sua") {
      this.item.namKh = this.dataInput.namKh;
      this.item.maCongTrinh = this.dataInput.maCongTrinh;
      this.item.tenCongTrinh = this.dataInput.tenCongTrinh;
      this.item.diaDiem = this.dataInput.diaDiem;
      this.item.loaiCongTrinh = this.dataInput.loaiCongTrinh;
      this.item.tgThucHien = this.dataInput.tgThucHien;
      this.item.tgHoanThanh = this.dataInput.tgHoanThanh;
      this.item.tgSuaChua = this.dataInput.tgSuaChua;
      this.item.tenChiCuc = this.dataInput.tenChiCuc;
      this.item.tenDiemKho = this.dataInput.tenDiemKho;
      this.item.ghiChu = this.dataInput.ghiChu;
      this.item.tmdt = this.dataInput.tmdt;
      this.item.soQdPheDuyet = this.dataInput.soQdPheDuyet;
      this.item.ngayQdPd = this.dataInput.ngayQdPd;
      this.item.giaTriPd = this.dataInput.giaTriPd;
      this.item.luyKeVon = this.dataInput.luyKeVon;
      this.item.vonDauTu = this.dataInput.vonDauTu ? this.dataInput.vonDauTu : 0;
      this.item.tieuChuan = this.dataInput.tieuChuan;
      this.item.lyDo = this.dataInput.lyDo;
      this.item.nguonVon = this.dataInput.nguonVon;
    }
  }

  changeDmucDuAn(event: any) {
    if (event) {
      let result = this.listDmScLon.filter(item => item.maCongTrinh == event);
      if (result && result.length > 0) {
        this.item = result[0];
      }
    }
  }

  async getAllLoaiDuAn() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_CONG_TRINH_SCL_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listLoaiDuAn = res.data;
      }
    }
  }

  async getDsKhoi() {
    let res = await this.danhMucService.danhMucChungGetAll("KHOI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKhoi = res.data;
    }
  }

  async getDsNguonVon() {
    let res = await this.danhMucService.danhMucChungGetAll("NGUON_VON");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = res.data;
    }
  }

}

export class KhSuaChuaLonDtl {
  id: number;

  maDvi: string;

  namKh: number;

  maCongTrinh: string;
  tenCongTrinh: string;

  loaiCongTrinh: string;

  maChiCuc: string;

  maDiemKho: string;

  diaDiem: string;

  tgThucHien: number;
  tgHoanThanh: number;

  nguonVon: string;
  tenNguonVon: string;

  tgSuaChua: number;

  tmdt: number;
  luyKeVon: number;

  soQdPheDuyet: string;

  ngayQdPd: any;

  giaTriPd: number;


  tieuChuan: string;

  ghiChu: string;

  lyDo: string;

  soCv: string;

  loai: string;

  khoi: string;

  tenChiCuc: string;

  tenDiemKho: string;

  vonDauTu: number;
}
