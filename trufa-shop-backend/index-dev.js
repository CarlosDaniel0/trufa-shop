const app = require('./app')

app.listen(8000, (err) => {
  if (err) {
    console.log(`Server not running!\nVerify error: ${error}`)
  }
  console.log(
    'The Backend Server from Trufa Shop is running....\nAddress: http://localhost:8000\nStatus: Online!'
  )
})
