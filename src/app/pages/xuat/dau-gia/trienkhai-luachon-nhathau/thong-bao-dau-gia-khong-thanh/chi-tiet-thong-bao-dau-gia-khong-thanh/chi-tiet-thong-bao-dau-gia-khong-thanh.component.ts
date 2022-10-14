import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemBienbanNghiemThuKeLotComponent } from 'src/app/components/dialog/dialog-them-bien-ban-nghiem-thu-ke-lot/dialog-them-bien-ban-nghiem-thu-ke-lot.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import dayjs from 'dayjs';
import { ThongBaoDauGiaKhongThanhCongService } from 'src/app/services/thongBaoDauGiaKhongThanhCong.service';
import { ThongBaoDauGiaTaiSanService } from 'src/app/services/thongBaoDauGiaTaiSan.service';
import { DiaDiemNhapKho, ChiTietDiaDiemNhapKho } from './../../../../../../components/dialog/dialog-them-dia-diem-nhap-kho/dialog-them-dia-diem-nhap-kho.component';
import { BienBanBanDauGia, Cts, Ct1s } from './../../../../../../models/BienBanBanDauGia';

@Component({
  selector: 'app-chi-tiet-thong-bao-dau-gia-khong-thanh',
  templateUrl: './chi-tiet-thong-bao-dau-gia-khong-thanh.component.html',
  styleUrls: ['./chi-tiet-thong-bao-dau-gia-khong-thanh.component.scss']
})
export class ChiTietThongBaoDauGiaKhongThanhComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  userInfo: UserLogin;
  detail: any = {};
  detailGiaoNhap: any = {};
  detailHopDong: any = {};
  listNam: any[] = [];
  yearNow: number = 0;
  expandSet = new Set<number>();
  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listTieuChuan: any[] = [];
  listSoQuyetDinh: any[] = [];
  listLoaiKho: any[] = [];
  listPTBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  listFileDinhKem: any[] = [];
  listOfData: any[] = [];
  mapOfExpandedData2: { [maDvi: string]: any[] } = {};
  listThongBaoDauGiaTaiSan: Array<any> = [];
  bangPhanBoList: Array<any> = [];
  dsToChuc: Array<any> = [];
  dsChiTietCtsClone: Array<Cts> = [];

  dsLoaiHangHoa: any[] = [];
  maLoaiVthh: string = '';
  bienBanBanDauGia: BienBanBanDauGia = new BienBanBanDauGia();
  bienBanResult: any = {};
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  constructor(
    private spinner: NgxSpinnerService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private thongBaoDauGiaKhongThanhCongService: ThongBaoDauGiaKhongThanhCongService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private danhMucService: DanhMucService,
    private thongTinHopDongService: ThongTinHopDongService,
    private donViService: DonviService,
    private thongBanDauGiaTaiSanService: ThongBaoDauGiaTaiSanService,
  ) { }

  async ngOnInit() {
    console.log(this.isView);
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.detail.maDonVi = this.userInfo.MA_DVI;
      this.detail.tenDvi = this.userInfo.TEN_DVI;
      this.detail.trangThai = "00";
      this.detail.ngayToChuc = new Date();
      this.detail.nam = this.detail.ngayToChuc.getFullYear();
      await Promise.all([
        this.loadDiemKho(),
        this.loadTieuChuan(),
        this.loadLoaiKho(),
        this.loadPTBaoQuan(),
        this.loadDonViTinh(),
        this.loaiVTHHGetAll(),
        this.loadThongBaoDauGiaTaiSan(),
      ]);
      if (this.id > 0 || this.isView) {
        await this.loadChiTiet(this.id);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadThongBaoDauGiaTaiSan() {
    let body = {
    };
    let res = await this.thongBanDauGiaTaiSanService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listThongBaoDauGiaTaiSan = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeMaThongBao(id: number) {
    if (!id) {
      return;
    }
    this.spinner.show();
    let res = await this.thongBanDauGiaTaiSanService.loadChiTiet(id);
    if (res.msg == MESSAGE.SUCCESS) {
      this.bienBanResult = res.data;
      this.detail.tenVatTuCha = this.dsLoaiHangHoa.find(e => e.ma == res.data.maVatTuCha) ? (this.dsLoaiHangHoa.find(e => e.ma == res.data.maVatTuCha).id).toString() : null;
      const phanLoTaiSans = res.data.taiSanBdgList;
      if (phanLoTaiSans && phanLoTaiSans.length > 0) {
        for (let i = 0; i <= phanLoTaiSans.length - 1; i++) {
          for (let j = i + 1; j <= phanLoTaiSans.length; j++) {
            if (phanLoTaiSans.length == 1 || phanLoTaiSans[i].chiCuc === phanLoTaiSans[j].chiCuc) {
              const diaDiemNhapKho = new DiaDiemNhapKho();
              diaDiemNhapKho.maDvi = phanLoTaiSans[i].maChiCuc;
              diaDiemNhapKho.tenDonVi = phanLoTaiSans[i].tenChiCuc;
              diaDiemNhapKho.slDaLenKHBan = phanLoTaiSans[i].slDaLenKHBan;
              diaDiemNhapKho.soLuong = phanLoTaiSans[i].soLuong;
              const chiTietDiaDiem = new ChiTietDiaDiemNhapKho();
              chiTietDiaDiem.tonKho = phanLoTaiSans[i].tonKho;
              chiTietDiaDiem.giaKhoiDiem = phanLoTaiSans[i].giaKhoiDiem;
              chiTietDiaDiem.soTienDatTruoc = phanLoTaiSans[i].soTienDatTruoc;
              chiTietDiaDiem.maDiemKho = phanLoTaiSans[i].maDiemKho;
              chiTietDiaDiem.tenDiemKho = phanLoTaiSans[i].tenDiemKho;
              chiTietDiaDiem.maNhaKho = phanLoTaiSans[i].maNhaKho;
              chiTietDiaDiem.tenNhaKho = phanLoTaiSans[i].tenNhaKho;
              chiTietDiaDiem.maNganKho = phanLoTaiSans[i].maNganKho;
              chiTietDiaDiem.tenNganKho = phanLoTaiSans[i].tenNganKho;
              chiTietDiaDiem.maNganLo = phanLoTaiSans[i].maLoKho;
              chiTietDiaDiem.tenLoKho = phanLoTaiSans[i].tenLoKho;
              chiTietDiaDiem.chungLoaiHh = phanLoTaiSans[i].chungLoaiHh;
              chiTietDiaDiem.donViTinh = phanLoTaiSans[i].donViTinh;
              chiTietDiaDiem.tenChungLoaiHh = phanLoTaiSans[i].tenChungLoaiHh;
              chiTietDiaDiem.maDonViTaiSan = phanLoTaiSans[i].maDvTaiSan;
              chiTietDiaDiem.soLuong = phanLoTaiSans[i].soLuong;
              chiTietDiaDiem.donGiaChuaVAT = phanLoTaiSans[i].donGia;
              chiTietDiaDiem.idVirtual = phanLoTaiSans[i].id;
              diaDiemNhapKho.chiTietDiaDiems.push(chiTietDiaDiem);
              this.bangPhanBoList.push(diaDiemNhapKho);
            }
          }
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (this.typeVthh && this.typeVthh !== item.ma) {
              return;
            }
            if (item.cap === "1" && item.ma !== '01') {
              this.dsLoaiHangHoa = [...this.dsLoaiHangHoa, item];
            }
            else {
              this.dsLoaiHangHoa = [...this.dsLoaiHangHoa, ...item.child];
            }
          })
        }
      })
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async onChangeLoaiHH(id: number) {
    if (id && id > 0) {
    }
  }

  collapse2(array: any[], data: any, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.idVirtual === d.idVirtual)!;
          target.expand = false;
          this.collapse2(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList2(root: any): any[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode2(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }
    return array;
  }

  visitNode2(node: any, hashMap: { [maDvi: string]: boolean }, array: any[]): void {
    if (!hashMap[node.idVirtual]) {
      hashMap[node.idVirtual] = true;
      array.push(node);
    }
  }

  caculatorSoLuong(item: any) {
    if (item) {
      item.thanhTienTn = (item?.soLuongTn ?? 0) * (item?.donGiaTn ?? 0);
      item.tongGtri = (item?.thanhTienTn ?? 0) + (item?.thanhTienQt ?? 0);
    }
  }

  caculatorThanhTienTN() {
    if (this.detail && this.detail?.detail && this.detail?.detail.length > 0) {
      let sum = this.detail?.detail.map(item => item.thanhTienTn).reduce((prev, next) => prev + next);
      return sum ?? 0;
    }
    return 0;
  }

  caculatorThanhTienQT() {
    if (this.detail && this.detail?.detail && this.detail?.detail.length > 0) {
      let sum = this.detail?.detail.map(item => item.thanhTienQt).reduce((prev, next) => prev + next);
      return sum ?? 0;
    }
    return 0;
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  async loadSoQuyetDinh() {
    let body = {
      "denNgayQd": null,
      "loaiQd": "",
      "maDvi": this.userInfo.MA_DVI,
      "maVthh": this.typeVthh,
      "namNhap": null,
      "ngayQd": "",
      "orderBy": "",
      "orderDirection": "",
      "paggingReq": {
        "limit": 1000,
        "orderBy": "",
        "orderType": "",
        "page": 0
      },
      "soHd": "",
      "soQd": null,
      "str": "",
      "trangThai": this.globals.prop.NHAP_BAN_HANH,
      "tuNgayQd": null,
      "veViec": null
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeSoQuyetDinh() {
    let quyetDinh = this.listSoQuyetDinh.filter(x => x.id == this.detail.quyetDinhNhapId);
    if (quyetDinh && quyetDinh.length > 0) {
      this.detailGiaoNhap = quyetDinh[0];
      await this.getHopDong(this.detailGiaoNhap.soHd);
    }
  }

  async loadTieuChuan() {
    let body = {
      "maHang": this.typeVthh,
      "namQchuan": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenQchuan": null,
      "trangThai": "01"
    }
    let res = await this.danhMucService.traCuuTieuChuanKyThuat(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content.length > 0) {
        if (res.data.content[0].children && res.data.content[0].children.length > 0) {
          this.listTieuChuan = res.data.content[0].children;
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeChiTieu(item) {
    if (item) {
      let getChiTieu = this.listTieuChuan.filter(x => x.tenTchuan == item.tenChiTieu);
      if (getChiTieu && getChiTieu.length > 0) {
        item.tieuChuan = getChiTieu[0].chiSoNhap;
        item.phuongPhapXacDinh = getChiTieu[0].phuongPhap;
      }
    }
  }

  async loadDiemKho() {
    let body = {
      maDviCha: this.detail.maDonVi,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach(element => {
          if (element && element.capDvi == '3' && element.children) {
            this.listDiemKho = [
              ...this.listDiemKho,
              ...element.children
            ]
          }
        });
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDiemKho(fromChiTiet: boolean) {
    let diemKho = this.listDiemKho.filter(x => x.key == this.detail.maDiemKho);
    this.detail.maNhaKho = null;
    if (diemKho && diemKho.length > 0) {
      this.listNhaKho = diemKho[0].children;
      if (fromChiTiet) {
        this.changeNhaKho(fromChiTiet);
      }
    }
  }

  changeNhaKho(fromChiTiet: boolean) {
    let nhaKho = this.listNhaKho.filter(x => x.key == this.detail.maNhaKho);
    if (nhaKho && nhaKho.length > 0) {
      this.listNganKho = nhaKho[0].children;
      if (fromChiTiet) {
        this.changeNganKho();
      }
    }
  }

  changeNganKho() {
    let nganKho = this.listNganKho.filter(x => x.key == this.detail.maNganKho);
    if (nganKho && nganKho.length > 0) {
      this.listNganLo = nganKho[0].children;
    }
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.thongBaoDauGiaKhongThanhCongService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          console.log(res.data)
          this.detail = res.data;
          this.changeDiemKho(true);
          this.listFileDinhKem = this.detail.fileDinhKems;
          const tbBDG = this.listThongBaoDauGiaTaiSan.find(e => e.id == this.detail.thongBaoBdgId);
          if (tbBDG) {
            this.changeMaThongBao(tbBDG.id)
          }
        }
      }
    }
  }

  async getIdNhap() {
    if (this.router.url && this.router.url != null) {
      let index = this.router.url.indexOf("/chi-tiet/");
      if (index != -1) {
        let url = this.router.url.substring(index + 10);
        let temp = url.split("/");
        if (temp && temp.length > 0) {
          this.detail.quyetDinhNhapId = +temp[0];
          let res = await this.quyetDinhGiaoNhapHangService.search(this.detail.quyetDinhNhapId);
          if (res.msg == MESSAGE.SUCCESS) {
            this.detailGiaoNhap = res.data;
            await this.getHopDong(this.detailGiaoNhap.soHd);
          }
          else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
      }
    }
  }

  async loadDonViTinh() {
    try {
      const res = await this.donViService.loadDonViTinh();
      this.listDonViTinh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonViTinh: res.data[i].tenDviTinh,
          };
          this.listDonViTinh.push(item);
        }
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

  async getHopDong(id) {
    if (id) {
      let body = {
        "str": id
      }
      let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.detailHopDong = res.data;
        this.detail.hopDongId = this.detailHopDong.id;
        this.detail.ngayHopDong = this.detailHopDong.ngayKy;
        this.detail.maHangHoa = this.detailHopDong.loaiVthh;
        this.detail.khoiLuongKiemTra = this.detailHopDong.soLuong;
        this.detail.maHangHoa = this.typeVthh;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadLoaiKho() {
    let body = {
      "maLhKho": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenLhKho": null,
      "trangThai": null
    };
    let res = await this.danhMucService.danhMucLoaiKhoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listLoaiKho = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadPTBaoQuan() {
    let body = {
      "maPthuc": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenPthuc": null,
      "trangThai": null
    };
    let res = await this.danhMucService.danhMucPhuongThucBaoQuanGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listPTBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadNganLo() {
    let body = {
      "maNganLo": null,
      "nganKhoId": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNganLo": null,
      "trangThai": null
    };
    let res = await this.tinhTrangKhoHienThoiService.nganLoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listNganLo = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeNganLo() {
    let nganLo = this.listNganLo.filter(x => x.maNganlo == this.detail.maNganlo);
    if (nganLo && nganLo.length > 0) {
      this.detail.tichLuong = nganLo[0].tichLuongChua ?? 0;
    }
  }

  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = {
        "donViThongBao": this.detail.maDvi,
        "fileDinhKemReqs": this.listFileDinhKem,
        "id": this.detail.id ? this.detail.id : null,
        "loaiVthh": this.dsLoaiHangHoa.find(e => e.id == this.detail.tenVatTuCha) ? this.dsLoaiHangHoa.find(e => e.id == this.detail.tenVatTuCha).ma : null,
        "maThongBao": null,
        "maVatTuCha": this.dsLoaiHangHoa.find(e => e.id == this.detail.tenVatTuCha) ? this.dsLoaiHangHoa.find(e => e.id == this.detail.tenVatTuCha).ma : null,
        "nam": this.detail.nam,
        "ngayKy": this.detail.ngayKy,
        "ngayToChuc": this.detail.ngayToChuc,
        "noiDung": this.detail.noiDung,
        "thongBaoBdgId": this.detail.thongBaoBdgId,
        "trichYeu": this.detail.trichYeu
      }
      if (this.id > 0) {
        let res = await this.thongBaoDauGiaKhongThanhCongService.sua(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.thongBaoDauGiaKhongThanhCongService.them(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '04',
          };
          let res =
            await this.thongBaoDauGiaKhongThanhCongService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.NHAP_BAN_HANH,
          };
          let res =
            await this.thongBaoDauGiaKhongThanhCongService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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
            id: this.id,
            lyDoTuChoi: text,
            trangThai: '03',
          };
          let res =
            await this.thongBaoDauGiaKhongThanhCongService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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

  back() {
    this.showListEvent.emit();
  }

  themBienBanNgiemThuKeLot() {
    const modalLuongThuc = this.modal.create({
      nzTitle: 'Thêm mới thông tin chi tiết',
      nzContent: DialogThemBienbanNghiemThuKeLotComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalLuongThuc.afterClose.subscribe((res) => {
      if (res) {
      }
    });
  }

  thongTinTrangThai(trangThai: string): string {
    if (trangThai === this.globals.prop.NHAP_BAN_HANH) {
      return 'da-ban-hanh';
    } else {
      return 'du-thao-va-lanh-dao-duyet';
    }
  }

  print() {

  }
}
