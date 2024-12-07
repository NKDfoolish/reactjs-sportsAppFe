import React from 'react';
import { useEffect, useState } from 'react';
import { createNewBannerService, getDetailBannerByIdService, updateBannerService } from '../../../services/userService';
import CommonUtils from '../../../utils/CommonUtils';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import './AddBanner.scss';
import moment from 'moment';
const AddBanner = (props) => {

    const { id } = useParams();

    const [inputValues, setInputValues] = useState({
        name: '', description: '', image: '', isActionADD: true, imageReview: '', isOpen: false,
    });
    useEffect(() => {
        if (id) {
            let fetchBanner = async () => {
                let res = await getDetailBannerByIdService(id)
                if (res && res.errCode === 0) {
                    setStateBanner(res.data)
                }
            }
            fetchBanner();
        }

    }, [])
    let setStateBanner = (data) => {
        setInputValues({
            ...inputValues,
            ["name"]: data.name,
            ["description"]: data.description,
            ["image"]: data.image,
            ["imageReview"]: data.image,
            ["isActionADD"]: false
        })

    }
    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });

    };
    let handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file.size > 31312281) {
            toast.error("File size less than 30MB")
        }
        else {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file)
            console.log(base64)
            setInputValues({ ...inputValues, ["image"]: base64, ["imageReview"]: objectUrl })

        }
    }
    let openPreviewImage = () => {
        if (!inputValues.imageReview) return;

        setInputValues({ ...inputValues, ["isOpen"]: true })
    }
    let handleSaveBanner = async () => {
        if (inputValues.isActionADD === true) {
            let res = await createNewBannerService({
                name: inputValues.name,
                description: inputValues.description,
                image: inputValues.image
            })
            if (res && res.errCode === 0) {
                toast.success("Banner created successfully!")
                setInputValues({
                    ...inputValues,
                    ["name"]: '',
                    ["image"]: '',
                    ["description"]: '',
                    ["imageReview"]: ''
                })
            } else {
                toast.error(res.errMessage)
            }
        } else {
            let res = await updateBannerService({
                name: inputValues.name,
                description: inputValues.description,
                image: inputValues.image,
                id: id
            })
            if (res && res.errCode === 0) {
                toast.success("Banner updated successfully!")
            } else {
                toast.error(res.errMessage)
            }
        }
    }
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Manage banner</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {inputValues.isActionADD === true ? 'Add new banner' : 'update banner information'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Banner name</label>
                                <input type="text" value={inputValues.name} name="name" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="col-md-4 form-group">
                                <label>Select image</label>
                                <input accept=".jpg,.png" onChange={(event) => handleOnChangeImage(event)} type="file" className="form-control form-file" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Display image</label>
                                <div style={{ backgroundImage: `url(${inputValues.imageReview})` }} onClick={() => openPreviewImage()} className="box-img-preview"></div>
                            </div>
                            <div className="form-group col-md-12">
                                <label htmlFor="inputAddress">Detailed description</label>
                                <textarea rows="4" value={inputValues.description} name="description" onChange={(event) => handleOnChange(event)} className="form-control"></textarea>
                            </div>
                        </div>
                        <button onClick={() => handleSaveBanner()} type="button" className="btn btn-primary">Save</button>
                    </form>
                </div>
            </div>
            {inputValues.isOpen === true &&
                <Lightbox mainSrc={inputValues.imageReview}
                    onCloseRequest={() => setInputValues({ ...inputValues, ["isOpen"]: false })}
                />
            }
        </div>
    )
}
export default AddBanner;