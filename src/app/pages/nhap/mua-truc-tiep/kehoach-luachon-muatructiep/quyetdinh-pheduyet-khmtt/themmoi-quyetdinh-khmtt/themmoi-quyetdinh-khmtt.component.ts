import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from "../../../../../../constants/status";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DanhSachMuaTrucTiepService } from 'src/app/services/danh-sach-mua-truc-tiep.service';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
import { TongHopDeXuatKHMTTService } from 'src/app/services/tong-hop-de-xuat-khmtt.service';
import {DatePipe} from "@angular/common";
import {ChiTieuKeHoachNamCapTongCucService} from "../../../../../../services/chiTieuKeHoachNamCapTongCuc.service";

@Component({
  selector: 'app-themmoi-quyetdinh-khmtt',
  templateUrl: './themmoi-quyetdinh-khmtt.component.html',
  styleUrls: ['./themmoi-quyetdinh-khmtt.component.scss']
})
export class ThemmoiQuyetdinhKhmttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() id: number = 0;
  @Input() dataTongHop: any;
  @Input() isViewOnModal: boolean;
  @Input() isView: boolean = false;
  @Output()
  showListEvent = new EventEmitter<any>();

  maQd: string = null;
  fileList: any[] = [];
  listDanhSachTongHop: any[] = [];
  listToTrinh: any[] = [];

  danhsachDx: any[] = [];

  dataInput: any;
  dataInputCache: any;
  selected: boolean;
  isTongHop: boolean
  dataChiTieu: any;
  idSoQdCc: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private tongHopDeXuatKHMTTService: TongHopDeXuatKHMTTService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKeHoachMTTService);
    this.formData = this.fb.group({
      id: [null],
      namKh: [dayjs().get('year'), Validators.required],
      soQd: ['',],
      ngayQd: ['',],
      ngayHluc: ['',],
      idThHdr: [''],
      soTrHdr: [''],
      idTrHdr: [''],
      trichYeu: [''],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tchuanCluong: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      phanLoai: ['TH', [Validators.required]],
      soQdCc: [''],
      idSoQdCc: [''],
    })
  }

  setValidator(isGuiDuyet?) {
    if (isGuiDuyet) {
      this.formData.controls["soQd"].setValidators([Validators.required]);
      this.formData.controls["ngayQd"].setValidators([Validators.required]);
      this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soQd"].clearValidators();
      this.formData.controls["ngayQd"].clearValidators();
      this.formData.controls["ngayHluc"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'TH') {
      this.formData.controls["idThHdr"].setValidators([Validators.required]);
      this.formData.controls["idTrHdr"].clearValidators();
      this.formData.controls["soTrHdr"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'TTr') {
      this.formData.controls["idThHdr"].clearValidators();
      this.formData.controls["idTrHdr"].setValidators([Validators.required]);
      this.formData.controls["soTrHdr"].setValidators([Validators.required]);
    }
  }

  isDetailPermission() {
    if (this.userService.isAccessPermisson("NHDTQG_PTMTT_KHMTT_QDLCNT_THEM")) {
      return true;
    }
    return false;
  }

  deleteSelect() {
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = this.userInfo.MA_QD;
      if (this.idInput) {
        await this.loadChiTiet(this.idInput)
      } else {
        this.initForm();
      }
      await Promise.all([
        this.bindingDataTongHop(this.dataTongHop),
      ]);
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  initForm() {
    // this.formData.patchValue({
    //   nam: dayjs().get('year'),
    // })
  }

  async bindingDataTongHop(dataTongHop?) {
    if (dataTongHop) {
      this.formData.patchValue({
        cloaiVthh: dataTongHop.cloaiVthh,
        tenCloaiVthh: dataTongHop.tenCloaiVthh,
        loaiVthh: dataTongHop.loaiVthh,
        tenLoaiVthh: dataTongHop.tenLoaiVthh,
        namKh: dataTongHop.namKh,
        idThHdr: dataTongHop.id,
        tchuanCluong: dataTongHop.tchuanCluong,
        phanLoai: 'TH',
      })
      await this.selectMaTongHop(dataTongHop.id);
    }
  }

  async save(isGuiDuyet?) {
    await this.spinner.show();
    this.setValidator(isGuiDuyet)
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maQd;
    }
    body.children = this.danhsachDx;
    body.fileDinhKems = this.fileDinhKem;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.guiDuyet();
      } else {
        // this.quayLai();
      }
    }
    await this.spinner.hide();
  }

  tuChoi() {
    this.reject(this.idInput, STATUS.TU_CHOI_LDV)
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Văn bản sẵn sàng ban hành ?'
    this.approve(this.idInput, trangThai, mesg);
  }

  async loadChiTiet(id: number) {
    this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.formData.patchValue({
        soQd: data.soQd?.split('/')[0]
      })
      this.idSoQdCc = data.idSoQdCc
      this.danhsachDx = data.children;
      this.fileDinhKem = data.fileDinhKems;
    }
    this.showDetail(event, this.danhsachDx[0]);
    this.spinner.hide()
  }

  async openDialogTh() {
    if (this.formData.get('phanLoai').value != 'TH') {
      return;
    }
    await this.spinner.show();
    let bodyTh = {
      trangThai: STATUS.CHUA_TAO_QD,
      namKh: this.formData.get('namKh').value,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resTh = await this.tongHopDeXuatKHMTTService.search(bodyTh);
    if (resTh.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = resTh.data.content;
    }
    await this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách tổng hợp đề xuất kế hoạch bán đấu giá',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachTongHop,
        dataHeader: ['Số tổng hợp', 'Nội dung tổng hợp'],
        dataColumn: ['id', 'noiDungThop']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.selectMaTongHop(data.id);
      }
    });
  }

  async selectMaTongHop(event) {
    await this.spinner.show()
    if (event) {
      const res = await this.tongHopDeXuatKHMTTService.getDetail(event)
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.formData.patchValue({
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tchuanCluong: data.tchuanCluong,
          soQdCc: data.soQd,
          idSoQdCc: data.idSoQdCc,
          idThHdr: event,
          idTrHdr: null,
          soTrHdr: null,
        })
        this.idSoQdCc = data.idSoQdCc
        for (let item of data.children) {
          await this.danhSachMuaTrucTiepService.getDetail(item.idDxHdr).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              const dataRes = res.data;
              dataRes.idDxHdr = dataRes.id;
              this.danhsachDx.push(dataRes);
            }
          })
        };
        // this.dataInput = null;
        // this.dataInputCache = null;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide()
  }

  async openDialogTr() {
    if (this.formData.get('phanLoai').value != 'TTr') {
      return
    }
    await this.spinner.show();
    // Get data tờ trình
    let bodyToTrinh = {
      trangThai: STATUS.DA_DUYET_CBV,
      trangThaiTh: STATUS.CHUA_TONG_HOP,
      namKh: this.formData.get('namKh').value,
      loaiVthh: this.loaiVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resToTrinh = await this.danhSachMuaTrucTiepService.search(bodyToTrinh);
    if (resToTrinh.msg == MESSAGE.SUCCESS) {
      this.listToTrinh = resToTrinh.data.content;
    }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách đề xuất kế hoạch lựa chọn nhà thầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listToTrinh,
        dataHeader: ['Số tờ trình đề xuất', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soDxuat', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeIdTrHdr(data);
      }
    });
  }

  async onChangeIdTrHdr(data) {
    await this.spinner.show();
    this.danhsachDx = [];
    if (data) {
      const res = await this.danhSachMuaTrucTiepService.getDetail(data.id)
      if (res.msg == MESSAGE.SUCCESS) {
        const dataRes = res.data;
        dataRes.idDxHdr = dataRes.id;
        this.danhsachDx.push(dataRes);
        let tongMucDt = 0
        this.formData.patchValue({
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tchuanCluong: data.tchuanCluong,
          moTaHangHoa: data.moTaHangHoa,
          soQdCc: data.soQdCc,
          idSoQdCc: data.idSoQdCc,
          trichYeu: dataRes.trichYeu,
          tenDvi: data.tenDvi,
          maDvi: data.maDvi,
          idThHdr: null,
          soTrHdr: dataRes.soDxuat,
          idTrHdr: dataRes.id,
        })
        this.idSoQdCc = data.idSoQdCc
        this.dataInput = null;
        this.dataInputCache = null;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide();
  }

  index = 0;
  async showDetail($event, data) {
    await this.spinner.show();
    if ($event != undefined && $event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow')
    } else {
      this.selected = true
    }
    this.isTongHop = this.formData.value.phanLoai == 'TH';
    await this.getDataChiTieu(this.idSoQdCc);
    if (data) {
      this.dataInput = data;
      let res = await this.danhSachMuaTrucTiepService.getDetail(data.idDxHdr);
      this.dataInputCache = res.data;
    }
    await this.spinner.hide();
  }

  async getDataChiTieu(id: any) {
    let res2 = await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachNam(id);
    if (res2.msg == MESSAGE.SUCCESS) {
      console.log("dataChiTieu ", res2.data)
      this.dataChiTieu = res2.data;
    }
  }

  isDisabled() {
    if (this.formData.value.trangThai == STATUS.DU_THAO) {
      return false;
    } else {
      return true;
    }
  }

  setNewData($event) {
    let pipe = new DatePipe('en-US');
    this.danhsachDx[0].tgianMkho = pipe.transform($event.tgianMkho, 'yyyy-MM-dd')
    this.danhsachDx[0].tgianKthuc = pipe.transform($event.tgianKthuc, 'yyyy-MM-dd')
    // this.formData.get('tgianMkho').setValue(pipe.transform($event.tgianMkho, 'yyyy-MM-dd'));
    // this.formData.get('tgianKthuc').setValue(pipe.transform($event.tgianKthuc, 'yyyy-MM-dd'));
  }
}
