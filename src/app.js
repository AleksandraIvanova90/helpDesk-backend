const xhr = new XMLHttpRequest();

xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
        try {
            const data = JSON.parse(xhr.responseText);
        } catch (e) {
            console.error(e);
        }
    }
});

xhr.open('GET', 'http//localhost:7070');

xhr.send();
