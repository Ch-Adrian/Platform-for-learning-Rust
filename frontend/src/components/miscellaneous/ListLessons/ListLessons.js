import LessonFileSaveService from '../../../services/LessonFileHandleService';
import DateService from '../../../services/DateService';
import React, { useEffect, useState } from 'react';
import "./ListLessons.css";
import {BsTrash3} from 'react-icons/bs';
import { Checkbox } from "@mui/material";
import { COLORS } from '../../../values/colors.js' 

const ListLessons = (props) => {
  const [lessons, setLessons] = useState([]);
  const [sortBy, setSortBy] = useState({ column: '', order: 'asc' });
  const [selectedLessons, setSelectedLessons] = useState([]);

  const openLesson = async (name) => {
    const lessonBody = await LessonFileSaveService.getLesson(name);
    props.openLesson(lessonBody.data, name);
  };

  const handleHeaderClick = (column) => {
    setSortBy((prevSortBy) => ({
      column,
      order: prevSortBy.column === column && prevSortBy.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleLessonSelection = (lessonName) => {
    if (selectedLessons.includes(lessonName)) {
      setSelectedLessons(selectedLessons.filter((name) => name !== lessonName));
    } else {
      setSelectedLessons([...selectedLessons, lessonName]);
    }
  };

  const handleDeleteSelectedLessons = async () => {
    const selectedLessonNames = selectedLessons.map((lessonName) => lessonName);
    if (selectedLessonNames.length === 0) {
      return;
    }

    await LessonFileSaveService.deleteSelectedLessons(selectedLessonNames);

    const remainingLessons = lessons.filter((lesson) => !selectedLessonNames.includes(lesson.name));
    setLessons(remainingLessons);
    setSelectedLessons([])
  };

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

  const sortedLessons = lessons.slice().sort((a, b) => {
    if (sortBy.column === 'name') {
      return sortBy.order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy.column === 'lastModified') {
      return sortBy.order === 'asc'
        ? new Date(a.lastModified) - new Date(b.lastModified)
        : new Date(b.lastModified) - new Date(a.lastModified);
    }
    return 0;
  });

  return (
    <div className='list-lessons'>
      {lessons.length === 0 ? (
        <h2 className='title'>Rozpocznij swoją przygodę z językiem Rust</h2>
      ) : (
        <>
          <h2 className='title'>Twoje lekcje</h2>
          <div className='manage-buttons-container'>
            <button data-cy="delete-lessons-button" className='delete-lessons-button' onClick={handleDeleteSelectedLessons} disabled={selectedLessons.length === 0}><BsTrash3/></button>
          </div>
          <ul data-cy="lesson-list" className='lesson-table'>
            <li className='lesson-header'>
              <div className='lesson-name' onClick={() => handleHeaderClick('name')}>
                Nazwa Lekcji
                {sortBy.column === 'name' && (sortBy.order === 'asc' ? ' ▲' : ' ▼')}
              </div>
              <div className='lesson-date-header' onClick={() => handleHeaderClick('lastModified')}>
                {sortBy.column === 'lastModified' && (sortBy.order === 'asc' ? '▲ ' : '▼ ')}
                Zmodyfikowano
              </div>
            </li>
            {sortedLessons.map((lesson, index) => (
              <li key={index} className='lesson-item'>
                
                <div data-cy="list-lesson-item" className='lesson-name' onClick={() => openLesson(lesson.name)}>
                  {lesson.name.split('.json')[0]}
                </div>
                <div className='lesson-date'>
                  {DateService.formatLocalDateTime(lesson.lastModified)}
                </div>
                <div className='checkbox'>
                    <Checkbox className="checkbox" style= {{color: COLORS.font_color}} checked={selectedLessons.includes(lesson.name)} onChange={() => toggleLessonSelection(lesson.name)}></Checkbox>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ListLessons;
