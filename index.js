/* eslint-disable no-undef */
const SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };

export default class WxSocket {
  constructor(endPoint) {
    this.endPoint = endPoint;

    this.onopen = function() {}; // noop
    this.onerror = function() {}; // noop
    this.onmessage = function() {}; // noop
    this.onclose = function() {}; // noop

    this.readyState = SOCKET_STATES.connecting;

    this.connect();
  }

  closeAndRetry() {
    this.close();
    this.readyState = SOCKET_STATES.connecting;
  }

  connect() {
    if (
      !(
        this.readyState === SOCKET_STATES.open ||
        this.readyState === SOCKET_STATES.connecting
      )
    ) {
      return;
    }

    wx.connectSocket({
      url: this.endPoint
    });

    const _this = this;

    wx.onSocketOpen(function(res) {
      _this.readyState = SOCKET_STATES.open;
      _this.onopen();
    });
    wx.onSocketError(function(res) {
      _this.closeAndRetry();
      _this.onerror();
    });
    wx.onSocketMessage(function(res) {
      _this.onmessage({ data: res.data });
    });
    wx.onSocketClose(function(res) {
      _this.close();
    });
  }

  send(body) {
    const _this = this;

    wx.sendSocketMessage({
      data: body,
      success: function() {},
      fail: function(res) {
        _this.onerror();
        _this.closeAndRetry();
      },
      complete: function() {}
    });
  }

  close(code, reason) {
    wx.closeSocket();
    this.readyState = SOCKET_STATES.closed;
    this.onclose();
  }
}
