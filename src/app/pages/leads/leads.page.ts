import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { LeadsService } from 'src/app/services/leads.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ModalController } from '@ionic/angular';
import { LeadFormComponent } from './lead-form/lead-form.component';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.page.html',
  styleUrls: ['./leads.page.scss'],
})
export class LeadsPage implements OnInit {



  private myToast: any;
  private myloading: any;
  last_lead_popup_index:any = null;
  last_lead_status_index:any = null;
  is_grid_active:boolean = true;
  is_list_active:boolean = false;


  queryParams: string;
  lists = [];
  listsViewRes = [];
  leadStatuses = [];
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
  is_searching: boolean = false;
  skeletons:any = [

    {
      status:1,
      leads:[0,1,2,3,4]
    },
    {
      status:1,
      leads:[0,1,2,3,4]
    },
    {
      status:1,
      leads:[0,1,2,3,4]
    },
    {
      status:1,
      leads:[0,1,2,3,4]
    },
    {
      status:1,
      leads:[0,1,2,3,4]
    },
    {
      status:1,
      leads:[0,1,2,3,4]
    }
  ];


  constructor(
    private formService: LeadsService,
    private toast: ToastController,
    private loading: LoadingController,
    private modalController: ModalController
  ) { }


  ngOnInit() {
    this.fetchlist('');
  }

  async addLead() {
    const modal = await this.modalController.create({
      component: LeadFormComponent,
      cssClass: 'listing-modal',
      componentProps: {id: ''},
      backdropDismiss:false
    });
    return await modal.present();
  }

  openPopup(lead) {
    if(this.last_lead_popup_index) {
      if(this.last_lead_popup_index == lead) {
        this.last_lead_popup_index = null;
        lead.is_open = false;
      }else {
        this.last_lead_popup_index.is_open = false;
        lead.is_open = true;
        this.last_lead_popup_index = lead;
      }
    }else {
      lead.is_open = true;
      this.last_lead_popup_index = lead;
    }
    
  }

  async openPopupModal(lead) {
    const modal = await this.modalController.create({
      component: LeadFormComponent,
      cssClass: 'listing-modal',
      componentProps: {lid: lead.id},
      backdropDismiss:false
    });
    return await modal.present();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }


  fetchlist(status, $search = false) {
    this.queryParams = '?page=' + this.p + '&q=' + this.q + '&status='+status;
    this.formService.list(this.queryParams).subscribe({
      next: response => {
        this.is_loading = false;
        if(status) {
          if(status == 2) {
            for (let i = 0; i < response.list[0].leads.length; i++) {
              this.lists[0].leads.push(response.list[0].leads[i]);
            }
          }else if(status == 3) {
            for (let i = 0; i < response.list[0].leads.length; i++) {
              this.lists[1].leads.push(response.list[0].leads[i]);
            }
          }else if(status == 6) {
            for (let i = 0; i < response.list[0].leads.length; i++) {
              this.lists[2].leads.push(response.list[0].leads[i]);
            }
          }else if(status == 4) {
            for (let i = 0; i < response.list[0].leads.length; i++) {
              this.lists[3].leads.push(response.list[0].leads[i]);
            }
          }else if(status == 7) {
            for (let i = 0; i < response.list[0].leads.length; i++) {
              this.lists[4].leads.push(response.list[0].leads[i]);
            }
          }else if(status == 1) {
            for (let i = 0; i < response.list[0].leads.length; i++) {
              this.lists[5].leads.push(response.list[0].leads[i]);
            }
          }
        }else {
          if($search) {
            this.lists = response.list;
          }else {
            for (let i = 0; i < response.list.length; i++) {
              this.lists.push(response.list[i]);
            }
          }
          
        }
      },
      error: err => {
        this.is_loading = false;
      }
    });
  }

  loadMore(status) {
    this.is_loading = true;
    if(status == 2) {
      this.new_status_page++;
      this.p = this.new_status_page;
      this.fetchlist(status);
    }else if(status == 3) {
      this.contacted_status_page++;
      this.p = this.contacted_status_page;
      this.fetchlist(status);
    }else if(status == 6) {
      this.followup_status_page++;
      this.p = this.followup_status_page;
      this.fetchlist(status);
    }else if(status == 4) {
      this.view_status_page++;
      this.p = this.view_status_page;
      this.fetchlist(status);
    }else if(status == 7) {
      this.negotiation_status_page++;
      this.p = this.negotiation_status_page;
      this.fetchlist(status);
    }else if(status == 1) {
      this.closed_status_page++;
      this.p = this.closed_status_page;
      this.fetchlist(status);
    }
    
  }

  fetchlistView() {
    this.is_searching = true;
    this.queryParams = '?page=' + this.p + '&q=' + this.q + '&status='+status;
    this.formService.listView(this.queryParams).subscribe({
      next: response => {
        this.is_searching = false;
        
        this.leadStatuses = response.lead_statuses;
        this.listsViewRes = response.list;
        this.total = response.total_count;
      },
      error: err => {
        this.is_searching = false;
      }
    });
  }

  updateTitle(e) {
    this.q = e.target.value;
    this.fetchlist('', true);
  }

  listview() {
    this.is_list_active = true;
    this.is_grid_active = false;
    this.fetchlistView();
  }
  gridview() {
    this.is_list_active = false;
    this.is_grid_active = true;
    this.fetchlist('', true);
  }

  statusClass(item) {
    if(item.status === 2) {
      return 'green';
    }if(item.status === 3) {
      return 'light-green';
    }if(item.status === 4) {
      return 'light-gray';
    }if(item.status === 5) {
      return 'light-gray';
    }else {
      return 'blue';
    }
    
  }

  statusChange(val, id) {

  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.fetchlistView();
  }

  deleteRow(id: Number) {

  }

  confirmDelete() {
    

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
