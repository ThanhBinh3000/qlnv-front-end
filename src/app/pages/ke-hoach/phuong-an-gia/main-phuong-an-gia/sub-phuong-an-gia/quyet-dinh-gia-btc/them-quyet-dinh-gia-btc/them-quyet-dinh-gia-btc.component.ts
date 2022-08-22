import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import dayjs from "dayjs";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { LIST_VAT_TU_HANG_HOA } from "src/app/constants/config";
import { MESSAGE } from "src/app/constants/message";
import { UserLogin } from "src/app/models/userlogin";
import { HelperService } from "src/app/services/helper.service";
import { UserService } from "src/app/services/user.service";
import { Globals } from "src/app/shared/globals";
import { QuyetDinhGiaCuaBtcService } from "src/app/services/quyetDinhGiaCuaBtc.service";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { TongHopPhuongAnGiaService } from "src/app/services/tong-hop-phuong-an-gia.service";
import { QuyetDinhGiaBtcThongTinGia } from "src/app/models/QuyetDinhBtcThongTinGia";

@Component({
  selector: "app-them-quyet-dinh-gia-btc",
  templateUrl: "./them-quyet-dinh-gia-btc.component.html",
  styleUrls: ["./them-quyet-dinh-gia-btc.component.scss"]
})
export class ThemQuyetDinhGiaBtcComponent implements OnInit {
  @Input("isView") isView: boolean;
  @Input()
  idInput: number;
  @Output("onClose") onClose = new EventEmitter<any>();
  formData: FormGroup;

  dsVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  dsHangHoa: any[] = [];
  dsLoaiGia: any[] = [];
  dsToTrinhDeXuat: any[] = [];
  dsThongTinGia: any[] = [];
  tableThongTinGia: { [key: string]: any } = {};
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
      this.onChangeNamQd(this.formData.get("namKeHoach").value)
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
            trangThai: "11"
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
      console.log(this.formData.value);
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    console.log(this.formData.value);
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
    console.log(this.formData);
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
    let res = await this.tongHopPhuongAnGiaService.loadToTrinhDeXuat({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsToTrinhDeXuat = res.data;
    }
  }

  async onChangeSoToTrinh(event) {
    let curToTrinh=this.dsToTrinhDeXuat.find(item=> item.id == event)

    this.formData.controls["loaiVthh"].setValue(curToTrinh.loaiVthh);

    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ "str": curToTrinh.loaiVthh });
    this.dsCloaiVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.dsCloaiVthh = res.data;
      }
    }
    this.formData.controls["cloaiVthh"].setValue(curToTrinh.cloaiVthh);
    this.formData.controls["loaiGia"].setValue(curToTrinh.loaiGia);

    this.arrThongTinGia = [];
    res = await this.tongHopPhuongAnGiaService.loadToTrinhDeXuatThongTinGia(curToTrinh.id);
    if (res.msg == MESSAGE.SUCCESS && res.data) {
      this.arrThongTinGia = res.data;
      this.formData.controls["thongTinGia"].setValue(this.arrThongTinGia);
    } else {
      this.arrThongTinGia = [];
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
}


