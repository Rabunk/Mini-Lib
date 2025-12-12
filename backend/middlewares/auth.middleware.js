import jwt from 'jsonwebtoken';
import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET;
// Authentication - Kiểm tra token và trả về thông tin user vào req.
export const authentication = (req, res, next)=>{
    // lấy token từ headers
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
    // kiểm tra có gửi token hay không.
    if (!token) {
        return res.status(401).json({message:'Token is not provided.'});
    }

    // kiểm tra token gửi lên bằng jwt.verify()
    jwt.verify(token, JWT_SECRET, (err, decoded)=>{
        if (err) {
            return res.status(401).json({message:'Token is invalid.', error: `${err}`});
        }
        req.user = decoded; // giải mã token thành công, lưu thông tin user vào req.
        next();
    });

}

// Authorization - Kiểm tra role của user trong req.
export const isAdmin = (req, res, next)=>{
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'You do not have permission to request.'
        })
    }
    next();
}