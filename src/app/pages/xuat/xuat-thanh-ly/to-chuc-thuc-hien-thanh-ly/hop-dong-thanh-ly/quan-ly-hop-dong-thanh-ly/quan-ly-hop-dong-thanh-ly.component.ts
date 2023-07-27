import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {cloneDeep} from 'lodash';
import {MESSAGE} from "../../../../../../constants/message";
import {
  QuyetDinhPheDuyetKetQuaService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhPheDuyetKetQua.service";
import {
  ToChucThucHienThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/ToChucThucHienThanhLy.service";
import {
  HopDongThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/HopDongThanhLy.service";
import {
  QuyetDinhThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhThanhLyService.service";
import {STATUS} from "../../../../../../constants/status";


@Component({
  selector: 'app-quan-ly-hop-dong-thanh-ly',
  templateUrl: './quan-ly-hop-dong-thanh-ly.component.html',
  styleUrls: ['./quan-ly-hop-dong-thanh-ly.component.scss']
})
export class QuanLyHopDongThanhLyComponent extends Base2Component implements OnInit {

  @Input() id: number;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  isView = false;
  idHopDong: number;
  idKqTl: number;
  isEditHopDong: boolean
  listAllDviTsan: any[] = [];
  listDviTsanDaKy: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongThanhLyService: HopDongThanhLyService,
    private quyetDinhPheDuyetKetQuaService: QuyetDinhPheDuyetKetQuaService,
    private toChucThucHienThanhLyService: ToChucThucHienThanhLyService,
    private quyetDinhThanhLyService: QuyetDinhThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKetQuaService);
    this.formData = this.fb.group({
      id: [],
      nam: [''],
      soQdTl: [],
      soHoSo: [],
      tenDvi: [],
      tongTienGiaKdiem: [],
      tgianThanhLy: [''],
      tgianTtoan: [],
      tgianGnhan: [],
      pthucTtoan: [''],
      tongSoDviTsanDg: [],
      soLuongDviTsanTrung: [],
      soLuongDviTsanTruot: [],
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
    try {
      await Promise.all([]);
      if (this.id) {
        await this.getDetail(this.id)
        await this.selectRow(this.dataTable[0])
      }
      await this.spinner.hide()
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getDetail(id) {
    if (id) {
      let res = await this.quyetDinhPheDuyetKetQuaService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataQdKq = res.data;
        let resTc = await this.toChucThucHienThanhLyService.getDetail(dataQdKq.idThongBao);
        if (resTc.msg == MESSAGE.SUCCESS) {
          const dataTc = resTc.data
          this.formData.patchValue({
            nam: dataQdKq.nam,
            soQdTl: dataQdKq.soQdTl,
            soHoSo: dataQdKq.soBienBan,
            tenDvi: dataQdKq.tenDvi,
            tongTienGiaKdiem: dataQdKq.thanhTien,
            tgianTtoan: dataTc.thoiHanThanhToan,
            tgianGnhan: dataTc.thoiHanGiaoNhan,
            pthucTtoan: dataTc.pthucTtoan,
            loaiHinhNx: dataQdKq.loaiHinhNhapXuat,
            tenLoaiHinhNx: dataQdKq.tenLoaiHinhNx,
            kieuNx: dataQdKq.kieuNhapXuat,
            tenKieuNx: dataQdKq.tenKieuNx,
            trangThaiHd: dataQdKq.trangThaiHd,
            tenTrangThaiHd: dataQdKq.tenTrangThaiHd
          })
          this.listAllDviTsan = dataTc.toChucDtl;
          this.listAllDviTsan = this.listAllDviTsan.filter((item) => {
            return item.toChucCaNhan !== null && item.soLanTraGia > 0
          }).map(item => item.maDviTsan);
          this.dataTable = dataQdKq.listHopDong;
          this.listDviTsanDaKy = this.dataTable.filter(item => item.trangThai == STATUS.DA_KY);
          this.listDviTsanDaKy = this.listDviTsanDaKy.map(item => item.maDviTsan.split(",")).flat();
        }
      }
    }
  }

  async selectRow(item: any) {
    if (this.dataTable.length > 0) {
      this.dataTable.forEach(i => i.selected = false);
      item.selected = true;
      this.idHopDong = cloneDeep(item.id);
      this.idKqTl = cloneDeep(item.idQdKqTl)
      this.isView = true;
    }
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
        this.approve(this.id, STATUS.DA_HOAN_THANH, "Bạn có muốn hoàn thành thực hiện hợp đồng ?")
      } else {
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
          this.hopDongThanhLyService.delete(body).then(async () => {
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
