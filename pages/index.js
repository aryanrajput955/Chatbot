import { useState } from "react";
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const[value,setvalue]=useState("")
  const[error,setError]=useState("")
  const[chatHistory,setchatHistory]=useState([])
  const surpriseOptions=[
    "Who won the latest Novel Peace Prize?",
    "Where does Pizza come from?",
    "How do you make sandwich?",
    "What is AI?"

  ]
  const surprise= ()=>{
    const randomValue= surpriseOptions[Math.floor(Math.random()*surpriseOptions.length)]
    setvalue(randomValue)
  }

  const getResponse= async()=>{
    if(!value){
      setError("Error! Please ask a question!")
      return
    }
    try{
      const options={
        method:'POST',
        body:JSON.stringify({
           history:chatHistory,
           message: value
        }),
        headers:{
          'Content-Type':'application/json'
        }
      }
      const response=await fetch('http://localhost:8000/gemini',options)
      const data=await response.text()

      setchatHistory([...chatHistory,{
        role:'user',
        parts:[{text : value}]
      },
        {
          role:'model',
          parts: [{text: data}]
        }

    

      ])
      setvalue("")
      // console.log("history",chatHistory)
    }catch(error){
      console.error(error)
      setError("Somethig went wrong ! Please try again.")
    }
  }

  const clear=()=>{
    setvalue("")
    setError("")
    setchatHistory([])
  }
  return (
    <main>
    <div className=" w-[20vw] m-[10vw] h-[80vh]">
  
        <p className=" p-2 m-1">
          what do you want to know?
          <button onClick={surprise} disabled={!chatHistory} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow">
            surprise me!</button>
       </p>
       <div className=" flex w-full  border-solid border-[0.5px] border-x-yellow-50  box-border rounded-lg shadow-lg overflow-hidden">
        <input className=" box-border py-3 px-4 border-none outline-none text-sm w-11/12 font-extralight"
          value={value}
          placeholder="when is christmas?"
          onChange={(e)=>setvalue(e.target.value)}
        />
        
        {!error && <button onClick= {getResponse} className=" min-w-2   border-l-2   border-gray-300 bg-gray-400   font-bold cursor-pointer">Ask me</button>}
        {error && <button onClick={clear}>clear</button>}
       </div>
       {error &&<p>{error}</p>}

       <div className="search-reuslt mt-3 overflow-scroll">
        {chatHistory.map((chatItem,_index)=><div key={_index}>
        <p className="answer py-3 px-3 border-solid border-[0.5px] border-[#cacaca] m-1 text-sm font-extralight rounded-md">
          {chatItem.role}:{chatItem.parts[0].text}</p>
        </div>)}
       </div>
    </div>
    
    </main>
  );
}