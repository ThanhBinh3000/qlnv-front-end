import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { ThongBaoBanDauGia } from 'src/app/models/ThongBaoBanDauGia';
import { UserLogin } from 'src/app/models/userlogin';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/quanLyPhieuKiemTraChatLuongHang.service';
import { ThongBaoDauGiaTaiSanService } from 'src/app/services/thongBaoDauGiaTaiSan.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-chi-tiet-thong-bao-dau-gia-tai-san',
  templateUrl: './chi-tiet-thong-bao-dau-gia-tai-san.component.html',
  styleUrls: ['./chi-tiet-thong-bao-dau-gia-tai-san.component.scss']
})
export class ChiTietThongBaoDauGiaTaiSanComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  userInfo: UserLogin;
  detail: any = {};
  detailHopDong: any = {};
  listNam: any[] = [];
  yearNow: number = 0;

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
  formData: FormGroup;
  thongBaoBanDauGia: ThongBaoBanDauGia = new ThongBaoBanDauGia();
  constructor(
    private spinner: NgxSpinnerService,
    private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
    private fb: FormBuilder,
    private thongBanDauGiaTaiSanService: ThongBaoDauGiaTaiSanService,
  ) { }
  initForm() {
    this.formData = this.fb.group({
      id: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.id
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      namKeHoach: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.namKeHoach
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      loaiHangHoa: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.loaiHangHoa
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      qdPheDuyetKhBdgId: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.qdPheDuyetKhBdgId
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      maThongBao: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.maThongBao
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      trichYeu: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.trichYeu
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      tenToChucDauGia: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.tenToChucDauGia
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      diaChi: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.diaChi
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      dienThoai: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.dienThoai
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      thoiHanDangKyThamGiaDauGia: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.thoiHanDangKyThamGiaDauGia
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      luuYVeThoiGianDangKy: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.luuYVeThoiGianDangKy
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      diaDiemMuaNopHoSoDangKy: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.diaDiemMuaNopHoSoDangKy
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      dieuKienDangKyThamGiaDauGia: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.dieuKienDangKyThamGiaDauGia
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      tienMuaHoSo: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.tienMuaHoSo
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      buocGiaCuaTungDonViTaiSan: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.buocGiaCuaTungDonViTaiSan
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      thoiHanToChucXemTaiSan: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.thoiHanToChucXemTaiSan
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      luuYVeThoiGianXemTaiSan: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.luuYVeThoiGianXemTaiSan
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      diaDiemToChucXemTaiSan: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.diaDiemToChucXemTaiSan
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      thoiHanNopTienDatTruoc: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.thoiHanNopTienDatTruoc
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      luuYVeThoiGianNopTienDatTruoc: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.luuYVeThoiGianNopTienDatTruoc
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      phuongThucThanhToan: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.phuongThucThanhToan
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      donViThuHuong: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.donViThuHuong
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      soTaiKhoan: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.soTaiKhoan
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      nganHang: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.nganHang
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      chiNhanhNganHang: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.chiNhanhNganHang
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      thoiGianToChucDauGia: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.thoiGianToChucDauGia
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      diaDiemToChucDauGia: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.diaDiemToChucDauGia
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      hinhThucDauGia: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.hinhThucDauGia
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      phuongThucDauGia: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.phuongThucDauGia
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      ghiChu: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.ghiChu
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
    });
  }
  async ngOnInit() {
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
      this.detail.trangThai = "00";
      await Promise.all([
        // this.loadDiemKho(),
        // this.loadTieuChuan(),
        // this.loadSoQuyetDinh(),
        // this.loadLoaiKho(),
        // this.loadPTBaoQuan(),
        // this.loadDonViTinh(),
      ]);
      await this.loadChiTiet(this.id);
      this.initForm();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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

  // convertTien(tien: number): string {
  //   return convertTienTobangChu(tien);
  // }

  // async loadSoQuyetDinh() {
  //   let body = {
  //     "denNgayQd": null,
  //     "loaiQd": "",
  //     "maDvi": this.userInfo.MA_DVI,
  //     "maVthh": this.typeVthh,
  //     "namNhap": null,
  //     "ngayQd": "",
  //     "orderBy": "",
  //     "orderDirection": "",
  //     "paggingReq": {
  //       "limit": 1000,
  //       "orderBy": "",
  //       "orderType": "",
  //       "page": 0
  //     },
  //     "soHd": "",
  //     "soQd": null,
  //     "str": "",
  //     "trangThai": this.globals.prop.NHAP_BAN_HANH,
  //     "tuNgayQd": null,
  //     "veViec": null
  //   }
  //   let res = await this.quyetDinhGiaoNhapHangService.timKiem(body);
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     let data = res.data;
  //     this.listSoQuyetDinh = data.content;
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }

  // async changeSoQuyetDinh() {
  //   let quyetDinh = this.listSoQuyetDinh.filter(x => x.id == this.detail.quyetDinhNhapId);
  //   if (quyetDinh && quyetDinh.length > 0) {
  //     this.detailGiaoNhap = quyetDinh[0];
  //     await this.getHopDong(this.detailGiaoNhap.soHd);
  //   }
  // }

  // async loadTieuChuan() {
  //   let body = {
  //     "maHang": this.typeVthh,
  //     "namQchuan": null,
  //     "paggingReq": {
  //       "limit": 1000,
  //       "page": 1
  //     },
  //     "str": null,
  //     "tenQchuan": null,
  //     "trangThai": "01"
  //   }
  //   let res = await this.danhMucService.traCuuTieuChuanKyThuat(body);
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     if (res.data && res.data.content.length > 0) {
  //       if (res.data.content[0].children && res.data.content[0].children.length > 0) {
  //         this.listTieuChuan = res.data.content[0].children;
  //       }
  //     }
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }

  changeChiTieu(item) {
    if (item) {
      let getChiTieu = this.listTieuChuan.filter(x => x.tenTchuan == item.tenChiTieu);
      if (getChiTieu && getChiTieu.length > 0) {
        item.tieuChuan = getChiTieu[0].chiSoNhap;
        item.phuongPhapXacDinh = getChiTieu[0].phuongPhap;
      }
    }
  }

  // async loadDiemKho() {
  //   let body = {
  //     maDviCha: this.detail.maDonVi,
  //     trangThai: '01',
  //   }
  //   const res = await this.donViService.getTreeAll(body);
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     if (res.data && res.data.length > 0) {
  //       res.data.forEach(element => {
  //         if (element && element.capDvi == '3' && element.children) {
  //           this.listDiemKho = [
  //             ...this.listDiemKho,
  //             ...element.children
  //           ]
  //         }
  //       });
  //     }
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }

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
      let res = await this.thongBanDauGiaTaiSanService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.thongBaoBanDauGia = res.data;
          // this.changeSoQuyetDinh();
        }
      }
    }
  }

  async save(isOther?: boolean) {
    this.spinner.show();
    try {
      let body = {
        "buocGiaCuaTungDonViTaiSan": this.formData.get("buocGiaCuaTungDonViTaiSan").value,
        // "buocGiaCuaTungDonViTaiSanGhiChu": this.formData.get("buocGiaCuaTungDonViTaiSanGhiChu").value,
        // "capDonVi": this.formData.get("capDonVi").value,
        "chiNhanhNganHang": this.formData.get("chiNhanhNganHang").value,
        "diaChi": this.formData.get("diaChi").value,
        "diaDiemMuaNopHoSoDangKy": this.formData.get("diaDiemMuaNopHoSoDangKy").value,
        "diaDiemToChucDauGia": this.formData.get("diaDiemToChucDauGia").value,
        "diaDiemToChucXemTaiSan": this.formData.get("diaDiemToChucXemTaiSan").value,
        "dienThoai": this.formData.get("dienThoai").value,
        "dieuKienDangKyThamGiaDauGia": this.formData.get("dieuKienDangKyThamGiaDauGia").value,
        "donViThuHuong": this.formData.get("donViThuHuong").value,
        "fileDinhKems": this.listFileDinhKem,
        "ghiChu": this.formData.get("ghiChu").value,
        "hinhThucDauGia": this.formData.get("hinhThucDauGia").value,
        "id": this.formData.get("id").value,
        "loaiHangHoa": this.formData.get("loaiHangHoa").value,
        "luuYVeThoiGianDangKy": this.formData.get("luuYVeThoiGianDangKy").value,
        "luuYVeThoiGianNopTienDatTruoc": this.formData.get("luuYVeThoiGianNopTienDatTruoc").value,
        "luuYVeThoiGianXemTaiSan": this.formData.get("luuYVeThoiGianXemTaiSan").value,
        // "maDonVi": this.formData.get("maDonVi").value,
        "maThongBao": this.formData.get("maThongBao").value,
        "namKeHoach": this.formData.get("namKeHoach").value,
        "nganHang": this.formData.get("nganHang").value,
        "phuongThucDauGia": this.formData.get("phuongThucDauGia").value,
        "phuongThucThanhToan": this.formData.get("phuongThucThanhToan").value,
        "qdPheDuyetKhBdgId": this.formData.get("qdPheDuyetKhBdgId").value,
        "soTaiKhoan": this.formData.get("soTaiKhoan").value,
        "tenToChucDauGia": this.formData.get("tenToChucDauGia").value,
        "thoiGianToChucDauGiaDenNgay": this.formData.get("thoiGianToChucDauGia").value ? dayjs(this.formData.get("thoiGianToChucDauGia").value[0]).format("YYYY-MM-DD") : null,
        "thoiGianToChucDauGiaTuNgay": this.formData.get("thoiGianToChucDauGia").value ? dayjs(this.formData.get("thoiGianToChucDauGia").value[1]).format("YYYY-MM-DD") : null,
        "thoiHanDangKyThamGiaDauGiaDenNgay": this.formData.get("thoiHanDangKyThamGiaDauGia").value[0] ? dayjs(this.formData.get("thoiHanDangKyThamGiaDauGia").value[1]).format("YYYY-MM-DD") : null,
        "thoiHanDangKyThamGiaDauGiaTuNgay": this.formData.get("thoiHanDangKyThamGiaDauGia").value ? dayjs(this.formData.get("thoiHanDangKyThamGiaDauGia").value[0]).format("YYYY-MM-DD") : null,
        "thoiHanNopTienDatTruocDenNgay": this.formData.get("thoiHanNopTienDatTruoc").value ? dayjs(this.formData.get("thoiHanNopTienDatTruoc").value[1]).format("YYYY-MM-DD") : null,
        "thoiHanNopTienDatTruocTuNgay": this.formData.get("thoiHanNopTienDatTruoc").value ? dayjs(this.formData.get("thoiHanNopTienDatTruoc").value[0]).format("YYYY-MM-DD") : null,
        "thoiHanToChucXemTaiSanDenNgay": this.formData.get("thoiHanToChucXemTaiSan").value ? dayjs(this.formData.get("thoiHanToChucXemTaiSan").value[1]).format("YYYY-MM-DD") : null,
        "thoiHanToChucXemTaiSanTuNgay": this.formData.get("thoiHanToChucXemTaiSan").value ? dayjs(this.formData.get("thoiHanToChucXemTaiSan").value[0]).format("YYYY-MM-DD") : null,
        "tienMuaHoSo": this.formData.get("tienMuaHoSo").value,
        // "trangThai": this.formData.get("trangThai").value,
        "trichYeu": this.formData.get("trichYeu").value
      };
      if (this.idInput > 0) {
        let res = await this.thongBanDauGiaTaiSanService.sua(
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
        let res = await this.thongBanDauGiaTaiSanService.them(
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
      this.notification.error(MESSAGE.ERROR, (e?.error?.message ?? MESSAGE.SYSTEM_ERROR));
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
            await this.quanLyPhieuKiemTraChatLuongHangService.updateStatus(
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
            trangThai: '01',
          };
          let res =
            await this.quanLyPhieuKiemTraChatLuongHangService.updateStatus(
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
            await this.quanLyPhieuKiemTraChatLuongHangService.updateStatus(
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



  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === '00' ||
      trangThai === '01' ||
      trangThai === '04' ||
      trangThai === '03'
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === '02') {
      return 'da-ban-hanh';
    }
  }

}
