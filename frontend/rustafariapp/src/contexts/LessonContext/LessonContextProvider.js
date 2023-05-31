import React, { createContext, useMemo, useState, useEffect, useCallback } from "react";

export const LessonContext = createContext({});

const LessonContextProvider = (props) => {
    const [lessonDefinition, setLessonDefinition] = useState();

    // Those two functions below are for persisiting the lesson state on page refresh
    useEffect(() => {
        if (window.localStorage.getItem('lessonDefinition') !== 'undefined') setLessonDefinition(JSON.parse(window.localStorage.getItem('lessonDefinition')));
    }, []);

    useEffect(() => {
        window.localStorage.setItem('lessonDefinition', JSON.stringify(lessonDefinition));
    }, [lessonDefinition]);

    const value = useMemo(() => {
        return {
            lessonDefinition, 
            setLessonDefinition
          }
    }, [lessonDefinition]);

    const updateCell = useCallback((newCell, idx, page, section) => {
        let modifiedLesson = {...lessonDefinition};
        modifiedLesson.pages[page].sections[section].cells[idx] = newCell;
        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === page) return {sections: modifiedLesson.pages[page].section[section]}
                else return {...pageDef}
            })
        });
    }, [lessonDefinition])

    const addCell = (newCell, idx, page, section) => {
        let modifiedLesson = {...lessonDefinition};
        modifiedLesson.pages[page].sections[section].cells.splice(idx+1, 0, newCell);    
        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === page) return {sections: modifiedLesson.pages[page].section[section]}
                else return {...pageDef}
            })
        });
    }

    const removeCell = (idx, page, section) => {
        let modifiedLesson = {...lessonDefinition};
        modifiedLesson.pages[page].sections[section].cells.splice(idx, 1);
        // modifiedLesson.pages[page].sections[section].cells = modifiedLesson.pages[page].sections[section].cells.splice(idx, 1);    
        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === page) return {sections: modifiedLesson.pages[page].section[section]}
                else return {...pageDef}
            })
        });
    }

    const addSection = (newSection, page, section) => {
        let modifiedLesson = {...lessonDefinition};
        modifiedLesson.pages[page].sections.splice(section+1, 0, newSection);    
        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === page) return {sections: modifiedLesson.pages[page]}
                else return {...pageDef}
            })
        });
    }

    const removeSection = (page, section) => {
        let modifiedLesson = {...lessonDefinition};
        modifiedLesson.pages[page].sections.splice(section, 1);
        // modifiedLesson.pages[page].sections[section].cells = modifiedLesson.pages[page].sections[section].cells.splice(idx, 1);    
        setLessonDefinition({
            pages: lessonDefinition.pages.map((pageDef, iPage) => {
                if (iPage === page) return {sections: modifiedLesson.pages[page].section[section]}
                else return {...pageDef}
            })
        });
    }

    return (
        <LessonContext.Provider value={{...value, updateCell, addCell, addSection, removeCell, removeSection}}>
            {props.children}
        </LessonContext.Provider>
    )
}

export default LessonContextProvider;