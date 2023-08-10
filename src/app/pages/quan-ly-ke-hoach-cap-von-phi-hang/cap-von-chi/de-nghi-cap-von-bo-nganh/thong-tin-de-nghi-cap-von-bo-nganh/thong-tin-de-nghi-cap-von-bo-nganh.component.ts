import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {v4 as uuidv4} from "uuid";
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {
  DiaDiemGiaoNhan,
  KeHoachBanDauGia,
  PhanLoTaiSan,
} from 'src/app/models/KeHoachBanDauGia';
import {UserLogin} from 'src/app/models/userlogin';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {DeXuatKeHoachBanDauGiaService} from 'src/app/services/deXuatKeHoachBanDauGia.service';
import {DonviService} from 'src/app/services/donvi.service';
import {HelperService} from 'src/app/services/helper.service';
import {DeNghiCapVonBoNganhService} from 'src/app/services/ke-hoach/von-phi/deNghiCapVanBoNganh.service';
import {UserService} from 'src/app/services/user.service';
import {thongTinTrangThaiNhap} from 'src/app/shared/commonFunction';
import {Globals} from 'src/app/shared/globals';
import {STATUS} from "../../../../../constants/status";
import {AMOUNT, AMOUNT_NO_DECIMAL, AMOUNT_TWO_DECIMAL} from "../../../../../Utility/utils";

