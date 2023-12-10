import React, { useState, useRef } from 'react'
import '../LessonPageContainer.css'
import LessonFileSaveService from '../../../../services/LessonFileHandleService';
import OverwriteLessonNameModal from '../../../Modals/OverwriteLessonNameModal/OverwriteLessonNameModal';

const NameHeader = ({lessonName, setLessonName, lessonDefinition, setStatusInfo}) => {
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
            setLessonName(newName);
            setStatusInfo("Nazwa zmieniona");
          } catch(e) {
            console.log(e.response.data)
            if (e.response.data.includes("There is already lesson with name")){
              setOverwriteLessonModalOpen(true);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    
    if (nameInput.current) {
        nameInput.current.scrollLeft = 0;
      }
    }
  
    const handleOverwriteLesson = () => {
      setOverwriteLessonModalOpen(false);
      setLessonName(nameInput.current.textContent);
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
        <div data-cy="lesson-name" title={lessonName} ref={nameInput} contentEditable="true" className='name-header general-button-item' onKeyDown={handleNameChange} onBlur={handleNameSubmit} suppressContentEditableWarning={true} spellCheck="false"> 
          {lessonName}
        </div>
        {lessonDefinition ? <OverwriteLessonNameModal open={overwriteLessonModalOpen} handleCloseModal={handleCloseOverwriteModal} handleOverwriteLesson={handleOverwriteLesson}/> : null}
      </div>
    );
  }

  export default NameHeader;