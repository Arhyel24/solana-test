// // import {
// //   Transaction,
// //   VersionedTransaction,
// //   sendAndConfirmTransaction,
// // } from "@solana/web3.js";
// // import { NATIVE_MINT } from "@solana/spl-token";
// // import { connection, owner, fetchTokenAccountData } from "../config";
// import { API_URLS } from "@raydium-io/raydium-sdk-v2";
// import { NATIVE_MINT } from "@solana/spl-token";

// const txVersion = "V0";

// const inputMint = "DAGSe6vgNDw3n3aHmd38AtePooK475FA3YnsuCN5pump";
// const outputMint = "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R";
// const amount = 23;
// const slippage = 0.5;
// const api = `${
//   API_URLS.SWAP_HOST
// }/compute/swap-base-in?inputMint=${NATIVE_MINT.toBase58()}&outputMint=${outputMint}&amount=${amount}&slippageBps=${
//   slippage * 100
// }&txVersion=${txVersion}`;

// // Replace with the Jupiter API endpoint
// const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote";
// const JUPITER_SWAP_API = "https://quote-api.jup.ag/v6/swap";

// // Step 1: Fetch swap info from Jupiter
// const fetchSwapInfo = async (inputMint, outputMint, amount) => {
//   const url = `${JUPITER_QUOTE_API}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&swapMode=ExactOut&slippageBps=50`;
//   const response = await fetch(url);
//   const data = await response.json();
//   return {
//     inAmount: data.inAmount,
//     otherAmountThreshold: data.otherAmountThreshold,
//     quoteResponse: data,
//   };
// };

// const main = async () => {
//   const data = await fetchSwapInfo(
//     "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
//     "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
//     0.1 * 1000000
//   );

//   console.log(data);
// };

// main();

// // // Step 2: Fetch swap transaction from Jupiter
// // const fetchSwapTransaction = async (
// //   walletAddress,
// //   recipientAddress,
// //   swapInfo
// // ) => {
// //   if (!walletAddress || !recipientAddress || !swapInfo?.quoteResponse) {
// //     throw new Error(
// //       "Invalid parameters: Ensure walletAddress, recipientAddress, and swapInfo are defined."
// //     );
// //   }

// //   const requestBody = {
// //     userPublicKey: walletAddress.toBase58(),
// //     destinationTokenAccount: recipientAddress,
// //     useSharedAccounts: true,
// //     quoteResponse: swapInfo.quoteResponse,
// //     skipUserAccountsRpcCalls: true,
// //   };

// //   const response = await fetch(JUPITER_SWAP_API, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify(requestBody),
// //   });

// //   if (!response.ok) {
// //     const errorText = await response.text();
// //     throw new Error(`Error fetching swap transaction: ${errorText}`);
// //   }

// //   const { swapTransaction, lastValidBlockHeight } = await response.json();
// //   return { swapTransaction, lastValidBlockHeight };
// // };

// // // Step 3: Send transaction to Solana blockchain
// // const sendTransaction = async (swapTransaction, walletAdapter) => {
// //   const versionedMessage = VersionedMessage.deserialize(
// //     Buffer.from(swapTransaction, "base64")
// //   );
// //   const transaction = new VersionedTransaction(versionedMessage);
// //   const bhInfo = await connection.getLatestBlockhashAndContext({
// //     commitment: "finalized",
// //   });
// //   transaction.recentBlockhash = bhInfo.value.blockhash;
// //   transaction.feePayer = walletAdapter.publicKey;
// //   console.log(transaction);
// //   const signedTransaction = await walletAdapter.signTransaction(transaction);

// //   const simulation = await connection.simulateTransaction(transaction, {
// //     commitment: "finalized",
// //   });
// //   if (simulation.value.err) {
// //     throw new Error(`Simulation failed: ${simulation.value.err.toString()}`);
// //   }

// //   // Send the transaction
// //   try {
// //     const signature = await connection.sendTransaction(transaction, {
// //       // NOTE: Adjusting maxRetries to a lower value for trading, as 20 retries can be too much
// //       // Experiment with different maxRetries values based on your tolerance for slippage and speed
// //       // Reference: https://solana.com/docs/core/transactions#retrying-transactions
// //       maxRetries: 5,
// //       skipPreflight: true,
// //       preflightCommitment: "finalized",
// //     });

