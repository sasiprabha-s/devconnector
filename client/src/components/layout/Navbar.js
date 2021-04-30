import React from 'react'
import { Link } from "react-router-dom";
import {logout} from "../../actions/auth";
import {connect} from "react-redux";

const Navbar = ({auth:{isAuthenticated,loading},logout}) => {
  return (
    <nav className="navbar bg-dark">
    <h1>
      <Link to="/"><i class="fas fa-code"></i> DevConnector</Link>
    </h1>
 

  {!isAuthenticated && !loading &&
     <ul>
      <li><Link to="/profiles">Developers</Link></li>
      <li><Link to="/signup">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
      </ul>
  }


   {isAuthenticated && !loading &&
   <ul>
      <li><Link to="/posts">Posts</Link></li>
        <li><Link to="/profiles">Developers</Link></li>
       <li><Link to="/dashboard">
       <i className="fas fa-user"></i> {" "}
         <span className="hide-sm">Dashboard </span> 
        </Link>
      </li>
     <li><a onClick={logout} href="#!">
       <i className="fas fa-sign-out-alt"></i>
       Logout</a></li>
   </ul>
   }


 
  </nav>
  )
}

const mapStateToProps = state => ({
  auth:state.auth,
})

export default connect(mapStateToProps,{logout})(Navbar)

