import React, { useEffect, useState } from 'react';
import { months } from 'screens/contents/constants/months';
import { BarChart } from '@mui/x-charts';
import { reportdata, userdata } from 'types/interfaces';
import { fetchdata, fetchreport, fetchusers } from '../../../../firebase/function';

type Props = {
  year: string;
  infodata: string,
  actual: string,
};

function IndividualChart({ infodata, actual, year }: Props) {
  const [data, setdata] = useState<reportdata[]>([]);
  useEffect(() => {

    const fetchData = async () => {
      try {
        const Accidents: reportdata[] = await fetchreport('incident', infodata) || [];

        const accidentresult = Accidents.filter((item) => {
          const itemYear = item.date?.split('/')[2];
          return itemYear === year;
        });

        const filterIncidentType: reportdata[] = accidentresult
        .filter((item) => item.actualincident === actual);
        setdata(filterIncidentType)

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    
  }, [year]);

  const accumulateDataByMonth = (data: any[]) => {
    const monthData = new Array(12).fill(0);

    data.forEach((item) => {
      if (item.date !== undefined) {
        const dateParts = item.date.split('/'); 
        const month = parseInt(dateParts[0], 10) - 1;

        monthData[month] += 1;
      }
    });

    return monthData;
  };

  const processeddata = accumulateDataByMonth(data);

  return (
    <>
      <BarChart
        xAxis={[{ scaleType: 'band', data: months }]}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: -30
            
          },
          
        }}
        series={[
          
          { data: processeddata, label: actual, color: '#FE0000'},
        ]}
        width={1500}
        height={300}
      />
    </>
  );
}

export default IndividualChart;
