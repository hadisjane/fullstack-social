const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//CREATE POST
router.post("/", async (req, res) => {
	const newPost = new Post(req.body);
	try {
		const savedPost = await newPost.save();
		res.status(200).json(savedPost);
	} catch (err) {
		res.status(500).json(err);
	}
});

//UPDATE POST
router.put("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await post.updateOne({ $set: req.body });
			res.status(200).json("the post has been updated");
		} else {
			res.status(403).json("you can update only your post");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE POST	
router.delete("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await post.deleteOne();
			res.status(200).json("the post has been deleted");
		} else {
			res.status(403).json("you can delete only your post");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//LIKE POST
router.put("/:id/like", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } });
			res.status(200).json("the post has been liked");
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } });	
			res.status(200).json("the post has been disliked");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET POST
router.get("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
});	

//TIMELINE
router.get("/timeline/:userId", async (req, res) => {
	try {
	  const currentUser = await User.findById(req.params.userId);
	  const userPosts = await Post.find({ userId: currentUser._id });
	  const friendPosts = await Promise.all(
		 currentUser.followings.map((friendId) => {
			return Post.find({ userId: friendId });
		 })
	  );
	  res.status(200).json(userPosts.concat(...friendPosts));
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: "Internal Server Error" });
	}
 });

//GET USER POSTS
router.get("/profile/:username", async (req, res) => {
	try {
		const user = await User.findOne({ username: req.params.username });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const posts = await Post.find({ userId: user._id });
		res.status(200).json(posts);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router; 