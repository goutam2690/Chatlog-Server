import { styled } from "@mui/material";
import { Link as LinkComponent } from 'react-router-dom';
import { grayColor } from "../../constants/color";

export const VisuallyHidden = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  width: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap"
})


export const Link = styled(LinkComponent)({
  textDecoration: "none",
  color: "black",
  padding: "1rem",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.1)",
  },
});


export const InputBox = styled("input")`
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 1.3rem 3rem;
    border-radius: 1.5rem;
    background-color: ${grayColor};    

  `


export const SearchField = styled("input")`
  padding: 0.7rem 1.5rem;
  width: 20vmax;
  border: none;
  outline: none;
  border-radius: 1.5rem;
  background-color: #f1f1f1;
  font-size: 1.1rem;
`

export const CurveButton = styled('button')`
  padding: 0.5rem 1rem;
  color: white;
  background-color: black;
  border: none;
  outline: none;
  font-size: 1rem;
  border-radius: 1.5rem;
  $:hover : {
    background-color: rgba(0,0,0,0.8);
  }
  cursor: pointer;

`