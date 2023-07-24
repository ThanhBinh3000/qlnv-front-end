import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import dayjs from "dayjs";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {MESSAGE} from "src/app/constants/message";
import {UserLogin} from "src/app/models/userlogin";
import {HelperService} from "src/app/services/helper.service";
import {UserService} from "src/app/services/user.service";
import {Globals} from "src/app/shared/globals";
import {STATUS} from "src/app/constants/status";
import {QuyetDinhGiaCuaBtcService} from "src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {TongHopPhuongAnGiaService} from "src/app/services/ke-hoach/phuong-an-gia/tong-hop-phuong-an-gia.service";
import {QuyetDinhGiaBtcThongTinGia} from "src/app/models/QuyetDinhBtcThongTinGia";
import {DanhMucTieuChuanService} from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import {DialogPagQdBtcComponent} from "../dialog-pag-qd-btc/dialog-pag-qd-btc.component";

@Component({
  selector: "app-them-quyet-dinh-gia-btc-lt",
  templateUrl: "./them-quyet-dinh-gia-btc-lt.component.html",
  styleUrls: ["./them-quyet-dinh-gia-btc-lt.component.scss"]
})
export class ThemQuyetDinhGiaBtcLtComponent implements OnInit {
  @Input("type") type: string;
  @Input("pagType") pagType: string;
  @Input("isView") isView: boolean;
  @Input("noEdit") noEdit: boolean;
  @Input() idInput: number;
  @Output("onClose") onClose = new EventEmitter<any>();
  formData: FormGroup;
  dsVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  dsTieuChuanCl: any[] = [];
  dsHangHoa: any[] = [];
  dsLoaiGia: any[] = [];
  dsToTrinhDeXuat: any[] = [];
  arrThongTinGia: Array<QuyetDinhGiaBtcThongTinGia> = [];
  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];
  userInfo: UserLogin;
  soDeXuat: string;
  muaTangList: any[] = [];
  xuatGiamList: any[] = [];
  xuatBanList: any[] = [];
  luanPhienList: any[] = [];
  maQd: string;
  dataTable: any[] = [];
  isErrorUnique = false;
  thueVat: number;
  radioValue: string;
  fileDinhKem: any[] = [];
  STATUS = STATUS;

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public globals: Globals,
    private helperService: HelperService,
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService,
    private danhMucService: DanhMucService,
    private tongHopPhuongAnGiaService: TongHopPhuongAnGiaService,
    private notification: NzNotificationService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get("year"), [Validators.required]],
        soQd: [, [Validators.required]],
        ngayKy: [null, [Validators.required]],
        ngayHieuLuc: [null, [Validators.required]],
        soToTrinh: [null],
        loaiVthh: [null],
        cloaiVthh: [null],
        loaiGia: [null],
        tieuChuanCl: [null],
        trichYeu: [null, [Validators.required]],
        trangThai: ["00"],
        ghiChu: [null],
        thongTinGia: [null]
      }
    );
  }

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["namKeHoach"].setValidators([Validators.required]);
      this.formData.controls["soQd"].setValidators([Validators.required]);
      this.formData.controls["ngayKy"].setValidators([Validators.required]);
      this.formData.controls["ngayHieuLuc"].setValidators([Validators.required]);
      this.formData.controls["trichYeu"].setValidators([Validators.required]);
    } else {
      this.formData.controls["namKeHoach"].clearValidators();
      this.formData.controls["soQd"].clearValidators();
      this.formData.controls["ngayKy"].clearValidators();
      this.formData.controls["ngayHieuLuc"].clearValidators();
      this.formData.controls["trichYeu"].clearValidators();
    }
  }

  async ngOnInit() {
    this.spinner.show();
    await this.loadToTrinhDeXuat();
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.loadDsLoaiGia(),
      this.loadDsVthh(),
      this.maQd = "/QĐ-BTC",
      this.loadTiLeThue()
    ]);
    await this.getDataDetail(this.idInput)
    this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhGiaCuaBtcService.getDetail(id);
      const data = res.data;
      let resp = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ "str": data.loaiVthh });
      this.dsCloaiVthh = [];
      if (resp.msg == MESSAGE.SUCCESS) {
        if (resp.data) {
          this.dsCloaiVthh = resp.data;
        }
      }
      this.arrThongTinGia = data.thongTinGia
      this.arrThongTinGia.forEach(item => {
        item.giaQd = item.giaQdBtc,
          item.giaQdVat = item.giaQdVatBtc
      })
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        soQd: data.soQd ? data.soQd.split("/")[0] : '',
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        ngayKy: data.ngayKy,
        ngayHieuLuc: data.ngayHieuLuc,
        loaiGia: data.loaiGia,
        tieuChuanCl: data.tieuChuanCl,
        trichYeu: data.trichYeu,
        trangThai: data.trangThai,
        ghiChu: data.ghiChu,
        soToTrinh: data.soToTrinh
      });
      this.fileDinhKem = data.fileDinhKems;
    }
  }

  async onChangeNamQd(namKeHoach) {
    let body = {
      namKeHoach: namKeHoach,
      trangThai: "11"
    };
    let res = await this.quyetDinhGiaCuaBtcService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      // const data = res.data.content;
      // if (data) {
      //   let detail = await this.quyetDinhGiaCuaBtcService.getDetail(data[0].id);
      //   if (detail.msg == MESSAGE.SUCCESS) {
      //     this.dsBoNganh = detail.data.listBoNganh;
      //   }
      // }
      // console.log(this.dsBoNganh)
    }
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
  }

  async loadTiLeThue() {
    let res = await this.danhMucService.danhMucChungGetAll("THUE_VAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.thueVat = res.data && res.data.length > 0 ? res.data[0].giaTri : 5/100;
    } else {
      this.thueVat = 5 / 100;
    }
  }

  openFile(event) {
    // if (!this.isView) {
    //   let item = {
    //     id: new Date().getTime(),
    //     text: event.name,
    //   };
    //   if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
    //     this.uploadFileService
    //       .uploadFile(event.file, event.name)
    //       .then((resUpload) => {
    //         if (!this.deXuatDieuChinh.fileDinhKemReqs) {
    //           this.deXuatDieuChinh.fileDinhKemReqs = [];
    //         }
    //         const fileDinhKem = new FileDinhKem();
    //         fileDinhKem.fileName = resUpload.filename;
    //         fileDinhKem.fileSize = resUpload.size;
    //         fileDinhKem.fileUrl = resUpload.url;
    //         fileDinhKem.idVirtual = item.id;
    //         this.deXuatDieuChinh.fileDinhKemReqs.push(fileDinhKem);
    //         this.taiLieuDinhKemList.push(item);
    //       });
    //   }
    // }
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id
      );
    }
  }

  downloadFileKeHoach(event) {
  }

  quayLai() {
    this.onClose.emit();
  }

  banHanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn ban hành?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.value.id,
            lyDoTuChoi: null,
            trangThai: STATUS.BAN_HANH
          };
          let res =
            await this.quyetDinhGiaCuaBtcService.approve(
              body
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.BAN_HANH_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  async save(isBanHanh?) {
    this.spinner.show();
    this.setValidator(isBanHanh);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let err = false;
    let body = this.formData.value;
    this.arrThongTinGia.forEach(item => {
      item.giaQdBtc = item.giaQd,
        item.giaQdVatBtc = item.giaQdVat
    })
    body.soQd = body.soQd + this.maQd;
    body.pagType = this.pagType;
    body.thongTinGia = this.arrThongTinGia
    body.fileDinhKemReq = this.fileDinhKem;
    // gia mua toi da
    this.arrThongTinGia.forEach(item => {
      if (body.loaiGia == 'LG01' && (item.giaQd > item.giaDn || item.giaQdVat > item.giaDnVat)) {
        this.notification.error(MESSAGE.ERROR, 'Giá quyết định lớn hơn giá mua tối đa');
        item.giaQd = 0;
        item.giaQdVat = 0;
        err = true;
      }
      //gia ban toi thieu
      if (body.loaiGia == 'LG02' && (item.giaQd < item.giaDn || item.giaQdVat < item.giaDnVat)) {
        this.notification.error(MESSAGE.ERROR, 'Giá quyết định nhỏ hơn giá bán tối thiểu');
        item.giaQd = 0;
        item.giaQdVat = 0;
        err = true;
      }
    })
    if (!err) {
      let res;
      if (this.idInput > 0) {
        res = await this.quyetDinhGiaCuaBtcService.update(body);
      } else {
        res = await this.quyetDinhGiaCuaBtcService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (isBanHanh) {
          this.formData.patchValue({
            id: res.data.id,
            trangThai: res.data.trangThai
          })
          this.banHanh();
        }
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.quayLai();
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    this.spinner.hide();
  }

  async loadDsLoaiGia() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_GIA");
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiGia = res.data;
    }
  }

  async loadDsVthh() {
    this.dsVthh = [];
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HHOA");
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsVthh = res.data.filter(item => item.ma != "02");
    }
  }

  async loadToTrinhDeXuat() {
    this.dsToTrinhDeXuat = [];
    let res = await this.quyetDinhGiaCuaBtcService.loadToTrinhTongHop({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsToTrinhDeXuat = res.data;
    }
  }

  async onChangeSoToTrinh(event) {
    let curToTrinh = this.dsToTrinhDeXuat.find(item => item.soToTrinh == event);
    if (curToTrinh) {
      //loai hh
      this.formData.controls["loaiVthh"].setValue(curToTrinh.loaiVthh);

      //chung loai hang hoa
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ "str": curToTrinh.loaiVthh });
      this.dsCloaiVthh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.dsCloaiVthh = res.data;
        }
      }
      this.formData.controls["cloaiVthh"].setValue(curToTrinh.cloaiVthh);

      //loai gia
      this.formData.controls["loaiGia"].setValue(curToTrinh.loaiGia);

      //thong tin gia
      this.arrThongTinGia = [];
      res = await this.quyetDinhGiaCuaBtcService.loadToTrinhTongHopThongTinGia(curToTrinh.id);
      if (res.msg == MESSAGE.SUCCESS && res.data) {
        this.arrThongTinGia = res.data;
        this.formData.controls["thongTinGia"].setValue(this.arrThongTinGia);
      } else {
        this.arrThongTinGia = [];
      }
      this.radioValue = curToTrinh.soToTrinh;
    }
  }

  async onChangeLoaiVthh(event) {
    let body = {
      "str": event
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.dsCloaiVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.dsCloaiVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  private UniqueValue(c: AbstractControl): { [key: string]: boolean } {

    // check a property of c, the Control this validator is attached to
    if (this.isErrorUnique) {
      return { "uniqueError": true };
    }
    return null;

    // if (c.value === "bad value") {
    //   // if a bad username is detected, return an error
    //   return { 'badValueFound': true };
    // }
  }

  async calculateVAT(index: number, type: number) {

    //gia mua toi da
    if (type === 0) {
      this.arrThongTinGia[index].giaQdVat = this.arrThongTinGia[index].giaQd + this.arrThongTinGia[index].giaQd * this.thueVat;
    }

  }

  openDialogToTrinh() {
    let radioValue = this.radioValue;
    if (!this.noEdit) {
      let modalQD = this.modal.create({
        nzTitle: 'CHỌN SỐ TỜ TRÌNH HỒ SƠ PHƯƠNG ÁN GIÁ HOẶC SỐ TỜ TRÌNH ĐỀ XUẤT ĐIỀU CHỈNH GIÁ',
        nzContent: DialogPagQdBtcComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '1200px',
        nzFooter: null,
        nzComponentParams: {
        },
      });
      modalQD.afterClose.subscribe((data) => {
        if (data) {
          this.formData.patchValue({
            soToTrinh: data,
            // thongTinToTrinh: data.soToTrinh ? data.soToTrinh : null
          });
          // this.thongTinToTrinh = data;
          this.onChangeSoToTrinh(data);
          this.radioValue = data;
          this.spinner.hide();
        }
      });
    }
  }
}


