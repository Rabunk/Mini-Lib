import { restaurantModel } from "../models/readers.model.js"
import { foodModel } from "../models/user.model.js"

// C1: dùng query thông thường
// lấy thông tin nhà hàng và món ăn của nhà hàng đó.
export const getFoodById = async (req, res) => {
    try {
        // Tìm nhà hàng
        const restaurant = await restaurantModel.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({
                message: 'Không tìm thấy thông tin nhà hàng'
            })
        }

        // name: lọc LIKE
        let filter = {};
      

        if (req.query.name) {
            filter = {
                ...filter,
                name: new RegExp(req.query.name, 'i')
            }
        }
        // rating: lọc các món ăn có rating >= query.rating
        if (req.query.rating) {
            filter = {
                ...filter,
                rating: { $gte: +req.query.rating }
            }
        }

        const foods = await foodModel.find({ ...filter, restaurant: req.params.id });
        res.json({
            message: 'Thông tin món ăn của nhà hàng',
            data: {
                restaurant: {
                    ...restaurant.toObject(), // parse document thành dạng object để lấy các thông tin
                    foods
                }
            }
        })

        // Tìm danh sách món ăn tương ứng (có filters)
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server',
            error: `${error}`
        })
    }

}
// C2: dùng virtuals + populate


export const addRestaurant = async (req, res)=>{
    try {
        const {name, address, rating} = req.body;
        const restaurant = await restaurantModel.create({name, address, rating})

        return res.json({
            message: 'Tạo nhà hàng thành công',
            data: {
                restaurant
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server',
            error: `${error}`
        })
    }
}


