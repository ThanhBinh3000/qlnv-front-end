import {Component, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-dialog-pag-qd-btc',
  templateUrl: './dialog-pag-qd-btc.component.html',
  styleUrls: ['./dialog-pag-qd-btc.component.scss']
})
export class DialogPagQdBtcComponent implements OnInit {
  dataTable: any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  formData: FormGroup;
  fb: FormBuilder = new FormBuilder();
  constructor(
    private _modalRef: NzModalRef,
  ) {
    this.formData = this.fb.group({
      loaiVthh : [null, Validators.required],
      cloaiVthh : [null, Validators.required],
      loaiQd: ['00']
    });
  }

  ngOnInit(): void {
  }


  handleOk(item: any) {
    this._modalRef.close(item);
  }

  onCancel() {
    this._modalRef.close();
  }

}
