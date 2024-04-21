import React, { useEffect, useState } from "react";
import Container from "../components/Layout/Container";
import SectionHeader from "../components/common/SectionHeader";
import visa from "../assets/visa.jpg";
import mastercard from "../assets/mastercard.png";
import amex from "../assets/amex.png";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Checkbox from "../components/common/Checkbox";
import ErrorMessage from "../components/common/ErrorMessage";
import Address from "../components/common/Address";
import { generalForm, validateForm } from "../helpers/validate";
import instance from "../components/auth/axiosConfig";
import { returnTimeOut, showError } from "../helpers/common";
import { decoded, token } from "../helpers/token";
import SuccessMessage from "../components/common/SuccessMessage";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentDetails = () => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const state = location?.state;

  const [cardType, setCardType] = useState("");
  const [formData, setFormData] = useState({
    bidId: 1,
    sameAsUser: false,
    cardHolderFirstName: "",
    cardHolderLastName: "",
    city: "",
    province: "",
    country: "",
    postalCode: "",
    cardType: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [formErrors, setFormErrors] = useState({
    numberError: "",
    dateError: "",
    cvvError: "",
  });

  const navigate = useNavigate();
  // console.log(state)
  useEffect(() => {
    setFormData((formData) => ({
      ...formData,
      bidId: state?.id,
    }));
  }, [state]);
  const [loading, setLoading] = useState(false);

  const validateExpirationDate = (expirationMonth, expirationYear) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // January is 0

    if (expirationYear > currentYear) {
      return true;
    } else if (
      expirationYear === currentYear &&
      expirationMonth >= currentMonth
    ) {
      return true;
    }

    return false;
  };

  const validateCVV = (cvv) => {
    const cvvPattern = /^[0-9]{3,4}$/;
    return cvvPattern.test(cvv);
  };

  const validateCardNumber = (cardNumber) => {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      isEven = !isEven;
    }
    detectCardType(cardNumber);
    return sum % 10 === 0;
  };

  function detectCardType(cardNumber) {
    const patterns = {
      visa: /^4[0-9]{15}$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,

    
    };

    for (const type in patterns) {
      if (patterns[type].test(cardNumber)) {
        // console.log(cardNumber);

        return type;
      }
      
    }

    return "Unknown";
  }

  const onNumberChange = (e) => {
    if (!validateCardNumber(e.target.value)) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        numberError: "Invalid card number",
      }));
    } else {
      setFormData((formData) => ({
        ...formData,
        cardNumber: e?.target?.value,
      }));
      setFormErrors((formErrors) => ({ ...formErrors, numberError: "" }));
    }
  };

  const onDateChange = (e) => {
    console.log(e?.target?.value);
    const dateExpression = new RegExp("^([0-9]{4})-?(0[1-9]|1[0-2])$");

    if (dateExpression.test(e.target.value)) {
      setFormErrors((formErrors) => ({ ...formErrors, dateError: "" }));
      let data = e.target.value.split("-");
      let expirationMonth = data[1];
      let expirationYear = data[0];
      // Validate expiration date
      if (!validateExpirationDate(expirationMonth, expirationYear)) {
        setFormErrors((formErrors) => ({
          ...formErrors,
          dateError: "Card has expired. You cannot use this card",
        }));

        // setFormErrors("Card has expired. You cannot use this card")
      } else {
        setFormData((formData) => ({
          ...formData,
          expiryDate: e?.target?.value,
        }));
        setFormErrors((formErrors) => ({ ...formErrors, dateError: "" }));
      }
    } else {
      setFormData((formData) => ({
        ...formData,
        expiryDate: e?.target?.value,
      }));
      setFormErrors((formErrors) => ({ ...formErrors, dateError: "" }));
    }
  };

  const onCvvChange = (e) => {
    if (!validateCVV(e.target.value)) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        cvvError: "Invalid CVV",
      }));
    } else {
      setFormData((formData) => ({ ...formData, cvv: e?.target?.value }));
      setFormErrors((formErrors) => ({ ...formErrors, cvvError: "" }));
    }
  };

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
    // console.log(formData)
    // setLoading(true);
    let tempData = { ...formData };
    delete tempData?.bidId;
    delete tempData?.sameAsUser;

  
    if (generalForm(tempData, setFormErrors)) {
      instance
        .post("/Transaction", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.status === 200) {
            setSuccess("Transaction Added Successfully!");
          }
          setLoading(false);
          setError("");
          setFormData({
            bidId: 1,
            sameAsUser: false,
            cardHolderFirstName: "",
            cardHolderLastName: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
            cardType: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
          });

          navigate("/payment-successful");
        })
        .catch((err) => {
          setLoading(false);
          showError(err, setError);
        });
    } else {
      console.log(formErrors)
      // setLoading(false);
    }

    returnTimeOut(setError, setSuccess);
  };

  useEffect(() => {
    if (cardType !== "") {
      setFormData((formData) => ({
        ...formData,
        cardType: cardType,
        
      }));
      // setFormData({
      //   bidId: 1,
      //   sameAsUser: false,
      //   cardHolderFirstName: "",
      //   cardHolderLastName: "",
      //   city: "",
      //   state: "",
      //   country: "",
      //   postalCode: "",
      //   cardType: "",
      //   cardNumber: "",
      //   expiryDate: "",
      //   cvv: "",
      // });
    }
  }, [cardType]);

  const getUserInfo = () => {
    instance
      .get(`/user/${decoded?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSameUser(true);

        // console.log(res)
        setFormData((formData) => ({
          ...formData,
          sameAsUser: sameUser,
          cardHolderFirstName: res?.data?.firstName,
          cardHolderLastName: res?.data?.lastName,
          city: res?.data?.city,
          province: res?.data?.province,
          country: res?.data?.country,
          postalCode: res?.data?.postalCode,
        }));
      })
      .catch((err) => console.log(err));
  };

  const [sameUser, setSameUser] = useState(false);

  const onUserChange = () => {
    setSameUser(!sameUser);
  };

  useEffect(() => {
    if (sameUser) {
      getUserInfo();
    } else {
      setSameUser(false);
      setFormData((formData) => ({
        ...formData,
        sameAsUser: sameUser,
        cardHolderFirstName: "",
        cardHolderLastName: "",
        city: "",
        province: "",
        country: "",
        postalCode: "",
      }));
    }
  }, [sameUser]);
  return (
    <>
      <Container>
        <div className="row">
          <div className="col-lg-6 mx-auto">
            <div className="header text-center">
              <h5>Want to buy a masterpiece?</h5>
              <p>You need to add your payment details before that.</p>
            </div>

            {/* <SectionHeader c/> */}
            <form className="border p-3 rounded">
              {success && <SuccessMessage message={success} />}
              {error && <ErrorMessage message={error} />}
              <div className="user-details border-bottom pb-3">
                <Checkbox
                  label={"Same as user?"}
                  className="py-2"
                  name="sameAsUser"
                  onChange={onUserChange}
                />
                <div className="row">
                  <div className="col-lg-6">
                    <label
                      for="cardHolderFirstName"
                      class="form-label fw-bold mb-0"
                    >
                      Card Holder First Name
                    </label>

                    <Input
                      type="text"
                      id="cardHolderFirstName"
                      name="cardHolderFirstName"
                      label={false}
                      placeholder="John"
                      onChange={onChange}
                      value={formData?.cardHolderFirstName}
                      disabled={formData?.sameAsUser ? true : false}
                    />
                    {formErrors?.cardHolderFirstName && (
                      <ErrorMessage message={formErrors?.cardHolderFirstName} />
                    )}
                  </div>

                  <div className="col-lg-6">
                    <label
                      for="cardHolderLastName"
                      class="form-label fw-bold mb-0"
                    >
                      Card Holder Last Name
                    </label>

                    <Input
                      type="text"
                      id="cardHolderLastName"
                      name="cardHolderLastName"
                      label=""
                      placeholder=" Doe"
                      onChange={onChange}
                      value={formData?.cardHolderLastName}
                      disabled={formData?.sameAsUser ? true : false}
                    />
                    {formErrors?.cardHolderFirstName && (
                      <ErrorMessage message={formErrors?.cardHolderFirstName} />
                    )}
                  </div>
                </div>

                {formData?.sameAsUser ? (
                  <>
                    <Input
                      type="text"
                      id="country"
                      name="country"
                      label="Country"
                      placeholder=""
                      onChange={onChange}
                      value={formData?.country}
                      disabled={true}
                    />

                    <Input
                      type="text"
                      id="province"
                      name="province"
                      label="Province"
                      placeholder=""
                      onChange={onChange}
                      value={formData?.province}
                      disabled={true}
                    />
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      label="City"
                      placeholder=""
                      onChange={onChange}
                      value={formData?.city}
                      disabled={true}
                    />
                  </>
                ) : (
                  <Address
                    formData={formData}
                    setFormData={setFormData}
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                    onChange={onChange}
                  />
                )}
              </div>

              <div className="d-flex justify-content-between border-bottom my-4">
                <div>
                  <p className="fw-9 fw-bold mb-0 d-block">Supported cards</p>
                  <div class="d-flex align-items-center cardImages">
                    <img
                      src={visa}
                      alt="Visa"
                      onClick={() => setCardType("Visa")}
                    />
                    <img
                      src={mastercard}
                      alt="Mastercard "
                      className="px-2"
                      onClick={() => setCardType("MasterCard")}
                    />
                    <img
                      src={amex}
                      alt="American Express"
                      onClick={() => setCardType("American Express")}
                    />
                  </div>
                </div>
                <div className="w-100 border-start ps-3">
                  <p className="fw-9 fw-bold mb-0">Selected card</p>
                  <div class="">
                    {cardType === "Visa" ? (
                      <img src={visa} alt="Visa" width={50} />
                    ) : cardType === "MasterCard" ? (
                      <img src={mastercard} alt="Mastercard" width={50} />
                    ) : cardType === "American Express" ? (
                      <img src={amex} alt="American Express" width={40} />
                    ) : (
                      "None"
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                {/* <label for="card_number" class="form-label fw-bold mb-0">Card Number</label> */}
                <Input
                  type="text"
                  name="cardNumber"
                  id="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  className="mt-0"
                  label={true}
                  onChange={onNumberChange}
                  disabled={cardType === "" ? true : false}
                />
                {formErrors?.numberError && (
                  <ErrorMessage message={formErrors?.numberError} />
                )}
              </div>

              <div>
                {/* <label for="expiry_date" class="form-label fw-bold mb-0">Expiry Date</label> */}
                <Input
                  type="month"
                  name="expiryDate"
                  id="expiryDate"
                  placeholder="MM/YY"
                  className="mt-0"
                  label={true}
                  onChange={onDateChange}
                  disabled={cardType === "" ? true : false}
                />
                {formErrors?.dateError && (
                  <ErrorMessage message={formErrors?.dateError} />
                )}
              </div>

              <div>
                {/* <label for="cvv" class="form-label fw-bold mb-0">CVC/CVV</label> */}
                <Input
                  type="text"
                  name="cvv"
                  id="cvv"
                  placeholder="0000"
                  className="mt-0"
                  label={true}
                  onChange={onCvvChange}
                  disabled={cardType === "" ? true : false}
                />
                {formErrors?.cvvError && (
                  <ErrorMessage message={formErrors?.cvvError} />
                )}
              </div>

              <Button
                className="mt-4"
                text="Save"
                color="black"
                textColor="white"
                onClick={onSubmit}
                disabled={loading}
              />
            </form>
          </div>
        </div>
      </Container>
    </>
  );
};

export default PaymentDetails;
