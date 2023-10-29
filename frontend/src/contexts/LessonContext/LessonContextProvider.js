import React, { createContext, useMemo, useState, useEffect } from "react";

export const LessonContext = createContext({});

const LessonContextProvider = (props) => {
    const [lessonDefinition, setLessonDefinition] = useState();
    const [lessonName, setLessonName] = useState();

    // Those two functions below are for persisiting the lesson state on page refresh
    useEffect(() => {
        if (window.localStorage.getItem('lessonDefinition') !== 'undefined') setLessonDefinition(JSON.parse(window.localStorage.getItem('lessonDefinition')));
        if (window.localStorage.getItem('lessonName') !== 'undefined') setLessonName(window.localStorage.getItem('lessonName'));
    }, []);

    useEffect(() => {
        window.localStorage.setItem('lessonDefinition', JSON.stringify(lessonDefinition));
    }, [lessonDefinition]);

    useEffect(() => {
        window.localStorage.setItem('lessonName', lessonName);
    }, [lessonName])

    const value = useMemo(() => {
        return {
            lessonDefinition, 
            setLessonDefinition,
            lessonName,
            setLessonName
          }
    }, [lessonDefinition, lessonName]);

    const lessonDefinitionHandler = (action) => {
        let modifiedLesson = window.structuredClone(lessonDefinition);
        const page = parseInt(action.page);
        const section = parseInt(action.section);
        const idx = parseInt(action.idx);
        switch (action.type) {
            case 'updateCell':
                modifiedLesson.pages[page].sections[section].cells[idx] = action.newCell; 
                break;
            case 'addCell':
                modifiedLesson.pages[page].sections[section].cells.splice(idx+1, 0, action.newCell);    
                break;
            case 'removeCell':
                modifiedLesson.pages[page].sections[section].cells.splice(idx, 1);
                break;
            case 'addSection':
                modifiedLesson.pages[page].sections.splice(section+1, 0, action.newSection);    
                break;
            case 'removeSection':
                modifiedLesson.pages[page].sections.splice(section, 1);
                break;
            case 'changeTitle':
                modifiedLesson.pages[page].sections[action.sectionIdx].title = action.newTitle
                break;
            case 'addPage':
                modifiedLesson.pages.push({ sections: [] });
                break;
            case 'removePage':
                modifiedLesson.pages.splice(action.currentPage, 1);
                break;
            case 'updateCargo':
                modifiedLesson.cargoToml = action.config;
                break;
            default: 
                break;
        }
    
        setLessonDefinition(modifiedLesson);
    }

    const updateCell = (newCell, idx, page, section) => {
        lessonDefinitionHandler({
            type: 'updateCell',
            newCell: newCell,
            idx: idx,
            page: page,
            section: section,
        });
    }

    const addCell = (newCell, idx, page, section) => {
        lessonDefinitionHandler({
            type: 'addCell',
            newCell: newCell,
            idx: idx,
            page: page,
            section: section,
        });
    }

    const removeCell = (idx, page, section) => {
        lessonDefinitionHandler({
            type: 'removeCell',
            idx: idx,
            page: page,
            section: section,
        });
    }

    const addSection = (newSection, page, section) => {
        lessonDefinitionHandler({
            type: 'addSection',
            newSection: newSection,
            page: page,
            section: section,
        });
    }

    const removeSection = (page, section) => {
        lessonDefinitionHandler({
            type: 'removeSection',
            page: page,
            section: section,
        });
    }

    const changeTitle = (newTitle, page, sectionIdx) => {
        lessonDefinitionHandler({
            type: 'changeTitle',
            newTitle: newTitle,
            page: page,
            sectionIdx: sectionIdx,
        });
    }

    const getTitle = (page, sectionIdx) => {
        return lessonDefinition.pages[page].sections[sectionIdx].title;
    }

    const addPage = () => {
        lessonDefinitionHandler({
            type: 'addPage'
        });
    }

    const removePage = (currentPage) => {
        lessonDefinitionHandler({
            type: 'removePage',
            currentPage: currentPage
        });
    }

    const updateCargoToml = (configContent) => {
        lessonDefinitionHandler({
            type: 'updateCargo',
            config: configContent
        })
    }

    return (
        <LessonContext.Provider value={{...value, 
                                        updateCell, 
                                        addCell, 
                                        addSection, 
                                        removeCell, 
                                        removeSection, 
                                        changeTitle, 
                                        getTitle, 
                                        addPage, 
                                        removePage, 
                                        updateCargoToml}}>
            {props.children}
        </LessonContext.Provider>
    )
}

export default LessonContextProvider;
