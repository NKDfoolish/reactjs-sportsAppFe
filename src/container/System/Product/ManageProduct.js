import React from 'react';
import { useEffect, useState } from 'react';
import { getAllProductAdmin, handleBanProductService, handleActiveProductService } from '../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../utils/CommonUtils';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import FormSearch from '../../../component/Search/FormSearch';
const ManageProduct = () => {

    const [dataProduct, setdataProduct] = useState([])
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    const [keyword, setkeyword] = useState('')
    useEffect(() => {

        let fetchProduct = async () => {
            await loadProduct(keyword)
        }
        fetchProduct()
    }, [])
    let loadProduct = async (keyword) => {
        let arrData = await getAllProductAdmin({

            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            limit: PAGINATION.pagerow,
            offset: 0,
            keyword:keyword

        })
        if (arrData && arrData.errCode === 0) {
            setdataProduct(arrData.data)
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }
    let handleBanProduct = async (id) => {

        let data = await handleBanProductService({
            id: id
        })
        if (data && data.errCode === 0) {
            toast.success("Hided product successfully!")
            let arrData = await getAllProductAdmin({

                sortName: '',
                sortPrice: '',
                categoryId: 'ALL',
                brandId: 'ALL',
                keyword:'',
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow

            })
            if (arrData && arrData.errCode === 0) {
                setdataProduct(arrData.data)
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
            }
        } else {
            toast.error("Fail to hide product!")
        }
    }
    let handleActiveProduct = async (id) => {

        let data = await handleActiveProductService({
            id: id
        })
        if (data && data.errCode === 0) {
            toast.success("Product displayed successfully!")
            loadProduct('');
        } else {
            toast.error("Fail to display product!")
        }
    }
    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        let arrData = await getAllProductAdmin({
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            keyword:keyword
        })
        if (arrData && arrData.errCode === 0) {
            setdataProduct(arrData.data)

        }
    }
    let handleSearchProduct = (keyword) =>{
        loadProduct(keyword)
        setkeyword(keyword)
    }
    let handleOnchangeSearch = (keyword) =>{
        if(keyword === ''){
            loadProduct(keyword)
            setkeyword(keyword)
         }
        
    }
    let handleOnClickExport =async () =>{
        let res = await getAllProductAdmin({
            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            keyword:'',
            limit: '',
            offset: ''
        })
        if(res && res.errCode == 0){
            await CommonUtils.exportExcel(res.data,"List of product","ListProduct")
        }
       
    }
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Manage product</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    List of product

                </div>
             
                   
              
                <div className="card-body">
                  
                    <div className='row'>
                    <div  className='col-4'>
                    <FormSearch title={"product name"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchProduct} />                    </div>
                    <div className='col-8'>
                    <button  style={{float:'right'}} onClick={() => handleOnClickExport()} className="btn btn-success" >Xuất excel <i class="fa-solid fa-file-excel"></i></button>
                    </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Product name</th>
                                    <th>Categories</th>
                                    <th>Brand</th>
                                    <th>Material</th>
                                    <th>Made by</th>
                                    <th>Views</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataProduct && dataProduct.length > 0 &&
                                    dataProduct.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.categoryData.value}</td>
                                                <td>{item.brandData.value}</td>
                                                <td>{item.material}</td>
                                                <td>{item.madeby}</td>
                                                <td>{item.view ? item.view : 0}</td>
                                                <td>{item.statusData.value}</td>
                                                <td style={{ width: '12%' }}>
                                                    <Link to={`/admin/list-product-detail/${item.id}`}>View</Link>
                                                    &nbsp; &nbsp;
                                                    <Link to={`/admin/edit-product/${item.id}`}>Edit</Link>
                                                    &nbsp; &nbsp;
                                                    {item.statusData.code === 'S1' ?
                                                        <span onClick={() => handleBanProduct(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }} >Ban</span>
                                                        : <span onClick={() => handleActiveProduct(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }}   >Active</span>
                                                    }



                                                </td>
                                            </tr>
                                        )
                                    })
                                }




                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={count}
                marginPagesDisplayed={3}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakLinkClassName={"page-link"}
                breakClassName={"page-item"}
                activeClassName={"active"}
                onPageChange={handleChangePage}
            />
        </div>
    )
}
export default ManageProduct;