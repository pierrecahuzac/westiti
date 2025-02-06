import React from "react";
import "../styles/loader.scss";

const Loader: React.FC = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader book">
          <figure className="page"></figure>
          <figure className="page"></figure>
          <figure className="page"></figure>
        </div>
        <h4>Loading</h4>
      </div>
    </div>
  );
};

export default Loader;
