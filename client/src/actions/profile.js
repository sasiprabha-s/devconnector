import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, CLEAR_PROFILE, ACCOUNT_DELETED, GET_PROFILES, GET_REPOS } from "./constants";
import axios from "axios";
import { setAlert } from "./alert";


// get current user profile
export const getCurrentUserProfile = () => async dispatch => {

    try {

        const res = await axios.get("/api/profile/me");

        console.log("responseprofile", res.data)

        dispatch({ type: GET_PROFILE, payload: res.data })

    } catch (err) {
        console.error(err)
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// get all profiles
export const getProfiles = () => async dispatch => {

    // dispatch({ type: CLEAR_PROFILE })
    try {

        const res = await axios.get("/api/profile");

        dispatch({ type: GET_PROFILES, payload: res.data })

    } catch (err) {
        console.error(err)
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// get profile by id
export const getProfileById = userId => async dispatch => {

    try {
        const res = await axios.get(`/api/profile/user/${userId}`);

        console.log("responseuser", res.data)

        dispatch({ type: GET_PROFILE, payload: res.data })

    } catch (err) {
        console.error(err)
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// get github repos
export const getGithubRepos = username => async dispatch => {

    try {

        const res = await axios.get(`/api/profile/github/${username}`);

        dispatch({ type: GET_REPOS, payload: res.data })

    } catch (err) {

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// Add or Update Profile 
export const createProfile = (formData, history, edit = false) => async dispatch => {

    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const res = await axios.post("/api/profile", formData, config)

        dispatch({ type: GET_PROFILE, payload: res.data })


        dispatch(setAlert(edit ? "Profile Updated Successfully" : "Profile Added Successfully", "success"))


        history.push("/dashboard")

    } catch (err) {
        const errors = err.response.data.errors
        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, "danger"))
            })
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })

    }
}


// Add experience 
export const addExperience = (formData, history) => async dispatch => {

    try {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const res = await axios.put("/api/profile/experience", formData, config)

        dispatch({ type: UPDATE_PROFILE, payload: res.data })


        dispatch(setAlert("Experience Added Successfully", "success"))


        history.push("/dashboard")
    } catch (err) {

        const errors = err.response.data.errors


        if (errors) {

            errors.forEach(error => {
                dispatch(setAlert(error.msg, "danger"))
            })

        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })

    }


}

// Add education

export const addEducation = (formData, history) => async dispatch => {

    try {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const res = await axios.put("/api/profile/education", formData, config)

        dispatch({ type: UPDATE_PROFILE, payload: res.data })


        dispatch(setAlert("Education Added Successfully", "success"))

        history.push("/dashboard")



    } catch (err) {

        const errors = err.response.data.errors


        if (errors) {

            errors.forEach(error => {
                dispatch(setAlert(error.msg, "danger"))
            })

        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })

    }


}



// Delete experience 
export const deleteExperience = id => async dispatch => {

    if (window.confirm("Are you sure want to remove this experience?")) {
        try {
            const res = await axios.delete(`/api/profile/experience/${id}`)

            dispatch({ type: UPDATE_PROFILE, payload: res.data })

            dispatch(setAlert("Experience removed successfully", "success"))
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}


// Delete education 
export const deleteEducation = id => async dispatch => {

    if (window.confirm("Are you sure want to remove this education?")) {
        try {
            const res = await axios.delete(`/api/profile/education/${id}`)

            dispatch({ type: UPDATE_PROFILE, payload: res.data })

            dispatch(setAlert("Education removed successfully", "success"))
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}

// Delete account & profile
export const deleteAccount = () => async dispatch => {
    if (window.confirm("Are you sure? This can not be undone")) {
        try {

            await axios.delete("/api/profile")

            dispatch({ type: CLEAR_PROFILE })
            dispatch({ type: ACCOUNT_DELETED })
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}