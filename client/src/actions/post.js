import axios from "axios";
import { GET_POSTS, POST_ERROR, UPDDATE_LIKES, DELETE_POST, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT } from "./constants";
import { setAlert } from "./alert";




export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get("/api/posts");

        console.log("responsepost", res.data)

        dispatch({
            type: GET_POSTS,
            payload: res.data
        })

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// Get post by id
export const getPost = (postId) => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${postId}`);

        console.log("singlepost", res.data)

        dispatch({
            type: GET_POST,
            payload: res.data
        })

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// Add Comment 
export const addComment = (postId, formData) => async dispatch => {
    try {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const res = await axios.post(`/api/posts/comments/${postId}`, formData, config)

        console.log("comment", res)

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })

        dispatch(setAlert("Comment added successfully", "success"))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}


// Remove comment    
export const removeComment = (postId, commentId) => async dispatch => {

    if (window.confirm("Are you sure want to remove this comment??")) {
        try {
            await axios.delete(`/api/posts/comments/${postId}/${commentId}`)

            dispatch({ type: REMOVE_COMMENT, payload: commentId })

            dispatch(setAlert("Comment removeLike successfully", "success"))
        } catch (err) {
            dispatch({
                type: POST_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }

    }
}

// Add like 
export const addLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/likes/${postId}`)
        console.log("asdfhgksadhfgd", res)

        dispatch({
            type: UPDDATE_LIKES,
            payload: { postId, likes: res.data }
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// Remove like 
export const removeLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`)

        dispatch({
            type: UPDDATE_LIKES,
            payload: { postId, likes: res.data }
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// Delete Post  
export const deletePost = (postId) => async dispatch => {

    if (window.confirm("Are you sure want to delete this post??")) {
        try {

            await axios.delete(`api/posts/${postId}`)

            dispatch({
                type: DELETE_POST,
                payload: postId
            })

            dispatch(setAlert("Post removed successfully", "success"))

        } catch (err) {
            dispatch({
                type: POST_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}

// Add Post           
export const addPost = (formData) => async dispatch => {

    try {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const res = await axios.post("/api/posts", formData, config)

        dispatch({
            type: ADD_POST,
            payload: res.data
        })

        dispatch(setAlert("Post added successfully", "success"))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}


