import React, { useEffect, useState } from "react";
import ReactSelect from "./ReactSelect";
import ErrorMessage from "./ErrorMessage";
import { Country, State, City } from "country-state-city";
import Input from "./Input";

const Address = (props) => {
  let { formData, setFormData, onChange, setFormErrors, formErrors } = props;
  const [data, setData] = useState({
    countries: [],
    states: [],
    cities: [],
    country: "",
    state: "",
    city: "",
  });
  useEffect(() => {
    let allCountries = Country.getAllCountries();

    // { value: 'chocolate', label: 'Chocolate' },
    let options = [];

    allCountries?.length > 0 &&
      allCountries?.map((country, index) => {
        options.push({ value: country?.isoCode, label: country?.name });
      });

    options &&
      options?.length > 0 &&
      setData((data) => ({ ...data, countries: options }));
  }, []);

  const onCountryChange = (val) => {
    if (val !== "")
      setData((data) => ({
        ...data,
        country: val?.value,
        states: [],
        cities: [],
      }));
    console.log("@val", val);

    setFormData((formData) => ({ ...formData, country: val?.label }));

    setFormErrors((formErrors) => ({ ...formErrors, country: "" }));
  };
  const onStateChange = (val) => {
    if (val !== "")
      setData((data) => ({ ...data, state: val?.value, cities: [] }));
    console.log("@val", val);
    setFormData((formData) => ({ ...formData, province: val?.label }));
    setFormErrors((formErrors) => ({ ...formErrors, state: "" }));
  };
  const onCityChange = (val) => {
    if (val !== "") setData((data) => ({ ...data, city: val?.value }));
    console.log("@val", val);

    setFormData((formData) => ({ ...formData, city: val?.label }));
    setFormErrors((formErrors) => ({ ...formErrors, city: "" }));
  };

  const [defaultValues, setDefaultValues] = useState({
    defaultCountry: {},
    defaultState: {},
    defaultCity: {},
  });

  useEffect(() => {
    let allStates = State.getStatesOfCountry(data?.country);

    let options = [];

    allStates?.length > 0 &&
      allStates?.map((state, index) => {
        options.push({ value: state?.isoCode, label: state?.name });
      });

    options &&
      options?.length > 0 &&
      setData((data) => ({ ...data, states: options }));
  }, [data?.country]);

  // useEffect(()=>{
  //     if(formData?.country!==""){
  //         // console.log(formData)
  //         data?.countries?.length>0 && data?.countries?.filter((cs)=>{
  //             return cs?.label?.toLowerCase()===formData?.country?.toLowerCase() &&
  //             setDefaultValues(defaultValues=>({...defaultValues, defaultCountry:cs}))
  //         })
  //         console.log(data)

  //         data?.cities?.length>0 && data?.cities?.filter((cs)=>{
  //             console.log(cs)
  //             return cs?.label?.toLowerCase()===formData?.city?.toLowerCase() &&
  //             setDefaultValues(defaultValues=>({...defaultValues, defaultCity:cs}))
  //         })

  //         data?.states?.length>0 && data?.states?.filter((cs)=>{
  //             return cs?.label?.toLowerCase()===formData?.state?.toLowerCase() &&
  //             setDefaultValues(defaultValues=>({...defaultValues, defaultState:cs}))
  //         })
  //     }
  // },[formData?.country, formData?.city, formData?.state])

  // console.log(defaultValues)

  useEffect(() => {
    let allCities = City.getCitiesOfState(data?.country, data?.state);
    let options = [];

    allCities?.length > 0 &&
      allCities?.map((city, index) => {
        options.push({ value: city?.name, label: city?.name });
      });

    options &&
      options?.length > 0 &&
      setData((data) => ({ ...data, cities: options }));
  }, [data?.state]);

  // console.log("@formData",formData)
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <ReactSelect
            options={data?.countries}
            onChange={onCountryChange}
            name="country"
          />
          {formErrors?.country && (
            <ErrorMessage message={formErrors?.country} />
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <ReactSelect
            options={data?.states}
            onChange={onStateChange}
            name="state"
          />
          {formErrors?.state && <ErrorMessage message={formErrors?.state} />}
        </div>
        <div className="col-lg-6">
          <ReactSelect
            options={data?.cities}
            onChange={onCityChange}
            name="city"
          />
          {formErrors?.city && <ErrorMessage message={formErrors?.city} />}
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <Input
            type="text"
            name="postalCode"
            id="postalCode"
            label="Postal Code"
            placeholder="B3k 2P1"
            onChange={onChange}
            value={formData?.postalCode}
          />
          {formErrors?.postalCode && (
            <ErrorMessage message={formErrors?.postalCode} />
          )}
        </div>
      </div>
    </>
  );
};

export default Address;
