"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauth = void 0;
var code_1 = require("./code");
var token_1 = require("./token");
function oauth(_a, _b) {
    var app = _a.app, url = _a.url, bind_uri = _a.bind_uri, auth_endpoint = _a.auth_endpoint, token_endpoint = _a.token_endpoint, fetch = _a.fetch, client_id = _a.client_id, client_secret = _a.client_secret, afterTokenRequestFunction = _a.afterTokenRequestFunction;
    var _c = _b === void 0 ? {} : _b, _d = _c.response_type, response_type = _d === void 0 ? "code" : _d, _e = _c.grant_type, grant_type = _e === void 0 ? "authorization_code" : _e, codeRequestParams = _c.codeRequestParams, beforeCodeRequestFunction = _c.beforeCodeRequestFunction, beforeTokenRequestFunction = _c.beforeTokenRequestFunction, _f = _c.tokenRequestFetchMethod, tokenRequestFetchMethod = _f === void 0 ? "POST" : _f;
    var redirectUri = encodeURIComponent("" + url + bind_uri + "/code");
    app.get("" + bind_uri, code_1.getCodeMiddleware(redirectUri, auth_endpoint, client_id, response_type, codeRequestParams, beforeCodeRequestFunction));
    app.get(bind_uri + "/code", token_1.getTokenMiddleware(redirectUri, token_endpoint, fetch, client_id, client_secret, grant_type, tokenRequestFetchMethod, beforeTokenRequestFunction, afterTokenRequestFunction));
}
exports.oauth = oauth;
