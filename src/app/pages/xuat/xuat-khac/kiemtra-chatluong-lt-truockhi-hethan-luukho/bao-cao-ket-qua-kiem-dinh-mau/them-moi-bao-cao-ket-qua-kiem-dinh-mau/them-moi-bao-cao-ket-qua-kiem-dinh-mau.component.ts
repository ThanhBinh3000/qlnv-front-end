import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Base2Component} from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {Validators} from '@angular/forms';
import {
  TongHopDanhSachHangDTQGService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/TongHopDanhSachHangDTQG.service";
import {
  BaoCaoKqKdLuongThucHangDTQGService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/BaoCaoKqKdLuongThucHangDTQG.service";
import {LOAI_HH_XUAT_KHAC} from "../../../../../../constants/config";
import {
  PhieuKiemNgiemClLuongThucHangDTQGService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/PhieuKiemNgiemClLuongThucHangDTQG.service";
import { PREVIEW } from '../../../../../../constants/fileType';
import {saveAs} from 'file-saver';
@Component({
  selector: 'them-moi-bao-cao-ket-qua-kiem-dinh-mau',
  templateUrl: './them-moi-bao-cao-ket-qua-kiem-dinh-mau.component.html',
  styleUrls: ['./them-moi-bao-cao-ket-qua-kiem-dinh-mau.component.scss']
})
export class ThemMoiBaoCaoKetQuaKiemDinhMauComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() idTongHop: number;
  @Input() loaiVthh: string;

  expandSetString = new Set<string>();
  isVisible = false;
  maHauTo: any;
  listMaDs: any[] = [];
  chiTiet: any = [];
  dataTableChiTieu: any = [];
  kiemTraCl = false;
  selectedId: number;
  isFirstInit = true;
  loaiHhXuatKhac = LOAI_HH_XUAT_KHAC;
  templateName = 'xuat_khac_ktcl_luong_thuc_bao_cao_kq_kiem_dinh';
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKiemNgiemClLuongThucHangDTQGService: PhieuKiemNgiemClLuongThucHangDTQGService,
    private tongHopDanhSachHangDTQGService: TongHopDanhSachHangDTQGService,
    private baoCaoKqKdLuongThucHangDTQGService: BaoCaoKqKdLuongThucHangDTQGService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, baoCaoKqKdLuongThucHangDTQGService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      nam: [dayjs().get("year"), [Validators.required]],
      soBaoCao: ['', [Validators.required]],
      tenBaoCao: [],
      ngayBaoCao: [],
      maDviNhan: [],
      idTongHop: [],
      maDanhSach: [],
      tenDanhSach: [],
      trangThai: [STATUS.DU_THAO],
      ngayPduyet: [],
      nguoiPduyetId: [],
      ngayGduyet: [],
      nguoiGduyetId: [],
      lyDoTuChoi: [],
      tenDvi: [],
      tenDviNhan: [],
      listIdTongHop: [],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [new Array<FileDinhKem>()],
    });

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHauTo = '/' + this.userInfo.MA_QD;
      await Promise.all([
        this.loadMaDs(),
      ]);
      await this.loadChiTiet(this.idInput);
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.isFirstInit = false;
      await this.spinner.hide();
    }
  }


  async loadChiTiet(idInput: number) {
    if (idInput) {
      await this.baoCaoKqKdLuongThucHangDTQGService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue({
              ...res.data,
              soBaoCao: res.data.soBaoCao?.split('/')[0] ?? null,

            }, {emitEvent: false});

          }
        })
        .catch((e) => {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
      });
    }
  }

  async loadMaDs() {
    this.tongHopDanhSachHangDTQGService.search({
      trangThai: STATUS.GUI_DUYET,
      loai: this.loaiHhXuatKhac.LT_6_THANG,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0 && this.idTongHop == null) {
          this.listMaDs = data.content.filter(item => item.soBaoCao == null);
        } else {
          this.listMaDs = data.content
        }
      } else {
        this.listMaDs = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    });
  }

  async save() {
    this.formData.disable({emitEvent: false});
    let body = {
      ...this.formData.value,
      soBaoCao: this.formData.value.soBaoCao ? this.formData.value.soBaoCao + this.maHauTo : this.maHauTo,
    };
    let rs = await this.createUpdate(body)
    this.formData.enable({emitEvent: false});
  }

  async saveAndSend(body: any, trangThai: string, msg: string, msgSuccess?: string) {
    body = {...body, soBaoCao: this.formData.value.soBaoCao + this.maHauTo}
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  quayLai() {
    this.showListEvent.emit();
  }
  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        msg = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }


  async changeMaDs($event: any) {
    try {
      await this.spinner.show();
      this.dataTable = [];
      if ($event !== null) {
        let body = {
          trangThai: STATUS.GUI_DUYET,
          loai: this.loaiHhXuatKhac.LT_6_THANG,
          listId: [$event]
        };
        let res = await this.tongHopDanhSachHangDTQGService.search(body);
        if (res.msg == MESSAGE.SUCCESS) {
          let data = res.data;
          this.dataTable = data.content;
          let selectedMaDs = this.listMaDs.find(f => f.id === $event);
          if (selectedMaDs) {
            this.formData.patchValue({
              maDanhSach: selectedMaDs.maDanhSach
            });
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
        this.dataTable = [...this.dataTable];
      } else {

      }

    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  expandAll() {
    this.dataTable.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    });
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }


  redirectDetail(id, b: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
  }

  async selectRow(item) {
    if (item) {
      this.kiemTraCl = true;
      await this.phieuKiemNgiemClLuongThucHangDTQGService.getDetail(item)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.chiTiet = res.data;
            this.dataTableChiTieu = this.chiTiet.phieuKnClDtl;
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }else {
      this.kiemTraCl = false;
    }
  }
  async preview(id) {
    this.spinner.show();
    await this.baoCaoKqKdLuongThucHangDTQGService.preview({
      tenBaoCao: this.templateName,
      id: id,
    }).then(async res => {
      if (res.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, 'Lỗi trong quá trình tải file.');
      }
    });
    this.spinner.hide();
  }

  downloadPdf() {
    saveAs(this.pdfSrc, this.templateName + ".pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, this.templateName + ".docx");
  }
}
