import React, {useContext} from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { LessonContext } from '../../../../contexts/LessonContext/LessonContextProvider';
import "../AddButton.css";

const BACKEND_PATH = "pl.edu.agh.backend.lesson.cells."
const cellTypes = ["Tekst", "Kod", "Niemutowalny kod", "Quiz"];

const AddCellButton = (props) => {
    const {addCell} = useContext(LessonContext);

    const addCellHandler = (eventKey, event) => {
        let newCell = {};
        if (event.target.innerHTML === "Kod"){
            newCell.profileType = BACKEND_PATH + "CodeCell"
            newCell.type = "CodeCell";
            newCell.value = "fn main() {\r\n\t\r\n}";
        } else if (event.target.innerHTML === "Tekst"){
            newCell.profileType = BACKEND_PATH + "TextCell"
            newCell.type = "TextCell";
            newCell.value = "Nowa komórka z tekstem";
        } else if (event.target.innerHTML === "Niemutowalny kod"){
            newCell.profileType = BACKEND_PATH + "ImmutableCodeCell"
            newCell.type = "ImmutableCodeCell";
            newCell.value = "fn main() {\r\n\t/*TO_FILL*/\r\n}";
            newCell.reference = "fn main() {\r\n\t/*TO_FILL*/\r\n}";
            newCell.mutableString = "/*TO_FILL*/";
        } else if (event.target.innerHTML === "Quiz"){
            newCell.profileType = BACKEND_PATH + "QuizCell"
            newCell.type = "QuizCell";
            newCell.value = "Tutaj możesz dodać pytanie.";
            newCell.options = [];
        }

        addCell(newCell, props.cellIdx, props.currentPage, props.sectionIdx);
    } 

    return (
        <div data-cy="add-cell-button" className="dropdown-button-wrapper">
            <DropdownButton  className={'dropdown-button'} id="dropdown-basic-button" 
            title="Dodaj komórkę" onSelect={addCellHandler} size="sm" >
                {cellTypes.map((cellType, idx) => {
                    return <Dropdown.Item key={idx+"cellOption"}>{cellType}</Dropdown.Item>
                })}
            </DropdownButton>
            <div className="dropdown-button-line"></div>
        </div>
    )
}

export default AddCellButton;
