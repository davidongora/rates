import { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
import { FaDollarSign, FaEuroSign, FaYenSign, FaPoundSign } from 'react-icons/fa';
import { MdCurrencyExchange } from 'react-icons/md';
import logo from './assets/logo.png';
const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const today = new Date();
  const stx = today.toDateString();
  const countryIconMap = {
    "USD-UGX": <FaDollarSign />,
    "USD-KES": <FaDollarSign />,
    "EUR-USD": <FaEuroSign />,
    "USD-TZS": <FaDollarSign />,
    "USD-JPY": <FaYenSign />,
    "USD-SGD": <FaDollarSign />,
    "USD-CNY": <FaDollarSign />,
    "CNY-KES": <FaYenSign />,
    "GBP-KES": <FaPoundSign />,
    "EUR-KES": <FaEuroSign />,
    "USD-ZAR": <FaDollarSign />,
    "KES-UGX": <FaDollarSign />,
  };

  const url = import.meta.env.VITE_URL
  console.log (url, 'jjjjjjj')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url);
        // console.log('API Response:', response.data);
        setData(response.data);
        setError(null);
        setLastRefreshed(new Date());
      } catch (error) {
        // console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000 * 360);
    const timeUpdateId = setInterval(() => {
      setLastRefreshed(prev => prev);
    }, 1000);
    return () => {
      clearInterval(intervalId);
      clearInterval(timeUpdateId);
    };
  }, []);
  const timeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hours ago`;
    }
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} days ago`;
    }
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} months ago`;
    }
    const years = Math.floor(months / 12);
    return `${years} years ago`;
  };
  return (
    <div className="container">
      <h1 className="header">
      <img src={logo} alt="Logo" style={{ width: '220px', height: 'auto',marginBottom:'170px',marginTop:'-20px' }} />
        {/* <span className="logo">Wapi</span> */}
        {/* <span className="sublogo">pay</span> */}
      </h1>
      <h1 className="title">
        <span>Exchange Rates</span>
        {/* <span>Exchange Rates <MdCurrencyExchange /> </span> */}
        <span>{stx}</span>
        {/* <h6>{lastRefreshed ? `Last refreshed ${timeAgo(lastRefreshed)}` : ''}</h6> */}
      </h1>
      <div className="table-container">
        {loading ? (
          <div className="spinner">
            <img src={logo} alt="Loading..." />
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Currency</th>
                <th>Buying</th>
                <th>Selling</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className='country 'style={{ fontSize: '1.2em' }}>
                      {row["COUNTRY"] && countryIconMap[row["COUNTRY"]] ? (
                        <>
                        {countryIconMap[row["COUNTRY"]]} {row["COUNTRY"]}
                        </>
                      ) : (
                        <span>No Icon</span>
                      )}
                    </td>
                    <td className='country 'style={{ fontSize: '1.2em',fontWeight:'bold'}}>{row["BUY"]}</td>
                    <td className='country 'style={{ fontSize: '1.2em',fontWeight:'bold'}}>{row["SELL"]}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <span className="footer">
        Licensed & Regulated by the Central Bank of Kenya & the Bank of Uganda
      </span>
      <hr className="separator" />
    </div>
  );
};
export default App;
