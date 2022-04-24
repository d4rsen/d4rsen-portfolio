import React from 'react'
import SkillsItem from '../SkillsItem/SkillsItem'

function Elbrus() {
  return (
    <>
      <div className="jobs__title title">
        <span>
          Intern developer
        </span>
        <span className="title__company">
          {' Elbrus'}
        </span>
      </div>
      <div className="jobs__subtitle">
        Sep 2021 - Jan 2022
      </div>
      <SkillsItem text="Developed JavaScript web applications (SPA)" />
      <SkillsItem text="Worked with the server through Redux-thunk, Redux-Saga" />
      <SkillsItem text="Worked with React-router-dom v6" />
      <SkillsItem
        text="Developed  the server part of the application with Node.js (express)"
      />
      <SkillsItem text="Worked with relational databases (PostgreSQL)" />
      <SkillsItem text="Had experience working with a Socket.io, JWT, Axios, Sass(scss)" />
    </>
  )
}

export default Elbrus
