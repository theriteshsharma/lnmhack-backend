//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8; 
contract fileman{

//-------------MODELS-------------------                                  
    struct User{
        int id;
        string name;
        string role;
        address[] docs;
    }
    struct Doc{
        address hash;
        string status;
        int verified_by;
        int created_by;
    }
    
//----------------Data Structures----------
//-------------Users
    // User[]  allUsers;
    int[]  allUsersId;
    mapping(int => User)  users;
    //---------Docs
    // Doc[] allDocs;
    address[] allDocsHash;
    mapping(address => Doc)  docs;

//-----------------Functions---------------
//-------------Users
    function createUser(int _id, string calldata _role, string calldata _name) public {
        User memory newUser ;
        newUser.id = _id;
        newUser.role = _role;
        newUser.name = _name;
        users[_id] = newUser;
        allUsersId.push(_id);
        // allUsers.push(newUser);
    }
    function getUser(int _id) public view returns (User memory ){
       return users[_id]; 
    }
    function getAllUsers() view public returns (int[] memory){
        return(allUsersId);
    }
//------------Docs
    function createDoc(address  _hash, int  _id) public {
        Doc memory newDoc = Doc({hash: _hash, status: "Pending: Not Assigned", verified_by: 0, created_by: _id});
        docs[_hash] = newDoc;
        users[_id].docs.push(_hash);
        allDocsHash.push(_hash);
        // id_keys.push(_id);
    }
    function getDoc(address _hash) view public returns (Doc memory){
        return docs[_hash];
    }
    function getAllDocs() view public returns (address[] memory){
        return(allDocsHash);
    }
//------------Verification
    function getVerified(int _byId, address _hash) public {
        users[_byId].docs.push(_hash);
        docs[_hash].status = "Pending: Assigned";
        docs[_hash].verified_by = _byId;
    }
    function verifyDoc(address _hash, int _status) public{
        string memory s;
        if(_status == 0){
            s = "Declined";
        }
        else{
            s = "Accepted";
        }
        docs[_hash].status = s;
    }
    function getVerificationStatus(address _hash) view public returns(string memory, User memory){
        string memory _status = docs[_hash].status;
        User memory _verfiee = users[docs[_hash].verified_by];
        return(_status, _verfiee);
    }



}