import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const params = useParams();
  const id = params.id;

  // FIXED: Explicit root routes prevent path corruption bugs across nested URL paths
  const dealer_url = `/djangoapp/get_dealer_details/${id}`;
  const review_url = `/djangoapp/add_review`;
  const carmodels_url = `/djangoapp/get_cars`;

  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    // If the first and second name are stored as null, use the username
    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if (!model || review === "" || date === "" || year === "" || model === "") {
      alert("All details are mandatory");
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split[1];

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    console.log(jsoninput);
    const res = await fetch(review_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsoninput,
    });

    const json = await res.json();
    if (json.status === 200) {
      window.location.href = window.location.origin + "/dealer/" + id;
    }
  };

  // FIXED: Wrapped in useCallback to prevent infinite render dependency loops
  const get_dealer = useCallback(async () => {
    const res = await fetch(dealer_url, { method: "GET" });
    const retobj = await res.json();
    
    if (retobj.status === 200 && retobj.dealer) {
      let dealerobjs = Array.from(retobj.dealer);
      if (dealerobjs.length > 0) setDealer(dealerobjs[0]);
    }
  }, [dealer_url]);

  // FIXED: Wrapped in useCallback to satisfy strict dependency array rules securely
  const get_cars = useCallback(async () => {
    const res = await fetch(carmodels_url, { method: "GET" });
    const retobj = await res.json();
    
    if (retobj.CarModels) {
      let carmodelsarr = Array.from(retobj.CarModels);
      setCarmodels(carmodelsarr);
    }
  }, [carmodels_url]);

  // FIXED: Included proper functional dependencies inside hook listener matrix
  useEffect(() => {
    get_dealer();
    get_cars();
  }, [get_dealer, get_cars]);

  return (
    <div>
      <Header/>
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>
        <textarea id='review' cols='50' rows='7' onChange={(e) => setReview(e.target.value)}></textarea>
        
        <div className='input_field'>
          Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)}/>
        </div>
        
        <div className='input_field'>
          Car Make 
          <select name="cars" id="cars" defaultValue="" onChange={(e) => setModel(e.target.value)}>
            <option value="" disabled hidden>Choose Car Make and Model</option>
            {carmodels.map((carmodel, index) => (
              <option key={index} value={carmodel.CarMake + " " + carmodel.CarModel}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>        
        </div>

        <div className='input_field'>
          Car Year <input type="number" onChange={(e) => setYear(e.target.value)} max={2026} min={2015}/>
        </div>

        <div>
          <button className='postreview' onClick={postreview}>Post Review</button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;