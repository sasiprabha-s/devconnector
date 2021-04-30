const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Posts = require("../../models/Posts");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    console.log("arjunreq", req);
    const { id } = req.user;
    const { text } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(id).select("-password");

      const newPost = new Posts({
        text,
        name: user.name,
        avatar: user.avatar,
        user: id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// Get Posts

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Posts.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get Post By Id
router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  console.log("post", id);

  try {
    const post = await Posts.findById(id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server error");
  }
});

// Delete Post
router.delete("/:delId", auth, async (req, res) => {
  const { delId } = req.params;
  const { id } = req.user;
  try {
    const post = await Posts.findById(delId);

    if (post.user.toString() !== id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server error");
  }
});

// Post Likes
router.put("/likes/:postid", auth, async (req, res) => {
  const { id } = req.user;
  const { postid } = req.params;

  try {
    const post = await Posts.findById(postid);

    // Check this post had already been liked
    if (post.likes.filter((like) => like.user.toString() === id).length > 0) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Post unlike
router.put("/unlike/:postid", auth, async (req, res) => {
  const { id } = req.user;
  const { postid } = req.params;

  try {
    const post = await Posts.findById(postid);

    // Check this post had already been liked
    if (post.likes.filter((like) => like.user.toString() === id).length === 0) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Post comments

router.post(
  "/comments/:postid",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const { id } = req.user;
    const { postid } = req.params;
    const { text } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(id).select("-password");

      const post = await Posts.findById(postid);

      const newComment = {
        text,
        name: user.name,
        avatar: user.avatar,
        user: id,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// Delete Comment

router.delete("/comments/:postid/:commentid", auth, async (req, res) => {
  const { postid, commentid } = req.params;
  const { id } = req.user;

  try {
    const post = await Post.findById(postid);

    // pull out comment
    const comment = post.comments.find((comment) => comment.id === commentid);

    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Check user
    if (comment.user.toString() !== id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
