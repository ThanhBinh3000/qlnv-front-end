import {Component, Input, OnInit} from '@angular/core';
import {MESSAGE} from "../../../constants/message";
import {NzModalRef} from "ng-zorro-antd/modal";
import {PAGE_SIZE_DEFAULT, TYPE_PAG} from "../../../constants/config";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {QuyetDinhGiaTCDTNNService} from "../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
import {STATUS} from "../../../constants/status";
import {TongHopPhuongAnGiaService} from "../../../services/ke-hoach/phuong-an-gia/tong-hop-phuong-an-gia.service";

@Component({
  selector: 'app-dialog-so-quyet-dinh-qly-kho-tang',
  templateUrl: './dialog-so-quyet-dinh-qly-kho-tang.component.html',
  styleUrls: ['./dialog-so-quyet-dinh-qly-kho-tang.component.scss']
})
export class DialogSoQuyetDinhQlyKhoTangComponent implements OnInit {
  @Input() loai: string;
  @Input() dsQdGoc: any[] = [];
  dsToTrinhDeXuat: any[] = [];

  constructor(
    private _modalRef: NzModalRef,
  ) {

  }

  async ngOnInit() {
  }

  onCancel() {
    this._modalRef.close();
  }


  async search() {
  }


  handleCancel() {
    this._modalRef.close();
  }
  selectHangHoa(qdGoc: any) {
    this._modalRef.close(qdGoc);
  }
}

