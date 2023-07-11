import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { ChaogiaUyquyenMualeService } from 'src/app/services/chaogia-uyquyen-muale.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { MttHopDongPhuLucHdService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/MttHopDongPhuLucHdService.service';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
import { QuyetDinhPheDuyetKetQuaChaoGiaMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ket-qua-chao-gia-mtt.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-quan-ly-hop-dong-mtt',
  templateUrl: './quan-ly-hop-dong-mtt.component.html',
  styleUrls: ['./quan-ly-hop-dong-mtt.component.scss']
})
export class QuanLyHopDongMttComponent extends Base2Component implements OnInit {

  @Input() id: number;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  idHopDong: number;
  isEditHopDong: boolean
  listNguonVon: any[] = [];
  selected: boolean = false;
  selectedHd: boolean = false;
  danhSachCtiet: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private thongTinPhuLucHopDongService: MttHopDongPhuLucHdService,
    private quyetDinhPheDuyetKetQuaChaoGiaMTTService: QuyetDinhPheDuyetKetQuaChaoGiaMTTService,
    private chaogiaUyquyenMualeService: ChaogiaUyquyenMualeService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKetQuaChaoGiaMTTService);
    this.formData = this.fb.group({
      id: [],
      namKh: [''],
      soQd: [],
      soQdKq: [],
      tenDuAn: [],
      tenDvi: [],
      tongMucDt: [],
      nguonVon: [],
      tongSoLuong: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      vat: ['5'],
      canhanTochuc: [],
      trangThaiHd: [''],
      tenTrangThaiHd: [''],
    });
  }

  async ngOnInit() {
    this.dataTable = []
    await this.spinner.show()
    await Promise.all([
    ]);
    if (this.id) {
      await this.getDetail(this.id)
    }
    this.initForm();
    await Promise.all([
      this.loadDataComboBox(),
    ]);
    await this.spinner.hide()
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
    })
  }

  async getDetail(id) {
    if (id) {
      let res = await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.getDetail(id);
      console.log(res.data)
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        await this.quyetDinhPheDuyetKeHoachMTTService.getDetailDtlCuc(data.idPdKhDtl).then(dataTtin => {
          this.formData.patchValue({
            namKh: data.namKh,
            soQd: dataTtin.data?.soQd,
            soQdKq: data.soQdKq,
            tenDuAn: dataTtin.data?.tenDuAn,
            tongMucDt: dataTtin.data?.tongMucDt,
            nguonVon: dataTtin.data?.nguonVon,
            tongSoLuong: dataTtin.data?.tongSoLuong * 1000,
            tenLoaiVthh: dataTtin.data?.tenLoaiVthh,
            tenCloaiVthh: dataTtin.data?.tenCloaiVthh,
            trangThaiHd: data.trangThaiHd,
            tenTrangThaiHd: data.tenTrangThaiHd

          })
          this.danhSachCtiet = res.data.danhSachCtiet;
          this.danhSachCtiet.forEach(item =>{
            this.dataTable.push(...item.listHdong)
          })
          console.log(this.danhSachCtiet)
          // this.showDetail(event, this.danhSachCtiet[0])
          this.showDetailHd(event, this.dataTable[0])
        });
      }
    }
  }

  async loadDataComboBox() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
  }

  async getDetailHopDong($event, id: number) {
    this.spinner.show();
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')
    this.idHopDong = id;
    this.spinner.hide();

    await this.thongTinPhuLucHopDongService.getDetail(this.idHopDong)
      .then(async (res) => {
        const dataDtl = res.data;
        this.formData.patchValue({
          thanhTien: dataDtl.thanhTien,
          tongSoLuongQdKh: dataDtl.tongSoLuongQdKh,
          tongSoLuongQdKhDaky: dataDtl.tongSoLuongQdKhDaky,
          tongSoLuongQdKhChuaky: dataDtl.tongSoLuongQdKhChuaky,
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
    await this.spinner.show()
    if (this.validateData()) {
      this.approve(this.id, STATUS.DA_HOAN_THANH, "Bạn có muốn hoành thành thực hiện hợp đồng ?")
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

  calcTong() {
    if (this.danhSachCtiet) {
      const sum = this.danhSachCtiet.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
      return sum;
    }
  }
  idRowSelect: number;
  // async showDetail($event, data: any) {
  //   await this.spinner.show();
  //   if ($event.type == "click") {
  //     this.selected = false;
  //     $event.target.parentElement.parentElement.querySelector(".selectedRow")?.classList.remove("selectedRow");
  //     $event.target.parentElement.classList.add("selectedRow");
  //   } else {
  //     this.selected = true;
  //   }
  //   this.idRowSelect = data.id;
  //   this.dataTable = data.listHdong;
  //   this.showDetailHd($event, this.dataTable[0])
  //   await this.spinner.hide();
  // }

  async showDetailHd($event, data: any) {
    await this.spinner.show();
    if ($event.type == "click") {
      this.selectedHd = false;
      $event.target.parentElement.parentElement.querySelector(".selectedRow")?.classList.remove("selectedRow");
      $event.target.parentElement.classList.add("selectedRow");
    } else {
      this.selectedHd = true;
    }
    this.idHopDong = data.id;
    this.id = data.idQdKq;

    console.log("showDetailHd ", this.idHopDong)
    console.log("showDetailHd ", this.loaiVthh)
    console.log("showDetailHd ", this.id)
    await this.spinner.hide();
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
          this.thongTinPhuLucHopDongService.delete(body).then(async () => {
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

}
