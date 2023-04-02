if (typeof window.Livewire === 'undefined') {
    throw 'Livewire Turbolinks Plugin: window.Livewire is undefined. Make sure @livewireScripts is placed above this script include';
}

var firstTime = true;

function wireTurboAfterFirstVisit() {
    // We only want this handler to run AFTER the first load.
    if (firstTime) {
        firstTime = false;
        return;
    }

    window.Livewire.restart();

    window.Alpine && window.Alpine.flushAndStopDeferringMutations && window.Alpine.flushAndStopDeferringMutations();
}

function wireTurboBeforeCache() {
    document.querySelectorAll('[wire\\:id]').forEach(function(el) {
        const component = el.__livewire;
        const dataObject = {
            fingerprint: component.fingerprint,
            serverMemo: component.serverMemo,
            effects: component.effects,
        };
        el.setAttribute('wire:initial-data', JSON.stringify(dataObject));
    });

    window.Alpine && window.Alpine.deferMutations && window.Alpine.deferMutations()
}

document.addEventListener('page:load', wireTurboAfterFirstVisit);
document.addEventListener('page:before-cache', wireTurboBeforeCache);

Livewire.hook('beforePushState', (state) => {
    if (!state.turbolinks) {
        state.turbolinks = {};
    }
});

Livewire.hook('beforeReplaceState', (state) => {
    if (!state.turbolinks) {
        state.turbolinks = {};
    }
});
