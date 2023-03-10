import { Component, Input, OnInit, Output } from '@angular/core';
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
import { QdPdKetQuaBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import { ChaoGiaMuaLeUyQuyenService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import { QuyetDinhPdKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import { saveAs } from 'file-saver';
import { ChiTietThongTinBanTrucTiepChaoGia, FileDinhKem } from 'src/app/models/DeXuatKeHoachBanTrucTiep';


@Component({
  selector: 'app-them-qd-pd-ket-qua-btt',
  templateUrl: './them-qd-pd-ket-qua-btt.component.html',
  styleUrls: ['./them-qd-pd-ket-qua-btt.component.scss']
})
export class ThemQdPdKetQuaBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;

  maTrinh: String;
  listOfData: any[] = [];
  showFromTT: boolean;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBttService);
    this.formData = this.fb.group({
      id: [],
      idPdKhDtl: [],
      idPdKhHdr: [],
      namKh: [dayjs().get('year'), [Validators.required]],
      soQdKq: [, [Validators.required]],
      ngayHluc: [, [Validators.required]],
      ngayKy: [, [Validators.required]],
      soQdPd: [, [Validators.required]],
      trichYeu: [, [Validators.required]],
      maDvi: [],
      tenDvi: [],
      diaDiemChaoGia: [],
      ngayMkho: [],
      ngayKthuc: [],
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
        this.dataTable = res.children;
      }
    }
  }

  async save(isGuiDuyet?: boolean) {
    let body = this.formData.value;
    if (this.formData.get('soQdKq').value) {
      body.soQdKq = this.formData.get('soQdKq').value + this.maTrinh;
    }
    body.fileDinhKems = this.fileDinhKem;
    body.children = this.dataTable;
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

  async guiDuyet() {
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
      case STATUS.DA_DUYET_LDC: {
        trangThai = STATUS.BAN_HANH;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
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
      maDvi: this.userInfo.MA_DVI,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      }
    }
    let listTb = [];
    let res = await this.chaoGiaMuaLeUyQuyenService.search(body);
    if (res.data) {
      listTb = res.data.content;
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
        dataHeader: ['Số quyết định phê duyệt KH BTT', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdPd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeTtin(data.id);
      }
    });
  }

  async onChangeTtin(idPdKhDtl) {
    let res = await this.quyetDinhPdKhBanTrucTiepService.getDtlDetail(idPdKhDtl);
    if (res.data) {
      const data = res.data;
      this.formData.patchValue({
        soQdPd: data.xhQdPdKhBttHdr.soQdPd,
        diaDiemChaoGia: data.diaDiemChaoGia,
        ngayMkho: data.ngayMkho,
        ngayKthuc: data.ngayKthuc,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        idPdKhDtl: data.id,
        idPdKhHdr: data.xhQdPdKhBttHdr.id
      })
      this.dataTable = data.children;
      if (this.dataTable) {
        this.dataTable.forEach((item) => {
          item.children.forEach((chila) => {
            chila.children.forEach((s) => {
              s.fileDinhKems.id = null;
              s.fileDinhKems.dataType = null;
              s.fileDinhKems.dataId = null;
            })
          })
        })
      }
    }
  }

  dataEdit: { [key: string]: { edit: boolean; data: ChiTietThongTinBanTrucTiepChaoGia } } = {};
  startEdit(index: number): void {
    this.listOfData[index].edit = true
  }

  saveEdit(index: number): void {
    this.listOfData[index].edit = false
    this.formData.patchValue({

    })
  }
  cancelEdit(index: number): void {
    this.listOfData[index].edit = false
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

  selectRow($event, item) {
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow');
    this.listOfData = item.children;
    this.showFromTT = true;
  }

}
