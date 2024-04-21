import React, { useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import Button from "./Button";
import SectionHeader from "./SectionHeader";
import instance from "../auth/axiosConfig";
import { token } from "../../helpers/token";
import EmptyMessage from "./EmptyMessage";
import Loader from "./Loader";

const Filter = ({ list, setFilteredList }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(0);

  useEffect(() => {
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
        }
        console.log(res);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

  const onCategoryChange = (e) => {
    const { name, checked } = e?.target;
    let catId = name && parseInt(name);
    if (selectedCategories.includes(catId)) {
      // If selected, remove it from the array
      setSelectedCategories((prevSelected) =>
        prevSelected.filter((checkboxValue) => checkboxValue !== catId)
      );
    } else {
      // If not selected, add it to the array
      setSelectedCategories((prevSelected) => [...prevSelected, catId]);
    }
  };

  console.log(selectedCategories);
  const activateFilter = () => {
    instance
      .post(
        "/Artwork/filter",
        {
          categoryIds: selectedCategories,
          status: selectedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        // setSuccess(true)
        if (res?.status === 200) {
          setFilteredList(res?.data);
          // setAllArts(res?.data)
        }

        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

  };

  const statusChange = (e) => {
    // console.log(e.target.checked);
    e.target.checked ? setSelectedStatus(1) : setSelectedStatus(0);
  };

  return (
    <>
      <div className="filter-category">
        <SectionHeader label="Category" />
        <div className="mt-2">
        {loading ? (
          <Loader />
        ) : categories?.length > 0 ? (
          categories?.map((cat, index) => {
            return (
              <Checkbox
                name={cat?.id}
                label={cat?.title}
                onChange={onCategoryChange}
              />
            );
          })
        ) : (
          <EmptyMessage title="categories" />
        )}
        </div>
      </div>

      <div className="filter-live mt-4">
        <SectionHeader label="Status " />
        <div class="form-check form-switch mt-2" onChange={statusChange}>
          <input
            class="form-check-input"
            name={"status"}
            type="checkbox"
            role="switch"
            id="flexSwitchCheckChecked"
          />
          <label class="form-check-label" for="flexSwitchCheckChecked">
            Live
          </label>
        </div>
      </div>

      <Button
        text="Filter"
        color="black"
        textColor="white"
        className="mt-4"
        onClick={activateFilter}
      />
    </>   
  );
};

export default Filter;
