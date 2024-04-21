import React, { useEffect, useState} from "react";
import Container from "../components/Layout/Container";
import SectionHeader from "../components/common/SectionHeader";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { useLocation } from "react-router";
import instance, { baseURL } from "../components/auth/axiosConfig";
import { decoded, token } from "../helpers/token";
import LinkButton from "../components/common/LinkButton";
import EmptyMessage from "../components/common/EmptyMessage";
import { FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'


const ArtDetail = () => {
  const [art, setArt] = useState({});
  const [personalBids, setPersonalBids] = useState([]);
  const [cat, setCat] = useState("");
  const [hasBidPreviously, setHasBidPreviously] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()


  const location = useLocation();
  const artId = location.state;

  useEffect(() => {
    console.log(artId)
    if(artId?.id){
    instance
      .get(`/Artwork/${artId?.id}`)
      .then((res) => {
        // setSuccess(true)
        if (res?.status === 200) {
          setArt(res?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
    };
  }, [artId]);

  const fetchCategory = () => {
    if (Object.keys(art).length !== 0) {
      instance
        .get(`/Category/${art?.categoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res) {
            setLoading(false);
            setCat(res?.data?.title);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };

  const filterBidByArt = () => {
    if (Object?.keys(art)?.length !== 0) {
      if (decoded?.id === art?.sellerId) {
        setLoading(true);
        instance
          .post(
            "/Bid/filter",
            {
              // bidderId: decoded?.id,
              artworkId: art?.id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            setLoading(false);
            setPersonalBids(res?.data);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      }
    }
  };

  const filterBidByArtAndUser = () => {
    if (Object?.keys(art)?.length !== 0) {
      // if (decoded?.id === art?.sellerId) {
      setLoading(true);
      instance
        .post(
          "/Bid/filter",
          {
            bidderId: decoded?.id,
            artworkId: art?.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          if (res?.data?.length > 0) {
            setHasBidPreviously(true);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
      // }
    }
  };
  useEffect(() => {
    fetchCategory();
    filterBidByArt();
    filterBidByArtAndUser();
  }, [art]);

  return (
    <>
      <Container>
        <div className="row">
          <div className="col-lg-4 col-md-4 col-sm-7 text-center">
            <div className="art-image mt-4 mb-4">
              {art?.imageUrl && (
                <img
                  src={`${baseURL}/${art?.imageUrl}`}
                  className="mx-auto"
                  style={{
                    width: "80%",
                    height: "100%",
                    display: "block",
                    padding: "7px",
                  }}
                />
              )}
              {art?.status === "Sold" ? (
                <span class=" badge px-4 rounded-pill bg-danger text-dark text-white">
                  {" "}
                  {art?.status}
                </span>
              ) : art?.status === "Active" ? (
                <span class=" badge px-4 rounded-pill bg-success text-dark text-white">
                  {" "}
                  {art?.status}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="col-lg-8 col-md-8 col-sm-5 mt-4">
            <h5 className="mt-3 ">{art?.title}</h5>
            <span className="fw-bold fw-9 text-muted mb-2 fst-italic">
              {art?.description || "--"}
            </span>

            <p style={{cursor:"pointer"}} className="mt-1" onClick={()=>navigate(`/browse-arts`, {state:{sellerId:art?.sellerId, sellerName:art?.sellerName}})}>
              <span className=" fw-bold fw-9">By: </span>
              <span className=" text-decoration-underline">
              {art?.sellerName || "--"}
              </span>
            </p>

            <p className="mt-4">
              <span className=" fw-bold fw-9">Category: </span>
              {art?.categoryName || "--"}
            </p>
            <p>
              <span className=" fw-bold fw-9">Minimum Bid Price: </span>
              {art?.minimumBid || "--"}
            </p>

            <p>
              <span className=" fw-bold fw-9">Current Highest Bid: </span>
              {art?.currentHighestBid}
            </p>

            <div className="mt-0 mb-4">
              <span className=" fw-bold fw-9">Auction Status: </span>
              {art?.status === "Sold" ? (
                <span class="badge rounded-pill bg-danger text-dark text-white">
                  {" "}
                  {art?.status}
                </span>
              ) : art?.status === "Active" ? (
                <span class="badge rounded-pill bg-success text-dark text-white">
                  {" "}
                  {art?.status}
                </span>
              ) : (
                <span class="badge rounded-pill bg-warning text-dark">
                  {"Preview "}
                  {/* {art?.status} */}
                </span>
              )}
            </div>

            {
              art?.status !== "Sold" ? (
                !hasBidPreviously ? (
                  <Modal
                    hasBidPreviously={hasBidPreviously}
                    filterBidByArtAndUser={filterBidByArtAndUser}
                    bidState={art?.live === "true"}
                    art={art}
                  />
                ) : (
                  <span class="badge rounded-pill bg-info text-dark">
                    Bid Already placed
                  </span>
                )
              ) : (
                ""
              )
              // <p>You've already placed your bid on this art.</p>
            }

            <div className="mt-4">
              <LinkButton
                text="Continue Browsing"
                color="black"
                textColor="white"
                link="/browse-arts"
              />
              <LinkButton
                className="ms-2"
                text="See Your Bids"
                color="black"
                textColor="white"
                link="/bid-details"
              />
            </div>
          </div>

          {art?.sellerId === decoded?.id && (
            <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
              <SectionHeader
                label={`Bids made on ${art?.title}`}
                className={"text-center"}
              />
              <table class="table table-sm table-bordered mt-2 fw-9">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Bid By</th>
                    <th scope="col">Bid Amount</th>
                    <th scope="col">Bid Made On</th>
                    <td scope="col"> </td>
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
                  ) : personalBids?.length > 0 ? (
                    personalBids?.map((bid, index) => {
                      return (
                        <>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{bid?.bidderName}</td>
                            <td>{bid?.bidAmount}</td>
                            <td>
                              {bid?.createdOn &&
                                new Date(bid?.createdOn)?.toLocaleString()}
                            </td>
                            <td>
                              {bid?.successful === "true" && (
                                <span class="badge rounded-pill bg-danger text-dark text-white">
                                  {" "}
                                  {art?.status}
                                </span>
                              )}
                            </td>
                          </tr>
                        </>
                      );
                    })
                  ) : (
                    <tr className="border text-center w-100 ">
                      <EmptyMessage title="bids" className="w-100" />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default ArtDetail;
