import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { TongHopDeXuatKeHoachBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/tongHopDeXuatKeHoachBanDauGia.service';
import { DatePipe } from '@angular/common';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-them-moi-tong-hop-ke-hoach-ban-dau-gia',
  templateUrl: './them-moi-tong-hop-ke-hoach-ban-dau-gia.component.html',
  styleUrls: ['./them-moi-tong-hop-ke-hoach-ban-dau-gia.component.scss']
})

export class ThemMoiTongHopKeHoachBanDauGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() id: number;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  formTraCuu: FormGroup;
  isDetailDxCuc: boolean = false;
  isTongHop: boolean = false;
  isQuyetDinh: boolean = false;
  datePipe = new DatePipe('en-US');
  selected: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDeXuatKeHoachBanDauGiaService);
    this.formTraCuu = this.fb.group(
      {
        loaiVthh: [null, [Validators.required]],
        tenLoaiVthh: [null, [Validators.required]],
        cloaiVthh: [null, [Validators.required]],
        tenCloaiVthh: [null, [Validators.required]],
        namKh: [dayjs().get('year'), [Validators.required]],
        ngayPduyet: [null, [Validators.required]],
      }
    );
    this.formData = this.fb.group({
      id: [],
      idTh: [],
      loaiVthh: [, [Validators.required]],
      cloaiVthh: [, [Validators.required]],
      namKh: [, [Validators.required]],
      ngayDuyetTu: ['', [Validators.required]],
      ngayDuyetDen: ['', [Validators.required]],
      ngayThop: [, [Validators.required]],
      noiDungThop: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
      tenCloaiVthh: ['', [Validators.required]],
      trangThai: [''],
      tenTrangThai: ['Chưa Tạo QĐ'],
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      await Promise.all([
        this.loadChiTiet(),
      ]);
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadChiTiet() {
    if (this.id > 0) {
      const data = await this.detail(this.id);
      if (data) {
        this.isTongHop = true;
        this.helperService.bidingDataInFormGroup(this.formTraCuu, data)
        this.formTraCuu.patchValue({
          ngayPduyet: [data.ngayDuyetTu, data.ngayDuyetDen],
        });
        this.formData.patchValue({
          idTh: data.id
        })
        this.dataTable = data.children;
        if (this.dataTable && this.dataTable.length > 0) {
          this.showFirstRow(event, this.dataTable[0].idDxHdr);
        }
      }
      else {
        this.isTongHop = false;
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
  }

  async showFirstRow($event, data: any) {
    await this.showDetail($event, data);
  }


  async tongHopDeXuatTuCuc() {
    await this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formTraCuu);
      if (this.formTraCuu.invalid) {
        await this.spinner.hide();
        return;
      }
      let body = this.formTraCuu.value;
      if (body.ngayPduyet) {
        body.ngayDuyetTu = this.datePipe.transform(body.ngayPduyet[0], 'yyyy-MM-dd');
        body.ngayDuyetDen = this.datePipe.transform(body.ngayPduyet[1], 'yyyy-MM-dd');
      }
      delete body.ngayDx;
      let res = await this.tongHopDeXuatKeHoachBanDauGiaService.tonghop(body);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data
        let idTh = await this.userService.getId("XH_THOP_DX_KH_BDG_SEQ");
        this.helperService.bidingDataInFormGroup(this.formData, body)
        this.formData.patchValue({
          idTh: idTh,
          ngayThop: dayjs().format("YYYY-MM-DD"),
        })
        this.dataTable = dataDetail.children;
        if (this.dataTable && this.dataTable.length > 0) {
          this.showFirstRow(event, this.dataTable[0].idDxHdr);
        }
        this.isTongHop = true;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.isTongHop = false;
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.isTongHop = false;
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async save() {
    let body = this.formData.value;
    let data = await this.createUpdate(body, 'XHDTQG_PTDG_KHBDG_TONGHOP_TONGHOP')
    if (data) {
      this.quayLai();
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  isDisable(): boolean {
    if (this.formData.value.id) {
      return true;
    }
    else {
      return false;
    }
  }

  showList() {
    this.isDetailDxCuc = false;
  }

  selectHangHoa() {
    let data = this.loaiVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.formTraCuu.patchValue({
          cloaiVthh: data.ma,
          tenCloaiVthh: data.ten,
          loaiVthh: data.parent.ma,
          tenLoaiVthh: data.parent.ten,
        });
      }
    });
  }

  taoQdinh() {
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = true;
  }

  showTongHop() {
    this.loadChiTiet()
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[2];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[0];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = false;
  }

  idRowSelect: number;
  async showDetail($event, id: number) {
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow')
    } else {
      this.selected = true
    }
    this.idRowSelect = id;
    await this.spinner.hide();
  }
}



