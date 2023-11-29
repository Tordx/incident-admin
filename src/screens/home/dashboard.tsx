import React, {useState, useEffect} from 'react'
import { Header } from 'screens/contents/components/gen/header'
import Data from 'screens/contents/components/home/data'
import Navbarmenu from 'screens/contents/components/gen/navigator/navbarmenu'
import { reportdata, userdata } from 'types/interfaces'
import { fetchdata, fetchusers } from '../../firebase/function'
import './styles/styles.css'
import { collection, getDocs, onSnapshot } from '@firebase/firestore'
import { db } from '../../firebase/'
import { Card } from 'react-bootstrap'
import Cards from 'screens/contents/components/home/card'
import { PieChart } from '@mui/x-charts'
import Details from 'screens/contents/components/home/details'
import Chart from 'screens/contents/components/home/barchart'
import Maps from 'screens/contents/components/home/map'
import { Coordinate } from 'mapbox-gl'
import { renderToString } from 'react-dom/server';

interface Coord {
  coordinates: [number, number][];
}

export default function Home({}) {

  const [incidentdata, setincidentdata] = useState<reportdata[]>([])
  const [userdata, setuserdata] = useState<userdata[]>([])
  const [resident, setresident] = useState<userdata[]>([])
  const [responder, setresponder] = useState<userdata[]>([])
  const [city, setcity] = useState([])
  const [isloading, setisloading] = useState(false);
  const [issuccess, setissuccess] = useState(false);
  const [report, setreport] = useState<string[]>([])
  const [geocodingResults, setGeocodingResults] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState('2023');
  const [coordinates, setcoordinates] = useState<[number, number][]>([])
  const [loading, setloading] = useState(false)

  useEffect(() => {
    
  const fetchData = async() => {
    setloading(true)
    try {

      const result: reportdata[] = await fetchdata('incident') || [];
      const incidentDataByYear = result.filter((item) => {
          const itemYear = item.date?.split('/')[2];
          return itemYear === selectedYear;
      });
      setincidentdata(incidentDataByYear)

      const filteredReportType: string[] = incidentDataByYear
      .filter(item => item.reporttype) 
      .map((item, index) => 
         item.reporttype,
      );
      setreport(filteredReportType);
      console.log(filteredReportType)
       
      const mapResults: Coord = {
        coordinates: incidentDataByYear
          .filter((item) => item.reporttype)
          .map((item) => item.coordinates),
      };
      
      
      setcoordinates(mapResults.coordinates)
      setloading(false)
    } catch (err) {
      console.log(err)
      setloading(true)
    }
  }

  fetchData();
  fetchUsers();
  },[selectedYear])


  const [displayCount, setDisplayCount] = useState(10);

  const handleShowMore = () => {
    setDisplayCount(displayCount + 10);
  };

  const handleShowLess = () => {
    setDisplayCount(10);
  };


  useEffect(() => {
    const fetchData = async () => {
      const results = [];
      
      for (const item of incidentdata) {
        if (item.coordinates[0] !== null && item.coordinates[1] !== null) {
          const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${item.coordinates[1]}&lon=${item.coordinates[0]}`;
  
          try {
            const response = await fetch(reverseGeocodingUrl);
  
            if (response.ok) {
              const data = await response.json();
              const { address } = data;
              const city = address.street || address.road || address.city || address.town || address.village || address.county || address.state;
              const state = address.county || address.state;
              results.push(city);
            } else {
              console.error('Reverse geocoding request failed.');
              results.push(null);
            }
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            results.push(null);
          }
        } else {
          results.push(null);
        }
      }
  
      setGeocodingResults(results.filter(city => city !== null) as (string)[]);
    };
  
    fetchData();
  }, []);

   

  const fetchUsers =async () => {
    try {

      const result: userdata[] = await fetchusers() || [];
      setuserdata(result)
      const responderdata = result.filter((item) => item.userType === 'Admin' || item.type !== 'user')
      setresponder(responderdata)
      const residentdata = result.filter((item) => item.type === 'user')
      setresident(residentdata)
    } catch(err) {
      console.log(err)
    }
  }

  const cityOccurrences = geocodingResults.reduce((acc, city) => {
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tableData: [string, number][] = Object.entries(cityOccurrences)


  return (
    <div className='container'>
      {isloading && 
        <div className='loading-modal'>
          <div className='loading-content'>
            <div className='spinner'></div>
            <span>loading</span>
          </div>
        </div>
      }
       {issuccess && 
        <div className="loading-modal">
          <div className="loading-content success-modal">
            <h2>Dispatch Successful</h2>
            <p>Make sure the dispatch unit is on their way.</p>
          </div>
        </div>
      }
      <Header menu={Navbarmenu}/>
      <div className='data-wrapper'>
        {loading ? 
        <div className = 'no-data-container'>
         <span className='loading-spinner'>..</span>
          <h2>Loading Data</h2>
          <p>Make sure you're connected to the internet.</p>
        </div>
        :
        <div className='dashboard-data-off'>
          <div className='dashboard-data-inner'>
            <div>
              <div className='cards'>
                <strong>Reported Incident per month</strong>
                <span>
                <select defaultValue={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                  <option disabled label='Select year' value="" />
                  <option label='2024' value={'2024'} />
                  <option label='2023' value={'2023'} />
                  <option label='2022' value={'2022'} />
                </select>
                </span>
                <div>
                  <Chart year={selectedYear}/>
                </div>
              </div>
              <div className='cards cardmargin'>
                <strong>Total Incident Report per Area </strong>
                <br/>
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>Area of Incidents</th>
                          <th>Total Report this Month</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Map through the tableData to populate the table */}
                        {tableData.map(([city, count], index) => (
                          <tr key={index}>
                            <td>{city}</td>
                            <td>{count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <br/>
                </div>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  )
}