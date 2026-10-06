import crypto from "node:crypto";

const API_KEY = process.env.BINANCE_RWA_API_KEY;
if (!API_KEY) throw new Error("Missing BINANCE_RWA_API_KEY; load .env locally");
const SECRET_KEY = process.env.BINANCE_RWA_SECRET_KEY;
if (!SECRET_KEY) throw new Error("Missing BINANCE_RWA_SECRET_KEY; load .env locally");

const method = "GET";
const path = "/api/v1/dex/aggregator/quote";

const params = new URLSearchParams({
  binanceChainId: "56",
  fromTokenAddress:
"0x02fca66c1d1afb4e2a7884261eb00f63598a7436",
  toTokenAddress: "0x55d398326f99059ff775485246999027b3197955",
 amount: "21855000000000000",
  userWalletAddress: "0xa11c20b7f5525468b0facaf6fe246c31f5eb912c",
});

const query = `?${params.toString()}`;
const signedPath = "/build" + path + query;const timestamp = new Date().toISOString();
const body = "";

// Binance signature payload
const payload = timestamp + method + signedPath + body;

const signature = crypto
  .createHmac("sha256", SECRET_KEY)
  .update(payload)
  .digest("base64");


console.log("Timestamp:", timestamp);
console.log("Method:", method);
console.log("Signed path:", JSON.stringify(signedPath));
console.log("Payload:", JSON.stringify(payload));
console.log("Signature length:", signature.length);
console.log("API key length:", API_KEY.length);
console.log("Secret length:", SECRET_KEY.length);
console.log(
  "Credential whitespace:",
  API_KEY !== API_KEY.trim() || SECRET_KEY !== SECRET_KEY.trim()
);


const response = await fetch(
  `https://web3.binance.com/build${path}${query}`,
  {
    method,
    headers: {
      "X-OC-APIKEY": API_KEY,
      "X-OC-TIMESTAMP": timestamp,
      "X-OC-SIGN": signature,
      "X-OC-RECV-WINDOW": "60000",
    },
  }
);

console.log("HTTP:", response.status);
console.log(JSON.stringify(await response.json(), null, 2));