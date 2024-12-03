import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Label } from "./components/ui/label";
import "../src/DynamicForm.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./components/ui/select";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { hardcodedapiresponse } from "./Api/hardcodedapiresponse";

const DynamicForm = ({ selectedForm, formData, formSubmitted, onSubmit }) => {
  const [isEditable, setisEditable] = useState(true);
  const [showSuccessMessage, setshowSuccessMessage] = useState("");
  const [formChanged, setFormChanged] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fields = hardcodedapiresponse[selectedForm]?.fields || [];
    fields.forEach((field) => {
      setValue(field.name, formData[selectedForm]?.[field.name] || "");
    });

    if (formSubmitted[selectedForm]) {
      setisEditable(false);
    } else {
      setisEditable(true);
    }
  }, [formSubmitted, selectedForm, setValue, formData]);

  const onFormSubmit = (data) => {
    onSubmit(data, selectedForm);
    setisEditable(false);
    setFormChanged(false);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);

    const successMessage = formChanged
      ? `${selectedForm} Edited Successfully!`
      : `${selectedForm} Submitted Successfully!`;

    setshowSuccessMessage(successMessage);
    setTimeout(() => {
      setshowSuccessMessage("");
    }, 3000);
  };

  const handleEdit = () => {
    setisEditable(true);
  };

  const handleInputChange = () => {
    setFormChanged(true);
    setValue(field.name, fieldValue);
    calculateProgress();
  };

  const renderFormFields = () => {
    const fields = hardcodedapiresponse[selectedForm]?.fields || [];
    return fields.map((field) => (
      <div key={field.name} className="mb-4">
        <Label
          className="block text-sm font-medium text-gray-700"
          htmlFor={field.name}
        >
          {field.label}
        </Label>

        {field.type === "dropdown" ? (
          <Controller
            control={control}
            name={field.name}
            rules={{ required: field.required }}
            defaultValue=""
            render={({ field: controllerField }) => (
              <Select
                {...controllerField}
                className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                onValueChange={(value) => {
                  controllerField.onChange(value);
                  handleInputChange();
                }}
                disabled={!isEditable}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`-- Select ${field.label} --`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        ) : (
          <Controller
            control={control}
            name={field.name}
            defaultValue=""
            rules={{ required: field.required }}
            render={({ field: controllerField }) => (
              <Input
                {...controllerField}
                type={field.type}
                className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                disabled={!isEditable}
                onChange={(e) => {
                  controllerField.onChange(e);
                  handleInputChange();
                }}
              />
            )}
          />
        )}
        {errors[field.name] && (
          <p className="text-red-500 text-xs mt-1">{`${field.label} is required.`}</p>
        )}
      </div>
    ));
  };

  const calculateProgress = () => {
    const fields = hardcodedapiresponse[selectedForm]?.fields || [];
    const totalRequired = fields.filter((field) => field.required).length;

    if (totalRequired === 0) return 100;

    const filledFields = fields.filter(
      (field) =>
        field.required && (control._formValues[field.name] || "").trim() !== ""
    ).length;

    return Math.round((filledFields / totalRequired) * 100);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="mt-6 relative">
      {renderFormFields()}

      <div className="mt-4">
        <div className="relative h-4 w-full bg-gray-200 rounded-md">
          <div
            className="absolute h-4 bg-blue-500 rounded-md"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {calculateProgress()}% Completed
        </p>
      </div>

      {/* Success Animation */}
      {showAnimation && <div className="success-animation">✔</div>}

      {showSuccessMessage && (
        <p className="text-green-500 text-sm mt-4">{showSuccessMessage}</p>
      )}

      {(isEditable || !formSubmitted[selectedForm]) && (
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 mt-4 rounded-md hover:bg-blue-600"
        >
          Submit
        </Button>
      )}

      {formSubmitted[selectedForm] && !isEditable && !formChanged && (
        <Button
          type="button"
          className="w-full bg-yellow-500 text-white p-2 mt-4 rounded-md hover:bg-yellow-600"
          onClick={handleEdit}
        >
          Edit
        </Button>
      )}
    </form>
  );
};

export default DynamicForm;
