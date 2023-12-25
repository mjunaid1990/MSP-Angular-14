import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CalendarComponentOptions, CalendarResult } from 'ion2-calendar';
import { IonSlides } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexGrid,
  ApexPlotOptions,
  ApexFill
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  legend:ApexLegend;
  stroke: ApexStroke;
  grid:ApexGrid;
  plotOptions: ApexPlotOptions;
  fill:ApexFill
};


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})



export class DashboardPage implements OnInit {

  date: any;
  dateRange: { from: string; to: string; };
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  dateRangeText:string = 'Custom';
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range',
  };

  @ViewChild('popover') popover;

  today: number = Date.now();
  d = Number(new Date().getDate());
  year= Number(new Date().getFullYear());
  month:any;
  months: any = [
    {
      name: 'Jan',
      value: '01',
    },
    {
      name: 'Feb',
      value: '02',
    },
    {
      name: 'Mar',
      value: '03',
    },
    {
      name: 'Apr',
      value: '04',
    },
    {
      name: 'May',
      value: '05',
    },
    {
      name: 'Jun',
      value: '06',
    },
    {
      name: 'Jul',
      value: '07',
    },
    {
      name: 'Aug',
      value: '08',
    },
    {
      name: 'Sep',
      value: '09',
    },
    {
      name: 'Oct',
      value: '10',
    },
    {
      name: 'Nov',
      value: '11',
    },
    {
      name: 'Dec',
      value: '12',
    }
  ];
  
  

  slideOpts = {
    // initialSlide: 1,
    slidesPerView: 3,
    speed: 400
  };


  slideOptsCal = {
    initialSlide: this.d - 1,
    slidesPerView: 7,
    centeredSlides: true,
    speed: 400,
    loop: true
  };

  calendar_data:any = [];
  today_leads:any = [];


  @ViewChild("chart") chart: ChartComponent;
  @ViewChild('mySlider') slider: IonSlides;
  @ViewChild('calSlider') calSlider: IonSlides;
  public chartOptions: Partial<ChartOptions>;

  dashboard_res:any = [];
  search_items:any = [];
  chart_listing_count:any;
  chart_lead_count:any;

  getScreenWidth: any;
  boxWidth:any = 165;
  boxHeight:any = 250;
  

  isChartDataReceived:boolean = false;
  isDateRangeModalOpen:boolean = false;

  constructor(private common: CommonService, public auth:AuthenticationService, private router: Router, public datepipe: DatePipe) {

    

    this.chartOptions = {
      series: [
        {
          name: "Listings",
          data: []
        },
        {
          name: "Leads",
          data: []
        }
      ],
      chart: {
        height: 230,
        type: "bar",
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false,
          tools: {
            download: false
          }
        }
      },
      fill: {
        colors: ['#453ee1', '#3abfba']
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "30%",
          
          borderRadius: 4
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: false  //or just here to disable only x axis grids
           }
         },
         yaxis: {
          lines: { 
            show: true  //or just here to disable only y axis
           }
         }, 
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      title: {
        text: ""
      },
      xaxis: {
        categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep"],
        
      },
      yaxis: {
        show: false,
        labels: {
          show: false
        },
        axisTicks: {
          show: false
        }
      }
      
    };

    this.common.dashboard_data().subscribe({
      next: data => {
        this.dashboard_res = data;
        this.calendar_data = data.calendar_days;
        this.today_leads = data.today_leads;
        this.month = data.current_month;
      },
      error: err => {
        
      }
    });
    
  }

  @ViewChild("insideElement") insideElement;
  @HostListener('document:click', ['$event.target'])
  // @HostListener('window:resize', ['$event'])

  public onClick(targetElement) {
    const clickedInside = this.insideElement?this.insideElement.nativeElement.contains(targetElement):'';
    if (!clickedInside) {
      this.search_items = [];
    }
  }
  onResize($event) {
    this.getScreenWidth = window.innerWidth;
    let normalStyleWidth = 1366;
    let mainWidth = 165;

    console.log(this.getScreenWidth);

    if(this.getScreenWidth === normalStyleWidth) {
      this.boxWidth = 165;
    }else if(this.getScreenWidth < normalStyleWidth) {
      let diff = normalStyleWidth - this.getScreenWidth;
      if(diff > 50) {
        this.boxWidth = mainWidth - ((diff/100) * 5);
      }
    }else if(this.getScreenWidth > normalStyleWidth) {
      let diff = this.getScreenWidth - normalStyleWidth;
      if(diff > 50 && diff < 200) {
        this.boxWidth = mainWidth  + ((diff/100) * 5);
      }
      if(diff > 200 && diff < 400) {
        this.boxWidth = mainWidth  + ((diff/100) * 6);
      }
      if(diff > 400 && diff < 700) {
        this.boxWidth = mainWidth  + ((diff/100) * 10);
        this.boxHeight = 320;
      }
      if(diff > 700) {
        this.boxWidth = mainWidth  + ((diff/100) * 15);
        this.boxHeight = 400;
      }
    }
  }

  ngOnInit() {
    this.onResize('');
    this.searchChart();

  }

  handleChange(event) {
    const query = event.target.value.toLowerCase();
    this.common.dashboard_search(query).subscribe({
      next: data => {
        this.search_items = data;
      },
      error: err => {
        
      }
    });
  }

  showLeads(date, index) {
    this.calSlider.getActiveIndex().then(ind => {
      this.calSlider.slideTo(index+7);
    });
    this.common.lead_data_by_date(date).subscribe({
      next: data => {
        
        this.today_leads = data.today_leads;
      },
      error: err => {
        
      }
    });
  }
  
  redirectTo(id, type) {
    if(type == 'Listings') {
      this.router.navigate(['/app/listings/view/'+id]);
    }else {
      this.router.navigate(['/app/leads/view/'+id]);
    }
    
  }

  changeDuration(event) {
    let val = event.target.value;
    if(val === 'custom') {
      this.isDateRangeModalOpen = false;
      this.isDateRangeModalOpen = true;
    }else {
      this.dateRangeText = 'Custom';
      this.common.dashboard_search_chart(val).subscribe({
        next: res => {
          this.chartOptions.series = res.series;
          this.chartOptions.xaxis = res.labels;
          this.chart_listing_count = res.listings_count;
          this.chart_lead_count = res.leads_count;
        },
        error: err => {
          
        }
      });
    }
    
  }

  searchChart() {
    let val = '7d';
    this.common.dashboard_search_chart(val).subscribe({
      next: res => {
        this.isChartDataReceived = true;
        this.chartOptions.series = res.series;
        this.chartOptions.xaxis = res.labels;
        this.chart_listing_count = res.listings_count;
        this.chart_lead_count = res.leads_count;
      },
      error: err => {
        
      }
    });
  }

  changeMonth(event) {
    let val = event.target.value;
    this.common.dashboard_search_calendar_data(val).subscribe({
      next: res => {
        this.calendar_data = res.calendar_days;
      },
      error: err => {
        
      }
    });
  }


  slidePrev() {
    this.calSlider.slidePrev();
  }
  slideNext() {
    this.calSlider.slideNext();
  }

  onChange(event) {

    const from = this.datepipe.transform(event.from, 'yyyy/MM/dd');
    const to = this.datepipe.transform(event.to, 'yyyy/MM/dd');
    this.date = from+'-'+to;
    this.dateRange.from = from;
    this.dateRange.to = to;
    
  }

  updateDate() {
    this.popover.dismiss();
    this.isDateRangeModalOpen = false;
    let val = this.date;
    this.common.dashboard_search_chart(val).subscribe({
      next: res => {
        this.chartOptions.series = res.series;
        this.chartOptions.xaxis = res.labels;
        this.chart_listing_count = res.listings_count;
        this.chart_lead_count = res.leads_count;
      },
      error: err => {
        
      }
    });

  }

  


}
