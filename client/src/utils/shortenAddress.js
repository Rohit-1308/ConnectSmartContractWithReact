const shortenAddress =(addresss)=>{    
    if(addresss!==undefined){
        return addresss.slice(0,5)+"...."+addresss.slice(addresss.length -4)
    }
    else{
        return ''
    }
}

export default shortenAddress