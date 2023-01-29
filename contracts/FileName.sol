//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8; 
contract fileman{

//-------------MODELS-------------------                                  
    struct User{
        string name;
        string role;
        string[] docs;
    }
    struct Doc{
        string hash;
        string status;
        string name;
   
        string verified_by;
        string created_by;
    }
    
//----------------Data Structures----------
//-------------Users
    // User[]  allUsers;
    string[]  allUsersId;
    mapping(string => User)  users;
    //---------Docs
    // Doc[] allDocs;
    string[] allDocsHash;
    mapping(string => Doc)  docs;

//-----------------Functions---------------
//-------------Users
    function createUser(string calldata _name,  string calldata _role) public {
        User memory newUser ;
        newUser.role = _role;
        newUser.name = _name;
        users[_name] = newUser;
        allUsersId.push(_name);
        // allUsers.push(newUser);
    }

    //getUser
    function getUser(string memory _name) public view returns (User memory ){
       return users[_name]; 
    }
    
//------------Docs
    function createDoc(string memory  _hash, string memory  _id, string memory _name) public {
        Doc memory newDoc = Doc({hash: _hash, status: "Pending: Not Assigned", verified_by: '', created_by: _id,name:_name});
        docs[_hash] = newDoc;
        users[_id].docs.push(_hash);
        allDocsHash.push(_hash);
        // id_keys.push(_id);
    }
    function getDoc(string memory _hash) view public returns (Doc memory){
        return docs[_hash];
    }
    function getAllDocs() view public returns (string[] memory){
        return(allDocsHash);
    }
//------------Verification
   
    function verifyDoc(string memory _hash, int _status, string memory  _vby) public{
        string memory s;
        if(_status == 0){
            s = "Declined";
        }
        else{
            s = "Accepted";
        }
        docs[_hash].status = s;
        docs[_hash].verified_by = _vby;
    }
    function getVerificationStatus(string memory _hash) view public returns(string memory, User memory){
        string memory _status = docs[_hash].status;
        User memory _verfiee = users[docs[_hash].verified_by];
        return(_status, _verfiee);
    }



}