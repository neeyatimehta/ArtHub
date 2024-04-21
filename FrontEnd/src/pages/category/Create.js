import React, { useState } from "react";
import Container from "../../components/Layout/Container";
import Input from "../../components/common/Input";
import { decoded, token } from "../../helpers/token";
import instance from "../../components/auth/axiosConfig";
import Button from "../../components/common/Button";
import { generalForm } from "../../helpers/validate";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import { useNavigate } from "react-router";
import FormHeader from "../../components/common/FormHeader";
import { returnTimeOut, showError } from "../../helpers/common";

const Create = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    createdBy: decoded?.id,
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

    if (generalForm(formData, setFormErrors)) {
      instance
        .post("/Category", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.status === 200) {
            setSuccess("Category created Successfully!");
          }
          setFormData({ title: "" });
          setFormErrors({});
          setLoading(false);
          // navigate('/category')
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
      <Container>
        <div className="row">
          <div className=" form-register mb-4">
            <div className="col-lg-6 col-md-8 col-sm-12 mx-auto">
              <div className="form-container mt-4 pt-4 border border-1 p-4 rounded-3">
                <SuccessMessage message={success} className="mb-2" />
                <ErrorMessage message={error}/>
                <FormHeader message={"Create Category"} />
                <form>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Category Title"
                    onChange={onChange}
                  />
                  {formErrors?.title && (
                    <ErrorMessage
                      message={formErrors?.title}
                      className="mb-2"
                    />
                  )}

                  <div className="my-4">
                    <Button
                      text="Cancel"
                      color="secondary"
                      textColor="white"
                      className="me-3"
                      onClick={() => navigate("/category")}
                    />

                    <Button
                      text="Create"
                      color="black"
                      textColor="white"
                      onClick={onSubmit}
                      disabled={loading}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Create;
