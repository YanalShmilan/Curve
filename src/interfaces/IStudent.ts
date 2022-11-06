interface IStudent {
  'Serial No#': number;
  'Student ID': number;
  'Student Name Arabic': string;
  'Student Gender': string;
  'Email Address': string;
  Section: string;
  'Instruction Name Arabic': string;
  GPA: number;
  'Credit Registered': number;
  'Repeat Count': number;
  'Probation Count': number;
  'Is GPA Probated?': string;
  Major: string;
  Status?: string;
  Nationality: string;
  __rowNum__: number;
  First: string;
  Second: string;
  Final: string;
}

export default IStudent;
