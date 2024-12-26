async function marknotif(element){
    try {
        const res = await fetch('/notifications/mark', {
            method: 'POST',
            headers: {
                "Content-type":"application/json"
              },
            body: JSON.stringify({
                notif_id: element.dataset.notifid
            })
        });
        if (res.status == 200){
            location.reload()
        }
    } catch (error) {
        
    }
    
}

async function removenotif(element){
    try {
        const res = await fetch('/notifications/del', {
            method: 'POST',
            headers: {
                "Content-type":"application/json"
              },
            body: JSON.stringify({
                notif_id: element.dataset.notifid
            })
        });
        if (res.status == 200){
            location.reload()
        }
    } catch (error) {
        
    }
   
}
