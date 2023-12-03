import { reportdata, userdata } from 'types/interfaces';
import { collection, getDocs } from '@firebase/firestore'
import { db } from '..';

 export const fetchdata = async(data: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, data));
    const thisdata: reportdata[] = []
    querySnapshot.forEach((doc) => {
      thisdata.push({
        _reporttype: doc.data()._reporttype,
        _report: doc.data()._report,
        type: doc.data().type,
        time: doc.data().time,
        incidentID: doc.data().incidentID,
        coordinates:doc.data().coordinates,
        description: doc.data().description,
        media: doc.data().media,
        mdiatype: doc.data().mediatype,
        victiminfo: doc.data().victiminfo,
        number: doc.data().number,
        reporter: doc.data().reporter,
        reporterID: doc.data().reporterID,
        reporterphotoURL: doc.data().reporterphotoURL,
        reporttype: doc.data().reporttype,
        date: doc.data().date,
        responded: doc.data().responded,
        recording: doc.data().recording,
        incidenttype: doc.data().incidenttype,
        barangay: doc.data().barangay,
      })
    })

    return thisdata;

  } catch(error){
    console.log(error)
  }
  }

  export const fetchreport = async(data: string, response: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, data));
      const thisdata: reportdata[] = []
      querySnapshot.forEach((doc) => {
        if(doc.data().reporttype === response)
        thisdata.push({
          _reporttype: doc.data()._reporttype,
          _report: doc.data()._report,
          type: doc.data().type,
          time: doc.data().time,
          incidentID: doc.data().incidentID,
          coordinates:doc.data().coordinates,
          description: doc.data().description,
          media: doc.data().media,
          mdiatype: doc.data().mediatype,
          victiminfo: doc.data().victiminfo,
          number: doc.data().number,
          reporter: doc.data().reporter,
          reporterID: doc.data().reporterID,
          reporterphotoURL: doc.data().reporterphotoURL,
          reporttype: doc.data().reporttype,
          date: doc.data().date,
          responded: doc.data().responded,
          recording: doc.data().recording,
          incidenttype: doc.data().incidenttype,
          barangay: doc.data().barangay,
        })
      })
  
      return thisdata;
  
    } catch(error){
      console.log(error)
    }
    }

    export const fetchbarangay = async(data: string, response: string) => {
      try {
        const querySnapshot = await getDocs(collection(db, data));
        const thisdata: reportdata[] = []
        querySnapshot.forEach((doc) => {
          if(doc.data().barangay === response)
          thisdata.push({
            _reporttype: doc.data()._reporttype,
            _report: doc.data()._report,
            type: doc.data().type,
            time: doc.data().time,
            incidentID: doc.data().incidentID,
            coordinates:doc.data().coordinates,
            description: doc.data().description,
            media: doc.data().media,
            mdiatype: doc.data().mediatype,
            victiminfo: doc.data().victiminfo,
            number: doc.data().number,
            reporter: doc.data().reporter,
            reporterID: doc.data().reporterID,
            reporterphotoURL: doc.data().reporterphotoURL,
            reporttype: doc.data().reporttype,
            date: doc.data().date,
            responded: doc.data().responded,
            recording: doc.data().recording,
            incidenttype: doc.data().incidenttype,
            barangay: doc.data().barangay,
          })
        })
    
        return thisdata;
    
      } catch(error){
        console.log(error)
      }
      }

  export const fetchusers = async() => {
    try {
      const querySnapshot = await getDocs(collection(db, 'user'));
      const thisdata: userdata[] = []
      querySnapshot.forEach((doc) => {
        thisdata.push({
            email: doc.data().email,
            fullname:  doc.data().fullname,
            firstname:  doc.data().firstname,
            lastname:  doc.data().lastname,
            middlename:  doc.data().middlename,
            suffix:  doc.data().suffix,
            photo:  doc.data().photo,
            contactnumber:  doc.data().contactnumber,
            username:  doc.data().username,
            password:  doc.data().password,
            rpassword:  doc.data().rpassword,
            uid:  doc.data().uid,
            type:  doc.data().type,
            userType: doc.data().userType,
            createdate: doc.data().createdate,
        
        })
      })
  
      return thisdata;
  
    } catch(error){
      console.log(error)
    }
    }
  

  export const CalculateDistance = (coord1: { latitude: number; longitude: number }, coord2: [number, number]) => {
    const { latitude: lat1, longitude: lon1 } = coord1;
    const lon2 = coord2[0];
    const lat2 = coord2[1];
    const earthRadius = 6371;

    const degToRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = c * earthRadius ;

    return distance;

};