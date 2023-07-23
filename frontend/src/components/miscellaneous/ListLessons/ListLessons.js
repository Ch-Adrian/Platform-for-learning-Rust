import LessonFileSaveService from '../../../services/LessonFileHandleService';
import React, {useEffect, useState} from 'react';
import "./ListLessons.css";


const ListLessons = (props) => {
    const [lessons, setLessons] = useState([]);

    const openLesson = async (name) => {

      const lessonBody = await LessonFileSaveService.getLesson(name);

      console.log(lessonBody)
      console.log(lessonBody.data)
      console.log(lessonBody.data)

      props.openLesson(lessonBody && lessonBody.data[0], name)
    }
  
    useEffect(() => {
        const fetchLessons = async () => {
          try {
            const response = await LessonFileSaveService.getAllLessons();
            setLessons(response.data);
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchLessons();
      }, []);
  
    return (
      <div className='list-lessons'>
        <ul>
          {lessons.map((lesson, index) => (
            <li key={index} 
                className='lesson-item' onClick={() => openLesson(lesson)}>
                {lesson}
            </li>
            
          ))}
        </ul>
      </div>
    );
  };
  
  export default ListLessons;