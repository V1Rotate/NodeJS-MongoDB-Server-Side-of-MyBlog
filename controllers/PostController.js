import PostModel from '../models/Post.js';

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title, // body is what we get from the post author aka user.
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId, // we get this from userAuth.
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({
      message: 'Article is not created',
    });
  }
};
