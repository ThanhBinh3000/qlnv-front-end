import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCanCuHopDongComponent } from 'src/app/components/dialog/dialog-can-cu-hop-dong/dialog-can-cu-hop-dong.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { Cts, QuyetDinhGiaoNhiemVuXuatHang } from 'src/app/models/QuyetDinhGiaoNhiemVuXuatHang';
import { UserLogin } from 'src/app/models/userlogin';
import { QuyetDinhGiaoNhiemVuXuatHangService } from 'src/app/services/quyetDinhGiaoNhiemVuXuatHang.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
@Component({
  selector: 'app-themmoi-qdinh-nhap-xuat-hang',
  templateUrl: './themmoi-qdinh-nhap-xuat-hang.component.html',
  styleUrls: ['./themmoi-qdinh-nhap-xuat-hang.component.scss'],
})
export class ThemmoiQdinhNhapXuatHangComponent implements OnInit {
  @Input() id: number;
  @Input() typeVthh: string;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() isViewDetail: boolean;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  formData: FormGroup;
  userInfo: UserLogin;
  routerUrl: string;
  isChiTiet: boolean = false;

  loaiVthh: string;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  qdGiaoNhiemVuXuatHang: QuyetDinhGiaoNhiemVuXuatHang = new QuyetDinhGiaoNhiemVuXuatHang();
  chiTietQds: Array<Cts>;
  hopDongList: any[] = [];
  listFileDinhKem: Array<FileDinhKem> = [];
  hopDongListShow: any[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    public globals: Globals,
    private userService: UserService,
    private quyetDinhNhapXuatService: QuyetDinhGiaoNhiemVuXuatHangService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.userInfo = this.userService.getUserLogin();
    this.routerUrl = this.router.url;
    this.qdGiaoNhiemVuXuatHang.trangThai = this.globals.prop.NHAP_DU_THAO;
    this.initForm();
    if (this.id > 0) {
      this.loadThongTinQdNhapXuatHang(this.id);
    }
    this.formData.patchValue({
      donVi: this.userInfo.TEN_DVI,
      maDonVi: this.userInfo.MA_DVI,
    });
  }

