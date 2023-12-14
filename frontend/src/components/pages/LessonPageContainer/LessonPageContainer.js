'use client'

import React, { useContext, useState, useEffect, useCallback } from 'react'
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './LessonPageContainer.css'
import { IconContext } from 'react-icons';
import LessonPage from '../LessonPage/LessonPage';
import UserType from '../../../models/UserType';
import currentUser from '../../../config/userConfig';
import { LessonContext } from '../../../contexts/LessonContext/LessonContextProvider';
import { HashLink } from 'react-router-hash-link';
import { useNavigate } from "react-router-dom";
import LessonFileSaveService from '../../../services/LessonFileHandleService';
import UserTypeSwitch from '../../miscellaneous/UserTypeSwitch/UserTypeSwitch';
import ConfigModal from '../../Modals/ConfigModal/ConfigModal';
import CodeExecutorService from '../../../services/CodeExecutorService';
import LessonSaveModal from '../../Modals/LessonSaveModal/LessonSaveModal';
import { ErrorBoundary } from 'react-error-boundary';
import { HiArrowUturnLeft } from "react-icons/hi2";
import { FaSave } from "react-icons/fa";
import { ImFolderDownload } from "react-icons/im";
import DescriptionIcon from '@mui/icons-material/Description';
import { IoMdAdd, IoIosRemove } from "react-icons/io";
import SettingsIcon from '@mui/icons-material/Settings';
import ConfirmPageDeleteModal from '../../Modals/ConfirmPageDeleteModal/ConfirmPageDeleteModal';
import NameHeader from './NameHeader/NameHeader';

const ErrorFallback = ({ error }) => (
  <div item-cy="render-errror-message" style={{color: "red"}}>
    <h2>Błąd podczas renderowania lekcji</h2>
    <p>Treść błędu: {error.message}</p>
  </div>
);

const DEFINED_USER_TYPE = currentUser;

