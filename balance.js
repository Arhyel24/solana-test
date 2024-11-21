const {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} = require("@solana/web3.js");

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
const publicKey = new PublicKey("5F7UbQsPcJ7oMSygH9eoPhCgBxAmnZVkKuYaWt3i1K4s"); // Replace with your wallet address

async function getBalance() {
  const balance = await connection.getBalance(publicKey);
  console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}

getBalance();
