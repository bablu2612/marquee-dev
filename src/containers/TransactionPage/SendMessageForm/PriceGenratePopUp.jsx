import { Modal } from "../../../components";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createContractDetails } from "./sendMessage.duck";
import { useDispatch } from "react-redux";
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import moment from "moment";

const onManageDisableScrolling = (componentId, scrollingDisabled = true) => {
    // We are just checking the value for now
    console.log('Toggling Modal - scrollingDisabled currently:', componentId, scrollingDisabled);
};

function PriceGenratePopUp({ open, onClose = null }) {
    const dispatch = useDispatch();
    const { id } = useParams();
    const transectionId = id

    const formik = useFormik({
        initialValues: {
            totalPurchase: '',
            profit: '',
            date: '',
        },
        validationSchema: Yup.object({
            totalPurchase: Yup.number()
                .typeError('Price must be a number')
                .positive('Price must be greater than zero')
                .required('Price is required'),
        }),
        onSubmit: async (values) => {
            console.log(transectionId, '::::::::::::::::')
            await dispatch(createContractDetails({
                PaymemtData: { ...values, date: new Date().toString() },
                txn_id: transectionId
            })).then(res => {
                if (res) {
                    window.location.reload();
                    // onClose();
                    // if (!transectionData?.isEntertainer) {
                    //     gobackToChat();
                    // } else {
                    //     setIsConfirm(false);
                    //     dispatch(fetchTransactionLineItems({
                    //         orderData: { stockReservationQuantity: 1, deliveryMethod: "none" },
                    //         listingId: transectionData?.listing?.id?.uuid,
                    //         isOwnListing: false,
                    //         isContract: true,
                    //         amount: pricePercentageAmount(entertainerData?.performanceCost, 17, entertainerData?.equipmentFee)
                    //     }));

                    //     handleSubmitOrderRequest();
                    // }

                }
            }).catch((err) => {
                throw new Error('somthing went wrong', err)
            })
        },
    });
    return (
        <Modal
            id="confirmationPOpUp"
            containerClassName='confirmPopUp'
            isOpen={open}
            onClose={onClose}
            usePortal
            onManageDisableScrolling={onManageDisableScrolling}
            scrollLayerClassName="scrollerModelClass"

        // closeButtonMessage={closeButtonMessage}
        >
            <div className="messageContainer">
                <div className="max-w-md mx-auto p-4">
                    <h2>Price Form</h2>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-fieldsSection">
                            {/* Price Field */}
                            <div>
                                <label htmlFor="price">Price</label>
                                <input
                                    name="totalPurchase"
                                    type="number"
                                    min={1}
                                    {...formik.getFieldProps('totalPurchase')}
                                    onChange={(e) => {
                                        formik.setFieldValue('totalPurchase', e.target.value);
                                        if (!isNaN(e.target.value)) {
                                            formik.setFieldValue('profit', e.target.value * 15 / 100);
                                        }
                                    }}
                                />
                                {formik.touched.totalPurchase && formik.errors.totalPurchase && (<div className="error">{formik.errors.totalPurchase}</div>)}
                            </div>
                            {/* Disabled Text Field */}
                            {/* <div> */}
                                {/* <label htmlFor="description">Profit</label> */}
                                <input type="hidden"  {...formik.getFieldProps('profit')} disabled />
                            {/* </div> */}

                            {/* <div>
                                <label htmlFor="date">Date</label>
                                <input type="date"  {...formik.getFieldProps('date')} />
                                {formik.touched.date && formik.errors.date && (<div className="error">{formik.errors.date}</div>)}
                            </div> */}
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <style jsx>{`
                .scrollerModelClass  {
                    display: flex;
                    align-items:center;
                    justify-content:center;
                    height:100%;
                    background:#0801018f;

                    .confirmPopUp {
                        background: var(--colorWhite);
                        padding:10px 20px;
                        border-radius: 4px;

                        .messageContainer {
                            text-align: left;
                            width: 100%;
                        }
                        

                        .marketplaceModalCloseStyles {
                            display:none;
                        }
                         .form-container {
                            max-width: 400px;
                            margin: 2rem auto;
                            padding: 2rem;
                            border: 1px solid #ccc;
                            border-radius: 8px;
                        }

                        h2 {
                            margin:1rem 0;
                            font-size: 1.5rem;
                            text-align: center;
                            line-height: 24px;
                        }

                        .form-fieldsSection {
                            display : flex;
                            flex-direction: column;
                            row-gap: 15px;
                        }

                        label {
                            font-weight: 500;
                            font-size: 16px;
                        }

                        input {
                            width: 100%;
                            padding: 0.5rem;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            min-width: 400px;
                        }

                        input[disabled] {
                            background: #f0f0f0;
                            color: #888;
                        }

                        .error {
                            color: red;
                            font-size: 0.875rem;
                            margin-top: 0.25rem;
                        }

                        button {
                            padding: 0.7rem 1rem;
                            background-color: #0070f3;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            margin: 10px 0;
                        }

                        button:hover {
                            background-color: #005bb5;
                        }
                    }
                }

            `}</style>
        </Modal>
    )
}


export default PriceGenratePopUp;