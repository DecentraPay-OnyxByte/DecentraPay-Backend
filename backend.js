
const ethers = require('ethers');
const express = require('express')
const infuraProjectId = 'decentrapay';
const sendToArduino = require('./sendToArduino');

const app = express()

app.use(express.json());

const ethereumRpcUrl = `https://mainnet.infura.io/v3/${infuraProjectId}`;

const adminAddress = '0x164625bFBC307879a13DdFeFE7CE0082899FF7C5';

const privateKey = 'your_private_key_here';
const provider = new ethers.providers.JsonRpcProvider(ethereumRpcUrl);


const wallet = new ethers.Wallet(privateKey, provider);


async function listenForPayments() {
    console.log('Listening for incoming payments...');

    provider.on('pending', async (txHash) => {
        const transaction = await provider.getTransaction(txHash);
        
        if (transaction && transaction.to && transaction.to.toLowerCase() === adminAddress.toLowerCase()) {
            console.log('Incoming transaction:', transaction);
            
            
            if (transaction.value.gt(0)) {
                const senderAddress = transaction.from;

                const amountInEther = ethers.utils.formatEther(transaction.value);
                const gasPrice = await provider.getGasPrice();
                const gasLimit = ethers.BigNumber.from(21000); 
                const gasCost = gasPrice.mul(gasLimit);

                const requiredAmountInEther = '10'; 
                if (amountInEther === requiredAmountInEther) {
                    console.log('Transaction received and confirmed');
                    sendToArduino(amount, adminName);
                } else {
                    console.log('Incorrect amount received');
                }
            } else {
                console.log('Invalid transaction amount');
            }
        }
    });
}


async function sendTransaction(toAddress, amount) {
    try {
        
        const tx = {
            to: toAddress,
            value: ethers.utils.parseEther(amount),
        };

        const signedTx = await wallet.signTransaction(tx);

        const txResponse = await provider.sendTransaction(signedTx);
        console.log('Transaction sent:', txResponse.hash);

        return txResponse.hash;
    } catch (error) {
        console.error('Error sending transaction:', error.message);
        throw error;
    }
}

listenForPayments();


app.post('/send-transaction', async (req, res) => {
    try {
        const { toAddress, amount } = req.body;

        const transactionHash = await sendTransaction(toAddress, amount);

        res.json({ transactionHash });
    } catch (error) {
        console.error('Error processing transaction:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function sendTransaction(toAddress, amount) {
    const tx = {
        to: toAddress,
        value: ethers.utils.parseEther(amount),
    };

    const signedTx = await wallet.signTransaction(tx);
    const txResponse = await provider.sendTransaction(signedTx);
    console.log('Transaction sent:', txResponse.hash);
    return txResponse.hash;
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

