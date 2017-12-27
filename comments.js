let estorage = browser.storage.local;

function highlight(lastdatetime) {
    const times = document.getElementsByTagName('time');
    // let lastdatetime = '2017-12-22T09:26:38+00:00';
    let maxdatetime = lastdatetime || '0';
    for (let elem of times) {
        const thisdatetime = elem.getAttribute('datetime');
        if (!thisdatetime) {
            continue;
        }
        if (thisdatetime <= lastdatetime) {
            continue;
        }
        if (lastdatetime) {
            let commentElem = elem;
            while (!commentElem.classList.contains('comment')) {
                commentElem = commentElem.parentNode;
            }
            commentElem.classList.add('new-comment');
        }
        if (maxdatetime < thisdatetime) {
            maxdatetime = elem.getAttribute('datetime');
        }
    }
    return maxdatetime;
}

function cleanUp(storedInfo) {
    const dateLimit = Date.now() - 1000 * 60 * 60 * 24 * parseInt(10, storedInfo.prefDays);
    if (Math.random() > 0.01) {
        // only once every 100
        return;
    }
    estorage.get().then(function (entries) {
        for (const [redditId, lastdatetime] of Object.entries(entries)) {
            const d = new Date(lastdatetime);
            if (d < dateLimit) {
                estorage.remove(redditId);
                console.debug('Removed', redditId);
            }
        }
    });
}

(function () {
    if (!document.body.classList.contains('comments-page')) {
        console.log('No comments-page');
        return;
    }
    if (document.body.classList.contains('moderator')) {
        // modertors have new comment feature from Reddit
        return;
    }
    document.body.classList.add('comment-addon');

    const redditId = document.location.pathname.match(/\/comments\/([^\/]+)/)[1];

    function retrived(storedInfo) {
        console.debug(redditId, storedInfo[redditId]);
        const maxdatetime = highlight(storedInfo[redditId]);
        const toBeSaved = {};
        toBeSaved[redditId] = maxdatetime;
        console.debug('Saving', toBeSaved);
        estorage.set(toBeSaved);
    }

    const waitSomeTime = new Promise(function (resolve, reject) {
        setTimeout(resolve, 10000, 'timeout');
    });

    Promise.all([estorage.get(redditId), waitSomeTime]).then(promised => retrived(promised[0]));
    Promise.all([estorage.get("prefDays"), waitSomeTime]).then(promised => cleanUp(promised[0]));
})();
