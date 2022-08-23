import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-them-moi-qd-gia-tcdtnn',
  templateUrl: './them-moi-qd-gia-tcdtnn.component.html',
  styleUrls: ['./them-moi-qd-gia-tcdtnn.component.scss']
})
export class ThemMoiQdGiaTcdtnnComponent implements OnInit {

  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();
  formData: FormGroup;

  userInfo: UserLogin;
  maQd: String;
  dsNam: any[] = [];
  dataTable: any[] = [];
  constructor(
    private readonly fb: FormBuilder,
    public globals: Globals,
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
