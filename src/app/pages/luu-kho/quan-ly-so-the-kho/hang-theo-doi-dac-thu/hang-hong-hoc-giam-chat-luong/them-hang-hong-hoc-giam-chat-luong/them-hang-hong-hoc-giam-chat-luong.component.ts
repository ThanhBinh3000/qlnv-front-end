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
import {QuanLyDanhSachHangHongHocService} from "../../../../../../services/quanLyDanhSachHangHongHoc.service";
import {HelperService} from "../../../../../../services/helper.service";

@Component({
  selector: 'app-them-hang-hong-hoc-giam-chat-luong',
  templateUrl: './them-hang-hong-hoc-giam-chat-luong.component.html',
  styleUrls: ['./them-hang-hong-hoc-giam-chat-luong.component.scss'],
})
export class ThemHangHongHocGiamChatLuongComponent implements OnInit {
  @Input() idInput : number;
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
    private quanLyDanhSachHangHongHocService: QuanLyDanhSachHangHongHocService,
    private helperService: HelperService,
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
      this.getDetail(this.idInput)
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async changeLoaiHangHoa(id: any, type?: any) {
    if (id && id > 0) {
      let loaiHangHoa = this.dsLoaiHangHoa.filter(item => item.ma === id);
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
      if (!type) {
        this.rowItem.tenLoaiVthh = loaiHangHoa[0].ten
        this.rowItem.dviTinh = loaiHangHoa[0].maDviTinh
        this.rowItem.cloaiVthh = null;
      } else {
        type.tenLoaiVthh = loaiHangHoa[0].ten
        type.dviTinh = loaiHangHoa[0].maDviTinh
        type.cloaiVthh = null;
      }
    }
  }
  changeCloaiHangHoa(event: any, type?: any) {
    const cloaiVthh = this.listChungLoaiHangHoa.filter(item => item.ma == event);
    if (cloaiVthh.length > 0) {
      if (type) {
        type.tenCloaiVthh = cloaiVthh[0].ten;
      } else {
        this.rowItem.tenCloaiVthh = cloaiVthh[0].ten;
      }
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

  async getDetail(id: number) {
    if (this.idInput > 0) {
      let res = await this.quanLyDanhSachHangHongHocService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data;
        this.formData.patchValue({
          id: dataDetail.id,
          maDvi: dataDetail.maDvi,
          tenDvi: dataDetail.tenDvi,
          maDanhSach: dataDetail.maDanhSach,
          ngayDeXuat: dataDetail.ngayDeXuat,
          ngayTongHop: dataDetail.ngayTongHop,
          trangThai: dataDetail.trangThai,
          tenTrangThai:dataDetail.tenTrangThai,
        })
        this.dataTable = dataDetail.ctList
      }
      this.updateEditCache()
    }

  }


  quayLai() {
    this.onClose.emit();
  }

 async exportData(id) {
    let res = await this.quanLyDanhSachHangHongHocService.exportList(id);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
    } else {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.ERROR);
    }
  }

  async luu() {
      this.spinner.show();
      let body = this.formData.value;
      body.ctReqs = this.dataTable;
      body.maDvi = this.userInfo.MA_DVI;
      let res
      if (this.idInput > 0) {
        res = await this.quanLyDanhSachHangHongHocService.update(body);
      } else {
        res = await this.quanLyDanhSachHangHongHocService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {{
          if (this.idInput > 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          }
          this.quayLai();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
  }

  xoaItem(index: number) {
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

  editItem(idx: number): void {
    this.changeLoaiHangHoa( this.dataEdit[idx].data.loaiVthh)
    this.changeCloaiHangHoa( this.dataEdit[idx].data.cloaiVthh)
    this.onChangeDiemKho( this.dataEdit[idx].data.maDiemKho)
    this.onChangeNhaKho( this.dataEdit[idx].data.maNhaKho)
    this.onChangeNganKho( this.dataEdit[idx].data.maNganKho)
    this.onChangLoKho( this.dataEdit[idx].data.maLoKho)
    this.dataEdit[idx].edit = true;
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
      this.dataEdit[index].data.slConLai =  this.dataEdit[index].data.slYeuCau -  this.dataEdit[index].data.slDaDuyet
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

  async onChangeDiemKho(event, type?: any) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.dsNhaKho = dsTong[DANH_MUC_LEVEL.NHA_KHO];
    const diemKho = this.dsDiemKho.find(item => item.maDvi == event);
    if (diemKho) {
      if (type) {
        type.tenDiemKho = diemKho.tenDvi;
        type.maNhaKho = null;
        type.maNganKho = null;
        type.maLoKho = null;
      } else {
        this.rowItem.tenDiemKho = diemKho.tenDvi;
        this.rowItem.maNhaKho = null;
        this.rowItem.maNganKho = null;
        this.rowItem.maLoKho = null;
      }
    }
  }

  async onChangeNhaKho(event, type?: any) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };

    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.dsNganLo = dsTong[DANH_MUC_LEVEL.NGAN_KHO];
    const nganLo = this.dsNhaKho.filter(item => item.maDvi == event);
    if (nganLo.length > 0) {
      if (type) {
        type.tenNhaKho = nganLo[0].tenDvi;
        type.maNganKho = null;
        type.maLoKho = null;
      } else {
        this.rowItem.tenNhaKho = nganLo[0].tenDvi;
        this.rowItem.maNganKho = null;
        this.rowItem.maLoKho = null;
      }

    }
  }

 async onChangeNganKho(event, type?: any) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.dsLoKho = dsTong[DANH_MUC_LEVEL.LO_KHO];
   const nganLo = this.dsNganLo.filter(item => item.maDvi == event);
   if (nganLo.length > 0) {
     if (type) {
       type.tenNganKho = nganLo[0].tenDvi;
       type.maLoKho = null
     } else {
       this.rowItem.tenNganKho = nganLo[0].tenDvi;
       this.rowItem.maLoKho = null
     }

   }
  }

  async onChangLoKho(evevt, type?: any) {
    const nganLo = this.dsLoKho.filter(item => item.maDvi == evevt);
    if (nganLo.length > 0) {
      if (type) {
        type.tenLoKho = nganLo[0].tenDvi;
      } else {
        this.rowItem.tenLoKho = nganLo[0].tenDvi;
      }

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
}
