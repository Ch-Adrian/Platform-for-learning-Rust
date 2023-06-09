// import React, { useContext } from 'react'
// import "./MovableMenuContext.css"
// import { LessonContext } from '../../../../contexts/LessonContext/LessonContextProvider';
//
// const MovableMenuContext = () => {
//
//   const {lessonDefinition} = useContext(LessonContext);
//
//   const onClickMove = (pageNr) =>{
//     console.log(pageNr);
//   }
//   
//   return (
//       <div className="menu-list">
//       {lessonDefinition.pages.map((content, idx) => {
//         return <div className="menu-item" onClick={onClickMove(idx)} >{"Page "+idx}</div>;
//       })}
//       </div>
//   );
//
// }
//
// export default MovableMenuContext;

import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { useContext } from 'react'
import "./MovableMenuContext.css"
import { LessonContext } from '../../../../contexts/LessonContext/LessonContextProvider';

const MovableMenuContext = ({children}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { lessonDefinition } = useContext(LessonContext);

 
    const handleClose = idx => (event) => {
        console.log(idx);
        setAnchorEl(null);
    };
 
    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
 
    return (
        <div>
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
            {children}
            </Button>
            <Menu
                keepMounted
                anchorEl={anchorEl}
                onClose={handleClose}
                open={Boolean(anchorEl)}
            >
            {lessonDefinition.pages.map((content, idx) => {
              return<MenuItem key={idx} onClick={handleClose(idx)}>{"Page "+idx}</MenuItem>;
            })}
            </Menu>
        </div>
    );
}

export default MovableMenuContext;
