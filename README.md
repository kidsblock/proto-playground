# 夜行 · ESP32 智能小车遥控

手机优先的网页遥控原型。固件还不存在，页面里的连接、速度、航向和传感器都是浏览器里的演示数据，用来先感受手感。

## 运行

```bash
npm install
npm run dev
```

打开终端里的本地地址。手机宽度大约 390×844 时，界面会铺满屏幕。

## 点击路径

1. 打开应用，看到「连接」页：小车名字、Wi-Fi 状态和连接按钮。
2. 点「连接」。短暂显示正在连接，然后进入驾驶页。
3. 拖动摇杆（触控或鼠标）。速度和航向会跟着变。松手后摇杆停在原处。
4. 点速度档位（慢速、正常、快速），以及喇叭、前灯开关。
5. 打开「传感器」页，查看超声波距离、电量和 Wi-Fi 信号，以及各自的曲线。
6. 点红色「停止」。状态变为「已停止」，摇杆回中。

界面上的每个数字都标了「演示数据」。

## 尚未实现

- 没有 ESP32 固件
- 没有 WebSocket，也没有任何真实网络请求
- `src/lib/mockCar.ts` 里的 `MockCarClient` 实现了 `CarClient`：`connect`、`drive(x, y)`、`stop`、`subscribe`，以及档位、喇叭、前灯
- 以后的真客户端可以用同一套接口连接 `ws://<car-ip>/ws`

## English

Phone-first remote prototype. `npm install`, then `npm run dev`. All telemetry is simulated behind `CarClient` in `src/lib/mockCar.ts`. No firmware and no network calls.
