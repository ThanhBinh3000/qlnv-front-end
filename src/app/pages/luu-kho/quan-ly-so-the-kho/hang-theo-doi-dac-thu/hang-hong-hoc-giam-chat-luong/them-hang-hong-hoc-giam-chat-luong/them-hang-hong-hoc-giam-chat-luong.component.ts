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
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-them-hang-hong-hoc-giam-chat-luong',
  templateUrl: './them-hang-hong-hoc-giam-chat-luong.component.html',
  styleUrls: ['./them-hang-hong-hoc-giam-chat-luong.component.scss'],
})
export class ThemHangHongHocGiamChatLuongComponent implements OnInit {
  @Input('dsTong') dsTong;
  @Input('dsLoaiHangHoa') dsLoaiHangHoa: any[];
  formData: FormGroup;
  dataTable: any[] = [];
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
    public  modal: NzModalService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      maDvi: [],
      tenDvi: [],
      maDanhSach: [null],
      ngayDeXuat: [new Date()],
      ngayTongHop: [null],
      trangThai: [STATUS.CHUA_TONG_HOP],
      tenTrangThai: ['Chưa tổng hợp'],
    });
  }

  ngOnInit(): void {
    try {
      this.userInfo = this.userService.getUserLogin()
      this.loaiVTHHGetAll();
      this.onChangChiCuc(this.userInfo.MA_DVI)
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async changeLoaiHangHoa(id: any) {
    if (id && id > 0) {
      let loaiHangHoa = this.dsLoaiHangHoa.filter(item => item.ma === id);
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
      this.rowItem.tenLoaiVthh = loaiHangHoa[0].ten
      this.rowItem.dviTinh = loaiHangHoa[0].maDviTinh
    }
  }
  changeCloaiHangHoa(event: any) {
    const cloaiVthh = this.listChungLoaiHangHoa.filter(item => item.ma == event);
    if (cloaiVthh.length > 0) {
      this.rowItem.tenCloaiVthh = cloaiVthh[0].ten;
    }
  }
  async loaiVTHHGetAll() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI
    })
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

  quayLai() {
    this.onClose.emit();
  }

  exportData() {}

  luu() {}

  xoaItem(index: number) {
    console.log(this.dataTable)
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: () => {
        this.dataTable.splice(index,1);
        this.updateEditCache();
        console.log(this.dataTable)
      },
    });
  }

  themMoiItem() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.rowItem.slConLai = this.rowItem.slYeuCau - this.rowItem.slDaDuyet;
    if(this.rowItem.slConLai < 0 || this.rowItem.slYeuCau > this.rowItem.slTon) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng kiểm tra lại số lượng hàng cần sửa chữa");
      return;
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

  huyEdit(idx: number): void {
    this.dataEdit[idx] = {
      data: { ...this.dataTable[idx] },
      edit: false,
    };
  }

  luuEdit(idx: number): void {
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
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
    const diemKho = this.dsDiemKho.find(item => item.maDvi == event);
    if (diemKho) {
      this.rowItem.tenDiemKho = diemKho.tenDvi;
    }
  }

  async onChangeNhaKho(event) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };

    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.dsNganLo = dsTong[DANH_MUC_LEVEL.NGAN_KHO];
    const nganLo = this.dsNhaKho.filter(item => item.maDvi == event);
    if (nganLo.length > 0) {
      this.rowItem.tenNhaKho = nganLo[0].tenDvi;
    }
  }

 async onChangeNganKho(event) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.dsLoKho = dsTong[DANH_MUC_LEVEL.LO_KHO];
   const nganLo = this.dsNganLo.filter(item => item.maDvi == event);
   if (nganLo.length > 0) {
     this.rowItem.tenNganKho = nganLo[0].tenDvi;
   }
  }

  async onChangLoKho(evevt) {
    const nganLo = this.dsLoKho.filter(item => item.maDvi == evevt);
    if (nganLo.length > 0) {
      this.rowItem.tenLoKho = nganLo[0].tenDvi;
    }
  }


}

export class IHangHongHocGiamChatLuong {
  id: number;
  loaiVthh: string;
  cloaiVthh: string;
  tenLoaiVthh: string;
  tenCloaiVthh: string;
  moTaHangHoa: string;
  maNhaKho : string;
  maDiemKho : string;
  maNganKho : string;
  maLoKho : string;
  tenDiemKho: string
  tenNhaKho : string
  tenNganKho : string
  tenLoKho : string
  maDanhSach : string;
  slTon: number;
  slYeuCau: number;
  slDaDuyet : number;
  slConLai : number;
  dviTinh: string;
  maDvi: string;
  ngayDeXuat: any;
  ngayTongHop: any;
  trangThai: any;
  lyDo: string;
  thamDinhScId: any;
  thHhhId: string
  qlhhhId: string;
}
