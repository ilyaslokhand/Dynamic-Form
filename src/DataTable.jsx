import React, { useState } from "react";
import { Button } from "./components/ui/button";

const DataTable = ({ formData, handleEdit, handleDelete }) => {
  const [isEditing, setIsEditing] = useState(null);
  const [newValue, setNewValue] = useState("");

  const handleValueChange = (e) => {
    setNewValue(e.target.value);
  };

  const handleEditClick = (field, currentValue) => {
    setIsEditing(field);
    setNewValue(currentValue);
  };

  const handleSubmitEdit = (field) => {
    handleEdit(field, newValue);
    setIsEditing(null);
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Submitted Data
      </h2>
      {formData.length === 0 ? (
        <p className="text-gray-600">No data submitted yet.</p>
      ) : (
        <table className="table-auto w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Field</th>
              <th className="px-4 py-2 border">Data</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formData.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border font-semibold">{item.field}</td>
                <td className="px-4 py-2 border">
                  {isEditing === item.field ? (
                    <input
                      type="text"
                      value={newValue}
                      onChange={handleValueChange}
                      className="border border-gray-300 p-2"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {JSON.stringify(item.value, null, 2)}
                    </pre>
                  )}
                </td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    {isEditing === item.field ? (
                      <Button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => handleSubmitEdit(item.field)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => handleEditClick(item.field, item.value)}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(item.field)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DataTable;
