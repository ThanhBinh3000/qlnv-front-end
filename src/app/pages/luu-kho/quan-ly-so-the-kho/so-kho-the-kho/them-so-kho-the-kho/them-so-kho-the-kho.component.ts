import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DonviService} from 'src/app/services/donvi.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service'
import {QuanLySoKhoTheKhoService} from 'src/app/services/quan-ly-so-kho-the-kho.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {NgxSpinnerService} from "ngx-spinner";
import {Base2Component} from "../../../../../components/base2/base2.component";
import dayjs from "dayjs";
import {STATUS} from "../../../../../constants/status";
import {MangLuoiKhoService} from "../../../../../services/qlnv-kho/mangLuoiKho.service";
import {OldResponseData} from "../../../../../interfaces/response";
import {AMOUNT} from "../../../../../Utility/utils";
import {Validators} from "@angular/forms";
import {FILETYPE} from "../../../../../constants/fileType";

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
  listType = [{"ma": "00", "giaTri": "Sổ kho"}, {"ma": "01", "giaTri": "Thẻ kho"}];
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
      this.loadDiemKho();
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

  tuChoi() {
    let trangThai = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.TU_CHOI_KT;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
    }
    ;
    this.reject(this.idInput, trangThai);
  }

  async pheDuyet() {
    let trangThai = ''
    let keToanTruong = ''
    let thuTruong = ''
    switch (this.formData.value.trangThai) {
      case this.STATUS.CHO_DUYET_KT: {
        trangThai = this.STATUS.CHO_DUYET_LDCC;
        keToanTruong = this.userInfo.TEN_DVI;
        break;
      }
      case this.STATUS.CHO_DUYET_LDCC: {
        trangThai = this.STATUS.DA_DUYET_LDCC;
        thuTruong = this.userInfo.TEN_DVI;
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDoTuChoi: null,
            trangThai: trangThai,
            keToanTruong: trangThai == STATUS.CHO_DUYET_LDCC ? keToanTruong : null,
            thuTruong: trangThai == STATUS.DA_DUYET_LDCC ? thuTruong : null,
          };
          let res =
            await this.quanLySoKhoTheKhoService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  setValidators() {
    if (this.formData.value.loai == '00') {
      this.formData.controls["nam"].setValidators([Validators.required]);
      this.formData.controls["maDiemKho"].setValidators([Validators.required]);
      this.formData.controls["maNhaKho"].setValidators([Validators.required]);
      this.formData.controls["maNganKho"].setValidators([Validators.required]);
      this.formData.controls["loaiVthh"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["ten"].setValidators([Validators.required]);
      this.formData.controls["ngayMo"].setValidators([Validators.required]);
    } else {
      this.formData.controls["nam"].setValidators([Validators.required]);
      this.formData.controls["maDiemKho"].setValidators([Validators.required]);
      this.formData.controls["maNhaKho"].setValidators([Validators.required]);
      this.formData.controls["maNganKho"].setValidators([Validators.required]);
      this.formData.controls["loaiVthh"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["ten"].setValidators([Validators.required]);
      this.formData.controls["ngayTaoTu"].setValidators([Validators.required]);
      this.formData.controls["ngayTaoDen"].setValidators([Validators.required]);
    }
  }


  async saveAndSend(body: any, trangThai: string, msg: string, msgSuccess?: string) {
    this.helperService.removeValidators(this.formData);
    this.setValidators();
    this.formData.patchValue({
      maDvi : this.userInfo.MA_DVI
    })
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  async save() {
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
      } else {
        this.idInput = res.id
        this.formData.patchValue({
          id: res.id,
          trangThai: res.trangThai
        });
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
    }
  }

  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn gửi duyệt?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.DU_THAO :
            case STATUS.TU_CHOI_KT : {
              trangThai = STATUS.CHO_DUYET_KT;
              break;
            }
          }
          let body = {
            id: this.formData.get("id").value,
            lyDo: null,
            trangThai: trangThai
          };
          let res =
            await this.quanLySoKhoTheKhoService.approve(
              body
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
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
    const dsTong = await this.donViService.layTatCaDonViByLevel(4);
    this.dsDiemKho = dsTong.data
    this.dsDiemKho = this.dsDiemKho.filter(item => item.maDvi.startsWith(this.userInfo.MA_DVI) && item.type != 'PB')
  }

  async onChangeDiemKho(event) {
    const dsTong = await this.donViService.layTatCaDonViByLevel(5);
    this.dsNhaKho = dsTong.data
    this.dsNhaKho = this.dsNhaKho.filter(item => item.maDvi.startsWith(event))
    if (event) {
      this.formData.patchValue({
        maNhaKho: null,
        maNganKho: null,
        maLoKho: null
      })
    }
  }

  async onChangeNhaKho(event) {
    const dsTong = await this.donViService.layTatCaDonViByLevel(6);
    this.dsNganKho = dsTong.data
    this.dsNganKho = this.dsNganKho.filter(item => item.maDvi.startsWith(event))
    if (event) {
      this.formData.patchValue({
        maNganKho: null,
        maLoKho: null
      })
    }
  }

  async onChangeNganKho(event) {
    const dsTong = await this.donViService.layTatCaDonViByLevel(7);
    this.dsLoKho = dsTong.data
    this.dsLoKho = this.dsLoKho.filter(item => item.maDvi.startsWith(event))
    if (event) {
      this.formData.patchValue({
        maLoKho: null
      })
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
}
