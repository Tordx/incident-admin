export type Children = {
  children: any | null;
}


export interface logindata {
  agencyname: string,
  contactnumber: string,
  email: string,
  photoURL: string,
  type: string,
  uid: string,
  username: string,
  userType: string,
  
}

export interface userdata {
  email: string,
  fullname: string,
  firstname: string,
  lastname: string,
  middlename: string,
  suffix: string,
  photo: string,
  contactnumber: string,
  username: string,
  password: string,
  rpassword: string,
  uid: string,
  type: string,
  userType: string,
  createdate: string,
}

export interface reportdata {

  _reporttype: any,
  _report: any,
  type: string,
  time: number,
  incidentID: string,
  coordinates: [number, number],
  description: string,
  media: string,
  mdiatype: string,
  victiminfo: [{ names: string[], gender:string[], age: string[]}],
  number: string,
  reporter: string,
  reporterID: string,
  reporterphotoURL: string,
  reporttype: string,
  date: string,
  responded: boolean,
  recording: string,



}

export interface locationdata {
  
  _location: any,
  coords: any,
}

export interface incidentiddata {
  incidentID: string,
  _incidentid: any,

}