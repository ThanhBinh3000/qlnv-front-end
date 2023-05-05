import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzCardModule, NzCardComponent } from "ng-zorro-antd/card";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-thong-tin-hang-can-dieu-chuyen-tc',
  templateUrl: './thong-tin-hang-can-dieu-chuyen-tc.component.html',
  styleUrls: ['./thong-tin-hang-can-dieu-chuyen-tc.component.scss']
})
export class ThongTinHangCanDieuChuyenTCComponent implements OnInit {
  dataHeader: any[] = [];
  dataColumn: any[] = []
  dataTable: any[] = [];
  code: string;
  formData: FormGroup
  fb: FormBuilder = new FormBuilder();

  dataOP: any[] = [
    {
      text: 'aaaa',
      value: 1
    },
    {
      text: 'bbbb',
      value: 2
    }
  ];

  constructor(
    private _modalRef: NzModalRef,
  ) {
    this.formData = this.fb.group({
      // ngayPduyet: [],
    }
    );
  }

  ngOnInit(): void {
    console.log(this.dataTable);
  }


  handleOk(item: any) {
    this._modalRef.close(item);
  }

  onCancel() {
    this._modalRef.close();
  }
}
