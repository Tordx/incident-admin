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
import IndividualChart from 'screens/contents/components/home/individualChart'

interface Coord {
  coordinates: [number, number][];
}

export default function Home({}) {

  const [isloading, setisloading] = useState(false);
  const [issuccess, setissuccess] = useState(false);
  const [report, setreport] = useState<reportdata[]>([])
  const [incidenttype, setincidenttype] = useState<string[]>([])
  const [accident, setaccident] = useState<reportdata[]>([]);
  const [calamities, setcalamities] = useState<reportdata[]>([]);
  const [crime, setcrime] = useState<reportdata[]>([]);
  const [selectedYear, setSelectedYear] = useState('2023');
  const [loading, setloading] = useState(false);
  const [showAccident, setshowAccident] = useState(false);
  const [showCalam, setshowCalam] = useState(false);
  const [showCrim, setshowCrim] = useState(false);
  const [bsort, setbsort] = useState(false)
  const [csort, setcsort] = useState(false)

  useEffect(() => {
    
  const fetchData = async() => {
    setloading(true)
    try {

      const result: reportdata[] = await fetchdata('incident') || [];
      const incidentDataByYear = result.filter((item) => {
          const itemYear = item.date?.split('/')[2];
          return itemYear === selectedYear;
      });
      setreport(incidentDataByYear);
      
      const filterIncidentType: string[] = incidentDataByYear
      .filter(item => item.barangay) 
      .map((item, index) => 
         item.barangay,
      );
      setincidenttype(filterIncidentType)
      
      setloading(false)
    } catch (err) {
      console.log(err)
      setloading(true)
    }
  }

  fetchData();
  },[selectedYear])


  const [displayCount, setDisplayCount] = useState(10);

   
  const occurencies = incidenttype.reduce((acc, city) => {
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tableData: [string, number][] = Object.entries(occurencies)

  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (column: any) => {
    if(column === 'city'){
      setbsort(!bsort)
    }
    if(column === 'count'){
      setcsort(!csort)
    }
    setSortedColumn(column);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedTableData = [...tableData].sort((a, b) => {
    const aValue = sortedColumn === 'city' ? a[0] : a[1];
    const bValue = sortedColumn === 'city' ? b[0] : b[1];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else {
      // Convert values to numbers before comparison
      const aValueNumber = Number(aValue);
      const bValueNumber = Number(bValue);

      return sortOrder === 'asc' ? aValueNumber - bValueNumber : bValueNumber - aValueNumber;
    }
  });

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
                <br/>
                <span className='data-length'>
                <h5>Selected Year: <strong>{selectedYear}</strong></h5>
                <h5>Total Reported Incidents: <strong>{report.length}</strong></h5>
                </span>
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
                  <div>
                    <table>
                      <thead className='dark-table'>
                        <tr>
                          <th>No.</th>
                          <th onClick={() => handleSort('city')}>Area of Incidents {bsort ? '↓' : '↑'}</th>
                          <th onClick={() => handleSort('count')}>Total Report this Month {csort ? '↓' : '↑'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Map through the tableData to populate the table */}
                        {sortedTableData.map(([city, count], index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{city}</td>
                            <td>{count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <br/>
                  <br/>
                  {showCalam ? 
                      <> 
                      <IndividualChart incidentType = {'Natural/Man-made Calamities'} year = {selectedYear} />
                      <br/>
                      <br/>
                      <button onClick={() => setshowCalam(false)}>Close</button>
                      </>
                  :
                      <div onClick={() => setshowCalam(true)}  className="image-box">
                        <img src="https://i.imgur.com/HBbbYkU.png" alt="Description of the image"/>
                        <div className="image-text">
                          <p>Natural/Man-made Calamities</p>
                        </div>  
                      </div>
                    }
                  <br/>
                  {showAccident ? 
                      <> 
                      <IndividualChart incidentType = {'Accidents'} year = {selectedYear} />
                      <br/>
                      <br/>
                      <button onClick={() => setshowAccident(false)}>Close</button>
                      </>
                  :
                      <div  onClick={() => setshowAccident(true)} className="image-box">
                      <img src="https://dornsife.usc.edu/wp-content/uploads/sites/7/2023/04/story-3195.jpg" alt="Description of the image"/>
                      <div className="image-text">
                        <p>Accidents</p>
                      </div>  
                      </div>
                    }
                  <br/>
                  {showCrim ? 
                      <> 
                      <IndividualChart incidentType = {'Crime Incidents'} year = {selectedYear} />
                      <br/>
                      <br/>
                      <button onClick={() => setshowCrim(false)}>Close</button>
                      </>
                  :
                      <div onClick={() => setshowCrim(true)}  className="image-box">
                      <img src="https://www.boholchronicle.com.ph/wp-content/uploads/2019/03/crime-scene-do-not-cross-3.png" alt="Description of the image"/>
                      <div className="image-text">
                        <p>Crime Incidents</p>
                       </div>  
                      </div>
                    }
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