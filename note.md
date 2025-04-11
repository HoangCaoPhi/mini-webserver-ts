Record<string, T>	map string route vào handle
dynamic dispatch	thay vì if-else dài, dùng routes[routeKey]
Trong NestJS hoặc Express (đều dựa trên Node.js HTTP), req là một readable stream.
Khi người dùng gửi body (ví dụ: JSON), server không nhận tất cả một lần, mà nhận từng "chunk" nhỏ. for await...of giúp bạn đọc từng chunk cho đến hết.

 function composition