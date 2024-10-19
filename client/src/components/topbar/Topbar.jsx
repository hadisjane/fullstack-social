import { Search, Person, Chat, Notifications, Logout } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './Topbar.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';


export default function Topbar() {
	const { user } = useContext(AuthContext)
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	return (
		<div className="topbarContainer">
			<div className="topbarLeft">
				<Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
					<span className="logo">fakebook</span>
				</Link>
			</div>
			<div className="topbarCenter">
				<div className="searchbar">
					<Search className="searchIcon" />
					<input
						placeholder="Search for friend, post or video"
						className="searchInput"
					/>
				</div>
			</div>
			<div className="topbarRight">
				<div className="topbarLinks">
					<span className="topbarLink">Homepage</span>
					<span className="topbarLink">Timeline</span>
				</div>
				<div className="topbarIcons">
					<div className="topbarIconItem">
						<Person />
						<span className="topbarIconBadge">1</span>
					</div>
					<Link style={{ textDecoration: "none", color: "inherit" }} to="/messenger">
						<div className="topbarIconItem">
							<Chat />
							<span className="topbarIconBadge">2</span>
						</div>
					</Link>
					<div className="topbarIconItem">
						<Notifications />
						<span className="topbarIconBadge">1</span>
					</div>
					<div className="topbarIconItem" onClick={() => {
						localStorage.clear()
						window.location.replace("/login")
					}}>
						<Logout />
					</div>

				</div>
				<Link to={`/profile/${user?.username}`}>
					<img src={user?.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"} alt="#" className="topbarImg" />
				</Link>
			</div>
		</div>
	);
}
