import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [headerData, setHeaderData] = useState(null);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (selectedItem) {
      fetchFriendsData(selectedItem.id);
    } else {
      fetchItems();
    }
  }, [page]);

  useEffect(() => {
    if (selectedItem) {
      fetchHeaderData(selectedItem.id);
      fetchFriendsData(selectedItem.id);
    }
  }, [selectedItem]);

  const fetchItems = () => {
    fetch(
      `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${page}/10`
    )
      .then((response) => response.json())
      .then((data) => {
        setData((prevData) => [...prevData, ...data.list]);
      });
  };

  const fetchHeaderData = (id) => {
    fetch(
      `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setHeaderData(data);
      });
  };

  const fetchFriendsData = (id) => {
    fetch(
      `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${id}/friends/${page}/10`
    )
      .then((response) => response.json())
      .then((data) => {
        setData((prevData) => [...prevData, ...data.list]);
      });
  };

  const handleScroll = () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    if (scrollPosition >= pageHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleItemClick = (list) => {
    setSelectedItem(list);
    setHeaderData(null); // clear the header data
    setData([]); // clear the data
  };

  return (
    <div className="app">
      <div className="header-wrapper">
        <header>
          {selectedItem && headerData ? (
            <>
              <img
                className="headerImg"
                src={`http://placeimg.com/640/480/animals?v=${selectedItem.id}`}
              ></img>
              <fieldset className="info">
                <legend>info</legend>
                <h3>
                  {`${headerData.prefix}${headerData.name} ${headerData.lastName}`}
                </h3>
                <p>{headerData.title}</p>

                <p>
                  <u>Email: {headerData.email}</u>
                </p>
                <p>
                  <u>IP Address: {headerData.ip}</u>
                </p>
                <p>
                  <u>Job Area: {headerData.jobArea}</u>
                </p>
                <p>
                  <u>Job Type: {headerData.jobType}</u>
                </p>
              </fieldset>
              <fieldset className="address">
                <legend>Address</legend>
                <h3>{headerData.company.name}</h3>
                <p>
                  <u>City: {headerData.address.city}</u>
                </p>
                <p>
                  <u>Country: {headerData.address.country}</u>
                </p>
                <p>
                  <u>State: {headerData.address.state}</u>
                </p>
                <p>
                  <u>Street Address: {headerData.address.streetAddress}</u>
                </p>
                <p>
                  <u>ZIP: {headerData.address.zipCode}</u>
                </p>
              </fieldset>
            </>
          ) : (
            <></>
          )}

          <div className="info"></div>
          <div className="address"></div>
        </header>
      </div>

      <div className="grid">
        {data.map((list, index) => (
          <figure
            key={`${list.id}-${index}`}
            onClick={() => handleItemClick(list)}
          >
            <img
              className="gridImage"
              src={`http://placeimg.com/640/480/animals?v=${list.id}`}
              alt={list.name}
            />

            <figcaption>{`${list.prefix} ${list.name} ${list.lastName}`}</figcaption>
            <p>{list.title}</p>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default App;
