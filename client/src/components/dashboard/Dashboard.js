import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getCurrentUserProfile, deleteAccount } from "../../actions/profile";
import DashboardActions from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";
import Spinner from "../layout/Spinner";

const Dashboard = ({
  getCurrentUserProfile,
  auth: { user },
  profile: { profile, loading },
  deleteAccount,
}) => {

  useEffect(() => {
    getCurrentUserProfile();
  }, []);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p>


      <Fragment>
        <DashboardActions />
        <Experience experience={profile !== null ? profile.experience : []} />
        <Education education={profile !== null ? profile.education : []} />

        <div className="my-2">
          <button className="btn btn-danger" onClick={() => deleteAccount()}>
            Delete My Account
            </button>
        </div>
      </Fragment>


      {profile === null && (
        <Fragment>
          <p>You have not yet setup a profile,please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};




const mapStateToProps = ({ auth, profile }) => ({
  auth,
  profile,
});

export default connect(mapStateToProps, {
  getCurrentUserProfile,
  deleteAccount,
})(Dashboard);
