import React, { useEffect, useState } from 'react';
import { months } from 'screens/contents/constants/months';
import { BarChart } from '@mui/x-charts';
import { reportdata, userdata } from 'types/interfaces';
import { fetchdata, fetchreport, fetchusers } from '../../../../firebase/function';

type Props = {
  year: string;
};

function Chart({ year }: Props) {
  const [accident, setaccident] = useState<reportdata[]>([]);
  const [calamities, setcalamities] = useState<reportdata[]>([]);
  const [crime, setcrime] = useState<reportdata[]>([]);
  useEffect(() => {

    const fetchData = async () => {
      try {
        const Accidents: reportdata[] = await fetchreport('incident', 'Accidents') || [];

        const accidentresult = Accidents.filter((item) => {
          const itemYear = item.date?.split('/')[2];
          return itemYear === year;
        });
        setaccident(accidentresult);
        const Calamities: reportdata[] = await fetchreport('incident', 'Natural/Man-made Calamities') || [];

        const calamintiesresult = Calamities.filter((item) => {
          const itemYear = item.date?.split('/')[2];
          return itemYear === year;
        });
        setcalamities(calamintiesresult);
        const Crime: reportdata[] = await fetchreport('incident', 'Crime Incidents') || [];

        const crimeresult = Crime.filter((item) => {
          const itemYear = item.date?.split('/')[2];
          return itemYear === year;
        });
        setcrime(crimeresult);

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
        const dateParts = item.date.split('/'); // Assuming date is in the format MM-DD-YYYY
        const month = parseInt(dateParts[0], 10) - 1; // Adjust month index (0-based)

        monthData[month] += 1;
      }
    });

    return monthData;
  };

  const accidentresult = accumulateDataByMonth(accident);
  const calamintiesresult = accumulateDataByMonth(calamities);
  const crimeresult = accumulateDataByMonth(crime)

  return (
    <div id = 'chart-container'>
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
          
          { data: accidentresult, label: 'Accidents', color: '#D9D9D9',},
          { data: calamintiesresult, label: 'Natural/Man-Made Calamities', color: '#FE0000'},
          { data: crimeresult, label: 'Crime Incidents', color: '#606165'},
        ]}
        width={1400}
        height={500}
      />
    </div>
  );
}

export default Chart;
