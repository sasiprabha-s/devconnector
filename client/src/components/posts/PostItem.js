import React, { Fragment } from 'react'

import { connect } from "react-redux";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { addLike, removeLike, deletePost } from "../../actions/post";

const PostItem = ({ post: { _id, name, avatar, text, likes, comments, user, date }, auth, addLike, removeLike, deletePost, showActions = true }) => {
  return (
    <div class="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img
            class="round-img"
            src={avatar}
            alt="avatar"

          />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p class="my-1">
          {text}
        </p>
        <p class="post-date">
          Posted on {<Moment format="YYYY/MM/DD">{date}</Moment>}
        </p>
        {showActions &&
          <Fragment>
            <button type="button" class="btn btn-light" onClick={() => addLike(_id)}>
              <i class="fas fa-thumbs-up"></i>

              {likes.length > 0 && (
                <span>{likes.length}</span>
              )}

            </button>

            <button type="button" class="btn btn-light" onClick={() => removeLike(_id)}>
              <i class="fas fa-thumbs-down"></i>
            </button>

            <Link to={`/post/${_id}`} class="btn btn-primary">
              Discussion {comments.length > 0 && (
                <span class='comment-count'>{comments.length}</span>
              )}
            </Link>

            {/* user post and logged in user id */}

            {auth.user._id === user &&
              <button
                type="button"
                class="btn btn-danger"
                onClick={() => deletePost(_id)}
              >
                <i class="fas fa-times"></i>
              </button>
            }

          </Fragment>
        }



      </div>
    </div>
  )
}


const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(PostItem)

