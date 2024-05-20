document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const setupCamera = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 800, height: 400 },
        audio: false,
      })
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing the camera:", error);
      });
  };

  const detectObjects = async () => {
    const model = await cocoSsd.load();
    setInterval(async () => {
      ctx.drawImage(video, 0, 0, 800, 400);
      const predictions = await model.detect(video);

      predictions.forEach((prediction) => {
        const [x, y, width, height] = prediction.bbox;
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";
        ctx.stroke();
        ctx.font = "30px Arial";
        ctx.fillText(prediction.class, x, y - 5);
      });
    }, 100);
  };

  setupCamera();
  detectObjects();
});