const LessonPageContainer = () => {
  const [userType, setUserType] = useState(currentUser);
  const [sidebar, setSidebar] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [saveLessonModalOpen, setSaveLessonModalOpen] = useState(false);
  const [confirmPageDeletionModalOpen, setConfirmPageDeletionModalOpen] = useState(false);
  const [isCargoCompiled, setIsCargoCompiled] = useState(true);
  const [isCargoError, setIsCargoError] = useState(false);
  const [isSaveLessonError, setIsSaveLessonError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [statusInfo, setStatusInfo] = useState("Gotowe");
  const navigate = useNavigate();

  const {lessonDefinition, lessonName, setLessonName, addPage, removePage, updateCargoToml} = useContext(LessonContext);
  const [currentList, setCurrentList] = useState([{}]);
  const regExpNum = new RegExp("[0-9]*");

  const url = new URL(window.location.href);
  let path = url.pathname.split("/");
  let currPg = 0; 

  while(true){
    let word = path.pop();
    if(regExpNum.test(word)){
      currPg = parseInt(word);
    }
    if(path.at(path.length-1).indexOf(".json") !== -1){
      break;
    }
  }

  let jsonPos = window.location.href.search(".json");
  let urlPath = window.location.href.slice(0, jsonPos).concat(".json");

  useEffect(() => {
    if (lessonDefinition) {
      setCurrentList(JSON.parse(JSON.stringify(lessonDefinition.pages)).map((page, id) => {
        return {type: 'PAGE', pIdx: id, sIdx: 0, title: ""};
      }))
    }
  }, [lessonDefinition])

  const changePage = useCallback((pIdx) => {
    let newList = JSON.parse(JSON.stringify(lessonDefinition.pages)).map((page, id) => {
      return {type: 'PAGE', pIdx: id, sIdx: 0, title: ""};
    });

    let pageIdxInList = newList.findIndex((itemDesc) => {return itemDesc.pIdx === pIdx}) + 1;
    lessonDefinition.pages[pIdx].sections.forEach((section, sIdx) => {
      newList.splice(pageIdxInList, 0, {type: 'SECTION', pIdx: pIdx, sIdx: sIdx, title: section.title});
      pageIdxInList = pageIdxInList + 1;
    });
    setCurrentList(newList);
  }, [lessonDefinition]);

  const showSidebar = () => {
    setSidebar(!sidebar);
    changePage(currPg);
  }

  const handleSwitchUserType= nextChecked => {
    nextChecked ? setUserType(UserType.student) : setUserType(UserType.teacher);
  }

  const newPageEvent = () => {
    addPage();
    let newList = currentList;
    newList.push({type: 'PAGE', pIdx: lessonDefinition.pages.length, sIdx: 0, title: ""});
    setCurrentList(newList);
    navigate(url.pathname+'/'+newList[newList.length-1].pIdx);
  }

  const deletePageEvent = () => {
    setConfirmPageDeletionModalOpen(false);
    removePage(currPg);
    if(lessonDefinition.pages.length >= 1) navigate(url.pathname+'/0');
    else navigate(url.pathname);
  }

  const handleSave = async () => {
    setIsSaveLessonError(false);
    console.log(lessonName);
    LessonFileSaveService.saveLesson(lessonDefinition, lessonName)
    .then((res) => {
      setStatusInfo("Zapisano!");
    })
    .catch((e) => {
      console.log(e)
      setIsSaveLessonError(true);
    });
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = lessonName+'.json';

    const file = new Blob([JSON.stringify(lessonDefinition)], { type: "text/plain" });
    link.href = URL.createObjectURL(file);

    link.click();
  }

  const handleOpen = () => {
    navigate('/');
  }

  const handleSaveConfig =  useCallback( async (configContent) => {
    setConfigModalOpen(false);
    setIsCargoCompiled(false);
    setIsCargoError(false);
    
    await CodeExecutorService.buildCargo(configContent)
    .then((res) => {
      updateCargoToml(configContent);
    })
    .catch((err) => {
      setIsCargoError(true);
      console.log(err);
    });
    setIsCargoCompiled(true);
  }, [updateCargoToml])

  const onLoadBuild = useCallback(() => {
    if (!hasLoaded && lessonDefinition) {
      handleSaveConfig(lessonDefinition.cargoToml);
      setHasLoaded(true);
    }
  }, [hasLoaded, lessonDefinition, handleSaveConfig])

  useEffect(() => {
    onLoadBuild()
  }, [onLoadBuild, hasLoaded])

  const handleSaveAndExit = async () => {
    await handleSave();
    setSaveLessonModalOpen(false)
    handleOpen();
  }

  useEffect(() => {
    if (isCargoError) setStatusInfo("Error building project! Check cargo file");
    else if (!isCargoCompiled) setStatusInfo("Budowanie projektu...");
    else if (isSaveLessonError) setStatusInfo("Nie udało się zapisać lekcji");
    else if (isCargoCompiled && !isCargoError && !isSaveLessonError) setStatusInfo("Gotowe");
  }, [isCargoCompiled, isCargoError, isSaveLessonError])

  url.pathname = path.join("/")
  localStorage.setItem(lessonDefinition, lessonDefinition);

  return (
    
      <div className='sidebar'>
        <div className='top-menu-bar'>
          <Link to='#' className='menu-bars' data-cy="hamburger">
            <FaIcons.FaBars className='hamburger' onClick={showSidebar} />
          </Link>
          <div className='general-buttons'>
            <div style={{display: 'flex'}} className='left-side-buttons'>
              <NameHeader lessonName={lessonName} setLessonName={setLessonName} lessonDefinition={lessonDefinition} setStatusInfo={setStatusInfo} setIsSaveLessonError={setIsSaveLessonError}></NameHeader>
              <button data-cy="back-button" title="Wróć" className='general-button-item' onClick={() => setSaveLessonModalOpen(true)}><HiArrowUturnLeft/></button>
              <button data-cy="save-button" title="Zapisz" className='general-button-item' onClick={handleSave}><FaSave /></button>
              <button className='general-button-item' title="Pobierz" onClick={handleDownload}><ImFolderDownload /></button>
              <div className='status-info' title="Status">
                <p>{statusInfo}</p>
              </div>
            </div>
            <div style={{display: 'flex', marginRight: '1rem'}} className='right-side-buttons'>
              {DEFINED_USER_TYPE === UserType.teacher && <UserTypeSwitch handleSwitchUserType={handleSwitchUserType}/>}
              {DEFINED_USER_TYPE === UserType.teacher && <button data-cy="add-page-button" title="Dodaj stronę" className='general-button-item' variant='light' onClick={newPageEvent}><IoMdAdd color="white" /><DescriptionIcon/></button>}
              {DEFINED_USER_TYPE === UserType.teacher && <button data-cy="remove-page-button"  title="Usuń stronę" className='general-button-item' variant='light' disabled={lessonDefinition && lessonDefinition.pages && lessonDefinition.pages.length === 1} onClick={() => setConfirmPageDeletionModalOpen(true)}><IoIosRemove /><DescriptionIcon/></button>}
              <button data-cy="config-button" className='general-button-item' variant='light'  title="Konfiguracja Cargo.toml" onClick={() => setConfigModalOpen(true)}><SettingsIcon /></button>
            </div>
          </div>
        </div>

              <IconContext.Provider value={{ color: '#fff' }}>
              <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items'>
                  <li className='navbar-toggle'>
                  </li>
      
                  { currentList ? currentList.map((itemDesc, idx) => {
                        return (
                          <div>
                            { itemDesc.type === "PAGE" ? 
                            
                            <li key={idx} className='nav-text'>
                                <Link to={urlPath + "/" + itemDesc.pIdx}>
                                  <button type="button" className='nav-button-page' onClick={()=>changePage(itemDesc.pIdx)}>{"Strona " + (itemDesc.pIdx+1)}</button>
                                </Link>
                            </li>
      
                                :
      
                            <li key={idx} className='nav-text-inner' >
                                <HashLink to={urlPath+"/"+itemDesc.pIdx+"/#section"+itemDesc.sIdx} onClick={showSidebar}>
                                    <span title={itemDesc.title}>{itemDesc.title}</span>
                                </HashLink>
                            </li>
      
                            }
                          </div>
                        );
                      }) 
                   : null}
      
                </ul>
              </nav>
            </IconContext.Provider>
        <div className={sidebar ? 'page active' : 'page'} onClick={() => setSidebar(false)}>     
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <LessonPage userType={userType} setUserType={setUserType} sidebar={sidebar}/> 
          </ErrorBoundary>
        </div>
        {lessonDefinition ? <ConfigModal open={configModalOpen} configFileContent={lessonDefinition.cargoToml} handleCloseModal={() => setConfigModalOpen(false)} handleSaveConfig={handleSaveConfig}/> : null}
        {lessonDefinition ? <LessonSaveModal open={saveLessonModalOpen} handleCloseModal={() => setSaveLessonModalOpen(false)} handleSaveLesson={handleSaveAndExit} handleExitLesson={handleOpen}/> : null}
        {lessonDefinition ? <ConfirmPageDeleteModal open={confirmPageDeletionModalOpen} handleCloseModal={() => setConfirmPageDeletionModalOpen(false)} handleRemovePage={deletePageEvent}/> : null}
        </div>
      
  );
}

export default LessonPageContainer;
