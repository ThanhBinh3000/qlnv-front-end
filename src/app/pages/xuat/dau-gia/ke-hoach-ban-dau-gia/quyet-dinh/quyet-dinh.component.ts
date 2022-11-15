import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-quyet-dinh',
  templateUrl: './quyet-dinh.component.html',
  styleUrls: ['./quyet-dinh.component.scss']
})
export class QuyetDinhComponent implements OnInit {
  @Input() loaiVthhInput: string;
  constructor() { }

  ngOnInit(): void {
  }

}
