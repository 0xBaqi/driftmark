const RPC_URL = "https://bsc-dataseed.bnbchain.org";

const tokens = [
  {
    name: "Ondo NVDAon",
    address: "0xa9ee28c80f960b889dfbd1902055218cba016f75",
  },
  {
    name: "bStocks NVDAB",
    address: "0x02fca66c1d1afb4e2a7884261eb00f63598a7436",
  },
];

const DECIMALS_SELECTOR = "0x313ce567";

async function getDecimals(token) {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [
        {
          to: token.address,
          data: DECIMALS_SELECTOR,
        },
        "latest",
      ],
    }),
  });

  const json = await response.json();

  if (json.error) {
    throw new Error(JSON.stringify(json.error));
  }

  return Number(BigInt(json.result));
}

for (const token of tokens) {
  try {
    const decimals = await getDecimals(token);

    console.log(token.name);
    console.log("Address:", token.address);
    console.log("Decimals:", decimals);
    console.log();
  } catch (error) {
    console.error(`${token.name} failed:`, error.message);
  }
}