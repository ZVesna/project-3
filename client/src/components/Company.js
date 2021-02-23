import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, withRouter } from 'react-router-dom'
import { isCreator } from '../lib/auth'
import parse from 'html-react-parser'
// import { isCreator } from '../lib/auth'

export default function singleCompany({ match, history }) {
  const id = match.params.companyId
  const [company, updateCompany] = useState({})
  const [text, setText] = useState('')

  const token = localStorage.getItem('token')



  useEffect(() => {
    async function fetchCompany() {
      try {
        const { data } = await axios.get(`/api/company/${id}`)
        updateCompany(data)
      } catch (err) {
        console.log(err)
      }

    }
    fetchCompany()
  }, [])

  if (!company.jobs) return null
  if (!company.comments) return null

  function handleComment() {
    axios.post(`/api/company/${id}/comment`, { text }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        setText('')
        updateCompany(resp.data)
      })
  }

  function handleDeleteComment(commentId) {
    axios.delete(`/api/company/${id}/comment/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        updateCompany(resp.data)
      })
  }

  return <div className="companyContainer">

    <h1 className="title is-2 has-text-danger">{company.company}</h1>
    <div className="columns">
      <div className="column is-one-third is-multiline">
        <div className="card">
          <div className="card-content">
            <div className="card-image">
              <img src={company.logo} />
            </div>
            <strong>About: </strong>{company.about}
            {<br></br>}
            <strong>Rating: </strong>{company.rating}
            <div>{isCreator(company.user._id) && <Link
              to={`/company/${id}/job`}
              className="button is-danger grow mt-4"
            >Post a job</Link>}</div>
          </div>
        </div>
        <div className="comments-section">
          <h1 className="title mt-4 is-5 has-text-danger has-text-centered">Comments on this company:</h1>
          {company.comments.map(comment => {
            return <div className="card mt-4" key={comment._id}>
              <h1><strong>User: </strong>{comment.user.name}</h1>
              <p><strong>Comment: </strong>{comment.text}</p>
              <p><strong>Date: </strong>{comment.createdAt.length >= 10
                ? comment.createdAt.slice(0, 10)
                : comment.createdAt}</p>
              {isCreator(comment.user._id) || localStorage.getItem('mod') === 'true' && <div className="media-right">
                <button
                  className="delete"
                  onClick={() => handleDeleteComment(comment._id)}>
                </button>
              </div>}
            </div>

          })}
          <h1 className="title mt-6 is-6">Leave a comment below:</h1>
          <div className="control">
            <input className="input" type="text" placeholder="Type your comment here" onChange={event => setText(event.target.value)} value={text} />
            <button onClick={handleComment} className="button is-danger grow mt-4">Submit</button>
          </div>

        </div>


      </div>


      <div className="column is-two-thirds">
        <h1 className="title has-text-danger has-text-centered">Jobs posted</h1>
        {company.jobs.map(job => {

          //! To parse posted HTML to show nicely in browser
          const html = parse(job.description)
          console.log(html)

          return <div className="card mb-2" key={job._id}>
            <div className="card-content">
              <h1 className="subtitle"><strong>{job.title}</strong></h1>
<<<<<<< HEAD
            <h1><strong>Description:</strong> {job.description.length >= 150
              ? job.description.slice(0, 150) + '...'
              : job.description}</h1>
            <h1><strong>Salary:</strong> {job.salary}</h1>
            <h1><strong>Location:</strong> {job.location}</h1>

=======
              <h1><strong>Description:</strong> {html.length >= 150
              ? html.slice(0, 150) + '...'
              : html}</h1>
            <h1><strong>Salary:</strong> {job.salary}</h1>
            <h1><strong>Location:</strong></h1>{job.location.map((local, index) => {
              return <div key={index}>{local}</div>
            })}
>>>>>>> development
            <Link to={{ pathname: `/job/${job._id}`, state: { companyID: id } }}>
              <button className="button is-success grow mt-4">More Info</button>
            </Link>

<<<<<<< HEAD
=======


>>>>>>> development
    </div>
  </div>

})}


      </div >
    </div >
  </div >
}