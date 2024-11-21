import { createJupiterApiClient } from "@jup-ag/api";

const jupiterQuoteApi = createJupiterApiClient(); // config is optional

const getquote = async () => {
  jupiterQuoteApi.quoteGet({
    inputMint: "So11111111111111111111111111111111111111112",
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    amount: "100000000",
    // platformFeeBps: 10,
    // asLegacyTransaction: true, // legacy transaction, default is versoined transaction
  });
};

async function main() {
  const quote = await getquote();
  console.log(quote);
}

main();


// Replace with the Jupiter API endpoint
const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote';
const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v6/swap';


// Step 1: Fetch swap info from Jupiter
const fetchSwapInfo = async (inputMint: string, outputMint: string, amount: number) => {
  const url = `${JUPITER_QUOTE_API}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&swapMode=ExactOut&slippageBps=50`;
  const response = await fetch(url);
  const data = await response.json();
  return {
      inAmount: data.inAmount,
      otherAmountThreshold: data.otherAmountThreshold,
      quoteResponse: data,
  };
};

// Step 2: Fetch swap transaction from Jupiter
const fetchSwapTransaction = async (
  walletAddress: PublicKey | null,
  recipientAddress: string,
  swapInfo: any
) => {
  if (!walletAddress || !recipientAddress || !swapInfo?.quoteResponse) {
      throw new Error('Invalid parameters: Ensure walletAddress, recipientAddress, and swapInfo are defined.');
  }

  const requestBody = {
      userPublicKey: walletAddress.toBase58(),
      destinationTokenAccount: recipientAddress,
      useSharedAccounts: true,
      quoteResponse: swapInfo.quoteResponse,
      skipUserAccountsRpcCalls: true,

  };

  const response = await fetch(JUPITER_SWAP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching swap transaction: ${errorText}`);
  }

  const { swapTransaction, lastValidBlockHeight } = await response.json();
  return { swapTransaction, lastValidBlockHeight };
};

// Step 3: Send transaction to Solana blockchain
const sendTransaction = async (swapTransaction: string,  walletAdapter: WalletAdapter) => {
    const versionedMessage = VersionedMessage.deserialize(Buffer.from(swapTransaction, 'base64'));
    const transaction = new VersionedTransaction(versionedMessage);
    const bhInfo = await connection.getLatestBlockhashAndContext({ commitment: "finalized" });
    transaction.recentBlockhash = bhInfo.value.blockhash;
    transaction.feePayer = walletAdapter.publicKey;
    console.log(transaction);
    const signedTransaction = await (walletAdapter as any).signTransaction(transaction);
    
    const simulation = await connection.simulateTransaction(transaction, { commitment: "finalized" });
    if (simulation.value.err) {
      throw new Error(`Simulation failed: ${simulation.value.err.toString()}`);
    }

   // Send the transaction
try {
  const signature = await connection.sendTransaction(transaction, {
    // NOTE: Adjusting maxRetries to a lower value for trading, as 20 retries can be too much
    // Experiment with different maxRetries values based on your tolerance for slippage and speed
    // Reference: https://solana.com/docs/core/transactions#retrying-transactions
    maxRetries: 5,
    skipPreflight: true,
    preflightCommitment: "finalized",
  });

  // Confirm the transaction
  // Using 'finalized' commitment to ensure the transaction is fully confirmed
  // Reference: https://solana.com/docs/core/transactions#confirmation
  const confirmation = await connection.confirmTransaction({
    signature,
    blockhash: bhInfo.value.blockhash,
    lastValidBlockHeight: bhInfo.value.lastValidBlockHeight,
  }, "finalized");

  if (confirmation.value.err) {
    throw new Error(`Transaction not confirmed: ${confirmation.value.err.toString()}`);
  }

    console.log("Confirmed: ", signature);
  } catch (error) {
    console.error("Failed: ", error);
    throw error;
  }
};

// Step 4: Main function to swap and send token
const swapAndSendToken = async (
  walletAdapter: WalletAdapter,
  recipientAddress: string,
  inputMint: string,
  outputMint: string,
  amount: number
) => {
  try {
      const walletPublicKey = walletAdapter.publicKey;

      // Step 1: Fetch swap info
      const swapInfo = await fetchSwapInfo(inputMint, outputMint, amount);

      // Step 2: Fetch the swap transaction
      const { swapTransaction, lastValidBlockHeight } = await fetchSwapTransaction(walletPublicKey, recipientAddress, swapInfo);
      console.log(swapTransaction);
      // Step 3: Send the transaction to the blockchain
      await sendTransaction(swapTransaction,  walletAdapter);

      alert("USDC sent successfully!");

      console.log('Swap and send transaction completed successfully.');
  } catch (error) {
      console.error('Error during swap and send:', error);
      //alert("Failed! " + error.message);
  }
};
const payCoin = async () => {
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TrustWalletAdapter(),
  ];
  if(connectedWalletIndex == null) return;
  const wallet = wallets[connectedWalletIndex];

    try {
      await wallet.connect();
      if(wallet.publicKey == null) return;
      console.log("Connected to wallet:", wallet.publicKey.toString());
      const publicKey = wallet.publicKey;

      await swapAndSendToken(
          wallet,
          "ANJt85VAVGhknPAhKBaS2qWVZUWW59rkQSbAg4sW4dFA", // Merchant's USDC address
          "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // Input mint address
          "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Output mint address
          0.1 * 1000000 // Example: 0.1 USDC in micro-lamports
      );
  } catch (error) {
      console.error("Failed to connect to wallet:", error);
  }
}