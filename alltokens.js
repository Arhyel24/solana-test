const { Connection, PublicKey } = require("@solana/web3.js");
const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");

const rpcEndpoint =
  "https://mainnet.helius-rpc.com/?api-key=2de169df-d4aa-4f0b-91f6-9859db329839"; // Replace with your RPC endpoint
const solanaConnection = new Connection(rpcEndpoint);

const walletToQuery = "5F7UbQsPcJ7oMSygH9eoPhCgBxAmnZVkKuYaWt3i1K4s"; // Example: vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg

async function getTokenAccounts(wallet, solanaConnection) {
  const filters = [
    {
      dataSize: 165, // Size of account (bytes)
    },
    {
      memcmp: {
        offset: 32, // Location of our query in the account (bytes)
        bytes: wallet, // Our search criteria, a base58 encoded string
      },
    },
  ];

  const accounts = await solanaConnection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID,
    { filters: filters }
  );

  console.log(accounts);

  console.log(
    `Found ${accounts.length} token account(s) for wallet ${wallet}.`
  );
  accounts.forEach((account, i) => {
    // Parse the account data
    const parsedAccountInfo = account.account.data;
    const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
    const tokenBalance =
      parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

    // Log results
    console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
    console.log(`--Token Mint: ${mintAddress}`);
    console.log(`--Token Balance: ${tokenBalance}`);
  });
}

getTokenAccounts(walletToQuery, solanaConnection);
