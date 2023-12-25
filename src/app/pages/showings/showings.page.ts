import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponentOptions, CalendarResult } from 'ion2-calendar';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';
import { ShowingsService } from 'src/app/services/showings.service'
import { IonModal } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { LeadsService } from 'src/app/services/leads.service';


@Component({
  selector: 'app-showings',
  templateUrl: './showings.page.html',
  styleUrls: ['./showings.page.scss'],
})
export class ShowingsPage implements OnInit {

  date: any;
  formDate: any;
  formTime: any;
  dateRange: { from: string; to: string; };
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range',
  };

  form: FormGroup;
  editID:any = 0;
  isSubmitted = false;
  private myToast: any;
  private myloading: any;
  @ViewChild(IonModal) modal: IonModal;


  userImagePlaceholder: any = './../../../assets/placeholder-image.jpg';
  propImagePlaceholder: any = './../../../assets/placeimg.webp';

  logo_image_url = '';
  light_logo_image_url = '';
  dark_logo_image_url = '';

  queryParams: string;
  lists = [];
  slist:any;
  p: number = 1;
  limit: number = 20;
  total: number = 0;
  q: any = '';
  isModalOpen = false;
  isFormModalOpen = false;
  isModalOpenDelete = false;
  isShowNote = false;
  is_loaded = false;

  isPopoverOpen=false;
  isTimePopoverOpen=false;
  lastIndex:number = -1;
  lastSubIndex:number = -1;

  organizations: any = [];
  properties: any = [];
  contacts: any = [];
  staff: any = [];
  statuses:any = ['Pending', 'Cancelled', 'Confirmed', 'Completed'];
  filter_status:any = 'Pending';
  skeletons:any = [1,2,3,4,5,6,7];
  lead_statuses:any = [];


  constructor(
    private fb: FormBuilder,
    private formService: ShowingsService,
    private comService: CommonService,
    private leadService: LeadsService,
    private router: Router,
    private toast: ToastController,
    private loading: LoadingController
  ) { }

  ngOnInit() {
    this.fetchlist();
    this.staffList();
    this.fetchProperties();
    this.fetchContacts();
    this.form = this.fb.group({
      event_property_id: [''],
      c_property_id: ['', [Validators.required]],
      event_contact_id: [''],
      c_contact_id: ['', [Validators.required]],
      start: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      event_staff: [''],
      reminder_before: [30],
      reminder_before_type: ['minutes'],
      feedback: [''],
      feedback_type: ['']
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

  fetchlist() {
    this.queryParams = '?page=' + this.p + '&q=' + this.q + '&status='+this.filter_status;
    this.formService.list(this.queryParams).subscribe({
      next: response => {
        this.lists = response.list;
        this.total = response.total_count;
        this.lead_statuses = response.lead_statuses;
        this.is_loaded = true;
      },
      error: err => {

      }
    });
  }

  fetchByStatus(status) {
    this.filter_status = status;
    this.fetchlist();
  }


  searchProperties(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    if (!text) {
      // Close any running subscription.

      event.component.items = this.properties;
      event.component.endSearch();
      return;
    }

    this.comService.properties(text).subscribe({
      next: response => {
        event.component.items = response.list;
        event.component.endSearch();
      },
      error: err => {
        event.component.endSearch();
      }

    });

  }

  propertyChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.form.controls.event_property_id.setValue(event.value.id);
  }

  contactsList(q: string = '') {
    this.comService.user_contacts(q).subscribe({
      next: response => {
        this.contacts = response.list;
      },
      error: err => {

      }
    });
  }

  searchContacts(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    if (!text) {
      // Close any running subscription.

      event.component.items = this.contacts;
      event.component.endSearch();
      return;
    }

    this.comService.user_contacts(text).subscribe({
      next: response => {
        event.component.items = response.list;
        event.component.endSearch();
      },
      error: err => {
        event.component.endSearch();
      }

    });

  }

  contactChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.form.controls.event_contact_id.setValue(event.value.id);
  }


  staffList() {
    this.comService.user_staff().subscribe({
      next: response => {
        this.staff = response.list;
      },
      error: err => {

      }
    });
  }

  statusChange(event, id) {
    let val = event.target.value;
    if (val && id) {
      this.formService.change_event_status(id, val).subscribe({
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

  changeStaff(e) {

  }

  searchQuery(e) {
    this.q = e.target.value;
    this.fetchlist();
  }

  addNew() {
    this.isFormModalOpen = true;
  }

  fetchProperties(q = '') {
    this.comService.properties(q).subscribe({
      next: response => {
        this.properties = response.list;
      },
      error: err => {
        
      }

    });
  }

  fetchContacts(q = '') {
    this.comService.user_contacts(q).subscribe({
      next: response => {
        this.contacts = response.list;
      },
      error: err => {
        
      }

    });
  }

  view(id:Number) {
    console.log(id);
    if(this.lists && this.lists.length > 0) {
      this.lists.forEach(element => {
        if(element.items) {
          element.items.forEach(sub=>{
            if(sub.eventid == id) {
              this.slist = sub;
              console.log(this.slist);
            }
          })
        }
      });
    }

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  closeFormModal() {
    this.isFormModalOpen = false;
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.form.valid) {
      console.log(this.form.controls.start);
      console.log('Please provide all the required values!')
      return false;
    } else {
      
      const formData = new FormData();

      this.form.value.event_staff.forEach(element => {
        formData.append('event_staff[]', element);
      });

      formData.append('event_contact_id', this.form.value.event_contact_id);
      formData.append('event_property_id', this.form.value.event_property_id);
      
      let full_time = this.form.value.start+' '+this.form.value.start_time;

      formData.append('start', full_time);
      formData.append('reminder_before', this.form.value.reminder_before);
      formData.append('reminder_before_type', this.form.value.reminder_before_type);
      formData.append('description', this.form.value.feedback);
      if(this.form.value.feedback_type) {
        formData.append('feedback_type', this.form.value.feedback_type);
      }
      formData.append('end', '');

      this.showLoading();

      if (this.editID > 0) {
        this.formService.update(formData, this.editID).subscribe({
          next: data => {
            this.hideLoading();
            if (data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
              this.modal.dismiss();
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

        formData.append('color', '#28B8DA');
        formData.append('isstartnotified', '0');
        formData.append('rel_type', '');
        formData.append('rel_id', null);
        formData.append('title', '');

        this.formService.add(formData).subscribe({
          next: data => {
            this.hideLoading();
            if (data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
              this.closeFormModal();
              this.fetchlist();
            } else {
              this.showToast(data.message, 'danger');
              this.isSubmitted = false;
            }

          },
          error: err => {
            this.hideLoading();
            this.isSubmitted = false;
          }
        });
      }
    }
  }

  editRow(id: Number) {
    this.editID = id;
    this.lists[this.lastIndex].items[this.lastSubIndex].toggle = false;

    this.formService.view(id).subscribe({
      next: res => {
        let data = res.view;
        if (data) {

          if(data.event_property_id && this.properties && this.properties.length > 0) {
            this.form.controls.event_property_id.setValue(data.event_property_id);
            this.properties.forEach(element => {
              let exist = this.checkIfListingsExists(data.event_property_id);
              if(!exist) {
                this.properties.push(data.property);
                this.form.controls.c_property_id.setValue(data.property);
              }
              if(element.id == data.event_property_id) {
                this.form.controls.c_property_id.setValue(element);
              }
            });
          }
          if(data.event_contact_id && this.contacts && this.contacts.length > 0) {
            this.form.controls.event_contact_id.setValue(data.event_contact_id);
            this.contacts.forEach(element => {
              let exist = this.checkIfContactsExists(data.event_contact_id);
              if(!exist) {
                this.contacts.push(data.contact);
                this.form.controls.c_contact_id.setValue(data.contact);
              }
              if(element.id == data.event_contact_id) {
                this.form.controls.c_contact_id.setValue(element);
              }
            });
          }
          if(data.event_staff) {
            let agents = data.event_staff.split(',');
            this.form.controls.event_staff.setValue(agents);
          }
          this.form.controls.reminder_before.setValue(data.reminder_before);
          this.form.controls.reminder_before_type.setValue(data.reminder_before_type);
          this.form.controls.feedback.setValue(data.description);
          this.form.controls.feedback_type.setValue(data.feedback_type);

          if(data.feedback || data.feedback_type) {
            this.isShowNote = true;
          }

          let tim = data.start.split(' ');
          this.form.controls.start.setValue(tim[0]);
          
          this.form.controls.start_time.setValue(tim[1]);

          this.isFormModalOpen = true;

        }
      },
      error: err => {
        this.isSubmitted = false;
      }
    });
  }

  checkIfListingsExists($id: string) {
    let valid = false;
    if(this.properties && this.properties.length > 0) {
      this.properties.forEach(element => {
        if (element.id == $id) {
          valid = true;
        }
      });
    }
    
    return valid;
  }

  checkIfContactsExists($id: string) {
    let valid = false;
    if(this.contacts && this.contacts.length > 0) {
      this.contacts.forEach(element => {
        if (element.id == $id) {
          valid = true;
        }
      });
    }
    
    return valid;
  }

  cancelRow(id: Number) {
    this.formService.change_event_status(id, 'Cancelled').subscribe({
      next: res => {
        if (res.success) {
          this.showToast(res.message);
          this.fetchlist();
        } else {
          this.showToast(res.message, 'danger');
        }
      },
      error: err => {
        console.log(err);
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
            this.fetchlist();
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

  closeModel() {
    this.modal.dismiss();
  }

  onWillDismiss(e) {
    this.isModalOpen = false;
    this.isFormModalOpen = false;
  }

  closeModelDelete() {
    console.log('e');
    this.isModalOpenDelete = false;
  }
  onWillDismissDelete(e) {
    this.isModalOpenDelete = false;
  }

  get errorControl() {
    return this.form.controls;
  }

  open_popover_modal() {
    this.isPopoverOpen = true;
  }

  open_time_popover_modal() {
    this.isTimePopoverOpen = true;
  }

  ShowNote() {
    this.isShowNote = true;
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.fetchlist();
  }

  toggleActionMenu(index, subkey, item) {
    item.toggle = !item.toggle;
    if(this.lastIndex >= 0 && this.lastIndex != index ) {
      this.lists[this.lastIndex].items[this.lastSubIndex].toggle = false;
    }
    this.lastIndex = index;
    this.lastSubIndex = subkey;
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

  HideToast() {
    this.myToast = this.toast.dismiss();
  }

  showLoading() {
    this.myloading = this.loading.create({
      message: 'Please wait...',
      spinner: 'circles'
    }).then((loadingData) => {
      loadingData.present();
    });
  }

  hideLoading() {
    this.myloading = this.loading.dismiss();
  }


}
