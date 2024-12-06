import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "../style/searchBarBook.css";

export default function BookAppointmentSearchBar({ url, setURL, onSearch }) {
  return (
    <div className="search-bar-container">
      <TextField
        value={url}
        placeholder="e.g. slotify.com/id1233"
        onChange={(e) => setURL(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <div
                onClick={() => onSearch(url)} // Trigger search when clicked
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
            borderWidth: "1px", // Increase border width
            borderRadius: "30px", // Set border radius
            "& fieldset": {
              borderWidth: "1px", // Specifically target the border
            },
            "&.Mui-focused fieldset": {
              borderWidth: "1px", // Increase when focused (optional)
            },
          },
        }}
      />
    </div>
  );
}
