function getInfo() {
    let stopInputValue = document.querySelector('#stopId');

    let stopNameRef = document.querySelector('#stopName');
    let busesRef = document.querySelector('#buses');

    fetch(`https://judgetests.firebaseio.com/businfo/${stopInputValue.value}.json`)
        .then(x => x.json())
        .then(x => {
            console.log(x);

            if (stopInputValue.value.length > 0) {
                if (!x) {
                    stopNameRef.innerHTML = 'Error!';
                    return;
                }
    
                stopNameRef.innerHTML = x.name;
    
                busesRef.innerHTML = '';
                Object.entries(x.buses)
                    .forEach(([busId, time]) => {
                        let li = document.createElement('li');
                        li.innerHTML = `Bus ${busId} arrives in ${time} minutes`
                        busesRef.appendChild(li);
                    });
            }

        })
        .catch((e) => {
            stopNameRef.innerHTML = 'Error!';
            busesRef.innerHTML = '';
        });
}