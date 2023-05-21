import React, { useState, useEffect } from 'react'; 
import Editor from '@monaco-editor/react';

const MonacoEditor = ({updateEditorValueHandler, ...props}) => {
    const [monaco, setMonaco] = useState(null);
    const [editorValue, setEditorValue] = useState(props.text);

    const handleEditorDidMount = (editor, monaco) => {
        setMonaco(monaco);
        props.editorRef.current = editor;
        monaco.editor.defineTheme('rustafariapp', {
          base: 'vs-dark',
          inherit: true,
          rules: [],
          colors: {
            'editor.background': '#262335',
          },
        });
        monaco.editor.setTheme('rustafariapp');
        if (props.editorRef.current !== null) props.editorRef.current.layout({ width: props.containerRef.current.clientWidth, height: props.editorRef.current.getContentHeight() });
      }
    
    useEffect(() => {
      // if (props.text.length !== 0 && props.text === props.editorRef.current?.getValue()) return;
      if (props.text.length !== 0 && props.text === editorValue) return;
      if (props.editorRef.current !== null) {props.editorRef.current.getModel().setValue(props.text);}
    }, [props.text, props.editorRef.current]);
    
    useEffect(() => {
      if (props.editorRef.current !== null) props.editorRef.current.layout({ width: props.containerRef.current.clientWidth, height: props.editorRef.current.getContentHeight() });
    }, [props.editorRef.current, props.containerRef]);

    useEffect(() => {
      const timeOutId = setTimeout(() => {updateEditorValueHandler(editorValue)}, 500);
      return () => clearTimeout(timeOutId);
    }, [editorValue, updateEditorValueHandler])

    // window.addEventListener("beforeunload", (event) => {
    //   setEditorValue(null);
    //   updateEditorValueHandler(props.editorRef.current.getValue());
    // });
    // window.addEventListener("unload", (event) => {
    //   setEditorValue(null);
    //   updateEditorValueHandler(props.editorRef.current.getValue());
    // });
    
    const editorChangeHandler = (event) => {
      setEditorValue(event);
      props.editorRef.current.layout({ width: props.containerRef.current.clientWidth, height: props.editorRef.current.getContentHeight() })
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
            fontSize: 14,
            wordWrap: "on",
            lineNumbers: "off",
            automaticLayout: true,
            scrollBeyondLastLine: false
        }}
        width="100%"
        defaultLanguage="rust" 
        onMount={handleEditorDidMount} 
        defaultValue={props.text} 
        // value={editorValue}
        onChange={editorChangeHandler}/>
    )
}

export default MonacoEditor