import app from "./app"

const PORT = process.env.PORT || 8000

export const StartServer = async() => {
  app.listen(PORT, () => {
    console.log('Server is running on port', PORT )
  })

  process.on('unhandleRejection', (err) => {
    console.log(`Unhandled Rejection ${err}`)
    process.exit(1)
  })
} 

StartServer().then(() => console.log('Server started'))