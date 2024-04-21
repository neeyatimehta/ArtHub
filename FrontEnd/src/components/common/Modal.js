import React, { useState } from "react";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import instance from "../auth/axiosConfig";
import { decoded, token } from "../../helpers/token";
import SuccessMessage from "./SuccessMessage";
import Button from "./Button";
import { returnTimeOut, showError } from "../../helpers/common";
import FormHeader from "./FormHeader";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Modal = (props) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [paymentDetail, setPaymentDetail] = useState(true);
  let { bidState, art } = props;

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    bidAmount: 0,
  });

  const onChange = (e) => {
    let { name, value } = e?.target;

    let data = { ...formData };
    let errors = { ...formErrors };

    data[name] = value;
    errors[name] = "";

    setFormData(data);
    setFormErrors(errors);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let bidAmt = formData?.bidAmount && parseInt(formData?.bidAmount);
    if (bidAmt <= 0) {
      setLoading(false);

      setFormErrors({ bidAmount: "Bid amount should be greater than 0" });
    } else if (bidAmt <= art?.minimumBid) {
      setLoading(false);
      setFormErrors({
        bidAmount: `Bid amount should be greater then minimum Bid amount i.e. ${art?.minimumBid}`,
      });
    } else {
      let data = {
        bidAmount: bidAmt,
        bidderId: decoded?.id,
        artworkId: art?.id,
      };
      instance
        .post("/Bid", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setSuccess("Bid Added Successfully!");
          setFormData({ bidAmount: 0 });
          setFormErrors({});
          setError("");
          setLoading(false);
          setTimeout(()=>{
            window.location.reload()
          },[30])
          // window.location.reload()
          // navigate(`/art-detail/${art?.id}`, {state:art})
          props?.filterBidByArtAndUser()
        })
        .catch((err) => {
          setLoading(false);
          showError(err, setError)

          setSuccess("");
          setLoading(false);
        });
    }
    returnTimeOut(setError, setSuccess);
  };

  return (
    <>
      {art?.sellerId !== decoded?.id && (
        <>
          <button
            disabled={!bidState}
            type="button"
            class="btn bg-black text-white"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Bid on Art
          </button>
          <p className="fw-8 mt-1 fst-italic">
              <span className="fw-bold">Note: </span> You can only bid on a
              artwork if the status is Active
            </p>

          <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <form>
                  <div class="modal-header">
                    <FormHeader
                      message={" Are you sure you want to bid on this art?"}
                      className="fw-normal mb-0"
                    />

                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <SuccessMessage message={success} className="my-2" />
                    <ErrorMessage message={error} className="my-2" />

                    <Input
                      type="number"
                      id="bidAmount"
                      name="bidAmount"
                      label={false}
                      placeholder="Enter the amount you want to bid"
                      className="mt-0 mx-auto"
                      onChange={onChange}
                      value={formData?.bidAmount}
                    />

                    {formErrors?.bidAmount && (
                      <ErrorMessage message={formErrors?.bidAmount} />
                    )}
                  </div>
                  <div class="modal-footer">
                    {/* <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn border-dark" onClick={(e)=>onSubmit(e)}>Done</button> */}
                    {/* <Button  text="Cancel" color="secondary" textColor="white" onClick={()=>navigate('/browse-arts')} className="me-3" /> */}
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>

                    {
                      props?.hasBidPreviously?
                      <button class="btn text-white bg-white p-3" disabled={true} >Bid</button>
                      :
                    <Button
                      text="Bid"
                      color="black"
                      textColor="white"
                      disabled={loading}
                      onClick={onSubmit}
                    />
                    }
                    
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Modal;
