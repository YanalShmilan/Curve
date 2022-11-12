import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import React from 'react';

// XLSX
import { read, utils } from 'xlsx';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  questions: string[];
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  examName: string;
}

const GradeModal = ({
  open,
  setOpen,
  questions,
  data,
  setData,
  examName,
}: Props) => {
  const handleFile = async (e: any, question: string) => {
    const file = e.target.files[0];
    const fileName = await file.arrayBuffer();
    const sheet = read(fileName);
    const sheetName = sheet.SheetNames[0];
    const sheetData = utils.sheet_to_json(sheet.Sheets[sheetName], {
      header: 1,
    });
    const filteredData = sheetData.filter((row: any) => {
      if (row[0] !== undefined) {
        return row;
      }
    });
    const latestData = filteredData.slice(
      filteredData.length - data.length
    );
    const questionIndex = data[0].findIndex(
      (item: string) => item === question
    );
    const idIndex = data[0].findIndex(
      (item: string) => item === `${examName} - id`
    );
    console.log(latestData);

    const newData = data.map((row: any, index: number) => {
      if (index !== 0) {
        const id = row[idIndex];
        console.log(id);

        // @ts-ignore
        const grade = latestData[id][1] ? latestData[id][1] : 'N/A';
        row[questionIndex] = grade;
        return row;
      }
      return row;
    });
    setData(newData);
  };
  // map each question with a file input
  const questionInputs = questions.map((question) => (
    <div className="flex flex-col">
      <label className="text-gray-700">{question}</label>
      <input
        type="file"
        className="border border-gray-300 rounded-md"
        onChange={(e) => handleFile(e, question)}
      />
    </div>
  ));
  return (
    <Dialog open={open} handler={setOpen}>
      <DialogHeader>Grade</DialogHeader>
      <DialogBody divider className="flex flex-row flex-wrap gap-4">
        {questionInputs}
      </DialogBody>
      <DialogFooter>
        <Button
          className="btnActive"
          variant="gradient"
          color="green"
          onClick={() => {
            setOpen(false);
          }}
        >
          <span>Done</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default GradeModal;
