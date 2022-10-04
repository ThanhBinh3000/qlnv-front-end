import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
import {Globals} from "../../../../../../shared/globals";
import {UserLogin} from "../../../../../../models/userlogin";
import {UserService} from "../../../../../../services/user.service";
import {STATUS} from "../../../../../../constants/status";
import {MESSAGE} from "../../../../../../constants/message";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {ThongTinQuyetDinh} from "../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-them-hang-hong-hoc-giam-chat-luong',
  templateUrl: './them-hang-hong-hoc-giam-chat-luong.component.html',
  styleUrls: ['./them-hang-hong-hoc-giam-chat-luong.component.scss'],
})
export class ThemHangHongHocGiamChatLuongComponent implements OnInit {
  @Input('dsTong') dsTong;
  @Input('dsLoaiHangHoa') dsLoaiHangHoa: any[];
  formData: FormGroup;
  dataTable: IHangHongHocGiamChatLuong[];
  rowItem: IHangHongHocGiamChatLuong = new IHangHongHocGiamChatLuong();
  userInfo: UserLogin
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dataEdit: {
    [key: string]: { edit: boolean; data: IHangHongHocGiamChatLuong };
  } = {};
  dsDonVi = [];
  dsDiemKho = [];
  dsNhaKho = [];
  dsNganLo = [];
  @Output('close') onClose = new EventEmitter<any>();
   danhSachChiCuc: any[] = [];
  listChungLoaiHangHoa: any[] = [];
   dsLoKho: any[] = [];

  constructor(
    private  fb: FormBuilder,
    public  globals: Globals,
    public  donViService: DonviService,
    public  danhMucService: DanhMucService,
    public  userService: UserService,
    public  notification: NzNotificationService,
    public  spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {

    try {
      this.userInfo = this.userService.getUserLogin()
      this.loadDanhSachChiCuc();
      this.initForm();
      this.loaiVTHHGetAll();
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  initForm(): void {
    this.formData = this.fb.group({
      maDonVi: [null],
      maDanhSach: [null],
      ngayTao: [new Date()],
      loaiHang: [null],
      maChungLoaiHang: [null],
      trangThai: [STATUS.CHUA_TONG_HOP],
      tenTrangThai: ['Chưa tổng hợp'],
    });
  }

  async loadDanhSachChiCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.danhSachChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
  }

  async changeLoaiHangHoa(id: any) {
    if (id && id > 0) {
      let loaiHangHoa = this.dsLoaiHangHoa.filter(item => item.ma === id);
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
      console.log(this.listChungLoaiHangHoa)
      console.log(this.dsLoaiHangHoa)
    }
  }
  async loaiVTHHGetAll() {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === "1" && item.ma != '01') {
              this.dsLoaiHangHoa = [...this.dsLoaiHangHoa, item];
            } else {
              this.dsLoaiHangHoa = [...this.dsLoaiHangHoa, ...item.child];
            }
          })
        }
      })
  }

  huy() {
    this.onClose.emit();
  }

  exportData() {}

  luu() {}

  xoaItem(id: number) {}

  themMoiItem() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.dataTable = [...this.dataTable, this.rowItem]
    this.rowItem = new IHangHongHocGiamChatLuong();
    this.updateEditCache()
  }


  clearData() {}

  changePageIndex(event) {}

  changePageSize(event) {}

  editItem(id: number): void {
    this.dataEdit[id].edit = true;
  }

  huyEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.id === id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }

  luuEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.id === id);
    Object.assign(this.dataTable[index], this.dataEdit[id].data);
    this.dataEdit[id].edit = false;
  }

  updateEditCache(): void {
    this.dataTable.forEach((item, index) => {
      this.dataEdit[index] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  async onChangChiCuc(event) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };

    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.dsDiemKho = dsTong[DANH_MUC_LEVEL.DIEM_KHO];
  }

  async onChangeDiemKho(event) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };

    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.dsNhaKho = dsTong[DANH_MUC_LEVEL.NHA_KHO];
  }

  async onChangeNhaKho(event) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };

    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.dsNganLo = dsTong[DANH_MUC_LEVEL.NGAN_KHO];
  }

 async onChangeNganKho(event) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.dsLoKho = dsTong[DANH_MUC_LEVEL.LO_KHO];
  }
}

export class IHangHongHocGiamChatLuong {
  id: number;
  loaiVthh: number;
  tenLoaiVthh: string;
  cloaiVthh: number;
  tenCloaivthh: string;
  maNhaKho : string;
  maDiemKho : string;
  maNganKho : string;
  maLoKho : string;
  soLuongTon: number;
  soLuongThanhLy: number;
  donVi: string;
  lyDo: string;
}
