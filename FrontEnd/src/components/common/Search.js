import React, { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import Button from "./Button";

const Search = ({ list, setFilteredList }) => {
  const [inputText, setInputText] = useState("");
  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value?.toLowerCase();
    setInputText(lowerCase);
  };

  useEffect(() => {
    return setFilteredList(() =>
      list.filter((el) => {
        //if no input the return the original
        if (inputText === "") {
          return el;
        }

        //return the item which contains the user input
        else {
          return (el.title?.toLowerCase().includes(inputText) || el.sellerName?.toLowerCase().includes(inputText))
        }
      })
    );
  }, [inputText]);

  return (
    <>
      <div className="main">
        <SectionHeader label="Search for Arts " />

        <div className="search mt-2">
          <input
            className="form-control"
            id="outlined-basic"
            variant="outlined"
            fullWidth
            label="Search"
            placeholder="Search by Name or Author...."
            onChange={inputHandler}
          />
        </div>
      </div>
    </>
  );
};

export default Search;
