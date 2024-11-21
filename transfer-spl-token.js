const {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
} = require("@solana/spl-token");
const {
  Connection,
  Keypair,
  ParsedAccountData,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} = require("@solana/web3.js");

const secret = [
  91, 233, 20, 118, 2, 189, 145, 174, 18, 149, 200, 108, 150, 23, 239, 66, 228,
  115, 37, 62, 39, 241, 101, 206, 20, 84, 26, 3, 81, 188, 20, 38, 15, 148, 78,
  127, 171, 251, 158, 165, 30, 42, 116, 123, 173, 43, 188, 116, 201, 109, 9,
  128, 188, 90, 66, 84, 126, 118, 8, 26, 53, 80, 138, 251,
];
const FROM_KEYPAIR = Keypair.fromSecretKey(new Uint8Array(secret));

const QUICKNODE_RPC = "https://example.solana-devnet.quiknode.pro/0123456/";
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);

const DESTINATION_WALLET = "DemoKMZWkk483hX4mUrcJoo3zVvsKhm8XXs28TuwZw9H";
const MINT_ADDRESS = "DoJuta7joTSuuoozqQtjtnASRYiVsT435gh4srh5LLGK"; //You must change this value!
const TRANSFER_AMOUNT = 1;

async function getNumberDecimals(mintAddress) {
  const info = await SOLANA_CONNECTION.getParsedAccountInfo(
    new PublicKey(mintAddress)
  );
  const result = info.value?.data.parsed.info.decimals;
  return result;
}

async function sendTokens() {
  console.log(
    `Sending ${TRANSFER_AMOUNT} tokens from ${FROM_KEYPAIR.publicKey.toString()} to ${DESTINATION_WALLET}.`
  );

  // Step 1
  console.log(`1 - Getting Source Token Account`);
  let sourceAccount = await getOrCreateAssociatedTokenAccount(
    SOLANA_CONNECTION,
    FROM_KEYPAIR,
    new PublicKey(MINT_ADDRESS),
    FROM_KEYPAIR.publicKey
  );
  console.log(`    Source Account: ${sourceAccount.address.toString()}`);

  // Step 2
  console.log(`2 - Getting Destination Token Account`);
  let destinationAccount = await getOrCreateAssociatedTokenAccount(
    SOLANA_CONNECTION,
    FROM_KEYPAIR,
    new PublicKey(MINT_ADDRESS),
    new PublicKey(DESTINATION_WALLET)
  );
  console.log(
    `    Destination Account: ${destinationAccount.address.toString()}`
  );

  // Step 3
  console.log(`3 - Fetching Number of Decimals for Mint: ${MINT_ADDRESS}`);
  const numberDecimals = await getNumberDecimals(MINT_ADDRESS);
  console.log(`    Number of Decimals: ${numberDecimals}`);

  // Step 4
  console.log(`4 - Creating and Sending Transaction`);
  const tx = new Transaction();
  tx.add(
    createTransferInstruction(
      sourceAccount.address,
      destinationAccount.address,
      FROM_KEYPAIR.publicKey,
      TRANSFER_AMOUNT * Math.pow(10, numberDecimals)
    )
  );

  const latestBlockHash = await SOLANA_CONNECTION.getLatestBlockhash(
    "confirmed"
  );
  tx.recentBlockhash = latestBlockHash.blockhash;
  const signature = await sendAndConfirmTransaction(SOLANA_CONNECTION, tx, [
    FROM_KEYPAIR,
  ]);
  console.log(
    "\x1b[32m", // Green Text
    `   Transaction Success!🎉`,
    `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
}

sendTokens();
