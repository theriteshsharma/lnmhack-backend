const  { Web3Storage, getFilesFromPath } =  require('web3.storage');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc2NzdlYkQ3QWZFQzk1N0QwNjBDOWQ1RjA3QzA3QUExOUExYzU1RjMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzQ4OTI5NDM3MDcsIm5hbWUiOiJ0ZXN0In0.glU4rve8ousywCNTxWK9NwAwySM1uoSGu0X_5Y7pd_g';
const storage = new Web3Storage({ token })

const { ethers } = require("ethers");
const fileName = require('./build/contracts/fileman.json')


const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner()
const address = "0x9f1fb77a7a1b1f0e9fb208a7953ce8fe30ab37f6";
const abi = fileName.abi;
const contract = new ethers.Contract(address,abi,provider);
const signedContract = contract.connect(signer);


// Server Starts Here
const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const path = require('path');
const { sign } = require('crypto');
const { rawListeners } = require('process');
const app = express()
const port = 3000
app.use(fileUpload());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) 

app.get('/', (req, res) => {
  res.send('<h1>Dont Call me! I am Working<h1>')
})

app.post('/adduser', async (req,res)=>{
  const {username,role} = req.body;
  const tx = await signedContract.createUser(id,username,role,{gasLimit:500000});
  res.status(200).send({msg:"User Created Succesfully!"});
})

app.post('/upload', async (req,res) =>{
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
     const file = req.files.doc;
     file.mv(file.name, async function(err){
        if(err){

        }else{
            console.log(file.name)
            const pathFiles = await getFilesFromPath(path.join(__dirname,file.name));
            
            const cid = await storage.put(pathFiles)
            console.log('Content added with CID:', cid)

            const tx = await signedContract.createDoc(cid,req.body.userid);
            res.status(200).send({cid})
        }
     })
})

app.get('/alldocs', async (req,res)=>{
    
    const tx = await contract.getAllDocs();
    console.log(tx);
    res.status(200).send(tx);
})

app.get('/alldocs/:id',async(req,res) =>{
    const tx  = await contract.getUser(req.path.id);
    console.log(tx);
    res.status(200).send(tx);
})

app.patch('/verify/:id',async (req,res) => {
  const tx = await signedContract.getVerified(req.body.userid,req.path.id);
  const ux = await signedContract.verifyDoc(req.path.id,1);
  console.log(tx);
  res.status(200).send(tx);
})
app.patch('/reject/:id',async (req,res) => {
  const tx = await signedContract.getVerified(req.body.userid,req.path.id);
  const ux = await signedContract.verifyDoc(req.path.id,0);
  console.log(tx);
  res.status(200).send(tx);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})