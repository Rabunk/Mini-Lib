import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { userModel } from '../models/users.model.js';
import 'dotenv/config'; // để đọc file env

const JWT_SECRET = process.env.JWT_SECRET;

export const handleRegister = async (req, res) => {
    try {
        const { name, password, role } = req.body;
        if (!password || !name) {
            return res.status(400).json({
                message: 'Thiếu thông tin đăng ký'
            })
        }
        // tạo hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name,
            phone,
            password: hashedPassword,
            role
        })

        const formatUser = user.toObject(); // cách này không tốt.
        delete formatUser.password;

        res.json({
            message: 'Đăng ký thành công',
            data: formatUser
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi xử lý',
            data: null,
            error: `${error}`
        })
    }
}


export const handleLogin = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!password) {
            return res.status(400).json({
                message: 'Thông tin đăng nhập không chính xác'
            })
        }
        // tìm tài khoản tương ứng với phone
        const matchUser = await userModel.findOne({ phone: phone });
        if (!matchUser) {
            return res.status(400).json({
                message: 'Số điện thoại này chưa đăng ký.'
            })
        }

        // tạo hashed password
        const isMatchPassword = await bcrypt.compare(password, matchUser.password);
        if (!isMatchPassword) {
            return res.status(400).json({
                message: 'Tài khoản hoặc mật khẩu sai.'
            })
        }
        // cấp token

        const formatUser = matchUser.toObject();
        delete formatUser.password;

        // C1: dùng call back
        jwt.sign(formatUser, JWT_SECRET, (error, data) => {
            if (error) {
                return res.status(500).json({
                    message: 'Internal Error'
                })
            }
            res.json({
                message: 'Đăng nhập thành công',
                data: formatUser,
                token: data
            });
        })

        // C2: dùng string
        // const token =  jwt.sign(formatUser, JWT_SECRET,{expiresIn: '1h'});
        //  res.json({
        //         message: 'Đăng nhập thành công',
        //         data: formatUser,
        //         token: token
        //     });

    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi xử lý',
            data: null,
            error: `${error}`
        })
    }
}