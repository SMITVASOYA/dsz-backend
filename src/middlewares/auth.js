const allowEmployee = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next()
  } else {
    return res.status(401).send({
      success: false,
      errorType: 'UnAuthorized',
      errorMessage: 'UnAuthorized User! Access Denied',
    })
  }
  // next()
}

const allowHR = (req, res, next) => {
  if (req.session.isHR) {
    next()
  } else {
    return res.status(401).send({
      success: false,
      errorType: 'UnAuthorized',
      errorMessage: 'UnAuthorized User! Access Denied',
    })
  }
  // next()
}

const allowAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    next()
  } else {
    return res.status(401).send({
      success: false,
      errorType: 'UnAuthorized',
      errorMessage: 'UnAuthorized User! Access Denied',
    })
  }
  // next()
}

const allowBothAdminAndHR = (req, res, next) => {
  if (req.session.isAdmin || req.session.isHR) {
    next()
  } else {
    return res.status(401).send({
      success: false,
      errorType: 'UnAuthorized',
      errorMessage: 'UnAuthorized User! Access Denied',
    })
  }
  // next()
}

module.exports = { allowEmployee, allowAdmin, allowHR, allowBothAdminAndHR }
