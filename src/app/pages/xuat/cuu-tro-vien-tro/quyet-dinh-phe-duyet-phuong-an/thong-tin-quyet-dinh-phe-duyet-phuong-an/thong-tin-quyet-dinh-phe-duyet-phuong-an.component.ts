import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan,} from 'src/app/models/KeHoachBanDauGia';
import {UserLogin} from 'src/app/models/userlogin';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {DanhMucTieuChuanService} from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import {DeXuatKeHoachBanDauGiaService} from 'src/app/services/deXuatKeHoachBanDauGia.service';
import {DonviService} from 'src/app/services/donvi.service';
import {HelperService} from 'src/app/services/helper.service';
import {TinhTrangKhoHienThoiService} from 'src/app/services/tinhTrangKhoHienThoi.service';
import {UserService} from 'src/app/services/user.service';
import {thongTinTrangThaiNhap} from 'src/app/shared/commonFunction';
import {Globals} from 'src/app/shared/globals';
import {STATUS} from 'src/app/constants/status';
import {
  TongHopPhuongAnCuuTroService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service";
import {
  DialogDanhSachHangHoaComponent
} from "../../../../../components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component";
import {DatePipe} from "@angular/common";
import {UploadFileService} from "../../../../../services/uploaFile.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";

@Component({
  selector: 'app-thong-tin-quyet-dinh-phe-duyet-phuong-an',
  templateUrl: './thong-tin-quyet-dinh-phe-duyet-phuong-an.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-phe-duyet-phuong-an.component.scss']
})
export class ThongTinQuyetDinhPheDuyetPhuongAnComponent implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
  STATUS = STATUS;
  maTongHop: string;
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
  listLoaiHangHoa: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  userInfo: UserLogin;
  listFileDinhKem: any[] = [];
  expandSetView = new Set<number>();
  expandSetEdit = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  listChungLoaiHangHoa: any[] = [];
  maQuyetDinh: string;
  listLoaiHopDong: any[] = [];
  listLoaiHinhNhapXuat: any[] = [];
  thongTinChiTiet: any[];
  thongTinChiTietTh: any[];
  tongSoLuongDxuat = 0;
  tongSoLuongTongHop = 0;
  tongThanhTienDxuat = 0;
  tongThanhTienTongHop = 0;
  tongHopEdit: any = [];
  datePipe = new DatePipe('en-US');
  isVisible = false;
  isVisibleTuChoiDialog = false;
  listPhuongAnTongHop: any;

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
    private tongHopPhuongAnCuuTroService: TongHopPhuongAnCuuTroService,
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private cdr: ChangeDetectorRef,
    private helperService: HelperService,
    private uploadFileService: UploadFileService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        maDvi: [],
        tenDvi: [, [Validators.required]],
        soQd: [, [Validators.required]],
        nam: [dayjs().get("year"), [Validators.required]],
        idTongHop: [, [Validators.required]],
        ngayKy: [, [Validators.required]],
        loaiVthh: [, [Validators.required]],
        cloaiVthh: [, [Validators.required]],
        tongSoLuong: [],
        trangThai: [],
        fileDinhKem: [FileDinhKem, [Validators.required]],
        fileName: [, [Validators.required]],
        canCu: [new Array<FileDinhKem>()],
        trichYeu: [, [Validators.required]],
        lyDoTuChoi: [],
        tenLoaiVthh: [, [Validators.required]],
        tenCloaiVthh: [, [Validators.required]],
        tenTrangThai: [],
        thongTinDeXuat: [new Array(),],
        thongTinTongHop: [new Array()],

      }
    );
    this.userInfo = this.userService.getUserLogin();
    this.maQuyetDinh = '/' + this.userInfo.MA_QD;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      //this.loadDonVi();
      await Promise.all([
        this.dsPhuongAnTongHop(),
        this.loadDetail(this.idInput),
      ])
      console.log(this.formData.value);
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
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

  async save(isOther?: boolean) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Lưu thông tin',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.helperService.markFormGroupTouched(this.formData);
        if (this.formData.invalid) {
          let invalid = [];
          let controls = this.formData.controls;
          for (const name in controls) {
            if (controls[name].invalid) {
              invalid.push(name);
            }
          }
          console.log(invalid, 'invalid');
          this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin.');
          return;
        } else {
          try {
            this.spinner.show();
            let body = this.formData.value;
            body.tongSoLuong = this.tongSoLuongTongHop;
            // body.fileDinhKem = this.fileDinhKem;
            body.ngayKy = this.datePipe.transform(body.ngayKy, 'yyyy-MM-dd');
            body.soQd = body.soQd + this.maQuyetDinh;
            console.log(body, 'body');
            if (this.idInput) {
              let res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.update(body);
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
            } else {
              // body.tongSoLuong = this.tongSLThongTinChiTiet;
              let res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.create(body);
              if (res.msg == MESSAGE.SUCCESS) {
                this.idInput = res.data.id;
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
            }
            //gui duyet
            if (isOther) {
              let body = {
                id: this.idInput,
                trangThai: STATUS.CHO_DUYET_LDTC
              };
              let res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.approve(body);
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
            }
          } catch (e) {
            console.log(e)
          } finally {
            this.spinner.hide();
            this.quayLai();
          }
        }
      }
    });
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
          let body = {
            id: this.idInput,
            trangThaiId: this.globals.prop.NHAP_CHO_DUYET_TP,
          };
          switch (this.khBanDauGia.trangThai) {
            case this.globals.prop.NHAP_DU_THAO:
              body.trangThaiId = this.globals.prop.NHAP_CHO_DUYET_TP;
              break;
            case this.globals.prop.NHAP_CHO_DUYET_TP:
              body.trangThaiId = this.globals.prop.NHAP_CHO_DUYET_LD_CUC;
              break;
            case this.globals.prop.NHAP_CHO_DUYET_LD_CUC:
              body.trangThaiId = this.globals.prop.NHAP_BAN_HANH;
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
            trangThaiId: this.globals.prop.NHAP_TU_CHOI_TP,
          };
          switch (this.khBanDauGia.trangThai) {
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

  setTitle() {
    let trangThai = this.khBanDauGia.trangThai;
    switch (trangThai) {
      case this.globals.prop.NHAP_DU_THAO: {
        this.titleStatus = 'Dự thảo';
        break;
      }
      case this.globals.prop.NHAP_TU_CHOI_TP: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - TP';
        break;
      }
      case this.globals.prop.NHAP_CHO_DUYET_TP: {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - TP';
        break;
      }
      case this.globals.prop.NHAP_CHO_DUYET_LD_CUC: {
        this.iconButtonDuyet = 'htvbdh_tcdt_baocao2';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - LĐ Cục';
        break;
      }
      case this.globals.prop.NHAP_TU_CHOI_LD_CUC: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - LĐ Cục';
        break;
      }
      case this.globals.prop.NHAP_BAN_HANH: {
        this.titleStatus = 'Ban hành';
        this.styleStatus = 'da-ban-hanh';
        break;
      }
    }
  }

  onExpandChange(id: number, checked: boolean, type: number): void {
    if (type == 1) {
      if (checked) {
        this.expandSetView.add(id);
      } else {
        this.expandSetView.delete(id);
      }
    } else if (type == 2) {
      if (checked) {
        this.expandSetEdit.add(id);
      } else {
        this.expandSetEdit.delete(id);
      }
    }
  }

  expandAll() {
    this.thongTinChiTietTh.forEach(s => {
      this.expandSetEdit.add(s.idVirtual);
    })
    this.thongTinChiTiet.forEach(s => {
      this.expandSetView.add(s.idVirtual);
    })
  }

  async changePhuongAn() {

  }

  async loadDetail(id: number) {
    if (id > 0) {
      await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            res.data.soQd = res.data.soQd.split('/')[0];
            this.formData.patchValue(res.data);
            this.formData.patchValue({fileName: this.formData.get("fileDinhKem").value.fileName})
            this.thongTinChiTiet = this.buildChiTietPhuongAn(res.data.thongTinDeXuat);
            this.thongTinChiTietTh = this.buildChiTietPhuongAn(res.data.thongTinQuyetDinh);
            this.summaryData();
            this.expandAll();
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        trangThai: STATUS.DU_THAO,
        tenTrangThai: 'Dự thảo',
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI
      })
    }
  }

  async synthetic() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      let invalid = [];
      let controls = this.formData.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      console.log(invalid, 'invalid');
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin.');
      return;
    } else {
      try {
        this.spinner.show();
        let body = this.formData.value;
        await this.tongHopPhuongAnCuuTroService.syntheic(body).then(async res => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.thongTinChiTiet = this.buildChiTietPhuongAn(res.data.thongTinDeXuat);
            this.thongTinChiTietTh = this.thongTinChiTiet;
            if (!this.maTongHop) {
              this.maTongHop = await this.userService.getId("XH_TH_CUU_TRO_HDR_SEQ") + 1;
            }
            this.formData.patchValue({thongTinDeXuat: res.data.thongTinDeXuat, maTongHop: this.maTongHop});
            this.summaryData();
            this.expandAll();
          } else {
            this.formData.patchValue({thongTinTongHop: []})
            this.thongTinChiTiet = [];
            this.thongTinChiTietTh = [];
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          console.log(this.thongTinChiTiet, 'chitiet');
        });
      } catch
        (e) {
        console.log(e)
      } finally {
        this.spinner.hide();
      }
    }

  }

  /*  async dsLoaiHinhNhapXuat() {
      let res = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
      if (res.msg == MESSAGE.SUCCESS) {
        this.listLoaiHinhNhapXuat = res.data.filter(item =>
          item.phanLoai == 'VIEN_TRO_CUU_TRO'
        )
        ;
      }
      console.log(this.listLoaiHinhNhapXuat, 'loaihinh');
    }*/

  async dsPhuongAnTongHop() {
    let body = {
      trangThai: STATUS.DU_THAO,
      nam: this.formData.value.nam,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      }
    }
    let res = await this.tongHopPhuongAnCuuTroService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongAnTongHop = res.data.content;
    }
    console.log(this.listPhuongAnTongHop, 'listPhuongAnTongHop');
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  openDialogHangHoa() {
    if (!this.isView) {
      let data = this.formData.value.loaiVthh;
      const modalTuChoi = this.modal.create({
        nzTitle: 'Danh sách hàng hóa',
        nzContent: DialogDanhSachHangHoaComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          onlyLuongThuc: true,
        },
      });
      modalTuChoi.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            loaiVthh: data.parent.ma,
            tenLoaiVthh: data.parent.ten,
            cloaiVthh: data.ma,
            tenCloaiVthh: data.ten,
          });
        }
      });
    }
  }

  editThongTinTongHop(item: any) {
    console.log(item, 123)
  }

  deleteThongTinTongHop(idVirtual: any) {
    console.log(idVirtual, 234)
  }

  buildChiTietPhuongAn(data: any) {
    let dataResult = [];
    let dataGroup = data.reduce(function (acc, obj) {
      var key = obj['maDvi'];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
    let thongTinChiTiet = []
    data.forEach(s => {
        //
        /*s.thongTinChiTiet.forEach(x => {
          x.maDvi = s.maDvi;
          thongTinChiTiet.push(x);
        })
        this.formData.patchValue({thongTinTongHop: thongTinChiTiet, thongTinDeXuat: thongTinChiTiet,})*/

        //
        if (!dataResult.some(r => r.maDvi == s.maDvi)) {
          let thongTinChiTietArr = [];
          dataGroup[s.maDvi].forEach(x => {
              if (x.thongTinChiTiet) {
                x.thongTinChiTiet?.forEach(y => {
                  y.idVirtual = new Date().getTime() + y.id;
                  y.ngayDxuat = x.ngayDxuat;
                  y.thoiGianThucHien = x.thoiGianThucHien;
                  thongTinChiTietArr = [...thongTinChiTietArr, y];
                })
              } else {
                //truong hop obj tong hop
                x.idVirtual = new Date().getTime() + x.id;
                thongTinChiTietArr = [...thongTinChiTietArr, x];
              }
            }
          )
          dataResult.push({
            idVirtual: new Date().getTime() + s.id,
            maDvi: s.maDvi,
            tenDvi: s.tenDvi,
            tongSoLuong: s.tongSoLuong,
            soLuong: s.soLuong,
            ngayDxuat: s.ngayDxuat,
            thoiGianThucHien: s.thoiGianThucHien,
            thongTinChiTiet: thongTinChiTietArr
          })
        }
      }
    )
    return dataResult;
  };

  showModal(item: any): void {
    this.tongHopEdit = item;
    this.isVisible = true;
  }

  handleOk(): void {
    this.thongTinChiTietTh.forEach(s => {
      if (s.idVirtual == this.tongHopEdit.idVirtual) {
        s.thongTinChiTiet = this.tongHopEdit.thongTinChiTiet;
      }
    });
    this.summaryData();
    this.isVisible = false;
  }

  handleCancel()
    :
    void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.isVisibleTuChoiDialog = false;
  }

  summaryData() {
    this.tongSoLuongDxuat = 0;
    this.tongSoLuongTongHop = 0;
    this.tongThanhTienTongHop = 0;
    this.tongThanhTienDxuat = 0;

    this.thongTinChiTietTh.forEach(s => {
      let tongSoLuong = 0;
      let thanhTien = 0;
      s.thongTinChiTiet.forEach(s1 => {
        tongSoLuong += s1.soLuong;
        thanhTien += s1.thanhTien;
      })
      s.tongSoLuong = tongSoLuong;
      s.thanhTien = thanhTien;
      this.tongSoLuongTongHop += s.tongSoLuong;
      this.tongThanhTienTongHop += s.thanhTien;
    })

    this.thongTinChiTiet.forEach(s => {
      let tongSoLuong = 0;
      let thanhTien = 0;
      s.thongTinChiTiet.forEach(s1 => {
        tongSoLuong += s1.soLuong
        thanhTien += s1.thanhTien;
      })
      s.tongSoLuong = tongSoLuong;
      s.thanhTien = thanhTien;
      this.tongSoLuongDxuat += s.tongSoLuong;
      this.tongThanhTienDxuat += s.thanhTien;
    })
  }

  checkAvailableByStatus(nextStatus: String) {
    let currentStatus = this.formData.get('trangThai').value;
    //gui duyet
    if (currentStatus == STATUS.DU_THAO && nextStatus == STATUS.CHO_DUYET_LDTC) {
      return true;
    } else if (currentStatus == STATUS.TU_CHOI_LDTC && nextStatus == STATUS.CHO_DUYET_LDTC) {
      return true;
    }
    //duyet
    else if (currentStatus == STATUS.CHO_DUYET_LDTC && nextStatus == STATUS.DA_DUYET_LDTC) {
      return true;
    }
    //tu choi
    else if (currentStatus == STATUS.CHO_DUYET_LDTC && nextStatus == STATUS.TU_CHOI_LDTC) {
      return true;
    }
    //ban hanh
    else if (currentStatus == STATUS.DA_DUYET_LDTC && nextStatus == STATUS.BAN_HANH) {
      return true;
    }
    return false;
  }

  async updateStatus(status: string, title: string) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: title,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThai: status,
            lyDo: this.formData.get('lyDoTuChoi').value
          };
          let res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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

  showModalDialogTuChoi(): void {
    this.isVisibleTuChoiDialog = true;
  }

  getNameFile($event: any) {
    if ($event.target.files) {
      const itemFile = {
        name: $event.target.files[0].name,
        file: $event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          let fileDinhKemQd = new FileDinhKem();
          fileDinhKemQd.fileName = resUpload.filename;
          fileDinhKemQd.fileSize = resUpload.size;
          fileDinhKemQd.fileUrl = resUpload.url;
          fileDinhKemQd.idVirtual = new Date().getTime();
          this.formData.patchValue({fileDinhKem: fileDinhKemQd, fileName: itemFile.name})
        });
    }
  }

  downloadFile(fileDinhKem: any) {
    console.log(fileDinhKem)
  }

  async onChangePhuongAn(idPhuongAn: any) {
    try {
      this.spinner.show();
      await this.tongHopPhuongAnCuuTroService.getDetail(idPhuongAn).then(async res => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.thongTinChiTiet = this.buildChiTietPhuongAn(res.data.thongTinDeXuat);
          this.thongTinChiTietTh = this.buildChiTietPhuongAn(res.data.thongTinTongHop);
          this.formData.patchValue({
            loaiVthh: res.data.loaiVthh,
            cloaiVthh: res.data.cloaiVthh,
            loaiHinhNhapXuat: res.data.loaiHinhNhapXuat,
            tenLoaiVthh: res.data.tenLoaiVthh,
            tenCloaiVthh: res.data.tenCloaiVthh,
          })
          this.formData.patchValue({thongTinTongHop: res.data.thongTinTongHop});
          this.summaryData();
          this.expandAll();
        } else {
          this.thongTinChiTiet = [];
          this.thongTinChiTietTh = [];
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
        console.log(this.thongTinChiTiet, 'chitiet');
      });
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }
}
