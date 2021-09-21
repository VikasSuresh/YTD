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
        $( "#downloads" ).load(window.location.href + " #downloads" );
    }
    else {
        URL.className += " " + "is-invalid";
    }
     
}  

async function download(id){
    const rawResponse = await fetch(`http://localhost:3000/${id}`, {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    });

    const row = document.getElementById(id);

    if(rawResponse.status === 403){
        row.className = "btn btn-warning"
    }

    if(rawResponse.status === 200){
        row.className = "btn btn-success"
        window.location.href = `http://localhost:3000/${id}`; 
    }
}
