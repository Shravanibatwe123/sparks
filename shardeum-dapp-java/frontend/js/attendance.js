const ATT_ADDR = "REPLACE_ATTENDANCE_ADDRESS";
const ABI = [ /* paste compiled Attendance ABI here or use backend to fetch */ ];

let provider, signer, contract;

document.getElementById("connectBtn").onclick = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(ATT_ADDR, ABI, signer);
    alert("Connected: " + await signer.getAddress());
};

document.getElementById("markBtn").onclick = async () => {
    if (!contract) return alert("Connect first");
    const tx = await contract.markAttendance();
    await tx.wait();
    alert("Marked. Tx: " + tx.hash);
};

document.getElementById("refreshBtn").onclick = async () => {
    const providerRead = provider || new ethers.providers.JsonRpcProvider("https://api-unstable.shardeum.org");
    const c = new ethers.Contract(ATT_ADDR, ABI, providerRead);
    const dayIndex = Math.floor(Date.now()/1000/86400);
    const list = await c.getAttendanceByDay(dayIndex);
    const ul = document.getElementById("todayList");
    ul.innerHTML = "";
    list.forEach(r => {
        const li = document.createElement("li");
        // r is tuple [address, timestamp]
        li.innerText = r[0] + " @ " + new Date(r[1].toNumber()*1000).toLocaleString();
        ul.appendChild(li);
    });
};
