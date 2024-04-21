import React from "react";

const Footer = () => {
  return (
    <div className="footer  bg-white py-2 text-center mt-4">
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 border-bottom">
          <div className="team my-1 d-flex justify-content-center align-items-center text-muted">
            <p className="mb-0">Kritika Koirala</p>
            <p className="mx-2 px-2 mb-0">Neeyati Mehta</p>
            <p className="mb-0">Pranay Malusare</p>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12">
          <p className="py-1 mb-0 pt-2"> &copy; Copyright 2023 <span className="fw-bold">Group 4</span></p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
