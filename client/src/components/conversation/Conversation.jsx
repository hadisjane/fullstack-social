import { useEffect, useState } from 'react'
import './Conversation.css'
import axios from 'axios'

export default function Conversation({ conversation, currentUser }) {
	const [user, setUser] = useState(null)
	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	useEffect(() => {
		const friendId = conversation.members.find((m) => m !== currentUser._id);
		const getUser = async () => {
			try {
				const res = await axios.get(`/users?userId=${friendId}`);
				setUser(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		getUser();
	}, [conversation, currentUser]);

	return (
		<div className='conversation'>
			<img
				src={user?.profilePicture ? PF + user.profilePicture : PF + 'person/noAvatar.png'}
				className='conversationImg'
				alt='' />
			<span className='conversationName'>{user?.username}</span>
		</div>
	)
}
