import React, { useContext, useState } from 'react'
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './LessonPageContainer.css'
import { IconContext } from 'react-icons';
import LessonPage from '../LessonPage/LessonPage';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';

const LessonPageContainer = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const {lessonDefinition} = useContext(LessonContext);

  console.log(lessonDefinition)
  
  const url = new URL(window.location.href);
  let path = url.pathname.split("/");
  path.pop()
  url.pathname = path.join("/")
  localStorage.setItem(lessonDefinition, lessonDefinition);

  return (
    <div className='sidebar'>
      <div className='top-menu-bar'>
        <Link to='#' className='menu-bars'>
          <FaIcons.FaBars className='hamburger' onClick={showSidebar} />
        </Link>
      </div>
      <IconContext.Provider value={{ color: '#fff' }}>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
            </li>
            {lessonDefinition && lessonDefinition.pages.map((_, idx) => {
              return (
                <li key={idx} className='nav-text'>
                  <Link to={url + "/" + idx}>
                    {/* {item.icon} */}
                    <span>{"PAGE " + idx}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className={sidebar ? 'page active' : 'page'}>
          <LessonPage/>
        </div>
        
      </IconContext.Provider>
      
    </div>
  );
}

export default LessonPageContainer;
