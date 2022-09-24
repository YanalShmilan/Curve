// Components
import TableEditor from '../TableEditor';

// Interfaces
import IStudent from '../../interfaces/IStudent';

// Utils
import _ from 'lodash';

// Props
type homeProps = {
  data: IStudent[];
  setSpreadSheetData: React.Dispatch<React.SetStateAction<any>>;
};

const Home = ({ data, setSpreadSheetData }: homeProps) => {
  return (
    <TableEditor
      spreadSheetData={data}
      setSpreadSheetData={setSpreadSheetData}
      fileName="Students"
      sheetName="Students"
    />
  );
};

export default Home;
