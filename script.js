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
if (!amount || isNaN(amount) || amount <= 0) {
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

// Mengambil elemen canvas dan konteksnya
const c = document.getElementById('matrixCanvas');
const ctx = c.getContext('2d');

// Ukuran font untuk teks
const font_size = 16;

// Menyesuaikan ukuran canvas dengan ukuran jendela
c.height = window.innerHeight;
c.width = window.innerWidth;

// Karakter yang akan digunakan untuk efek matrix
const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%+-/~{[|`]}";
const drops = [];

// Menentukan jumlah kolom untuk efek matrix
for (let x = 0; x < c.width / font_size; x++) {
    drops[x] = 1; // Mulai setiap kolom dari atas
}

// Fungsi untuk menggambar efek matrix
function draw() {
    // Mengisi latar belakang dengan warna hitam semi-transparan
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);

    // Mengatur warna teks dan jenis font
    ctx.fillStyle = "#f4427d"; // Warna hijau untuk teks
    ctx.font = font_size + "px arial"; // Ukuran font

    // Loop untuk menggambar setiap kolom
    for (let i = 0; i < drops.length; i++) {
        // Memilih karakter acak untuk setiap kolom
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        
        // Menulis karakter ke canvas pada posisi x dan y
        ctx.fillText(text, i * font_size, drops[i] * font_size);

        // Menyetel posisi y kembali ke atas secara acak setelah melewati layar
        if (drops[i] * font_size > c.height && Math.random() > 0.975)
            drops[i] = 0;

        // Menaikkan posisi y untuk membuat karakter bergerak ke bawah
        drops[i]++;
    }

    // Memanggil ulang fungsi draw dengan requestAnimationFrame untuk animasi yang lebih halus
    requestAnimationFrame(draw);
}

// Memulai animasi
requestAnimationFrame(draw);

// Menangani perubahan ukuran jendela untuk menyesuaikan ukuran canvas
window.addEventListener('resize', function() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
});
