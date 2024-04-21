import React, { useEffect, useState } from "react";
import SectionHeader from "../components/common/SectionHeader";
import Container from "../components/Layout/Container";
import Button from "../components/common/Button";
import instance from "../components/auth/axiosConfig";
import { decoded, token } from "../helpers/token";
import SuccessMessage from "../components/common/SuccessMessage";
import ErrorMessage from "../components/common/ErrorMessage";
import { returnTimeOut, showError } from "../helpers/common";
import EmptyMessage from "../components/common/EmptyMessage";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import LinkButton from "../components/common/LinkButton";

const UserPreferences = () => {
  const [defaultCat, setDefaultCat] = useState([]);
  const [usersItems, setUsersItems] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ modal: false, id: 0 });
  const [selectedItems, setSelectedItems] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getUserPreference = () => {
    instance
      .get(`/UserPreference/user/${decoded?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res) {
          console.log("@catRes", res);
          res?.data?.map((cat) => {
            console.log("@cat", cat);
            setUsersItems(res?.data);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUserPreference();
  }, [decoded?.id]);

  //   console.log()

  useEffect(() => {
    instance
      .get("/Category")
      .then((res) => {
        // console.log()
        // console.log("@res", res)
        setDefaultCat(res?.data);
        // setDefaultCat(defaultCat=>({...defaultCat, res?.data}));

        setLoading(false);
        setError("");
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.status == 404) {
          setError("Cannot load the Categories. Something wrong!");
        } else {
          showError(err, setError);
        }
        setSuccess("");
      });
  }, []);

  const handleSelection = (text) => {
    let catDetail = { id: text?.id, title: text?.title };
    // console.log("@test", catDetail)
    const isSelected = selectedItems.includes(catDetail);
    // console.log("@isSelected",isSelected)
    const updatedSelection = isSelected
      ? selectedItems.filter((item) => item !== catDetail)
      : [...selectedItems, catDetail?.id];

    setSelectedItems(updatedSelection);
  };

  const isItemSelected = (text) => {
    return selectedItems.some((obj) => obj === text.id);
  };

  const navigate = useNavigate();

  const textStyle = (text) => ({
    background: isItemSelected(text) ? "#F5CA5A" : "#efefef",
    cursor: "pointer",
  });

  //   console.log(decoded)
  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(selectedItems);
    instance
      .post(
        "/UserPreference",
        {
          categoryIds: selectedItems,
          userId: decoded?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setSuccess("Preferences Added Successfully");
        getUserPreference();
        textStyle({ id: "", title: "" });
        // navigate("/");
      })
      .catch((err) => {
        setLoading(true);
        if (err?.response?.data?.title === "") {
          setError("Something went wrong with ther server!");
        } else {
          showError(err, setError);
        }
      });

    returnTimeOut(setError, setSuccess);
  };

  const deleteCat = (e) => {
    e.preventDefault();
    setLoading(true);
    instance
      .delete(`/UserPreference/${deleteModal?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setSuccess("Preference Deleted Successfully!");
        setTimeout(()=>{
          window.location.reload()
        },[30])
        getUserPreference();
      })
      .catch((err) => {
        setLoading(false);
        setError(err?.response?.data?.title);
      });

    returnTimeOut(setError, setSuccess);
  };

  return (
    <>
      <Container>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 form-container p-3 mx-auto">
            {/* <SectionHeader label={"Set your Preference"}/> */}
            <SuccessMessage message={success} />
            <ErrorMessage message={error} />

            <h5>Set your preferences</h5>
            <p className="fw-9">
              Set your preferred categories to see recommended arts in your
              homepage
            </p>
            <div className="my-4 d-flex flex-wrap justify-content-between align-items-center">
              {defaultCat?.length > 0 &&
                defaultCat?.map((cat, index) => {
                  return (
                    <>
                      <p
                        style={textStyle({ id: cat?.id, title: cat?.title })}
                        className="cat rounded py-2 px-4 fw-8 fw-bold"
                        onClick={() => handleSelection(cat)}
                      >
                        {cat?.title}
                      </p>
                    </>
                  );
                })}
            </div>
            <Button
              text="Save"
              color="black"
              textColor="white"
              onClick={onSubmit}
              disabled={loading}
            />

            <div className="col-lg-12 col-md-12 col-sm-12 border-top pt-4 mt-4 ">
              <SectionHeader label="Your set preferences" />

              <div class="table-responsive">
                <table class="table table-bordered mt-2 fw-9">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Created On</th>
                      {/* <th scope="col">Created On</th> */}
                      <td scope="col"></td>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr className="border">
                        <div class="d-flex justify-content-center ">
                          <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </tr>
                    ) : usersItems?.length > 0 ? (
                      usersItems &&
                      usersItems?.map((cat, index) => {
                        //   console.log(cat);
                        return (
                          <>
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{cat?.categoryName}</td>
                              {/* <td>{cat?.createdBy}</td> */}
                              <td>
                                {cat?.createdOn &&
                                  new Date(cat?.createdOn).toLocaleString()}
                              </td>
                              <td className="text-center">
                                <div class="btn-group dropend">
                                  <p
                                    class="pe-auto"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <BsThreeDotsVertical />
                                  </p>
                                  <ul class="dropdown-menu p-2 fw-9 pe-auto">
                                    <li
                                      className="py-1"
                                      onClick={() =>
                                        setDeleteModal({
                                          modal: true,
                                          id: cat?.id,
                                        })
                                      }
                                      data-bs-toggle="modal"
                                      data-bs-target="#deleteModal"
                                    >
                                      <MdDelete /> <span>Delete</span>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                            <div
                              class="modal fade"
                              id="deleteModal"
                              tabindex="-1"
                              aria-labelledby="deleteModalLabel"
                              aria-hidden="true"
                            >
                              <div class="modal-dialog">
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <h6
                                      class="modal-title"
                                      id="exampleModalLabel"
                                    >
                                      Are you sure you want to delete your
                                      preference?
                                    </h6>
                                    <button
                                      type="button"
                                      class="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    ></button>
                                  </div>

                                  <div class="modal-footer">
                                    <button
                                      type="button"
                                      class="btn btn-secondary"
                                      data-bs-dismiss="modal"
                                    >
                                      Close
                                    </button>
                                    <button
                                      type="button"
                                      class="btn btn-primary"
                                      onClick={deleteCat}
                                    >
                                      Yes
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })
                    ) : (
                      <tr className="border text-center w-100">
                        <EmptyMessage title="preferences" className="w-100" />
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {usersItems?.length > 0 && (
                <LinkButton
                  text="See your Recommendations"
                  color="black"
                  textColor="white"
                  link="/"
                />
              )}
            </div>
          </div>
        </div>
        {deleteModal?.modal && (
          <div
            class="modal fade"
            id="deleteModal"
            //   tabindex="-1"
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h6 class="modal-title" id="exampleModalLabel">
                    Are you sure you want to delete your preference?
                  </h6>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  {/* <Button text="Delete" color="black" textColor="white" onClick={(e) => deleteCat(e)} disabled={true}/> */}

                  <p class=" " onClick={(e) => deleteCat(e)}>
                    Yes
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default UserPreferences;
