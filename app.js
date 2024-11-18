function download() {
    const exporter = new THREE.GLTFExporter();
    exporter.parse(
        scene,
        function (result) {
            saveArrayBuffer(result, "scene.glb");
        },
        function (error) {
            console.log("An error happened");
        },
        { binary: true }
    );
}

function saveString(text, filename) {
    save(new Blob([text], { type: "text/plain" }), filename);
}

function saveArrayBuffer(buffer, filename) {
    save(new Blob([buffer], { type: "application/octet-stream" }), filename);
}

const link = document.createElement("a");
link.style.display = "none";
document.body.appendChild(link); // Firefox workaround, see #6594

function save(blob, filename) {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    // URL.revokeObjectURL( url ); breaks Firefox...
}
