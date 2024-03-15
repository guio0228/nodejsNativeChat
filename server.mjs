// 导入 Node.js 的 net 模块，用于创建 TCP 服务器。
import net from "net";

// 创建一个 TCP 服务器实例。
const server = net.createServer();

// 用于存储所有连接的客户端的数组。
const clients = [];

// 当有新的客户端连接到服务器时，'connection' 事件会被触发。
server.on("connection", (socket) => {
    console.log("new to server");

    // 为每个新连接的客户端分配一个唯一的 ID。
    const clientId = clients.length;

    // 向所有已连接的客户端广播新用户加入的消息。
    clients.forEach((client) => {
        client.socket.write(`User ${clientId} has joined!`);
    });

    // 向新连接的客户端发送其 ID。
    socket.write(`id-${clientId}`);

    // 当从客户端接收到数据时，触发 'data' 事件。
    socket.on("data", (data) => {
        // 解析消息的发送者 ID 和消息内容。
        const id = data.toString("utf-8").substring(0, 1);
        const message = data.toString("utf-8").substring(4);
        console.log(`User ${id} is speaking`);

        // 向所有客户端广播收到的消息。
        clients.forEach((client) => {
            client.socket.write(`> User ${id}: ${message}`);
        });
    });

    // 当客户端断开连接时，触发 'end' 事件。
    socket.on("end", () => {
        console.log(`User ${clientId} has left!`);

        // 从客户端列表中移除断开连接的客户端。
        const index = clients.findIndex((client) => client.socket === socket);
        if (index !== -1) {
            clients.splice(index, 1);
        }

        // 向所有客户端广播用户离开的消息。
        clients.forEach((client) => {
            client.socket.write(`User ${clientId} has left!`);
        });
    });

    // 如果发生错误，触发 'error' 事件。
    socket.on("error", (err) => {
        console.error(`Socket error: ${err.message}`);
    });

    // 将新连接的客户端添加到客户端列表。
    clients.push({ id: clientId.toString(), socket: socket });

    // 打印欢迎信息和当前连接的客户端数量。
    console.log("Welcome! Connected clients:");
    clients.forEach((client, index) => {
        console.log(`Client ${index}`);
    });
});

// 服务器开始监听特定的端口和地址。
server.listen(3008, "127.0.0.1", () => {
    console.log("Server opened on", server.address().address);
});
