import React, { useState } from 'react';
import axios from 'axios';
// import config from '../Config';

const Add = () => {
    const [formData, setFormData] = useState({
        date: '',
        billnumber: '',
        name: '',
        fathername: '',
        address: '',
        phonenumber: '',
        itemtype: '',
        amount: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dateTimestamp = new Date(formData.date).getTime();
    
        try {
            // Insert customer data into the database
            const response = await axios.post("http://localhost:2033/insertcustomers", { ...formData, date: dateTimestamp });
    
            if (response.status === 200) {
                setFormData({
                    date: '',
                    billnumber: '',
                    name: '',
                    fathername: '',
                    address: '',
                    phonenumber: '',
                    itemtype: '',
                    amount: '',
                });
    
                // Send SMS to the entered phone number
                await axios.post("http://localhost:2033/sendsms", {
                    phonenumber: formData.phonenumber,
                    billnumber: formData.billnumber,
                    date: formData.date,
                    amount: formData.amount,
                });
            }
    
            setMessage(response.data);
            setError('');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data);
            } else {
                setError('An unexpected error occurred.');
            }
            setMessage('');
        }
    };
    

    return (
        <div>
            {message ? <h4 align="center">{message}</h4> : <h4 align="center">{error}</h4>}
            <div className="container">
                <h1 style={{ color: '#003366' }} >ADD BILL</h1>
                <form className='w-full py-3' onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor='date'>Date</label>
                        <input type="date" id='date' name='date' value={formData.date} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='billnumber'>Bill Number</label>
                        <input type="number" id='billnumber' name='billnumber' value={formData.billnumber} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='name'>Name</label>
                        <input type="text" id='name' name='name' value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='fathername'>Father Name</label>
                        <input type="text" id='fathername' name='fathername' value={formData.fathername} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='address'>Address</label>
                        <input type="text" id='address' name='address' value={formData.address} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='phonenumber'>Phone Number</label>
                        <input type="number" id='phonenumber' name='phonenumber' value={formData.phonenumber} onChange={handleChange} placeholder='Add 91 in starting' />
                    </div>
                    <div className="form-group">
                        <label htmlFor='itemtype'>Item Type</label>
                        <input type="text" id='itemtype' name='itemtype' value={formData.itemtype} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='amount'>Amount</label>
                        <input type="number" id='amount' name='amount' value={formData.amount} onChange={handleChange} />
                    </div>
                    <button className="button" type='submit' onClick={handleSubmit}>Add</button>
                    
                    </form>
            </div>
        </div>
    );
}

export default Add;
