import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import "./admin.css"
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
    const acceptbtn=(idx,e)=>{

	
		// let afterAcceptId;
		// chat.forEach((item)=>{	
	    //    if(item.id == chat[acceptId].id){
		// 	   afterAcceptId=item.id;
		//    }
		// })
		// console.log('afterAcceptId',afterAcceptId);
		// console.log('message',chat[acceptId].message);
	    socketRef.current.emit("accept_msg", ({accept:'Accepted',gotmsg:chat[idx].message}))
		
        
		e.preventDefault()
	}
	const ignorebtn=(idx,e)=>{

		socketRef.current.emit("ignore_msg", ({ignore:'Ignored',gotmsg:chat[idx].message}))
	    // console.log('a++++++++++++++++',chat[0].message);
    
		console.log('ignore');
		e.preventDefault()
	
	}
	
	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
				<button value="accept" style={{marginRight:"15px" , backgroundColor:"green" , color:"white"}}  onClick={(e)=>acceptbtn(index,e)} >Accept
				
				</button>

				<button value="ignore" style={{marginRight:"15px" , backgroundColor:"red" , color:"white"}} onClick={(e)=>ignorebtn(index,e)}  >Ignore</button>
			</div>
		))
	}

	return (
		<>
		<h1 className="Titleadmain" >Admin MORS</h1>
		<div className="card">
			<form  className= "form-admin"onSubmit={onMessageSubmit}>
				<h1>Admin page 📬📬</h1>
				<div className="name-field admin">
					<TextField required name="name"  onChange={(e) => onTextChange(e)} value={state.name} label="Name" />
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
				<button>Send Response </button>
			</form>
			<div className="render-chat admin-chat">
				<h1>Tickets 📨📨</h1>
				{renderChat()}
			</div>
		</div>
		</>
	)
}

export default Admin

