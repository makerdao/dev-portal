// The docs.sh script works by cloning the dev-portal repo into the travis environment repo where 
// the smart contracts are located and then runs the Docusaurus command on the solidity contracts to 
// generate the documentation using natspec comments. It then pushes those newly generated docs 
// back to the dev-portal repo into a new branch.

