import { connectDB } from "./config/database.config.js";
import { restaurantModel } from "./models/restaurants.model.js";
import { userModel } from "./models/users.model.js";
import { foodModel } from "./models/foods.model.js";
import bcrypt from 'bcryptjs'


console.log('Bắt đầu seed data');

await connectDB();

await userModel.deleteMany({});
await foodModel.deleteMany({});
await restaurantModel.deleteMany({});

const userName = [
    'Nguyễn Minh Tú',
    'Phạm Văn Tùng',
    'Cao Minh Trang',
    'Nguyễn Văn Tài',
    'Đinh Đức Lộc'
]
for (let i = 0; i < 5; i++) {
    const hashedPassword = await bcrypt.hash( `09878978${i}abc`, 10);
    await userModel.create({
        name: userName[i],
        phone: `09878978${i}`,
        password: hashedPassword
    });
}

const dishes = [
    "Phở",
    "Bánh mì",
    "Gỏi cuốn",
    "Bún chả",
    "Cơm tấm",
    "Mì Quảng",
    "Bánh xèo",
    "Chả giò",
    "Bánh bao",
    "Bún riêu",
    "Lẩu",
    "Hủ tiếu"
];
const restaurants = [
    "Quán ăn Bến Thành",
    "Nhà hàng Phú Quốc",
    "Quán Lúa Vàng"
];
for (let i = 0; i < 3; i++) {
    const restaurant = await restaurantModel.create({
        name: restaurants[i],
        address: `Số nhà ${i * 2 + 1}, ngõ Ẩm Thực, Việt Nam`,
        rating: Math.round(Math.random() * i) + 3
    });
    
    for (let j = 0; j < 4; j++) {
        const foodIndex = (i + 1) * (j + 1)  - 1
        await foodModel.create({
            name: dishes[foodIndex],
            rating: Math.round(Math.random() * j) + 2,
            price: 100000,
            restaurant: restaurant._id
        })
    }
}


console.log('Seed data thành công ✔');
process.exit();