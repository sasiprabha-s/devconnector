import React, { useState } from 'react';
import { Link, withRouter } from "react-router-dom";
import { addExperience } from "../../actions/profile";
import { connect } from "react-redux";

const AddExperience = ({ addExperience, history }) => {



  const [formData, setFormData] = useState({
    title: "",
    company: "",
    from: "",
    to: "",
    location: "",
    description: "",
    current: false,
  })

  const [disableTo, toggledisableTo] = useState(false)

  const {
    title,
    company,
    from,
    to,
    location,
    description,
    current,
  } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    addExperience(formData, history)
  }

  return (
    <div>
      <h1 class="large text-primary">
        Add An Experience
      </h1>
      <p class="lead">
        <i class="fas fa-code-branch"></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form class="form" onSubmit={e => onSubmit(e)}>
        <div class="form-group">
          <input type="text" placeholder="* Job Title" name="title" value={title} onChange={e => handleChange(e)} required />
        </div>
        <div class="form-group">
          <input type="text" placeholder="* Company" name="company" value={company} onChange={e => handleChange(e)} required />
        </div>
        <div class="form-group">
          <input type="text" placeholder="Location" name="location" value={location} onChange={e => handleChange(e)} />
        </div>
        <div class="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={e => handleChange(e)} />
        </div>
        <div class="form-group">
          <p><input type="checkbox" name="current" checked={current} value={current} onChange={e => {
            setFormData({ ...formData, current: !current })
            toggledisableTo(!disableTo)
          }} />  {" "} Current Job</p>
        </div>
        <div class="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value={to} onChange={e => handleChange(e)} disabled={disableTo ? 'disabled' : ""} />
        </div>
        <div class="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Job Description"
            value={description}
            onChange={e => handleChange(e)}
          ></textarea>
        </div>
        <input type="submit" class="btn btn-primary my-1" />
        <Link to="/dashboard" class="btn btn-light my-1" href="dashboard.html">Go Back</Link>
      </form>
    </div>
  )
}

export default connect(null, { addExperience })(withRouter(AddExperience))
