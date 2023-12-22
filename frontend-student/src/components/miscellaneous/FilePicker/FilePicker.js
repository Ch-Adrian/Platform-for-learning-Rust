import React from "react";
import {useDropzone} from 'react-dropzone';
import "./FilePicker.css";

const FilePicker = (props) => {
    const onDrop = file => {
        const read = new FileReader();
        read.readAsText(file[0]);
        read.onloadend = () => {
            props.openLesson(JSON.parse(read.result), file[0].name)
        }
    }

    const {getRootProps, 
        getInputProps, 
        isDragActive,
        } = useDropzone({
            onDrop: onDrop, 
            multiple: false,
            accept: {
                'application/json': ['.json']
            }})

    return (
        <div className='file-picker-box' {...getRootProps({className: "file-picker-box"})}>
            <div  style={{borderColor: isDragActive ? "rgb(255, 255, 255)" : ""}}>
                <input data-cy="upload-lesson-button" {...getInputProps()} />
                {
                isDragActive ?
                    <div>Importuj lekcję z komputera</div> :
                    <div>Importuj lekcję z komputera</div>
                }
            </div>
        </div>
        
    )
  
}

export default FilePicker