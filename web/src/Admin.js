import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import "./App.css"
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
function Admin() {
	const [ state, setState ] = useState({ message: "", name: "" ,id:"" })
	const [ chat, setChat ] = useState([])

	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:7000/discord")
		
			// socketRef.current.emit('admin_msg', value);
			socketRef.current.on("res-client", ({ name, message,id }) => {
				setChat([ ...chat, { name, message,id } ])
				socketRef.current.emit('get_all')
				// socketRef.current.emit('received-admin', id)
			})
			return () => socketRef.current.disconnect()
		},
		[ chat ]
	)

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = state
		socketRef.current.emit("admin_msg", { name, message })
		e.preventDefault()
		setState({ message: "", name })
		
	}
    const acceptbtn=(e)=>{
		
	 socketRef.current.emit("accept_msg", ({accept:'accept',gotmsg:chat[0].message}))
	 console.log('asmklasmklnsdnjksnljn',chat[0].message);
  
		console.log('accept');
		e.preventDefault()
	}
	const ignorebtn=(e)=>{

		socketRef.current.emit("ignore_msg", ({ignore:'ignore',gotmsg:chat[0].message}))
	    console.log('a++++++++++++++++',chat[0].message);
    
		console.log('ignore');
		e.preventDefault()
	
	}
	
	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
				<button value="accept" onClick={acceptbtn} >accept
				
				</button>

				<button value="ignore" onClick={ignorebtn}  >ignore</button>
			</div>
		))
	}

	return (
		<div className="card">
			<form onSubmit={onMessageSubmit}>
				<h1>Messenger</h1>
				<div className="name-field">
					<TextField name="name" onChange={(e) => onTextChange(e)} value={state.name} label="Name" />
				</div>
				<div>
					<TextField
						name="message"
						onChange={(e) => onTextChange(e)}
						value={state.message}
						id="outlined-multiline-static"
						variant="outlined"
						label="Message"
					/>
				</div>
				<button>Send Message</button>
			</form>
			<div className="render-chat">
				<h1>Chat Log</h1>
				{renderChat()}
			</div>
		</div>
	)
}

export default Admin

