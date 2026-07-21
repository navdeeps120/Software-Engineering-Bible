import net from "node:net";
import dgram from "node:dgram";

export async function tcpEchoOnce(message: string, host = "127.0.0.1"): Promise<string> {
  const server = net.createServer((socket) => {
    socket.on("data", (data) => {
      socket.write(data);
      socket.end();
    });
  });
  await new Promise<void>((resolve) => server.listen(0, host, () => resolve()));
  const port = (server.address() as net.AddressInfo).port;
  try {
    const reply = await new Promise<string>((resolve, reject) => {
      const client = net.createConnection({ host, port }, () => {
        client.write(message);
      });
      let buf = "";
      client.on("data", (d) => {
        buf += d.toString("utf8");
      });
      client.on("end", () => resolve(buf));
      client.on("error", reject);
    });
    return reply;
  } finally {
    await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
}

export async function udpEchoOnce(message: string, host = "127.0.0.1"): Promise<string> {
  const server = dgram.createSocket("udp4");
  await new Promise<void>((resolve) =>
    server.bind(0, host, () => {
      server.on("message", (msg, rinfo) => {
        server.send(msg, rinfo.port, rinfo.address);
      });
      resolve();
    }),
  );
  const port = server.address().port;
  const client = dgram.createSocket("udp4");
  try {
    const reply = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("udp timeout")), 2000);
      client.on("message", (msg) => {
        clearTimeout(timer);
        resolve(msg.toString("utf8"));
      });
      client.send(message, port, host, (err) => {
        if (err) {
          clearTimeout(timer);
          reject(err);
        }
      });
    });
    return reply;
  } finally {
    client.close();
    server.close();
  }
}