  initForm() {
    this.formData = this.fb.group({
      soQD: [
        {
          value: this.qdGiaoNhiemVuXuatHang
            ? this.qdGiaoNhiemVuXuatHang.soQuyetDinh
            : null,
          disabled: this.isView ? true : false
        },
        [Validators.required],
      ],
      soHopDong: [
        {
          value: this.qdGiaoNhiemVuXuatHang
            ? this.qdGiaoNhiemVuXuatHang.soHopDong
            : null,
          disabled: this.isView ? true : false
        },
        [Validators.required],
      ],
      donVi: [
        {
          value: this.qdGiaoNhiemVuXuatHang
            ? this.qdGiaoNhiemVuXuatHang.donVi
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      maDonVi: [
        {
          value: this.qdGiaoNhiemVuXuatHang
            ? this.qdGiaoNhiemVuXuatHang.maDonVi
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      ngayQuyetDinh: [
        {
          value: this.qdGiaoNhiemVuXuatHang
            ? this.qdGiaoNhiemVuXuatHang.ngayQuyetDinh
            : null,
          disabled: this.isView ? true : false
        },
        [Validators.required],
      ],
      trichYeu: [
        {
          value: this.qdGiaoNhiemVuXuatHang
            ? this.qdGiaoNhiemVuXuatHang.trichYeu
            : null,
          disabled: this.isView ? true : false
        },
        [Validators.required],
      ],
    });
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      this.hopDongListShow = this.hopDongList.slice(((this.page - 1) * this.pageSize), (this.page * this.pageSize));
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      this.hopDongListShow = this.hopDongList.slice(((this.page - 1) * this.pageSize), (this.page * this.pageSize));
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  openDialogQuyetDinhGiaoChiTieu() {
    if (this.isChiTiet) {
      return;
    }
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin hợp đồng',
      nzContent: DialogCanCuHopDongComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        isXuat: true
      },
    });
    modalQD.afterClose.subscribe((hopDongs) => {
      if (hopDongs) {
        let canCuHd = '';
        this.qdGiaoNhiemVuXuatHang.hopDongIds = [];
        if (hopDongs.length > 0) {
          this.hopDongList = [];
          this.hopDongListShow = [];
          this.totalRecord = 0;
          hopDongs.forEach((hd, i) => {
            if (hd && hd.bhDdiemNhapKhoList && hd.bhDdiemNhapKhoList.length > 0) {
              hd.bhDdiemNhapKhoList.forEach((itemDiemKho: any) => {
                let item = {
                  "donGiaKhongThue": itemDiemKho.donGia ?? 0,
                  "donViTinh": itemDiemKho.dviTinh,
                  "id": 0,
                  "maDiemKho": itemDiemKho.maDiemKho,
                  "maDvi": itemDiemKho.maDvi,
                  "maNganKho": itemDiemKho.maNganKho,
                  "maNganLo": itemDiemKho.maNganLo,
                  "maNhaKho": itemDiemKho.maNhaKho,
                  "maVatTu": hd.cloaiVthh,
                  "maVatTuCha": hd.loaiVthh,
                  "qdgnvxId": 0,
                  "soLuong": itemDiemKho.soLuong ?? 0,
                  "stt": 0,
                  "thanhTien": ((itemDiemKho.donGia ?? 0) * (itemDiemKho.soLuong ?? 0)) ?? 0,
                  "thoiHanXuatBan": null,
                  "tenDvi": itemDiemKho.tenDvi,
                  "tenDiemKho": itemDiemKho.tenDiemKho,
                  "tenNhaKho": itemDiemKho.tenNhaKho,
                  "tenNganKho": itemDiemKho.tenNganKho,
                  "tenLoKho": itemDiemKho.tenLoKho,
                  "tenVatTuCha": itemDiemKho.tenLoaiHangHoa,
                  "tenVatTu": itemDiemKho.tenChungLoaiHH,
                }
                this.hopDongList.push(item);
              });
            }
            canCuHd += hd.soHd
            if (i < hopDongs.length - 1) {
              canCuHd += ' - '
            };
            this.qdGiaoNhiemVuXuatHang.hopDongIds.push(hd.id);
          });
          if (this.hopDongList && this.hopDongList.length > 0) {
            this.totalRecord = this.hopDongList.length;
            this.hopDongListShow = this.hopDongList.slice(((this.page - 1) * this.pageSize), (this.page * this.pageSize));
          }
        }
        this.formData.patchValue({
          soHopDong: canCuHd,
        });
      }
    });
  }

  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = {
        "cts": this.hopDongList,
        "fileDinhKems": this.listFileDinhKem,
        "hopDongIds": this.qdGiaoNhiemVuXuatHang.hopDongIds,
        "id": this.qdGiaoNhiemVuXuatHang.id,
        "loaiVthh": this.typeVthh,
        "ngayQuyetDinh": this.formData.get('ngayQuyetDinh').value ? dayjs(this.formData.get('ngayQuyetDinh').value).format('YYYY-MM-DD') : dayjs().toString(),
        "soQuyetDinh": `${this.formData.get('soQD').value}/${this.userInfo.MA_QD}`,
        "trichYeu": this.formData.get('trichYeu').value,
        "namXuat": dayjs().get('year'),
      }
      if (this.id > 0) {
        let res = await this.quyetDinhNhapXuatService.sua(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.redirectQdNhapXuat();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.quyetDinhNhapXuatService.them(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.redirectQdNhapXuat();
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

  redirectQdNhapXuat() {
    this.showListEvent.emit();
  }

  loadThongTinQdNhapXuatHang(id: number) {
    this.quyetDinhNhapXuatService
      .loadChiTiet(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.qdGiaoNhiemVuXuatHang = res.data;
          console.log("res.data: ", res.data);
          this.listFileDinhKem = res.data.fileDinhKems;
          this.qdGiaoNhiemVuXuatHang.fileDinhKems = res.data.fileDinhKems;
          this.hopDongList = [];
          this.hopDongListShow = [];
          this.totalRecord = 0;
          if (res.data && res.data.cts && res.data.cts.length > 0) {
            this.hopDongList = res.data.cts;
            this.totalRecord = this.hopDongList.length;
            this.hopDongListShow = this.hopDongList.slice(((this.page - 1) * this.pageSize), (this.page * this.pageSize));
          }
          this.initForm();
          let listHopDong = res.data.hopDongs;
          if (listHopDong) {
            let canCuHd = '';
            listHopDong.forEach((hd, i) => {
              canCuHd += hd.name
              if (i < listHopDong.length - 1) {
                canCuHd += ' - '
              }
            });
            this.formData.patchValue({
              soHopDong: canCuHd,
            });
          }
          this.formData.patchValue({
            soQD: this.qdGiaoNhiemVuXuatHang.soQuyetDinh?.split('/')[0],
            donVi: this.qdGiaoNhiemVuXuatHang.tenDvi,
            maDonVi: this.qdGiaoNhiemVuXuatHang.maDvi,
          })
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      })
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
            lyDo: null,
            trangThai: this.globals.prop.NHAP_CHO_DUYET_TP,
          };
          let res =
            await this.quyetDinhNhapXuatService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.redirectQdNhapXuat();
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
    let trangThai = this.globals.prop.NHAP_CHO_DUYET_LD_CUC;
    if (this.qdGiaoNhiemVuXuatHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CUC) {
      trangThai = this.globals.prop.NHAP_BAN_HANH;
    }
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
            lyDo: null,
            trangThai: trangThai,
          };
          let res =
            await this.quyetDinhNhapXuatService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.redirectQdNhapXuat();
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
    let trangThai = this.globals.prop.NHAP_TU_CHOI_TP;
    if (this.qdGiaoNhiemVuXuatHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CUC) {
      trangThai = this.globals.prop.NHAP_TU_CHOI_LD_CUC;
    }
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
            lyDo: text,
            trangThai: trangThai,
          };
          let res =
            await this.quyetDinhNhapXuatService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.redirectQdNhapXuat();
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

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.redirectQdNhapXuat();
      },
    });
  }

  isDetail(): boolean {
    return (
      this.isViewDetail
    );
  }
  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }


  isDisableField() {
    if (this.qdGiaoNhiemVuXuatHang && (this.qdGiaoNhiemVuXuatHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.qdGiaoNhiemVuXuatHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.qdGiaoNhiemVuXuatHang.trangThai == this.globals.prop.NHAP_DA_DUYET)) {
      return true;

    }
    return false;
  }
}
