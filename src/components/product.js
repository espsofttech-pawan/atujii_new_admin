import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from  'axios'
import config from '../config/config'
import Cookies from 'js-cookie';
export default class product extends Component {

    constructor(props) {
        super(props)
       this.state = {
           item_name : '',
           description : '',
           image : '',
           owner : '',
           item_category_id : '',
           type: '',
           price : '',
           item_list : [],
           category_list:[],
           image_file: null,
           image_preview: '',
           updateform: '',
           update_id:''
       }
       this.editDataAPI = this.editDataAPI.bind(this);
       this.deleteItem = this.deleteItem.bind(this);
       this.loginData = (!Cookies.get('loginSuccess'))? [] : JSON.parse(Cookies.get('loginSuccess'));
      
    }
    componentDidMount() {
        if(!Cookies.get('loginSuccess')){
            window.location.href = `${config.baseUrl}`
            return false;
         }
        this.categoryList();
        this.getItemAPI();
    
    }

    async getItemAPI() {
        axios.get(`${config.apiUrl}/getitem`, {}, )
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        item_list: response.data.response
                    })
                }
                else if (response.data.success === false) {

                }
            })
            .catch(err => {
            })
    }
    
    async categoryList() {
        await axios.get(`${config.apiUrl}/getcategory`, {}, )
            .then(result => {
                console.log(result.data);
                if (result.data.success === true) {
                    this.setState({
                        category_list: result.data.response
                    })
                }

                else if (result.data.success === false) {

                }
            })
            .catch(err => {

            })
        }
 
    handleChange = event => {
        event.persist();
        let value = event.target.value;
        this.setState(prevState => ({
            item_list: { ...prevState.item_list, [event.target.name]: value }
        }))
    };

    handleChange1 = e =>{
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleImagePreview = (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];
        let file_type = '';
        if (image_as_files.type.indexOf('image') === 0) {
            file_type = 'image';
        } else {
            file_type = 'video';
        }

        this.setState({
            image_preview: image_as_base64,
            image_file: image_as_files,
            file_type: file_type,
        })
    }

  handleSubmit = async (event) =>{
   event.preventDefault();

   if(this.state.item_name==''){
    toast.error('Item name Required', {
        position: toast.POSITION.TOP_CENTER
        });
    } 
    else if(this.state.description==''){
        toast.error('Item Description Required', {
            position: toast.POSITION.TOP_CENTER
            });
    }
    else if(!this.state.image_file){
        toast.error('Item Image Required', {
            position: toast.POSITION.TOP_CENTER
            });
    }
    else if(this.state.owner==''){
        toast.error('Owner Name Required', {
            position: toast.POSITION.TOP_CENTER
            });
    }
    else if(!this.state.item_category_id){
        toast.error('Please Select Category', {
            position: toast.POSITION.TOP_CENTER
            });
    }
    else if(!this.state.type){
        toast.error('Please Select Type', {
            position: toast.POSITION.TOP_CENTER
            });
    }    
    else if(this.state.price==''){
        toast.error('Item price Required', {
            position: toast.POSITION.TOP_CENTER
            });
    }else{
    let formData = new FormData();

    let formData1 = new FormData();

    formData1.append('file', this.state.image_file);
    formData.append('name', this.state.item_name);
    formData.append('type', this.state.type);
    formData.append('description', this.state.description);
    if(this.state.image_file === null){
        formData.append('avatar', this.state.item_list.avatar);
    }
    else{
        formData.append('avatar', this.state.image_file);
    }    
    formData.append('owner', this.state.owner);
    formData.append('item_category_id', this.state.item_category_id);
    formData.append('price', this.state.price);

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      var resIPF =  await axios.post(url,
        formData1,
        {
            headers: {
                'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
                'pinata_api_key': 'e10dd09a651a1450d32e',
                'pinata_secret_api_key': '292a2ff0c5e3ddeea1f3d80444624b9302137401debc9aabdc630d7d990438fc'
            }
        }
    );

    console.log('ipfshahs',resIPF.data.IpfsHash);
    formData.append('image', resIPF.data.IpfsHash);
    axios.post(`${config.apiUrl}/insertitem`,formData)
        .then(result=>{
    
    if(result.data.success === true ){
        toast.success(result.data.msg, {
            position: toast.POSITION.TOP_CENTER
        },
         setTimeout(() => {
           window.location.reload();
        }, 2000)
        );
          this.state = {
            item_name : '',
            description : '',
            image : '',
            owner : '',
            item_category_id : '',  
            price : '',
            type : ''
          }
          this.getItemAPI();
           
     }
    }).catch(err=>{
    
    toast.error(err.response.data?.msg, {
        position: toast.POSITION.TOP_CENTER, autoClose:1500
    
    }, setTimeout(() => {
            
    }, 500));
 
    })
}
}

