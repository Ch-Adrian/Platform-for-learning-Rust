import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { useContext } from 'react'
import "./MovableMenuContext.css"
import { LessonContext } from '../../../../contexts/LessonContext/LessonContextProvider';

const MovableMenuContext = ({pageID, sectionID, cellID=null, children}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { lessonDefinition, updateLesson } = useContext(LessonContext);

  const changeComponentPosition = (pageDst) => {
      
    let modifiedLesson = {...lessonDefinition};
    if (cellID === null){
      let section = {...modifiedLesson.pages[pageID].sections[sectionID]};
      modifiedLesson.pages[pageID].sections.splice(sectionID,1);
      modifiedLesson.pages[pageDst].sections.splice(0, 0, section);
    }
    else{
      let cell = {...modifiedLesson.pages[pageID].sections[sectionID].cells[cellID]};
      modifiedLesson.pages[pageID].sections[sectionID].cells.splice(cellID,1);
      modifiedLesson.pages[pageDst].sections[0].cells.splice(0, 0, cell);
    }
    updateLesson(modifiedLesson);

  }

  const handleClose = pageNr => (event) => {
      changeComponentPosition(pageNr);
      setAnchorEl(null);
  };

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const justClose = (event) => {
    setAnchorEl(null);
  }

  return (
      <div>
          <div
              onClick={handleClick}
          >
          {children}
          </div>
          <Menu
              keepMounted
              anchorEl={anchorEl}
              onClose={handleClose}
              open={Boolean(anchorEl)}
          >
          {lessonDefinition.pages.map((content, idx) => {
            return<MenuItem key={idx} onClick={handleClose(idx)}>{"Page "+idx+" Section: 1"}</MenuItem>;
          })}
          <MenuItem key={lessonDefinition.pages.length+1} onClick={justClose}>Close</MenuItem>
          </Menu>
      </div>
  );
}

export default MovableMenuContext;