const web3 = require("@solana/web3.js");
(async () => {
  const publicKey = new web3.PublicKey(
    "5F7UbQsPcJ7oMSygH9eoPhCgBxAmnZVkKuYaWt3i1K4s"
  );
  const solana = new web3.Connection(
    "https://mainnet.helius-rpc.com/?api-key=2de169df-d4aa-4f0b-91f6-9859db329839"
  );
  console.log(await solana.getAccountInfo(publicKey));
})();
