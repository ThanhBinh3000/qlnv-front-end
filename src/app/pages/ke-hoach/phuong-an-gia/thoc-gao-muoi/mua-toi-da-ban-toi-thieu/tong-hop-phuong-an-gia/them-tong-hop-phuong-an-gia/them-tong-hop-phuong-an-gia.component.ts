import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LIST_VAT_TU_HANG_HOA } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { GiaDeXuatGiaService } from 'src/app/services/gia-de-xuat-gia.service';
import { HelperService } from 'src/app/services/helper.service';
import { TongHopPhuongAnGiaService } from 'src/app/services/tong-hop-phuong-an-gia.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-them-tong-hop-phuong-an-gia',
  templateUrl: './them-tong-hop-phuong-an-gia.component.html',
  styleUrls: ['./them-tong-hop-phuong-an-gia.component.scss']
})
export class ThemTongHopPhuongAnGiaComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();
  formData: FormGroup;
  listVthh: any[] = [];

  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];

  userInfo: UserLogin;
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
    private tonghopphuongangia: TongHopPhuongAnGiaService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,

  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soTT: [, [Validators.required]],
        namTongHop: [dayjs().get('year'), [Validators.required]],
        loaiHangHoa: [null],
        ngayTongHop: [null, [Validators.required]],
        loaiGia: [null],
        chungLoaiHh: [null],
        trangThai: ['00'],
        vungMien: [null]
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
      // this.maDx = '/CDTVP-KH&QLHDT',
      this.getDataDetail(this.idInput),
      this.onChangeNamQd(this.formData.get('namTongHop').value),
    ])
    this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.tonghopphuongangia.getDetail(id);
      const data = res.data;
      console.log(data);
      this.formData.patchValue({
        id: data.id,
        namTongHop: data.namKeHoach,
        loaiHangHoa: data.loaiHangHoa,
        loaiGia: data.loaiGia,
        ngayTongHop: data.ngayKy,
        trichYeu: data.trichYeu,
        trangThai: data.trangThai,
      })
    }
  }

  async loadDsLoaiGia() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_GIA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiGia = res.data;
    }
  }

  async onChangeNamQd(namTongHop) {
    let body = {
      namTongHop: namTongHop,
      trangThai: "11"
    }
    let res = await this.tonghopphuongangia.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      // const data = res.data.content;
      // if (data) {
      //   let detail = await this.giaDeXuatGiaService.getDetail(data[0].id);
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

  downloadFileKeHoach(event) { }

  quayLai() {
    this.onClose.emit();
  }

  banHanh() {
    // this.modal.confirm({
    //   nzClosable: false,
    //   nzTitle: 'Xác nhận',
    //   nzContent: 'Bạn có chắc chắn muốn ban hành?',
    //   nzOkText: 'Đồng ý',
    //   nzCancelText: 'Không',
    //   nzOkDanger: true,
    //   nzWidth: 310,
    //   nzOnOk: async () => {
    //     this.spinner.show();
    //     try {
    //       let body = {
    //         id: this.idInput,
    //         lyDoTuChoi: null,
    //         trangThai: '11',
    //       };
    //       let res =
    //         await this.giaDeXuatGiaService.approve(
    //           body,
    //         );
    //       if (res.msg == MESSAGE.SUCCESS) {
    //         this.notification.success(MESSAGE.SUCCESS, MESSAGE.BAN_HANH_SUCCESS);
    //         this.quayLai();
    //       } else {
    //         this.notification.error(MESSAGE.ERROR, res.msg);
    //       }
    //       this.spinner.hide();
    //     } catch (e) {
    //       console.log('error: ', e);
    //       this.spinner.hide();
    //       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //     }
    //   },
    // });
  }

  async save() {
    // this.spinner.show();
    // this.helperService.markFormGroupTouched(this.formData);
    // if (this.formData.invalid) {
    //   console.log(this.formData.value)
    //   this.spinner.hide();
    //   return;
    // }
    // let body = this.formData.value;
    // body.soDeXuat = body.soDeXuat + this.maDx;
    // let res
    // if (this.idInput > 0) {
    //   res = await this.giaDeXuatGiaService.update(body);
    // } else {
    //   res = await this.giaDeXuatGiaService.create(body);
    // }
    // if (res.msg == MESSAGE.SUCCESS) {
    //   if (this.idInput > 0) {
    //     this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
    //   } else {
    //     this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
    //   }
    //   this.quayLai();
    // } else {
    //   this.notification.error(MESSAGE.ERROR, res.msg);
    // }
    // this.spinner.hide();
    // console.log(this.formData)
  }

  xoaKeHoach() { }

  themKeHoach() { }
}


