import path from 'path'
import { DockerComposeEnvironment, StartedDockerComposeEnvironment } from "testcontainers"

let instance: StartedDockerComposeEnvironment | null = null

export const startDocker = async () => {
  const composeFilePath = path.resolve(__dirname)
  const composeFile = 'docker-compose.yml'

  instance = await new DockerComposeEnvironment(composeFilePath, composeFile).up()
  console.log('Docker is running')
}

export const stopDocker = async () => {
  if(!instance) return
  try {
    await instance.down()
    instance = null
    console.log('Docker is stopped')
  } catch (error) {
    console.log('Error stopping docker', error)
  }
}

 export const getDockerInstance = () : StartedDockerComposeEnvironment => {
  if(!instance) throw new Error('Docker compose is not running')
  return instance
 }
 