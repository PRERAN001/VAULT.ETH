// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;
contract Upload{
    struct Access{
        address user;
        bool access;
    }
    mapping(address=>string[])values;
    mapping(address=>mapping(address=>bool)) ownership;
    mapping(address=>mapping(address=>bool)) previousdata;
    mapping(address=>Access[]) accesslist;
    function add(address __user,string memory url) external {
        values[__user].push(url);
    }
    function give_access(address usr) external{
        ownership[msg.sender][usr]=true;
        if(previousdata[msg.sender][usr]){
            for(uint i=0;i<accesslist[msg.sender].length;i++){
            if(accesslist[msg.sender][i].user==usr){
                accesslist[msg.sender][i].access=true;
            }
            }
        }
        else{
            accesslist[msg.sender].push(Access(usr,true));
            previousdata[msg.sender][usr]=true;
        }
    }
        
    
    function remove_Access(address usr) external{
        ownership[msg.sender][usr]=false;
        for(uint i=0;i<accesslist[msg.sender].length;i++){
            if(accesslist[msg.sender][i].user==usr){
                accesslist[msg.sender][i].access=false;

            }
        }
        accesslist[msg.sender].push(Access(usr,true));
    }
    function display(address usr) external view returns(string[] memory){
        require(usr==msg.sender || ownership[usr][msg.sender], "you dont have access lol :)");
        return values[usr];
    }
    function share_access() public view returns (Access[] memory){
        return accesslist[msg.sender];
    }
}