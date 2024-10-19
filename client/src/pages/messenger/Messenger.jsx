import Message from '../../components/message/Message'
import Conversation from '../../components/conversation/Conversation'
import Topbar from '../../components/topbar/Topbar'
import './Messenger.css'
import { Send } from '@mui/icons-material'
import { Alert } from '@mui/material'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { io } from 'socket.io-client'
import { Link } from 'react-router-dom'

export default function Messenger() {
	const [conversation, setConversation] = useState([])
	const [currentChat, setCurrentChat] = useState(null)
	const [messages, setMessages] = useState([])
	const [arrivalMessage, setArrivalMessage] = useState(null)
	const [newMessage, setNewMessage] = useState('')
	const [onlineUsers, setOnlineUsers] = useState([])
	const socket = useRef()
	const { user } = useContext(AuthContext)
	const scrollRef = useRef()
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	const [userName, setUserName] = useState('');

	useEffect(() => {
		socket.current = io('ws://localhost:8900');
		socket.current.on("getMessage", (data) => {
			setArrivalMessage({
				sender: data.senderId,
				text: data.text,
				createdAt: Date.now()
			})
		})
	}, []);

	useEffect(() => {
		arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
			setMessages((prev) => [...prev, arrivalMessage])
	}, [arrivalMessage, currentChat]);

	useEffect(() => {
		socket.current.emit("addUser", user._id)
		socket.current.on("getUsers", (users) => {
			setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId === f)))
		})
	}, [user]);

	const getUser = async (conversation) => {
		try {
			const res = await axios.get(`/users?userId=${conversation.members.find(m => m !== user._id)}`);
			return res.data.username;
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const getUserData = async () => {
			const userData = await getUser(currentChat);
			setUserName(userData);
		};
		getUserData();
	}, [currentChat]);

	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await axios.get('/conversations/' + user._id)
				setConversation(res.data)
			} catch (err) {
				console.log(err)
			}
		}
		getConversations()
	}, [user._id])

	useEffect(() => {
		const getMessages = async () => {
			try {
				const res = await axios.get('/messages/' + currentChat?._id)
				setMessages(res.data)
			} catch (err) {
				console.log(err)
			}
		}
		getMessages()
	}, [currentChat])

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [messages])

	const handleSubmit = async (e) => {
		e.preventDefault()
		const message = {
			sender: user._id,
			text: newMessage,
			conversationId: currentChat?._id
		}

		// send message
		socket.current.emit('sendMessage', {
			senderId: user._id,
			receiverId: currentChat?.members.find(m => m !== user._id),
			text: newMessage
		})

		try {
			const res = await axios.post('/messages', message)
			setMessages([...messages, res.data])
			setNewMessage('')
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<>
			<Topbar />
			<div className='messenger'>
				<div className='chatMenu'>
					<div className='chatMenuWrapper'>
						<input placeholder='search for friends' className='chatMenuInput' />
						{conversation.map(c => (
							<div onClick={() => setCurrentChat(c)}>
								<Conversation key={c._id} conversation={c} currentUser={user} />
							</div>
						))}


					</div>
				</div>
				<div className='chatBox'>
					<div className='chatBoxWrapper'>
						{currentChat && (
							<div className='chatBoxHeader'>
								<Link to={`/profile/${userName}`} key={userName}>
									<img src={currentChat.members.find(m => m !== user._id).profilePicture ? PF + currentChat.members.find(m => m !== user._id).profilePicture : PF + 'person/noAvatar.png'} alt='' className='chatBoxHeaderImg' />
								</Link>
								<span className='chatBoxHeaderName'>{userName}</span>
							</div>
						)}
						{currentChat ?

							<>
								<div className='chatBoxTop'>
									{messages.map(m => (
										<div ref={scrollRef}>
											<Message key={m._id} message={m} own={m.sender === user._id} />
										</div>
									))}
								</div>
								<div className='chatBoxBottom'>
									<textarea
										onKeyDown={e => e.key === 'Enter' && newMessage.trim() !== '' ? handleSubmit(e) : null}
										value={newMessage}
										onChange={e => setNewMessage(e.target.value)}
										placeholder='Message...'
										className='chatBoxBottomInput' />
									<button onClick={handleSubmit} className='chatSubmitButton'><Send /></button>
								</div>
							</> : <Alert severity="info">Please select a conversation.</Alert>
						}
					</div>
				</div>
				<div className='chatOnline'>
					<div className='chatOnlineWrapper'>
						<ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
					</div>
				</div>
			</div>
		</>
	)
}

