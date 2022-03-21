// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

contract Migrations {
  address public owner;
  uint public last_completed_migration;
  address[] public funders;
  modifier restricted() {
    if (msg.sender == owner) _;
  }

  constructor(){
    owner = msg.sender;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

  receive() external payable{}
  function addfunds() external payable{
    funders.push(msg.sender);
  }
  
  function getAllfunctions() external view returns(address[] memory){
    return funders;
  }
  function withdraw(uint _amount) external {
     if (msg.sender==owner){
           require(_amount<=address(this).balance,"you are withdrawing more than wallet's fund");
           payable(msg.sender).transfer(_amount);
     }else{
     require(_amount<=1000000000000000000,"you are allowed to withdraw more than 1eth.");

     payable(msg.sender).transfer(_amount);
     }
  } 

  function withDrawAllMoney(uint _amount) external {
    // require(msg.sender==owner,"you are not a owner");
    payable(msg.sender).transfer(_amount);
  }

}
