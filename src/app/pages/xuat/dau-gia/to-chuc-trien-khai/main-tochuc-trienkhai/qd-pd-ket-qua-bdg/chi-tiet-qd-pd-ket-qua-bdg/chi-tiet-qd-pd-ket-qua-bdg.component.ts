import {Component, Input, OnInit} from '@angular/core';
import {Globals} from "../../../../../../../shared/globals";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as dayjs from "dayjs";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QdPdKetQuaBanDauGiaService
} from "../../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/QdPdKetQuaBanDauGia";

@Component({
  selector: 'app-chi-tiet-qd-pd-ket-qua-bdg',
  templateUrl: './chi-tiet-qd-pd-ket-qua-bdg.component.html',
  styleUrls: ['./chi-tiet-qd-pd-ket-qua-bdg.component.scss']
})
export class ChiTietQdPdKetQuaBdgComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  formData: FormGroup;
  taiLieuDinhKemList: any[] = [];

  constructor(public globals: Globals, private httpClient: HttpClient,
              private storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService, private banDauGiaService: QdPdKetQuaBanDauGiaService) {
    super(httpClient, storageService, notification, spinner, modal, banDauGiaService);
    super.ngOnInit();
    this.formData = this.fb.group({
      namKh: [dayjs().get('year'), [Validators.required]],
      ngayNhap: ['', [Validators.required]],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      lyDoTuChoi: [null]
    });
  }

  ngOnInit(): void {
  }

}
