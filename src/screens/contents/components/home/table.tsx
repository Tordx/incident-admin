import { fetchdata, fetchreport } from '../../../../firebase/function'
import React, { useEffect, useState } from 'react'
import { reportdata } from 'types/interfaces'
import IndividualChart from './individualChart'

type Props = {
  data: string
  selectedYear: string,
  title: string
}

export default function Table({data, selectedYear, title}: Props) {

  const [showdata, sethowData] = useState(false)
  const [actualdata,setdata] = useState<string>('')
  const [report, setreport] = useState<reportdata[]>([])
  const [incidenttype, setincidenttype] = useState<string[]>([])
  const [loading, setloading] = useState(false)
  const [,] = useState(false)
  const [bsort,setbsort] = useState(false)
  const [csort,setcsort] = useState(false)

  const handleDataSHow = (item: string) => {
    sethowData(true)
    setdata(item)
  }

  useEffect(() => {
    
    const fetchData = async() => {
      try {
  
        const result: reportdata[] = await fetchreport('incident', data) || [];
        const incidentDataByYear = result.filter((item) => {
            const itemYear = item.date?.split('/')[2];
            return itemYear === selectedYear;
        });
        setreport(incidentDataByYear);
        
        const filterIncidentType: string[] = incidentDataByYear
        .filter(item => item.reporttype == data ) 
        .map((item, index) => 
           item.actualincident,
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
    <>
                <strong>{title}</strong>
                  <div>
                    {showdata ? 
                      <>
                      <IndividualChart  infodata = {data} actual= {actualdata} year = {selectedYear} /> 
                      </>
                    :<table>
                      <thead className='dark-table'>
                        <tr>
                          <th>No.</th>
                          <th onClick={() => handleSort('city')}>Incident Name{bsort ? '↓' : '↑'}</th>
                          <th onClick={() => handleSort('count')}>Total Reported incident {csort ? '↓' : '↑'}</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Map through the tableData to populate the table */}
                        {sortedTableData.map(([city, count], index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{city}</td>
                            <td>{count}</td>
                            <td><a style = {{color: 'red'}} onClick={() => handleDataSHow(city)}>View</a></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>}
                  </div>
                  </>
  )
}