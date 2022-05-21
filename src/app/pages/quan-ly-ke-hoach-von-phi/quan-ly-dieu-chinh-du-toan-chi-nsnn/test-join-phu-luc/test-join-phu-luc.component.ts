import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-join-phu-luc',
  templateUrl: './test-join-phu-luc.component.html',
  styleUrls: ['./test-join-phu-luc.component.scss']
})
export class TestJoinPhuLucComponent implements OnInit {
  username: string = "duy dat"
  constructor() { }

  ngOnInit() {
  }
  childData: string;
  parentMethod(data){
    this.childData = data
  }
}
