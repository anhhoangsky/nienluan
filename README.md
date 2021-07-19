# nienluan
Deploy tại: https://shrouded-atoll-17427.herokuapp.com/dishs

Lấy dữ liệu từ web sau đó lưu vào csdl firestore ở 3 file:
+ lấy topic: getdata.js
+ lấy món ăn: getdish.js (147 món)
+ lấy chi tiết: getDetailDish.js


API:
+ danh sách món ăn: /dishs. Mặc định trang 1 mỗi trang 10 món.(/dishs1)
+ chi tiết món ăn: /dishs/id.(vd: /dishs/4298417)
![alt text](https://github.com/anhhoangsky/nienluan/blob/main/demo.png)
