import { Component, Input, OnInit } from '@angular/core';
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { STATUS } from 'src/app/constants/status';
import { MESSAGE } from 'src/app/constants/message';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { saveAs } from 'file-saver';
import { ChiTietThongTinBanTrucTiepChaoGia, FileDinhKem } from 'src/app/models/DeXuatKeHoachBanTrucTiep';
import { QuyetDinhPheDuyetKetQuaChaoGiaMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ket-qua-chao-gia-mtt.service';
import { ChaogiaUyquyenMualeService } from 'src/app/services/chaogia-uyquyen-muale.service';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';

@Component({
  selector: 'app-themmoi-quyetdinh-ketqua-chaogia',
  templateUrl: './themmoi-quyetdinh-ketqua-chaogia.component.html',
  styleUrls: ['./themmoi-quyetdinh-ketqua-chaogia.component.scss']
})
export class ThemmoiQuyetdinhKetquaChaogiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() checkPrice: any;
  maTrinh: String;
  selected: boolean = false;
  danhSachCtiet: any[] = [];
  showFromTT: boolean;
  previewName: string = 'mtt_qd_pd_kq_chao_gia';
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    private quyetDinhPheDuyetKetQuaChaoGiaMTTService: QuyetDinhPheDuyetKetQuaChaoGiaMTTService,
    private chaogiaUyquyenMualeService: ChaogiaUyquyenMualeService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKetQuaChaoGiaMTTService);
    this.formData = this.fb.group({
      id: [],
      idPdKhDtl: [],
      idPdKhHdr: [],
      namKh: [dayjs().get('year'), [Validators.required]],
      soQdKq: [null, [Validators.required]],
      ngayHluc: [],
      ngayKy: [],
      soQd: ['', [Validators.required]],
      trichYeu: [],
      maDvi: [],
      tenDvi: [],
      diaDiemChaoGia: [],
      ngayMkho: [],
      ngayMua: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      moTaHangHoa: [],
      ghiChu: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      lyDoTuChoi: [null],
      fileName: [],
      pthucMuaTrucTiep: ['']
    });
  }

  ngOnInit(): void {
    this.maTrinh = '/' + this.userInfo.MA_QD;
    if (this.idInput) {
      this.getDetail(this.idInput);
    } else {
      this.initForm();
    }
  }

  initForm() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
    });
  }

  async getDetail(idInput) {
    if (idInput) {
      let res = await this.detail(idInput);
      if (res) {
        this.formData.patchValue({
          soQdKq: res.soQdKq?.split('/')[0],
        })
        this.fileDinhKem = res.fileDinhKems;
        if (res.danhSachCtiet) {
          this.danhSachCtiet = res.danhSachCtiet;
          this.showDetail(event, this.danhSachCtiet[0])
        } else {
          await this.onChangeTtin(res.idPdKhDtl);
        }
      }
    }
  }

  async save(isGuiDuyet?: boolean) {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    this.setValidator(isGuiDuyet)
    let body = this.formData.value;
    if (this.formData.get('soQdKq').value) {
      body.soQdKq = this.formData.get('soQdKq').value + this.maTrinh;
    }
    body.ngayHluc = body.ngayHluc != null ? dayjs(body.ngayHluc).format('YYYY-MM-DD') : null;
    body.ngayKy = body.ngayKy != null ? dayjs(body.ngayKy).format('YYYY-MM-DD') : null;
    body.fileDinhKems = this.fileDinhKem;
    body.danhSachCtiet = this.danhSachCtiet;
    let res = await this.createUpdate(body);
    if (res) {
      if (isGuiDuyet) {
        this.idInput = res.id
        this.guiDuyet();
      } else {
        this.goBack();
      }
    }
  }

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDC) {
        this.formData.controls["soQdKq"].setValidators([Validators.required]);
      } else {
        this.formData.controls["soQdKq"].clearValidators();
      }
    } else {
      this.formData.controls["soQdKq"].clearValidators();
    }
  }

  async guiDuyet() {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    if (this.formData.invalid) {
      return;
    }
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_TP:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = MESSAGE.GUI_DUYET_CONFIRM
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
      // case STATUS.DA_DUYET_LDC: {
      //   trangThai = STATUS.BAN_HANH;
      //   msg = MESSAGE.PHE_DUYET_CONFIRM
      //   break;
      // }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    let trangThai = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    };
    this.reject(this.idInput, trangThai);
  }

  isDisabled() {
    if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC || this.formData.value.trangThai == STATUS.DA_DUYET_LDC || this.formData.value.trangThai == STATUS.BAN_HANH) {
      return true
    } else {
      return false;
    }
  }

  async openThongtinChaoGia() {
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.HOAN_THANH_CAP_NHAT,
      pthucMuaTrucTiep: '01',
      maDvi: this.userInfo.MA_DVI,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      }
    }
    let listTb = [];
    let res = await this.chaogiaUyquyenMualeService.search(body);
    if (res.data) {
      listTb = res.data.content.filter(x => x.soQdKq == null || x.soQdKq == "");
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách thông tin chào giá',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: listTb,
        dataHeader: ['Số quyết định phê duyệt KH MTT', 'Loại hàng DTQG', 'Chủng loại hàng DTQG'],
        dataColumn: ['soQd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeTtin(data.id);
      }
    });
  }

  async onChangeTtin(idPdKhDtl) {
    let res = await this.quyetDinhPheDuyetKeHoachMTTService.getDetailDtlCuc(idPdKhDtl);
    if (res.data) {
      const data = res.data;
      this.formData.patchValue({
        soQd: data.hhQdPheduyetKhMttHdr.soQd,
        diaDiemChaoGia: data.diaDiemChaoGia,
        ngayMkho: data.ngayMkho,
        ngayMua: data.ngayMua,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        idPdKhDtl: data.id,
        idPdKhHdr: data.hhQdPheduyetKhMttHdr.id
      })
      this.danhSachCtiet = data.children.length > 0 ? data.children : data.children2;
      this.showDetail(event, this.danhSachCtiet[0])
      // if (this.dataTable) {
      //   this.dataTable.forEach((item) => {
      //     item.fileDinhKems.id = null;
      //     item.fileDinhKems.dataType = null;
      //     item.fileDinhKems.dataId = null;
      //   })
      // }
    }
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
  async showDetail($event, data: any) {
    await this.spinner.show();
    if ($event.type == "click") {
      this.selected = false;
      $event.target.parentElement.parentElement.querySelector(".selectedRow")?.classList.remove("selectedRow");
      $event.target.parentElement.classList.add("selectedRow");
    } else {
      this.selected = true;
    }
    this.idRowSelect = data.id;
    this.dataTable = data.listChaoGia
    await this.spinner.hide();
  }

  dataEdit: { [key: string]: { edit: boolean; data: ChiTietThongTinBanTrucTiepChaoGia } } = {};
  startEdit(index: number): void {
    this.dataTable[index].edit = true
  }

  saveEdit(index: number): void {
    this.dataTable[index].edit = false
    this.formData.patchValue({

    })
  }
  cancelEdit(index: number): void {
    this.dataTable[index].edit = false
    this.formData.patchValue({

    })

  }

  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
      saveAs(blob, item.fileName);
    });
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
