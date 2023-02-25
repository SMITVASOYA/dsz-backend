const allowEmployee = (req, res, next) => {
  console.log(req.session.isAuthenticate, 2)
  // if (req.session.isAuthenticated) {
  //   next()
  // } else {
  //   return res.status(401).send({
  //     success: false,
  //     errorType: 'UnAuthorized',
  //     errorMessage: 'UnAuthorized User! Access Denied',
  //   })
  // }
  next()
}

const allowHR = (req, res, next) => {
  console.log(req.session, 16)

  // if (req.session.isHR) {
  //   next()
  // } else {
  //   return res.status(401).send({
  //     success: false,
  //     errorType: 'UnAuthorized',
  //     errorMessage: 'UnAuthorized User! Access Denied',
  //   })
  // }
  next()
}

const allowAdmin = (req, res, next) => {
  console.log(req, req.isAuthenticate, req.user, 31)

  // if (req.session.isAdmin) {
  //   next()
  // } else {
  //   return res.status(401).send({
  //     success: false,
  //     errorType: 'UnAuthorized',
  //     errorMessage: 'UnAuthorized User! Access Denied',
  //   })
  // }
  next()
}

const allowBothAdminAndHR = (req, res, next) => {
  console.log(req.session, 46)

  // if (req.session.isAdmin || req.session.isHR) {
  //   next()
  // } else {
  //   return res.status(401).send({
  //     success: false,
  //     errorType: 'UnAuthorized',
  //     errorMessage: 'UnAuthorized User! Access Denied',
  //   })
  // }
  next()
}

module.exports = { allowEmployee, allowAdmin, allowHR, allowBothAdminAndHR }
