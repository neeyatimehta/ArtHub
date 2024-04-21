import React, { useEffect, useState } from "react";
import LinkButton from "../components/common/LinkButton";
import shape1 from "../assets/blob.svg";
import shape3 from "../assets/blob-2.svg";
import SectionHeader from "../components/common/SectionHeader";
import Container from "../components/Layout/Container";
import instance, { baseURL } from "../components/auth/axiosConfig";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { decoded, token } from "../helpers/token";
import Loader from "../components/common/Loader";

const Home = () => {
  const [recommendedCats, setRecommendedCats] = useState([]);
  const [arts, setArts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (decoded?.id) {
      instance
        .get(`/UserPreference/user/${decoded?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res) {
            res?.data?.map((cat) => {
              setRecommendedCats((prevRecommendedCats) => {
                // Use a set to efficiently check for duplicates
                const catIdSet = new Set(prevRecommendedCats);

                // Add the new categoryId if it's not already present
                catIdSet.add(cat?.categoryId);

                // Convert the set back to an array
                return [...catIdSet];
              });
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } else {
      setLoading(false);
    }
  }, [decoded?.id]);

  useEffect(() => {
    if (recommendedCats?.length > 0) {
      setLoading(true);

      instance
        .post("/Artwork/filter", {
          categoryIds: recommendedCats,
        })
        .then((res) => {
          setArts(res?.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [recommendedCats]);

  var settings = {
    dots: true,
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: arts?.length > 3 ? 3 : 1,
    swipeToSlide: true,
    speed: 500,
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="landingPage">
        <div class="container-fluid text-center">
          <div class="row">
            <div class="col-lg-6 col-md-7 col-sm-12 bg-white vh-100 text-start postion-relative p-0">
              <div className="details">
                <span className="text-left text-muted">
                  Come explore with us
                </span>
                <h1 className="main-heading">Art Gallery</h1>
                <div className="d-flex justify-content-between mt-4 pt-4">
                  <div className="first">
                    <span>BROWSE</span>
                    <p className="text-muted pt-1">Browse The Art</p>
                  </div>
                  <div className="first">
                    <span>BID</span>
                    <p className="text-muted  pt-1">Bid on the Art</p>
                  </div>
                  <div className="first">
                    <span>WIN</span>
                    <p className="text-muted pt-1">Get The Art</p>
                  </div>
                </div>
                <LinkButton
                  text="Browse Arts"
                  type="main"
                  className="mt-4"
                  color="black"
                  textColor="white"
                  link={"/browse-arts"}
                />
              </div>
              <div className="shape1">
                <img src={shape1} />
              </div>
            </div>
            <div class="col-lg-6 col-md-5 col-sm-12 container-right vh-100 position-relative p-0 ">
              <div className="shape2"></div>
              <div className="shape3">
                <img src={shape3} />
              </div>
              <div className="btns">
                <div className="text">
                  <h5 className="fw-bold">Inspired?</h5>
                  <span className="text-muted">
                    Want to create your own gallery?
                  </span>
                </div>

                <LinkButton
                  text="Upload your Art"
                  type="main"
                  className="mt-4"
                  color="white"
                  textColor="black"
                  link={"/arts/create"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Container>
        <div className="row my-4">
          <div className="col-lg-12 col-md-12 col-sm-12 text-center">
            <div className="recommendedSection my-4">
              <h5>Recommended Section</h5>

              {loading ? (
                <Loader />
              ) : arts?.length > 0 ? (
                <div className="my-4">
                  <Slider {...settings}>
                    {arts?.map((art, index) => {
                      return (
                        <div
                          className="recommendedHover"
                          onClick={() =>
                            navigate(`/art-detail/${art?.id}`, {
                              state: art,
                            })
                          }
                        >
                          <img
                            width={250}
                            height={200}
                            src={`${baseURL}/${art?.imageUrl}`}
                          />
                          <div class="recommendedoverlay">
                            <p className="text-white">
                              <a> {art?.title}</a>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </Slider>
                </div>
              ) : (
                <>
                  <p>You haven't set up your preferred art styles yet!</p>
                  <LinkButton
                    text="Click Here To Add Recommendations"
                    color="black"
                    textColor="white"
                    link="/user/preferences"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Home;
