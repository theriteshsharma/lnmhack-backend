require('dotenv').config()
const  { Web3Storage, getFilesFromPath } =  require('web3.storage');
const token = process.env.WEB3_TOKEN;
const storage = new Web3Storage({ token })

const { ethers } = require("ethers");
const fileName = require('./build/contracts/fileman.json')


const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
const signer = new ethers.Wallet(process.env.POLY_WALLET_KEY, provider)
//const signer = provider.getSigner()

const address = process.env.ADDRESS;
const abi = fileName.abi;
const contract = new ethers.Contract(address,abi,provider);
const signedContract = contract.connect(signer);
provider.getBalance(process.env.WALLET).then(data => console.log(data))




// Server Starts Here
const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const path = require('path');
const { sign } = require('crypto');
const { rawListeners } = require('process');

const cors = require('cors');
const { resolve } = require('path');

const app = express()
const port = 80
app.use(fileUpload());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
app.use(cors()) 

app.get('/', (req, res) => {
  res.send('<h1>Dont Call me! I am Working<h1>')
})

app.post('/login', async (req,res)=>{
  console.log(req.body)
  const userName = req.body.userName;
  console.log(userName)
  const tx = await contract.getUser(userName);
  console.log(tx);
  if(tx)
  res.status(200).send({msg:"User Login Succesfully!"});
  else

    res.status(201).send({msg:"not found"});
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
            console.log(file)
            console.log(req.body)
            console.log(cid,req.body.userid,file.type,file.name)
            const tx = await signedContract.createDoc(cid,req.body.userid,file.name);
            res.status(200).send({msg: "Document Uploaded Sucessfull"})
        }
     })
})

function fetchdoc(ele){
  return new Promise((resolve,reject) => {
    contract.getDoc(ele).then(data => resolve({hash:data.hash,name:data.name,status:data.status,created_by:data.created_by, verified_by:data.verified_by}))
  }
  )
}

app.get('/alldocs', async (req,res)=>{
  var docs = [];
    const tx = await contract.getAllDocs();
    console.log(tx)
    if(tx.length > 0 ){
    
    tx.forEach((ele) =>{
      docs.push(fetchdoc(ele));
    })
    }
     
    Promise.all(docs).then(data =>{
      console.log(data)
  
      res.status(200).send(data)
    })
   
})

app.get('/alldocs/:id',async(req,res) =>{
    const tx  = await contract.getUser(req.params.id);
    let docs = [];
    if(tx.length > 0){
      console.log(tx)
      if(tx.length > 0 ){
      
      tx.docs.forEach((ele) =>{
        docs.push(fetchdoc(ele));
      })
      }
       
      Promise.all(docs).then(data =>{
        console.log(data)
    
        res.status(200).send(data)
      })
}})

app.patch('/verify/:id',async (req,res) => {

  console.log(req.body)
  console.log(req.params.id)
  const tx = await signedContract.verifyDoc(req.params.id,1,req.body.username);
  console.log(tx);
  res.status(200).send({msg:" Document Verfied"});
})
app.patch('/reject/:id',async (req,res) => {

  const tx = await signedContract.verifyDoc(req.params.id,0,req.body.username);
  console.log(tx);
  res.status(200).send({msg:" Document Rejected"});
})


app.listen(port,'172.22.24.193', () => {
  console.log(`Example app listening on port ${port}`)
})