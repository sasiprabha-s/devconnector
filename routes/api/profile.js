const express = require("express");
const router = express.Router();
const request = require("request");
const config = require("config");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Posts = require("../../models/Posts");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

router.get("/me", auth, async (req, res) => {
  const { id } = req.user;
  try {
    const profile = await Profile.findOne({ user: id }).populate("user", [
      "name",
      "avatar",
    ]);

    console.log("profile", profile);

    if (!profile) {
      res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Post Profile

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { id } = req.user;

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      location,
      website,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Profile object

    let profileFields = {};

    profileFields.user = id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: id });

      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          { user: id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// GET all profiles

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get Profile by userId

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = await Profile.findOne({ user: userId }).populate("user", [
      "name",
      "avatar",
    ]);

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server error");
  }
});

// Delete Profile,User and Posts
router.delete("/", auth, async (req, res) => {
  const { id } = req.user;
  try {
    // Remove user posts
    await Posts.deleteMany({ user: id });

    // Remove Profile
    await Profile.findOneAndRemove({ user: id });

    // Remove User
    await User.findOneAndRemove({ _id: id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),

      check("company", "Company is required").not().isEmpty(),

      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const { id } = req.user;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      title,
      current,
      from,
      to,
      location,
      description,
    } = req.body;

    const newExperience = {
      company,
      title,
      current,
      from,
      to,
      location,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: id });
      profile.experience.unshift(newExperience);
      await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// Delete Experience
router.delete("/experience/:expId", auth, async (req, res) => {
  const { expId } = req.params;
  const { id } = req.user;

  try {
    const profile = await Profile.findOne({ user: id });

    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(expId);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Add Education
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),

      check("degree", "Degree is required").not().isEmpty(),

      check("fieldofstudy", "Field of study is required").not().isEmpty(),

      check("from", "From data is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    console.log("req", req.user, req.body);

    const { id } = req.user;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      fieldofstudy,
      degree,
      from,
      to,
      description,
      current,
    } = req.body;

    const newEducation = {
      school,
      fieldofstudy,
      degree,
      from,
      to,
      description,
      current,
    };

    try {
      const profile = await Profile.findOne({ user: id });
      console.log("profile", profile)
      profile.education.unshift(newEducation);

      await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// Delete Education
router.delete("/education/:eduId", auth, async (req, res) => {
  const { eduId } = req.params;
  const { id } = req.user;

  try {
    const profile = await Profile.findOne({ user: id });

    const removeIndex = profile.education.map((item) => item.id).indexOf(eduId);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get Github repos
router.get("/github/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const options = {
      uri: `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No github profile found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
