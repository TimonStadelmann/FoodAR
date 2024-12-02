export async function hasBrowserArCompatibility() {
    if (window.navigator.xr) {
        return await navigator.xr.isSessionSupported('immersive-ar');
    }
    return false;
}
