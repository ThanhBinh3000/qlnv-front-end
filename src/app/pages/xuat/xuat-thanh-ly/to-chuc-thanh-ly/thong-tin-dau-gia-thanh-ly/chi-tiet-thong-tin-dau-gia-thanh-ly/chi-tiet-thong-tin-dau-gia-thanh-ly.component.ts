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
  dsQuyetDinhTl: any[] = [];

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
          this.loadThongTinDauGia();
        }
      })
    }
  }

  async loadThongTinDauGia() {
    let body = {
      idQdTl : this.id
    }
    await this.toChucThucHienThanhLyService.getAll(body).then((res)=>{
      console.log(res)
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
          let res = await this._service.approveDtl(body);
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

  async detailQuyetDinhThanhLy(id) {
    await this.spinner.show();
    if (id > 0) {
      await this._service.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data
            const dataDtl = data.quyetDinhDtl.filter(item => item.id == this.id)[0];
            this.formData.patchValue({
              trangThai: dataDtl.trangThaiThucHien,
              tenTrangThai: dataDtl.tenTrangThaiThucHien,
              nam: data.nam,
              idQdTl: data.id,
              soQdTl: data.soQd,
              soHoSoTl: data.soHoSo,
              tenDvi: dataDtl.tenCuc,
              tongTienGiaKhoiDiem: data.tongThanhTien,
              thoiGianTlDuocDuyet: ['Từ' + ' ' + dayjs(data.thoiGianTlTu).format('DD/MM/YYYY') + ' ' + 'Đến' + ' ' + dayjs(data.thoiGianTlDen).format('DD/MM/YYYY')],
            });
            this.dataTable = cloneDeep(dataDtl.xhTlToChucHdr);
            if (this.dataTable && this.dataTable.length > 0) {
              await this.showFirstRow(event, this.dataTable[0]);
            }
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
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
    if (!data) {
      let dataCheck = this.dataTable.filter(item => {
        return item.trangThai == this.STATUS.DU_THAO
      })
      if (dataCheck.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Không thể thêm mới, vì đang có thông tin đấu giá chưa hoàn thành cập nhập, xin viu lòng hoàn thành cập nhập");
        return;
      }
    } const modalQD = this.modal.create({
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
        soQdTl: this.formData.value.soQd,
        dataDetail: data,
        soLanDauGia: this.dataTable.length
      },
    });
    modalQD.afterClose.subscribe((data) => {
      this.loadThongTinDauGia()
    });
  }

}
