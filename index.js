"use strict";
require("./src/server");

//TODO: remove this in production this has been set for sending messages as currently it is returning SSL error
//Error: self-signed certificate in certificate chain
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
