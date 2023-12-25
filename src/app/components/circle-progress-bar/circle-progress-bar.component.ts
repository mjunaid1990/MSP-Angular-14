import { Component, OnInit, ElementRef,  Input,  SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-circle-progress-bar',
  templateUrl: './circle-progress-bar.component.html',
  styleUrls: ['./circle-progress-bar.component.scss'],
})
export class CircleProgressBarComponent implements OnInit {

  @Input() progress: number;
  @Input() input_id: string;
  ngOnInit(): void {
    // this.loadData();
  }
  loadData() {
    let scrollProgress = document.getElementsByClassName('mycirclebar');
    for (let i = 1; i <= scrollProgress.length; i++) {
      let itm = document.getElementById('progress-'+i);
      itm.style.background = `conic-gradient(#ebbc8e, #a3c588 ${this.progress}%, #f8f8f8 ${this.progress}%)`;
    }
  }
  ngAfterViewInit(): void {
    this.loadData();
  }

}
