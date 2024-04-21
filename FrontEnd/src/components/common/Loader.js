import React from "react";

const Loader = () => {
  return (
    <div class="d-flex justify-content-center spinner-border-sm">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
