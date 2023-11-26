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

      const result: reportdata[] = await fetchdata('incident', true) || [];
      setincidentdata(result)

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

  const countMap = report.reduce((acc: Record<string, number>, item: string) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
  
  const countArray = Object.entries(countMap).map(([itemName, count]) => ({ itemName, count }));
  
  countArray.sort((a, b) => b.count - a.count);
  
  const countElements = countArray.map(({ itemName, count }, index) => (
    <div key={index} className='progress-row'>
      <p>{itemName}</p>
      <p>{count}</p>
    </div>
  ));

  const countMapIncident = geocodingResults.reduce((acc: Record<string, number>, item: string) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
  
  const counIncidentArray = Object.entries(countMapIncident).map(([itemName, count]) => ({ itemName, count }));
  
  counIncidentArray.sort((a, b) => b.count - a.count);
  
  const countIncidentMap = counIncidentArray.map(({ itemName, count }, index) => (
    <div key={index} className='progress-row'>
      <p>{itemName}</p>
      <p>{count}</p>
    </div>
  ));

  console.log(countArray)

  const printableTable = (
    <table className='printable-table'>
      <thead>
        <tr>
          <th>Incident</th>
          <th>Occurrences</th>
        </tr>
      </thead>
      <tbody>
        {countArray.map(({ itemName, count }, index) => (
          <tr key={index}>
            <td>{itemName}</td>
            <td>{count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const sortedData = incidentdata.slice().sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  const printableIncidentTable = (
    <div>
    <table className="printable-table">
      <thead>
        <tr>
          <th>Reporter Name</th>
          <th>Incident Type</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {sortedData &&
          sortedData.map((item: reportdata, index) => (
            <tr key={index}>
              <td>{item.reporter}</td>
              <td>{item.reporttype}</td>
              <td>{item.date}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
  )

  const handlePrint = () => {
    const printableContent = renderToString(printableTable);
  
    if (printableContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <style>
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  .printable-table, .printable-table * {
                    visibility: visible;
                  }
                  .printable-table {
                    position: absolute;
                    left: 0;
                    top: 0;
                  }
                  table {
                    border-collapse: collapse;
                    width: 100%;
                  }
                  th, td {
                    border: 1px solid #dddddd;
                    text-align: left;
                    padding: 8px;
                  }
                  th {
                    background-color: #f2f2f2;
                  }
                }
              </style>
            </head>
            <body>
              ${printableContent}
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() {
                    printWindow.close();
                  }
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };
  
  const handleIncidentsPrint = () => {
    const printableIncidentData = renderToString(printableIncidentTable)
    if(printableIncidentData) {
      const printWindow = window.open('', '_blank');
      if(printWindow){
        printWindow.document.write(`
          <html>
            <head>
              <style>
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  .printable-table, .printable-table * {
                    visibility: visible;
                  }
                  .printable-table {
                    position: absolute;
                    left: 0;
                    top: 0;
                  }
                  table {
                    border-collapse: collapse;
                    width: 100%;
                  }
                  th, td {
                    border: 1px solid #dddddd;
                    text-align: left;
                    padding: 8px;
                  }
                  th {
                    background-color: #f2f2f2;
                  }
                }
              </style>
            </head>
            <body>
              ${printableIncidentData}
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() {
                    printWindow.close();
                  }
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }

  }


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
            <Cards>
              <div className='cards'>
                <div>
                <strong>Total No. of incidents</strong>
                <h4>{incidentdata.length}</h4>
                </div>
                <div>
                <span>Year</span>
                <select defaultValue = {selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value = ""label = 'Select Year' disabled/>
                  <option value = "2024"label = '2024'/>
                  <option value = "2023"label = '2023'/>
                  <option value = "2022"   label = '2022'/>
                </select>
                </div>
              </div>
            </Cards>
            <Cards>
              <div className='cards'>
                <div>
                <strong>Users Overview</strong>
                </div>
                <div>
                  <PieChart
                    slotProps={{
                      legend:{
                        
                        direction: 'column',
                        position: {
                          horizontal: 'right', 
                          vertical: 'middle'
                        },
                        itemMarkWidth: 10,
                        itemMarkHeight: 10,
                        labelStyle: {
                          fontSize: 12
                        }
                      },

                      
                    }}
                    series = {[{
                      data:[
                        {
                          id: 0, 
                          value: 50, 
                          label: `total users ${resident.length + responder.length}`,
                          color: 'teal'
                        },
                        {
                          id: 1, 
                          value: 10, 
                          label: `residents ${resident.length}`,
                          color: 'blue'
                        },
                        {
                          id: 2, 
                          value: 10, 
                          label: `responders ${responder.length}`,
                          color: 'red'
                        },
                       
                      ],
                      innerRadius: 30,
                      outerRadius: 100,
                      paddingAngle: 5,
                      cornerRadius: 5,
                      startAngle: 0,
                      endAngle: 360,
                      cx: 100,
                      cy: 150,
                    }]}
                  />
                </div>
                <div>
                <span>Year</span>
                <select defaultValue = {selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                  <option value = '' disabled label = 'select year'/>
                  <option value = "2024"   label = '2024'/>
                  <option value = "2023"label = '2023'/>
                  <option value = "2022"   label = '2022'/>
                </select>
                </div>
              </div>
            </Cards>
          </div>
          <Cards>
            <div className='cards'>
              <div> 
              <strong>Top 5 Incidents</strong>
              <a onClick={handlePrint}>print</a>
              </div>
              <div>
                <span  className='progress-wrapper'>
                    {countElements}
                </span>
              </div>
            <div>
                <span>Year</span>
                <select defaultValue = {selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                  <option value = '' disabled label = 'select year'/>
                  <option value = "2024" label = '2024'/>
                  <option value = "2023" label = '2023'/>
                  <option value = "2022"   label = '2022'/>
                </select>
                </div>
            </div>
          </Cards>
          <Cards>
            <div className='cards'>
              <div> 
              <strong>Area of most incidents</strong>
              </div>
              <div>
                <span  className='progress-wrapper'>
                    {countIncidentMap}
                </span>
              </div>
              <div>
                <span>Year</span>
                <select defaultValue = {selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                  <option value = '' disabled label = 'select year'/>
                  <option value = "2024" label = '2024'/>
                  <option value = "2023"label = '2023'/>
                  <option value = "2022" label = '2022'/>
                </select>
                </div>
            </div>
          </Cards>
        </div>
        <div className='dashboard-data-inner'>
          <div>
            <Cards>
            <div className='list-card'>
                  <div> 
                  <strong>Recent Incident Reports</strong>
                  <a onClick={handleIncidentsPrint}>print</a>
                  </div>
                  <div>
                 <Details displayCount={displayCount} data = {incidentdata} />
                  </div>
                  {incidentdata.length > displayCount && (
                    <div className="show-more-less">
                      
                      {displayCount > 20 ? <p onClick={handleShowLess}>Show Less</p> : <p onClick={handleShowMore}>Show More</p>}
                    </div>
                  )}
                  <div>
                    <span>Year</span>
                    <select defaultValue = {selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                      <option value = '' disabled label = 'select year'/>
                      <option value = "2024"   label = '2024'/>
                      <option value = "2023"label = '2023'/>
                      <option value = "2022"   label = '2022'/>
                    </select>
                    </div>
                </div>
              </Cards>
            </div>
            <div>
            <Cards>
                <div className='list-card'>
                  <div> 
                  <strong>New users & Reported incidents per month</strong>
                  </div>
                  <div>
                    <span>Year</span>
                    <select defaultValue = {selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                      <option value = '' disabled label = 'select year'/>
                      <option value = "2024"   label = '2024'/>
                      <option value = "2023"label = '2023'/>
                      <option value = "2022"   label = '2022'/>
                    </select>
                  </div>
                  <div>
                    <Chart year={selectedYear}/>
                  </div>
                  
                </div>
              </Cards>
            </div>
          </div>
          <Cards>
                <div className='map-card'>
                  <div> 
                  <strong>New users & Reported incidents per month</strong>
                  </div>
                  <div>
                    <Maps coordinates={coordinates}/>
                  </div>
                  <div>
                    <span>Year</span>
                    <select defaultValue = {selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                      <option value = '' disabled label = 'select year'/>
                      <option value = "2024"   label = '2024'/>
                      <option value = "2023"label = '2023'/>
                      <option value = "2022"   label = '2022'/>
                    </select>
                    </div>
                </div>
              </Cards>
        </div>
        }
      </div>
    </div>
  )
}