import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DonviService} from 'src/app/services/donvi.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service'
import {Validators} from '@angular/forms';
import {QuanLySoKhoTheKhoService} from 'src/app/services/quan-ly-so-kho-the-kho.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {NgxSpinnerService} from "ngx-spinner";
import {Base2Component} from "../../../../../components/base2/base2.component";
import dayjs from "dayjs";
import {FILETYPE} from "../../../../../constants/fileType";
import {STATUS} from "../../../../../constants/status";
import {DANH_MUC_LEVEL} from "../../../luu-kho.constant";
import {OldResponseData} from "../../../../../interfaces/response";
import {MangLuoiKhoService} from "../../../../../services/qlnv-kho/mangLuoiKho.service";

@Component({
  selector: 'app-them-so-kho-the-kho',
  templateUrl: './them-so-kho-the-kho.component.html',
  styleUrls: ['./them-so-kho-the-kho.component.scss'],
})
// @ts-ignore
export class ThemSoKhoTheKhoComponent extends Base2Component implements OnInit {
  @Output('close') onClose = new EventEmitter<any>();
  @Input() idInput: number;
  @Input() isView: any;
  listType = [{"ma": "00", "giaTri": "Sổ kho"}, {"ma": "01", "giaTri": "Thẻ kho"}];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  dsDiemKho = [];
  dsNhaKho = [];
  dsNganKho = [];
  dsLoKho = [];

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
      tenHangHoa: [null],
      ten: [null],
      ngayMo: [null],
      ngayDong: [null],
      isDongSo: [false],
      ngayTaoTu: [null],
      ngayTaoDen: [false],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      loai: ['00']
    });
  }

  async ngOnInit() {
    try {
      this.loadDiemKho();
      if (this.idInput > 0) {
        this.getDetail(this.idInput)
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

  }

  async pheDuyet() {
    this.spinner.show();
    this.helperService.removeValidators(this.formData);
    let body = this.formData.value;
    let res = await this.quanLySoKhoTheKhoService.update(body);
  }

  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.removeValidators(this.formData);
    let body = this.formData.value;
    body.maDvi = this.userService.isCuc() ? this.userInfo.MA_DVI : this.formData.value.maDvi;
    let res = await this.createUpdate(body);
    if (res) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.id,
          trangThai: res.trangThai
        });
        this.guiDuyet();
      } else {
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
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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

  async getDetail(id: number) {

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
      this.formData.value.maNhaKho = null;
      this.formData.value.maNganKho = null;
      this.formData.value.maLoKho = null;
    }
  }

  async onChangeNhaKho(event) {
    const dsTong = await this.donViService.layTatCaDonViByLevel(6);
    this.dsNganKho = dsTong.data
    this.dsNganKho = this.dsNganKho.filter(item => item.maDvi.startsWith(event))
    if (event) {
      this.formData.value.maNganKho = null;
      this.formData.value.maLoKho = null;
    }
  }

  async onChangeNganKho(event) {
    const dsTong = await this.donViService.layTatCaDonViByLevel(7);
    this.dsLoKho = dsTong.data
    this.dsLoKho = this.dsLoKho.filter(item => item.maDvi.startsWith(event))
    if (event) {
      this.formData.value.maLoKho = null;
      if (this.dsLoKho.length == 0) {
        let dtlKho = await this.loadDetailKho(event, "6");
        if (dtlKho) {
          if (dtlKho.coLoKho == true) {
            this.formData.patchValue({
              loaiVthh: dtlKho.loaiVthh,
              cloaiVthh: dtlKho.cloaiVthh,
              donViTinh: dtlKho.donViTinh
            })
          }
        }
      }
    }
  }

  async onChangeLoKho(event) {
    if (this.dsLoKho.length == 0) {
      let dtlKho = await this.loadDetailKho(event, "7");
      if (dtlKho) {
        this.formData.patchValue({
          loaiVthh: dtlKho.loaiVthh,
          cloaiVthh: dtlKho.cloaiVthh,
          donViTinh: dtlKho.donViTinh
        })
      }
    }
  }


  async loadDetailKho(capDvi: string, maDvi: string) {
    let body = {
      maDvi: maDvi,
      capDvi: capDvi
    }
    let resp;
    let res = await this.mangLuoiKhoService.getDetailByMa(body)
    if (res.msg == MESSAGE.SUCCESS) {
      resp = res.data.object;
    }
    return resp;
  }
}
