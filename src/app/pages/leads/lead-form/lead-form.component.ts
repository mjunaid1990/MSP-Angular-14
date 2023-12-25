import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CalendarComponentOptions, CalendarResult } from 'ion2-calendar';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';
import { LeadsService } from 'src/app/services/leads.service'
import { ModalController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-lead-form',
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.scss'],
})
export class LeadFormComponent implements OnInit {

  date: any;
  dateRange: { from: string; to: string; };
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range',
  };
  @Input("lid") lid;
  form: FormGroup;
  editID = null;
  isSubmitted = false;
  private myToast: any;
  private myloading: any;

  userImagePlaceholder: any = './../../../assets/placeholder-image.jpg';
  propImagePlaceholder: any = './../../../assets/placeimg.webp';

  logo_image_url = '';
  light_logo_image_url = '';
  dark_logo_image_url = '';

  queryParams: string;
  lists = [];
  slist: any;
  p: number = 1;
  limit: number = 15;
  total: number = 0;
  q: any = '';

  new_status_page: number = 1;
  contacted_status_page: number = 1;
  followup_status_page: number = 1;
  view_status_page: number = 1;
  negotiation_status_page: number = 1;
  closed_status_page: number = 1;
  is_loading: boolean = false;


  isModalOpen = false;
  isFormModalOpen = false;
  isModalOpenDelete = false;

  isPopoverOpen = false;

  sources: any = [];
  statuses: any = [];
  members: any = [];
  lead_projects: any = [];
  countries: any = [];
  preferred_contact_methods = ['Email','Call','Whatsapp','Line'];
  property_types: any = ['House', 'Condominium', 'Commercial', 'Land', 'Townhouse'];
  purposes: any = ['Reside', 'Investment', 'Business'];
  sqm_list: any = ['0-25', '26-50', '51-75', '76-100', '101-150', '151-200', '201-300', '300+'];
  beds: any = ['1', '2', '3', '4', '5+'];
  features_list:any = [];
  isOtherSelected: boolean = false;
  leadProfile: any = [];

  constructor(
    private fb: FormBuilder,
    private formService: LeadsService,
    private comService: CommonService,
    private router: Router,
    private toast: ToastController,
    private loading: LoadingController,
    private modalCtrl: ModalController
  ) { }


  ngOnInit() {

    if(this.lid > 0) {
      this.editRow(this.lid);
    }

    this.source_and_status();
    // this.lead_assigned('');
    // this.fetch_lead_project('');
    this.fetch_project_features();
    this.form = this.fb.group({
      source: ['12', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phonenumber: [''],
      lineid: [''],
      preferred_contact: [''],
      lead_profile: this.fb.group({
        rent_or_buy: ['', Validators.required],
        property_type: ['', Validators.required],
        price_from: [''],
        price_to: [''],
        features: [''],
        feature_text: [''],
        purpose: [''],
        no_of_bed: [''],
        sqm_range: ['']
      })
    });

  }
  onChange(event) {
    const f: CalendarResult = event.from;
    const t: CalendarResult = event.to;
    this.date = f + '-' + t;

    const date: CalendarResult = event.data;
    console.log(date);

    console.log(this.date)
  }

  onChangeForm(event) {
    console.log(event);
  }

  source_and_status() {
    this.comService.lead_source_and_status().subscribe({
      next: response => {
        this.sources = response.source;
        this.statuses = response.status;
        this.countries = response.countries;
      },
      error: err => {

      }
    });
  }

  lead_assigned(q: string = '') {
    this.comService.lead_members(q).subscribe({
      next: response => {
        this.members = response.list;
      },
      error: err => {

      }
    });
  }

  searchLeadAssigned(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    if (!text) {
      // Close any running subscription.

      event.component.items = this.members;
      event.component.endSearch();
      return;
    }

    this.comService.lead_members(text).subscribe({
      next: response => {
        event.component.items = response.list;
        event.component.endSearch();
      },
      error: err => {
        event.component.endSearch();
      }

    });

  }

  leadAssignedChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.form.controls.assigned.setValue(event.value.id);
  }

  fetch_lead_project(q: string = '') {
    this.comService.lead_projects(q).subscribe({
      next: response => {
        this.lead_projects = response.list;
      },
      error: err => {

      }
    });
  }

  searchLeadProjects(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    if (!text) {
      // Close any running subscription.

      event.component.items = this.lead_projects;
      event.component.endSearch();
      return;
    }

    this.comService.lead_projects(text).subscribe({
      next: response => {
        event.component.items = response.list;
        event.component.endSearch();
      },
      error: err => {
        event.component.endSearch();
      }

    });

  }

  leadProjectsChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.form.controls.project_id.setValue(event.value.id);
  }

  fetch_project_features() {
    this.comService.features_lists().subscribe({
      next: response => {
        this.features_list = response.features;
      },
      error: err => {

      }
    });
  }

  leadFeaturesChange(event) {
    this.isOtherSelected = false;
    let fes = event.target.value;
    fes.forEach(element => {
      if(element.name == 'Other') {
        this.isOtherSelected = true;
      }
    });
  }

  searchQuery(e) {
    this.q = e.target.value;
    // this.fetchlist();
  }

  addNew() {
    this.isFormModalOpen = true;
  }

  view(id: Number) {
    console.log(id);
    if (this.lists && this.lists.length > 0) {
      this.lists.forEach(element => {
        if (element.items) {
          element.items.forEach(sub => {
            if (sub.eventid == id) {
              this.slist = sub;
              console.log(this.slist);
            }
          })
        }
      });
    }

  }

  closeModal() {
    this.isModalOpen = false;
  }

  closeFormModal() {
    return this.modalCtrl.dismiss();
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.form.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {


      const formData = new FormData();


      formData.append('name', this.form.value.name);
      formData.append('email', this.form.value.email);
      formData.append('phonenumber', this.form.value.phonenumber);
      formData.append('lineid', this.form.value.lineid);
      formData.append('source', this.form.value.source);
      formData.append('preferred_contact', this.form.value.preferred_contact);

      if(this.form.value.lead_profile.property_type) {
        formData.append('leadprofile[property_type]', this.form.value.lead_profile.property_type);
      }
      if(this.form.value.lead_profile.rent_or_buy) {
        formData.append('leadprofile[rent_or_buy]', this.form.value.lead_profile.rent_or_buy);
      }
      if(this.form.value.lead_profile.no_of_bed) {
        formData.append('leadprofile[no_of_bed]', this.form.value.lead_profile.no_of_bed);
      }
      if(this.form.value.lead_profile.price_from) {
        formData.append('leadprofile[price_from]', this.form.value.lead_profile.price_from);
      }
      if(this.form.value.lead_profile.price_to) {
        formData.append('leadprofile[price_to]', this.form.value.lead_profile.price_to);
      }
      if(this.form.value.lead_profile.sqm_range) {
        formData.append('leadprofile[sqm_range]', this.form.value.lead_profile.sqm_range);
      }
      if(this.form.value.lead_profile.features) {
        formData.append('leadprofile[features]', this.form.value.lead_profile.features.toString());
      }
      if(this.form.value.lead_profile.feature_text) {
        formData.append('leadprofile[feature_text]', this.form.value.lead_profile.feature_text);
      }
      if(this.form.value.lead_profile.purpose) {
        formData.append('leadprofile[purpose]', this.form.value.lead_profile.purpose);
      }
      if(this.leadProfile && this.leadProfile.id) {
        formData.append('leadprofile[id]', this.leadProfile.id);
      }
      // this.form.value.event_staff.forEach(element => {
      //   formData.append('event_staff[]', element);
      // });

      // formData.append('event_contact_id', this.form.value.event_contact_id);
      // formData.append('event_property_id', this.form.value.event_property_id);

      // formData.append('start', this.form.value.start);
      // formData.append('reminder_before', this.form.value.reminder_before);
      // formData.append('reminder_before_type', this.form.value.reminder_before_type);
      // formData.append('feedback', this.form.value.feedback);


      // this.showLoading();

      if (this.editID > 0) {
        this.formService.update(formData, this.editID).subscribe({
          next: data => {
            this.hideLoading();
            if (data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
              this.closeFormModal();
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

        // formData.append('color', '#28B8DA');
        // formData.append('isstartnotified', '0');
        // formData.append('rel_type', '');
        // formData.append('rel_id', null);
        // formData.append('end', '');
        // formData.append('description', '');
        formData.append('status', '2');

        this.formService.add(formData).subscribe({
          next: data => {
            // this.hideLoading();
            if (data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
              this.closeFormModal();
              // this.fetchlist();
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

  editRow(id: Number) {
    this.editID = id;
    this.formService.view(id).subscribe({
      next: res => {
        let data = res.view;
        this.leadProfile = res.leadprofile;
        if (data) {

          this.form.controls.name.setValue(data.name);
          this.form.controls.email.setValue(data.email);
          this.form.controls.phonenumber.setValue(data.phonenumber);
          this.form.controls.lineid.setValue(data.lineid);
          this.form.controls.source.setValue(data.source);
          this.form.controls.preferred_contact.setValue(data.preferred_contact);

          this.form.patchValue({
            lead_profile: {
              property_type: res.leadprofile.property_type,
              rent_or_buy: res.leadprofile.rent_or_buy,
              price_from: res.leadprofile.price_from,
              price_to: res.leadprofile.price_to,
              features: res.leadprofile.features?res.leadprofile.features.split(','):'',
              no_of_bed: res.leadprofile.no_of_bed?res.leadprofile.no_of_bed.split(','):'',
              sqm_range: res.leadprofile.sqm_range,
              purpose: res.leadprofile.purpose,
              feature_text: res.leadprofile.feature_text
            }
          })

          // this.form.get('lead_profile').setValue({property_type: data.lead_profile.property_type});
          // this.form.get('lead_profile').setValue({rent_or_buy: data.lead_profile.rent_or_buy});
          // this.form.get('lead_profile').setValue({price_from: data.lead_profile.price_from});
          // this.form.get('lead_profile').setValue({price_to: data.lead_profile.price_to});
          // if(data.lead_profile.features) {
          //   this.form.get('lead_profile').setValue({features: data.lead_profile.features.split(',')});
          // }
          // if(data.lead_profile.no_of_bed) {
          //   this.form.get('lead_profile').setValue({features: data.lead_profile.no_of_bed.split(',')});
          // }
          // this.form.get('lead_profile').setValue(data.lead_profile.sqm_range);
        }
      },
      error: err => {
        this.isSubmitted = false;
      }
    });
  }



  deleteRow(id: Number) {
    this.editID = id;
    this.isModalOpenDelete = true;
  }

  confirmDelete() {
    if (this.editID) {
      this.isSubmitted = true;
      this.showLoading();
      this.formService.delete(this.editID).subscribe({
        next: data => {
          this.hideLoading();
          if (data.success) {
            this.showToast(data.message);
            this.isSubmitted = false;
            this.isModalOpenDelete = false;
            // this.fetchlist();
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


  get errorControl() {
    return this.form.controls;
  }


  open_popover_modal() {
    this.isPopoverOpen = true;
  }

  pageChangeEvent(event: number) {
    this.p = event;
    // this.fetchlist();
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

  showLoading() {
    this.myloading = this.loading.create({
      message: 'Please wait...',
      spinner: 'circles'
    }).then((loadingData) => {
      loadingData.present();
    });
  }

  async hideLoading() {
    this.myloading = await this.loading.dismiss().then(() => console.log('dismissed'));
  }

}
