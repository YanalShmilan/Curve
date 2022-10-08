interface IStudent {
  'Serial No#': number;
  'Student ID': number;
  'Student Name Arabic': string;
  'Student Gender': string;
  'Email Address': string;
  Section: number;
  'Instruction Name Arabic': string;
  GPA: number;
  'Credit Registered': number;
  'Repeat Count': number;
  'Probation Count': number;
  // 'Is GPA Probated?': string;
  Major: string;
  Status?: string;
  Nationality: string;
  __rowNum__: number;
}

export default IStudent;
