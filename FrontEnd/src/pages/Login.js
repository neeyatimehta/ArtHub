import React, { useState } from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import LinkButton from "../components/common/LinkButton";
import { generalForm } from "../helpers/validate";
import instance from "../components/auth/axiosConfig";
import { Navigate, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import { returnTimeOut, showError } from "../helpers/common";

const Login = () => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    identity: "",
    password: "",
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

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    if (generalForm(formData, setFormErrors)) {
      instance
        .post("/api/Auth/login", formData)
        .then((res) => {
          setLoading(false);
          if (res?.data) {
            localStorage.setItem("token", res?.data);
          }
          setTimeout(()=>{
            window?.location?.reload();

          },[500])

          setTimeout(() => {
            navigate("/");
          }, [498]);
        })
        .catch((err) => {
          setLoading(false);
          showError(err, setError)
        });
    } else {
      setLoading(false);
    }

    returnTimeOut(setError, setSuccess);
  };

  return (
    <>
      <div className="container mt-4">
        <div className="form-container w-50 m-auto mt-4 pt-4 border border-1 p-4 rounded-3">
          <h4 className="mb-4">Login</h4>
          <ErrorMessage message={error} />
          <form>
            <Input
              type="text"
              id="identity"
              name="identity"
              label="Username"
              placeholder="Enter your Username"
              onChange={onChange}
            />

            {formErrors?.identity && (
              <ErrorMessage message={formErrors?.identity} />
            )}

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

            <Button
              text="Login"
              type="main"
              className="mt-2"
              color="black"
              textColor="white"
              onClick={onSubmit}
              disabled={loading}
            />
          </form>

          <div className="login-footer text-start  pt-3 border-top mt-4 justify-content-center align-items-center">
            <span className="d-block mb-3">Don't have an account yet?</span>
            <LinkButton
              color="black"
              textColor="white"
              text="Sign up with us"
              type="main"
              className="mt-2"
              link="/register"
            />
            {/* <a className=" bg-black text-white border-black p-2 text-decoration-none ">Sign up with us</a> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
