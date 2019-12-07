WxSocket - 在微信小程序中使用 phoenix.js
====

## Install

```
$ npm install --save wx-socket
```


## Usage

```js
import { Socket } from "phoenix"
import WxSocket from "wx-socket"

let socket = new Socket("wss://test.com/socket", { transport: WxSocket, params: {token: yourToken}})

socket.connect()
```
