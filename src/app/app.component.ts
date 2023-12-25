import { Component, HostListener } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {

  }

  @HostListener('wheel', ['$event'])
  onWheel($event: WheelEvent) {
    if (!$event.ctrlKey) return;
    $event.preventDefault();
  }
  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    let x = event.key;
    if (event.ctrlKey == true && (x === '+' || x === '-')) {
      event.preventDefault();
    }
  }


  ngOnInit(): void {
    this.initializeApp();
  }

  private initializeApp(): void {

    // other code here

    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }

}
