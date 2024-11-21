const { Connection, PublicKey } = require("@solana/web3.js");

const QUICKNODE_RPC =
  "https://mainnet.helius-rpc.com/?api-key=2de169df-d4aa-4f0b-91f6-9859db329839";
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
const TOKEN_ADDRESS = new PublicKey(
  "AvTNcEHssXNHQxn9HcCpSbZYDXS2dc8zjEYnSLwmeTmP"
);

async function getTokenBalanceWeb3(connection, tokenAccount) {
  const info = await connection.getTokenAccountBalance(tokenAccount);
  if (info.value.uiAmount == null) throw new Error("No balance found");
  console.log("Balance (using Solana-Web3.js): ", info.value.uiAmount);
  return info.value.uiAmount;
}

getTokenBalanceWeb3(SOLANA_CONNECTION, TOKEN_ADDRESS).catch((err) =>
  console.log(err)
);
