import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {MESSAGE} from "src/app/constants/message";
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';

import {
  ToChucThucHienThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/ToChucThucHienThanhLy.service";
import {
  QuyetDinhThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhThanhLyService.service";
import {STATUS} from "../../../../../../constants/status";
import dayjs from "dayjs";
import { cloneDeep } from 'lodash';
import {
  ThongTinChiTietDauGiaThanhLyComponent
} from "./thong-tin-dau-gia-thanh-ly/thong-tin-chi-tiet-dau-gia-thanh-ly.component";
import {Base3Component} from "../../../../../../components/base3/base3.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-chi-tiet-thong-tin-dau-gia-thanh-ly',
  templateUrl: './chi-tiet-thong-tin-dau-gia-thanh-ly.component.html',
  styleUrls: ['./chi-tiet-thong-tin-dau-gia-thanh-ly.component.scss']
})
export class ChiTietThongTinDauGiaThanhLyComponent extends Base3Component implements OnInit {
  dataDetail: any;
  selected: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: QuyetDinhThanhLyService,
    private toChucThucHienThanhLyService: ToChucThucHienThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.defaultURL = '/xuat/xuat-thanh-ly/to-chuc/thong-tin-dau-gia'
    this.formData = this.fb.group(
      {
        id: [],
        nam: [],
        idQd: [],
        soQd: [''],
        soHoSo: [''],
        tenDvi: [''],
        tongTienGiaKhoiDiem: [],
        thoiGianTlDuocDuyet: [],
        tgianTtoan: [],
        tgianGnhan: [],
        pthucGnhan: [''],
        tongDviTsan: [],
        soDviTsanThanhCong: [],
        soDviTsanKhongThanh: [],
        loaiHinhNx: [''],
        kieuNx: [''],
        trangThai: [],
        tenTrangThai: [],
        trangThaiDg : [],
        tenTrangThaiDg : [],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      await this.getId(),
      await this.initForm()
    ])
    this.spinner.hide();
  }

  async initForm() {
    if (this.id) {
      await this.detail(this.id).then((res) => {
        if (res) {
          this.formData.patchValue({
            thoiGianTlDuocDuyet : 'Từ ' + dayjs(res.thoiGianTlTu).format('DD/MM/YYYY') + ' đến ' + dayjs(res.thoiGianTlDen).format('DD/MM/YYYY'),
            tongDviTsan : res.tongDviTsan,
            soDviTsanThanhCong : res.tongDviTsanThanhCong,
            soDviTsanKhongThanh : res.tongDviTsanKhongThanhCong,
            tongTienGiaKhoiDiem : res.tongGiaKhoiDiem
          })
          this.loadThongTinDauGia();
        }
      })
    }
    this.formData.patchValue({
      tenDvi : this.userInfo.TEN_DVI,
      tgianTtoan : '3',
      tgianGnhan : '15',
      pthucGnhan : 'Giao hàng tại cửa kho',
      loaiHinhNx : 'Xuất bán đấu giá',
      kieuNx : 'Xuất bán'
    })
  }

  async loadThongTinDauGia() {
    let body = {
      idQdTl : this.id
    }
    await this.toChucThucHienThanhLyService.getAll(body).then((res)=>{
      this.dataTable = res.data;
    })
  }

  hoanThanhCapNhat() {
    if (this.dataTable.length == 0) {
      this.notification.error(MESSAGE.ERROR, "Không thể kết thúc đấu giá, phải có ít nhất 1 lần đấu giá");
      return
    } else {
      let dataFilter = this.dataTable.filter(item => item.trangThai == this.STATUS.DU_THAO)
      if (dataFilter && dataFilter.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Không thể kết thúc đấu giá, thông báo " + dataFilter[0].maThongBao + " đang chưa hoàn thành");
        return
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn kết thúc đấu giá ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: this.STATUS.HOAN_THANH_CAP_NHAT
          }
          let res = await this._service.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.loadThongTinDauGia()
            this.spinner.hide();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            this.spinner.hide();
          }
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      },
    });
  }

  async showFirstRow($event, data: any) {
    await this.showDetail($event, data);
  }

  async showDetail($event, data: any) {
    await this.spinner.show();
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow');
    } else {
      this.selected = true;
    }
    this.dataDetail = data;
    await this.spinner.hide();
  }

  async deleteThongTin(data) {
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
          this.toChucThucHienThanhLyService.delete(body).then(async () => {
            this.loadThongTinDauGia();
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

  themMoiPhienDauGia($event, data?: any) {
    $event.stopPropagation();
    if (data) {
      const modalQD = this.modal.create({
        nzTitle: '',
        nzContent: ThongTinChiTietDauGiaThanhLyComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '2000px',
        nzFooter: null,
        nzBodyStyle: { 'overflow-y': 'auto' },
        nzComponentParams: {
          isModal: true,
          idInput : data?.id,
          soLanDauGia: this.dataTable ? this.dataTable.length : 0
        },
      });
      modalQD.afterClose.subscribe((data) => {
        this.loadThongTinDauGia()
      });
    }else{
      let dataCheck = this.dataTable.filter(item => {
        return item.trangThai == this.STATUS.DU_THAO
      })
      if (dataCheck.length > 0) {
        this.notification.info(MESSAGE.ERROR, "Không thể thêm mới vì đang có thông tin đấu giá chưa hoàn thành cập nhập. Vui lòng hoàn thành cập nhập thông tin đấu giá");
        return;
      }
      const modalQD = this.modal.create({
        nzTitle: '',
        nzContent: ThongTinChiTietDauGiaThanhLyComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '2000px',
        nzFooter: null,
        nzBodyStyle: { 'overflow-y': 'auto' },
        nzComponentParams: {
          isModal: true,
          idQdTl: this.id,
          soLanDauGia: this.dataTable ? this.dataTable.length : 0
        },
      });
      modalQD.afterClose.subscribe((data) => {
        this.loadThongTinDauGia()
      });
    }
  }

}
