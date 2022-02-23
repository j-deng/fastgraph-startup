import dotenv from 'dotenv'
dotenv.config()
import readline from 'readline'
import { PrismaClient } from '@prisma/client'
import { hashPassword, authenticationSchema } from '../src/helpers/auth'

let success: boolean = false

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Please enter username ? ', (username) => {
  rl.question('Please enter password ? ', async (password) => {
    const { error } = authenticationSchema.validate({
      username,
      password
    })
    if (!error) {
      try {
        await prisma.user.create({
          data: {
            username,
            password: await hashPassword(password),
            isSuperuser: true,
            isStaff: true
          }
        })
        success = true
        console.log('User created.')
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log(error.message)
    }
    rl.close()
  })
})

rl.on('close', function () {
  process.exit(success ? 0 : -1)
})
