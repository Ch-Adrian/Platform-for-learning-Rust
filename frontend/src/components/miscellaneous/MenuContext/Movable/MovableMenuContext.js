import React, { useEffect, useRef } from "react";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useContext } from 'react'
import "./MovableMenuContext.css"
import { LessonContext } from '../../../../contexts/LessonContext/LessonContextProvider';

const MovableMenuContext = ({pageID, sectionID, cellID=null, children, isSection=false}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { lessonDefinition, setLessonDefinition } = useContext(LessonContext);
  const firstEmptyClick = useRef(true);

  const changeComponentPosition = (pageDst) => {
      
    let modifiedLesson = window.structuredClone(lessonDefinition);;
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
    setLessonDefinition(modifiedLesson);

  }

  const handleClose = pageNr => (event) => {
      changeComponentPosition(pageNr);
      setAnchorEl(null);
  };

  const handleClick = (event) => {
      console.log("first click");
      firstEmptyClick.current = true;
      setAnchorEl(event.currentTarget);
  };

  const justClose = (event) => {
    setAnchorEl(null);
  }

  useEffect( () => {
    console.log("useEffect");
    const handleClicked = () => {
      console.log("handleClick");
      if (firstEmptyClick.current === false){
        setAnchorEl(null);
      }
      firstEmptyClick.current = false;
    }
    window.addEventListener("click", handleClicked);
    return () => {
      window.removeEventListener("click", handleClicked);
    };
  }, []);

  return (
      <div>
          <div
              data-cy="move-item-to-page"
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
            if(isSection === false && content.sections.length >= 1)
              return <MenuItem key={idx} onClick={handleClose(idx)}>{"Page "+(idx+1)+" Section: 1"}</MenuItem>;
            else if (isSection === true)
              return <MenuItem key={idx} onClick={handleClose(idx)}>{"Page "+(idx+1)+" Section: 1"}</MenuItem>;
          })}
          </Menu>
      </div>
  );
}

export default MovableMenuContext;
