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
import { DanhMucService } from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { TongHopDeXuatKHMTTService } from 'src/app/services/tong-hop-de-xuat-khmtt.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { convertTrangThai } from "../../../../../../shared/commonFunction";

@Component({
  selector: 'app-themmoi-tonghop-khmtt',
  templateUrl: './themmoi-tonghop-khmtt.component.html',
  styleUrls: ['./themmoi-tonghop-khmtt.component.scss']
})
export class ThemmoiTonghopKhmttComponent extends Base2Component implements OnInit {

  @Input() loaiVthh: string
  @Input() id: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() isViewOnModal: boolean;
  @Input() isDetail: boolean = false
  @Input() isView: boolean

  formTraCuu: FormGroup;
  isDetailDxCuc: boolean = false;
  dataTableDanhSachDX: any[] = [];
  isTongHop: boolean = false;
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  isQuyetDinh: boolean = false;
  disableField: boolean = false;
  selected: boolean = false;
  listFileDinhKem: any[] = [];
  previewName: string = "mtt_tong_hop_kh";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private tongHopDeXuatKHMTTService: TongHopDeXuatKHMTTService,
    private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDeXuatKHMTTService);

    this.formTraCuu = this.fb.group(
      {
        namKh: [dayjs().get('year'), [Validators.required]],
        loaiVthh: [null, [Validators.required]],
        tenLoaiVthh: [null, [Validators.required]],
        cloaiVthh: [null, [Validators.required]],
        tenCloaiVthh: [null, [Validators.required]],
      }
    );

    this.formData = this.fb.group({
      id: [],
      idTh: [],
      ngayThop: [''],
      loaiVthh: [, [Validators.required]],
      tenLoaiVthh: [''],
      cloaiVthh: [, [Validators.required]],
      tenCloaiVthh: [''],
      namKh: [, [Validators.required]],
      noiDungThop: ['', [Validators.required]],
      trangThai: ['26'],
      ghiChu: ['',],
      tchuanCluong: [''],
      soQd: [''],
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

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  async loadChiTiet() {
    if (this.id > 0) {
      const data = await this.detail(this.id);
      if (data) {
        this.isTongHop = true;
        this.helperService.bidingDataInFormGroup(this.formTraCuu, data)
        this.formData.patchValue({
          idTh: data.id
        })
        this.dataTable = data.children;
        this.listFileDinhKem = data.fileDinhKems;
        await this.showDetail(event, data.children[0].idDxHdr)
      }
      else {
        this.isTongHop = false;
      }
    } else {
      this.formTraCuu.get('tenLoaiVthh').setValue("Thóc tẻ")
      this.formTraCuu.get('loaiVthh').setValue("0101")
    }
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
      let res = await this.tongHopDeXuatKHMTTService.tonghop(body);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data
        let idTh = await this.userService.getId("HH_DX_KHMTT_THOP_HDR_SEQ");
        this.helperService.bidingDataInFormGroup(this.formData, body)
        this.formData.patchValue({
          idTh: idTh,
          ngayThop: dayjs().format("YYYY-MM-DD"),
        })
        this.dataTable = dataDetail.children;
        this.isTongHop = true;
        console.log(this.formData.value)
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

  async save(isTaoQd?: boolean) {
    let body = this.formData.value;
    body.fileDinhKems = this.listFileDinhKem;
    let data = await this.createUpdate(body, 'NHDTQG_PTMTT_KHMTT_TONGHOP_TONGHOP')
    if (data) {
      if (isTaoQd) {
        this.isQuyetDinh = true;
        this.disableField = true;
      }
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
      nzTitle: 'Danh sách hàng DTQG',
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

  async taoQdinh() {
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    setActive.classList.add('ant-menu-item-selected');
    await this.save(true)
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
    await this.spinner.show();
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

