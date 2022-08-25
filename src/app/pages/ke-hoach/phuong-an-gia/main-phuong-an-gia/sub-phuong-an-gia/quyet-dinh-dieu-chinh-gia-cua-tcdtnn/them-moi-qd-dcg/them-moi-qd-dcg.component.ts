import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import {
  DialogDanhSachHangHoaComponent
} from "../../../../../../../components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  DialogSoToTrinhPagComponent
} from "../../../../../../../components/dialog/dialog-so-to-trinh-pag/dialog-so-to-trinh-pag.component";

@Component({
  selector: 'app-them-moi-qd-dcg',
  templateUrl: './them-moi-qd-dcg.component.html',
  styleUrls: ['./them-moi-qd-dcg.component.scss']
})
export class ThemMoiQdDcgComponent implements OnInit {

  @Input('isView') isView: boolean;
  @Input() idInput: number;
  @Input() loaiVthh: string;
  @Input() type: string;
  @Output('onClose') onClose = new EventEmitter<any>();
  formData: FormGroup;
  userInfo: UserLogin;
  maQd: String;
  dsNam: any[] = [];
  dataTable: any[] = [];
  namNay: number;
  soToTrinh: any
  constructor(
    private readonly fb: FormBuilder,
    public globals: Globals,
    private modal: NzModalService,
    private userService: UserService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get('year'), [Validators.required]],
        soQd: [, [Validators.required]],
        soTtrinh: [],
        soQdGoc: [],
        ngayKy: [null, [Validators.required]],
        ngayHluc: [null, [Validators.required]],
        loaiGia: [null],
        trichYeu: [null],
        trangThai: ['00'],
        ghiChu: [null],
        loaiVthh: [],
        cloaiVthh: [],
        tchuanCluong: [],
        gia: [],
        giaVat: [],
      }
    );
  }

  async ngOnInit() {
    this.namNay = dayjs().get('year');
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      // this.loadDsLoaiGia(),
      // this.loadDsVthh(),
      this.maQd = "/" + this.userInfo.MA_QD,
      // this.getDataDetail(this.idInput),
      // this.onChangeNamQd(this.formData.get('namKeHoach').value),
    ])
  }


  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  chonSoToTrinh(page: string) {
    if (page == 'stt') {
      const modalTuChoi = this.modal.create({
        nzTitle: 'Số tờ trình đề xuất của Vụ kế hoạch',
        nzContent: DialogSoToTrinhPagComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          pagtype: this.loaiVthh,
          type: this.type,
          loai: page
        },
      });
      modalTuChoi.afterClose.subscribe(async (data) => {
        if (data != null) {
          this.formData.patchValue({
            soTtrinh: data.soToTrinh
          })
        }
      });
    }
    if (page == 'sqd') {
      const modalTuChoi = this.modal.create({
        nzTitle: 'Số quyết định giá của TCDTNN',
        nzContent: DialogSoToTrinhPagComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          pagtype: this.loaiVthh,
          type: this.type,
          loai: page
        },
      });
      modalTuChoi.afterClose.subscribe(async (data) => {
        if (data != null) {
          this.formData.patchValue({
            soQdGoc: data.soQd
          })
        }
      });
    }
  }

  quayLai() {
    this.onClose.emit();
  }

  banHanh() {

  }

  save() {

  }

  onChangeNamQd($event) {

  }

}
