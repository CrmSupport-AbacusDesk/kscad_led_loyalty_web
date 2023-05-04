import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../_services/DatabaseService';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    
    loading_list = false;
    balance_coupon_value:any;
    karigars:any;
    totalNetwork:any;
    user_karigar:any;
    user_Retailer:any;
    user_Distributor:any;
    unread_counts:any;
    offer:any;
    total_coupon_value:any;
    coupon_value_scan_by_Retailer:any;
    coupon_value_scan_by_karigar:any;
    offer_karigar:any;
    offer_Retailer:any;
    pending_redeem_request:any;
    pending_redeem_request_karigar:any;
    pending_redeem_request_retailer:any;
    offer_gift:any;
    products:any;
    super_karigars:any=[];
    super_dealers:any=[];
    offer_balance_days:any=[];
    state_wise_karigars:any=[];
    dataSource : any = [];
    dataSource1:any=[];
    scan_coupon_count:any=[];
    coupon_count:any=[];
    data_Source:any;
    karigar_Source:any;
    dealer_Source:any;
    distributor_Source:any;
    karigar_state_wise:any=[];
    dealer_state_wise:any=[];
    distributor_state_wise:any=[];
    stateWiseKarigar:any=[];
    stateWiseDealer:any=[];
    stateWiseDistributor:any=[];
    offer_Architect: any;
    pending_redeem_request_Architect: any;
    user_Architect: any;
    karigar_Source2: {
        chart: {
            xAxisName: string; yAxisName: string;
            // "numberSuffix": "k",
            theme: string;
        }; data: any;
    };
    dealer_Source2: {
        chart: {
            xAxisName: string; yAxisName: string;
            // "numberSuffix": "k",
            theme: string;
        }; data: any;
    };
    architect_state_wise: any;
    architect_Source: {
        chart: {
            xAxisName: string; yAxisName: string;
            // "numberSuffix": "k",
            theme: string;
        }; data: any;
    };
    architect_state_wise2: any;
    
    constructor(public db: DatabaseService, private router:Router) 
    {
        this.get_counts();
        this.get_super_karigars('1');
        // this.get_super_dealers();
        this.get_offer_balance_days();
        // this.state_wise_karigar('1');
        this.getstatewisekarigar('1');

        // this.state_wise_dealer();
        this.state_wise_distributor();
        this.coupon_code_graph();
        this.get_scan_coupon_data();
        this.scan_electrician_count();
        this.scan_dealer_count();
    }
    
    ngOnInit() 
    {
        
    }
    
    get_counts() 
    {
        this.loading_list = true;
        
        this.db.post_rqst({ }, 'master/getDashboardcounts').subscribe(resp => 
            {
                this.loading_list = false;
                console.log(resp);
                this.balance_coupon_value = resp.balance_coupon_value;
                this.karigars = resp.karigars;
                this.offer_karigar=resp.offer_karigar;
                this.offer_Retailer=resp.offer_Dealer;
                this.offer_Architect=resp.offer_Architect;

                this.offer = resp.offer;
                this.total_coupon_value=resp.total_coupon_value;
                this.coupon_value_scan_by_Retailer=resp.coupon_value_scan_by_Retailer;
                this.coupon_value_scan_by_karigar=resp.coupon_value_scan_by_karigar;
                this.pending_redeem_request_karigar=resp.pending_redeem_request_karigar;
                this.pending_redeem_request_retailer=resp.pending_redeem_request_Dealer;
                this.pending_redeem_request_Architect=resp.pending_redeem_request_Architect;

                this.offer_gift = resp.offer_gift;
                this.pending_redeem_request = resp.pending_redeem_request;
                this.products = resp.products;
                this.totalNetwork=resp.user;
                this.user_karigar=resp.user_karigar;
                this.user_Retailer=resp.user_Dealer;
                this.user_Architect=resp.user_Architect;

                this.user_Distributor=resp.user_Distributor;
                this.unread_counts=resp.unread;
            });
        }
        
       
        
        get_offer_balance_days()
        {
            this.loading_list = true;
            this.db.post_rqst({ }, 'master/getOfferBalanceDays')
            .subscribe((resp) => 
            {
                this.loading_list = false;
                console.log(resp);
                this.offer_balance_days = resp.offer_balance_days;
            });
        }
        
      

        state_wise_distributor(){

            this.db.post_rqst({},'master/stateWiseKarigar')
            .subscribe((resp)=>
            {
                console.log(resp);
                this.stateWiseDistributor=resp.state_wise_Distributor;
                
                for (let i=0;i < this.stateWiseDistributor.length; i++)
                {
                    this.distributor_state_wise.push({"label": this.stateWiseDistributor[i].state,"value": this.stateWiseDistributor[i].total_distributor});
                }
                console.log(this.distributor_state_wise);
                
                this.distributor_Source = {
                    "chart": {
                        "xAxisName": "States",
                        "yAxisName": "Distributors",
                        // "numberSuffix": "k",
                        "theme": "fusion",
                    },
                    "data": this.distributor_state_wise            
                };
            })

        }

        showDealersList=false;
        showKarigarList=true;
        show_karigar_graph=true;
        show_dealer_graph=false;
        showArchitectList=false;
        getsuparkarigar(type){
            if(type==1){
                this.showKarigarList=true;
                this.showDealersList=false;
                this.showArchitectList=false;
               
                this.get_super_karigars(1);
            }
            else if(type==2){
                this.showKarigarList=false;
                this.showDealersList=true;
                this.showArchitectList=false;
                this.get_super_karigars(2);
            }
            else if(type==3){
                this.showKarigarList=false;
                this.showDealersList=false;
                this.showArchitectList=true;
                this.get_super_karigars(3);
            }
        }
        
        get_super_karigars(type)
        {
            this.loading_list = true;
            
            this.db.post_rqst({'user_type':type}, 'master/getSuperkarigars')
            .subscribe((resp) => 
            {
                this.loading_list = false;
                console.log(resp);
                this.super_karigars = resp.super_karigars;
            });
        }



        showKarigarGraph(){
            this.show_karigar_graph=true;
            this.show_dealer_graph=false;
        }
        showDealerGraph(){
            this.show_karigar_graph=false;
            this.show_dealer_graph=true;
        }
        


        scan_coupon_karigar:any=[];
        scan_coupon_karigar_data:any=[];
        scan_electrician_count()
        {
            this.db.post_rqst({},'master/scanCoupondata')
            .subscribe((resp)=>
            {
                console.log(resp);
                this.scan_coupon_karigar=resp.scan_coupon_karigar_count;
                
                for (let i=0;i < this.scan_coupon_karigar.length; i++)
                {
                    this.scan_coupon_karigar_data.push({"label": this.scan_coupon_karigar[i].scan_day,"value": this.scan_coupon_karigar[i].scan_coupon_karigar_count});
                }
                console.log(this.karigar_state_wise);
                
                this.karigar_Source2 = {
                    "chart": {
                        "xAxisName": "Scan Day",
                        "yAxisName": "Count",
                        // "numberSuffix": "k",
                        "theme": "fusion",
                    },
                    "data": this.scan_coupon_karigar_data            
                };
            })
        }

        scan_coupon_Retailer:any=[];
        scan_coupon_Retailer_count:any=[];

        scan_dealer_count(){
            this.db.post_rqst({},'master/scanCoupondata')
            .subscribe((resp)=>
            {
                console.log(resp);
                this.scan_coupon_Retailer=resp.scan_coupon_Retailer_count;
                
                for (let i=0;i < this.scan_coupon_Retailer.length; i++)
                {
                    this.scan_coupon_Retailer_count.push({"label": this.scan_coupon_Retailer[i].scan_day,"value": this.scan_coupon_Retailer[i].scan_coupon_Retailer_count});
                }
                console.log(this.dealer_state_wise);
                
                this.dealer_Source2 = {
                    "chart": {
                        "xAxisName": "Scan Days",
                        "yAxisName": "Count",
                        // "numberSuffix": "k",
                        "theme": "fusion",
                    },
                    "data": this.scan_coupon_Retailer_count            
                };
            })
        }
























        showKarigarList2=true;
        showArchitectList2=false;
        showDealerList2=false;
        getstatewisekarigar(type){
            if(type==1){
                this.showKarigarList2=true;
                this.showArchitectList2=false;
                this.showDealerList2=false;
                this.state_wise_karigar(1);
            }
            else if(type==2){
                this.showKarigarList2=false;
                this.showArchitectList2=false;
                this.showDealerList2=true;
                this.state_wise_dealer(2);
            }
            else if(type==3){
                this.showKarigarList2=false;
                this.showArchitectList2=true;
                this.showDealerList2=false;
                this.state_wise_architect(3);
            }
        }




        state_wise_karigar(type)
        {
            this.db.post_rqst({'user_type':type},'master/stateWiseKarigar')
            .subscribe((resp)=>
            {
                console.log(resp);
                this.stateWiseKarigar=resp.state_wise_karigars;
                
                for (let i=0;i < this.stateWiseKarigar.length; i++)
                {
                    this.karigar_state_wise.push({"label": this.stateWiseKarigar[i].state,"value": this.stateWiseKarigar[i].total_karigars});
                }
                console.log(this.karigar_state_wise);
                
                this.karigar_Source = {
                    "chart": {
                        "xAxisName": "States",
                        "yAxisName": "Electrician",
                        // "numberSuffix": "k",
                        "theme": "fusion",
                    },
                    "data": this.karigar_state_wise            
                };
            })
        }

        state_wise_dealer(type){
            this.db.post_rqst({'user_type':type},'master/stateWiseKarigar')
            .subscribe((resp)=>
            {
                console.log(resp);
                this.stateWiseDealer=resp.state_wise_Dealer;
                
                for (let i=0;i < this.stateWiseDealer.length; i++)
                {
                    this.dealer_state_wise.push({"label": this.stateWiseDealer[i].state,"value": this.stateWiseDealer[i].total_Dealer});
                }
                console.log(this.dealer_state_wise);
                
                this.dealer_Source = {
                    "chart": {
                        "xAxisName": "States",
                        "yAxisName": "Dealer",
                        // "numberSuffix": "k",
                        "theme": "fusion",
                    },
                    "data": this.dealer_state_wise            
                };
            })
        }

        stateWiseArchitect:any=[];
        state_wise_architect(type){
            this.db.post_rqst({'user_type':type},'master/stateWiseKarigar')
            .subscribe((resp)=>
            {
                console.log(resp);
                this.stateWiseArchitect=resp.state_wise_Architect;
                
                for (let i=0;i < this.stateWiseArchitect.length; i++)
                {
                    this.architect_state_wise2.push({"label": this.stateWiseArchitect[i].state,"value": this.stateWiseArchitect[i].total_Architect});
                }
                console.log(this.architect_state_wise);
                
                this.architect_Source = {
                    "chart": {
                        "xAxisName": "States",
                        "yAxisName": "Architect",
                        // "numberSuffix": "k",
                        "theme": "fusion",
                    },
                    "data": this.architect_state_wise2            
                };
            })
        }
        total_coupon_code_data : any = [];
        scanned_coupon_code_data : any = [];
        total_coupon:any=[];
        scanned_coupon:any=[];
        offer_name:any=[];
        
        
        coupon_code_graph()
        {
            this.db.post_rqst({},'master/get_coupon_code_graph_data')
            .subscribe((resp)=>
            {
                console.log(resp);
                this.total_coupon_code_data = resp.total_coupon;
                this.scanned_coupon_code_data = resp.scanned_coupon;
                
                for(var i=0; i<this.total_coupon_code_data.length; i++)
                {
                    this.total_coupon.push({"value":this.total_coupon_code_data[i]['total_coupon']});
                    
                    this.offer_name.push({"label":this.total_coupon_code_data[i]['title']});
                }
                
                for(var j=0; j<this.scanned_coupon_code_data.length; j++)
                {
                    this.scanned_coupon.push({"value":this.scanned_coupon_code_data[j]['scan_coupon']})
                }
                
                this.dataSource = {
                    chart: {
                        xaxisname: "Offer Name",
                        yaxisname: "Total Number of Coupons",
                        formatnumberscale: "1",
                        plottooltext:
                        "<b>$dataValue</b> apps were available on <b>$seriesName</b> in $label",
                        theme: "fusion",
                        drawcrossline: "1"
                    },
                    categories: [{category : this.offer_name}],
                    dataset:[{seriesname:"Total Coupons", data:this.total_coupon}, {seriesname:"Scanned Coupons", data:this.scanned_coupon}]
                };
            });
        }
        
        
        get_scan_coupon_data()
        {
            this.db.post_rqst({},'master/scanCoupondata')
            .subscribe((resp)=>
            {
                console.log(resp);
                this.scan_coupon_count = resp.scan_coupon_count;
                
                for (let i=0;i < this.scan_coupon_count.length; i++)
                {
                    this.coupon_count.push({"label": this.scan_coupon_count[i].scan_day,"value": this.scan_coupon_count[i].scan_coupon_count});
                }
                
                this.dataSource1 = {
                    "chart": {
                        "xAxisName": "Day's",
                        "yAxisName": "No. of Coupons",
                        "showValues": "0",
                        "theme": "fusion"
                    },
                    "annotations": {
                        "groups": [{
                            "id": "anchor-highlight",
                            "items": [{
                                "id": "high-star",
                                "type": "circle",
                                "x": "$dataset.0.set.2.x",
                                "y": "$dataset.0.set.2.y",
                                "radius": "12",
                                "color": "#6baa01",
                                "border": "2",
                                "borderColor": "#f8bd19"
                            }
                        ]
                    }]
                },
                "data": this.coupon_count
            }
        })  
    }
    
    
    
    goto_offerPage()
    {
        if(this.db.datauser.access_level!=8){
        this.router.navigate(["offer-list/active"]);
        }
    }
    
    goto_offergiftPage()
    {
        if(this.db.datauser.access_level!=8){
        this.router.navigate(['gift-list']);
        }
    }
    
    goto_pending_redeem_rqs_page()
    {
        if(this.db.datauser.access_level!=8){
        this.router.navigate(['redeem-request-list/pending']);
        }
    } 
    
    goto_balance_coupon_page()
    {
        if(this.db.datauser.access_level!=8){
        this.router.navigate(['coupon-code-list']);

        }
    }
    

    goto_karigarsPage(action)
    {
        // this.router.navigate(['karigar-list']);

        if(this.db.datauser.access_level!=8){
            if(action === 'karigar'){   
                this.router.navigate(['karigar-list/1'],{queryParams:{mode:action}});
            }else if(action === 'dealer'){
                this.router.navigate(['dealer-list/1'],{queryParams:{mode:action}});
            }

        }

       
    }
    // goto_karigarsPage()
    // {
    //     this.router.navigate(['karigar-list']);
    // }
    
    goto_productPage()
    {
        this.router.navigate(['products-list']);
    }
    goto_feedbackPage()
    {

        if(this.db.datauser.access_level!=8){
        this.router.navigate(['feedback-list']);
        }
    }
    
}
