import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { GiaDeXuatGiaService } from 'src/app/services/gia-de-xuat-gia.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-them-de-xuat-phuong-an-gia',
  templateUrl: './them-de-xuat-phuong-an-gia.component.html',
  styleUrls: ['./them-de-xuat-phuong-an-gia.component.scss']
})
export class ThemDeXuatPhuongAnGiaComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();
  formData: FormGroup;


  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];

  userInfo: UserLogin;
  soDeXuat: string;

  muaTangList: any[] = []
  xuatGiamList: any[] = []
  xuatBanList: any[] = []
  luanPhienList: any[] = []

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

  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get('year'), [Validators.required]],
        soDeXuat: [, [Validators.required]],
        loaiHangHoa: [, [Validators.required]],
        ngayKy: [null, [Validators.required]],
        loaiGia: [, [Validators.required]],
        trichYeu: [null],
        trangThai: ['00'],
        phuongAnGiaId: [, [Validators.required]]
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.soDeXuat = '/QĐ-BTC',
      this.onChangeNamQd(this.formData.get('namKeHoach').value),
    ])
    this.spinner.hide();
  }


  async onChangeNamQd(namKeHoach) {
    let body = {
      namKeHoach: namKeHoach,
      trangThai: "11"
    }
    let res = await this.giaDeXuatGiaService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content;
      console.log(this.dsBoNganh)
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
  }
  async save() {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      console.log(this.formData.value)
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soDeXuat = body.soDeXuat + this.soDeXuat;
    body.phuongAnGiaId = this.dataTable;
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
  }



  xoaKeHoach() { }

  themKeHoach() { }
}






