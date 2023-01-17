import { Component, Input, OnInit, } from '@angular/core';
import { Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {
  QuyetDinhPdKhBdgService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import { TongHopDeXuatKeHoachBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/tongHopDeXuatKeHoachBanDauGia.service';
import { STATUS } from 'src/app/constants/status';
import {
  QuyetDinhDchinhKhBdgService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/dieuchinh-kehoach/quyetDinhDchinhKhBdg.service";
import { DeXuatKhBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-chitiet-qd-dieuchinh-hkbdg',
  templateUrl: './chitiet-qd-dieuchinh-hkbdg.component.html',
  styleUrls: ['./chitiet-qd-dieuchinh-hkbdg.component.scss']
})
export class ChitietQdDieuchinhHkbdgComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number = 0;

  maQd: string = null;
  dataInput: any;
  dataInputCache: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
    private quyetDinhDchinhKhBdgService: QuyetDinhDchinhKhBdgService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDchinhKhBdgService);
    this.formData = this.fb.group({
      id: [null],
      nam: [dayjs().get('year'), Validators.required],
      soQdDc: ['',],
      ngayHlucDc: ['',],
      ngayKyDc: ['',],
      soQdGoc: ['',],
      idQdGoc: [''],
      ngayKyQdGoc: ['',],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      soQdCc: [''],
      trichYeu: [''],
      fileName: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
    })
  }

  setValidator(isGuiDuyet?) {
    // if (isGuiDuyet) {
    //   this.formData.controls["soQdPd"].setValidators([Validators.required]);
    //   this.formData.controls["ngayKyQd"].setValidators([Validators.required]);
    //   this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    // } else {
    //   this.formData.controls["soQdPd"].clearValidators();
    //   this.formData.controls["ngayKyQd"].clearValidators();
    //   this.formData.controls["ngayHluc"].clearValidators();
    // }
  }

  deleteSelect() {
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = this.userInfo.MA_QD;
      await Promise.all([
      ]);
      if (this.idInput) {
        await this.loadChiTiet(this.idInput);
      } else {
        this.initForm();
      }
      await Promise.all([
      ]);
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  initForm() {
    this.formData.patchValue({
      nam: dayjs().get('year'),
    })
  }

  async openDialogSoQdGoc() {
    this.spinner.show();
    let dsQdPd = []
    await this.quyetDinhPdKhBdgService.search({
      trangThai: STATUS.BAN_HANH,
      namKh: this.formData.value.nam,
      lastest: 1,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          dsQdPd = data.content;
        }
      }
    });
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định gốc',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dsQdPd,
        dataHeader: ['Số quyết định gốc', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdPd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.quyetDinhPdKhBdgService.getDetail(data.id).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              const data = res.data;
              this.formData.patchValue({
                soQdGoc: data.soQdPd,
                idQdGoc: data.id,
                ngayKyQdGoc: data.ngayKyQd,
                loaiVthh: data.loaiVthh,
                tenLoaiVthh: data.tenLoaiVthh,
                cloaiVthh: data.cloaiVthh,
                tenCloaiVthh: data.tenCloaiVthh,
              })
              console.log(data);
              this.dataTable = data.children;
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        })
      }
    });
  }

  async save(isGuiDuyet?) {
    console.log("🚀 ~ save ~ isGuiDuyet", isGuiDuyet)
    this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    if (this.formData.value.soQdDc) {
      body.soQdDc = this.formData.value.soQdDc + "/" + this.maQd;
    }
    body.fileDinhKems = this.fileDinhKem;
    body.children = this.dataTable;
    console.log(body);
    let data = await this.createUpdate(body);
    console.log("🚀 ~ save ~ data", data)
    if (data) {
      if (isGuiDuyet) {
        this.approve(data.id, STATUS.BAN_HANH, "Bạn có muốn ban hành điều chỉnh ?");
      } else {
        this.goBack()
      }
    }
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quyetDinhDchinhKhBdgService.getDetail(id);
      const data = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        soQdDc: data.soQdDc?.split("/")[0],
        soQdGoc: data.soQdGoc,
      });
      // if (data.loaiVthh.startsWith("02")) {
      //   this.dataTable = data.children;
      // } else {
      //   this.dataTable = data.children;
      //   this.danhsachDxCache = cloneDeep(this.danhsachDx);
      //   for (const item of this.danhsachDxCache) {
      //     await this.deXuatKhBanDauGiaService.getDetail(item.idDxHdr).then((res) => {
      //       if (res.msg == MESSAGE.SUCCESS) {
      //         item.dsPhanLoList = res.data.dsPhanLoList;
      //       }
      //     })
      //   }
      // }
    }
    ;
  }

  index = 0;
  async showDetail($event, index) {
    // await this.spinner.show();
    // console.log(this.bodyChiTiet.nativeElement)
    // $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    // $event.target.parentElement.classList.add('selectedRow');
    // this.isTongHop = this.formData.value.phanLoai == 'TH';
    // this.dataInput = this.danhsachDx[index];
    // this.dataInputCache = this.danhsachDxCache[index];
    // this.index = index;
    // await this.spinner.hide();
  }

  getNameFileQD($event: any) {
    if ($event.target.files) {
      const itemFile = {
        name: $event.target.files[0].name,
        file: $event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          let fileDinhKemQd = new FileDinhKem();
          fileDinhKemQd.fileName = resUpload.filename;
          fileDinhKemQd.fileSize = resUpload.size;
          fileDinhKemQd.fileUrl = resUpload.url;
          fileDinhKemQd.idVirtual = new Date().getTime();
          this.formData.patchValue({ fileDinhKem: fileDinhKemQd, fileName: itemFile.name })
        });
    }
  }


}
