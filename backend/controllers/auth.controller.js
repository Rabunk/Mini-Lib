import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userModel } from '../models/users.model.js'
import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES = '1d'

export const handleResgiter = async (req, res) => {
  try {
    const { username, password, role = 'admin' } = req.body

    if (!username || !password) {
      return res.status(400).json({
        message: 'Thiếu thông tin đăng ký'
      })
    }

    const existed = await userModel.findOne({ username })
    if (existed) {
      return res.status(400).json({
        message: 'Tài khoản đã tồn tại'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
      username,
      password: hashedPassword,
      role
    })

    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    })
  }
}

export const handleLogin = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        message: 'Thiếu thông tin đăng nhập'
      })
    }

    const user = await userModel.findOne({ username })
    if (!user) {
      return res.status(400).json({
        message: 'Tài khoản không tồn tại'
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({
        message: 'Sai mật khẩu'
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    })
  }
}
