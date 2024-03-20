// Planet.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Planet.css';

function Planet() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 
  const [searchTerm, setSearchTerm] = useState('');
  const [editableIndexes, setEditableIndexes] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState('');

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await axios.get(`https://swapi.dev/api/planets/?page=${currentPage}`);
        setPlanets(response.data.results);
        setLoading(false);
        setNextPageUrl(response.data.next);
        setEditableIndexes(new Array(response.data.results.length).fill(false));
      } catch (error) {
        console.error('Error fetching planets:', error);
      }
    };

    fetchPlanets();
  }, [currentPage]); 

  if (loading) {
    return <div>Loading...</div>;
  }


  const handlePreviousPage = async () => {
    try {
      const response = await axios.get(`https://swapi.dev/api/planets/?page=${currentPage - 1}`);
      setPlanets(response.data.results);
      setNextPageUrl(response.data.next);
      setCurrentPage(currentPage - 1);
    } catch (error) {
      console.error('Error fetching previous page:', error);
    }
  };

  const handleNextPage = async () => {
    try {
      const response = await axios.get(nextPageUrl);
      setPlanets(response.data.results);
      setNextPageUrl(response.data.next);
      setCurrentPage(currentPage + 1);
    } catch (error) {
      console.error('Error fetching next page:', error);
    }
  };

  const indexOfLastPlanet = currentPage * itemsPerPage;
  const indexOfFirstPlanet = indexOfLastPlanet - itemsPerPage;
  const currentPlanets = planets.slice(indexOfFirstPlanet, indexOfLastPlanet);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(planets.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map(number => (
    <button  className='edit-btn' key={number} onClick={() => setCurrentPage(number)}>
      {number}
    </button>
  ));

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };

  const filteredPlanets = currentPlanets.filter(planet =>
    planet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (index) => {
    const newEditableIndexes = [...editableIndexes];
    newEditableIndexes[indexOfFirstPlanet + index] = true;
    setEditableIndexes(newEditableIndexes);
  };

  const handleSave = (index) => {
    const newEditableIndexes = [...editableIndexes];
    newEditableIndexes[indexOfFirstPlanet + index] = false;
    setEditableIndexes(newEditableIndexes);
  };

  const handleInputChange = (event, attribute, index) => {
    const newPlanets = [...planets];
    newPlanets[indexOfFirstPlanet + index][attribute] = event.target.value;
    setPlanets(newPlanets);
  };

  const handleDelete = (index) => {
    const updatedPlanets = [...planets];
    updatedPlanets.splice(indexOfFirstPlanet + index, 1);
    setPlanets(updatedPlanets);
  };

  return (
    <div className="container">
      <h1>Star Wars Planets</h1>
      <input
        type="text"
        placeholder="Search for a planet..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul className="responsive-table">
        <li className="table-header">
          <div className="col">Name</div>
          <div className="col">Rotation Period</div>
          <div className="col">Orbital Period</div>
          <div className="col">Diameter</div>
          <div className="col">Climate</div>
          <div className="col">Population</div>
          <div className="col">Terrain</div>
          <div className="col">Action</div>
        </li>
        {filteredPlanets.map((planet, index) => (
          <li key={index} className="table-row">
            <div className="col" data-label="Name">
              {editableIndexes[indexOfFirstPlanet + index] ? (
                <input
                  type="text"
                  value={planet.name}
                  onChange={(event) => handleInputChange(event, 'name', index)}
                />
              ) : (
                planet.name
              )}
            </div>
            <div className="col" data-label="Rotation Period">
              {editableIndexes[indexOfFirstPlanet + index] ? (
                <input
                  type="text"
                  value={planet.rotation_period}
                  onChange={(event) => handleInputChange(event, 'rotation_period', index)}
                />
              ) : (
                planet.rotation_period
              )}
            </div>
            <div className="col" data-label="Orbital Period">
              {editableIndexes[indexOfFirstPlanet + index] ? (
                <input
                  type="text"
                  value={planet.orbital_period}
                  onChange={(event) => handleInputChange(event, 'orbital_period', index)}
                />
              ) : (
                planet.orbital_period
              )}
            </div>
            <div className="col" data-label="Diameter">
              {editableIndexes[indexOfFirstPlanet + index] ? (
                <input
                  type="text"
                  value={planet.diameter}
                  onChange={(event) => handleInputChange(event, 'diameter', index)}
                />
              ) : (
                planet.diameter
              )}
            </div>
            <div className="col" data-label="Climate">
              {editableIndexes[indexOfFirstPlanet + index] ? (
                <input
                  type="text"
                  value={planet.climate}
                  onChange={(event) => handleInputChange(event, 'climate', index)}
                />
              ) : (
                planet.climate
              )}
            </div>
            <div className="col" data-label="Population">
              {editableIndexes[indexOfFirstPlanet + index] ? (
                <input
                  type="text"
                  value={planet.population}
                  onChange={(event) => handleInputChange(event, 'population', index)}
                />
              ) : (
                planet.population
              )}
            </div>
            <div className="col" data-label="Terrain">
              {editableIndexes[indexOfFirstPlanet + index] ? (
                <input
                  type="text"
                  value={planet.terrain}
                  onChange={(event) => handleInputChange(event, 'terrain', index)}
                />
              ) : (
                planet.terrain
              )}
            </div>
            <div className="col" data-label="Action">
              {editableIndexes[indexOfFirstPlanet + index] ? (
                <button className='edit-btn' onClick={() => handleSave(index)}>Save</button>
              ) : (
                <div className="action-btns">
                  <button className='edit-btn' onClick={() => handleDelete(index)}>Delete</button>
                  <button className='edit-btn' onClick={() => handleEdit(index)}>Edit</button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div>
        <button className='pagi-btn' onClick={handlePreviousPage} disabled={currentPage === 1}>Previous Page</button>
        {renderPageNumbers}
        <button className='pagi-btn' onClick={handleNextPage} disabled={!nextPageUrl}>Next Page</button>
      </div>
    </div>
  );
}

export default Planet;
