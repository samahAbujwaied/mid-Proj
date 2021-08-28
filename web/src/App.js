import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import "./App.css"
const socket = io('http://localhost:9000', { transports : ['websocket', 'polling', 'flashsocket'] });
function App() {
	const [ state, setState ] = useState({ignoreyourmsg:"",yourmsg:"",check:false,check2:false ,message: "", name: "" ,acceptmsg:"",ignoremsg:"",themsg:"",ignmsg:""})
	const [ chat, setChat ] = useState([])
	const socketRef = useRef()

	useEffect(
		
		() => {
			socketRef.current = io.connect("http://localhost:7000/discord")
			socketRef.current.on("sendaccept",msg=>{
				console.log('mssssssg====',msg.msgreq,msg.massage);
				setState({ acceptmsg:msg.msgreq,yourmsg:msg.massage, check:true})
			})
			socketRef.current.on("sendignore",msg=>{
				console.log(msg.msgreq);
				setState({ ignoremsg:msg.msgreq,ignoreyourmsg:msg.massageig, check2:true})
			})
			socketRef.current.on("admin-data", ({ name, message ,id}) => {
				setChat([ ...chat, { name, message } ])
				socketRef.current.emit('get_all-client');
				// socketRef.current.emit('received-client', id)
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
		socketRef.current.emit("client_msg", { name, message })
		socketRef.current.emit("admin_msg", { name, message })
		e.preventDefault()
		setState({ message: "", name })
		
		
	}

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
			</div>
		))
		
	
		
	}

	return (
	<>
	<h1 className="Title" >Student MORS 🧑🏽‍💻</h1>

		<div className="card">
			<form onSubmit={onMessageSubmit}>
		
				<h1>Student page 📚 📚  </h1>
				<div className="name-field">
					<TextField required name="name" onChange={(e) => onTextChange(e)} value={state.name} label="Name" />
				</div>
				<div>
					<TextField
						required
						name="message"
						onChange={(e) => onTextChange(e)}
						value={state.message}
						id="outlined-multiline-static"
						variant="outlined"
						label="Message"
					/>
				</div>
				<button>Pick Ticket</button>
			</form>
			<div className="render-chat">
				<h1>Response  ⌛️ ⌛️</h1>
				{renderChat()}
				<section>
			
			{state.check &&  <h1 style={{color:"white" , textShadow:"2px 2px 2px green"}}> Your Message {state.yourmsg} is {state.acceptmsg}  </h1>}  
			</section>
			
			<section>
			{state.check2 && <h1 style={{color:"white",textShadow:"2px 2px 2px maroon"}}> Your Message {state.ignoreyourmsg} is {state.ignoremsg} </h1>}
		
	     	</section>
			</div>

			
			
		
		</div>
		</>
	)

}

export default App

