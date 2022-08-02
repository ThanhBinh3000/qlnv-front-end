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
import { ThongBaoDauGiaTaiSanService } from 'src/app/services/thongBaoDauGiaTaiSan';
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
  detailGiaoNhap: any = {};
  detailHopDong: any = {};
  listNam: any[] = [];
  yearNow: number = 0;

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
      // await this.loadChiTiet(this.id);
      this.initForm();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
