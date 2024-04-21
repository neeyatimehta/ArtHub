import React, { useEffect, useState } from "react";
import Search from "../components/common/Search";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import LinkButton from "../components/common/LinkButton";
import Filter from "../components/common/Filter";
import SectionHeader from "../components/common/SectionHeader";
import instance, { baseURL } from "../components/auth/axiosConfig";
import Button from "../components/common/Button";
import { useNavigate } from "react-router";
import EmptyMessage from "../components/common/EmptyMessage";
import Loader from "../components/common/Loader";
import { useLocation } from "react-router";

const ArtsCollection = () => {
  const [arts, setArts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filteredList, setFilteredList] = useState([]);
  const [list, setList] = useState([]);
  // const [sellerName, setSellerName] = useState(false)

  const location = useLocation();
  const art = location.state;

  useEffect(() => {
    setList(filteredList);
    // setSellerName(false)
    // navigate(location.pathname, {sellerId:art?.sellerId, sellerName:""});
  }, [filteredList]);

  useEffect(() => {
    setList(filteredList?.length === 0 ? arts : filteredList);
  }, [arts]);

  useEffect(() => {
    setLoading(true);
    instance
      .get("/Artwork")
      .then((res) => {
        // setSuccess(true)
        setLoading(false);
        setArts(res?.data);
        // art?.sellerId=null
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (art?.sellerId !== "") {
      // setSellerName(true)
      instance
        .post("/Artwork/filter", {
          sellerId: art?.sellerId,
        })
        .then((res) => {
          // setSuccess(true)
          setLoading(false);
          setFilteredList(res?.data);
          // setArts(res?.data);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [art?.sellerId]);

  return (
    <>
      <div className="container-fluid p-4 ">
        <div className="row">
          <div className="col-lg-3 col-md-4 col-sm-4">
            <div className="browse-left vh-100 position-fixed border-end pe-4">
              <div className="search">
                <Search list={arts} setFilteredList={setFilteredList} />
              </div>
              <div className="filter mt-4 h-100  d-flex flex-column  align-items-start">
                <Filter list={list} setFilteredList={setFilteredList} />
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-md-8 col-sm-8">
            <SectionHeader label="Our Arts Collection" />

            <span></span>
            <div className="browse-right w-100">
              {loading ? (
                <Loader />
              ) : list?.length > 0 ? (
                <ResponsiveMasonry
                  columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
                  gutter="10px"
                >
                  <Masonry>
                    {list?.map((list, index) => {
                      console.log(list);
                      return (
                        <>
                          {/* <p>{list?.sellerName}</p> */}
                          <div
                            class="item hovereffect"
                            onClick={() =>
                              navigate(`/art-detail/${list?.id}`, {
                                state: list,
                              })
                            }
                          >
                            <img
                              src={`${baseURL}/${list?.imageUrl}`}
                              style={{
                                width: "100%",
                                display: "block",
                                padding: "7px",
                              }}
                            />
                            <div class="overlay">
                              <h2>{list?.title}</h2>
                              <p className="fst-italic">by: <span className="text-warning">{list?.sellerName}</span></p>
                              <p>
                                <Button
                                  text="Show More"
                                  color="black"
                                  textColor="white"
                                  className="me-3"
                                  onClick={() =>
                                    navigate(`/art-detail/${list?.id}`, {
                                      state: list?.id,
                                    })
                                  }
                                />
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </Masonry>
                </ResponsiveMasonry>
              ) : (
                <EmptyMessage className="fw-9 text-muted " title={"items"} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtsCollection;
