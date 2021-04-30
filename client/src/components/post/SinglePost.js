import React, { useEffect, Fragment } from 'react'
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getPost } from "../../actions/post";
import PostItem from "../posts/PostItem";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import Spinner from '../layout/Spinner';

const SinglePost = ({ getPost, post: { post, loading }, match }) => {

  useEffect(() => {
    getPost(match.params.id)
  }, [])

  return (
    <Fragment>
      <Link to="/posts" className="btn">Back to posts</Link>
      {loading || post === null ? <Spinner /> :
        <Fragment>
          <PostItem post={post} showActions={false} />
          <CommentForm postId={post._id} />

          <div className="comments">
            {post.comments.length > 0 && post.comments.map(comment => (
              <CommentItem key={comment._id} comment={comment} postId={post._id} />
            ))}
          </div>

        </Fragment>
      }
    </Fragment>
  )
}


const mapStateToProps = state => ({
  post: state.post
})

export default connect(mapStateToProps, { getPost })(SinglePost)
