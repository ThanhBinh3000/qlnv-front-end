import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { isEmpty, cloneDeep } from 'lodash';
import { BangKeThuMuaLeService } from './../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/BangKeThuMuaLeService.service';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { MttBienBanLayMauService } from './../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/MttBienBanLayMauService.service';
import { QuyetDinhGiaoNvNhapHangService } from './../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';

@Component({
  selector: 'app-dialog-them-moi-bang-ke-thu-mua-le',
  templateUrl: './dialog-them-moi-bang-ke-thu-mua-le.component.html',
  styleUrls: ['./dialog-them-moi-bang-ke-thu-mua-le.component.scss']
})
export class DialogThemMoiBangKeThuMuaLeComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
  @Input() isView: boolean;
  @Input()
  id: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() idQdGiaoNvNh: number;
  dataEdit: any;

  listSoQuyetDinh: any[] = [];
  checked: boolean = false;
  maVthh: string;
  isValid = false;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _modalRef: NzModalRef,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
    private banKeThuMuaLeService: BangKeThuMuaLeService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, banKeThuMuaLeService);
    this.formData = this.fb.group({
      id: [''],
      soBangKe: [''],
      maDvi: [''],
      tenDvi: [''],
      idQdGiaoNvNh: [''],
      soQdGiaoNvNh: [''],
      soLuongQd: [''],
      soLuongConLai: [''],
      namQd: [''],
      nguoiMua: [''],
      diaChiThuMua: [''],
      ngayMua: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      soLuongMtt: [''],
      donGia: [''],
      thanhTien: [''],
      nguoiBan: [''],
      diaChiNguoiBan: [''],
      soCmt: [''],
      ghiChu: [''],
      nguoiTao: [''],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.loadSoQuyetDinh(),
      ]);
      if (this.id) {
        await this.loadChiTiet(this.id);
      }
      else {
        await this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let id = await this.userService.getId('HH_BANG_KE_MUA_LE_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      nguoiTao: this.userInfo.sub,
      soBangKe: `${id}/${dayjs().get('year')}/BK-CCDT KVVP`,
    });
    if (this.dataEdit) {
      this.helperService.bidingDataInFormGroup(this.formData, this.dataEdit);
      this.formData.patchValue({
        id: null,
        soQdGiaoNvNh: this.dataEdit.soQd,
        idQdGiaoNvNh: this.dataEdit.id,
        ngayQdGiaoNvNh: this.dataEdit.ngayQd,
        namQd: this.dataEdit.namNhap,
        loaiVthh: this.dataEdit.loaiVthh,
        cloaiVthh: this.dataEdit.cloaiVthh,
        tenLoaiVthh: this.dataEdit.tenLoaiVthh,
        tenCloaiVthh: this.dataEdit.tenCloaiVthh,
        moTaHangHoa: this.dataEdit.moTaHangHoa,
        soLuongQd: this.dataEdit.hhQdGiaoNvNhangDtlList?.find(x => x.maDvi == this.userInfo.MA_DVI).children.reduce((prev, cur) => {
          prev += cur.soLuong;
          return prev;
        }, 0),
      })
    }
  }

  async save(isGuiDuyet?: boolean) {

    if (this.setValidator) {
      try {
        this.spinner.show();
        this.helperService.markFormGroupTouched(this.formData);
        if (!this.formData.valid) {
          this.spinner.hide();
          return;
        }
        let body = this.formData.value;

        let res;
        if (this.formData.get('id').value > 0) {
          res = await this.banKeThuMuaLeService.update(body);
        } else {
          res = await this.banKeThuMuaLeService.create(body);
        }
        if (res.msg == MESSAGE.SUCCESS) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this._modalRef.close(this.formData);
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

    }


  }

  setValidator() {
    return true
  }
  calculatorThanhTien() {
    this.formData.patchValue({
      thanhTien:
        +this.formData.get('soLuongMtt').value *
        +this.formData.get('donGia').value * 1000,
      soLuongConLai:
        +this.formData.get('soLuongQd').value -
        +this.formData.get('soLuongMtt').value
    });
  }

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.back();
      },
    });
  }

  back() {
    this.showListEvent.emit();
  };

  onCancel() {
    this._modalRef.destroy();
  }


  async loadSoQuyetDinh() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": this.STATUS.BAN_HANH,
    }
    let res = await this.quyetDinhGiaoNvNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayQd', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id, true);
      }
    });
  };

  async bindingDataQd(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNvNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      ngayQdGiaoNvNh: data.ngayQd,
      namQd: data.namNhap,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
      soLuongQd: data.hhQdGiaoNvNhangDtlList?.find(x => x.maDvi == this.userInfo.MA_DVI).children.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0),
    });
    console.log("bindingDataQd", data)
    await this.spinner.hide();
  }


  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.banKeThuMuaLeService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          console.log("loadChiTiet",this.formData.value)
          await this.bindingDataQd(data.idQdGiaoNvNh);
        }
      }
    }
  }

}
