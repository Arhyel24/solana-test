const solanaWeb3 = require("@solana/web3.js");

const searchAddress = "5F7UbQsPcJ7oMSygH9eoPhCgBxAmnZVkKuYaWt3i1K4s";
const endpoint =
  "https://mainnet.helius-rpc.com/?api-key=2de169df-d4aa-4f0b-91f6-9859db329839";
const solanaConnection = new solanaWeb3.Connection(endpoint);

const getTransactions = async (address, numTx) => {
  const pubKey = new solanaWeb3.PublicKey(address);

  try {
    // Fetch transaction signatures
    let transactionsInx = await solanaConnection.getSignaturesForAddress(
      pubKey,
      {
        limit: numTx,
      }
    );

    const transactions = transactionsInx.map(
      (transaction) => transaction.signature
    );

    // Fetch transaction details
    const response = await fetch(
      "https://api.helius.xyz/v0/transactions?api-key=2de169df-d4aa-4f0b-91f6-9859db329839",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactions }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching transactions: ${response.statusText}`);
    }

    const data = await response.json();

    // Function to convert lamports to SOL
    const lamportsToSol = (lamports) => {
      return lamports / solanaWeb3.LAMPORTS_PER_SOL;
    };

    // Iterate through the response and log the required information
    data.forEach((tx) => {
      console.log(tx.description);
      console.log(tx.nativeTransfers);
      console.log(tx.events);

      /*const feeInSol = lamportsToSol(tx.fee);
      const date = new Date(tx.timestamp * 1000).toLocaleString(); // Convert timestamp to readable date

      // Log token transfers
      tx.tokenTransfers.forEach((tokenTransfer) => {
        console.log({
          mint: tokenTransfer.mint,
          tokenName: "Unknown Token",
          description: tx.description,
          date: date,
          fee: feeInSol,
          payer: tx.feePayer,
          receiver: tokenTransfer.toUserAccount,
          amount: tokenTransfer.tokenAmount,
          signature: tx.signature,
          status: tx.transactionError ? "Failed" : "Success",
        });
      });

      // Log NFT events
      if (tx.events && tx.events.nft) {
        const nftEvent = tx.events.nft;
        const nftMint = nftEvent.nfts[0].mint; // Assuming there's at least one NFT

        console.log({
          mint: nftMint,
          tokenName: "NFT", // You may need to fetch the NFT name from a registry
          description: nftEvent.description,
          date: date,
          fee: lamportsToSol(nftEvent.fee),
          payer: nftEvent.feePayer,
          receiver: nftEvent.buyer, // Assuming the buyer is the receiver
          amount: nftEvent.amount,
          signature: nftEvent.signature,
          status: nftEvent.transactionError ? "Failed" : "Success",
        });
      }

      // Log swap events

      if (tx.events && tx.events.swap) {
        const swapEvent = tx.events.swap;

        // Log native input

        console.log({
          description: "Swap Event", // Description for swap event

          mint: swapEvent.nativeInput.account, // Assuming this is the mint for the native input

          tokenName: "Native Token", // You may need to fetch the token name from a token registry

          date: date,

          fee: lamportsToSol(
            swapEvent.nativeFees.reduce((acc, fee) => acc + fee.amount, 0)
          ), // Total native fees in SOL

          payer: swapEvent.nativeInput.account,

          receiver: swapEvent.nativeOutput.account,

          amount: swapEvent.nativeInput.amount,

          signature: tx.signature,

          status: tx.transactionError ? "Failed" : "Success",
        });

        // Log token inputs

        swapEvent.tokenInputs.forEach((tokenInput) => {
          console.log({
            description: "Swap Token Input", // Description for token input

            mint: tokenInput.mint,

            tokenName: "Unknown Token", // You may need to fetch the token name from a token registry

            date: date,

            fee: lamportsToSol(
              swapEvent.tokenFees.reduce((acc, fee) => acc + fee.amount, 0)
            ), // Total token fees in SOL

            payer: tokenInput.account,

            receiver: swapEvent.nativeOutput.account,

            amount: tokenInput.amount,

            signature: tx.signature,

            status: tx.transactionError ? "Failed" : "Success",
          });
        });

        // Log token outputs

        swapEvent.tokenOutputs.forEach((tokenOutput) => {
          console.log({
            description: "Swap Token Output", // Description for token output

            mint: tokenOutput.mint,

            tokenName: "Unknown Token", // You may need to fetch the token name from a token registry

            date: date,

            fee: lamportsToSol(
              swapEvent.tokenFees.reduce((acc, fee) => acc + fee.amount, 0)
            ), // Total token fees in SOL

            payer: swapEvent.nativeInput.account,

            receiver: tokenOutput.account,

            amount: tokenOutput.amount,

            signature: tx.signature,

            status: tx.transactionError ? "Failed" : "Success",
          });
        });
      }*/
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

// Call the function with the specified address and number of transactions to retrieve
getTransactions(searchAddress, 3);
