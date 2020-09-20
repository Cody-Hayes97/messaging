import React, {useState, useEffect} from 'react';
import io from 'socket.io-client'
import TextField from '@material-ui/core/TextField'
import './App.css';

const socket = io.connect('http://localhost:4000/')

function App() {
  const [state, setState] = useState({
    message: "",
    name: ""
  })
  const [chat, setChat] = useState([])

  useEffect(() => {
    socket.on('message', ({name, message}) => {
      setChat([...chat, {name,message}])
    })
  })

  const renderChat = () => {
    return chat.map(({name,message}) => (
      <div key={name}>
        <h3>{name}: <span>{message}</span></h3>
      </div>
    ))
  }

  const onTextChange = (e) => {
    setState({...state, [e.target.name]: e.target.value})
  }


  const onMessageSubmit = e => {
    e.preventDefault()
    const {name, message} = state
    socket.emit('message', {name, message})
    setState({message: "", name})
  }

  return (
    <div className="App">
    <form onSubmit={onMessageSubmit}>
    <h1>Messenger</h1>
    <div>
      <TextField name="name" onChange={e => onTextChange(e)} value={state.name} label="Name"/>
    </div>
    <div>
      <TextField name="message" onChange={e => onTextChange(e)} value={state.message} label="Message" variant="outlined"/>
    </div>
    <button>Send Message</button>
    </form>
    <div>
      <h1>Chat Log</h1>
      {renderChat()}
    </div>

  
    </div>
  );
}

export default App;
