import React, { useState } from "react";
import './index.css'
import './containers/index.js'
import { Footer, MainContent, NavBar, SideBar } from "./containers/index.js";
const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [videos, setVideos] = useState([])
  return (
        <>
        <div className="flex flex-col h-screen overflow-y-clip select-text">
          <div >
            <NavBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setVideos={setVideos}/>
            </div> 
            <div className="flex flex-row overflow-y-clip">
              <SideBar  searchTerm={searchTerm} setSearchTerm={setSearchTerm} setVideos={setVideos}/>
              <MainContent videos={videos}/>
            </div>
            <Footer/>
        </div>
        </>
  )
}
export default App