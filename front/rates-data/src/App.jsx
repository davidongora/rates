import { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css'; // Import the custom CSS

const App = () => {
  const [data, setData] = useState([]);

  const today = new Date();
  const stx = today.toDateString();

  useEffect(() => {
    axios.get('http://localhost:3000/api/sheetdata')
      .then(response => {
        console.log('API Response:', response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="header">
        <img src="./assets/wapi.png" alt="" />
        <span className="logo">Wapi</span>
        <span className="sublogo">pay</span>
      </h1>
      <h1 className="title">
        <span>Exchange Rates</span>
        <span>{stx}</span></h1>
      {/* <h1 className="date">{stx}</h1> */}

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Column Name</th>
              <th>Data Type</th>
              <th>Description</th>
              {/* <th>Primary Key</th>
              <th>Foreign Key</th> */}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <span className="footer">
        Licensed & Regulated by the Central Bank of Kenya & the Bank of Uganda
      </span>
      <hr className="separator" />
    </div>
  );
};

export default App;
