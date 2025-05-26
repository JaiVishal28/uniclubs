import React, { useState } from "react";
import axios from "axios";

function UploadForm() {
const [formData, setFormData] = useState({
eventName: "",
clubName: "",
venue: "",
date: "",
registrationLink: "",
posterImage: null,
});

const handleChange = (e) => {
const { name, value, files } = e.target;
setFormData((prev) => ({
...prev,
[name]: files ? files[0] : value,
}));
};

const handleSubmit = async (e) => {
e.preventDefault();
const data = new FormData();
Object.entries(formData).forEach(([key, value]) => {
data.append(key, value);
});

try {
  await axios.post("https://your-backend-url/api/events", data);
  alert("Event uploaded!");
} catch (err) {
  console.error(err);
  alert("Upload failed.");
}
};

return (
<form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 max-w-md mx-auto">
<input type="text" name="eventName" placeholder="Event Name" required onChange={handleChange} />
<input type="text" name="clubName" placeholder="Club Name" required onChange={handleChange} />
<input type="text" name="venue" placeholder="Venue" required onChange={handleChange} />
<input type="date" name="date" required onChange={handleChange} />
<input type="text" name="registrationLink" placeholder="Registration Link" onChange={handleChange} />
<input type="file" name="posterImage" accept="image/*" required onChange={handleChange} />
<button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
</form>
);
}
export default UploadForm;