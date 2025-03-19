// Global variable untuk menyimpan provider dan signer
let provider;
let signer;
let stakingContract;

// ABI dan alamat kontrak staking (gantikan dengan yang sesuai)
const stakingContractABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "calculateReward",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];
const stakingContractAddress = "alamat-kontrak-anda"; // Ganti dengan alamat kontrak staking kamu

// Fungsi untuk menghubungkan MetaMask
async function connectMetaMask() {
    if (window.ethereum) {
        provider = new ethers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        
        // Meminta akses akun MetaMask
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = await signer.getAddress();
            console.log('Akun MetaMask terhubung:', account);
            
            // Tampilkan bagian staking setelah berhasil terhubung
            document.getElementById('stakeSection').style.display = 'block';
            document.getElementById('connectButton').style.display = 'none';
        } catch (error) {
            console.log('Gagal menghubungkan ke MetaMask:', error);
        }
    } else {
        alert('MetaMask tidak ditemukan, silakan install MetaMask');
    }
}

// Fungsi untuk staking token
async function stakeTokens() {
    const amount = document.getElementById('amount').value;

    if (!amount || amount <= 0) {
        alert('Jumlah staking tidak valid!');
        return;
    }

    // Membuat kontrak staking
    stakingContract = new ethers.Contract(stakingContractAddress, stakingContractABI, signer);

    try {
        // Panggil fungsi stake() dari smart contract
        const tx = await stakingContract.stake(ethers.utils.parseUnits(amount, 18));
        await tx.wait(); // Tunggu transaksi selesai
        console.log('Staking berhasil!');
        document.getElementById('status').innerHTML = 'Staking berhasil!';
    } catch (error) {
        console.log('Staking gagal:', error);
        document.getElementById('status').innerHTML = 'Staking gagal. Coba lagi.';
    }
}

// Menambahkan event listener untuk tombol
document.getElementById('connectButton').onclick = connectMetaMask;
document.getElementById('stakeButton').onclick = stakeTokens;
