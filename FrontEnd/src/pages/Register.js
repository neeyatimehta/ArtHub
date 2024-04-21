import React, { useEffect, useState } from "react";
import Input from "../components/common/Input";
import LinkButton from "../components/common/LinkButton";
import Button from "../components/common/Button";
import Radio from "../components/common/Radio";
import Container from "../components/Layout/Container";

import { validateForm } from "../helpers/validate";
import axios from "axios";
import ErrorMessage from "../components/common/ErrorMessage";
import SuccessMessageMessage from "../components/common/SuccessMessage";

import instance from "../components/auth/axiosConfig";
import { useNavigate } from "react-router-dom";
import { returnTimeOut, scrollToElement, showError } from "../helpers/common";
import Address from "../components/common/Address";
import SuccessMessage from "../components/common/SuccessMessage";

const Register = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
    country: "",
    province: "",
    city: "",
    postalCode: "",
    gender: "",
    birthDate: "2023-12-03T03:37:01.281Z",
    // profilePictureUrl: "string",
    imageFile:null
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

  
  const onImageChange = (e) =>{
    setFormData(formData=>({...formData, imageFile:e.target.files[0]}))
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const newData = new FormData()
    formData && Object.keys(formData).map((data)=>{
      newData.append(data, formData[data])
    })
    
    if (validateForm(formData, setFormErrors)) {
      instance
        ?.post("/User", newData, {
          headers: {
            'content-type': 'multipart/form-data'
          },
        })
        .then((res) => {
          setSuccess(true);
          setLoading(false);
          navigate("/login");
        })
        .catch((err) => {
          console.log(err?.response)
          setLoading(false);
          showError(err, setError)
        });
    } else {
      setLoading(false);
      Object.keys(formErrors)?.map((error) => {
        // return console.log(error)
        return scrollToElement(error);
      });
    }
    returnTimeOut(setError, setSuccess);
  };

  return (
    <Container>
      <div className="row form-register mb-4">
        <div className="col-lg-6 col-md-8 col-sm-12 mx-auto">
          {success && <SuccessMessage message="User Created Sucessfully!" />}

          {error && <ErrorMessage message={error} className="my-2" />}
          <div className="form-container mt-4 pt-4 border border-1 p-4 rounded-3">
            <h4 className="mb-4 text-center title">Register</h4>
            <form>
              <div className="row">
                <div className="col-lg-6">
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    placeholder="John"
                    onChange={onChange}
                  />
                  {formErrors?.firstName && (
                    <ErrorMessage message={formErrors?.firstName} />
                  )}
                </div>

                <div className="col-lg-6">
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    placeholder=" Doe"
                    onChange={onChange}
                  />
                  {formErrors?.lastName && (
                    <ErrorMessage message={formErrors?.lastName} />
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    label="Username"
                    placeholder="john.doe"
                    onChange={onChange}
                  />

                  {formErrors?.username && (
                    <ErrorMessage message={formErrors?.username} />
                  )}
                </div>

                <div className="col-lg-6">
                  <Input
                    type="text"
                    id="email"
                    name="email"
                    label="Email"
                    placeholder="john.doe@gmail.com"
                    onChange={onChange}
                  />
                  {formErrors?.email && (
                    <ErrorMessage message={formErrors?.email} />
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <Input
                    type="text"
                    name="mobile"
                    id="mobile"
                    label="Mobile"
                    placeholder="7297743478"
                    onChange={onChange}
                  />
                  {formErrors?.mobile && (
                    <ErrorMessage message={formErrors?.mobile} />
                  )}
                </div>

                <div className="col-lg-6">
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    label="Password"
                    placeholder="Password"
                    onChange={onChange}
                  />
                  {formErrors?.password && (
                    <ErrorMessage message={formErrors?.password} />
                  )}
                </div>
              </div>

              <div className="row my-2">
                <div className="col-lg-12">
                  <label class="form-label text-muted mb-0 text-capitalize fw-bold me-3">
                    Gender
                  </label>

                  <Radio
                    onChange={onChange}
                    name="gender"
                    value="male"
                    label="Male"
                    className="form-check-inline"
                  />
                  <Radio
                    onChange={onChange}
                    name="gender"
                    value="female"
                    label="Female"
                    className="form-check-inline"
                  />
                </div>
                <div className="col-lg-12"></div>
              </div>

              <div className="my-2">
                <label class="form-label text-muted mb-0 text-capitalize fw-bold mt-2">Choose your art image</label>

                  <Input
                    type="file"
                    name="Art"
                    accept="image/*"
                    onChange={onImageChange}
                  />
                </div>

              <Address
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                onChange={onChange}
              />

              <div className="text-center">
                <Button
                  text="Register"
                  type="main"
                  className="mt-4 text-center"
                  color="black"
                  textColor="white"
                  onClick={onSubmit}
                  disabled={loading}
                />
              </div>
            </form>

            <div className="login-footer text-center  pt-3 border-top mt-4 justify-content-center align-items-center">
              <span className="d-block mb-3">Already have an account yet?</span>
              <LinkButton
                text="Login"
                type="main"
                className="mt-2"
                link="/login"
                color="black"
                textColor="white"
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Register;
