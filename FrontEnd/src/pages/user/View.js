import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance, { baseURL } from "../../components/auth/axiosConfig";
import { decoded, token } from "../../helpers/token";
import Address from "../../components/common/Address";
import Radio from "../../components/common/Radio";
import ErrorMessage from "../../components/common/ErrorMessage";
import Input from "../../components/common/Input";
import Container from "../../components/Layout/Container";
import SectionHeader from "../../components/common/SectionHeader";

const View = () => {
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
  });

  useEffect(() => {
    if (decoded?.id) {
      instance
        .get(`/User/${decoded?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setFormData(res?.data);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <>
      <Container>
        <div className="row">
          <div className="col-lg-6 col-md-8 col-sm-12 mx-auto">
            <div className="row">
              {(formData?.profilePictureUrl !== "" ||
                formData?.profilePictureUrl !== null) && (
                <div className="profile d-flex justify-content-center align-items-center">
                  <img
                    src={`${baseURL}/${formData?.profilePictureUrl}`}
                    width={120}
                    height={120}
                    className="img-thumbnail"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              )}
            </div>
            <div className="row mt-4">
              <div className="col-lg-6">
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  value={formData?.firstName}
                  disabled={true}
                />
              </div>

              <div className="col-lg-6">
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  placeholder=" Doe"
                  value={formData?.lastName}
                  disabled={true}
                />
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
                  value={formData?.username}
                  disabled={true}
                />
              </div>

              <div className="col-lg-6">
                <Input
                  type="text"
                  id="email"
                  name="email"
                  label="Email"
                  placeholder="john.doe@gmail.com"
                  value={formData?.email}
                  disabled={true}
                />
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
                  value={formData?.mobile}
                  disabled={true}
                />
              </div>

              <div className="col-lg-6">
                <Input
                  type="password"
                  id="password"
                  name="password"
                  label="Password"
                  placeholder="Password"
                  value={formData?.password}
                  disabled={true}
                />
              </div>
            </div>

            <Input
              type="text"
              id="country"
              name="country"
              label="Country"
              placeholder=""
              value={formData?.country}
              disabled={true}
            />

            <Input
              type="text"
              id="state"
              name="state"
              label="State"
              placeholder=""
              value={formData?.province}
              disabled={true}
            />
            <Input
              type="text"
              id="city"
              name="city"
              label="City"
              placeholder=""
              value={formData?.city}
              disabled={true}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default View;
