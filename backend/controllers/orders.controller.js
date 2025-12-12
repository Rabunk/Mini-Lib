import { foodModel } from '../models/foods.model.js';
import { orderItemModel } from '../models/orderItems.model.js';
import { orderModel } from '../models/orders.model.js'

export const getCustomerOrders = async (req, res) => {
    try {
        const user = req.user;
        const orders = await orderModel.find({customer: user._id});

        return res.json({
            message: 'Danh sách đơn hàng',
            data:{
                orders
            }
        });
       
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server',
            error: `${error}`
        })
    }
}

export const getDetailOrders = async (req, res) => {
    try {
        const user = req.user;
        const orderId = req.params.id;
        const order = await orderModel.findById(orderId);
        
        if (!order) {
            return res.status(404).json({message: 'Không tìm thấy thông tin đơn hàng'})
        }
        if (user.role !== 'admin' && order.customer.toString() !== user._id) {
            return res.status(404).json({message: 'Bạn không có quyền xem thông tin đơn hàng này'})
        }

        return res.json({
            message: 'Chi tiết đơn hàng',
            data:{
                order
            }
        });
       
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server',
            error: `${error}`
        })
    }
}

export const createOrder = async (req, res) => {
    try {
        const user = req.user;
        // tạo order_items tương ứng.

        // tìm foods trước.
        const order_items = req.body.order_items || []
        const foodIds = order_items.map(item => item.food_id);
        const listFoods = await foodModel.find({_id: {$in: foodIds}});

        // kiểm tra xem toàn bộ food ids gửi lên có hợp lệ
        if (listFoods.length !== foodIds.length) {
            return res.status(400).json({message: 'Id món ăn gửi lên không hợp lệ'})
        }
        // tạo order
        // begin transactions
        const order = await orderModel.create({
            customer:user._id,
            deliveryAddress: req.body.deliveryAddress || ''
        })

        // tạo order items tương ứng.
        
        // console.log(listFoods);
        const orderItemsPrepared = order_items.map((item)=>{
            const matchFood = listFoods.find(food => food._id.toString() === item.food_id); // tìm món ăn có id tương ứng với item hiện tại
            const itemPrice = item.quantity * matchFood.price;
            return {
                quantity: item.quantity,
                order: order._id,
                food: item.food_id,
                priceAtOrderTime: itemPrice // snapshot compute 
            }
        })
        await orderItemModel.create(orderItemsPrepared);
        
        // commit transactions
        return res.json({message: 'ok',
            orderItemsPrepared
        })
      
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server',
            error: `${error}`
        })
    }
}

// user tạo order ✔
// user xem order của họ ✔
// admin xem order của user ✔
// user xem order của user khác ✔