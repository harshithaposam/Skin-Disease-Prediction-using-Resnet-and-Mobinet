import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Card,
  CardContent,
  Button,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SkinDiseasePredictor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select an image first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setPredictions(response.data.predictions);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "An unexpected error occurred. Please try again."
      );
    }
    setLoading(false);
  };

  const handleInfoClick = (infoType) => {
    setSelectedInfo(infoType);
  };

  const detectedDisease = predictions
    ? Object.entries(predictions).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
    : null;

  const chartData = {
    labels: predictions ? Object.keys(predictions) : [],
    datasets: [
      {
        label: "% Probability",
        data: predictions ? Object.values(predictions) : [],
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#E91E63"],
      },
    ],
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-6">
      <Typography variant="h4" className="mb-6 font-bold text-gray-800">
        Skin Disease Prediction App
      </Typography>

      {errorMessage && (
        <div className="text-red-500 bg-red-100 p-2 rounded mt-2 shadow-sm">
          {errorMessage}
        </div>
      )}

      <Card className="bg-white shadow-lg p-6 rounded-lg w-full max-w-lg text-center">
        <TextField
          type="file"
          inputProps={{ accept: "image/*" }}
          onChange={handleFileChange}
          fullWidth
          variant="outlined"
          className="mb-4"
        />
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          className="w-full"
        >
          Upload Image
        </Button>
      </Card>

      {imagePreview && (
        <div className="mt-6">
          <img
            src={imagePreview}
            alt="Uploaded Preview"
            className="w-64 h-64 object-cover rounded-lg shadow-md border"
          />
        </div>
      )}

      {loading && <CircularProgress className="mt-4" />}

      {predictions && (
        <Card className="w-full max-w-2xl mt-6 shadow-lg rounded-lg p-6">
          <CardContent>
            <div className="flex justify-center">
              <Bar data={chartData} />
            </div>

            {detectedDisease && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                <Typography variant="h6" className="font-semibold text-gray-700">
                  Detected Disease: {detectedDisease} ({predictions[detectedDisease].toFixed(2)}% Probability)
                </Typography>

                <div className="flex gap-4 mt-3 justify-center">
                  {["Prevention", "Medicine", "Diet"].map((info) => (
                    <Button
                      key={info}
                      variant={selectedInfo === info ? "contained" : "outlined"}
                      color="secondary"
                      onClick={() => handleInfoClick(info)}
                      className="capitalize"
                    >
                      {info}
                    </Button>
                  ))}
                </div>

                {selectedInfo && (
                  <Typography className="mt-3 text-gray-600">
                    <span className="font-semibold">{selectedInfo}</span> information for{" "}
                    {detectedDisease} will be displayed here...
                  </Typography>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};