// //     // Confirm the transaction
// //     // Using 'finalized' commitment to ensure the transaction is fully confirmed
// //     // Reference: https://solana.com/docs/core/transactions#confirmation
// //     const confirmation = await connection.confirmTransaction(
// //       {
// //         signature,
// //         blockhash: bhInfo.value.blockhash,
// //         lastValidBlockHeight: bhInfo.value.lastValidBlockHeight,
// //       },
// //       "finalized"
// //     );

// //     if (confirmation.value.err) {
// //       throw new Error(
// //         `Transaction not confirmed: ${confirmation.value.err.toString()}`
// //       );
// //     }

// //     console.log("Confirmed: ", signature);
// //   } catch (error) {
// //     console.error("Failed: ", error);
// //     throw error;
// //   }
// // };

// // // Step 4: Main function to swap and send token
// // const swapAndSendToken = async (
// //   walletAdapter,
// //   recipientAddress,
// //   inputMint,
// //   outputMint,
// //   amount
// // ) => {
// //   try {
// //     const walletPublicKey = walletAdapter.publicKey;

// //     // Step 1: Fetch swap info
// //     const swapInfo = await fetchSwapInfo(inputMint, outputMint, amount);

// //     // Step 2: Fetch the swap transaction
// //     const { swapTransaction, lastValidBlockHeight } =
// //       await fetchSwapTransaction(walletPublicKey, recipientAddress, swapInfo);
// //     console.log(swapTransaction);
// //     // Step 3: Send the transaction to the blockchain
// //     await sendTransaction(swapTransaction, walletAdapter);

// //     alert("USDC sent successfully!");

// //     console.log("Swap and send transaction completed successfully.");
// //   } catch (error) {
// //     console.error("Error during swap and send:", error);
// //     //alert("Failed! " + error.message);
// //   }
// // };
// // const payCoin = async () => {
// //   const wallets = [
// //     new PhantomWalletAdapter(),
// //     new SolflareWalletAdapter(),
// //     new TrustWalletAdapter(),
// //   ];
// //   if (connectedWalletIndex == null) return;
// //   const wallet = wallets[connectedWalletIndex];

// //   try {
// //     await wallet.connect();
// //     if (wallet.publicKey == null) return;
// //     console.log("Connected to wallet:", wallet.publicKey.toString());
// //     const publicKey = wallet.publicKey;

// //     await swapAndSendToken(
// //       wallet,
// //       "ANJt85VAVGhknPAhKBaS2qWVZUWW59rkQSbAg4sW4dFA", // Merchant's USDC address
// //       "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // Input mint address
// //       "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Output mint address
// //       0.1 * 1000000 // Example: 0.1 USDC in micro-lamports
// //     );
// //   } catch (error) {
// //     console.error("Failed to connect to wallet:", error);
// //   }
// // };

import {
  QuoteGetRequest,
  QuoteResponse,
  SwapResponse,
  createJupiterApiClient,
} from "../src/index";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
// import { Wallet } from "@project-serum/anchor";
// import bs58 from "bs58";
// import { transactionSenderAndConfirmationWaiter } from "./utils/transactionSender";
// import { getSignature } from "./utils/getSignature";

// Make sure that you are using your own RPC endpoint.
const connection = new Connection(
  "https://neat-hidden-sanctuary.solana-mainnet.discover.quiknode.pro/2af5315d336f9ae920028bbb90a73b724dc1bbed/"
);
const jupiterQuoteApi = createJupiterApiClient();

async function getQuote() {
  // basic params
  const params = {
    inputMint: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
    outputMint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    amount: 35281,
    slippageBps: 50,
    onlyDirectRoutes: false,
    asLegacyTransaction: false,
  };

  // auto slippage w/ minimizeSlippage params
  // const params = {
  //   inputMint: "So11111111111111111111111111111111111111112",
  //   outputMint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", // $WIF
  //   amount: 100000000, // 0.1 SOL
  //   autoSlippage: true,
  //   autoSlippageCollisionUsdValue: 1_000,
  //   maxAutoSlippageBps: 1000, // 10%
  //   minimizeSlippage: true,
  //   onlyDirectRoutes: false,
  //   asLegacyTransaction: false,
  // };

  // get quote
  const quote = await jupiterQuoteApi.quoteGet(params);

  if (!quote) {
    throw new Error("unable to quote");
  }
  return quote;
}

function main() {
  const qoute = getQuote();
  console.log(qoute);
}

main();
