import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-thong-tin-quyet-dinh-phe-duyet-du-an-dtxd',
  templateUrl: './thong-tin-quyet-dinh-phe-duyet-du-an-dtxd.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-phe-duyet-du-an-dtxd.component.scss']
})
export class ThongTinQuyetDinhPheDuyetDuAnDtxdComponent implements OnInit {
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;

  constructor() { }

  ngOnInit(): void {
  }

}
