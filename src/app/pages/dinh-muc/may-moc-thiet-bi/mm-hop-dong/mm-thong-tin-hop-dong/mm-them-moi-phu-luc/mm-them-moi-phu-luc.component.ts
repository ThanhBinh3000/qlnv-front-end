import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-mm-them-moi-phu-luc',
  templateUrl: './mm-them-moi-phu-luc.component.html',
  styleUrls: ['./mm-them-moi-phu-luc.component.scss']
})
export class MmThemMoiPhuLucComponent implements OnInit {
  @Input() id :number

  constructor() { }

  ngOnInit(): void {
  }

}
