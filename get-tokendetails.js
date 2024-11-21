const web3 = require("@solana/web3.js");

const { Client, UtlConfig } = require("@solflare-wallet/utl-sdk");

async function main() {
  //   const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));

  // This is the USDC token mint address
  const mintAddress = new web3.PublicKey(
    "DAGSe6vgNDw3n3aHmd38AtePooK475FA3YnsuCN5pump"
  );

  try {
    const config = new UtlConfig({
      /**
       * 101 - mainnet, 102 - testnet, 103 - devnet
       */
      chainId: 101,
      /**
       * number of miliseconds to wait until falling back to CDN
       */
      timeout: 2000,
      /**
       * Solana web3 Connection
       */
      connection: new web3.Connection("https://api.mainnet-beta.solana.com/"),
      /**
       * Backend API url which is used to query tokens
       */
      apiUrl: "https://token-list-api.solana.cloud",
      /**
       * CDN hosted static token list json which is used in case backend is down
       */
      cdnUrl:
        "https://cdn.jsdelivr.net/gh/solflare-wallet/token-list/solana-tokenlist.json",
    });

    const utl = new Client();

    const token = await utl.fetchMint(mintAddress);
    console.log(token);
  } catch (err) {
    console.error("Error: ", err);
  }
}

main();
