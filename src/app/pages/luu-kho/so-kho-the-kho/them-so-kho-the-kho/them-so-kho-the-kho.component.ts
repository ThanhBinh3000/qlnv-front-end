import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DonviService } from 'src/app/services/donvi.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service'
import { QuanLySoKhoTheKhoService } from 'src/app/services/quan-ly-so-kho-the-kho.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NgxSpinnerService } from "ngx-spinner";
import dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { AMOUNT } from 'src/app/Utility/utils';
import { STATUS } from 'src/app/constants/status';
import { OldResponseData } from 'src/app/interfaces/response';
import { MangLuoiKhoService } from 'src/app/services/qlnv-kho/mangLuoiKho.service';
import { Base2Component } from 'src/app/components/base2/base2.component';

@Component({
  selector: 'app-them-so-kho-the-kho',
  templateUrl: './them-so-kho-the-kho.component.html',
  styleUrls: ['./them-so-kho-the-kho.component.scss'],
})
// @ts-ignore
export class ThemSoKhoTheKhoComponent extends Base2Component implements OnInit {
  @Output('close') onClose = new EventEmitter<any>();
  @Input() loai: string;
  @Input() idInput: number;
  @Input() isView: any;
  listType = [{ "ma": "00", "giaTri": "Sổ kho" }, { "ma": "01", "giaTri": "Thẻ kho" }];
  listDsNhapXuat: any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  dsDiemKho = [];
  dsNhaKho = [];
  dsNganKho = [];
  dsLoKho = [];
  amount = AMOUNT;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quanLySoKhoTheKhoService: QuanLySoKhoTheKhoService,
    private dmService: DanhMucService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private donViService: DonviService,
    private _modalRef: NzModalRef
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLySoKhoTheKhoService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      nam: [dayjs().get('year')],
      nguoiLap: [null],
      maDvi: [null],
      tenDvi: [null],
      keToanTruong: [null],
      thuTruong: [null],
      maDiemKho: [null],
      maNhaKho: [null],
      maNganKho: [null],
      maLoKho: [null],
      loaiVthh: [null],
      tenLoaiVthh: [null],
      tenCloaiVthh: [null],
      cloaiVthh: [null],
      donViTinh: [null],
      slTon: [null],
      tichLuongKd: [null],
      tichLuongTk: [null],
      tenHangHoa: [null],
      so : [null],
      ten: [null],
      ngayMo: [null],
      ngayDong: [null],
      isDongSo: [false],
      ngayTaoTu: [null],
      ngayTaoDen: [null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      loai: ['00']
    });
  }

  async ngOnInit() {
    try {
      await this.loadDiemKho();
      if (this.idInput > 0) {
        await this.getDetail(this.idInput)
      } else {
        this.initForm();
      }
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  setValidators() {
    if (this.formData.value.loai == '00') {
      this.formData.controls["nam"].setValidators([Validators.required]);
      this.formData.controls["maDiemKho"].setValidators([Validators.required]);
      this.formData.controls["maNhaKho"].setValidators([Validators.required]);
      this.formData.controls["maNganKho"].setValidators([Validators.required]);
      this.formData.controls["loaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
      this.formData.controls["ten"].setValidators([Validators.required]);
      this.formData.controls["so"].setValidators([Validators.required]);
      this.formData.controls["ngayMo"].setValidators([Validators.required]);
    } else {
      this.formData.controls["nam"].setValidators([Validators.required]);
      this.formData.controls["maDiemKho"].setValidators([Validators.required]);
      this.formData.controls["maNhaKho"].setValidators([Validators.required]);
      this.formData.controls["maNganKho"].setValidators([Validators.required]);
      this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
      this.formData.controls["ten"].setValidators([Validators.required]);
      this.formData.controls["so"].setValidators([Validators.required]);
      this.formData.controls["ngayTaoTu"].setValidators([Validators.required]);
      this.formData.controls["ngayTaoDen"].setValidators([Validators.required]);
    }
  }

  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.removeValidators(this.formData);
    this.setValidators();
    this.helperService.markFormGroupTouched(this.formData);
    let body = this.formData.value;
    body.maDvi = this.userInfo.MA_DVI
    if (body.loai == '01') {
      this.loadDsNhapXuat()
    }
    body.theKhoCtList = this.listDsNhapXuat;
    let res = await this.createUpdate(body);
    if (res) {
      if (this.idInput > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        this.idInput = res.id
        this.formData.patchValue({
          id: res.id,
          trangThai: res.trangThai
        });
      } else {
        this.idInput = res.id
        this.formData.patchValue({
          id: res.id,
          trangThai: res.trangThai
        });
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      if(isGuiDuyet){
          this.pheDuyet()
      }
    }
  }

  pheDuyet() {
    let trangThai
    switch (this.formData.value.trangThai) {
      // Approve
      case STATUS.DU_THAO:
        trangThai = STATUS.CHO_DUYET_KT;
        break;
      case STATUS.CHO_DUYET_KT:
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      case STATUS.CHO_DUYET_LDCC:
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
      //Reject
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_LDCC:
        trangThai = STATUS.CHO_DUYET_KT;
        break;
    }
    this.approve(this.idInput, trangThai, 'Bạn có muốn gửi duyệt', null, 'Phê duyệt thành công');
  }

  tuChoi() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_KT:
        trangThai = STATUS.TU_CHOI_KT;
        break;
      case STATUS.CHO_DUYET_LDCC:
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
    }
    this.reject(this.idInput, trangThai);
  }

  quayLai() {
    this._modalRef.close();
  }

  async getDetail(id) {
    this.spinner.show();
    try {
      let res = await this.quanLySoKhoTheKhoService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            id : data.id,
            maDiemKho: data.maDiemKho,
            maNhaKho: data.maNhaKho,
            maNganKho: data.maNganKho,
            maLoKho: data.maLoKho ? data.maLoKho : null
          });
          console.log(this.formData.value)
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }


  initForm() {
    this.formData.patchValue({
      nguoiLap: this.userInfo.TEN_DAY_DU,
      tenDvi: this.userInfo.TEN_DVI
    })
  }

  async loadDiemKho() {
    let body = {
      idThuKho: this.userInfo.ID,
      maDviCha: null,
      capDvi: "4"
    }
    const dsTong = await this.donViService.getDonViTheoIdThuKho(body);
    this.dsDiemKho = dsTong.data
  }

  async onChangeDiemKho(event) {
    if (event) {
      let body = {
        idThuKho: this.userInfo.ID,
        maDviCha: event,
        capDvi: "5"
      }
      const dsTong = await this.donViService.getDonViTheoIdThuKho(body);
      this.dsNhaKho = dsTong.data
    }
  }

  async onChangeNhaKho(event) {
    if (event) {
      let body = {
        idThuKho: this.userInfo.ID,
        maDviCha: event,
        capDvi: "6"
      }
      const dsTong = await this.donViService.getDonViTheoIdThuKho(body);
      this.dsNganKho = dsTong.data
    }
  }

  async onChangeNganKho(event) {
    if (event) {
      let body = {
        idThuKho: this.userInfo.ID,
        maDviCha: event,
        capDvi: "7"
      }
      const dsTong = await this.donViService.getDonViTheoIdThuKho(body);
      this.dsLoKho = dsTong.data;
      if (this.dsLoKho.length == 0) {
        let body = {
          maDvi: event,
          capDvi: "6"
        }
        await this.mangLuoiKhoService.getDetailByMa(body).then((res: OldResponseData) => {
          if (res.msg == MESSAGE.SUCCESS) {
            let dtlKho = res.data.object
            this.formData.patchValue({
              loaiVthh: dtlKho.loaiVthh,
              tenLoaiVthh: dtlKho.tenLoaiVthh,
              cloaiVthh: dtlKho.cloaiVthh,
              tenCloaiVthh: dtlKho.tenCloaiVthh,
              donViTinh: dtlKho.dviTinh,
              slTon: dtlKho.slTon,
              tichLuongKd: dtlKho.tichLuongKdLt,
              tichLuongTk: dtlKho.tichLuongTkLt,
            })
          } else {
            this.notification.error(MESSAGE.ERROR, res.error);
          }
        });
      }
    }
  }

  async onChangeLoKho(event) {
    if (event) {
      let body = {
        maDvi: event,
        capDvi: "7"
      }
      await this.mangLuoiKhoService.getDetailByMa(body).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let dtlKho = res.data.object
          this.formData.patchValue({
            loaiVthh: dtlKho.loaiVthh,
            tenLoaiVthh: dtlKho.tenLoaiVthh,
            cloaiVthh: dtlKho.cloaiVthh,
            tenCloaiVthh: dtlKho.tenCloaiVthh,
            donViTinh: dtlKho.dviTinh,
            slTon: dtlKho.slTon,
            tichLuongKd: dtlKho.tichLuongKdLt,
            tichLuongTk: dtlKho.tichLuongTkLt,
          })
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      });
    }
  }

  async loadDsNhapXuat() {
    let body = {
      tuNgay: this.formData.value.ngayTaoTu,
      denNgay: this.formData.value.ngayTaoDen,
      cloaiVthh: this.formData.value.cloaiVthh,
      loaiVthh: this.formData.value.loaiVthh,
    }
    let res = await this.quanLySoKhoTheKhoService.loadDsNhapXuat(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDsNhapXuat = res.data;
    }
  }

  changeLoai() {
    this.formData.patchValue({
      id: null,
      nam: dayjs().get('year'),
      nguoiLap: null,
      maDvi: null,
      tenDvi: null,
      keToanTruong: null,
      thuTruong: null,
      maDiemKho: null,
      maNhaKho: null,
      maNganKho: null,
      maLoKho: null,
      loaiVthh: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      cloaiVthh: null,
      donViTinh: null,
      slTon: null,
      tichLuongKd: null,
      tichLuongTk: null,
      tenHangHoa: null,
      ten: null,
      ngayMo: null,
      ngayDong: null,
      isDongSo: false,
      ngayTaoTu: null,
      ngayTaoDen: null,
      trangThai: '00',
      tenTrangThai: 'Dự thảo',
    })
  }

  delete(item: any, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
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
            id: item.id
          };
          this.service.delete(body).then(async () => {
            this.quayLai();
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
