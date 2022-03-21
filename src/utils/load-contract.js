import contract from "@truffle/contract"
// var contract=require("@truffle/contract")

async function loadcontract(name,Provider){
        const res=await fetch(`/contracts/${name}.json`)
    const Artifact=await res.json()
   
    // return {
    //     contract:contract(Artifact)
    // }
     const _contract=contract(Artifact)
    let deployedcontract=null
    try{
        _contract.setProvider(Provider)
    deployedcontract=await _contract.deployed()
}catch(error){
    console.error(error,"you are connected to the wrong network")
}
return deployedcontract
}


export default loadcontract

