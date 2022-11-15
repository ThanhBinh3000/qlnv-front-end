import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tong-hop',
  templateUrl: './tong-hop.component.html',
  styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent implements OnInit {
  @Input() loaiVthhInput: string;
  constructor() { }

  ngOnInit(): void {
  }

}
