import LessonFileSaveService from '../../../services/LessonFileHandleService';
import DateService from '../../../services/DateService';
import React, { useEffect, useState } from 'react';
import "./ListLessons.css";

const ListLessons = (props) => {
  const [lessons, setLessons] = useState([]);
  const [sortBy, setSortBy] = useState({ column: '', order: 'asc' });

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
      <ul>
        <li className='lesson-header'>
          <div className='lesson-name' onClick={() => handleHeaderClick('name')}>
            Name
            {sortBy.column === 'name' && (sortBy.order === 'asc' ? ' ▲' : ' ▼')}
          </div>
          <div className='lesson-date' onClick={() => handleHeaderClick('lastModified')}>
            Last Modified
            {sortBy.column === 'lastModified' && (sortBy.order === 'asc' ? ' ▲' : ' ▼')}
          </div>
        </li>
        {sortedLessons.map((lesson, index) => (
          <li key={index} className='lesson-item' onClick={() => openLesson(lesson.name)}>
            <div className='lesson-name'>{lesson.name}</div>
            <div className='lesson-date'>{DateService.formatLocalDateTime(lesson.lastModified)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListLessons;
