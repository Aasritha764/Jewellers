import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './TakenAway.css';
import config from '../Config';

export default function ViewCustomers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const navigate = useNavigate(); 

  const getmdbybillno = async (billnumber) => {
    try {
      const response = await axios.get(`${config.url}/getmdbybillno/${billnumber}`);
      if (response.data.collection === 'md1') {
        return 'MD1';
      } else if (response.data.collection === 'md2') {
        return 'MD2';
      } else {
        return 'Not Found';
      }
    } catch (error) {
      console.error(error.message);
      return 'vj';
    }
  };

  const fetchViewCustomers = useCallback(async () => {
    try {
      const response = await axios.get(`${config.url}/viewcustomers`);
      const customersWithFormattedDate = response.data.map(customer => ({
        ...customer,
        date: new Date(customer.date).toLocaleDateString('en-GB')
      }));

      const customersWithMdData = await Promise.all(customersWithFormattedDate.map(async customer => {
        const thereat = await getmdbybillno(customer.billnumber);
        return {
          ...customer,
          thereat
        };
      }));

      setCustomers(customersWithMdData);
      setFilteredCustomers(customersWithMdData);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchViewCustomers();
  }, [fetchViewCustomers]);

  const deleteCustomer = async (billnumber) => {
    try {
      // Fetch the customer details
      const customerResponse = await axios.get(`${config.url}/customer/${billnumber}`);
      const customer = customerResponse.data;

      // Store the deleted record in the "taken away" database
      await axios.post(`${config.url}/insertcustomer`, customer);

      // Delete the customer from the appropriate collection
      const thereat = await getmdbybillno(billnumber);
      if (thereat === 'MD1') {
        await axios.delete(`${config.url}/deletemd1/${billnumber}`);
      } else if (thereat === 'MD2') {
        await axios.delete(`${config.url}/deletemd2/${billnumber}`);
      }

      await axios.delete(`${config.url}/deletecustomer/${billnumber}`);

      // Fetch updated customers list and navigate to takenaway page
      fetchViewCustomers();
      // navigate('/takenaway');
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleMD1Click = (customer) => {
    navigate('/md1', { state: { billnumber: customer.billnumber, name: customer.name, amountatvj: customer.amount } });
  };
  
  const handleMD2Click = (customer) => {
    navigate('/md2', { state: { billnumber: customer.billnumber, name: customer.name, amountatvj: customer.amount } });
  };

  const handleTakeAwayClick = (customer) => {
    navigate('/totalamount', { state: { date: customer.date, billnumber: customer.billnumber, name: customer.name, amount: customer.amount } });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = customers.filter(customer =>
      customer.billnumber.toString().includes(event.target.value) ||
      customer.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Customers</h1>
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search by Bill Number or Name..." 
          value={searchTerm} 
          onChange={handleSearch} 
          style={{ padding: '5px', marginRight: '10px' }}
        />
      </div>
      <table border={1} align="center" style={{ width: 'auto', height: 'auto' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Bill Number</th>
            <th>Name</th>
            <th>Father Name</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Item Type</th>
            <th>Amount</th>
            <th>There At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredCustomers) && filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.date}</td>
                <td>{customer.billnumber}</td>
                <td>{customer.name}</td>
                <td>{customer.fathername}</td>
                <td>{customer.address}</td>
                <td>{customer.phonenumber}</td>
                <td>{customer.itemtype}</td>
                <td>{customer.amount}</td>
                <td>{customer.thereat}</td>
                <td>
                  <button onClick={() => handleTakeAwayClick(customer)} className='button'>Take Away</button>
                </td>
                <td>
                  <button onClick={() => handleMD1Click(customer)} className='button'>MD1</button>
                </td>
                <td>
                  <button onClick={() => handleMD2Click(customer)} className='button'>MD2</button>
                </td>
                <td>
                  <button onClick={() => deleteCustomer(customer.billnumber)} className='button'>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12">Data Not Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
