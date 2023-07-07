import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from "ng-zorro-antd/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { MESSAGE } from "src/app/constants/message";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { ThongtinDaugiaComponent } from './thongtin-daugia/thongtin-daugia.component';
import { QuyetDinhPdKhBdgService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import { ThongTinDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-chi-tiet-thong-tin-dau-gia',
  templateUrl: './chi-tiet-thong-tin-dau-gia.component.html',
  styleUrls: ['./chi-tiet-thong-tin-dau-gia.component.scss']
})
export class ChiTietThongTinDauGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  fileDinhKem: any[] = [];
  dataDetail: any;
  selected: boolean = false;

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
        nam: [],
        soQdPd: [''],
        soQdPdKqBdg: [''],
        maDvi: [''],
        tenDvi: [''],
        tongTienGiaKhoiDiem: [],
        tongTienDatTruoc: [],
        khoanTienDatTruoc: [],
        tgianDauGia: [''],
        tgianDauGiaTu: [''],
        tgianDauGiaDen: [''],
        tgianTtoan: [],
        pthucTtoan: [''],
        tgianGnhan: [],
        pthucGnhan: [''],
        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        tongSoLuong: [],
        slDviTsan: [],
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
    try {
      await this.spinner.show();
      await Promise.all([
        this.loadDetail(this.idInput),
      ])
      await this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDetail(id: number) {
    await this.spinner.show();
    if (id > 0) {
      await this.quyetDinhPdKhBdgService.getDtlDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataDtl = res.data;
            this.dataTable = cloneDeep(dataDtl.listTtinDg);
            if (this.dataTable && this.dataTable.length > 0) {
              await this.showFirstRow(event, this.dataTable[0]);
            }
            let dataQd = await this.quyetDinhPdKhBdgService.getDetail(dataDtl.idQdHdr);
            if(dataQd.data){
              const dataHdr = dataQd.data;
              this.formData.patchValue({
                nam: dataHdr.nam,
                soQdPd: dataHdr.soQdPd,
                soQdPdKqBdg: dataDtl.soQdPdKqBdg,
                tenDvi: dataDtl.tenDvi,
                tgianDauGia: ['Từ' + ' ' + dayjs(dataDtl.tgianDkienTu).format('DD/MM/YYYY') + ' ' + 'Đến' + ' ' + dayjs(dataDtl.tgianDkienDen).format('DD/MM/YYYY')],
                tgianTtoan: dataDtl.tgianTtoan,
                pthucTtoan: dataDtl.pthucTtoan == '1' ? 'Tiền mặt' : 'Chuyển khoản',
                tgianGnhan: dataDtl.tgianGnhan,
                pthucGnhan: dataDtl.pthucGnhan,
                trangThai: dataDtl.trangThai,
                tenTrangThai: dataDtl.tenTrangThai,
                tenCloaiVthh: dataHdr.tenCloaiVthh,
                tenLoaiVthh: dataHdr.tenLoaiVthh,
                slDviTsan: dataDtl.slDviTsan,
                soDviTsanThanhCong: dataDtl.soDviTsanThanhCong,
                soDviTsanKhongThanh: dataDtl.soDviTsanKhongThanh,
                loaiHinhNx: dataHdr.loaiHinhNx != null ? 'Xuất bán đấu giá' : null,
                kieuNx: dataHdr.kieuNx != null ? 'Xuất bán' : null,
              })
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
    await this.loadDataThongTin(data);
    await this.spinner.hide();
  }

  async loadDataThongTin(data) {
    if (data.id) {
      await this.thongTinDauGiaService.getDetail(data.id)
         .then((res) =>{
           if (res.msg == MESSAGE.SUCCESS) {
             const dataThongTin = res.data;
             let tongTienGiaKhoiDiem: number = 0
             let tongTienDatTruoc: number = 0
             let tongSoLuong: number = 0
             dataThongTin.children.forEach((item) => {
               item.children.forEach((child) => {
                 tongTienGiaKhoiDiem += child.soLuongDeXuat * child.donGiaDeXuat
               })
               tongTienDatTruoc += item.soTienDatTruocChiCuc
               tongSoLuong += item.soLuongChiCuc
             })
             this.formData.patchValue({
               tongTienGiaKhoiDiem: tongTienGiaKhoiDiem,
               tongTienDatTruoc: tongTienDatTruoc,
               khoanTienDatTruoc: dataThongTin.khoanTienDatTruoc + '%',
               tongSoLuong: tongSoLuong
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
      nzContent: ThongtinDaugiaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2000px',
      nzFooter: null,
      nzBodyStyle: { 'overflow-y': 'auto' },
      nzComponentParams: {
        isModal: true,
        idDtl: this.idInput,
        soQdPd: this.formData.value.soQdPd,
        dataDetail: data,
        soLanDauGia: this.dataTable.length
      },
    });
    modalQD.afterClose.subscribe((data) => {
      this.loadDetail(this.idInput)
    });
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
          this.thongTinDauGiaService.delete(body).then(async () => {
            this.loadDetail(this.idInput);
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
}
