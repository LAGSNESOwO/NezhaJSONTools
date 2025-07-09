// Alert rules page script

document.addEventListener('DOMContentLoaded', function() {
    updateAlertRule();
});

function updateAlertRule() {
    const type = document.getElementById('alertType').value;
    const min = document.getElementById('alertMin').value;
    const max = document.getElementById('alertMax').value;
    const duration = document.getElementById('alertDuration').value;
    const cover = document.getElementById('alertCover').checked ? 1 : 0;
    const ignoreInput = document.getElementById('alertIgnore').value;
    const ignore = {};
    ignoreInput.split(',').forEach(id => {
        const t = id.trim();
        if (t) ignore[t] = true;
    });

    const obj = { type };
    if (min) obj.min = Number(min);
    if (max) obj.max = Number(max);
    obj.duration = Number(duration);
    obj.cover = cover;
    if (Object.keys(ignore).length) obj.ignore = ignore;

    const json = JSON.stringify([obj], null, 2);
    document.getElementById('alertJson').value = json;
}

function copyAlertCode(event) {
    event.stopPropagation();
    const textarea = document.getElementById('alertJson');
    textarea.select();
    document.execCommand('copy');
}
