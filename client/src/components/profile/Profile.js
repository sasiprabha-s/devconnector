import React, { useEffect, Fragment } from 'react'
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getProfileById } from "../../actions/profile";
import Spinner from '../layout/Spinner';

const Profile = ({ getProfileById, profile: { profile, loading }, auth, match }) => {

    console.log("match", match)

    useEffect(() => {
        getProfileById(match.params.id)
    }, [getProfileById, match.params.id])


    return (
        <Fragment>
            {profile === null || loading ? <Spinner /> : <Fragment>
                <Link to="/profiles" className="btn btn-light">Back To Profiles</Link>

                {auth.user._id === profile.user._id && <Link to="/edit-profile" className="btn btn-dark">Edit Profile</Link>}

                <div class="profile-grid my-1">
                    <ProfileTop profile={profile} />
                    <ProfileAbout profile={profile} />

                    {/* Experience */}
                    <div class="profile-exp bg-white p-2">
                        <h2 class="text-primary">Experience</h2>

                        {profile.experience.length > 0 ? profile.experience.map(experience => (
                            <ProfileExperience key={experience._id} experience={experience} />
                        )) : <h4>No experience credentials</h4>}

                    </div>

                    {/* Education */}
                    <div class="profile-edu bg-white p-2">
                        <h2 class="text-primary">Education</h2>

                        {profile.education.length > 0 ? profile.education.map(education => (
                            <ProfileEducation key={education._id} education={education} />
                        )) : <h4>No education credentials</h4>}

                    </div>



                    {/* GithubRepos */}

                    {profile.githubusername && <ProfileGithub username={profile.githubusername} />}


                </div>

            </Fragment>

            }
        </Fragment>
    )
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStateToProps, { getProfileById })(Profile)
