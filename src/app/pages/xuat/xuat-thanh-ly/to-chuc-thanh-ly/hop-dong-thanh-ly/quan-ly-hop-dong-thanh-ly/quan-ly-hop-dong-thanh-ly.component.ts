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
import {Base3Component} from "../../../../../../components/base3/base3.component";
import {ActivatedRoute, Router} from "@angular/router";
import dayjs from "dayjs";


@Component({
  selector: 'app-quan-ly-hop-dong-thanh-ly',
  templateUrl: './quan-ly-hop-dong-thanh-ly.component.html',
  styleUrls: ['./quan-ly-hop-dong-thanh-ly.component.scss']
})
export class QuanLyHopDongThanhLyComponent extends Base3Component implements OnInit {

  isView = false;
  idHopDong: number;
  idKqTl: number;
  isEditHopDong: boolean
  listAllDviTsan: any[] = [];
  listDviTsanDaKy: any[] = [];
  idQdNv: number = 0;
  isViewQdNv: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private hopDongThanhLyService: HopDongThanhLyService,
    private _service: QuyetDinhPheDuyetKetQuaService,
    private toChucThucHienThanhLyService: ToChucThucHienThanhLyService,
    private quyetDinhThanhLyService: QuyetDinhThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal,route,router, _service);
    this.defaultURL = '/xuat/xuat-thanh-ly/to-chuc/hop-dong'
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
    this.spinner.show()
    await Promise.all([
      this.getId(),
      this.initForm()
    ])
    this.spinner.hide()
  }

  async initForm(){
    if(this.id){
      this.spinner.show();
      await this.getDetail(this.id);
      this.spinner.hide();
    }
  }

  async getDetail(id) {
    if (id) {
      console.log(id)
      this.spinner.show();
      await this._service.getDetail(id).then(async res => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataQdKq = res.data;
          this.spinner.show();
          let resTc = await this.toChucThucHienThanhLyService.getDetail(dataQdKq.idThongBao);
          if (resTc.msg == MESSAGE.SUCCESS) {
            const dataTc = resTc.data
            this.formData.patchValue({
              nam: dataQdKq.nam,
              soQdTl: dataQdKq.xhTlQuyetDinhHdr?.soQd,
              soHoSo: dataQdKq.xhTlQuyetDinhHdr?.soHoSo,
              tenDvi: dataQdKq.tenDvi,
              tongTienGiaKdiem: dataQdKq.xhTlQuyetDinhHdr?.tongGiaKhoiDiem,
              tgianThanhLy: 'Từ ' + dayjs(dataQdKq.xhTlQuyetDinhHdr?.thoiGianTlTu).format('DD/MM/YYYY') + ' đến ' + dayjs(dataQdKq.xhTlQuyetDinhHdr?.thoiGianTlDen).format('DD/MM/YYYY'),
              tgianTtoan: '3',
              tgianGnhan: '15',
              pthucTtoan: 'Giao hàng tại cửa kho',
              tenLoaiHinhNx: dataQdKq.tenLoaiHinhNx,
              tenKieuNx: dataQdKq.tenKieuNx,
              tenTrangThaiHd: dataQdKq.tenTrangThaiHd,
              tongSoDviTsanDg: dataQdKq.xhTlQuyetDinhHdr?.tongDviTsan,
              soLuongDviTsanTrung: dataQdKq.xhTlQuyetDinhHdr?.tongDviTsanThanhCong,
              soLuongDviTsanTruot: dataQdKq.xhTlQuyetDinhHdr?.tongDviTsanKhongThanhCong
            })
            this.dataTable = dataQdKq.listHopDong;
          }
          this.spinner.hide();
        }
      });

      // this.spinner.hide();
    }
  }

  getDsHopDong(){
    // let body = {
    //   idQd
    // }
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

  isDisabled() {
    if (this.formData.value.trangThai == STATUS.DA_HOAN_THANH) {
      return true
    } else {
      return false;
    }
  }

  openModalQdNv(id: number) {
    this.idQdNv = id;
    this.isViewQdNv = true;
  }

  closeModalQdNv() {
    this.idQdNv = null;
    this.isViewQdNv = false;
  }
}
