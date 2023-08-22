import {HttpClient} from '@angular/common/http';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {
  QuyetDinhPdKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import {HopDongBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {
  QdPdKetQuaBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import {StorageService} from 'src/app/services/storage.service';
import {
  ChaoGiaMuaLeUyQuyenService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service";

@Component({
  selector: 'app-quan-ly-hop-dong-btt',
  templateUrl: './quan-ly-hop-dong-btt.component.html',
  styleUrls: ['./quan-ly-hop-dong-btt.component.scss']
})
export class QuanLyHopDongBttComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  isEditHopDong: boolean
  selected: boolean = false;
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongBttService: HopDongBttService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [''],
      soQdKq: [],
      soQdPd: [],
      tenHd: [],
      tenDvi: [],
      thanhTien: [],
      tongSlXuatBanQdKh: [],
      tongSlBanttQdkhDakyHd: [],
      tongSlBanttQdkhChuakyHd: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      vat: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      trangThaiHd: [''],
      tenTrangThaiHd: [''],
    });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      if (this.id) {
        await Promise.all([
          this.getDetail(this.id),
          this.loadDataComboBox()
        ]);
      }
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDataComboBox() {
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'XUAT_TT');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
  }

  async getDetail(id) {
    await this.spinner.show();
    if (id > 0) {
      if (this.userService.isChiCuc()) {
        await this.chaoGiaMuaLeUyQuyenService.getDetail(id)
          .then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              const data = res.data
              this.formData.patchValue({
                trangThaiHd: data.trangThaiHd,
                tenTrangThaiHd: data.tenTrangThaiHd,
                namKh: data.namKh,
                soQdPd: data.soQdPd,
                loaiVthh: data.loaiVthh,
                tenLoaiVthh: data.tenLoaiVthh,
                cloaiVthh: data.cloaiVthh,
                tenCloaiVthh: data.tenCloaiVthh,
                loaiHinhNx: data.loaiHinhNx != null ? 'Xuất bán đấu giá' : null,
                kieuNx: data.kieuNx != null ? 'Xuất bán' : null,
                vat: '5 %',
              })
              this.dataTable = data.listHopDongBtt;
              if (this.dataTable && this.dataTable.length > 0) {
                this.showFirstRow(event, this.dataTable[0].id);
              }
            }
          }).catch((e) => {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          });
      } else {
        await this.qdPdKetQuaBttService.getDetail(id)
          .then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              const data = res.data
              this.formData.patchValue({
                trangThaiHd: data.trangThaiHd,
                tenTrangThaiHd: data.tenTrangThaiHd,
                namKh: data.namKh,
                soQdPd: data.soQdPd,
                soQdKq: data.soQdKq,
                loaiVthh: data.loaiVthh,
                tenLoaiVthh: data.tenLoaiVthh,
                cloaiVthh: data.cloaiVthh,
                tenCloaiVthh: data.tenCloaiVthh,
                loaiHinhNx: data.loaiHinhNx != null ? 'Xuất bán đấu giá' : null,
                kieuNx: data.kieuNx != null ? 'Xuất bán' : null,
                vat: '5 %',
              });
              this.dataTable = data.listHopDongBtt;
              if (this.dataTable && this.dataTable.length > 0) {
                this.showFirstRow(event, this.dataTable[0].id);
              }
            }
          }).catch((e) => {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          });
      }
    }
    await this.spinner.hide();
  }

  async showFirstRow($event, id: any) {
    await this.showDetail($event, id);
  }

  idHopDong: number;

  async showDetail($event, id: number) {
    await this.spinner.show();
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow')
    } else {
      this.selected = true
    }
    this.idHopDong = id;
    await this.spinner.hide();
    await this.hopDongBttService.getDetail(this.idHopDong)
      .then(async (res) => {
        const dataHopDong = res.data;
        this.formData.patchValue({
          tenHd: dataHopDong.tenHd,
          thanhTien: dataHopDong.thanhTien,
          tongSlXuatBanQdKh: dataHopDong.tongSlXuatBanQdKh,
          tongSlBanttQdkhDakyHd: dataHopDong.tongSlBanttQdkhDakyHd,
          tongSlBanttQdkhChuakyHd: dataHopDong.tongSlBanttQdkhChuakyHd,
        })
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  async redirectHopDong(isShowHd: boolean, id: number) {
    this.isEditHopDong = isShowHd;
    this.idHopDong = id;
    if (!isShowHd) {
      await this.ngOnInit()
    }
  }

  async pheDuyet() {
    this.userService.isChiCuc() ? await this.guiDuyetChiCuc() : await this.guiDuyetCuc()
  }

  async guiDuyetCuc() {
    await this.spinner.show()
    if (this.validateData()) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có muốn hoành thành thực hiện hợp đồng ?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 350,
        nzOnOk: async () => {
          await this.spinner.show();
          try {
            let body = {
              id: this.id,
              trangThai: STATUS.DA_HOAN_THANH,
            };
            let res = await this.qdPdKetQuaBttService.approve(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DUYET_SUCCESS,
              );
              this.goBack();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            await this.spinner.hide();
          } catch (e) {
            console.log('error: ', e);
            await this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
      });
    }
    await this.spinner.hide()
  }

  async guiDuyetChiCuc() {
    await this.spinner.show()
    if (this.validateData()) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có muốn hoành thành thực hiện hợp đồng ?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 350,
        nzOnOk: async () => {
          await this.spinner.show();
          try {
            let body = {
              id: this.id,
              trangThai: STATUS.DA_HOAN_THANH,
            };
            let res = await this.chaoGiaMuaLeUyQuyenService.approve(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DUYET_SUCCESS,
              );
              this.goBack();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            await this.spinner.hide();
          } catch (e) {
            console.log('error: ', e);
            await this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
      });
    }
    await this.spinner.hide()
  }

  validateData(): boolean {
    let result = true;
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(item => {
        if (item) {
          if (item.trangThai != STATUS.DA_KY) {
            this.notification.error(MESSAGE.ERROR, "Vui lòng ký tất cả các hợp đồng");
            result = false;
            return
          }
        }
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng thêm hợp đồng");
      result = false;
      return
    }
    return result;
  }

  async deleteHd(data) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: data.id
          };
          this.hopDongBttService.delete(body).then(async () => {
            this.getDetail(this.id);
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  calcTong(column) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[column];
        return prev;
      }, 0);
      return sum;
    }
  }
}
