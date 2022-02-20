async function getData() {

    const response = await fetch('/api/files');
    const data = await response.json();
    console.log(data);

    //Mostramos los datos recibidos y los imprimimos en el documento:

    for (item of data.files) {

        const root = document.createElement('div');
        const card = document.createElement('div');
        const cardBody = document.createElement('div');
        const descripcion = document.createElement('h5');
        const fecha = document.createElement('small');
        const imagen = document.createElement('img');

        card.className = 'card mb-3';
        cardBody.className = 'card-body';
        imagen.className = 'img-fluid';
        descripcion.className = 'mt-2';

        descripcion.textContent = item.description;
        const dateString = new Date(item.date).toLocaleString();
        fecha.textContent = dateString;
        imagen.src = './images/' + item.image;

        cardBody.append(imagen, descripcion, fecha);
        card.append(cardBody);
        root.append(card);
        document.getElementById('portfolio').append(root);

    }
}

getData();