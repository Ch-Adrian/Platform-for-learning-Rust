import React, { createContext, useMemo, useState, useEffect, useCallback } from "react";

export const LessonContext = createContext({});

const LessonContextProvider = (props) => {
    const [lessonDefinition, setLessonDefinition] = useState();
    const [lessonLocalPath, setLessonLocalPath] = useState();

    // Those two functions below are for persisiting the lesson state on page refresh
    useEffect(() => {
        if (window.localStorage.getItem('lessonDefinition') !== 'undefined') setLessonDefinition(JSON.parse(window.localStorage.getItem('lessonDefinition')));
        if (window.localStorage.getItem('lessonLocalPath') !== 'undefined') setLessonLocalPath(window.localStorage.getItem('lessonLocalPath'));
    }, []);

    useEffect(() => {
        window.localStorage.setItem('lessonDefinition', JSON.stringify(lessonDefinition));
    }, [lessonDefinition]);

    useEffect(() => {
        window.localStorage.setItem('lessonLocalPath', lessonLocalPath);
        if (lessonLocalPath !== undefined) window.localStorage.setItem('lastPickedLessonLocalPath', lessonLocalPath);
    }, [lessonLocalPath])

    const value = useMemo(() => {
        return {
            lessonDefinition, 
            setLessonDefinition,
            lessonLocalPath,
            setLessonLocalPath
          }
    }, [lessonDefinition, lessonLocalPath]);

    const updateCell = useCallback((newCell, idx, page, section) => {
        let modifiedLesson = {...lessonDefinition};
        modifiedLesson.pages[page].sections[section].cells[idx] = newCell;
        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === page) return {sections: modifiedLesson.pages[page].sections[section]}
                else return {...pageDef}
            })
        });
    }, [lessonDefinition])

    const addCell = (newCell, idx, page, section) => {
        let modifiedLesson = {...lessonDefinition};
        modifiedLesson.pages[page].sections[section].cells.splice(idx+1, 0, newCell);    
        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === page) return {sections: modifiedLesson.pages[page].sections[section]}
                else return {...pageDef}
            })
        });
    }

    const removeCell = (idx, page, section) => {
        let modifiedLesson = {...lessonDefinition};
        modifiedLesson.pages[page].sections[section].cells.splice(idx, 1);
        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === page) return {sections: modifiedLesson.pages[page].sections[section]}
                else return {...pageDef}
            })
        });
    }

    const addSection = (newSection, page, section) => {
        page = parseInt(page);
        lessonDefinition.pages[page].sections.splice(section+1, 0, newSection);    
        setLessonDefinition({
            pages: lessonDefinition.pages
        });
    }

    const changeTitle = (newTitle, page, sectionIdx) => {
        let modifiedLesson = {...lessonDefinition};
        let newSections = modifiedLesson.pages[page].sections.map((content,idx) => {
                if(idx === sectionIdx){
                     return {...content, title: newTitle} 
                } else return content;
            });

        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === Number.parseInt(page)) {
                    return {sections: newSections}
                }
                else {
                    return {...pageDef}
                }
            })
        });
    }

    const getTitle = (page, sectionIdx) => {
        return lessonDefinition.pages[page].sections[sectionIdx].title;
    }


    const removeSection = (page, section) => {
        let modifiedLesson = {...lessonDefinition};
        page = parseInt(page);
        modifiedLesson.pages[page].sections.splice(section, 1);
        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === page) return {sections: modifiedLesson.pages[page].sections}
                else return {...pageDef}
            })
        });
    }

    const updateLesson = (newLessonDefinition) => {
        setLessonDefinition({
            pages: newLessonDefinition.pages
        })
    }

    return (
        <LessonContext.Provider value={{...value, updateCell, addCell, addSection, removeCell, removeSection, updateLesson, changeTitle, getTitle}}>
            {props.children}
        </LessonContext.Provider>
    )
}

export default LessonContextProvider;
