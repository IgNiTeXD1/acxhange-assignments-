function outer(){
    let c=0;
    return function test(){
        c++;
        console.log(c);
    }
}


