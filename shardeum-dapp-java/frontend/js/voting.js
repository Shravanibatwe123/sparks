const VOTE_ADDR = "REPLACE_VOTING_ADDRESS";
const ABI = [ /* Voting ABI here */ ];
let provider, signer, voting;

document.getElementById("connectBtn").onclick = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    voting = new ethers.Contract(VOTE_ADDR, ABI, signer);
    alert("Connected: " + await signer.getAddress());
};

document.getElementById("createPoll").onclick = async () => {
    const title = document.getElementById("title").value;
    const opts = document.getElementById("options").value.split(",").map(s=>s.trim()).filter(s=>s);
    if (!title || opts.length<2) return alert("invalid");
    const start = Math.floor(Date.now()/1000);
    const end = start + 3600*24; // 1 day
    const tx = await voting.createPoll(title, opts, start, end, false);
    await tx.wait();
    alert("Poll created");
};
