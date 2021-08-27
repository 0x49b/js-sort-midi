

self.addEventListener('message', (e) => {
    const context = new AudioContext();
    const o = context.createOscillator();
    o.frequency.setTargetAtTime(parseInt(e), context.currentTime, 0);
    o.connect(context.destination);
    o.start(0);
})