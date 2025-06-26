import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TotalAmount() {
  const location = useLocation();
  const navigate = useNavigate();
  const { billnumber, name, amount, date } = location.state;

  // Parse the provided date in "dd/mm/yy" format
  const [day, month, year] = date.split('/');
  const providedDate = new Date(`${year}`, month - 1, day); // Subtract 1 from month since it's zero-based

  // Print the provided date and today's date in the console
  console.log('Provided Date:', providedDate);
  console.log("Today's Date:", new Date());

  // Calculate the time difference in milliseconds
  const today = new Date();
  const timeDifferenceInMilliseconds = Math.abs(today - providedDate);

  // Convert milliseconds to days
  const timeDifferenceInDays = Math.ceil(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));

  // Print the number of days to the console
  console.log('Number of days:', timeDifferenceInDays);

  // Assuming time is provided in months and the rate is 3 rupees per month
  const rateOfInterest = 3;
  let time;
  if (timeDifferenceInDays < 30) {
    // If time difference is less than 30 days, consider it as one month
    time = 1;
  } else {
    time = Math.ceil(timeDifferenceInDays / 30); // Otherwise, calculate the time in months
  }

  const interest = amount * rateOfInterest * time / 100;
  const totalAmount = amount + interest;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ fontSize: '40px' }}>Customer Details</h2>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Bill Number:</strong> {billnumber}</p>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Amount:</strong> {amount}</p>
        <p><strong>Time Duration:</strong> {time} month(s)</p>
        <p><strong>Interest Rate:</strong> {rateOfInterest} rupees per month</p>
        <p><strong>Total Interest:</strong> {interest}</p>
        <p><strong>Total Amount (with interest):</strong> {totalAmount}</p>
        <button onClick={() => navigate(-1)} style={styles.button}>Go Back</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    
  },
  card: {
    backgroundColor: '#fff',
    padding: '50px',
    borderRadius: '10px',
    boxShadow: '0 8px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    textAlign: 'left',
  },
  button: {
    marginTop: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
