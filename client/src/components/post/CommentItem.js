import React from 'react'
import { connect } from "react-redux";
import { removeComment } from "../../actions/post";
import Moment from "react-moment";

const CommentItem = ({ comment: { _id, text, name, avatar, user, date }, auth, removeComment, postId }) => {
  return (
    <div class="post bg-white p-1 my-1">
      <div>
        <a href="profile.html">
          <img
            class="round-img"
            src={avatar}
            alt="avatar"
          />
          <h4>{name}</h4>
        </a>
      </div>
      <div>
        <p class="my-1">
          {text}
        </p>
        <p class="post-date">
          Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
        </p>
        {
          auth.user._id === user && <button className="btn btn-danger" onClick={() => removeComment(postId, _id)}>
            <i class="fas fa-times"></i>
          </button>
        }
      </div>
    </div>
  )
}



const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { removeComment })(CommentItem)
