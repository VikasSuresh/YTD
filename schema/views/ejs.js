async function add(){  

    const URL = document.getElementById('url');

    const rawResponse = await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({url:URL.value})
    });

    if(rawResponse.status === 200){
        URL.value = "";
        await get();
    }
    else {
        console.log(1)
        URL.className += " " + "is-invalid";
    }
     
}  

async function get(){
    $( "#downloads" ).load(window.location.href + " #downloads" );
}
