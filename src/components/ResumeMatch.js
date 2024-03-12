import React from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from '../config/config';
import { useState } from 'react';
import pdfToText from  'react-pdftotext'
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { JsonToTable } from "react-json-to-table";


const ResumeMatch = () => {
	
	const genAI = new GoogleGenerativeAI(`${API_KEY}`);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
	
	const [jd, setJD] = useState('');
	const [aiResponse, setResponse] = useState('');
	const [selectedFile, setSelectedFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
 
  
  const onJDChange = (e) => {
    setJD(e.target.value);
  }

   // On file select (from the pop up)
 const onFileChange = (event) => {
    event.preventDefault();
    // Update the state
    setSelectedFile(event.target.files[0])
    const file = event.target.files[0]
    if (file.type == "application/pdf") {
        pdfToText(file) 
            .then(text => setText(text))
            .catch(error => console.error("Failed to extract text from pdf"))
            console.log(text);
    } else if(file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const content = event.target.result;
          var doc = new Docxtemplater(new PizZip(content), {delimiters: {start: '12op1j2po1j2poj1po', end: 'op21j4po21jp4oj1op24j'}});
          setText(doc.getFullText());
          console.log(text)
        };
        reader.readAsBinaryString(file);
    } else {
      alert("Please upload only .docx and .pdf files...!");
    }
    
};

//Prompt Template
const input_prompt = `Act Like a Highly Skilled Human Resource and Identify the resumes of candidates with the following attributes:
1 to 10 years of experience in Software Development, JAVA, J2EE Engineer. 
resume: ${text}
description: ${jd} 
I want the response as percentae match of resume with JD and missing skills
{"JDMatch":"%","MissingKeywords:[]","ProfileSummary":"", "CandidateName":"", "Mobile":""} `;
  
// Generative AI Call to fetch dishes
async function aiRun() {
  setLoading(true);
  setResponse('');
  console.log(text);
  //const prompt = 'provide matched accuracy with the given ${jd} and resume ${selectedFile}';
  const result = await model.generateContent(input_prompt);
  const response = await result.response;
  const textData = response.text();
  const jsonResponse = JSON.parse(textData);
  setResponse(jsonResponse);
  setLoading(false);
}


// button event trigger to consume gemini Api
const handleSubmit = () => {
  aiRun();
}
	
  return (
    <div>
    <h1>Resume Best Match</h1>
    <div>
      <label>
        Enter Job Description:
        <input type="text" name="jobdescription" onChange={onJDChange} />
      </label><br></br>
      <label>
        Upload Your Resume:
        <input
            type="file"
            onChange={onFileChange} draggable="true" accept=".docx,application/pdf" maxFileSize={1000000}
            multiple/>
        </label>
        <button onClick={handleSubmit} style={{ margin: '30px 0' }}>
            MATCH
        </button>
    </div>
    {
    loading == true && (aiResponse == '') ?
        <p style={{ margin: '30px 0' }}>Loading ...</p>
        :
      <div style={{ margin: '30px 0' }}>
           <JsonToTable json={aiResponse} />
      </div>     
   }
</div>

  );
};

export default ResumeMatch;