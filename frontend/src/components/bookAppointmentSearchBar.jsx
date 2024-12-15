// Abrar Mohammad Fuad; 261083785
import React, { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "../style/searchBarBook.css";

export default function BookAppointmentSearchBar({ url, setURL, onSearch }) {
  const [touched, setTouched] = useState(false);

  // Function to handle search click through prop function onSearch
  const handleSearchClick = () => {
    setTouched(true);
    onSearch(url);
  };

  return (
    <div className="search-bar-container">
      <TextField
        value={url}
        placeholder="e.g. slotify.com/id1233"
        onChange={(e) => {
          setURL(e.target.value);
          if (touched && e.target.value) {
            setTouched(false);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") { // If the user presses Enter
            setTouched(true);
            onSearch(url);
          }
        }}
        required // This makes the field required
        error={touched && !url} // Shows error if url is empty and the field has been touched
        helperText={touched && !url ? "Please enter a URL" : ""} // Helper text based on touched state
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <div
                onClick={handleSearchClick}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SearchIcon />
              </div>
            </InputAdornment>
          ),
        }}
        sx={{
          width: "350px", // Set the desired width
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            borderWidth: "1px", // Increase border width
            borderRadius: "30px", // Set border radius
            "& fieldset": {
              borderWidth: "1px", // Specifically target the border
            },
            "&.Mui-focused fieldset": {
              borderWidth: "1px", // Increase when focused
            },
          },
        }}
      />
    </div>
  );
}
