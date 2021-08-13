import logo from './logo.svg';
import './App.css';
import {useState} from 'react'
import Snooper from './components/Snooper';
import Home from './components/Home'
import ghost from './assets/ghost.png'
function App(props) {
  const [active, setActive] = useState(false)
  return (
    <div className="App bg-gray-700 text-white min-h-screen">
        <nav>
        <ul class="flex flex-row items-end justify-end">
          <li class="mx-2 text-sm font-bold p-3">
            <a href="https://github.com/jakermate/spoofer" target="_blank" rel="noreferrer">
              github
            </a>
          </li>
        
        </ul>
      </nav>
      <header className="pt-24">
        <img src={ghost} alt="" class="w-24 inline-block mb-3" />
          <h1 class="font-semibold text-5xl text-center ">SPOOFER</h1>
          <h5 class="font-light text-lg text-center">Pentesting Site Spoof Tool</h5>
          
        <div class="mt-32 font-light text-sm">*This site is to be used soely for the purposes of pentesting or ethical hacking, and is not authorized for use in illegal activity.</div>
      </header>
     {
       active ? <Snooper></Snooper> : <Home></Home>
     }
    </div>
  );
}

export default App;
