async function marknotif(element){
    const res = await fetch('/notifications/mark', {
        method: 'POST',
        headers: {
            "Content-type":"application/json"
          },
        body: JSON.stringify({
            notif_id: element.dataset.notifid
        })
    });
}

async function removenotif(element){
    const res = await fetch('/notifications/del', {
        method: 'POST',
        headers: {
            "Content-type":"application/json"
          },
        body: JSON.stringify({
            notif_id: element.dataset.notifid
        })
    });
}
