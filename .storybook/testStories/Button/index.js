import React from 'react'
import PropTypes from 'prop-types'
import './index.css'

const Button = ({ children }) => {
  return <button className="btn">{children}</button>
}

Button.propTypes = {}

export default Button