@Component({
  selector: 'app-thong-tin-de-nghi-cap-von-bo-nganh',
  templateUrl: './thong-tin-de-nghi-cap-von-bo-nganh.component.html',
  styleUrls: ['./thong-tin-de-nghi-cap-von-bo-nganh.component.scss']
})
export class ThongTinDeNghiCapVonBoNganhComponent implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
  formData: FormGroup;
  cacheData: any[] = [];
  fileDinhKem: Array<FileDinhKem> = [];
  userLogin: UserLogin;
  STATUS = STATUS;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  listLoaiHangHoa: any[] = [];
  listLoaiTien: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  listPhuongThucThanhToan: any[] = [
    {
      ma: '1',
      giaTri: 'Tiền mặt',
    },
    {
      ma: '2',
      giaTri: 'Chuyển khoản',
    },
  ];
  userInfo: UserLogin;
  listFileDinhKem: any[] = [];
  expandSet = new Set<number>();
  bangPhanBoList: Array<any> = [];
  itemDnCapVonBn: any = {};
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  listChungLoaiHangHoa: any[] = [];
  maKeHoach: string;
  listLoaiHopDong: any[] = [];
  dsBoNganh: any[] = [];
  maxYeuCauCapThem: number = 2;
  hopDongList: any[] = [];
  chiTietList: any[] = [];
  preFixSoDn: string = "KH";
  titleSoDeNghi: string;
  hangHoaAll: any[];
  listHopDong: any[] = [];
  itemHopDongSelected: any;
  amount = AMOUNT_NO_DECIMAL;
  rowItem: IDeNghiCapVon = {
    maHopDong: null,
    soHopDong: null,
    loaiTien: null,
    donViTinh: null,
    dvCungCapHang: null,
    kinhPhiDaCap: null,
    kinhPhiDaCapNt: null,
    tyGia: null,
    duToanDuocGiao: null,
    tongTien: null,
    tongTienNt: null,
    kinhPhiChuaCapNt: null,
    kinhPhiChuaCap: null,
    maVatTu: null,
    tenVatTu: null,
    maVatTuCha: null,
    tenVatTuCha: null,
    nganHang: null,
    soLuong: null,
    soTaiKhoan: null,
    tenHangHoa: null,
    donGia: null,
    thanhTien: null,
    ycCapThem: null,
    chiTiet: [],
    // thêm theo thiết kế mới
    ycCapThemNt: null,
    edit: false,
    idVirtual: null
  }

  rowItemDetailHhh: ItemDetailHh = {
    loaiVthh: null,
    cloaiVthh: null,
    tenLoaiVthh: null,
    tenCloaiVthh: null,
    tenHang: null,
    donGia: null,
    thanhTien: null,
    thanhTienNt: null,
    slDeNghiCapVon: null,
    donViTinh: null,
  }

  showEdit: boolean = false;

  tongCong: any = {
    tongThanhTien: 0,
    tongKinhPhiDaCap: 0,
    tongYeuCauCapThem: 0,
  }

  tongCongHangHoa: any = {
    thanhTienNt: 0,
    thanhTien: 0,
  }

  constructor(
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private donviService: DonviService,
    private helperService: HelperService,
    private deNghiCapVonBoNganhService: DeNghiCapVonBoNganhService,
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.itemDnCapVonBn.trangThai = STATUS.DANG_NHAP_DU_LIEU;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    await Promise.all([
      this.initForm(),
      this.getListBoNganh(),
      this.loadLoaiTienTe(),
    ]);
    await this.loadChiTiet(this.idInput);
    await this.loaiVTHHGetAll(),
      this.spinner.hide();
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.deNghiCapVonBoNganhService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.itemDnCapVonBn = res.data;
          // this.initForm();
          this.formData = this.fb.group({
            nam: [this.itemDnCapVonBn ? this.itemDnCapVonBn.nam : null, [Validators.required],],
            boNganh: [this.itemDnCapVonBn ? this.itemDnCapVonBn.maBoNganh : null, [Validators.required],],
            soDeNghi: [this.itemDnCapVonBn ? this.itemDnCapVonBn.soDeNghi : null],
            ngayDeNghi: [this.itemDnCapVonBn ? this.itemDnCapVonBn.ngayDeNghi : null],
            ghiChu: [this.itemDnCapVonBn ? this.itemDnCapVonBn.ghiChu : null],
            trangThai: [this.itemDnCapVonBn ? this.itemDnCapVonBn.trangThai : null],
          });
          this.setTitle();
          if (this.itemDnCapVonBn.fileDinhKems) {
            this.listFileDinhKem = this.itemDnCapVonBn.fileDinhKems;
          }
          if (this.itemDnCapVonBn.chiTietList) {
            this.chiTietList = this.itemDnCapVonBn.chiTietList;
            if (this.chiTietList && this.chiTietList.length > 0) {
              this.chiTietList.forEach(item => {
                if (item.chiTietHang) {
                  item.chiTiet = JSON.parse(item.chiTietHang);
                }
              })
              this.selectRow(this.chiTietList[0]);
            }
          }
          this.tinhTong();
        }
      }
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      // không lấy bộ tài chính
      this.dsBoNganh = res.data.filter(item => item.maDvi !== '01')
    }
  }

  initForm() {
    this.formData = this.fb.group({
      nam: [this.itemDnCapVonBn ? this.itemDnCapVonBn.nam : null, [Validators.required],],
      boNganh: [this.itemDnCapVonBn ? this.itemDnCapVonBn.maBoNganh : null, [Validators.required],],
      soDeNghi: [this.itemDnCapVonBn ? this.itemDnCapVonBn.soDeNghi : null],
      ngayDeNghi: [this.itemDnCapVonBn ? this.itemDnCapVonBn.ngayDeNghi : null],
      ghiChu: [this.itemDnCapVonBn ? this.itemDnCapVonBn.ghiChu : null],
      trangThai: [this.itemDnCapVonBn ? this.itemDnCapVonBn.trangThai : null],
    });
    this.setTitle();
  }

  async loadDonVi() {
    const res = await this.donviService.layDonViCon();
    this.listChiCuc = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          value: res.data[i].maDvi,
          text: res.data[i].tenDvi,
        };
        this.listChiCuc.push(item);
      }
    }
  }

  async changeBoNganh() {
    this.rowItem.tenVatTuCha = null;
    this.rowItem.maVatTuCha = null;
    let bnObject = this.dsBoNganh.find(item => item.code == this.formData.value.boNganh);
    this.titleSoDeNghi = this.preFixSoDn;
    if (bnObject) {
      this.titleSoDeNghi = "/" + bnObject.code + "-" + this.preFixSoDn;
    }
    let hangHoa = await this.danhMucService.getDanhMucHangHoaDvql({
      "maDvi": bnObject.maDvi
    }).toPromise();
    if (hangHoa) {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        this.hangHoaAll = hangHoa.data;
        this.listLoaiHangHoa = this.hangHoaAll.filter(element => element.maHangHoa.length == 4)
      }
    }
    this.loadListHopDong(bnObject);
  }

  back() {
    this.showListEvent.emit();
  }

  async loaiVTHHGetAll() {
    try {

      let bnObject = this.dsBoNganh.find(item => item.code == this.formData.value.boNganh);
      if (bnObject) {
        await this.danhMucService.getDanhMucHangHoaDvql({
          "maDvi": bnObject.maDvi
        }).subscribe((hangHoa) => {
          if (hangHoa.msg == MESSAGE.SUCCESS) {
            this.hangHoaAll = hangHoa.data;
            this.listLoaiHangHoa = this.hangHoaAll.filter(item => item.maHangHoa.length == 4)
            // hangHoa.data.forEach((item) => {
            // if (item.cap === "1" && item.ma != '01') {
            //   this.listLoaiHangHoa = [
            //     ...this.listLoaiHangHoa,
            //     item
            //   ];
            // } else {
            //   this.listLoaiHangHoa = [
            //     ...this.listLoaiHangHoa,
            //     ...item.child
            //   ];
            // }
            // });
          }
        });
      }
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changeLoaiHangHoa() {
    this.listChungLoaiHangHoa = this.hangHoaAll.filter(element => element.maHangHoa.length > 4 &&
      element.maHangHoa.substring(0, 4) == this.rowItemDetailHhh.loaiVthh)
    let hangHoa = this.listLoaiHangHoa.find(s => s.maHangHoa == this.rowItemDetailHhh.loaiVthh);
    if (hangHoa) {
      this.rowItemDetailHhh.tenLoaiVthh = hangHoa.tenHangHoa;
      this.rowItemDetailHhh.donViTinh = hangHoa.maDviTinh;
    }
  }

  changeChungLoaiHangHoa() {
    let item = this.listChungLoaiHangHoa.find(s => s.maHangHoa == this.rowItemDetailHhh.cloaiVthh)
    if (item) {
      this.rowItemDetailHhh.tenCloaiVthh = item.tenHangHoa;
      this.rowItemDetailHhh.donViTinh = item.maDviTinh;
    }
  }

  async changeMaHopDong() {
    let hopDong = this.listHopDong.find(item => item.maHopDong == this.rowItem.maHopDong);
    if (hopDong) {
      this.rowItem.soHopDong = hopDong.soHopDong;
      this.rowItem.loaiTien = hopDong.loaiTien;
      this.rowItem.dvCungCapHang = hopDong.dvCungCapHang;
      this.rowItem.soTaiKhoan = hopDong.soTaiKhoan;
      this.rowItem.nganHang = hopDong.nganHang;
      this.rowItem.tongTienNt = hopDong.tongTienNt;
      this.rowItem.tongTien = hopDong.tongTien;
    }
  }

  changeThanhTien() {
    if (this.rowItemDetailHhh.slDeNghiCapVon && this.rowItemDetailHhh.donGia) {
      let thanhTien = this.rowItemDetailHhh.slDeNghiCapVon * this.rowItemDetailHhh.donGia;
      this.maxYeuCauCapThem = thanhTien;
      this.rowItemDetailHhh.thanhTien = thanhTien;
      this.rowItemDetailHhh.thanhTienNt = thanhTien;
    }
  }

  changeLoaiTien() {
    if (this.rowItem.loaiTien && this.rowItem.loaiTien != '01' && this.rowItem.tyGia) {
      this.rowItem.tongTien = this.rowItem.tongTienNt ? this.rowItem.tongTienNt * this.rowItem.tyGia : 0;
      this.rowItem.kinhPhiDaCap = this.rowItem.kinhPhiDaCapNt ? this.rowItem.kinhPhiDaCapNt * this.rowItem.tyGia : 0;
      this.rowItem.ycCapThem = this.rowItem.ycCapThemNt ? this.rowItem.ycCapThemNt * this.rowItem.tyGia : 0;
    }
  }

  calCulateKinhPhiChuaCap() {
    this.rowItem.kinhPhiChuaCap = this.rowItem.tongTien ? (this.rowItem.kinhPhiDaCap ? this.rowItem.tongTien - this.rowItem.kinhPhiDaCap : this.rowItem.tongTien) : this.rowItem.tongTien;
    this.rowItem.kinhPhiChuaCapNt = this.rowItem.tongTienNt ? (this.rowItem.kinhPhiDaCapNt ? this.rowItem.tongTienNt - this.rowItem.kinhPhiDaCapNt : this.rowItem.tongTienNt) : this.rowItem.tongTienNt;
  }

  changeThanhTienEdit(id) {
    if (this.itemHopDongSelected.chiTiet[id].slDeNghiCapVon && this.itemHopDongSelected.chiTiet[id].donGia) {
      let thanhTien = this.itemHopDongSelected.chiTiet[id].slDeNghiCapVon * this.itemHopDongSelected.chiTiet[id].donGia;
      this.itemHopDongSelected.chiTiet[id].thanhTien = thanhTien;
    }
  }

  themHopDong() {
    if (!this.formData.get("boNganh").value) {
      this.notification.warning(MESSAGE.WARNING, "Cần chọn bộ ngành đề nghị trước.");
      this.clearHopDong();
      return;
    }
    this.calCulateKinhPhiChuaCap();
    let isValid = true;
    for (let key in this.rowItem) {
      if (this.rowItem[key] === null && (key === 'soHopDong' || key == 'loaiTien' || key == 'tongTien' || key == 'duToanDuocGiao' || key == 'ycCapThem')) {
        isValid = false;
      }
    }
    if (this.rowItem.tongTien && this.rowItem.duToanDuocGiao) {
      if (this.rowItem.tongTien > this.rowItem.duToanDuocGiao) {
        this.notification.warning(MESSAGE.WARNING, "Tổng tiền hợp đồng lớn hơn dự toán được giao, vui lòng kiểm tra lại.");
        return;
      }
    }
    if (this.rowItem.ycCapThem > this.rowItem.kinhPhiChuaCap) {
      this.notification.warning(MESSAGE.WARNING, "Tổng tiền yêu cầu cấp thêm lớn hơn kinh phí chưa cấp, vui lòng kiểm tra lại.");
      return;
    }
    if (isValid) {
      this.rowItem.idVirtual = uuidv4();
      this.rowItem.chiTiet = [];
      this.chiTietList.push(this.rowItem);
      this.selectRow(this.chiTietList[0]);
      this.tinhTong();
      this.clearHopDong();
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
    }
  }

  themChiTietHangHoa() {
    let isValid = true;
    for (let key in this.rowItemDetailHhh) {
      if (this.rowItemDetailHhh[key] === null && (key == 'loaiVthh' || key == 'donGia' || key == 'slDeNghiCapVon')) {
        isValid = false;
      }
    }
    let totalTienHang = this.rowItemDetailHhh.thanhTien;
    this.itemHopDongSelected.chiTiet.forEach((item) => {
      totalTienHang += item.thanhTien;
    })
    if (totalTienHang > this.itemHopDongSelected.ycCapThem) {
      this.notification.warning(MESSAGE.WARNING, "Tổng tiền các loại hàng trong lần đề nghị này lớn hơn số tiền yêu cầu cấp thêm.");
      return;
    }
    if (isValid) {
      this.itemHopDongSelected.chiTiet.push(this.rowItemDetailHhh);
      this.tinhTongChiTietHangHoa();
      this.clearChiTietHangHoa();
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
    }

  }

  clearHopDong() {
    this.rowItem = {
      maHopDong: null,
      soHopDong: null,
      loaiTien: null,
      donViTinh: null,
      dvCungCapHang: null,
      kinhPhiDaCap: null,
      kinhPhiDaCapNt: null,
      tyGia: null,
      duToanDuocGiao: null,
      tongTien: null,
      tongTienNt: null,
      kinhPhiChuaCapNt: null,
      kinhPhiChuaCap: null,
      maVatTu: null,
      tenVatTu: null,
      maVatTuCha: null,
      tenVatTuCha: null,
      nganHang: null,
      soLuong: null,
      soTaiKhoan: null,
      tenHangHoa: null,
      donGia: null,
      thanhTien: null,
      ycCapThem: null,
      chiTiet: [],
      // thêm theo thiết kế mới
      ycCapThemNt: null,
      edit: false,
      idVirtual: null
    }
  }

  async selectRow(data) {
    this.chiTietList.forEach(item => {
      item.selected = false;
    })
    data.selected = true;
    this.itemHopDongSelected = data;
    this.tinhTongChiTietHangHoa();
  }

  clearChiTietHangHoa() {
    this.rowItemDetailHhh = {
      loaiVthh: null,
      cloaiVthh: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      tenHang: null,
      donGia: null,
      thanhTien: null,
      thanhTienNt: null,
      slDeNghiCapVon: null,
      donViTinh: null,
    }
  }

  showEditItem(idx: number, type: string) {
    if (this.chiTietList.length > 0) {
      this.chiTietList.forEach((item, index) => {
        if (index === idx) {
          if (type === 'show') {
            item.edit = true;
          } else {
            item.edit = false;
          }
        }
      })
    }
  }

  showEditItemHangHoa(idx: number, type: string) {
    if (this.itemHopDongSelected.chiTiet.length > 0) {
      this.itemHopDongSelected.chiTiet.forEach((item, index) => {
        if (index === idx) {
          if (type === 'show') {
            item.edit = true;
          } else {
            item.edit = false;
          }
        }
      })
    }
    this.tinhTongChiTietHangHoa();
  }

  xoaItem(idx: number) {
    if (this.chiTietList.length > 0) {
      this.chiTietList.splice(idx, 1);
    }
    this.tinhTong();
  }

  xoaItemHangHoa(idx: number) {
    if (this.itemHopDongSelected.chiTiet.length > 0) {
      this.itemHopDongSelected.chiTiet.splice(idx, 1);
    }
    this.tinhTongChiTietHangHoa();
  }

  tinhTong() {
    this.tongCong = {
      tongTien: 0,
      tongDuToanDuocGiao: 0,
      tongKinhPhiChuaCap: 0,
      tongYcCapThem: 0,
    }
    this.chiTietList.forEach((item) => {
      this.tongCong.tongTien += item.tongTien;
      this.tongCong.tongDuToanDuocGiao += item.duToanDuocGiao;
      this.tongCong.tongKinhPhiChuaCap += item.kinhPhiChuaCap;
      this.tongCong.tongYcCapThem += item.ycCapThem;
    })
  }

  tinhTongChiTietHangHoa() {
    this.tongCongHangHoa = {
      thanhTienNt: 0,
      thanhTien: 0,
    }
    this.itemHopDongSelected.chiTiet.forEach((item) => {
      this.tongCongHangHoa.thanhTienNt += item.thanhTienNt;
      this.tongCongHangHoa.thanhTien += item.thanhTien;
    })
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async save(isHoanThanh?: boolean) {
    if (isHoanThanh) {
      this.formData.controls['soDeNghi'].setValidators(Validators.required);
      this.formData.controls['ngayDeNghi'].setValidators(Validators.required);
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
        return;
      }
    }
    this.spinner.show();
    try {
      if (this.chiTietList && this.chiTietList.length > 0) {
        this.chiTietList.forEach(item => {
          item.chiTietHang = item.chiTiet && item.chiTiet.length > 0 ? JSON.stringify(item.chiTiet) : JSON.stringify([]);
        })
      }
      let body = {
        "chiTietList": this.chiTietList,
        "fileDinhKemReqs": this.listFileDinhKem,
        "ghiChu": this.formData.value.ghiChu,
        "maBoNganh": this.formData.value.boNganh,
        "nam": this.formData.value.nam,
        "ngayDeNghi": this.formData.value.ngayDeNghi ? dayjs(this.formData.value.ngayDeNghi).format("YYYY-MM-DD") : null,
        "soDeNghi": this.formData.value.soDeNghi,
        "id": this.idInput,
      }
      // return;
      if (this.idInput > 0) {
        let res = await this.deNghiCapVonBoNganhService.sua(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (isHoanThanh) {
            this.guiDuyet(this.idInput);
          } else
            this.notification.success(MESSAGE.SUCCESS, "Cập nhật thành công");
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.deNghiCapVonBoNganhService.them(body);
        if (res.msg == MESSAGE.SUCCESS) {
          this.idInput = res.data.id;
          if (isHoanThanh) {
            this.guiDuyet(this.idInput);
          } else
            this.notification.success(MESSAGE.SUCCESS, "Lưu dữ liệu thành công");
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(
        MESSAGE.ERROR,
        e?.error?.message ?? MESSAGE.SYSTEM_ERROR,
      );
    }
  }


  async guiDuyet(id?) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hoàn thành cập nhật?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: id ? id : this.idInput,
            trangThaiId: STATUS.DA_HOAN_THANH,
          };
          let res = await this.deNghiCapVonBoNganhService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.GUI_DUYET_SUCCESS,
            );
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDo: text,
            trangThaiId: this.globals.prop.NHAP_TU_CHOI_TP,
          };
          switch (this.itemDnCapVonBn.trangThai) {
            case this.globals.prop.NHAP_CHO_DUYET_TP:
              body.trangThaiId = this.globals.prop.NHAP_TU_CHOI_TP;
              break;
            case this.globals.prop.NHAP_CHO_DUYET_LD_CUC:
              body.trangThaiId = this.globals.prop.NHAP_TU_CHOI_LD_CUC;
              break;
          }

          const res = await this.deXuatKeHoachBanDauGiaService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  async loadLoaiTienTe() {
    this.listLoaiTien = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_TIEN_TE');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiTien = res.data;
    }
  }

  getLabelLoaiTien(loaiTien) {
    return this.listLoaiTien.find(item => item.ma == loaiTien).giaTri;
  }

  async loadListHopDong(objBoNganh) {
    this.listHopDong = [];
    let res = await this.deNghiCapVonBoNganhService.dsHopDongTheoBoNganh({
      "maBoNganh": objBoNganh.code
    });
    if (res) {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listHopDong = res.data;
      }
    }
  }

  setTitle() {
    let trangThai = this.itemDnCapVonBn.trangThai;
    switch (trangThai) {
      case STATUS.DANG_NHAP_DU_LIEU: {
        this.titleStatus = 'Đang nhập dữ liệu';
        break;
      }
      case STATUS.TU_CHOI_TP: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - TP';
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - TP';
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        this.iconButtonDuyet = 'htvbdh_tcdt_baocao2';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - LĐ Cục';
        break;
      }
      case STATUS.TU_CHOI_LDC: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - LĐ Cục';
        break;
      }
      case STATUS.BAN_HANH: {
        this.titleStatus = 'Ban hành';
        this.styleStatus = 'da-ban-hanh';
        break;
      }
      case STATUS.HOAN_THANH_CAP_NHAT: {
        this.titleStatus = 'Hoàn thành';
        this.styleStatus = 'da-ban-hanh';
        break;
      }
    }
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }
}

interface IDeNghiCapVon {
  maHopDong: string,
  soHopDong: string,
  loaiTien: string,
  donViTinh: string,
  dvCungCapHang: string,
  kinhPhiDaCap: number,
  kinhPhiDaCapNt: number,
  tyGia: number,
  duToanDuocGiao: number,
  tongTien: number,
  tongTienNt: number,
  kinhPhiChuaCapNt: number,
  kinhPhiChuaCap: number,
  maVatTu: string,
  tenVatTu: string,
  maVatTuCha: string,
  tenVatTuCha: string,
  nganHang: string,
  soLuong: number,
  soTaiKhoan: number,
  tenHangHoa: string,
  donGia: number,
  thanhTien: number,
  ycCapThem: number,
  // thêm theo thiết kế mới
  ycCapThemNt: number,
  chiTiet: [],
  edit: boolean,
  idVirtual: string;
}

export class ItemDetailHh {
  loaiVthh: string;
  cloaiVthh: string;
  tenLoaiVthh: string;
  tenCloaiVthh: string;
  tenHang: string;
  donGia: number;
  thanhTien: number;
  thanhTienNt: number;
  slDeNghiCapVon: number;
  donViTinh: number;
}
