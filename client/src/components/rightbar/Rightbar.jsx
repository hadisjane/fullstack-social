import "./Rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Close, Remove, Send, Settings } from "@mui/icons-material";

export default function Rightbar({ user }) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const [friends, setFriends] = useState([])
	const { user: currentUser, dispatch } = useContext(AuthContext)
	const [followed, setFollowed] = useState(false)
	const [showPopup, setShowPopup] = useState(false)
	const messageRef = useRef("")

	const handleSendClick = async () => {
		setShowPopup(true)
	}

	const handleClosePopup = () => {
		setShowPopup(false)
	}

	const handleSendMessage = async () => {
		if (messageRef.current.value.trim() !== "") {
			try {
				const res = await axios.get("/conversations/find/" + currentUser._id + "/" + user?._id);

				if (res.data) {
					await axios.post("/messages", {
						conversationId: res.data._id,
						sender: currentUser._id,
						text: messageRef.current.value,
					})
				} else {
					const newConversation = await axios.post("/conversations", {
						senderId: currentUser._id,
						receiverId: user?._id
					});

					await axios.post("/messages", {
						conversationId: newConversation.data._id,
						sender: currentUser._id,
						text: messageRef.current.value,
					})
				}
			} catch (err) {
				console.log(err);
			}
			setShowPopup(false)
			messageRef.current.value = ''
		}
	}

	useEffect(() => {
		const getFriends = async () => {
			try {
				const friendList = await axios.get("/users/friends/" + user?._id)
				setFriends(friendList.data)
				setFollowed(currentUser.followings.includes(user?._id))
			} catch (err) {
				console.log(err)
			}
		}
		user && getFriends()
	}, [user, currentUser])

	const handleClick = async () => {
		try {
			if (followed) {
				await axios.put(`/users/${user?._id}/unfollow`, { userId: currentUser._id })
				dispatch({ type: "UNFOLLOW", payload: user?._id })
			} else {
				await axios.put(`/users/${user?._id}/follow`, { userId: currentUser._id })
				dispatch({ type: "FOLLOW", payload: user?._id })
			}
		} catch (err) {
			console.log(err)
		}
		setFollowed(!followed)
	}

	const HomeRightbar = () => {
		return (
			<>
				<div className="birthdayContainer">
					<img className="birthdayImg" src={`${PF}gift.png`} alt="" />
					<span className="birthdayText">
						<b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
					</span>
				</div>
				<img className="rightbarAd" src={`${PF}ad.png`} alt="" />
				<h4 className="rightbarTitle">Online Friends</h4>
				<ul className="rightbarFriendList">
					{Users.map((u) => (
						<Online key={u.id} user={u} />
					))}
				</ul>
			</>
		);
	};

	const ProfileRightbar = () => {
		return (
			<>
				{user.username !== currentUser.username && (
					<button className="rightbarFollowButton" onClick={handleClick}>
						{followed ? "Unfollow" : "Follow"}
						{followed ? <Remove /> : <Add />}
					</button>
				)}
				{user.username !== currentUser.username && (
					<button className="rightbarSendMessageButton" onClick={handleSendClick}>
						Send Message <Send />
					</button>
				)}
				{user.username === currentUser.username && (
					<button className="rightbarEditButton">Edit Profile <Settings /></button>
				)}
				<h4 className="rightbarTitle">User information</h4>
				<div className="rightbarInfo">
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">City:</span>
						<span className="rightbarInfoValue">{user?.city ? user?.city : "Not Chosen"}</span>
					</div>
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">Age:</span>
						<span className="rightbarInfoValue">{user?.age}</span>
					</div>
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">Relationship:</span>
						<span className="rightbarInfoValue">
							{user?.relationship === 1 ? "Single" : user?.relationship === 2 ? "Married" : "Not Chosen"}
						</span>
					</div>
				</div>
				<h4 className="rightbarTitle">User friends</h4>
				<div className="rightbarFollowings">
					{friends.map((friend) => (
						<Link to={`/profile/${friend.username}`} style={{ textDecoration: "none", color: "inherit" }}>
							<div className="rightbarFollowing" key={friend._id}>
								<img
									src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/noAvatar.png"}
									alt=""
									className="rightbarFollowingImg"
								/>
								<span className="rightbarFollowingName">{friend.username}</span>
							</div>
						</Link>
					))}
				</div>
				{showPopup && (
					<div className="rightbarPopup">
						<div className="rightbarPopupWrapper">
							<h4 className="rightbarPopupTitle">Send Message </h4>
							<textarea
								onKeyDown={(e) => {
									if (e.key === "Enter" && messageRef.current.value.trim() !== "") {
										handleSendMessage()
									}
								}}
								onKeyDownCapture={(e) => {
									if (e.key === "Escape") {
										handleClosePopup()
									}
								}}
								autoFocus
								type="text"
								className="rightbarPopupInput"
								placeholder="Type a message..."
								ref={messageRef}
							/>
							<div className="rightbarPopupButtons">
								<button className="rightbarPopupButton" onClick={handleClosePopup}>
									Cancel <Close />
								</button>
								<button className="rightbarPopupButton" onClick={handleSendMessage}>
									Send <Send />
								</button>
							</div>
						</div>
					</div>
				)}

			</>
		);
	};
	return (
		<div className="rightbar">
			<div className="rightbarWrapper">
				{user ? <ProfileRightbar /> : <HomeRightbar />}
			</div>
		</div>
	);
}
