import React, { useState, useEffect, memo, forwardRef, useRef } from 'react'; 
import Editor from '@monaco-editor/react';
import { COLORS } from '../../values/colors.js'

const MonacoEditor = memo(forwardRef(function MonacoEditor(props, ref) {
    const {editorRef, containerRef} = ref;
    const {updateEditorValueHandler, text} = props;
    const [monaco, setMonaco] = useState(null);
    const [editorValue, setEditorValue] = useState(text);
    const prevEditorValue = useRef(text);
    const [width, setWidth] = useState(window.innerWidth);
    const [fontSize, setFontSize] = useState("16px");

    const handleEditorDidMount = (editor, monaco) => {
        setMonaco(monaco);
        editorRef.current = editor;
        monaco.editor.defineTheme('rustafariapp', {
          base: 'vs-dark',
          inherit: true,
          rules: [],
          colors: {
            'editor.foreground': COLORS.code_color,
            'editor.background': COLORS.dark_gray,
          },
        });
        monaco.editor.setTheme('rustafariapp');
        if (editorRef.current !== null) editorRef.current.layout({ width: containerRef.current.clientWidth, height: editorRef.current.getContentHeight() });
      }
      
    useEffect(() => {
      prevEditorValue.current = editorValue;
    }, [editorValue])

    useEffect(() => {
      function handleResize() {
        setWidth(window.innerWidth);
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [width]);
  
    useEffect(() => {
      const timeOutId = setTimeout(() => {
      monaco && document.fonts.ready.then(() => {
        monaco.editor.remeasureFonts();
        if (width >= 2560){
          setFontSize("30px");
        } else if (width >= 1920) {
          setFontSize("22px");
        } else if (width >= 1024) {
          setFontSize("16px");
        } else {
          setFontSize("12px");
        }
      })}, 40);
      return () => clearTimeout(timeOutId);
    }, [width, monaco]);
  

    useEffect(() => {
      const syncEditorValues = () => {
        if (text !== null){
          if (text.length !== 0 && text === prevEditorValue.current) return;
          if (editorRef.current !== null && editorRef.current?.getModel() !== null) editorRef.current?.getModel().setValue(text);  
        }
      }

      syncEditorValues();
    }, [text, editorRef]);

    useEffect(() => {
      const updateEditorSize = () => {
        if (editorRef.current !== null) editorRef.current.layout({ width: containerRef.current.clientWidth, height: editorRef.current.getContentHeight() });
      }

      updateEditorSize();
    })

    useEffect(() => {
      const timeOutId = setTimeout(() => {updateEditorValueHandler(editorValue)}, 650);
      return () => clearTimeout(timeOutId);
    }, [editorValue, updateEditorValueHandler])

    const editorChangeHandler = (event) => {
      setEditorValue(event);
      editorRef.current.layout({ width: containerRef.current.clientWidth, height: editorRef.current.getContentHeight() })
    }

    return (
        <Editor 
        options={{
            minimap: {
            enabled: false,
            },
            scrollbar: {
            alwaysConsumeMouseWheel: false
            },
            fontSize: fontSize,
            wordWrap: "on",
            lineNumbers: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            readOnly: props.readOnly === undefined ? false : props.readOnly
        }}
        width="100%"
        defaultLanguage="rust" 
        onMount={handleEditorDidMount} 
        defaultValue={text} 
        // value={editorValue}
        onChange={editorChangeHandler}/>
    )
}))

export default MonacoEditor