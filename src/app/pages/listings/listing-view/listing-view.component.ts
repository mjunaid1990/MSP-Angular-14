import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ListingService } from 'src/app/services/listing.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { IonSlides } from '@ionic/angular';
import lgZoom from 'lightgallery/plugins/zoom';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";

@Component({
  selector: 'app-listing-view',
  templateUrl: './listing-view.component.html',
  styleUrls: ['./listing-view.component.scss'],
})
export class ListingViewComponent implements OnInit {

  viewModal:any = [];
  isOpenListingMenu:boolean = false;
  display_style:string = 'none';
  showPrevArrow:boolean = false;
  @ViewChild('mySlider') slider: IonSlides;
  @ViewChild(IonModal) modal: IonModal;

  statuses: any = [
    { id: '0', name: 'Draft' },
    { id: '2', name: 'Active' },
    { id: '3', name: 'In Negotiation' },
    { id: '4', name: 'Sold/Rented' },
    { id: '5', name: 'Expired/Unsold' },
  ];
  private myToast: any;


  googleOptions = {
    zoom: 14,
    center: new google.maps.LatLng(13.7563, 100.5018),
    mapTypeControl: true,
    mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
    navigationControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  markers = [];

  settings = {
    counter: false,
    plugins: [lgZoom]
  };

  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    const { index, prevIndex } = detail;
    console.log(index, prevIndex);
  };

  slideOpts = {
    // initialSlide: 1,
    spaceBetween: 15,
    slidesPerView: 1,
    speed: 400,
    loop: true,
    // centerInsufficientSlides: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
  };

  userImagePlaceholder: any = './../../../assets/placeholder-image.jpg';
  form: FormGroup;
  editID: Number = null;
  isSubmitted = false;
  isModalOpen = false;

  constructor(
    private formService: ListingService,
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthenticationService,
    public sanitizer: DomSanitizer,
    private toast: ToastController,
    private fb: FormBuilder,
  ) { 
    let id:any = this.route.snapshot.paramMap.get('id');
    if(id) {
      this.ViewRow(id);
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      content: ['', [Validators.required]],
    });
  }

  ViewRow(id) {
    this.formService.view(id).subscribe({
      next: response => {
        this.viewModal = response.listing;
        if(this.viewModal.status == '1') {
          this.viewModal.status = '0';
        }
        console.log(this.viewModal.shareables);
        if(this.viewModal) {
          this.createMarker();
        }
      },
      error: err => {

      }
    });
  }

  createMarker() {
    if(this.viewModal.lat) {
      let marker = new google.maps.Marker({
          position: {lat: Number(this.viewModal.lat), lng: Number(this.viewModal.lng)},
          animation: google.maps.Animation.BOUNCE
      });
      this.markers.push(marker);
      this.googleOptions.center = new google.maps.LatLng(Number(this.viewModal.lat), Number(this.viewModal.lng));
    }
  }

  openListingMenu() {
    this.isOpenListingMenu = !this.isOpenListingMenu;
  }

  deleteListing(id) {
    this.isOpenListingMenu = false;
  }

  slidePrev() {
    this.slider.slidePrev();
    this.slider.getActiveIndex().then(index => {
      if(index == 0) {
        this.showPrevArrow = false;
      }
    });
  }
  slideNext() {
    this.showPrevArrow = true;
    this.slider.slideNext();
  }

  openLightBox(index) {
    // this.display_style
    let el = document.getElementById('slider-'+index) as HTMLElement;
    el.click();    
  }
  openFloorLightBox(index) {
    let el = document.getElementById('floor-'+index) as HTMLElement;
    el.click();  
  }

  replacePropTypeText(text) {
    let v = text.replace('buy', 'sale');
    return v.replace('Buy', 'Sale');
  }

  statusChange(event, id) {
    let val = event.target.value;
    if (val) {
      this.formService.update_status(val, id).subscribe({
        next: response => {
          if (response.success) {
            this.showToast(response.message);
          }
        },
        error: err => {

        }
      });
    }
  }

  statusClass(item) {
    if(item.status == '2' || item.status == '3') {
      return 'green';
    }else {
      return 'blue';
    }
    
  }

  OpenModal() {
    this.isModalOpen = true;
    this.editID = null;
    this.form.reset();
  }

  onWillDismiss(e) {
    this.isModalOpen = false;
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.form.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {

      const formData = new FormData();

      formData.append('content', this.form.value.content);

      if (this.editID) {
        this.formService.update_note(formData, this.editID, this.viewModal.id).subscribe({
          next: data => {
            if (data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
            } else {
              this.showToast(data.message, 'danger');
              this.isSubmitted = false;
            }

          },
          error: err => {
            this.isSubmitted = false;
          }
        });
      } else {
        this.formService.save_note(formData, this.viewModal.id).subscribe({
          next: data => {
            if (data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
              this.modal.dismiss();
            } else {
              this.showToast(data.message, 'danger');
              this.isSubmitted = false;
            }

          },
          error: err => {
            this.isSubmitted = false;
          }
        });
      }

    }
  }
  editNote(note) {
    this.isModalOpen = true;
    this.form.controls.content.setValue(note.content);
    this.editID = note.id;
  }

  closeModel() {
    this.modal.dismiss();
  }

  showToast(message, $color = 'success') {
    this.myToast = this.toast.create({
      message: message,
      position: 'top',
      color: $color,
      duration: 3000
    }).then((toastData) => {
      toastData.present();
    });
  }

  async HideToast() {
    this.myToast = await this.toast.dismiss().then(() => console.log('hided'));
  }


}
