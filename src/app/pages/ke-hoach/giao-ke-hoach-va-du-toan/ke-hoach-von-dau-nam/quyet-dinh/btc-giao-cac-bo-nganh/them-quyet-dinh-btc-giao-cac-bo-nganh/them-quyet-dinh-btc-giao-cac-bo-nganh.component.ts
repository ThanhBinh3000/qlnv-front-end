import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as dayjs from 'dayjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhTtcpService } from 'src/app/services/quyetDinhTtcp.service';
import { QuyetDinhBtcNganhService } from 'src/app/services/quyetDinhBtcNganh.service';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'app-them-quyet-dinh-btc-giao-cac-bo-nganh',
  templateUrl: './them-quyet-dinh-btc-giao-cac-bo-nganh.component.html',
  styleUrls: ['./them-quyet-dinh-btc-giao-cac-bo-nganh.component.scss'],
})
export class ThemQuyetDinhBtcGiaoCacBoNganhComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();

  formData: FormGroup;

  // quyetDinh: IQuyetDinhBTC = {
  //   id: null,
  //   soQd: null,
  //   namQd: null,
  //   ngayQd: new Date(),
  //   trichYeu: null,
  //   taiLieuDinhKem: null,
  //   keHoach: [],
  // };

  quyetDinh: any;
  taiLieuDinhKemList = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];

  userInfo: UserLogin;
  maQd: string;

  dataTable: any[] = [];
  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public globals: Globals,
    private helperService: HelperService,
    private quyetDinhTtcpService: QuyetDinhTtcpService,
    private quyetDinhBtcNganhService: QuyetDinhBtcNganhService,

  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [, [Validators.required]],
        ngayQd: [null, [Validators.required]],
        namQd: [dayjs().get('year'), [Validators.required]],
        trichYeu: [null],
        trangThai: ['00'],
        muaTangList: [[],],
        xuatGiamList: [[]],
        xuatBanList: [[]],
        luanPhienList: [[]],
        idBoNganh: [, [Validators.required]]
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.maQd = '/' + this.userInfo.MA_QD,
      // this.getDataDetail(this.idInput),
      this.quyetDinh = [
        {
          id: 1,
          idNoiDung: 1,
          noiDung: 'Chi thường xuyên',
          duToan: 250,
        },
        {
          id: 2,
          idNoiDung: 2,
          noiDung: 'Khác',
          duToan: 350,
        },
      ],
    ])
    this.spinner.hide();
  }

  async onChangeNamQd(namQd) {
    let body = {
      namQd: namQd,
      trangThai: "11"
    }
    let res = await this.quyetDinhTtcpService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content;
      if (data) {
        let detail = await this.quyetDinhTtcpService.getDetail(data[0].id);
        if (detail.msg == MESSAGE.SUCCESS) {
          this.dsBoNganh = detail.data.listBoNganh;
        }
      }
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

  banHanh() { }

  save() {
    // this.spinner.show();
    // this.helperService.markFormGroupTouched(this.formData);
    // if (this.formData.invalid) {
    //   console.log(this.formData.value)
    //   this.spinner.hide();
    //   return;
    // }
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    console.log(body);
  }

  xoaKeHoach() { }

  themKeHoach() { }
}

interface IQuyetDinhBTC {
  id: number;
  soQd: string;
  namQd: string;
  ngayQd: Date;
  trichYeu: string;
  taiLieuDinhKem: any;
  keHoach: any;
}
