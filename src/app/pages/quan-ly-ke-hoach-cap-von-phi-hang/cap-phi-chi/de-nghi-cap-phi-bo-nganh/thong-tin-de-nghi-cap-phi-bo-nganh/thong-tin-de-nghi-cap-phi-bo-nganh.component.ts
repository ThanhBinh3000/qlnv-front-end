// import { Component, OnInit } from '@angular/core';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
@Component({
  selector: 'app-thong-tin-de-nghi-cap-phi-bo-nganh',
  templateUrl: './thong-tin-de-nghi-cap-phi-bo-nganh.component.html',
  styleUrls: ['./thong-tin-de-nghi-cap-phi-bo-nganh.component.scss']
})
export class ThongTinDeNghiCapPhiBoNganhComponent implements OnInit {
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
  // formData: FormGroup;
  constructor() { }

  ngOnInit(): void {
  }

}
