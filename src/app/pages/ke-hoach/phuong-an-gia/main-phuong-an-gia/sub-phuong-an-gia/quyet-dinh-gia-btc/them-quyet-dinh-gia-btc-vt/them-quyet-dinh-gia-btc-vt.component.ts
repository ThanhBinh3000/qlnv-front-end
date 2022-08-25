import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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
import {DanhMucTieuChuanService} from "src/app/services/danhMucTieuChuan.service";

@Component({
  selector: "app-them-quyet-dinh-gia-btc-vt",
  templateUrl: "./them-quyet-dinh-gia-btc-vt.component.html",
  styleUrls: ["./them-quyet-dinh-gia-btc-vt.component.scss"]
})
export class ThemQuyetDinhGiaBtcVtComponent implements OnInit {
  @Input("pagType") pagType: string;
  @Input("isView") isView: boolean;
  @Input("noEdit") noEdit: boolean;
  @Input() idInput: number;
  @Output("onClose") onClose = new EventEmitter<any>();
  formData: FormGroup;

  STATUS: any;
  dsVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  dsTieuChuanCl: any[] = [];
  dsHangHoa: any[] = [];
  dsLoaiGia: any[] = [];
  dsToTrinhDeXuat: any[] = [];
  arrThongTinGia: Array<QuyetDinhGiaBtcThongTinGia>;

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
    private notification: NzNotificationService,
    private danhMucTieuChuanService: DanhMucTieuChuanService
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
        trichYeu: [null],
        trangThai: ["00"],
        ghiChu: [null],
        thongTinGia: [null]
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    //this.listVthh = LIST_VAT_TU_HANG_HOA;
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.loadDsLoaiGia(),
      this.loadDsVthh(),
      this.loadToTrinhDeXuat(),
      this.maQd = "/QD-BTC",
      this.getDataDetail(this.idInput),
      this.onChangeNamQd(this.formData.get("namKeHoach").value),
      this.loadTiLeThue()
    ]);
    this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhGiaCuaBtcService.getDetail(id);
      const data = res.data;
      console.log(data);
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        soQd: data.soQd.split("/")[0],
        loaiHangHoa: data.loaiHangHoa,
        ngayKy: data.ngayKy,
        ngayHieuLuc: data.ngayHieuLuc,
        loaiGia: data.loaiGia,
        tieuChuanCl: data.tieuChuanCl,
        trichYeu: data.trichYeu,
        trangThai: data.trangThai,
        ghiChu: data.ghiChu,
        soToTrinh: data.soToTrinh
      });
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
      this.thueVat = res.data[0].giaTri;
    } else {
      this.thueVat = 10;
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
            id: this.idInput,
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
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  async save() {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    body.pagType = this.pagType;
    let res;
    if (this.idInput > 0) {
      res = await this.quyetDinhGiaCuaBtcService.update(body);
    } else {
      res = await this.quyetDinhGiaCuaBtcService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.idInput > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.quayLai();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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
      this.dsVthh = res.data;
    }
  }

  async loadToTrinhDeXuat() {
    this.dsToTrinhDeXuat = [];
    let res = await this.quyetDinhGiaCuaBtcService.loadToTrinhDeXuat({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsToTrinhDeXuat = res.data;
    }
  }

  async onChangeSoToTrinh(event) {
    let curToTrinh = this.dsToTrinhDeXuat.find(item => item.id == event);
    if (curToTrinh) {
      //loai hh
      let res = await this.danhMucService.loadDanhMucHangChiTiet(curToTrinh.loaiVthh);
      this.dsVthh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          let tmp = [];
          tmp.push(res.data);
          this.dsVthh = tmp;
        }
      }
      this.formData.controls["loaiVthh"].setValue(curToTrinh.loaiVthh);

      //chung loai hang hoa
      res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({"str": curToTrinh.loaiVthh});
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
      res = await this.quyetDinhGiaCuaBtcService.loadToTrinhDeXuatThongTinGia(curToTrinh.id);
      if (res.msg == MESSAGE.SUCCESS && res.data) {
        this.arrThongTinGia = res.data;
        this.formData.controls["thongTinGia"].setValue(this.arrThongTinGia);
      } else {
        this.arrThongTinGia = [];
      }
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

  async calculateVAT(index: number, type: number) {
    //0:gia>vat 1:vat>gia
    if (type === 0) {
      this.arrThongTinGia[index].giaQdVat = this.arrThongTinGia[index].giaQd + this.arrThongTinGia[index].giaQd * this.thueVat;
    } else if (type === 1) {
      this.arrThongTinGia[index].giaQd = this.arrThongTinGia[index].giaQdVat - this.arrThongTinGia[index].giaQdVat * this.thueVat;
    }
  }
}


