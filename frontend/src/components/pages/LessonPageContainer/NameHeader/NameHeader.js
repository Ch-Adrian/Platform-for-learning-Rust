import React, { useState, useRef } from 'react'
import '../LessonPageContainer.css'
import LessonFileSaveService from '../../../../services/LessonFileHandleService';
import OverwriteLessonNameModal from '../../../Modals/OverwriteLessonNameModal/OverwriteLessonNameModal';

const NameHeader = ({lessonName, setLessonName, lessonDefinition, setStatusInfo, setIsSaveLessonError}) => {
    const [overwriteLessonModalOpen, setOverwriteLessonModalOpen] = useState(false);
    const nameInput = useRef(null);

    const handleNameSubmit = async (e) => {
      const oldName = lessonName;
      const newName = e.currentTarget.textContent;
      try {
  
        const response = await LessonFileSaveService.getAllLessons();
        if (response.data.some(lesson => lesson.name === oldName + ".json")) {
          try {
            await LessonFileSaveService.renameLesson(oldName, newName);
            await LessonFileSaveService.saveLesson(lessonDefinition, newName);
            setStatusInfo("Nazwa zmieniona");
            setLessonName(newName);
          } catch(e) {
            console.log(e.response.data)
            if (e.response.data.includes("There is already lesson with name")){
              setOverwriteLessonModalOpen(true);
            }
          }
        } else {
          setLessonName(newName);
        }
      } catch (error) {
        console.error(error);
      }
    
    if (nameInput.current) {
        nameInput.current.scrollLeft = 0;
      }
    }
  
    const handleOverwriteLesson = () => {
      const newName = nameInput.current.textContent;
      const oldName = lessonName;

      setOverwriteLessonModalOpen(false);
      setLessonName(newName);
      LessonFileSaveService.renameLesson(oldName, newName, true)
      .then((response) => {
        setStatusInfo("Nazwa zmieniona");
      })
      .catch((e) => {
        setIsSaveLessonError(true);
      });
    }
  
    const handleCloseOverwriteModal = () => {
      setOverwriteLessonModalOpen(false);
      nameInput.current.textContent = lessonName;
    }
  
    const handleNameChange = (e) => {
      nameInput.current.textContent = e.target.textContent;
      if (e.key === 'Enter'){
        nameInput.current.blur();
      }
    }
  
    return (
      <div>
        <div data-cy="lesson-name" style={{"minWidth": "2rem"}} title={lessonName} ref={nameInput} contentEditable="true" className='name-header general-button-item' onKeyDown={handleNameChange} onBlur={handleNameSubmit} suppressContentEditableWarning={true} spellCheck="false"> 
          {lessonName}
        </div>
        {lessonDefinition ? <OverwriteLessonNameModal open={overwriteLessonModalOpen} handleCloseModal={handleCloseOverwriteModal} handleOverwriteLesson={handleOverwriteLesson}/> : null}
      </div>
    );
  }

  export default NameHeader;