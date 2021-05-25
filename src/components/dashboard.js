import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from  'axios'
import config from '../config/config'
import Cookies from 'js-cookie';

export default class dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dashboard_list : ''
        }
    }

    componentDidMount() {
        if(!Cookies.get('loginSuccess')){
            window.location.href = `${config.baseUrl}`
            return false;
         }
        this.dashboardList();
    }

    async dashboardList() {
        await    axios.get(`${config.apiUrl}/dashboarditem`, {}, )
                .then(result => {
                    console.log(result.data);
                    if (result.data.success === true) {
                        this.setState({
                            dashboard_list: result.data.response
                        })
                    }
                    else if (result.data.success === false) {
    
                    }
                })
    
                .catch(err => {
                })
        }
   
    render() {

        return (          
            <>
                <div className="preloader-it">
                    <div className="la-anim-1"></div>
                </div>
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header/>
                    <Leftsidebar/>
                

                    <div className="right-sidebar-backdrop"></div>
                    <div className="page-wrapper">
                        <div className="container-fluid pt-25">
                            <div className="row">
                                <div className="col-lg-4 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid">
                                                        <div className="row">
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                           <span className="weight-500 uppercase-font block font-75  counter">{this.state.dashboard_list.user_count}</span>
                                                          
                                                                {/* <span className="txt-dark block counter"><span className="counter-anim"></span></span> */}
                                                       
                                                                <span className="weight-500 uppercase-font block font-13 ">Total User Count</span>
                                                        
                                                            </div>
                                                            {/* <div className="col-xs-6 text-center  pl-0 pr-0 data-wrap-right">
                                                                <i className="icon-user-following data-right-rep-icon txt-light-grey"></i>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                               
                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                            {/* <span className="weight-500 uppercase-font block font-75 ">{this.state.dashboard_list.category_count}</span> */}
                                                          
                                                                {/* <span className="txt-dark block counter"><span className="counter-anim">{this.state.dashboard_list.category_count}</span></span> */}
                                                        
                                                                <span className="weight-500 uppercase-font block font-100 counter">{this.state.dashboard_list.category_count}</span>
                                                        
                                                                <span className="weight-500 uppercase-font block font-13 ">Total category Count</span>
                                                        
                                                            </div>
                                                            {/* <div className="col-xs-6 text-center  pl-0 pr-0 data-wrap-right">
                                                                <i className="icon-user-following data-right-rep-icon txt-light-grey"></i>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                            {/* <span className="weight-500 uppercase-font block font-75 ">{this.state.dashboard_list.item_count}</span> */}
                                                          
                                                            <span className="weight-500 uppercase-font block font-100  counter">{this.state.dashboard_list.item_count}</span>
                                                        
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Item Count</span>
                                                        
                                                            </div>
                                                            {/* <div className="col-xs-6 text-center  pl-0 pr-0 data-wrap-right">
                                                                <i className="icon-user-following data-right-rep-icon txt-light-grey"></i>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            
                                
                                {/* <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                            <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.telent_count}</span>
                                                          
                                                            
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Talent Count</span>
                                                          
                                                            </div>
                                                
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div> 
                        </div>
                        <Footer/>
                    </div>
                 </div>
            </>
        )
    }
}