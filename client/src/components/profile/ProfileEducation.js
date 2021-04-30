import React from 'react'
import Moment from "react-moment";

const ProfileEducation = ({ education: { school, from, to, description, degree, fieldofstudy } }) => {
  return (
    <div>
      <h3 class="text-dark">{school}</h3>
      <p>
        {<Moment format="YYYY/MM/DD">{from}</Moment>} - {to ? <Moment format="YYYY/MM/DD">{to}</Moment> : "Now"}
      </p>
      <p><strong>Degree: </strong>{degree && degree}</p>
      <p><strong>Field Of Study: </strong>{fieldofstudy && fieldofstudy}</p>
      <p>
        <strong>Description: </strong>{description && description}
      </p>
    </div>
  )
}



export default ProfileEducation;

