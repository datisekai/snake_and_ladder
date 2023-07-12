document.addEventListener("fullscreenchange", onFullscreenChange);
document.addEventListener("webkitfullscreenchange", onFullscreenChange);

function onFullscreenChange() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    const bootstrapScene = game.scene.getScene('bootstrap')
    bootstrapScene.exitFullScreen()

    const pauseScene = game.scene.getScene('pause')
    if(pauseScene.fullscreen){
      pauseScene.exitFullScreen()
    }

  }
}