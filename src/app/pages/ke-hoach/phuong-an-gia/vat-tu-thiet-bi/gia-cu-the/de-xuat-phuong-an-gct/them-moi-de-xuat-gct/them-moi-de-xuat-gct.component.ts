import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserLogin} from "../../../../../../../models/userlogin";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {UserService} from "../../../../../../../services/user.service";
import {Globals} from "../../../../../../../shared/globals";
import {HelperService} from "../../../../../../../services/helper.service";
import {GiaDeXuatGiaService} from "../../../../../../../services/gia-de-xuat-gia.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import dayjs from "dayjs";
import {LIST_VAT_TU_HANG_HOA} from "../../../../../../../constants/config";
import {MESSAGE} from "../../../../../../../constants/message";

@Component({
  selector: 'app-them-moi-de-xuat-gct',
  templateUrl: './them-moi-de-xuat-gct.component.html',
  styleUrls: ['./them-moi-de-xuat-gct.component.scss']
})
export class ThemMoiDeXuatGctComponent implements OnInit {

  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();
  formData: FormGroup;
  listVthh: any[] = [];

  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];
  listQdGoc: any[] = [];
  userInfo: UserLogin;
  soDeXuat: string;
  dsLoaiGia: any[] = [];


  maDx: string;
  dataTable: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public globals: Globals,
    private helperService: HelperService,
    private giaDeXuatGiaService: GiaDeXuatGiaService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get('year'), [Validators.required]],
        soDeXuat: [, [Validators.required]],
        loaiHangHoa: [null],
        ngayKy: [null, [Validators.required]],
        loaiGia: [null],
        trichYeu: [null],
        trangThai: ['00'],
        ghiChu: []
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    this.listVthh = LIST_VAT_TU_HANG_HOA;
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.loadDsLoaiGia(),
      this.maDx = '/TCDT-KH',
      this.getDataDetail(this.idInput),
      this.onChangeNamQd(this.formData.get('namKeHoach').value),
    ])
    this.spinner.hide();
  }


  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.giaDeXuatGiaService.getDetail(id);
      const data = res.data;
      console.log(data);
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        soDeXuat: data.soDeXuat.split('/')[0],
        loaiHangHoa: data.loaiHangHoa,
        ngayKy: data.ngayKy,
        loaiGia: data.loaiGia,
        trichYeu: data.trichYeu,
        trangThai: data.trangThai,

      })
      this.taiLieuDinhKemList = data.fileDinhKems;
    }
  }


  async onChangeNamQd(namKeHoach) {
    let body = {
      namKeHoach: namKeHoach,
      trangThai: "11"
    }
    let res = await this.giaDeXuatGiaService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content;
      if (data) {
        let detail = await this.giaDeXuatGiaService.getDetail(data[0].id);
        if (detail.msg == MESSAGE.SUCCESS) {
          this.dsBoNganh = detail.data.listBoNganh;
        }
      }
      console.log(this.dsBoNganh)
    }
  }

  async loadDsLoaiGia() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_GIA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiGia = res.data;
    }
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
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
        (x) => x.id !== data.id,
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
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn ban hành?',
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
            trangThai: '11',
          };
          let res =
            await this.giaDeXuatGiaService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.BAN_HANH_SUCCESS);
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

  async save() {
    console.log(this.taiLieuDinhKemList)
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      console.log(this.formData.value)
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.fileDinhKems = this.taiLieuDinhKemList;
    body.soDeXuat = body.soDeXuat + this.maDx;
    let res
    if (this.idInput > 0) {
      res = await this.giaDeXuatGiaService.update(body);
    } else {
      res = await this.giaDeXuatGiaService.create(body);
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
    console.log(this.formData)
  }

  xoaKeHoach() {
  }

  themKeHoach() {
  }
}
