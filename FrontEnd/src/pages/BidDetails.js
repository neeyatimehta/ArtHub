import React, { useEffect, useState } from "react";
import Container from "../components/Layout/Container";
import instance from "../components/auth/axiosConfig";
import { decoded, token } from "../helpers/token";
import LinkButton from "../components/common/LinkButton";
import { useNavigate } from "react-router-dom";
import EmptyMessage from "../components/common/EmptyMessage";
import SectionHeader from "../components/common/SectionHeader";
import SuccessMessage from "../components/common/SuccessMessage";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCirclePlus } from "react-icons/fa6";

const BidDetails = () => {
  const [bidList, setBidList] = useState([{}]);
  const [art, setArt] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    instance
      .post(
        "/Bid/filter",
        {
          bidderId: decoded?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);

        setBidList(res?.data);
      })
      .catch((err) => {
        setLoading(false);
        // setEror

        console.log(err);
      });
  }, []);

  const getArt = (id) => {
    // console.log(bidList);
    if (bidList) {
      instance
        .get(`/Artwork/${id}`)
        .then((res) => {
          setArt((art) => [...art, { bidId: id, title: res?.data?.title }]);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return art;
  };

  useEffect(() => {
    bidList?.map((bid, index) => {
      return getArt(bid?.artworkId);
    });
  }, [bidList]);

  const navigate = useNavigate();
  return (
    <>
      <Container>
        <div className="row">
          <div className="col-lg-12">
            <SectionHeader
              label={"All the bids you've made"}
              className={"text-center"}
            />
            <table class="table table-bordered mt-2 fw-9">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Art</th>
                  <th scope="col">Bid Price</th>
                  <th scope="col">Status</th>
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
                ) : bidList?.length > 0 ? (
                  bidList?.map((bid, index) => {
                    return (
                      <>
                        <tr>
                          <td>{index + 1}</td>
                          <td>{art[index]?.title}</td>
                          <td>{bid?.bidAmount}</td>
                          <td>
                            {bid?.successful === "true" ? (
                              <>
                                <SuccessMessage
                                  message="Congratulations! You've won the bid"
                                  className="fw-9"
                                />

                                <p
                                  style={{
                                    width: "fit-content",
                                    cursor: "pointer",
                                  }}
                                  className="text-decoration-underline fst-italic mt-2 mb-0"
                                  onClick={() =>
                                    navigate("/payment-details", {
                                      state: bid,
                                    })
                                  }
                                >
                                  Proceed to Payment
                                </p>
                              </>
                            ) : (
                              <SuccessMessage
                                message="Waiting for the decision!"
                                className="text-dark fw-9"
                              />
                            )}
                          </td>
                        </tr>
                      </>
                    );
                  })
                ) : (
                  <tr className="border text-center w-100 ">
                    <EmptyMessage title="bids" className="w-100 fw-bold" />
                    <a
                      href="/browse-arts "
                      className="text-decoration-underline p-0 text-primary c-pointer pe-2"
                    >
                      Browse our Arts
                    </a>{" "}
                    to make your bid!
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </>
  );
};

export default BidDetails;
