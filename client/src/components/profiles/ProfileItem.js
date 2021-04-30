import React from 'react'
import { Link } from "react-router-dom";


const ProfileItem = ({
    profile: {
        user: { _id, name, avatar },
        company,
        status,
        location,
        skills
    }
}) => {
    return (
        <div className="profile bg-light">
            <img src={avatar} alt="img" className="round-img" />
            <div>
                <h2>{name}</h2>
                <p>{status} {company && <span> at {company} </span>} </p>
                <p className="my-1">{location && location}</p>
                <Link to={`/profile/${_id}`} className="btn btn-primary"> View Profile </Link>
            </div>

            <ul>
                {skills.slice(0, 5).map((skill, index) => (
                    <li key={index} className="text-primary">
                        <i className="fas fa-check"></i>
                        {skill}
                    </li>
                ))}
            </ul>

        </div>
    )
}



export default ProfileItem
