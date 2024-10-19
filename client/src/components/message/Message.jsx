import './Message.css'
import { format } from 'timeago.js'
export default function Message({ message, own }) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	return (
		<div className={own ? 'message own' : 'message'}>
			<div className='messageTop'>
				<img className='messageImg' src={own ? PF + message.sender.profilePicture : PF + "person/noAvatar.png"} alt='' />
				<p className='messageText'>{message.text}</p>
			</div>
			<div className='messageBottom'>
				<p className='messageTime'>{format(message.createdAt)}</p>
			</div>
		</div>
	)
}

