import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Globals } from 'src/app/shared/globals';
@Component({
    selector: 'du-toan-nsnn',
    templateUrl: './du-toan-nsnn.component.html',
    styleUrls: ['./du-toan-nsnn.component.scss'],
})
export class DuToanNsnnComponent implements OnInit {
    // tabH = 0;
    constructor(
        public globals: Globals,
        private dataSource: DataService,
    ) { }
    tabSelected = 'lapthamdinh';
    async ngOnInit() {
        await this.dataSource.currentData.subscribe(obj => {
            if (obj?.tabSelected) {
                this.tabSelected = obj.tabSelected;
            }
        })
        if (!this.tabSelected) {
            this.tabSelected = 'lapthamdinh';
        }
        // this.tabH = window.innerHeight - document.querySelector('.tab-level-0').getBoundingClientRect().top - 28;
        // window.addEventListener('resize', (e) => {
        //   this.tabH = window.innerHeight - document.querySelector('.tab-level-0').getBoundingClientRect().top - 28;
        // });
    }
    selectTab(tab) {
        this.tabSelected = tab;
    }
}
