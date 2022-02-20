const publicar = document.getElementById('publicar');

//Envio de los datos al servidor -----------------------------------------------------

publicar.onclick = async function() {

    const description = document.getElementById('description').value;
    //Imagen:
    const image = document.getElementById('file-upload');
    let r = (Math.random() + 1).toString(36).substring(2);

    let extension = image.files[0].name.split('.').pop();
    let fileName = r + '.' + extension;

    const formData = new FormData()
    formData.append('myFile', image.files[0], fileName);
    console.log(formData);

    if (description == '' || image == '') {
        alert('No pueden quedar campos vacíos!');
    } else {
        console.log(fileName);
        imageUpload(formData);
        postData(description, fileName);
        window.location.href = 'index.html';
    }

}

async function imageUpload(formData) {
    await fetch('/api/saveImage', {
        method: 'POST',
        headers: {
            'Accept': 'application/json'

        },
        body: formData
    });

}


async function postData(description, image) {

    const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'description': description,
            "image": image
        })

    });

    const data = await response.json();
    console.log(data);

}