editDataAPI(id){
    this.setState({ 
     item_name : id.name,
     description : id.description,
     item_category_id : id.item_category_id,
     price : id.price,
     update_id:id.id,
     type : id.type,
     updateform : "123"     
   }); 
 
}


async updateDataAPI() {
    if (this.state.item_name == '') {
        toast.error('Item name Required', {
            position: toast.POSITION.TOP_CENTER
        });
    }
    else if (this.state.description == '') {
        toast.error('Item Description Required', {
            position: toast.POSITION.TOP_CENTER
        });
    }
    else if (!this.state.item_category_id) {
        toast.error('Please Select Category', {
            position: toast.POSITION.TOP_CENTER
        });
    }
    else if (this.state.price == '') {
        toast.error('Item price Required', {
            position: toast.POSITION.TOP_CENTER
        });
    }    else if (this.state.type == '') {
        toast.error('Type Required', {
            position: toast.POSITION.TOP_CENTER
        });
    } else {
        let formData = new FormData();
        formData.append('id', this.state.update_id)
        formData.append('name', this.state.item_name);
        formData.append('description', this.state.description);
        formData.append('item_category_id', this.state.item_category_id);
        formData.append('price', this.state.price);
        axios.post(`${config.apiUrl}/updateitem`, formData)
            .then(result => {

                if (result.data.success === true) {
                    toast.success(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    }, setTimeout(() => {
                        window.location.reload();
                    }, 500));
                    this.state = {
                        item_name: '',
                        description: '',
                        image: '',
                        owner: '',
                        item_category_id: '',
                        price: '',
                        type: ''
                    }
                    this.getItemAPI();

                }
            }).catch(err => {

                toast.error(err.response.data?.msg, {
                    position: toast.POSITION.TOP_CENTER, autoClose: 1500

                }, setTimeout(() => {

                }, 500));

            })
    }
}

