import React, { useContext } from 'react'
import { LessonContext } from '../../../../contexts/LessonContext/LessonContextProvider';
import Button from 'react-bootstrap/Button';
import "./AddSectionButton.css";

const AddSectionButton = (props) => {
    const {addSection} = useContext(LessonContext);

    const addSectionHandler = (eventKey, event) => {
        let newSection = {
            title: "Nowa sekcja",
            cells: []
        };
        addSection(newSection, props.page, props.sectionIdx);
    } 

    return (
        <div className="dropdown-button-wrapper">
            <Button data-cy="add-section-button" onClick={addSectionHandler} className={'section-button dropdown-button'} variant="success" size="sm">Dodaj sekcję</Button>
            <div className="dropdown-button-line"></div>
        </div>
    )
}

export default AddSectionButton