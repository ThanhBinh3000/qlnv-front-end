import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import {
  HopDongXuatHangService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/hop-dong/hopDongXuatHang.service';
import {
  QdPdKetQuaBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service';
import {
  ThongTinDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import { StorageService } from 'src/app/services/storage.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-quanly-hopdong',
  templateUrl: './quanly-hopdong.component.html',
  styleUrls: ['./quanly-hopdong.component.scss']
})
export class QuanlyHopdongComponent extends Base2Component implements OnInit {

  @Input() id: number;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  isView = false;
  idHopDong: number;
  isEditHopDong: boolean
  listAllDviTsan: any[] = [];
  listDviTsanDaKy: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongXuatHangService: HopDongXuatHangService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService,
    private thongTinDauGiaService: ThongTinDauGiaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBanDauGiaService);
    this.formData = this.fb.group({
      id: [],
      nam: [''],
      soQdKq: [],
      soQdPd: [],
      tenDvi: [],
      soLuongDviTsan: [],
      soLuongDviTsanTrung: [],
      soLuongDviTsanTruot: [],
      vat: ['5%'],
      tenLoaiVthh: [],
      loaiHdong: [],
      tenCloaiVthh: [],
      soLuongXuatBan: [],
      donGiaTrungThau: [],
      tongTien: [''],
      loaiHinhNx: [''],
      tenLoaiHinhNx: [''],
      kieuNx: [''],
      tenKieuNx: [''],
      trangThaiHd: [''],
      tenTrangThaiHd: [''],
    });
  }

  async ngOnInit() {
    await this.spinner.show()
    await Promise.all([]);
    if (this.id) {
      await this.getDetail(this.id)
      await this.selectRow(this.dataTable[0])
    }
    await this.spinner.hide()
  }

  async getDetail(id) {
    if (id) {
      let res = await this.qdPdKetQuaBanDauGiaService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        await this.thongTinDauGiaService.getDetail(data.maThongBao?.split('/')[0]).then(dataTtin => {
          this.formData.patchValue({
            nam: data.nam,
            soQdKq: data.soQdKq,
            soQdPd: dataTtin.data?.soQdPd,
            tenDvi: data.tenDvi,
            tenLoaiVthh: dataTtin.data?.tenLoaiVthh,
            tenCloaiVthh: dataTtin.data?.tenCloaiVthh,
            trangThaiHd: data.trangThaiHd,
            tenTrangThaiHd: data.tenTrangThaiHd,
            soLuongDviTsan: data.tongDvts,
            soLuongXuatBan: data.tongSlXuat,
            tongTien: data.thanhTien,
            loaiHinhNx: data.loaiHinhNx,
            tenLoaiHinhNx: data.tenLoaiHinhNx,
            kieuNx: data.kieuNx,
            tenKieuNx : data.tenKieuNx,
            soLuongDviTsanTrung: data.soDvtsDgTc,
            soLuongDviTsanTruot: data.tongDvts - data.soDvtsDgTc,
          })
          this.listAllDviTsan = dataTtin.data.children;
          this.listAllDviTsan = this.listAllDviTsan.flatMap(item => item.children).filter((item) => {
            return item.toChucCaNhan !== null && item.soLanTraGia > 0
          }).map(item => item.maDviTsan);
          this.dataTable = data.listHopDong;
          this.listDviTsanDaKy = this.dataTable.filter(item => item.trangThai == STATUS.DA_KY);
          this.listDviTsanDaKy = this.listDviTsanDaKy.map(item => item.maDviTsan.split(",")).flat();
        });
      }
    }
  }

  async selectRow(item: any) {
    if (this.dataTable.length > 0) {
      this.dataTable.forEach(i => i.selected = false);
      item.selected = true;
      this.idHopDong = cloneDeep(item.id);
      this.isView = true;
    }
  }

  async getDetailHopDong($event, id: number, b: boolean) {
    this.spinner.show();
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')
    this.idHopDong = id;
    this.isView = b;
    this.spinner.hide();
  }

  async redirectHopDong(isShowHd: boolean, id: number) {
    this.isEditHopDong = isShowHd;
    this.idHopDong = id;
    if (!isShowHd) {
      await this.ngOnInit()
    }
  }

  async pheDuyet() {
    await this.spinner.show()
    if (this.validateData()) {
      if (this.listAllDviTsan.length == this.listDviTsanDaKy.length) {
        this.approve(this.id, STATUS.HOAN_THANH_CAP_NHAT, "Bạn có muốn hoàn thành thực hiện hợp đồng ?")
      }
      else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng ký tất cả các mã đơn vị tài sản");
      }
    }
    await this.spinner.hide()
  }

  validateData(): boolean {
    let result = true;
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(item => {
        if (item) {
          if (item.trangThai != STATUS.DA_KY) {
            this.notification.error(MESSAGE.ERROR, "Vui lòng ký tất cả hợp đồng cho các gói thầu");
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
          this.hopDongXuatHangService.delete(body).then(async () => {
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

  outputListAllDviTsan($event) {
    this.listAllDviTsan = $event;
  }
}
