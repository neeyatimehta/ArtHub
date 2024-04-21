import React, { useEffect, useState } from "react";
import instance from "../../components/auth/axiosConfig";
import { token } from "../../helpers/token";
import Container from "../../components/Layout/Container";
import SectionHeader from "../../components/common/SectionHeader";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import LinkButton from "../../components/common/LinkButton";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyMessage from "../../components/common/EmptyMessage";
import { returnTimeOut, showError } from "../../helpers/common";

const List = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // setError("");
    setLoading(true);
    instance
      .get("/Category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          res?.data && setCategories(res?.data);
          setLoading(false);
          setError("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.status == 404) {
          // console.log("error")
          setError("Cannot load the Categories. Something wrong!");
        } else {
          showError(err, setError)
        }
      });
    returnTimeOut(setError, setSuccess);
  }, []);

  return (
    <>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-2">
          {/* <h6>Arts you've Created</h6> */}
          <SectionHeader
            label={"All the categories created"}
            className={"text-center"}
          />
          <LinkButton
            text={`Create`}
            icon={<FaCirclePlus />}
            type="main"
            color="black"
            textColor="white"
            link={"/category/create"}
          />
        </div>

        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            {error && <ErrorMessage message={error} />}
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
                  ) : categories?.length > 0 ? (
                    categories &&
                    categories?.map((cat, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{cat?.title}</td>
                          <td>{cat?.createdOn && new Date(cat?.createdOn).toLocaleString()}</td>
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
                                  className="py-1 pe-auto"
                                  onClick={() =>
                                    navigate("/category/edit", { state: cat })
                                  }
                                >
                                  <FaEdit /> <span>Edit</span>{" "}
                                </li>
                               
                              </ul>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="border text-center w-100">
                      <EmptyMessage title="categories" className="w-100" />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default List;
