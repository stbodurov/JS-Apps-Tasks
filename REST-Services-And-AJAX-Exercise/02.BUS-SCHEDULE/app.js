function solve() {
    let currentStop = 'depot';
    let nextStop;
   
    function depart() {
      let stops = `https://judgetests.firebaseio.com/schedule/${currentStop}.json`;
   
      let info = document.querySelector('#info');
      
      fetch(stops)
        .then(r => r.json())
        .then(d => {
          
          currentStop = d.name;
          nextStop = d.next;
   
          document.getElementById('depart').disabled = true;
          document.getElementById('arrive').disabled = false;
   
          info.innerHTML = `Next stop ${currentStop}`;
        });
    }
   
    function arrive() {
      document.getElementById('depart').disabled = false;
      document.getElementById('arrive').disabled = true;
   
      info.innerHTML = `Arriving at ${currentStop}`;
      currentStop = nextStop;
    }
   
    return {
      depart,
      arrive
    };
  }

let result = solve();