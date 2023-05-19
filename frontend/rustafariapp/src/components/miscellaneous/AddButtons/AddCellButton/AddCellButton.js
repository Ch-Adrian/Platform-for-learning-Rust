import React, {useContext} from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { LessonContext } from '../../../../contexts/LessonContext/LessonContextProvider';
import "../AddButton.css";

const cellTypes = ["Tekst", "Kod"];

const AddCellButton = (props) => {
    const {addCell} = useContext(LessonContext);

    const addCellHandler = (eventKey, event) => {
        let newCell = {};
        if (event.target.innerHTML === "Kod"){
            newCell.type = "code";
            newCell.value = "";
        } else if (event.target.innerHTML === "Tekst"){
            newCell.type = "text";
            newCell.value = "Nowa komórka z tekstem";
        }
        addCell(newCell, props.cellIdx, props.currentPage, props.sectionIdx);
    } 

    return (
        <div className="dropdown-button-wrapper">
            <DropdownButton className={'dropdown-button'} id="dropdown-basic-button" 
            title="Dodaj komórkę" onSelect={addCellHandler} size="sm" >
                {cellTypes.map((cellType, idx) => {
                    return <Dropdown.Item key={idx+"cellOption"}>{cellType}</Dropdown.Item>
                })}
            </DropdownButton>
            <div className="dropdown-button-line"></div>
        </div>
    )
}

export default AddCellButton