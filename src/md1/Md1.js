import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../Config';

const MD1 = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    date: '',
    billnumber:'',
    billnumbermd1:'',
    name:'',
    amountatvj:'',
    amountatmd1:'',
  });

  useEffect(() => {
    if (location.state) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        billnumber: location.state.billnumber,
        name: location.state.name,
        amountatvj: location.state.amountatvj
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dateTimestamp = new Date(formData.date).getTime();
    try {
      const response = await axios.post(`${config.url}/insertMd1`, { ...formData, date: dateTimestamp });
      if (response.status === 200) {
        setFormData({
          date: '',
          billnumber:'',
          billnumbermd1:'',
          name:'',
          amountatvj:'',
          amountatmd1:'',
        });
      }
      // Handle success message
    } catch (error) {
      // Handle error message
    }
  };

  return (
    <div>
      <div className="container">
        <h1 style={{ color: '#003366' }} >ADD BILL TO MD1</h1>
        <form className='w-full py-3' onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor='date'>Date</label>
            <input type="date" id='date' name='date' onChange={handleChange} value={formData.date} />
          </div>
          <div className="form-group">
            <label htmlFor='billnumber'>Bill Number</label>
            <input type="number" id='billnumber' name='billnumber' onChange={handleChange} value={formData.billnumber} disabled style={{ backgroundColor: '#d3d3d3', color: '#000' }} />
          </div>
          <div className="form-group">
            <label htmlFor='billnumbermd1'>Bill Number At Md1</label>
            <input type="number" id='billnumbermd1' name='billnumbermd1' onChange={handleChange} value={formData.billnumbermd1}   />
          </div>
          <div className="form-group"> 
            <label htmlFor='name'>Name</label>
            <input type="text" id='name' name='name' onChange={handleChange} value={formData.name} disabled style={{ backgroundColor: '#d3d3d3', color: '#000' }} />
          </div>
          <div className="form-group">
            <label htmlFor='amountatvj'>Amount at VJ</label>
            <input type="number" id='amountatvj' name='amountatvj' onChange={handleChange} value={formData.amountatvj} disabled style={{ backgroundColor: '#d3d3d3', color: '#000' }} />
          </div>
          <div className="form-group">
            <label htmlFor='amountatmd1'>Amount at MD1</label>
            <input type="number" id='amountatmd1' name='amountatmd1' onChange={handleChange} value={formData.amountatmd1} />
          </div>
          <button className="button" type='submit'>Add</button>
        </form>
      </div>
    </div>
  );
};

export default MD1;
