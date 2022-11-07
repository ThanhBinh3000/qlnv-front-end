import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChiTietDiaDiemNhapKho, DiaDiemNhapKho } from 'src/app/components/dialog/dialog-them-dia-diem-nhap-kho/dialog-them-dia-diem-nhap-kho.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { ThongBaoBanDauGia } from 'src/app/models/ThongBaoBanDauGia';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DeXuatKeHoachBanDauGiaService } from 'src/app/services/deXuatKeHoachBanDauGia.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyPhieuKiemTraChatLuongHang.service';
import { QuyetDinhPheDuyetKHBDGService } from 'src/app/services/quyetDinhPheDuyetKHBDG.service';
import { ThongBaoDauGiaTaiSanService } from 'src/app/services/thongBaoDauGiaTaiSan.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
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
  listHangHoa: any[] = [];
  mapOfExpandedData2: { [maDvi: string]: any[] } = {};
  formData: FormGroup;
  thongBaoBanDauGia: ThongBaoBanDauGia = new ThongBaoBanDauGia();
  bangPhanBoList: Array<any> = [];
  taiSanIdList: Array<any> = [];

  expandSet = new Set<number>();

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
    private fb: FormBuilder,
    private thongBanDauGiaTaiSanService: ThongBaoDauGiaTaiSanService,
    private danhMucService: DanhMucService,
    public qdPheDuyetKhBanDauGia: QuyetDinhPheDuyetKHBDGService,
    private helperService: HelperService,
  ) {
    this.initForm();
  }

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
      loaiVthh: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.maVatTuCha
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
        [Validators.required], ,
      ],
      maThongBao: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.maThongBao
            : null,
          disabled: this.isView ? true : false
        },
        [Validators.required],
      ],
      trichYeu: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.trichYeu
            : null,
          disabled: this.isView ? true : false
        },
        [Validators.required],
      ],
      tenToChucDauGia: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.tenToChucDauGia
            : null,
          disabled: this.isView ? true : false
        },
        [Validators.required],
      ],
      diaChi: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.diaChi
            : null,
          disabled: this.isView ? true : false
        },
        [Validators.required],
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
            ? [this.thongBaoBanDauGia.thoiHanDangKyThamGiaDauGiaTuNgay, this.thongBaoBanDauGia.thoiGianToChucDauGiaDenNgay]
            : null,
          disabled: this.isView ? true : false
        },
        [Validators.required],
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
        [Validators.required],
      ],
      dieuKienDangKyThamGiaDauGia: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.dieuKienDangKyThamGiaDauGia
            : null,
          disabled: this.isView ? true : false
        },
        [Validators.required],
      ],
      tienMuaHoSo: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.tienMuaHoSo
            : null,
          disabled: this.isView ? true : false
        },
        [Validators.required],
      ],
      buocGiaCuaTungDonViTaiSan: [
        {
          value: this.thongBaoBanDauGia
            ? this.thongBaoBanDauGia.buocGiaCuaTungDonViTaiSan
            : null,
          disabled: this.isView ? true : false
        },
        [Validators.required],
      ],
      thoiHanToChucXemTaiSan: [
        {
          value: this.thongBaoBanDauGia
            ? [this.thongBaoBanDauGia.thoiHanToChucXemTaiSanTuNgay, this.thongBaoBanDauGia.thoiHanToChucXemTaiSanDenNgay]
            : null,
          disabled: this.isView ? true : false
        },
        [Validators.required],
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
        [Validators.required],
      ],
      thoiHanNopTienDatTruoc: [
        {
          value: this.thongBaoBanDauGia
            ? [this.thongBaoBanDauGia.thoiHanNopTienDatTruocTuNgay, this.thongBaoBanDauGia.thoiHanNopTienDatTruocDenNgay]
            : null,
          disabled: this.isView ? true : false
        },
        [Validators.required],
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
            ? [this.thongBaoBanDauGia.thoiGianToChucDauGiaTuNgay, this.thongBaoBanDauGia.thoiGianToChucDauGiaDenNgay]
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
      this.thongBaoBanDauGia.maDonVi = this.userInfo.MA_DVI;
      this.thongBaoBanDauGia.trangThai = this.globals.prop.NHAP_DU_THAO;
      this.thongBaoBanDauGia.namKeHoach = this.yearNow;
      this.thongBaoBanDauGia.loaiVthh = this.typeVthh;
      this.formData.patchValue({
        namKeHoach: this.yearNow,
        loaiVthh: this.thongBaoBanDauGia.loaiVthh,
      });
      await this.loadChiTiet(this.id);
      await Promise.all([
        this.loadQuyetDinhPheDuyetKHBDG(),
        this.loaiVTHHGetAll(),
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  isDisableField() {
    if (this.thongBaoBanDauGia && (this.thongBaoBanDauGia.trangThai != this.globals.prop.NHAP_DU_THAO)) {
      return true;
    }
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  async loadQuyetDinhPheDuyetKHBDG() {
    let body = {
      loaiVthh: this.thongBaoBanDauGia.loaiVthh,
      namKhoach: this.thongBaoBanDauGia.namKeHoach,
      paggingReq: {
        limit: 1000,
        page: 0,
      },
    };
    let res = await this.qdPheDuyetKhBanDauGia.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (!this.thongBaoBanDauGia.loaiVthh) {
        this.listHangHoa = res.data;
      }
      else {
        this.listHangHoa = res.data?.filter(x => x.ma == this.thongBaoBanDauGia.loaiVthh);
      };
    }
  }

  async changeSoQuyetDinh() {
    let idSoQuyetDinh = this.formData.get("qdPheDuyetKhBdgId").value;
    if (idSoQuyetDinh) {
      let res = await this.qdPheDuyetKhBanDauGia.chiTiet(+idSoQuyetDinh);
      if (res.msg == MESSAGE.SUCCESS) {
        let phanLoTaiSans = res.data?.thongTinTaiSanCucs;
        // if(this.userService.isTongCuc()){
        //    phanLoTaiSans = res.data?.chiTietList;
        // }else{
        //    phanLoTaiSans = res.data?.thongTinTaiSanCucs;
        // }
        // console.log(phanLoTaiSans)
        this.getPhanLoTaiSan(phanLoTaiSans);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  getPhanLoTaiSan(phanLoTaiSans: any) {
    this.bangPhanBoList = [];
    this.taiSanIdList = [];
    if (phanLoTaiSans && phanLoTaiSans.length > 0) {
      for (let i = 0; i <= phanLoTaiSans.length - 1; i++) {
        this.taiSanIdList.push(phanLoTaiSans[i].id);
        for (let j = i + 1; j <= phanLoTaiSans.length; j++) {
          if (phanLoTaiSans.length == 1 || phanLoTaiSans[i].maChiCuc === phanLoTaiSans[j].maChiCuc) {
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
            chiTietDiaDiem.tenChungLoaiHh = phanLoTaiSans[i].chungLoaiHh;
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

  changeChiTieu(item) {
    if (item) {
      let getChiTieu = this.listTieuChuan.filter(x => x.tenTchuan == item.tenChiTieu);
      if (getChiTieu && getChiTieu.length > 0) {
        item.tieuChuan = getChiTieu[0].chiSoNhap;
        item.phuongPhapXacDinh = getChiTieu[0].phuongPhap;
      }
    }
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.thongBanDauGiaTaiSanService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.thongBaoBanDauGia = res.data;
          if (this.thongBaoBanDauGia && this.thongBaoBanDauGia.fileDinhKems) {
            this.listFileDinhKem = this.thongBaoBanDauGia.fileDinhKems;
          }
          this.initForm();
          this.changeSoQuyetDinh();
        }
      }
    }
  }

  async save(isOther?: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      console.log('Invalid');
      console.log(this.formData.value);
      return;
    }
    this.spinner.show();
    try {
      let body = this.formData.value;
      body = {
        ...body,
        // "capDonVi": this.formData.get("capDonVi").value,
        "fileDinhKems": this.listFileDinhKem,
        "maVatTuCha": this.formData.get("loaiVthh") ? this.formData.get("loaiVthh").value : null,
        "id": this.formData.get("id") ? this.formData.get("id").value : null,
        // "maDonVi": this.formData.get("maDonVi").value,
        "taiSanIdList": this.taiSanIdList,
        "thoiGianToChucDauGiaDenNgay": this.formData.get("thoiGianToChucDauGia") && this.formData.get("thoiGianToChucDauGia").value ? dayjs(this.formData.get("thoiGianToChucDauGia").value[1]).format("YYYY-MM-DD") : null,
        "thoiGianToChucDauGiaTuNgay": this.formData.get("thoiGianToChucDauGia") && this.formData.get("thoiGianToChucDauGia").value ? dayjs(this.formData.get("thoiGianToChucDauGia").value[0]).format("YYYY-MM-DD") : null,
        "thoiHanDangKyThamGiaDauGiaDenNgay": this.formData.get("thoiHanDangKyThamGiaDauGia") && this.formData.get("thoiHanDangKyThamGiaDauGia").value[0] ? dayjs(this.formData.get("thoiHanDangKyThamGiaDauGia").value[1]).format("YYYY-MM-DD") : null,
        "thoiHanDangKyThamGiaDauGiaTuNgay": this.formData.get("thoiHanDangKyThamGiaDauGia") && this.formData.get("thoiHanDangKyThamGiaDauGia").value ? dayjs(this.formData.get("thoiHanDangKyThamGiaDauGia").value[0]).format("YYYY-MM-DD") : null,
        "thoiHanNopTienDatTruocDenNgay": this.formData.get("thoiHanNopTienDatTruoc") && this.formData.get("thoiHanNopTienDatTruoc").value ? dayjs(this.formData.get("thoiHanNopTienDatTruoc").value[1]).format("YYYY-MM-DD") : null,
        "thoiHanNopTienDatTruocTuNgay": this.formData.get("thoiHanNopTienDatTruoc") && this.formData.get("thoiHanNopTienDatTruoc").value ? dayjs(this.formData.get("thoiHanNopTienDatTruoc").value[0]).format("YYYY-MM-DD") : null,
        "thoiHanToChucXemTaiSanDenNgay": this.formData.get("thoiHanToChucXemTaiSan") && this.formData.get("thoiHanToChucXemTaiSan").value ? dayjs(this.formData.get("thoiHanToChucXemTaiSan").value[1]).format("YYYY-MM-DD") : null,
        "thoiHanToChucXemTaiSanTuNgay": this.formData.get("thoiHanToChucXemTaiSan") && this.formData.get("thoiHanToChucXemTaiSan").value ? dayjs(this.formData.get("thoiHanToChucXemTaiSan").value[0]).format("YYYY-MM-DD") : null,
        "trangThai": this.thongBaoBanDauGia.trangThai,
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
            await this.thongBanDauGiaTaiSanService.updateStatus(
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
            await this.thongBanDauGiaTaiSanService.updateStatus(
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
            await this.thongBanDauGiaTaiSanService.updateStatus(
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

  apDungChinhSua() {

  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }
}
