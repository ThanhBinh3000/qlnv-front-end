import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QdPdKetQuaBanDauGiaService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/QdPdKetQuaBanDauGia";
import dayjs from "dayjs";

@Component({
  selector: 'app-qd-pd-ket-qua-bdg',
  templateUrl: './qd-pd-ket-qua-bdg.component.html',
  styleUrls: ['./qd-pd-ket-qua-bdg.component.scss']
})
export class QdPdKetQuaBdgComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;

  constructor(private httpClient: HttpClient,
              private storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService, private banDauGiaService: QdPdKetQuaBanDauGiaService) {
    super(httpClient, storageService, notification, spinner, modal, banDauGiaService);
    super.ngOnInit();
    this.formData = this.fb.group({
      nam: [dayjs().get('year')],
      soQdDc: [''],
      trichYeu: [''],
      loaiVthh: ['']
    });
    this.filterTable = {
      soQd: '',
      ngayQd: '',
      trichYeu: '',
      soQdGoc: '',
      namKhoach: '',
      tenVthh: '',
      soGoiThau: '',
      trangThai: '',
    };

  }

  ngOnInit(): void {
  }

}
