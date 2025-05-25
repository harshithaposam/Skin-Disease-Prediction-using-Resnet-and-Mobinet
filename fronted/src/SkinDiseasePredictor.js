

import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import "./skin.css"
import {
  Card,
  CardContent,
  Button,
  Typography,
  CircularProgress,
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [predictions, setPredictions] = useState({});
  const [selectedInfo, setSelectedInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const diseases = ["akiec", "bcc", "bkl", "df", "nv", "vasc", "mel"];
  const diseaseFullForms = {
    akiec: "Actinic Keratoses and Intraepithelial Carcinoma",
    bcc: "Basal Cell Carcinoma",
    bkl: "Benign Keratosis-like Lesions",
    df: "Dermatofibroma",
    nv: "Melanocytic Nevi",
    vasc: "Vascular Skin Lesions",
    mel: "Melanoma",
  };
  const recommendations = {

      "akiec": {
          "prevention": [
              "Avoid prolonged sun exposure, especially during peak hours (10 AM to 4 PM).",
              "Apply broad-spectrum sunscreen with SPF 30 or higher regularly.",
              "Wear protective clothing, including wide-brim hats and long-sleeved shirts.",
              "Avoid tanning beds and artificial UV sources.",
              "Regularly check your skin for changes and consult a dermatologist for suspicious lesions."
          ],
          "medicine": [
              "Topical 5-fluorouracil (5-FU) for early-stage lesions.",
              "Imiquimod cream to boost the immune response.",
              "Cryotherapy (freezing) for small lesions.",
              "Surgical excision for advanced cases."
          ],
          "diet": [
              "Consume antioxidant-rich foods such as berries, green tea, and dark leafy vegetables.",
              "Include foods high in omega-3 fatty acids, like salmon, flaxseeds, and walnuts.",
              "Vitamin C and E-rich foods (citrus fruits, nuts, and seeds) to support skin health.",
              "Drink plenty of water to keep the skin hydrated."
          ]
      },
      "bcc": {
          "prevention": [
              "Use a broad-spectrum sunscreen daily, even during cloudy weather.",
              "Reapply sunscreen every two hours when outdoors.",
              "Seek shade whenever possible.",
              "Perform regular self-skin checks for early detection."
          ],
          "medicine": [
              "Topical imiquimod or 5-fluorouracil for superficial BCC.",
              "Mohs micrographic surgery for high-risk lesions.",
              "Radiation therapy for inoperable cases.",
              "Vismodegib or sonidegib for advanced cases."
          ],
          "diet": [
              "Include cruciferous vegetables (broccoli, cauliflower) for cancer-fighting properties.",
              "Eat foods rich in polyphenols (green tea, dark chocolate).",
              "Increase intake of colorful fruits and vegetables for carotenoids.",
              "Avoid processed foods and limit sugar consumption."
          ]
      },
      "bkl": {
          "prevention": [
              "Maintain good skin hygiene.",
              "Use moisturizers to keep skin hydrated and reduce rough patches.",
              "Protect your skin from sun exposure by using sunscreen."
          ],
          "medicine": [
              "Topical retinoids for improving skin texture.",
              "Cryotherapy for removal if necessary.",
              "Laser treatment for cosmetic concerns."
          ],
          "diet": [
              "Maintain a balanced diet with plenty of fruits and vegetables.",
              "Include healthy fats like avocados and nuts for skin nourishment.",
              "Stay hydrated to promote healthy skin."
          ]
      },
      "df": {
          "prevention": [
              "Avoid trauma or injury to the skin, as these lesions often form after minor injuries.",
              "Maintain proper skin care and hygiene."
          ],
          "medicine": [
              "No specific treatment needed unless bothersome.",
              "Surgical excision if painful or for cosmetic reasons.",
              "Steroid injections for inflammation reduction."
          ],
          "diet": [
              "Focus on anti-inflammatory foods like turmeric, ginger, and fatty fish.",
              "Include Vitamin C-rich foods to aid skin repair and collagen production.",
              "Consume plenty of leafy greens for overall skin health."
          ]
      },
      "nv": {
          "prevention": [
              "Limit sun exposure and use protective clothing.",
              "Apply sunscreen with a high SPF rating.",
              "Avoid picking at or irritating moles."
          ],
          "medicine": [
              "No treatment required for benign moles.",
              "Laser removal for cosmetic purposes.",
              "Surgical excision if suspicious changes are observed."
          ],
          "diet": [
              "Eat foods high in antioxidants like blueberries, spinach, and dark chocolate.",
              "Include foods rich in beta-carotene (carrots, sweet potatoes) to protect skin cells.",
              "Maintain proper hydration levels."
          ]
      },
      "vasc": {
          "prevention": [
              "Maintain a healthy weight to reduce pressure on blood vessels.",
              "Exercise regularly to improve blood flow.",
              "Avoid prolonged standing or sitting.",
              "Wear compression garments if necessary."
          ],
          "medicine": [
              "Laser therapy for visible blood vessels.",
              "Sclerotherapy for reducing vascular lesions.",
              "Topical beta-blockers for small lesions."
          ],
          "diet": [
              "Consume foods rich in flavonoids (citrus fruits, onions, dark chocolate) to strengthen blood vessels.",
              "Include foods high in Vitamin K (leafy greens) for better blood clotting.",
              "Reduce salt intake to minimize fluid retention."
          ]
      },
      "mel": {
          "prevention": [
              "Avoid sun exposure, particularly during peak hours.",
              "Use a broad-spectrum sunscreen with SPF 50 or higher.",
              "Wear UV-protective clothing and sunglasses.",
              "Avoid tanning beds and artificial UV lights.",
              "Perform regular self-examinations and seek professional skin checks."
          ],
          "medicine": [
              "Surgical removal for early-stage melanoma.",
              "Immunotherapy (e.g., pembrolizumab, nivolumab) for advanced cases.",
              "Targeted therapy (e.g., BRAF/MEK inhibitors) for genetic mutations.",
              "Chemotherapy for metastatic melanoma."
          ],
          "diet": [
              "Eat antioxidant-rich foods to fight free radicals (berries, green tea).",
              "Include foods with lycopene (tomatoes, watermelon) for skin protection.",
              "Omega-3 fatty acids (fish, flaxseeds) to reduce inflammation.",
              "Limit processed foods and sugary snacks."
          ]
      }
  
  

  };


  const diseaseDescriptions = {
    akiec:"Actinic Keratoses and Intraepithelial Carcinoma (AKIEC)Actinic Keratoses are precancerous skin lesions caused by prolonged exposure to ultraviolet (UV) radiation from the sun or tanning beds. They appear as rough, scaly patches on sun-exposed areas like the face, neck, and hands. The damage from UV radiation leads to mutations in the DNA of skin cells, promoting abnormal cell growth. If left untreated, they can develop into squamous cell carcinoma (SCC), a type of skin cancer. Intraepithelial carcinoma refers to early-stage skin cancer confined to the upper layers of the skin, often resulting from chronic sun damage.",

bcc:"Basal Cell Carcinoma (BCC)Basal Cell Carcinoma is the most common form of skin cancer. It typically develops in areas exposed to sunlight, such as the face, ears, and neck. BCC arises from the basal cells in the epidermis and is primarily caused by long-term sun exposure, frequent sunburns, and exposure to harmful UV rays. Genetic factors can also increase susceptibility. Although it rarely spreads to other parts of the body, untreated cases can cause significant tissue damage.",

bkl:"Benign Keratosis-like Lesions (BKL)Benign Keratosis-like Lesions are non-cancerous growths that resemble keratoses but do not pose a threat. These lesions are typically pigmented and may be mistaken for malignant conditions. Factors such as aging, prolonged sun exposure, and a buildup of keratin in the skin contribute to their development. They are generally harmless but can be removed for cosmetic reasons.",

df:" Dermatofibroma (DF)Dermatofibromas are benign skin growths that appear as firm, raised nodules, often brown or reddish. They commonly occur on the legs and are believed to develop in response to minor skin injuries like insect bites, shaving cuts, or trauma. The body's immune response to these injuries triggers the formation of fibrous tissue, leading to the development of dermatofibromas. These lesions are harmless and typically do not require treatment unless they become bothersome.",

nv:"Melanocytic Nevi (NV) Melanocytic Nevi, commonly known as moles, are benign skin growths formed by clusters of melanocytes (pigment-producing cells). They can vary in size, shape, and color. The development of moles is influenced by genetic factors and sun exposure, especially during childhood. While most moles are harmless, excessive UV exposure can trigger mutations in melanocytes, increasing the risk of transformation into melanoma.",

vasc:"Vascular Skin Lesions (VASC) Vascular skin lesions are abnormalities in blood vessels near the surface of the skin. They can appear as red, purple, or bluish marks and are often congenital or develop later in life. Factors contributing to their development include genetic predisposition, hormonal changes, and aging. These lesions are typically benign but can occasionally require treatment for cosmetic reasons or if they cause complications such as bleeding.",

mel:"Melanoma (MEL) Melanoma is the most aggressive and dangerous form of skin cancer. It develops from melanocytes and can spread to other parts of the body if not detected early. Melanoma is primarily caused by intense, intermittent sun exposure, particularly sunburns during childhood. Genetic mutations in melanocytes lead to uncontrolled cell growth and tumor formation. Additional risk factors include a family history of melanoma, having a fair complexion, and the presence of numerous atypical moles. Early detection and treatment are crucial for a positive outcome."
};
  

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleAnalyzeImage = async () => {
    if (!imageFile) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await axios.post("http://localhost:5000/predict", formData);
      console.log(response.data);
      setPredictions(response.data.predictions || {}); // Ensure valid response
    } catch (err) {
      setError("Upload valid Image");
      setPredictions({});
      console.error(err);
    }

    setLoading(false);
  };

  const getHighestPrediction = () => {
    if (!predictions || Object.keys(predictions).length === 0) return null;
    const maxDisease = Object.keys(predictions).reduce((a, b) =>
      predictions[a] > predictions[b] ? a : b
    );
    return maxDisease;
  };

  const highestPrediction = getHighestPrediction();
  const highestPredictionFull = highestPrediction ? diseaseFullForms[highestPrediction] : "";
  const chartData = {
    labels: diseases,
    datasets: [
      {
        label: "Probability (%)",
        data: diseases.map((disease) => (predictions[disease] || 0) ),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Important to allow height changes
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Adjust if needed
      },
    },
  };
  const generatePDF = async (disease_name, confidence, disease_description, prevention, medication, diet_plan, imageFile) => {
    const doc = new jsPDF();
    let yPos = 30; // Starting y position
  
    // Function to add sections with bullet points
    const addSectionWithPoints = (title, items) => {
      if (!Array.isArray(items)) items = [items]; // Convert to array if single string
  
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(title, 20, yPos);
      yPos += 8;
  
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
  
      items.forEach((item) => {
        let bulletPointText = `• ${item}`;
        let wrappedText = doc.splitTextToSize(bulletPointText, 180);
        doc.text(wrappedText, 20, yPos);
        yPos += wrappedText.length * 6; // Adjust for text wrapping
      });
  
      yPos += 10; // Space after section
    };
  
  
    // Convert Image to Base64
    const getImageBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };
  
    let imageBase64 = "";
    if (imageFile) {
      imageBase64 = await getImageBase64(imageFile);
    }
  
    // **Title Section**
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Skin Disease Classification Report", 50, 20);
  
    // **Add Image (if available)**
    if (imageBase64) {
      doc.addImage(imageBase64, "JPEG", 60, yPos, 90, 90); // Centered image
      yPos += 100; // Move text down after image
    }
  
    // **General Information**
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Disease Detected:`, 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(disease_name, 70, yPos);
    yPos += 10;
  
    // **Add Disease Description**
    if (disease_description) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(12);
      let descriptionText = doc.splitTextToSize(disease_description, 180);
      doc.text(descriptionText, 20, yPos);
      yPos += descriptionText.length * 6 + 10;
    }
  
    doc.setFont("helvetica", "bold");
    doc.text(`Confidence Score:`, 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${confidence}%`, 70, yPos);
    yPos += 15;
  
    // **Adding Sections with Bullet Points**
    if (prevention && prevention.length > 0) addSectionWithPoints("Preventive Measures", prevention);
    if (medication && medication.length > 0) addSectionWithPoints("Medication", medication);
    if (diet_plan && diet_plan.length > 0) addSectionWithPoints("Diet Plan", diet_plan);
  
    // **Save PDF**
    doc.save("Skin_Disease_Report.pdf");
  };
  

  
  


  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Skin Disease Prediction</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {selectedImage && (
        <div>
          <img
            src={selectedImage}
            alt="Selected"
            width="300px"
            style={{ marginTop: "20px", borderRadius: "10px" }}
          />
          <br />
          <button
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              fontSize: "16px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={handleAnalyzeImage}
          >
            Analyze Image
          </button>
        </div>
      )}
      {loading && <CircularProgress style={{ marginTop: "20px" }} />}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {Object.keys(predictions).length > 0 && (
        <div style={{ display: "flex", justifyContent: "center",textAlign: "justify", gap: "20px", marginTop: "20px" }}>
          {/* First Card - Chart and Buttons */}
          <Card style={{ maxWidth: "400px", padding: "20px", flex: "1"  }}>
            <CardContent>
            <div style={{ height: "300px", width: "100%" }}>

              <Bar data={chartData} options={chartOptions} />
              </div>
              <Typography variant="h6" style={{ marginTop: "20px" }}>
                Detected Disease: {highestPredictionFull} ({highestPrediction})
              </Typography>
         
            </CardContent>
          </Card>
  
          {/* Second Card - Disease Description */}
          <Card style={{ maxWidth: "400px", padding: "20px", flex: "1" }}>
            <CardContent>
              <Typography variant="h5">Disease Description</Typography>
              <Typography variant="body1" style={{ marginTop: "10px" }}>
                {highestPredictionFull}: {highestPrediction
                  ? diseaseDescriptions[highestPrediction]
                  : "No description available."}
              </Typography>
              <div style={{ marginTop: "10px" }}>
  {["Prevention", "Medicine", "Diet"].map((info) => (
    <Button
      key={info}
      variant={selectedInfo === info ? "contained" : "outlined"}
      onClick={() => setSelectedInfo(info)}
      style={{ margin: "5px" }}
    >
      {info}
    </Button>
  ))}
</div>

{selectedInfo && (
  <div
    style={{
      marginTop: "10px",
      backgroundColor: "rgb(197, 247, 199)", // Light gray background
      padding: "15px",
      borderRadius: "10px",
      borderLeft: "5px solid #4CAF50", // Green left border for highlight
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Light shadow for depth
    }}
  >
    <h3 style={{ color: "#333", marginBottom: "10px" }}>{selectedInfo}</h3>
    <ul style={{ paddingLeft: "20px", color: "#555" }}>
      {recommendations[highestPrediction]?.[selectedInfo.toLowerCase()]?.map(
        (item, index) => (
          <li
            key={index}
            style={{
              backgroundColor: "#fff",
              padding: "8px",
              marginBottom: "5px",
              borderRadius: "5px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Light shadow for list items
            }}
          >
            {item}
          </li>
        )
      ) || <li>No information available.</li>}
    </ul>
  </div>
)}
<br></br>
<Button
  variant="contained"
  color="primary"
  onClick={() =>
    generatePDF(
      highestPredictionFull,
      predictions[highestPrediction] ? (predictions[highestPrediction] ).toFixed(2) : "N/A",
      diseaseDescriptions[highestPrediction],
      recommendations[highestPrediction]?.prevention || "No recommendations available.",
      recommendations[highestPrediction]?.medicine || "No recommendations available.",
      recommendations[highestPrediction]?.diet || "No recommendations available.",
      imageFile // Pass the uploaded image file
    )
  }
>
  Download Report
</Button>



            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
  
};

export default SkinDiseasePredictor;
