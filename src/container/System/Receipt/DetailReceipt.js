import React from 'react';
import { useEffect, useState } from 'react';
import { getAllProductAdmin, getDetailReceiptByIdService, createNewReceiptDetailService } from '../../../services/userService';

import { toast } from 'react-toastify';
import { Link, useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import CommonUtils from '../../../utils/CommonUtils';
import moment from 'moment';
const DetailReceipt = (props) => {
    const { id } = useParams();
    const [dataProduct, setdataProduct] = useState([])
    const [dataProductDetail, setdataProductDetail] = useState([])
    const [dataProductDetailSize, setdataProductDetailSize] = useState([])
    const [productDetailSizeId, setproductDetailSizeId] = useState('')
    const [dataReceiptDetail, setdataReceiptDetail] = useState({})
    const [inputValues, setInputValues] = useState({
        quantity: '', price: '', productId: ''
    });
    if (dataProduct && dataProduct.length > 0 && inputValues.productId === '') {
        setInputValues({ ...inputValues, ["productId"]: dataProduct[0].id, })
        setproductDetailSizeId(dataProduct[0].productDetail[0].productDetailSize[0].id)
        setdataProductDetail(dataProduct[0].productDetail)
        setdataProductDetailSize(dataProduct[0].productDetail[0].productDetailSize)

    }
    useEffect(() => {

        loadProduct()
        loadReceiptDetail(id)

    }, [])
    let loadReceiptDetail = async (id) => {
        let res = await getDetailReceiptByIdService(id)
        if (res && res.errCode == 0) {
            setdataReceiptDetail(res.data.receiptDetail)
        }
    }
    let loadProduct = async () => {
        let arrData = await getAllProductAdmin({

            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            limit: '',
            offset: '',
            keyword: ''

        })
        if (arrData && arrData.errCode === 0) {
            setdataProduct(arrData.data)

        }
    }
    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });

    };
    const handleOnChangeProduct = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value })
        for (let i = 0; i < dataProduct.length; i++) {
            if (dataProduct[i].id == value) {

                setdataProductDetail(dataProduct[i].productDetail)
                setdataProductDetailSize(dataProduct[i].productDetail[0].productDetailSize)
                setproductDetailSizeId(dataProduct[i].productDetail[0].productDetailSize[0].id)
            }
        }

    };
    let handleOnChangeProductDetail = event => {
        const { name, value } = event.target;
        for (let i = 0; i < dataProductDetail.length; i++) {
            if (dataProductDetail[i].id == value) {

                setdataProductDetailSize(dataProductDetail[i].productDetailSize)
                setproductDetailSizeId(dataProductDetail[i].productDetailSize[0].id)
            }
        }
    }
    let handleSaveReceiptDetail = async () => {

        let res = await createNewReceiptDetailService({
            receiptId: id,
            productDetailSizeId: productDetailSizeId,
            quantity: inputValues.quantity,
            price: inputValues.price
        })
        if (res && res.errCode === 0) {
            toast.success("Successfully added item detail to inventory")
            setInputValues({
                ...inputValues,

                ["quantity"]: '',
                ["price"]: ''
            })
            loadReceiptDetail(id)
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage)
        }
        else toast.error("Failed to add inventory")

    }


    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Manage inventory details</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Add new inventory detail
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Product</label>
                                <select value={inputValues.productId} name="productId" onChange={(event) => handleOnChangeProduct(event)} id="inputState" className="form-control">
                                    {dataProduct && dataProduct.length > 0 &&
                                        dataProduct.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Product type</label>
                                <select onChange={(event) => handleOnChangeProductDetail(event)} id="inputState" className="form-control">
                                    {dataProductDetail && dataProductDetail.length > 0 &&
                                        dataProductDetail.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.nameDetail}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Product size</label>
                                <select value={productDetailSizeId} name="productDetailSizeId" onChange={(event) => setproductDetailSizeId(event.target.value)} id="inputState" className="form-control">
                                    {dataProductDetailSize && dataProductDetailSize.length > 0 &&
                                        dataProductDetailSize.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.sizeId}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Quantity</label>
                                <input type="number" value={inputValues.quantity} name="quantity" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Unit price</label>
                                <input type="number" value={inputValues.price} name="price" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                        </div>

                        <button type="button" onClick={() => handleSaveReceiptDetail()} className="btn btn-primary">Save</button>
                    </form>
                </div>
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    List of inventory detail
                </div>
                <div className="card-body">

                    <div className='row'>

                        <div className='col-12'>
                            {/* <button  style={{float:'right'}} onClick={() => handleOnClickExport()} className="btn btn-success mb-2" >Xuất excel <i class="fa-solid fa-file-excel"></i></button> */}
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Order code</th>
                                    <th>Product name</th>
                                    <th>Quantity</th>
                                    <th>Unit price</th>

                                </tr>
                            </thead>

                            <tbody>
                                {dataReceiptDetail && dataReceiptDetail.length > 0 &&
                                    dataReceiptDetail.map((item, index) => {
                                        let name = `${item.productData.name} - ${item.productDetailData.nameDetail} - ${item.productDetailSizeData.sizeData.value}`
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.receiptId}</td>
                                                <td>{name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{CommonUtils.formatter.format(item.price)}</td>

                                            </tr>
                                        )
                                    })
                                }


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default DetailReceipt;