async deleteItem(id) {

    await axios.post(`${config.apiUrl}/deleteitem`,
     {id :  id.id} )
            .then(result => {

                if (result.data.success === true) {
                    toast.success(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                        });
                    this.getItemAPI();
                   
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
            <ToastContainer/>
            {/* <!--/Preloader--> */}
            <div className="wrapper theme-6-active pimary-color-green">
                <Header />
                <Leftsidebar />
                <button id="setting_panel_btn" className="btn btn-success btn-circle setting-panel-btn shadow-2dp"><i className="zmdi zmdi-settings"></i></button>
                <div className="right-sidebar-backdrop"></div>
                <div className="page-wrapper">
                    <div className="container-fluid">
                        <div className="row heading-bg">
                            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                <h5 className="txt-dark">add-products</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="panel panel-default card-view">
                                    <div className="panel-wrapper collapse in">
                                        <div className="panel-body">
                              
                                            <button type='button'    data-toggle="modal" data-target="#responsive-modal1" className="btn btn-primary">Add Product </button>
               
                                            <div className="form-wrap">
                                            <div class="table-responsive">
                                            <table class="table table-striped mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th>S.no.</th>
                                                                    <th>Name</th>
                                                                    <th>Description</th>
                                                                    <th>Image</th>
                                                                    <th>owner</th>
                                                                    <th>Category Name</th>
                                                                    <th>token_id</th>
                                                                    <th>price</th>
                                                                    <th>Action</th>
                                                                    <th>TRX Hash</th>

                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {this.state.item_list.map((item, i) => (
                                                                    <tr>

                                                                        <td>{i + 1}</td>
                                                                        <td>{item.name}</td>
                                                                        <td>{item.description}</td>
                                                                        <td ><img src={`${config.ipfsUrl}${item.image}`} className="product-img" /></td>
                                                                        <td>{item.owner}</td>
                                                                        <td style={{ textAlign: "center" }}>{item.category_name}</td>
                                                                        <td>{item.token_id}</td>
                                                                        <td>{item.price}</td>
                                                                        
                                                                            <td class="text-nowrap">
                                                                                <button type="submit" onClick={this.editDataAPI.bind(this, item)} data-toggle="modal" data-target="#responsive-modal" className="btn-primary" data-original-title="Edit"> <i class="fa fa-pencil text-inverse m-r-10"></i> </button>
                                                                           </td>

                                                                            <td>
                                                                                <a href={`${config.trxHash}${item.token_hash}`} target="_blank">{item.token_hash.substring(0, 4) + '...' + item.token_hash.substr(item.token_hash.length - 4)}
                                                                                    <i className="fa fa-external-link"></i>
                                                                                </a>
                                                                            </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
												
												</div>
                                       
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
  
                        <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{display: "none"}}>
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className="form-wrap">
                                            <form action="#">
                                                <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>Add Product</h6>
                                                <hr className="light-grey-hr" />
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label mb-10">Item Name</label>
                                                            <input type="text" onChange={this.handleChange1} name="item_name" className="form-control" placeholder="Item Name"  value={this.state.item_name} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label mb-10">Description</label>
                                                            <input type="text" onChange={this.handleChange1} name="description" className="form-control" placeholder="Description"  value={this.state.description} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label mb-10">Image</label>
                                                            <input type="file" accept=".jpg,.jpeg,.png" onChange={this.handleImagePreview}  className="form-control" placeholder="Image File"   />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label mb-10">Owner</label>
                                                            <input type="text" onChange={this.handleChange1} name="owner" className="form-control" placeholder="Owner Name"  value={this.state.owner} />
                                                        </div>
                                                    </div> 
                                                    <div className="col-md-6">
                                                                            
                                                        <div className="form-group">
                                                            <label for="countryOrigin">Select Category</label>
                                                            <div className="customSelectHolder">
                                                            
                                                            <select name="item_category_id" onChange={this.handleChange1} value={this.state.item_category_id} class="form-control  basic">
                                                            <option selected="selected" value="">Select Category</option>
                                                            {this.state.category_list.map(item=>(
                                                            <option value={item.id}>{item.name}</option>
                                                                ))}
                                                                    </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label mb-10">Price</label>
                                                            <input type="text" onChange={this.handleChange1} name="price" className="form-control" placeholder="Price"  value={this.state.price} />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                                            
                                                        <div className="form-group">
                                                            <label for="countryOrigin">Product Type</label>
                                                            <div className="customSelectHolder">
                                                            
                                                            <select name="type" onChange={this.handleChange1} value={this.state.type} class="form-control  basic">
                                                            <option selected="selected" value="">Select Type</option>
                                                                <option value="1">Store</option>
                                                                <option value="2">Limited Edition </option>
                                                            </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="form-actions">
                                                    <div className="clearfix"></div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div class="modal-footer pt-0">
                                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                        {(this.state.updateform)?
                                            <button type='button' onClick={this.updateDataAPI.bind(this)} className="btn btn-success btn-icon left-icon mr-10 pull-left">Update</button>
                                            :
                                            <button type='submit'  onClick={this.handleSubmit}   data-dismiss="modal" className="btn btn-primary">Add </button>
                                            }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="responsive-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{display: "none"}}>
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className="form-wrap">
                                            <form action="#">
                                                <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>Edit Product</h6>
                                                <hr className="light-grey-hr" />
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label mb-10">Item Name</label>
                                                            <input type="text" onChange={this.handleChange1} name="item_name" className="form-control" placeholder="Item Name"  value={this.state.item_name} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label mb-10">Description</label>
                                                            <input type="text" onChange={this.handleChange1} name="description" className="form-control" placeholder="Description"  value={this.state.description} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                                            
                                                        <div className="form-group">
                                                            <label for="countryOrigin">Select Category</label>
                                                            <div className="customSelectHolder">
                                                            
                                                            <select name="item_category_id" onChange={this.handleChange1} value={this.state.item_category_id} class="form-control  basic">
                                                            <option selected="selected" value="">Select Category</option>
                                                            {this.state.category_list.map(item=>(
                                                            <option value={item.id}>{item.name}</option>
                                                                ))}
                                                                    </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label mb-10">Price</label>
                                                            <input type="text" onChange={this.handleChange1} name="price" className="form-control" placeholder="Price"  value={this.state.price} />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                                            
                                                        <div className="form-group">
                                                            <label for="countryOrigin">Product Type</label>
                                                            <div className="customSelectHolder">
                                                            
                                                            <select name="type" onChange={this.handleChange1} value={this.state.type} class="form-control  basic">
                                                            <option value="">Select Type</option>
                                                                <option value="1">Store</option>
                                                                <option value="2">Limited Edition </option>
                                                            </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="form-actions">
                                                    <div className="clearfix"></div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div class="modal-footer pt-0">
                                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                        {(this.state.updateform)?
                                            <button type='button' onClick={this.updateDataAPI.bind(this)} className="btn btn-success btn-icon left-icon mr-10 pull-left">Update</button>
                                            :
                                            <button type='submit'  onClick={this.handleSubmit}   data-dismiss="modal" className="btn btn-primary">Add </button>
                                            }
                                    </div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                    <Footer/>
                </div>
            </div>
        </>
        )

    }
}