import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {
  DiaDiemGiaoNhan,
  KeHoachBanDauGia,
  PhanLoTaiSan,
} from 'src/app/models/KeHoachBanDauGia';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhMucTieuChuanService } from 'src/app/services/danhMucTieuChuan.service';
import { DeXuatKeHoachBanDauGiaService } from 'src/app/services/deXuatKeHoachBanDauGia.service';
import { DonviService } from 'src/app/services/donvi.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import VNnum2words from 'vn-num2words';
import {
  ChiTietDiaDiemNhapKho,
  DiaDiemNhapKho,
  DialogThemDiaDiemNhapKhoComponent,
} from './../../../../../../../components/dialog/dialog-them-dia-diem-nhap-kho/dialog-them-dia-diem-nhap-kho.component';

@Component({
  selector: 'app-themmoi-kehoach-lcnt',
  templateUrl: './themmoi-kehoach-lcnt.component.html',
  styleUrls: ['./themmoi-kehoach-lcnt.component.scss'],
})
export class ThemmoiKehoachLcntComponent implements OnInit {
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
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  listHangHoa: any[] = [];
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
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  maKeHoach: string;
  listLoaiHopDong: any[] = [];
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
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private cdr: ChangeDetectorRef,
  ) {
  }
  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maKeHoach = '/' + this.userInfo.MA_TR;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.loadDonVi();
    if (this.idInput > 0) {
      this.loadDeXuatKHBanDauGia(this.idInput);
    } else {
    }
    this.khBanDauGia.namKeHoach = dayjs().year();
    this.initForm();
    await Promise.all([this.loaiVTHHGetAll(), this.loaiHopDongGetAll()]);
    this.spinner.hide();
  }

  initForm() {
    this.formData = this.fb.group({
      id: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.id : null,
          disabled: this.isView ? true : false,
        },
        [],
      ],
      namKeHoach: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.namKeHoach : null,
          disabled: true,
        },
        [],
      ],
      soKeHoach: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.soKeHoach : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      trichYeu: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.trichYeu : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      ngayLapKeHoach: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.ngayLapKeHoach : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      ngayKy: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.ngayKy : null,
          disabled: this.isView ? true : false,
        },

        [],
      ],
      loaiHangHoa: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.loaiHangHoa : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      qdGiaoChiTieuId: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.qdGiaoChiTieuId : null,
          disabled: this.isView ? true : false,
        },

        [],
      ],
      qdGiaoChiTieuNam: [
        {
          value: this.khBanDauGia
            ? this.khBanDauGia.soQuyetDinhGiaoChiTieu
            : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      tenQdGiaoChiTieu: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.tenQdGiaoChiTieu : null,
          disabled: this.isView ? true : false,
        },

        [],
      ],
      tieuChuanChatLuong: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.tieuChuanChatLuong : null,
          disabled: true,
        },
        [],
      ],
      soLuong: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.soLuong : null,
          disabled: true,
        },
        [],
      ],
      khoanTienDatTruoc: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.khoanTienDatTruoc : null,
          disabled: this.isView ? true : false,
        },

        [],
      ],
      thoiGianDuKien: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.thoiGianDuKien : null,
          disabled: this.isView ? true : false,
        },
        [],
      ],
      thongBaoKhBdg: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.thongBaoKhBdg : null,
          disabled: this.isView ? true : false,
        },
        [],
      ],
      thoiGianKyHd: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.thoiGianKyHd : null,
          disabled: this.isView ? true : false,
        },
        [],
      ],
      thoiGianKyHdGhiChu: [
        {
          value: this.khBanDauGia
            ? this.khBanDauGia.thoiGianKyHopDongGhiChu
            : null,
          disabled: this.isView ? true : false,
        },

        [],
      ],
      loaiHopDong: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.loaiHopDong : null,
          disabled: this.isView ? true : false,
        },

        [],
      ],
      thoiHanThanhToan: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.thoiHanThanhToan : null,
          disabled: this.isView ? true : false,
        },

        [],
      ],
      thoiHanThanhToanGhiChu: [
        {
          value: this.khBanDauGia
            ? this.khBanDauGia.thoiHanThanhToanGhiChu
            : null,
          disabled: this.isView ? true : false,
        },

        [],
      ],
      phuongThucThanhToan: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.phuongThucThanhToan : null,
          disabled: this.isView ? true : false,
        },

        [],
      ],
      thoiHanGiaoNhan: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.thoiHanGiaoNhan : null,
          disabled: this.isView ? true : false,
        },

        [],
      ],
      thoiHanGiaoNhanGhiChu: [
        {
          value: this.khBanDauGia
            ? this.khBanDauGia.thoiHanGiaoNhanGhiChu
            : null,
          disabled: this.isView ? true : false,
        },

        [],
      ],
      phuongThucGiaoNhan: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.phuongThucGiaoNhan : null,
          disabled: this.isView ? true : false,
        },

        [],
      ],
      ghiChu: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.ghiChu : null,
          disabled: this.isView ? true : false,
        },
        [],
      ],
    });
    this.setTitle();
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  openDialogQuyetDinhGiaoChiTieu() {
    if (this.idInput >= 0 && !this.isView) {
      const modalQD = this.modal.create({
        nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
        nzContent: DialogQuyetDinhGiaoChiTieuComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          capDonVi: 2,
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            qdGiaoChiTieuId: data ? data.id : null,
            qdGiaoChiTieuNam: data ? data.soQuyetDinh : null,
          });
          this.spinner.hide();
        }
      });
    }
  }

  async changeChiCuc(event, index?) {
    const res = await this.tinhTrangKhoHienThoiService.getChiCucByMaTongCuc(
      event,
    );
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data?.child.length; i++) {
        const item = {
          value: res.data.child[i].maDiemkho,
          text: res.data.child[i].tenDiemkho,
          diaDiemNhap: res.data.child[i].diaDiem,
        };
        this.listDiemKho.push(item);
      }
    }
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

  themMoiBangPhanLoTaiSan(item?: any) {
    if (
      !this.formData.get('loaiHangHoa').value ||
      !this.formData.get('qdGiaoChiTieuNam').value ||
      !this.formData.get('khoanTienDatTruoc').value
    ) {
      return;
    }
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm nhập kho',
      nzContent: DialogThemDiaDiemNhapKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1162px',
      nzFooter: null,
      nzComponentParams: {
        phanLoTaiSanEdit: item ?? null,
        loaiHangHoa: this.formData.get('loaiHangHoa').value,
        idChiTieu: this.formData.get('qdGiaoChiTieuId').value,
        khoanTienDatTruoc: this.formData.get('khoanTienDatTruoc').value,
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }
      this.checkExistBangPhanLo(res);
      this.diaDiemGiaoNhanList = [];
      this.bangPhanBoList.forEach((phanLo) => {
        this.donviService.getDonVi(phanLo.maDvi).then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const ddGiaoNhan = new DiaDiemGiaoNhan();
            ddGiaoNhan.id = res.data?.id;
            ddGiaoNhan.tenChiCuc = res.data?.tenDvi;
            ddGiaoNhan.diaChi = res.data?.diaChi;
            ddGiaoNhan.soLuong = phanLo.soLuong;
            this.diaDiemGiaoNhanList = [
              ...this.diaDiemGiaoNhanList,
              ddGiaoNhan,
            ];
            const tongSoLuong = this.diaDiemGiaoNhanList.reduce(
              (previousChiTiet, currentChiTiet) =>
                previousChiTiet + currentChiTiet.soLuong,
              0,
            );
            this.formData.patchValue({
              soLuong: tongSoLuong
                ? Intl.NumberFormat('en-US').format(tongSoLuong)
                : '0',
            });
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        });
      });
    });
  }
  checkExistBangPhanLo(data: any) {
    if (this.bangPhanBoList) {
      let indexExist = this.bangPhanBoList.findIndex(
        (x) => x.maDvi == data.maDvi,
      );
      if (indexExist != -1) {
        this.bangPhanBoList.splice(indexExist, 1);
      }
    } else {
      this.bangPhanBoList = [];
    }
    this.bangPhanBoList = [...this.bangPhanBoList, data];
  }
  async save(isOther?: boolean) {
    this.spinner.show();
    try {
      this.bangPhanBoList.forEach((phanBo) => {
        const phanLoTaiSan = new PhanLoTaiSan();
        phanLoTaiSan.maChiCuc = phanBo.maDvi;
        phanBo.chiTietDiaDiems.forEach((chiTiet) => {
          phanLoTaiSan.chungLoaiHh = chiTiet.tenChungLoaiHh;
          phanLoTaiSan.maDiemKho = chiTiet.maDiemKho;
          phanLoTaiSan.donGia = chiTiet.donGiaChuaVAT;
          phanLoTaiSan.donViTinh = chiTiet.donViTinh;
          phanLoTaiSan.giaKhoiDiem = chiTiet.giaKhoiDiem;
          phanLoTaiSan.maLoKho = chiTiet.maNganLo;
          phanLoTaiSan.maDvTaiSan = chiTiet.maDonViTaiSan;
          phanLoTaiSan.maNganKho = chiTiet.maNganKho;
          phanLoTaiSan.maNhaKho = chiTiet.maNhaKho;
          phanLoTaiSan.soLuong = chiTiet.soLuong;
          phanLoTaiSan.soTienDatTruoc = chiTiet.soTienDatTruoc;
          phanLoTaiSan.tonKho = null;
          this.phanLoTaiSanList = [...this.phanLoTaiSanList, phanLoTaiSan];
        });
      });
      let body = {
        capDv: null,
        diaDiemGiaoNhanList: this.diaDiemGiaoNhanList,
        fileDinhKems: this.listFileDinhKem,
        id: this.formData.get('id').value,
        khoanTienDatTruoc: this.formData.get('khoanTienDatTruoc').value,
        loaiHangHoa: this.formData.get('loaiHangHoa').value,
        loaiHopDong: this.formData.get('loaiHopDong').value,
        loaiVatTuHangHoa: null,
        maDv: null,
        namKeHoach: this.formData.get('namKeHoach').value,
        ngayKy: this.formData.get('ngayKy').value
          ? dayjs(this.formData.get('ngayKy').value).format('YYYY-MM-DD')
          : null,
        ngayLapKeHoach: this.formData.get('ngayLapKeHoach').value
          ? dayjs(this.formData.get('ngayLapKeHoach').value).format(
            'YYYY-MM-DD',
          )
          : null,
        phanLoTaiSanList: this.phanLoTaiSanList,
        phuongThucGiaoNhan: this.formData.get('phuongThucGiaoNhan').value,
        phuongThucThanhToan: this.formData.get('phuongThucThanhToan').value,
        qdGiaoChiTieuId: this.formData.get('qdGiaoChiTieuId').value,
        soKeHoach: this.formData.get('soKeHoach').value,
        soLuong: this.formData.get('soLuong').value,
        tgDkTcDenNgay: this.formData.get('thoiGianDuKien').value
          ? dayjs(this.formData.get('thoiGianDuKien').value[0]).format(
            'YYYY-MM-DD',
          )
          : null,
        tgDkTcTuNgay: this.formData.get('thoiGianDuKien').value
          ? dayjs(this.formData.get('thoiGianDuKien').value[1]).format(
            'YYYY-MM-DD',
          )
          : null,
        thoiGianKyHd: this.formData.get('thoiGianKyHd').value,
        thoiGianKyHopDongGhiChu: this.formData.get('thoiGianKyHdGhiChu').value,
        thoiHanGiaoNhan: this.formData.get('thoiHanGiaoNhan').value,
        thoiHanGiaoNhanGhiChu: this.formData.get('thoiHanGiaoNhanGhiChu').value,
        thoiHanThanhToan: this.formData.get('thoiHanThanhToan').value,
        thoiHanThanhToanGhiChu: this.formData.get('thoiHanThanhToanGhiChu')
          .value,
        thongBaoKhBdg: this.formData.get('thongBaoKhBdg').value,
        tieuChuanChatLuong: this.formData.get('tieuChuanChatLuong').value,
        trangThai: '00',
        trichYeu: this.formData.get('trichYeu').value,
        ghiChu: this.formData.get('ghiChu').value,
      }
      if (this.idInput > 0) {
        let res = await this.deXuatKeHoachBanDauGiaService.sua(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            return res.data.id;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.deXuatKeHoachBanDauGiaService.them(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          } else {
            return res.data.id;
          }
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

  back() {
    this.showListEvent.emit();
  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (!this.loaiVthhInput) {
        this.listHangHoa = res.data;
        this.listHangHoa = this.listHangHoa.filter((hh) => hh.ma != '02');
      } else {
        this.listHangHoa = res.data?.filter((x) => x.ma == this.loaiVthhInput);
      }
    }
  }

  async loadDeXuatKHBanDauGia(id: number) {
    await this.deXuatKeHoachBanDauGiaService
      .loadChiTiet(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.khBanDauGia = res.data;
          this.initForm();
          const ddGiaoNhans = res.data?.diaDiemGiaoNhanList;
          ddGiaoNhans.forEach((ddgn) => {
            const ddGiaoNhan = new DiaDiemGiaoNhan();
            ddGiaoNhan.id = ddgn.id;
            ddGiaoNhan.tenChiCuc = ddgn.tenChiCuc;
            ddGiaoNhan.diaChi = ddgn.diaChi;
            ddGiaoNhan.soLuong = ddgn.soLuong;
            this.diaDiemGiaoNhanList.push(ddGiaoNhan);
          });
          const phanLoTaiSans = res.data?.phanLoTaiSanList;

          for (let i = 0; i <= phanLoTaiSans.length - 1; i++) {
            for (let j = i + 1; j <= phanLoTaiSans.length; j++) {
              if (
                phanLoTaiSans.length == 1 ||
                phanLoTaiSans[i].chiCuc === phanLoTaiSans[j].chiCuc
              ) {
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
                chiTietDiaDiem.tenNganLo = phanLoTaiSans[i].tenLoKho;
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

          let thoiGianDk = [];
          thoiGianDk.push(this.khBanDauGia.tgDkTcTuNgay);
          thoiGianDk.push(this.khBanDauGia.tgDkTcDenNgay);
          this.formData.patchValue({
            thoiGianDuKien: thoiGianDk,
          });
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  convertTienTobangChu(tien: number): string {
    return VNnum2words(tien);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          const id = await this.save(true);

          let body = {
            id: this.idInput,
            trangThaiId: '00',
          };
          switch (this.khBanDauGia.trangThai) {
            case '00':
              body.trangThaiId = '01';
              break;
            case '01':
              body.trangThaiId = '02';
              break;

          }
          let res = await this.deXuatKeHoachBanDauGiaService.updateStatus(body);
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
            trangThaiId: this.globals.prop.TU_CHOI,
          };
          switch (this.khBanDauGia.trangThai) {
            case '01':
              body.trangThaiId = '03';
              break;
            case '09':
              body.trangThaiId = '12';
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

  setTitle() {
    let trangThai = this.khBanDauGia.trangThai;
    switch (trangThai) {
      case '00': {
        this.titleStatus = 'Dự thảo';
        break;
      }
      case '03': {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - TP';
        break;
      }
      case '01': {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - TP';
        break;
      }
      case '09': {
        this.iconButtonDuyet = 'htvbdh_tcdt_baocao2';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - LĐ Cục';
        break;
      }
      case '12': {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - LĐ Cục';
        break;
      }
      case '02': {
        this.titleStatus = 'Đã duyệt';
        this.styleStatus = 'da-ban-hanh';
        break;
      }
      case '05': {
        this.titleStatus = 'Tổng hợp';
        this.styleStatus = 'da-ban-hanh';
        break;
      }
    }
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  deletePhanLo(idVirtual: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.bangPhanBoList = this.bangPhanBoList.filter(
          (phanLo) => phanLo.idVirtual !== idVirtual,
        );
      },
    });
  }
  loadTieuChuanChatLuong() {
    this.dmTieuChuanService
      .getDetailByMaHh(this.formData.get('loaiHangHoa').value)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.khBanDauGia.tieuChuanChatLuong = res.data?.tenQchuan;
          this.formData.patchValue({
            tieuChuanChatLuong: this.khBanDauGia.tieuChuanChatLuong,
          });
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }
  changeLoaiHangHoa() {
    this.loadTieuChuanChatLuong();
  }

  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === this.globals.prop.DU_THAO ||
      trangThai === this.globals.prop.LANH_DAO_DUYET ||
      trangThai === this.globals.prop.TU_CHOI ||
      trangThai === this.globals.prop.DU_THAO_TRINH_DUYET
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === this.globals.prop.BAN_HANH) {
      return 'da-ban-hanh';
    }
  }
}
