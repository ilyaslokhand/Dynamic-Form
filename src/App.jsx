import React, { useState } from "react";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import DynamicForm from "./DynamicForm";
import DataTable from "./DataTable";

const App = () => {
  const [selectedForm, setSelectedform] = useState();
  const [formData, setFormData] = useState({});
  const [formSubmitted, setFormSubmitted] = useState({});
  const [allFormData, setAllFormData] = useState([]);

  const handleFormSelect = (value) => {
    setSelectedform(value);
  };

  const handleSubmit = (data, section) => {
    setFormData((prevData) => ({ ...prevData, [section]: data }));
    setFormSubmitted((prevState) => ({ ...prevState, [section]: true }));
    const flattenedData = Object.entries(data).map(([key, value]) => ({
      field: key,
      value,
    }));
    setAllFormData((prevData) => [...prevData, ...flattenedData]);
  };

  const handleEdit = (field, newValue) => {
    setAllFormData((prevData) =>
      prevData.map((item) =>
        item.field === field ? { ...item, value: newValue } : item
      )
    );
  };

  const handleDelete = (field) => {
    setAllFormData((prevData) =>
      prevData.filter((item) => item.field !== field)
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dynamic Form Implementation Using ReactJS
      </h1>
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <Label
          className="block text-sm font-medium text-gray-700 mb-2"
          htmlFor="formType"
        >
          Select Form Type:
        </Label>
        <Select className="w-full" onValueChange={handleFormSelect}>
          <SelectTrigger className="w-full border border-gray-300 rounded-md p-2 text-gray-700">
            <SelectValue placeholder="--Select--" />
          </SelectTrigger>
          <SelectContent className="mt-1 border border-gray-200 rounded-md shadow-lg bg-white z-10">
            <SelectItem
              value="User Information"
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              User Information
            </SelectItem>
            <SelectItem
              value="Address Information"
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              Address Information
            </SelectItem>
            <SelectItem
              value="Payment Information"
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              Payment Information
            </SelectItem>
          </SelectContent>
        </Select>
        {selectedForm && (
          <DynamicForm
            selectedForm={selectedForm}
            formData={formData}
            formSubmitted={formSubmitted}
            onSubmit={handleSubmit}
          />
        )}
      </div>
      <DataTable
        formData={allFormData}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
