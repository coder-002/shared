
export function resetInactiveTimer() {
    const lastActiveTime = Date.now();
    localStorage.setItem('lastActiveTime', lastActiveTime.toString());
}

export function handleIdlePage(timeThresholdInSeconds: number, callback: () => void) {
    const lastActiveTime = parseInt(localStorage.getItem('lastActiveTime') || "", 10);
    if (!lastActiveTime) {
        resetInactiveTimer();
    } else {
        const timeDiff = Date.now() - lastActiveTime;
        if (timeDiff > timeThresholdInSeconds * 1000) {
            callback();
        }
    }
}

window.addEventListener('mousemove', resetInactiveTimer);
window.addEventListener('keydown', resetInactiveTimer);
window.addEventListener('scroll', resetInactiveTimer);

export function resetIdleTimer() {
    window.removeEventListener('mousemove', resetInactiveTimer);
    window.removeEventListener('keydown', resetInactiveTimer);
    window.removeEventListener('scroll', resetInactiveTimer);
}

// Check the inactive time every 5 seconds
setInterval(handleIdlePage, 5 * 1000);
