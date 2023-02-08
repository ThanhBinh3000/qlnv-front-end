import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { FormArray, Validators } from "@angular/forms";
import { MESSAGE } from "../../../../../../../constants/message";
import * as dayjs from "dayjs";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { ThongtinDaugiaComponent } from './thongtin-daugia/thongtin-daugia.component';
import { QuyetDinhPdKhBdgService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import { ThongTinDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';

@Component({
  selector: 'app-chi-tiet-thong-tin-dau-gia',
  templateUrl: './chi-tiet-thong-tin-dau-gia.component.html',
  styleUrls: ['./chi-tiet-thong-tin-dau-gia.component.scss']
})
export class ChiTietThongTinDauGiaComponent extends Base2Component implements OnInit {
  //base init
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  fileDinhKem: any[] = [];
  dataDetail: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private thongTinDauGiaService: ThongTinDauGiaService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinDauGiaService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year"), [Validators.required]],
        soQdPd: [],
        maDvi: [],
        loaiVthh: [],
        tenLoaiVthh: [],
        cloaiVthh: [],
        tenCloaiVthh: [],

        idQdDcKh: [],
        soQdDcKh: [],
        idQdPdKq: [],
        soQdPdKq: [],
        idKhDx: [],
        soKhDx: [],
        ngayQdPdKqBdg: [],
        thoiHanGiaoNhan: [],
        thoiHanThanhToan: [],
        phuongThucThanhToan: [],
        phuongThucGiaoNhan: [],
        trangThai: [],
        tenTrangThai: [],
        maDviThucHien: [],
        tongTienGiaKhoiDiem: [],
        tongTienDatTruoc: [],
        tongTienDatTruocDuocDuyet: [],
        tongSoLuong: [],
        phanTramDatTruoc: [],
        thoiGianToChucTu: [],
        thoiGianToChucDen: [],
        tenDvi: [],
        tenDviThucHien: [],
        soDviTsan: [],
        soDviTsanThanhCong: [],
        soDviTsanKhongThanh: [],
      }
    );
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadDetail(this.idInput),
      ])
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }


  async loadDetail(id: number) {
    if (id > 0) {
      await this.quyetDinhPdKhBdgService.getDtlDetail(id)
        .then(async (res) => {
          const dataDtl = res.data;
          this.dataTable = dataDtl.listTtinDg
          if (dataDtl) {
            await this.quyetDinhPdKhBdgService.getDetail(dataDtl.idQdHdr).then(async (hdr) => {
              const dataHdr = hdr.data;
              this.formData.patchValue({
                soQdPd: dataHdr.soQdPd,
                nam: dataHdr.nam,
                trangThai: dataDtl.trangThai,
                tenTrangThai: dataDtl.tenTrangThai,
                tenDvi: dataDtl.tenDvi,
                tenCloaiVthh: dataHdr.tenCloaiVthh,
                tenLoaiVthh: dataHdr.tenLoaiVthh,
              })
            })
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  quayLai() {
    this.showListEvent.emit();
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
            id: this.idInput,
            trangThai: this.STATUS.HOAN_THANH_CAP_NHAT
          }
          let res = await this.quyetDinhPdKhBdgService.approveDtl(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.spinner.hide();
            this.loadDetail(this.idInput);
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

  selectRow($event, i) {
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow');
    this.dataDetail = this.dataTable[i];
  }

  themMoiPhienDauGia($event, data?: any) {
    $event.stopPropagation();
    if (!data) {
      let dataCheck = this.dataTable.filter(item => {
        return item.trangThai == this.STATUS.DU_THAO
      })
      if (dataCheck.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Không thể thêm mới vì đang có gói thầu chưa hoàn thành cập nhật, xin vui lòng hoàn thành cập nhật");
        return;
      }
    }

    const modalQD = this.modal.create({
      nzTitle: 'Cập nhật thông tin đấu giá',
      nzContent: ThongtinDaugiaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1800px',
      nzFooter: null,
      nzComponentParams: {
        isModal: true,
        idDtl: this.idInput,
        soQdPd: this.formData.value.soQdPd,
        dataDetail: data
      },
    });
    modalQD.afterClose.subscribe((data) => {
      this.loadDetail(this.idInput)
    });
  }

}
